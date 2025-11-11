import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { post as postTable, schedule as scheduleTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request }) => {
    const session = await auth.api.getSession({
        headers: request.headers
    });

    if (!session?.user?.id) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { postId, caption, timestamp } = await request.json();

        if (!postId) {
            return json({ error: 'Post ID is required' }, { status: 400 });
        }

        // Get the post to verify ownership
        const [existingPost] = await db
            .select()
            .from(postTable)
            .where(eq(postTable.id, postId))
            .limit(1);

        if (!existingPost) {
            return json({ error: 'Post not found' }, { status: 404 });
        }

        // Handle schedule update
        let scheduleId = existingPost.scheduleId;

        if (timestamp) {
            // If there's a timestamp, create or update schedule
            if (scheduleId) {
                // Update existing schedule
                await db
                    .update(scheduleTable)
                    .set({ timestamp })
                    .where(eq(scheduleTable.id, scheduleId));
            } else {
                // Create new schedule
                const [newSchedule] = await db
                    .insert(scheduleTable)
                    .values({ timestamp })
                    .returning();
                scheduleId = newSchedule.id;
            }
        } else if (scheduleId) {
            // If no timestamp provided but schedule exists, remove it
            await db.delete(scheduleTable).where(eq(scheduleTable.id, scheduleId));
            scheduleId = null;
        }

        // Update the post
        await db
            .update(postTable)
            .set({
                caption,
                scheduleId,
                updatedAt: new Date().toISOString()
            })
            .where(eq(postTable.id, postId));

        return json({ success: true });
    } catch (error) {
        console.error('Error updating post:', error);
        return json({ error: 'Failed to update post' }, { status: 500 });
    }
};