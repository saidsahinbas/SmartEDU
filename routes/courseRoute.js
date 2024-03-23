const express = require('express');
const courseController = require('../controllers/courseController');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.route('/').post(roleMiddleware(["teacher", "admin"]), courseController.createCourse);
router.route('/').get(courseController.getAllCoureses);
router.route('/:slug').get(courseController.getCourseById);

module.exports = router;