import type {
	WebhookEvent,
	WebhookMessageBatchEvent,
	WebhookMessageCanceledEvent,
	WebhookMessageDeliveredEvent,
	WebhookMessageFailedEvent,
	WebhookMessageQueuedEvent,
	WebhookMessageScheduledEvent,
	WebhookMessageSentEvent,
	WebhookSMSOTPEvent,
} from '@rewritetoday/zod/v1';

type MaybePromise<T> = T | Promise<T>;

export type WebhookHandler<TEvent extends WebhookEvent = WebhookEvent> = (
	data: TEvent,
) => MaybePromise<unknown>;

export interface VerifyWebhookOptions {
	secret?: string;
	payload: string;
	headers: Headers | Record<string, string | undefined>;
}

export interface WebhookDispatchOptions {
	onPayload?(data: WebhookEvent): MaybePromise<unknown>;
	onSMSOTP?(data: WebhookSMSOTPEvent): MaybePromise<unknown>;
	onMessageSent?(data: WebhookMessageSentEvent): MaybePromise<unknown>;
	onMessageBatch?(data: WebhookMessageBatchEvent): MaybePromise<unknown>;
	onMessageQueued?(data: WebhookMessageQueuedEvent): MaybePromise<unknown>;
	onMessageDelivered?(
		data: WebhookMessageDeliveredEvent,
	): MaybePromise<unknown>;
	onMessageScheduled?(
		data: WebhookMessageScheduledEvent,
	): MaybePromise<unknown>;
	onMessageFailed?(data: WebhookMessageFailedEvent): MaybePromise<unknown>;
	onMessageCanceled?(data: WebhookMessageCanceledEvent): MaybePromise<unknown>;
}

export interface WebhookOptions extends WebhookDispatchOptions {
	secret: string;
}
