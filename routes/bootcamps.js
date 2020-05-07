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


router.route('/radius/:zipcode/:distance').get(getBootcampsWithinRadius);
router.route('/').get(showAllBootcamps).post(createNewBootcamp);
router.route('/:id').get(showBootcamp).put(updateBootcamp).delete(deleteBootcamp);
module.exports = router;