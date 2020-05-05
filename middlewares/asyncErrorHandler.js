// To clean up the  try catch block in the async route controllers
const asyncErrorHandler = func => (req, res, next) => 
	Promise
		.resolve(func(req, res, next))
		.catch(next);

module.exports = asyncErrorHandler;