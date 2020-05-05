const Bootcamp =  require('../models/Bootcamp.js');
const ErrorResponseHandler = require('../utils/errResponse.js');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler.js');

// description     	Get All Bootcamps
// route			GET api/v1/bootcamps/
// Authorisation	No
exports.showAllBootcamps = asyncErrorHandler (async (req, res, next) => {

	const bootcamps = await Bootcamp.find();
	res.status(200).json({success: true, data: bootcamps}); 
}); 


// description     	Create new Bootcamp
// route			POST api/v1/bootcamps/
// Authorisation	Yes
exports.createNewBootcamp = asyncErrorHandler (async (req, res, next) => {

	req.on("data",  async data => {

		const parsedBootcamp = JSON.parse(data.toString("utf8").split("&"));

		console.log(parsedBootcamp);

		// Save the bootcamp to the database 
		const bootcamp = await Bootcamp.create(parsedBootcamp);
		

		// It is 201 because the data is a resource
		res.status(201).json({ success: "true", data: bootcamp});
	});
});

// description     	Get one particular Bootcamp
// route			GET api/v1/bootcamps/:id
// Authorisation	No
exports.showBootcamp = asyncErrorHandler (async (req, res, next) => {

		console.log(req.params.id);
		const bootcamp = await Bootcamp.findById(req.params.id);

		// If the id is well formattedd but not correct
		if (!bootcamp) {
			return next(new ErrorResponseHandler(`Bootcamp not found with an id of ${req.params.id}`), 404);
		}
});

// description     	Update a particular Bootcamp 
// route			PUT api/v1/bootcamps/:id
// Authorisation	Yes
exports.updateBootcamp = asyncErrorHandler (async (req, res, next) => {

		console.log(req.body);
		const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			new: true, 
			runValidator: true
		});

		if (!bootcamp) {
			return next(new ErrorResponseHandler(`Bootcamp not found with an id of ${req.params.id}`), 404);
		} 

		res.status(200).json({ success: true, data: bootcamp });
});

// description     	Delete a particular Bootcamp
// route			DELETE api/v1/bootcamps/:id
// Authorisation	Yes
exports.deleteBootcamp = asyncErrorHandler (async (req, res, next) => {

	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

	if (!bootcamp) {
		return next(new ErrorResponseHandler(`Bootcamp not found with an id of ${req.params.id}`), 404);
	}

	res.status(200).json({ success: true, data: {
		msg: `Bootcamp Successfully Deleted`
	} });
});
    