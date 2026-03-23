import { WebhookEvent } from '@rewritetoday/zod/v1';
import { dispatch } from './dispatch';
import { verify } from './signature';
import type { HandledWebhookResult, HandleWebhookOptions } from './types';

export const handle = async ({
	headers,
	payload,
	...options
}: HandleWebhookOptions): Promise<HandledWebhookResult> => {
	if (
		!(await verify({
			headers,
			payload,
			secret: options.secret,
		}))
	)
		return {
			success: false,
			status: 401,
			body: {
				error: 'Invalid signature',
			},
		};

	let value: unknown;

	try {
		value = JSON.parse(payload);
	} catch {
		return {
			success: false,
			status: 400,
			body: {
				error: 'Invalid payload',
			},
		};
	}

	const result = WebhookEvent.safeParse(value);

	if (!result.success)
		return {
			success: false,
			status: 400,
			body: {
				error: 'Invalid payload',
			},
		};

	await dispatch(result.data, options);

	return {
		success: true,
		status: 200,
		body: {
			success: true,
		},
		event: result.data,
	};
};
