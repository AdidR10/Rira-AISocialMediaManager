
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { OPENROUTER_API_KEY } from '$env/static/private';

export const openRouter = createOpenRouter({
    apiKey: OPENROUTER_API_KEY
})
