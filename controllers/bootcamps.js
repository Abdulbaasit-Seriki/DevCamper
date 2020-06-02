const Bootcamp =  require('../models/Bootcamp.js');
const ErrorResponseHandler = require('../utils/errResponse.js');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler.js');
const geocoder = require('../utils/geocoder.js');

// description     	Get All Bootcamps
// route			GET api/v1/bootcamps/
// Authorisation	No
exports.showAllBootcamps = asyncErrorHandler (async (req, res, next) => {

	// Add filters to the search in form of a query string
	const requestQuery = {...req.query};
	let query;
	const paramsToBeRemoved = ['filter', 'sort', 'page', 'limit'];

	// Delete the specified fields from the query string
	paramsToBeRemoved.forEach( param => delete requestQuery[param]);

	// Creating queryString
	let queryString = JSON.stringify(requestQuery);

	// Making query dtring operators like $gt(>) $lt(>) $gte, $lte
	queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`)

	query = Bootcamp.find(JSON.parse(queryString)).populate({
		path: 'courses',
		select: 'title description weeks'
	});

	// Use the filters to pick the firlds to be displayed
	if (req.query.filter) {
		const filters = req.query.filter.split(',').join(' ');
		query = query.select(filters);
	}

	// Sort. - represents descending order + ascending order
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	}
	else {
		query = query.sort("-createdAt"); 
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	// To tell mongo how many pages to skip, in this case 0 pages
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const totalDocuments = await Bootcamp.countDocuments();


	query = query.skip(startIndex).limit(limit);

	const pagination = {};

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit
		}
	}

	if (endIndex < totalDocuments) {
		pagination.next = {
			page: page + 1,
			limit
		}
	}

	const bootcamps = await query;
	res.status(200).json({success: true, count: bootcamps.length, count: bootcamps.length, pagination, data: bootcamps}); 
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

	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(new ErrorResponseHandler(`Bootcamp not found with an id of ${req.params.id}`), 404);
	}

	bootcamp.remove();

	res.status(200).json({ success: true, data: {
		msg: `Bootcamp Successfully Deleted`
	} });
});

// description     	Get bootcamps within a particular radius
// route			DELETE api/v1/bootcamps/radius/:zipcode/:distance
// Authorisation	No
exports.getBootcampsWithinRadius = asyncErrorHandler (async (req, res, next) => {

	const { zipcode, distance } = req.params;

	  // Get lat/lng from geocoder
	  const loc = await geocoder.geocode(zipcode);
	  const lat = loc[0].latitude;
	  const lng = loc[0].longitude;

	  // Calc radius using radians
	  // Divide dist by radius of Earth
	  // Earth Radius = 3,963 mi / 6,378 km
	  const radius = distance / 3963;

	  const bootcamps = await Bootcamp.find({
	    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
	  });

	  res.status(200).json({
	    success: true,
	    count: bootcamps.length,
	    data: bootcamps
	  });
});
