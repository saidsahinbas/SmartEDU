const Course = require('../models/Course');
const Category = require('../models/Category');
const moment = require('moment');
const User = require('../models/User');

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

        const query = req.query.search;

        let filter = {};

        if (categorySlug) {
            filter = { category: category._id }
        }

        if (query) {
            filter = { name: query };
        }

        if (!query && !categorySlug) {
            filter.name = '';
            filter.category = null;
        }

        const courses = await Course.find({
            $or: [
                { name: { $regex: '.*' + filter.name + '.*', $options: 'i' } },
                { category: filter.category }
            ]
        }).sort('-createdAt').populate('user');
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
        const user = await User.findById(req.session.userID);
        const course = await Course.findOne({ slug: req.params.slug }).populate('user');
        const month = moment(course.createdAt).format("MMMM");
        const categories = await Category.find({});
        res.status(200).render('course-single', {
            course,
            page_name: 'courses',
            categories,
            month,
            user
        });


    } catch (error) {
        res.status(400).json({
            staus: 'fail',
            error
        })
    }
}

exports.enrollCourse = async (req, res) => {
    try {
        const user = await User.findById(req.session.userID);
        await user.courses.push({ _id: req.body.course_id });
        await user.save();
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            staus: 'fail',
            error
        })
    }
}

exports.releaseCourse = async (req, res) => {
    try {
        const user = await User.findById(req.session.userID);
        await user.courses.pull({ _id: req.body.course_id });
        await user.save();
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            staus: 'fail',
            error
        })
    }
}

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndDelete({ slug: req.params.slug });
        req.flash("success", `${course.name} removed successfully`);
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            error
        })
    }
}

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug });
        course.name = req.body.name;
        course.description = req.body.description;
        course.category = req.body.category;
        course.save();

        req.flash("success", `${course.name} updated successfully`);
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            error
        })
    }
}
