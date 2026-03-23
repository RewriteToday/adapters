interface RewriteElysiaErrorOptions {
	code: string;
}

export class RewriteElysiaError extends Error {
	readonly code: string;

	static readonly docs =
		'https://docs.rewritetoday.com/en/webhooks/introduction';

	constructor(message: string, options: RewriteElysiaErrorOptions) {
		super(message);

		this.code = options.code;
		this.name = 'RewriteElysiaError';
	}
}
