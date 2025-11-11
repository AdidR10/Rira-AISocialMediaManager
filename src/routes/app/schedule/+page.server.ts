import { db } from "$lib/server/db";
import { eq, desc } from "drizzle-orm"
import { post as postTable, photocard as photocardTable, schedule as scheduleTable, organization as organizationTable } from "$lib/server/db/schema.js"

export const load = async ({ parent }) => {
    const { user } = await parent()
    const [organization] = await db.select().from(organizationTable).where(eq(organizationTable.userId, user.id)).limit(1)

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
        .limit(100);

    return { posts, organization }
}