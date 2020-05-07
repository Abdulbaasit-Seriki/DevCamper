const Bootcamp =  require('../models/Bootcamp.js');
const ErrorResponseHandler = require('../utils/errResponse.js');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler.js');
const geocoder = require('../utils/geocoder.js');

// description     	Get All Bootcamps
// route			GET api/v1/bootcamps/
// Authorisation	No
exports.showAllBootcamps = asyncErrorHandler (async (req, res, next) => {

	const bootcamps = await Bootcamp.find();
	res.status(200).json({success: true, count: bootcamps.length, data: bootcamps}); 
}); 


// description     	Create new Bootcamp
// route			POST api/v1/bootcamps/
// Authorisation	Yes
exports.createNewBootcamp = asyncErrorHandler (async (req, res, next) => {

	const bootcamp = await Bootcamp.create(req.body);

	res.status(201).json({ success: "true", data: bootcamp});
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

		res.status(200).json({ success: "true", data: bootcamp});
});

// description     	Update a particular Bootcamp 
// route			PUT api/v1/bootcamps/:id
// Authorisation	Yes
exports.updateBootcamp = asyncErrorHandler (async (req, res, next) => {

	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			new: true, 
			runValidator: true
		});

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

// description     	Get bootcamps within a particular radius
// route			DELETE api/v1/bootcamps/radius/:zipcode/:distance
// Authorisation	No
exports.getBootcampsWithinRadius = asyncErrorHandler (async (req, res, next) => {

	const {zipcode, distance} = req.params;

	// Get the lat and long from the geocoder
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// Calc the radius by dividing the distance by radius of the earth in km
	const radius = distance / 6738;

	// Find all bootcamps within the radius
	const bootcamps = Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [ [lng, lat], radius ] } }
	});

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps
	}); 
});
    