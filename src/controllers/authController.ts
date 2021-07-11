import { RequestHandler } from 'express';
import { getDb } from '../config/db-setup';
import { catchError, throwError } from '../utils/errorHandling';
import { clientCredentials, generateCode } from '../utils/generateCrypto';
import User from '../models/user';
import OauthApplication from '../models/oauthapplication';
import bcrypt from 'bcrypt';
import { generateJwt } from '../utils/jwt';

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
		res.render('login.ejs', {
			clientId: client_id,
			redirectUri: redirect_uri,
		});
	} catch (error) {
		catchError(error, next);
	}
};

export const sendCode: RequestHandler = async (req, res, next) => {
	try {
		const { email, password, clientId, redirectUri } = req.body;
		const { purpose } = req.query;
		let code: string;
		if (purpose === 'login') {
			const user = await getDb().db().collection('users').findOne({ email, ownerId: clientId });
			if (!user) {
				throwError('Wrong credentials', 400);
			}
			const isSame = await bcrypt.compare(password, user.password);
			if (!isSame) {
				throwError('Wrong credentials', 400);
			}
			code = await generateCode();
			const clientSecret = await getDb()
				.db()
				.collection('users')
				.findOne({ 'applications.clientId': user.ownerId }, { projection: { 'applications.$': 1 } });
			if (clientSecret) {
				await getDb().db().collection('verifyCode').insertOne({
					code,
					clientId: user.ownerId,
					clientSecret: clientSecret.applications[0].clientSecret,
					redirectUri,
					createdAt: new Date(),
				});
			}
			if (!clientSecret.applications[0].redirectUri.includes(redirectUri)) {
				throwError('Wrong redirect Uri', 400);
			}
			return res.redirect(`${redirectUri}?code=${code}`);
		}
		if (purpose === 'signup') {
			const hashedPwd = await bcrypt.hash(password, 12);
			const owner = await getDb()
				.db()
				.collection('users')
				.findOne({ 'applications.clientId': clientId }, { projection: { 'applications.$': 1 } });
			if (!owner) {
				throwError('No such client exists', 400);
			}
			const user = await getDb().db().collection('users').findOne({ email, ownerId: clientId });
			if (user) {
				throwError('User with that email already exists', 400);
			}
			await getDb()
				.db()
				.collection('users')
				.insertOne({
					email,
					password: hashedPwd,
					ownerId: clientId,
					fullName: email.split('@')[0],
					createdAt: new Date(),
				});
			if (!owner.applications[0].redirectUri.includes(redirectUri)) {
				throwError('Wrong redirect Uri', 400);
			}
			code = await generateCode();
			await getDb().db().collection('verifyCode').insertOne({
				code,
				clientId: clientId,
				clientSecret: owner.applications[0].clientSecret,
				redirectUri,
				createdAt: new Date(),
			});
			return res.redirect(`${redirectUri}?code=${code}`);
		}
		return res.json({ message: 'Nothing to find here' });
	} catch (error) {
		catchError(error, next);
	}
};

export const sendToken: RequestHandler = async (req, res, next) => {
	try {
		const { grant_type, code, redirect_uri, code_verifier, client_id, client_secret } = req.body;
		if (grant_type === 'code') {
			const validCode = await getDb()
				.db()
				.collection('verifyCode')
				.findOne({ code, redirectUri: redirect_uri, clientId: client_id, clientSecret: client_secret });
			if (!validCode) {
				throwError('Invalid parameters', 400);
			}
			const scope = validCode.clientSecret === process.env.ADMIN_CLIENT_SECRET ? 'createOauth' : '';
			const token = generateJwt(validCode, process.env.MAIN_JWT_SECRET, scope);
			res.json({ accessToken: token });
		}
		return res.json({ message: 'Nothing to find here' });
	} catch (error) {
		catchError(error, next);
	}
};

// return res.redirect(redirect_uri + `?error=access_denied&state=${state}&reason=invalid_response_type`);
