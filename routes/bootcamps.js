const express = require('express');
const router = express.Router();
const { showAllBootcamps, showBootcamp, createNewBootcamp, updateBootcamp, deleteBootcamp } = require('../controllers/bootcamps');

router.route('/').get(showAllBootcamps).post(createNewBootcamp);
router.route('/:id').get(showBootcamp).put(updateBootcamp).delete(deleteBootcamp);
module.exports = router;