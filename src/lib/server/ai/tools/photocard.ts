import { generateObject, tool } from "ai";
import z from "zod";
import { gemini } from "$lib/server/ai/providers/gemini";
import photocardSystemInstructions from "$lib/server/ai/systemInstructions/photocard.md?raw"
import photocardEditSystemInstructions from "$lib/server/ai/systemInstructions/photocard-edit.md?raw"
import nodeHtmlToImage from "node-html-to-image"
import fs from 'node:fs';
import path from 'node:path';
import { db } from "$lib/server/db";
import { photocard as photocardTable } from "$lib/server/db/schema";
import { BETTER_AUTH_URL, PUPPETEER_EXEC_PATH } from "$env/static/private";
import { eq, desc } from "drizzle-orm";
import type { User } from "better-auth";

export const getRandomId = () => {
    return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(6))))
        .replace(/[+/=]/g, '');
}

export const getPhotocardTools = async (user: User) => {
    const createPhotocard = tool({
        description: "Generate a new photocard for social media posts.",
        inputSchema: z.object({
            prompt: z.string().describe("Detailed prompt including organization info (logo URL, design instructions, fonts, colors)."),
        }),
        execute: async ({ prompt }) => {
            const { object } = await generateObject({
                model: gemini('gemini-2.5-flash'),
                schema: z.object({
                    html: z.string(),
                    height: z.number(),
                    width: z.number()
                }),
                system: photocardSystemInstructions,
                prompt,
            });


            const filename = `${getRandomId()}.png`
            const uploadDir = path.join(process.cwd(), 'images', 'photocards');
            const filePath = path.join(uploadDir, filename);

            await fs.promises.mkdir(uploadDir, { recursive: true });

            await nodeHtmlToImage({
                output: filePath,
                puppeteerArgs: {
                    executablePath: PUPPETEER_EXEC_PATH
                },
                html: object.html,
            })

            const [photocard] = await db.insert(photocardTable).values({
                html: object.html,
                url: `${BETTER_AUTH_URL}/api/files/photocards/${filename}`,
                height: object.height,
                width: object.width,
                userId: user.id
            }).returning()

            return {
                photocardUrl: `${BETTER_AUTH_URL}/api/files/photocards/${filename}`,
                photocardId: photocard.id
            }
        }
    })

    const getLast5Photocards = tool({
        description: "Retrieve the 5 most recent photocards created by the user.",
        inputSchema: z.object(),
        execute: async () => {
            const last5Photocards = await db.select({
                photocardUrl: photocardTable.url,
                photocardId: photocardTable.id
            }).from(photocardTable).where(eq(photocardTable.userId, user.id)).orderBy(desc(photocardTable.createdAt)).limit(5)
            return last5Photocards
        }
    })
    

    return { createPhotocard, getLast5Photocards}
}
