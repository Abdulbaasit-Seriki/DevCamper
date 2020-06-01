const Course =  require('../models/Course.js');
const Bootcamp =  require('../models/Bootcamp.js');
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


// description     	Get A Course
// route			GET api/v1/courses/:id
// Authorisation	No
exports.getCourse = asyncErrorHandler(async (req, res, next) => {
	
	const course = await Course.findById(req.params.id).populate({
		path: "bootcamp",
		select: 'name description'
	});

	if (!course) {
		return next(new ErrorResponseHandler(`Course with id ${req.params.id} couldn't be found`), 404);
	}

	res.status(200).json({
		success: true,
		data: course
	})
});

// description     	Create A Course
// route			POST api/v1/bootcamps/:bootcampId/courses/
// Authorisation	Yes
exports.createCourse = asyncErrorHandler(async (req, res, next) => {
	
	req.body.bootcamp = req.params.bootcampId; // Coz there is a bootcamp field in the course model
	console.log(req.body.bootcamp); 
	const bootcamp = await Bootcamp.findById(req.params.bootcampId);

	if (!bootcamp) {
		return next(new ErrorResponseHandler(`Bootcamp with id ${req.params.bootcampId} couldn't be found`),
		404);
	}

	const course =  await Course.create(req.body);

	res.status(200).json({
		success: true,
		data: course
	})
});

// description     	Update Course
// route			PUT api/v1/courses/:id
// Authorisation	Yes
exports.updateCourse = asyncErrorHandler(async (req, res, next) => {
	
	let course = await Course.findById(req.params.id);

	if (!course) {
		return next(new ErrorResponseHandler(`Course with id ${req.params.id} couldn't be found`),
		404);
	}

	course =  await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});

	res.status(200).json({
		success: true,
		data: course
	})
});