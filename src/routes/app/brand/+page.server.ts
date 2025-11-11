import { db } from '$lib/server/db/index.js'
import { organization as organizationTable } from '$lib/server/db/schema.js'
import { eq } from 'drizzle-orm'

export const load = async ({ parent }) => {
    const { user } = await parent()
    const [organization] = await db.select().from(organizationTable).where(eq(organizationTable.userId, user.id)).limit(1)

    return { organization }
}