import { createHmac, timingSafeEqual } from 'node:crypto';
import type { VerifyWebhookOptions } from './types';

const WEBHOOK_SECRET_ENV = 'REWRITE_WEBHOOK_SECRET';

const BASE64_REGEX =
	/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}(?:==)?|[A-Za-z0-9+/]{3}=?)?$/;

const getHeader = (
	headers: VerifyWebhookOptions['headers'],
	name: string,
): string | null => {
	if (headers instanceof Headers) {
		return headers.get(name);
	}

	return headers[name] ?? headers[name.toLowerCase()] ?? null;
};

const resolveSecretKey = (secret: string): Buffer | null => {
	const value = secret.startsWith('whsec_')
		? secret.slice('whsec_'.length)
		: secret;

	if (secret.startsWith('rw_whsec_')) {
		return Buffer.from(secret);
	}

	if (!BASE64_REGEX.test(value)) {
		return null;
	}

	return Buffer.from(value, 'base64');
};

const resolveSignature = (value: string | null): string | null => {
	if (!value) {
		return null;
	}

	const versioned = value.match(/v1[,=]([^,\s]+)/);

	if (versioned?.[1]) {
		return versioned[1];
	}

	const parts = value
		.split(',')
		.map((entry) => entry.trim())
		.filter(Boolean);

	return parts.at(1) ?? parts.at(0) ?? null;
};

export const verify = ({
	headers,
	payload,
	secret = process.env[WEBHOOK_SECRET_ENV],
}: VerifyWebhookOptions) => {
	if (!secret) {
		throw new Error('Rewrite could not find a webhook secret to verify.');
	}

	const key = resolveSecretKey(secret);
	const id = getHeader(headers, 'svix-id');
	const timestamp = getHeader(headers, 'svix-timestamp');
	const signature = resolveSignature(getHeader(headers, 'svix-signature'));

	if (!key || !id || !timestamp || !signature) {
		return false;
	}

	const expected = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${payload}`)
		.digest('base64');

	return (
		signature.length === expected.length &&
		timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
	);
};
