class ErrorResponseHandler extends Error {
	constructor(message, statusCode) {
		// The message propery of this object should be equal to the message property of the main 
		// Error object in javascript
		super(message);
		this.statusCode = statusCode;
	}
}

module.exports = ErrorResponseHandler;