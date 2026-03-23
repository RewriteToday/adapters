import type { VerifyWebhookOptions } from './types';

const WEBHOOK_SECRET_ENV = 'REWRITE_WEBHOOK_SECRET';
const BASE64_REGEX =
	/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}(?:==)?|[A-Za-z0-9+/]{3}=?)?$/;
const TEXT_ENCODER = new TextEncoder();

export const verify = async ({
	headers,
	payload,
	secret = typeof process === 'undefined'
		? undefined
		: process.env[WEBHOOK_SECRET_ENV],
}: VerifyWebhookOptions) => {
	if (!secret)
		throw new Error('Rewrite could not find a webhook secret to verify.');

	const readHeader = (name: string) => {
		if (headers instanceof Headers) return headers.get(name);

		const value = headers[name] ?? headers[name.toLowerCase()];

		if (Array.isArray(value)) return value[0] ?? null;

		return value ?? null;
	};
	const id = readHeader('svix-id');
	const timestamp = readHeader('svix-timestamp');
	const rawSignature = readHeader('svix-signature');
	const normalizedSecret = secret.startsWith('whsec_')
		? secret.slice('whsec_'.length)
		: secret;
	const key = secret.startsWith('rw_whsec_')
		? TEXT_ENCODER.encode(secret)
		: BASE64_REGEX.test(normalizedSecret)
			? typeof atob === 'function'
				? Uint8Array.from(atob(normalizedSecret), (char) => char.charCodeAt(0))
				: typeof Buffer !== 'undefined'
					? new Uint8Array(Buffer.from(normalizedSecret, 'base64'))
					: null
			: null;
	const parts = rawSignature
		?.split(',')
		.map((entry) => entry.trim())
		.filter(Boolean);
	const signature =
		rawSignature?.match(/v1[,=]([^,\s]+)/)?.[1] ??
		parts?.at(1) ??
		parts?.at(0) ??
		null;

	if (!key || !id || !timestamp || !signature) return false;

	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		key.buffer.slice(
			key.byteOffset,
			key.byteOffset + key.byteLength,
		) as ArrayBuffer,
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign'],
	);
	const signed = new Uint8Array(
		await crypto.subtle.sign(
			'HMAC',
			cryptoKey,
			TEXT_ENCODER.encode(`${id}.${timestamp}.${payload}`),
		),
	);
	const expected =
		typeof btoa === 'function'
			? btoa(String.fromCharCode(...signed))
			: typeof Buffer !== 'undefined'
				? Buffer.from(signed).toString('base64')
				: null;

	if (!expected || signature.length !== expected.length) return false;

	const signatureBytes = TEXT_ENCODER.encode(signature);
	const expectedBytes = TEXT_ENCODER.encode(expected);
	let mismatch = 0;

	for (let index = 0; index < signatureBytes.length; index += 1)
		mismatch |= (signatureBytes[index] ?? 0) ^ (expectedBytes[index] ?? 0);

	return mismatch === 0;
};
