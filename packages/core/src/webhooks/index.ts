import { WebhookEvent } from '@rewritetoday/zod/v1';

export const parse = (
	value: unknown,
): ReturnType<typeof WebhookEvent.safeParse> => WebhookEvent.safeParse(value);

export { dispatch } from './dispatch';
export { verify } from './signature';

export * from './types';
