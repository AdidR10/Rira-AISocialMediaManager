import { db } from '$lib/server/db/index.js'
import { organization as organizationTable, integration as integrationTable } from '$lib/server/db/schema.js'
import { eq } from 'drizzle-orm'

export const load = async ({ parent }) => {
    const { user } = await parent()
    const [organization] = await db.select().from(organizationTable).where(eq(organizationTable.userId, user.id)).limit(1)

    let integration = null
    if (organization) {
        const [existingIntegration] = await db.select().from(integrationTable).where(eq(integrationTable.organizationId, organization.id)).limit(1)
        integration = existingIntegration || null
    }

    return { organization, integration }
}