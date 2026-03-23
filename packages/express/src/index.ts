import { handle, type WebhookOptions } from '@rewritetoday/adapters/webhooks';
import express from 'express';
import type { RequestHandler, RewriteExpressErrorOptions } from './types';

export * from './types';
export { version } from './version';

const RAW_BODY_ERROR =
	'Raw body is not available. Register the returned middleware before any JSON body parser for this route.';

export class RewriteExpressError extends Error {
	readonly code: string;

	static readonly docs =
		'https://docs.rewritetoday.com/en/webhooks/introduction';

	constructor(message: string, options: RewriteExpressErrorOptions) {
		super(message);
		this.code = options.code;
		this.name = 'RewriteExpressError';
	}
}

export const Webhooks = (options: WebhookOptions): RequestHandler[] => {
	if (!options.secret)
		throw new RewriteExpressError('Webhook secret is missing.', {
			code: 'WEBHOOK_SECRET_MISSING',
		});

	const raw = express.raw({
		type: ['application/json', 'application/*+json'],
	});

	const handler: RequestHandler = (request, response, next) => {
		void (async () => {
			const payload =
				typeof request.body === 'string'
					? request.body
					: request.body instanceof Uint8Array
						? new TextDecoder().decode(request.body)
						: null;

			if (!payload)
				return void response.status(500).json({
					error: RAW_BODY_ERROR,
				});

			const result = await handle({
				...options,
				payload,
				headers: request.headers as Record<
					string,
					string | string[] | undefined
				>,
			});

			response.status(result.status).json(result.body);
		})().catch(next);
	};

	return [raw, handler];
};
