import type { NextFunction, Request, RequestHandler, Response } from 'express';

export interface RewriteExpressErrorOptions {
	code: string;
}

export type { NextFunction, Request, RequestHandler, Response };
