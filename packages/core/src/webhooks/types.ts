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
	headers: Headers | Record<string, string | string[] | undefined>;
}

export interface HandleWebhookOptions extends WebhookOptions {
	payload: string;
	headers: VerifyWebhookOptions['headers'];
}

export interface HandledWebhookSuccess {
	success: true;
	status: 200;
	body: {
		success: true;
	};
	event: WebhookEvent;
}

export interface HandledWebhookFailure {
	success: false;
	status: 400 | 401;
	body: {
		error: 'Invalid payload' | 'Invalid signature';
	};
}

export type HandledWebhookResult =
	| HandledWebhookFailure
	| HandledWebhookSuccess;

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
