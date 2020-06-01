const express = require('express');
const router = express.Router({ mergeParams: true });
const {
		showAllCourses,
		getCourse,
		createCourse,
		updateCourse
		} = require('../controllers/courses');


router.route('/').get(showAllCourses).post(createCourse);
router.route('/:id').get(getCourse).put(updateCourse);

module.exports = router;