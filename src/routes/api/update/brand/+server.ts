import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { organization } from '$lib/server/db/schema';
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

        await db
            .update(organization)
            .set({
                ...data,
                id: undefined,
                userId: undefined
            })
            .where(eq(organization.userId, session.user.id));

        return json({ success: true });
    } catch (error) {
        console.error('Error updating organization:', error);
        return json({ error: 'Failed to update organization' }, { status: 500 });
    }
};