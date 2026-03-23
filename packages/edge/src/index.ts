import { handle, type WebhookOptions } from '@rewritetoday/adapters/webhooks';
import type { RewriteEdgeErrorOptions } from './types';

export * from './types';
export { version } from './version';

export class RewriteEdgeError extends Error {
	readonly code: string;

	static readonly docs =
		'https://docs.rewritetoday.com/en/webhooks/introduction';

	constructor(message: string, options: RewriteEdgeErrorOptions) {
		super(message);
		this.code = options.code;
		this.name = 'RewriteEdgeError';
	}
}

export const Webhooks = (options: WebhookOptions) => {
	if (!options.secret)
		throw new RewriteEdgeError('Webhook secret is missing.', {
			code: 'WEBHOOK_SECRET_MISSING',
		});

	return async (request: Request) => {
		const result = await handle({
			...options,
			payload: await request.text(),
			headers: request.headers,
		});

		return Response.json(result.body, {
			status: result.status,
		});
	};
};
