import {
	dispatch,
	parse,
	verify,
	type WebhookOptions,
} from '@rewritetoday/adapters/webhooks';
import type { Context } from 'elysia';
import { RewriteElysiaError } from './errors';

export { RewriteElysiaError } from './errors';
export { version } from './version';

export const Webhooks = (options: WebhookOptions) => {
	if (!options.secret) {
		throw new RewriteElysiaError('Webhook secret is missing.', {
			code: 'WEBHOOK_SECRET_MISSING',
		});
	}

	return async (context: Context) => {
		const raw = await context.request.text();

		if (
			!verify({
				payload: raw,
				secret: options.secret,
				headers: context.request.headers,
			})
		) {
			context.set.status = 401;

			return { error: 'Invalid signature' };
		}

		let payload: unknown;

		try {
			payload = JSON.parse(raw);
		} catch {
			context.set.status = 400;

			return { error: 'Invalid payload' };
		}

		const result = parse(payload);

		if (!result.success) {
			context.set.status = 400;

			return { error: 'Invalid payload' };
		}

		await dispatch(result.data, options);

		return { success: true };
	};
};
