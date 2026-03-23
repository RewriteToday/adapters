import { type WebhookEvent, WebhookEventType } from '@rewritetoday/zod/v1';
import type { WebhookDispatchOptions } from './types';

export const dispatch = (
	data: WebhookEvent,
	options: WebhookDispatchOptions,
) => {
	switch (data.type) {
		case WebhookEventType.SMSOTP:
			return (options.onSMSOTP ?? options.onPayload)?.(data);
		case WebhookEventType.MessageSent:
			return (options.onMessageSent ?? options.onPayload)?.(data);
		case WebhookEventType.MessageBatch:
			return (options.onMessageBatch ?? options.onPayload)?.(data);
		case WebhookEventType.MessageQueued:
			return (options.onMessageQueued ?? options.onPayload)?.(data);
		case WebhookEventType.MessageDelivered:
			return (options.onMessageDelivered ?? options.onPayload)?.(data);
		case WebhookEventType.MessageScheduled:
			return (options.onMessageScheduled ?? options.onPayload)?.(data);
		case WebhookEventType.MessageFailed:
			return (options.onMessageFailed ?? options.onPayload)?.(data);
		case WebhookEventType.MessageCanceled:
			return (options.onMessageCanceled ?? options.onPayload)?.(data);
	}
};
