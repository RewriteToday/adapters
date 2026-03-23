import { handle, type WebhookOptions } from '@rewritetoday/adapters/webhooks';
import type {
	FastifyInstance,
	FastifyPluginAsync,
	FastifyWebhookPluginOptions,
	RewriteFastifyErrorOptions,
	RouteHandlerMethod,
} from './types';

export * from './types';
export { version } from './version';

const JSON_CONTENT_TYPE = /^application\/(?:[a-z0-9.+-]+\+)?json(?:;.*)?$/i;
const RAW_BODY_ERROR =
	'Raw body is not available. Register the webhook plugin or registerWebhookContentParser() on the route scope.';

export class RewriteFastifyError extends Error {
	readonly code: string;

	static readonly docs =
		'https://docs.rewritetoday.com/en/webhooks/introduction';

	constructor(message: string, options: RewriteFastifyErrorOptions) {
		super(message);
		this.code = options.code;
		this.name = 'RewriteFastifyError';
	}
}

export const registerWebhookContentParser = (fastify: FastifyInstance) => {
	if (fastify.hasContentTypeParser('application/json'))
		fastify.removeContentTypeParser('application/json');

	fastify.addContentTypeParser(
		'application/json',
		{ parseAs: 'string' },
		(_request, body, done) => {
			done(null, body);
		},
	);
	fastify.addContentTypeParser(
		JSON_CONTENT_TYPE,
		{ parseAs: 'string' },
		(_request, body, done) => {
			done(null, body);
		},
	);
};

export const createWebhookHandler = (
	options: WebhookOptions,
): RouteHandlerMethod => {
	if (!options.secret)
		throw new RewriteFastifyError('Webhook secret is missing.', {
			code: 'WEBHOOK_SECRET_MISSING',
		});

	return async (request, reply) => {
		const payload =
			typeof request.body === 'string'
				? request.body
				: request.body instanceof Uint8Array
					? new TextDecoder().decode(request.body)
					: null;

		if (!payload) reply.code(500);
		if (!payload)
			return {
				error: RAW_BODY_ERROR,
			};

		const result = await handle({
			...options,
			payload,
			headers: request.headers as Record<string, string | string[] | undefined>,
		});

		reply.code(result.status);

		return result.body;
	};
};

export const Webhooks: FastifyPluginAsync<FastifyWebhookPluginOptions> = async (
	fastify,
	{ path = '/', ...options },
) => {
	registerWebhookContentParser(fastify);
	fastify.post(path, createWebhookHandler(options));
};
