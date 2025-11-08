import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "$lib/server/db";
import { integration, organization } from "$lib/server/db/schema";
import { createAuthMiddleware } from "better-auth/api";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),
    emailAndPassword: {
        enabled: true,
    },
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path.startsWith("/sign-up")) {
                const newSession = ctx.context.newSession;
                if (newSession) {
                    const user = newSession.user
                    const [newOrganization] = await db.insert(organization).values({
                        userId: user.id,
                        name: `${user.name}'s Organization`,
                        tagline: "Building something amazing",
                        description: "This is a sample organization created during registration. Update it with your own information!",
                        logo: null,
                        primaryColor: "#3b82f6",
                        primaryFont: "Space Grotesk",
                        secondaryFont: "Inter",
                        designInstructions: "Clean and modern design with a focus on usability",
                    }).returning();

                    await db.insert(integration).values({
                        organizationId: newOrganization.id,
                        facebookAPIKey: null,
                        facebookPageId: null,
                    })
                }
            }
        }),
    },
});
