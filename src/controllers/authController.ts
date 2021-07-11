import { RequestHandler } from 'express';
import { getDb } from '../config/db-setup';
import { catchError, throwError } from '../utils/errorHandling';
import { clientCredentials } from '../utils/generateCrypto';
import User from '../models/user';
import OauthApplication from '../models/oauthapplication';
// const TimeStamp = mongodb.Timestamp;
// const bson = require('bson');
export const signUp: RequestHandler = async (req, res, next) => {
	try {
		const { email, password, fullName } = req.body;
		const [user, error1] = await User.findUserByEmail(email);
		if (error1) {
			throwError('adding user failed', 500);
		}
		if (user) {
			throwError('user with that email already exists', 400);
		}
		const newUser = new User(email, password, fullName);
		const [, error] = await newUser.addUser();
		if (error) {
			throwError('adding user failed', 500);
		}

		res.json({ message: 'user successfully created' });
	} catch (error) {
		catchError(error, next);
	}
};

export const createApplication: RequestHandler = async (req, res, next) => {
	try {
		const { appName, redirectUrl } = req.body;
		const [clientId, clientSecret] = await clientCredentials();
		const oauthApp = new OauthApplication(appName, clientId, clientSecret, redirectUrl);
		const [user, error] = await oauthApp.addOauthApp('req.userId');
		if (error) {
			throwError('adding oauth app failed', 500);
		}
		if (user && 'modifiedCount' in user && user.modifiedCount == 0) {
			throwError('No user found', 400);
		}
		res.json({ message: 'Oauth application added successfully' });
	} catch (error) {
		catchError(error, next);
	}
};

export const authorizeCode: RequestHandler = async (req, res, next) => {
	try {
		const { response_type, client_id, redirect_uri, scope, state, code_challenge, code_challenge_method } =
			req.query;
		if (response_type !== 'code') {
			throwError('Only response type code available', 403);
		}
		// extra request. cam be done down there

		if (typeof client_id == 'string' && typeof redirect_uri == 'string') {
			const [redirectUrl, error] = await OauthApplication.matchRedirectUrl(client_id, redirect_uri);
			console.log(redirectUrl);
			if (error) {
				throwError(error, 400);
			}
		}
		res.json({ message: 'auth flow started successfully' });
	} catch (error) {
		catchError(error, next);
	}
};

// return res.redirect(redirect_uri + `?error=access_denied&state=${state}&reason=invalid_response_type`);
