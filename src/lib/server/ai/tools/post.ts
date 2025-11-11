import { tool } from "ai";
import z from "zod";
import { db } from "$lib/server/db";
import { post as postTable, organization as organizationTable, schedule as scheduleTable, photocard as photocardTable } from "$lib/server/db/schema";
import { eq, desc } from "drizzle-orm";
import type { User } from "better-auth";

export const getRandomId = () => {
    return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(6))))
        .replace(/[+/=]/g, '');
}

export const getPostTools = async (user: User) => {
    const [organization] = await db.select({ id: organizationTable.id }).from(organizationTable).where(eq(organizationTable.userId, user.id)).limit(1)

    const createPost = tool({
        description: "Save a new post with finalized caption and photocard.",
        inputSchema: z.object({
            caption: z.string().describe('Finalized post caption.'),
            photocardId: z.string().describe('Selected photocard ID.')
        }),
        execute: async ({ caption, photocardId }) => {
            await db.insert(postTable).values({
                organizationId: organization.id,
                photocardId,
                caption
            })
        }
    })

    const editPost = tool({
        description: "Update an existing post's caption or photocard.",
        inputSchema: z.object({
            caption: z.string().optional().describe('New caption (optional).'),
            photocardId: z.string().optional().describe('New photocard ID (optional).'),
            postId: z.string().describe('Post ID to edit.')
        }),
        execute: async ({ caption, photocardId, postId }) => {
            const updates: Record<string, unknown> = {};

            if (caption !== undefined) updates.caption = caption;
            if (photocardId !== undefined) updates.photocardId = photocardId;

            await db.update(postTable).set(updates).where(eq(postTable.id, postId))
        }
    })

    const schedulePost = tool({
        description: "Schedule or reschedule a post for future publishing.",
        inputSchema: z.object({
            postId: z.string().describe('Post ID to schedule.'),
            scheduleTime: z.string().describe('ISO 8601 timestamp for scheduling.')
        }),
        execute: async ({ postId, scheduleTime }) => {
            const timestamp = Math.floor(new Date(scheduleTime).getTime() / 1000);

            const [schedule] = await db.insert(scheduleTable).values({
                timestamp: timestamp.toString(),
            }).returning()

            try {
                await db.update(postTable).set({
                    scheduleId: schedule.id
                }).where(eq(postTable.id, postId))
            } catch (error) {
                console.error(error);
                return { success: false }
            }

            return { success: true }
        }
    })

    const unschedulePost = tool({
        description: "Remove scheduling from a post.",
        inputSchema: z.object({
            postId: z.string().describe('Post ID to unschedule.')
        }),
        execute: async ({ postId }) => {
            try {
                await db.update(postTable).set({
                    scheduleId: null
                }).where(eq(postTable.id, postId))
            } catch (error) {
                console.error(error);
                return { success: false }
            }

            return { success: true }
        }
    })

    const getLast10Posts = tool({
        description: "Retrieve the 10 most recently updated posts with their details.",
        inputSchema: z.object(),
        execute: async () => {
            const posts = await db
                .select({
                    postId: postTable.id,
                    caption: postTable.caption,
                    photocard: {
                        id: photocardTable.id,
                        url: photocardTable.url,
                    },
                    schedule: {
                        timestamp: scheduleTable.timestamp,
                    },
                })
                .from(postTable)
                .leftJoin(photocardTable, eq(postTable.photocardId, photocardTable.id))
                .leftJoin(scheduleTable, eq(postTable.scheduleId, scheduleTable.id))
                .where(eq(postTable.organizationId, organization.id))
                .orderBy(desc(postTable.updatedAt))
                .limit(10);

            const postsWithHumanizedTime = posts.map((post) => {
                if (post.schedule) {
                    const timestamp = Number(post.schedule.timestamp) * 1000;
                    const date = new Date(timestamp);
                    const humanizedTime = date.toLocaleString("en-US", {
                        timeZone: "Asia/Dhaka",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    });


                    const postWithHumanizedTime = { ...posts, schedule: humanizedTime }

                    return postWithHumanizedTime
                }

                return post
            })

            return postsWithHumanizedTime
        }
    })

    return { createPost, editPost, schedulePost, unschedulePost, getLast10Posts }
}
