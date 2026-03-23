import type { Context, Env, Handler } from 'hono';

export interface RewriteHonoErrorOptions {
	code: string;
}

export type { Context, Env, Handler };
