const db = require('../config/db-setup');
const errHandler = require('../utils/errorHandling');
const mongodb = require('mongodb');
const crypto = require('crypto');
const ObjectId = mongodb.ObjectID;
// const TimeStamp = mongodb.Timestamp;
// const bson = require('bson');
exports.signUp = async (req, res, next) => {
	try {
		const { email, password, fullName } = req.body;
		const user = await db.getDb().db().collection('users').findOne({ email: email });
		if (user) {
			errHandler.throwError('user with that email already exists', 400);
		}
		await db.getDb().db().collection('users').insertOne({
			email,
			password,
			fullName,
			createdAt: new Date(),
		}); // { $currentDate: { createdAt: { $type: 'timestamp' } } }

		res.json({ message: 'user successfully created' });
	} catch (error) {
		errHandler.catchError(error, next);
	}
};

exports.createApplication = async (req, res, next) => {
	try {
		const { appName, redirectUrl } = req.body;
		const clientIdBuffer = await crypto.randomBytes(12);
		const clientId = clientIdBuffer.toString('hex');
		const clientSecretBuffer = await crypto.randomBytes(12);
		const clientSecret = clientSecretBuffer.toString('hex');
		const user = await db
			.getDb()
			.db()
			.collection('users') // here will go req.userId
			.updateOne({_id: new ObjectId('60d899a5673e50057c6b2943')}, { $push: { applications: { appName, redirectUri: redirectUrl, clientSecret, clientId } } });
		console.log(user.modifiedCount);
        if(user.modifiedCount == 0) {
            errHandler.throwError('No user found', 400); 
        }
		res.json({ message: 'Oauth application added successfully' });
	} catch (error) {
		errHandler.catchError(error, next);
	}
};

exports.authorizeCode = (req, res, next) => {
	const { response_type, client_id, redirect_uri, scope, state, code_challenge, code_challenge_method } = req.qeury;
	if (response_type !== 'code') {
		return res.redirect(redirect_uri + `?error=access_denied&state=${state}&reason=invalid_response_type`);
	}

	res.json({ message: 'auth flow started successfully' });
};
