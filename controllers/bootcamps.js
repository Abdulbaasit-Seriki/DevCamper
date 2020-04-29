// description     	Get All Bootcamps
// route			GET api/v1/bootcamps/
// Authorisation	No
exports.showAllBootcamps = (req, res, next) => {
	res.status(200).json({ success: "true", message: `Show all bootcamps`});
};

// description     	Get one particular Bootcamp
// route			GET api/v1/bootcamps/:id
// Authorisation	No
exports.showBootcamp = (req, res, next) => {
	res.status(200).json({ success: "true", message: `Show bootcamp with an of ${req.params.id}` });
};

// description     	Create new Bootcamp
// route			POST api/v1/bootcamps/
// Authorisation	Yes
exports.createNewBootcamp = (req, res, next) => {
	res.status(200).json({ success: "true", message: `Add a new bootcamp`});
};

// description     	Update a particular Bootcamp
// route			PUT api/v1/bootcamps/:id
// Authorisation	Yes
exports.updateBootcamp = (req, res, next) => {
	res.status(200).json({ success: "true", message: `Update bootcamp with an id of ${req.params.id}`});
};

// description     	Delete a particular Bootcamp
// route			DELETE api/v1/bootcamps/:id
// Authorisation	Yes
exports.deleteBootcamp = (req, res, next) => {
	res.status(200).json({ success: "true", message: `Delete bootcamp with an id of ${req.params.id}`});
};
