const express = require('express');
const router = express.Router(); 
const {
		showAllBootcamps, 
		showBootcamp, 
		createNewBootcamp, 
		updateBootcamp, 
		deleteBootcamp,
		getBootcampsWithinRadius 
		} = require('../controllers/bootcamps');

// Bringing in the resource routers
const courseRouter = require('./courses.js');
   
// Reroute any query that has the following URL to the specified router
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsWithinRadius);
router.route('/').get(showAllBootcamps).post(createNewBootcamp);
router.route('/:id').get(showBootcamp).put(updateBootcamp).delete(deleteBootcamp);
module.exports = router;  