const jwt = require('jsonwebtoken');
const errHandler = require('../utils/errorHandling');
module.exports = (req, res, next) => {
	try {
		let decodedToken;
		const authHeader = req.get('Authorization');
		if (!authHeader) {
			errHandler.throwError('Authenticate first', 400);
		}
		const token = authHeader.split(' ')[1];
		try {
			decodedToken = jwt.verify(token, process.env.SECRET_KEY);
		} catch (error) {
			errHandler.throwError('Authenticate first', 400);
		}
		if (!decodedToken) {
			errHandler.throwError('Authenticate first', 400);
		}

		req.userId = decodedToken.userId;
		next();
	} catch (error) {
		errHandler.catchError(error, next);
	}
};
