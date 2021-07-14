import jwt from 'jsonwebtoken';

interface jwtPayload {
	id: string;
}

export const generateJwt: (user: jwtPayload, secret: string, scope?: string) => [null, string] | [Error, null] = (
	user,
	secret,
	scope
) => {
	try {
		const token = jwt.sign({ id: user.id, scope }, secret);
		return [null, token];
	} catch (err) {
		console.log(err);
		return [err, null];
	}
};
