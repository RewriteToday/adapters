import { handle, type WebhookOptions } from '@rewritetoday/adapters/webhooks';
import type { Context, RewriteElysiaErrorOptions } from './types';

export * from './types';
export { version } from './version';

export class RewriteElysiaError extends Error {
	readonly code: string;

	static readonly docs =
		'https://docs.rewritetoday.com/en/webhooks/introduction';

	constructor(message: string, options: RewriteElysiaErrorOptions) {
		super(message);
		this.code = options.code;
		this.name = 'RewriteElysiaError';
	}
}

export const Webhooks = (options: WebhookOptions) => {
	if (!options.secret)
		throw new RewriteElysiaError('Webhook secret is missing.', {
			code: 'WEBHOOK_SECRET_MISSING',
		});

	return async (context: Context) => {
		const result = await handle({
			...options,
			payload: await context.request.text(),
			headers: context.request.headers,
		});

		context.set.status = result.status;

		return result.body;
	};
};
