const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);

        res.status(201).json({
            status: 'success',
            user
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error
        })
    }
};


exports.loginUser = async (req, res) => {

    const { email, password } = req.body;

    await User.findOne({ email }).then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    req.session.userID = user._id;
                    res.status(200).redirect('/');
                }
            });
        }
    }).catch(err => {
        res.status(404).json({
            status: 'fail',
            err
        })
    })
};


exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
};
