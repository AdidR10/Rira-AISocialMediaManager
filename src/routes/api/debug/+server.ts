import { db } from "$lib/server/db";
import { post as postTable, schedule as scheduleTable, photocard as photocardTable } from "$lib/server/db/schema";
import { json } from "@sveltejs/kit";
import { eq, desc } from "drizzle-orm";


export const POST = async () => {
    const posts = await db
        .select({
            postId: postTable.id,
            caption: postTable.caption,
            updatedAt: postTable.updatedAt,
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
        .where(eq(postTable.organizationId, "9d21a643-88d0-40c3-a06b-6fff27aa28ea"))
        .orderBy(desc(postTable.updatedAt))
        .limit(10);

    const postsWithHumanizedTime = posts.map((post) => {
        if (post.schedule) {
            const timestamp = post.schedule.timestamp * 1000;
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


    return json(postsWithHumanizedTime)
}

