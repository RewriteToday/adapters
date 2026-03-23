<div align="center">

# Rewrite Adapters

Official **Rewrite** adapters to receive **Webhooks** in a simple, secure and fully typed way across popular Node.js frameworks and edge runtimes.

This monorepo contains the framework-first packages maintained by the Rewrite team, focused on **DX**, **TypeScript first** and **good security practices**.

You can find the full Webhooks documentation [here](https://docs.rewritetoday.com).

<img src="https://cdn.rewritetoday.com/assets/banners/adapters.png" width="100%" alt="Rewrite Banner"/>

## Available adapters

</div>

- [`@rewritetoday/elysia`](https://www.npmjs.com/package/@rewritetoday/elysia) for Elysia
- [`@rewritetoday/express`](https://www.npmjs.com/package/@rewritetoday/express) for Express
- [`@rewritetoday/fastify`](https://www.npmjs.com/package/@rewritetoday/fastify) for Fastify
- [`@rewritetoday/hono`](https://www.npmjs.com/package/@rewritetoday/hono) for Hono
- [`@rewritetoday/edge`](https://www.npmjs.com/package/@rewritetoday/edge) for edge runtimes with the standard `Request` and `Response` APIs

<div align="center">

Each adapter has its own README with framework-specific examples:
[Elysia](./packages/elysia/README.md) ·
[Express](./packages/express/README.md) ·
[Fastify](./packages/fastify/README.md) ·
[Hono](./packages/hono/README.md) ·
[Edge](./packages/edge/README.md)

## Installing

Choose the adapter that matches your stack:

</div>

```bash
npm install @rewritetoday/hono hono
# ou
pnpm add @rewritetoday/hono hono
# ou
bun add @rewritetoday/hono hono
```

<div align="center">

## Basic usage

</div>

```ts
import { Hono } from 'hono';
import { Webhooks } from '@rewritetoday/hono';

const app = new Hono();

app.post(
	'/webhooks/rewrite',
	Webhooks({
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

Made by the Rewrite team. <br/>
SMS the way it should be.

</div>
