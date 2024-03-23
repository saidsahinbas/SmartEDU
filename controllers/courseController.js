const Course = require('../models/Course');
const Category = require('../models/Category');
const moment = require('moment');

exports.createCourse = async (req, res) => {
    try {
        const course = await Course.create({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            user: req.session.userID
        });

        res.status(201).redirect('/courses')
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error
        })
    }
};

exports.getAllCoureses = async (req, res) => {
    try {
        const categorySlug = req.query.categories;
        const category = await Category.findOne({ slug: categorySlug });

        let filter = {};

        if (categorySlug) {
            filter = { category: category._id }
        }

        const courses = await Course.find(filter).sort('-createdAt');
        const categories = await Category.find();

        res.status(200).render('courses', {
            courses,
            page_name: 'courses',
            categories
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error
        })
    }
}

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug }).populate('user');
        const month = moment(course.createdAt).format("MMMM");
        const categories = await Category.find({});
        res.status(200).render('course-single', {
            course,
            page_name: 'courses',
            categories,
            month
        });


    } catch (error) {
        res.status(400).json({
            staus: 'fail',
            error
        })
    }
}