<div align="center">

# Rewrite Express

Official integration of **Rewrite** with **Express** to receive **Webhooks** in a simple, secure and fully typed way.

[`@rewritetoday/express`](https://www.npmjs.com/package/@rewritetoday/express) is a **framework-first** package, designed to work natively with Express, focused on **DX**, **TypeScript first** and **good security practices**.

You can find the full Webhooks documentation [here](https://docs.rewritetoday.com).

## Instalação

Use with your favorite package manager:

</div>

```bash
npm install @rewritetoday/express express
# ou
pnpm add @rewritetoday/express express
# ou
bun add @rewritetoday/express express
```

<div align="center">

No extra dependencies are needed. The package already handles the raw body middleware required by Express for webhook verification.

## Basic usage

</div>

```ts
import express from 'express';
import { Webhooks } from '@rewritetoday/express';

const app = express();

app.post(
	'/webhooks/rewrite',
	...Webhooks({
		secret: '...',
		onPayload({ id, type, data }) {
			console.log('Hey, a new webhook event:', type);
		},
	}),
);
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
app.post(
	'/webhooks/rewrite',
	...Webhooks({
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
	}),
);
```

<p align="center">Or treat everything generically:</p>

```ts
app.post(
	'/webhooks/rewrite',
	...Webhooks({
		secret: '...',
		onPayload({ id, type, data }) {
			console.log({ id, type, data });
		},
	}),
);
```

<div align="center">

Made by the Rewrite team. <br/>
SMS the way it should be.

</div>
