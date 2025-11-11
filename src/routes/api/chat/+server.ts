import { streamText, type UIMessage, convertToModelMessages, stepCountIs } from 'ai';
import { getSystemInstructions } from '$lib/server/ai/utils.js';
import { getPhotocardTools } from '$lib/server/ai/tools/photocard.js';
import { auth } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import { getPostTools } from '$lib/server/ai/tools/post.js';
import { gemini } from '$lib/server/ai/providers/gemini.js';

export async function POST({ request }) {
    const session = await auth.api.getSession({
        headers: request.headers
    })

    if (!session) return error(405)

    const { user } = session

    const { messages }: { messages: UIMessage[] } = await request.json();
    const systemInstructions = await getSystemInstructions(request);

    const { createPhotocard, editPhotocard, getLast5Photocards } = await getPhotocardTools(user);
    const { createPost, editPost, schedulePost, unschedulePost, getLast10Posts } = await getPostTools(user);

    const result = streamText({
        model: gemini('gemini-2.5-flash'),
        messages: convertToModelMessages(messages),
        system: systemInstructions,
        stopWhen: stepCountIs(10),
        tools: {
            createPhotocard,
            editPhotocard,
            getLast5Photocards,
            createPost,
            editPost,
            schedulePost,
            unschedulePost,
            getLast10Posts,
        }
    });

    return result.toUIMessageStreamResponse();
}
