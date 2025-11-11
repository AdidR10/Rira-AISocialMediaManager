import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { post as postTable, schedule as scheduleTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request }) => {
    const session = await auth.api.getSession({
        headers: request.headers
    });

    if (!session?.user?.id) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { postId } = await request.json();

        if (!postId) {
            return json({ error: 'Post ID is required' }, { status: 400 });
        }

        // Get the post to verify it exists
        const [existingPost] = await db
            .select()
            .from(postTable)
            .where(eq(postTable.id, postId))
            .limit(1);

        if (!existingPost) {
            return json({ error: 'Post not found' }, { status: 404 });
        }

        // Delete associated schedule if it exists
        if (existingPost.scheduleId) {
            await db.delete(scheduleTable).where(eq(scheduleTable.id, existingPost.scheduleId));
        }

        // Delete the post
        await db.delete(postTable).where(eq(postTable.id, postId));

        return json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        return json({ error: 'Failed to delete post' }, { status: 500 });
    }
};
