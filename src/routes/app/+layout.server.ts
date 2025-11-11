import { auth } from "$lib/server/auth"
import { redirect } from "@sveltejs/kit"

export const load = async ({ request }) => {
    const session = await auth.api.getSession({
        headers: request.headers
    })

    if (!session) {
        redirect(302, '/sign-in')
    }

    return {
        user: session.user
    }
}
