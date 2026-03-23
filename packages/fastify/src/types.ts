import type { WebhookOptions } from '@rewritetoday/adapters/webhooks';
import type {
	FastifyInstance,
	FastifyPluginAsync,
	FastifyReply,
	FastifyRequest,
	RouteHandlerMethod,
} from 'fastify';

export interface RewriteFastifyErrorOptions {
	code: string;
}

export interface FastifyWebhookPluginOptions extends WebhookOptions {
	path?: string;
}

export type {
	FastifyInstance,
	FastifyPluginAsync,
	FastifyReply,
	FastifyRequest,
	RouteHandlerMethod,
};
