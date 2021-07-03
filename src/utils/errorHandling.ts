import { NextFunction } from 'express';

export interface ErrorObject {
	message?: string;
	statusCode?: number;
}

export const throwError = (message: string, statusCode: number): never => {
	const error: ErrorObject = new Error(message);
	error.statusCode = statusCode;
	throw error;
};

export const catchError = (error: ErrorObject, next: any): NextFunction => {
	if (!error.message) error.message = 'Server error';
	return next(error);
};
