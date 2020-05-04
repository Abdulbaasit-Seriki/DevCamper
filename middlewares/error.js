const ErrorResponseHandler = require('../utils/errResponse.js');

const errorHandler = (err, req, res, next) => {
	let error = {...err};
	error.message = err.message;

	// The .red will give it a red color coz I'm using the colors package
	console.log(err);

	// If the ID of the resource provided is wrong
	if (err.name === "CastError") {
		const message = `Bootcamp not found with an id of ${err.value}`;
		error = new ErrorResponseHandler(message, 404);
	}

	// If there's a duplicate key
	if (err.code === 11000) {
		const message = `Duplicate key entered`;
		error = new ErrorResponseHandler(message, 400);
	}

	// Mongoose Validation Error
	if (err.name === "ValidationError") {
		const message = Object.values(err.error).map(value => value.message);
		error = new ErrorResponseHandler(message, 400);
	}

	res.status(error.statusCode || 500).json({
		success: false, 
		err: error.message || `Server Error`
	});
};

module.exports = ErrorResponseHandler;