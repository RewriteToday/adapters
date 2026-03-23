<div align="center">

# Rewrite Fastify

Official integration of **Rewrite** with **Fastify** to receive **Webhooks** in a simple, secure and fully typed way.

[`@rewritetoday/fastify`](https://www.npmjs.com/package/@rewritetoday/fastify) is a **framework-first** package, designed to work natively with Fastify, focused on **DX**, **TypeScript first** and **good security practices**.

You can find the full Webhooks documentation [here](https://docs.rewritetoday.com).

<img src="https://cdn.rewritetoday.com/assets/banners/fastify_banner.png" width="100%" alt="Rewrite Banner"/>

## Instalação

Use with your favorite package manager:

</div>

```bash
npm install @rewritetoday/fastify fastify
# ou
pnpm add @rewritetoday/fastify fastify
# ou
bun add @rewritetoday/fastify fastify
```

<div align="center">

No extra dependencies are needed. The package can register the JSON content parser required by Fastify for webhook verification.

## Basic usage

</div>

```ts
import Fastify from 'fastify';
import { Webhooks } from '@rewritetoday/fastify';

const app = Fastify();

await app.register(Webhooks, {
	path: '/webhooks/rewrite',
	secret: '...',
	onPayload({ id, type, data }) {
		console.log('Hey, a new webhook event:', type);
	},
});
```

<div align="center">

## Security by default

</div>

- Automatic webhook signature verification
- Secure webhook secret comparison
- Payload validated before reaching your handler
- No direct access to API key

<p align="center"><strong>Never expose your API key in webhooks.</strong><br/>
Always use environment variables.</p>

<div align="center">

## Event processing

You can handle specific events without boilerplate:

</div>

```ts
await app.register(Webhooks, {
	path: '/webhooks/rewrite',
	secret: '...',
	onSMSOTP({ data }) {
		console.log({ data });
	},
	onMessageSent({ data }) {
		console.log({ data });
	},
	onMessageBatch({ data }) {
		console.log({ data });
	},
	onMessageQueued({ data }) {
		console.log({ data });
	},
	onMessageDelivered({ data }) {
		console.log({ data });
	},
	onMessageScheduled({ data }) {
		console.log({ data });
	},
	onMessageFailed({ data }) {
		console.error({ error: data.error });
	},
	onMessageCanceled({ data }) {
		console.log({ data });
	},
});
```

<p align="center">Or treat everything generically:</p>

```ts
await app.register(Webhooks, {
	path: '/webhooks/rewrite',
	secret: '...',
	onPayload({ id, type, data }) {
		console.log({ id, type, data });
	},
});
```

<div align="center">

Made by the Rewrite team. <br/>
SMS the way it should be.

</div>
