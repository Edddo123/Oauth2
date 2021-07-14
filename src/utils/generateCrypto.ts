import crypto from 'crypto';

export const clientCredentials: () => Promise<[string, string]> = async () => {
	const clientIdBuffer = await crypto.randomBytes(12);
	const clientId = clientIdBuffer.toString('hex');
	const clientSecretBuffer = await crypto.randomBytes(12);
	const clientSecret = clientSecretBuffer.toString('hex');

	return [clientId, clientSecret];
};

export const generateCode: () => Promise<string> = async () => {
	const codeBuffer = await crypto.randomBytes(6);
	const code = codeBuffer.toString('hex');
	return code;
};

export const comparePkce: (plainText: string, challenge: string, method: string) => [null, boolean] | [Error, null] = (
	plainText,
	challenge,
	method
) => {
	if (method !== 'sha256') {
		const error = new Error('given hash is not supported');
		return [error, null];
	}
	const hash = crypto.createHash(method).update(plainText).digest('base64');
	return [null, challenge === hash];
};
