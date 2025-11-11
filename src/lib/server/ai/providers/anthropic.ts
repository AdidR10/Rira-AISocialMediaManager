import { ANTHROPIC_API_KEY } from '$env/static/private';
import { createAnthropic } from '@ai-sdk/anthropic';

export const anthropic = createAnthropic({
    apiKey: ANTHROPIC_API_KEY
});