exports.throwError = (message, statusCode) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	throw error;
};

exports.catchError = (error, next) => {
	if (!error.message) error.message = 'ვერ მოხერხდა განცხადებების მოძებნა, ცადეთ მოგვიანებით';
	return next(error);
};
