"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var errorHandling_1 = require("../utils/errorHandling");
// interface DecodedToken {
// 	userId: string;
// }
var isAuth = function (req, res, next) {
    try {
        var decodedToken = void 0;
        var authHeader = req.get('Authorization');
        if (!authHeader) {
            errorHandling_1.throwError('Authenticate first', 400);
        }
        else {
            var token = authHeader.split(' ')[1];
            try {
                decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
                console.log(decodedToken);
            }
            catch (error) {
                errorHandling_1.throwError('Authenticate first', 400);
            }
            if (!decodedToken) {
                errorHandling_1.throwError('Authenticate first', 400);
            }
            else {
                if (typeof decodedToken !== 'string' && 'userId' in decodedToken)
                    req.userId = decodedToken.userId;
                next();
            }
        }
    }
    catch (error) {
        errorHandling_1.catchError(error, next);
    }
};
exports.isAuth = isAuth;
