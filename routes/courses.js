const express = require('express');
const router = express.Router({ mergeParams: true });
const {
		showAllCourses
		} = require('../controllers/courses');


router.route('/').get(showAllCourses);

module.exports = router;