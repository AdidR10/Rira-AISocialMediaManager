import { auth } from "$lib/server/auth"
import { redirect } from "@sveltejs/kit"

export const load = async ({ request }) => {
    const session = await auth.api.getSession({
        headers: request.headers
    })

    if (session) {
        redirect(308, '/app')
    }
}
