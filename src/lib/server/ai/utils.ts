import { auth } from "$lib/server/auth"
import systemInstructions from "$lib/server/ai/systemInstructions/main.md?raw";
import { organization as organizationTable } from "$lib/server/db/schema";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";

export const getSystemInstructions = async (request: Request) => {
    const session = await auth.api.getSession({
        headers: request.headers
    })

    if (!session) return "User is unauthenticated. Deny all requests."

    const user = session.user;

    const [organization] = await db.select().from(organizationTable).where(eq(organizationTable.userId, user.id)).limit(1)

    const now = new Date();
    const gmt6Date = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
    const formattedDate = gmt6Date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Dhaka'
    });
    const formattedTime = gmt6Date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Dhaka'
    });

    let instructions = systemInstructions.toString()
    instructions = instructions.replaceAll('{{ OPERATOR_NAME }}', user.name)
    instructions = instructions.replaceAll('{{ ORGANIZATION_INFO }}', JSON.stringify(organization, null, 2))
    instructions = instructions.replaceAll('{{ DATE }}', formattedDate)
    instructions = instructions.replaceAll('{{ TIME }}', formattedTime)

    return instructions
}