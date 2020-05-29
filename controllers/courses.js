const Course =  require('../models/Course.js');
const ErrorResponseHandler = require('../utils/errResponse.js');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler.js');

// description     	Get All Courses
// route			GET api/v1/courses/
// route			GET api/v1/:bootcampId/courses
// Authorisation	No
exports.showAllCourses = asyncErrorHandler(async (req, res, next) => {
	let queryString;

	if (req.params.bootcampId) {
		queryString = Course.find({ bootcamp: req.params.bootcampId });
	}
	else {
		queryString = Course.find().populate({
			path: 'bootcamp',
			select: 'name description'
		});
	}

	const courses = await queryString;

	res.status(200).json({
		success: true,
		count: courses.length,
		data: courses
	})
});