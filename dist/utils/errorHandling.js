"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = exports.throwError = void 0;
var throwError = function (message, statusCode) {
    var error = new Error(message);
    error.statusCode = statusCode;
    throw error;
};
exports.throwError = throwError;
var catchError = function (error, next) {
    if (!error.message)
        error.message = 'Server error';
    return next(error);
};
exports.catchError = catchError;
