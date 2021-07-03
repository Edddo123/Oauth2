import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { catchError, throwError } from '../utils/errorHandling';

// interface DecodedToken {
// 	userId: string;
// }

export const isAuth: RequestHandler = (req, res, next) => {
	try {
		let decodedToken;
		const authHeader = req.get('Authorization');
		if (!authHeader) {
			throwError('Authenticate first', 400);
		} else {
			const token = authHeader.split(' ')[1];
			try {
				decodedToken = jwt.verify(token, process.env.SECRET_KEY);
				console.log(decodedToken);
			} catch (error) {
				throwError('Authenticate first', 400);
			}
			if (!decodedToken) {
				throwError('Authenticate first', 400);
			} else {
				if (typeof decodedToken !== 'string' && 'userId' in decodedToken) req.userId = decodedToken.userId;
				next();
			}
		}
	} catch (error) {
		catchError(error, next);
	}
};
