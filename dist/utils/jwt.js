"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwt = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var generateJwt = function (user, secret, scope) {
    try {
        var token = jsonwebtoken_1.default.sign({ id: user.id, scope: scope }, secret);
        return [null, token];
    }
    catch (err) {
        console.log(err);
        return [err, null];
    }
};
exports.generateJwt = generateJwt;
