import { handle, type WebhookOptions } from '@rewritetoday/adapters/webhooks';
import type { Context, Env, Handler, RewriteHonoErrorOptions } from './types';

export * from './types';
export { version } from './version';

export class RewriteHonoError extends Error {
	readonly code: string;

	static readonly docs =
		'https://docs.rewritetoday.com/en/webhooks/introduction';

	constructor(message: string, options: RewriteHonoErrorOptions) {
		super(message);
		this.code = options.code;
		this.name = 'RewriteHonoError';
	}
}

export const Webhooks = <
	E extends Env = Env,
	P extends string = string,
	I extends Record<string, unknown> = Record<string, never>,
>(
	options: WebhookOptions,
): Handler<E, P, I> => {
	if (!options.secret)
		throw new RewriteHonoError('Webhook secret is missing.', {
			code: 'WEBHOOK_SECRET_MISSING',
		});

	return async (context: Context<E, P, I>) => {
		const result = await handle({
			...options,
			payload: await context.req.raw.text(),
			headers: context.req.raw.headers,
		});

		return context.json(result.body, result.status);
	};
};
