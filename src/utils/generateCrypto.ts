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
