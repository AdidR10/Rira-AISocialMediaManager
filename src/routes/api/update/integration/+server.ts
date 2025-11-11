import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { integration, organization } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';

export const PATCH = async ({ request }) => {
    const session = await auth.api.getSession({
        headers: request.headers
    });

    if (!session?.user?.id) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.json();

        // Get the user's organization
        const [userOrg] = await db
            .select()
            .from(organization)
            .where(eq(organization.userId, session.user.id))
            .limit(1);

        if (!userOrg) {
            return json({ error: 'Organization not found' }, { status: 404 });
        }

        // Check if integration exists
        const [existingIntegration] = await db
            .select()
            .from(integration)
            .where(eq(integration.organizationId, userOrg.id))
            .limit(1);

        if (existingIntegration) {
            // Update existing integration
            await db
                .update(integration)
                .set({
                    facebookPageId: data.facebookPageId,
                    facebookAPIKey: data.facebookAPIKey,
                    updatedAt: new Date().toISOString()
                })
                .where(eq(integration.organizationId, userOrg.id));
        } else {
            // Create new integration
            await db.insert(integration).values({
                organizationId: userOrg.id,
                facebookPageId: data.facebookPageId,
                facebookAPIKey: data.facebookAPIKey
            });
        }

        return json({ success: true });
    } catch (error) {
        console.error('Error updating integration:', error);
        return json({ error: 'Failed to update integration' }, { status: 500 });
    }
};