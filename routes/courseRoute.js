const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

router.route('/').post(courseController.createCourse);
router.route('/').get(courseController.getAllCoureses);
router.route('/:slug').get(courseController.getCourseById);

module.exports = router;