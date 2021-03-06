"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.sendCode = exports.authorizeCode = exports.createApplication = exports.signUp = void 0;
var db_setup_1 = require("../config/db-setup");
var errorHandling_1 = require("../utils/errorHandling");
var generateCrypto_1 = require("../utils/generateCrypto");
var user_1 = __importDefault(require("../models/user"));
var oauthapplication_1 = __importDefault(require("../models/oauthapplication"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var jwt_1 = require("../utils/jwt");
var crypto_1 = __importDefault(require("crypto"));
// const TimeStamp = mongodb.Timestamp;
// const bson = require('bson');
var signUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, fullName, _b, user, error1, newUser, _c, error, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password, fullName = _a.fullName;
                return [4 /*yield*/, user_1.default.findUserByEmail(email)];
            case 1:
                _b = _d.sent(), user = _b[0], error1 = _b[1];
                if (error1) {
                    errorHandling_1.throwError('adding user failed', 500);
                }
                if (user) {
                    errorHandling_1.throwError('user with that email already exists', 400);
                }
                newUser = new user_1.default(email, password, fullName);
                return [4 /*yield*/, newUser.addUser()];
            case 2:
                _c = _d.sent(), error = _c[1];
                if (error) {
                    errorHandling_1.throwError('adding user failed', 500);
                }
                res.json({ message: 'user successfully created' });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _d.sent();
                errorHandling_1.catchError(error_1, next);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.signUp = signUp;
var createApplication = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, appName, redirectUrl, _b, clientId, clientSecret, oauthApp, _c, user, error, error_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _a = req.body, appName = _a.appName, redirectUrl = _a.redirectUrl;
                return [4 /*yield*/, generateCrypto_1.clientCredentials()];
            case 1:
                _b = _d.sent(), clientId = _b[0], clientSecret = _b[1];
                oauthApp = new oauthapplication_1.default(appName, clientId, clientSecret, redirectUrl);
                return [4 /*yield*/, oauthApp.addOauthApp('req.userId')];
            case 2:
                _c = _d.sent(), user = _c[0], error = _c[1];
                if (error) {
                    errorHandling_1.throwError('adding oauth app failed', 500);
                }
                if (user && 'modifiedCount' in user && user.modifiedCount == 0) {
                    errorHandling_1.throwError('No user found', 400);
                }
                res.json({ message: 'Oauth application added successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _d.sent();
                errorHandling_1.catchError(error_2, next);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createApplication = createApplication;
var authorizeCode = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, response_type, client_id, redirect_uri, scope, state, code_challenge, code_challenge_method, hashed_code_challenge, _b, redirectUrl, error, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.query, response_type = _a.response_type, client_id = _a.client_id, redirect_uri = _a.redirect_uri, scope = _a.scope, state = _a.state, code_challenge = _a.code_challenge, code_challenge_method = _a.code_challenge_method;
                hashed_code_challenge = void 0;
                if (response_type !== 'code') {
                    errorHandling_1.throwError('Only response type code available', 403);
                }
                if (!(typeof client_id == 'string' && typeof redirect_uri == 'string')) return [3 /*break*/, 2];
                return [4 /*yield*/, oauthapplication_1.default.matchRedirectUrl(client_id, redirect_uri)];
            case 1:
                _b = _c.sent(), redirectUrl = _b[0], error = _b[1];
                console.log(redirectUrl);
                if (error) {
                    errorHandling_1.throwError(error, 400);
                }
                _c.label = 2;
            case 2:
                if (code_challenge_method !== 'sha256') {
                    errorHandling_1.throwError('this hashing algorithm is not supported', 400);
                }
                if (code_challenge && code_challenge_method == 'sha256') {
                    hashed_code_challenge = crypto_1.default
                        .createHash(code_challenge_method)
                        .update(code_challenge.toString())
                        .digest('base64');
                }
                res.render('login.ejs', {
                    clientId: client_id,
                    redirectUri: redirect_uri,
                    code_challenge: hashed_code_challenge,
                    code_challenge_method: code_challenge_method,
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _c.sent();
                errorHandling_1.catchError(error_3, next);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.authorizeCode = authorizeCode;
var sendCode = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, clientId, redirectUri, code_challenge, code_challenge_method, purpose, code, user, isSame, clientSecret, hashedPwd, owner, user, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 15, , 16]);
                _a = req.body, email = _a.email, password = _a.password, clientId = _a.clientId, redirectUri = _a.redirectUri, code_challenge = _a.code_challenge, code_challenge_method = _a.code_challenge_method;
                purpose = req.query.purpose;
                code = void 0;
                if (!(purpose === 'login')) return [3 /*break*/, 7];
                return [4 /*yield*/, db_setup_1.getDb().db().collection('users').findOne({ email: email, ownerId: clientId })];
            case 1:
                user = _b.sent();
                if (!user) {
                    errorHandling_1.throwError('Wrong credentials', 400);
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 2:
                isSame = _b.sent();
                if (!isSame) {
                    errorHandling_1.throwError('Wrong credentials', 400);
                }
                return [4 /*yield*/, generateCrypto_1.generateCode()];
            case 3:
                code = _b.sent();
                return [4 /*yield*/, db_setup_1.getDb()
                        .db()
                        .collection('users')
                        .findOne({ 'applications.clientId': user.ownerId }, { projection: { 'applications.$': 1 } })];
            case 4:
                clientSecret = _b.sent();
                if (!clientSecret) return [3 /*break*/, 6];
                return [4 /*yield*/, db_setup_1.getDb().db().collection('verifyCode').insertOne({
                        code: code,
                        clientId: user.ownerId,
                        clientSecret: clientSecret.applications[0].clientSecret,
                        redirectUri: redirectUri,
                        createdAt: new Date(),
                        codeChallenge: code_challenge,
                        codeMethod: code_challenge_method,
                    })];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                if (!clientSecret.applications[0].redirectUri.includes(redirectUri)) {
                    errorHandling_1.throwError('Wrong redirect Uri', 400);
                }
                return [2 /*return*/, res.redirect(redirectUri + "?code=" + code)];
            case 7:
                if (!(purpose === 'signup')) return [3 /*break*/, 14];
                return [4 /*yield*/, bcrypt_1.default.hash(password, 12)];
            case 8:
                hashedPwd = _b.sent();
                return [4 /*yield*/, db_setup_1.getDb()
                        .db()
                        .collection('users')
                        .findOne({ 'applications.clientId': clientId }, { projection: { 'applications.$': 1 } })];
            case 9:
                owner = _b.sent();
                if (!owner) {
                    errorHandling_1.throwError('No such client exists', 400);
                }
                return [4 /*yield*/, db_setup_1.getDb().db().collection('users').findOne({ email: email, ownerId: clientId })];
            case 10:
                user = _b.sent();
                if (user) {
                    errorHandling_1.throwError('User with that email already exists', 400);
                }
                return [4 /*yield*/, db_setup_1.getDb()
                        .db()
                        .collection('users')
                        .insertOne({
                        email: email,
                        password: hashedPwd,
                        ownerId: clientId,
                        fullName: email.split('@')[0],
                        createdAt: new Date(),
                        codeChallenge: code_challenge,
                        codeMethod: code_challenge_method,
                    })];
            case 11:
                _b.sent();
                if (!owner.applications[0].redirectUri.includes(redirectUri)) {
                    errorHandling_1.throwError('Wrong redirect Uri', 400);
                }
                return [4 /*yield*/, generateCrypto_1.generateCode()];
            case 12:
                code = _b.sent();
                return [4 /*yield*/, db_setup_1.getDb().db().collection('verifyCode').insertOne({
                        code: code,
                        clientId: clientId,
                        clientSecret: owner.applications[0].clientSecret,
                        redirectUri: redirectUri,
                        createdAt: new Date(),
                    })];
            case 13:
                _b.sent();
                return [2 /*return*/, res.redirect(redirectUri + "?code=" + code)];
            case 14: return [2 /*return*/, res.json({ message: 'Nothing to find here' })];
            case 15:
                error_4 = _b.sent();
                errorHandling_1.catchError(error_4, next);
                return [3 /*break*/, 16];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.sendCode = sendCode;
var sendToken = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, grant_type, code, redirect_uri, code_verifier, client_id, client_secret, validCode, _b, pkceError, pkce, scope, _c, error, token, error_5;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _a = req.body, grant_type = _a.grant_type, code = _a.code, redirect_uri = _a.redirect_uri, code_verifier = _a.code_verifier, client_id = _a.client_id, client_secret = _a.client_secret;
                if (!(grant_type === 'code')) return [3 /*break*/, 2];
                return [4 /*yield*/, db_setup_1.getDb()
                        .db()
                        .collection('verifyCode')
                        .findOne({ code: code, redirectUri: redirect_uri, clientId: client_id, clientSecret: client_secret })];
            case 1:
                validCode = _d.sent();
                if (!validCode) {
                    errorHandling_1.throwError('Invalid parameters', 400);
                }
                _b = generateCrypto_1.comparePkce(code_verifier, validCode.codeChallenge, validCode.codeMethod), pkceError = _b[0], pkce = _b[1];
                if (pkceError) {
                    errorHandling_1.throwError(pkceError.message, 400);
                }
                if (!pkce) {
                    errorHandling_1.throwError('pkce values dont match', 400);
                }
                scope = validCode.clientSecret == process.env.ADMIN_CLIENT_SECRET ? 'createOauth' : '';
                _c = jwt_1.generateJwt(validCode, process.env.MAIN_JWT_SECRET, scope), error = _c[0], token = _c[1];
                if (error) {
                    errorHandling_1.throwError(error.message, 400);
                }
                return [2 /*return*/, res.json({ accessToken: token })];
            case 2: return [2 /*return*/, res.json({ message: 'Nothing to find here' })];
            case 3:
                error_5 = _d.sent();
                errorHandling_1.catchError(error_5, next);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendToken = sendToken;
// return res.redirect(redirect_uri + `?error=access_denied&state=${state}&reason=invalid_response_type`);
