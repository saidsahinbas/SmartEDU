const moment = require('moment');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const Category = require('../models/Category');
const bcrypt = require('bcrypt');
const Course = require('../models/Course');

exports.createUser = async (req, res) => {
    try {
        await User.create(req.body);

        res.status(201).redirect('/login');
    } catch (error) {
        const errors = validationResult(req);
        console.log(errors);
        console.log(errors.array()[0].msg);

        for (let i = 0; i < errors.array().length; i++) {
            req.flash("error", `${errors.array()[i].msg}`)
        }

        res.status(400).redirect('/register');
    }
};


exports.loginUser = async (req, res) => {

    const { email, password } = req.body;

    await User.findOne({ email }).then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    req.session.userID = user._id;
                    res.status(200).redirect('/users/dashboard');
                } else {
                    req.flash("error", `Your password is not correct`);
                    res.status(400).redirect('/login')
                }
            });
        } else {
            req.flash("error", `User is not exist`);
            res.status(400).redirect('/login')
        }
    }).catch(error => {

        res.status(404).redirect('/register');
    })
};


exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
};

exports.getDashboardPage = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userID }).populate('courses');
    const categories = await Category.find({});
    const courses = await Course.find({ user: req.session.userID });
    const users = await User.find({});
    res.status(200).render('dashboard', {
        page_name: 'dashboard',
        categories,
        user,
        courses,
        users
    });
};


exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        await Course.deleteMany({ user: req.params.id });

        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            error
        })
    }
}
