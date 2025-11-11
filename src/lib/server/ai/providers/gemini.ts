
import { GOOGLE_API_KEY } from '$env/static/private';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const gemini = createGoogleGenerativeAI({
    apiKey: GOOGLE_API_KEY,
});
