var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt');
var session = require('express-session');
var credentials = require('../credentials');
var { body, validationResult } = require('express-validator');

router.use(session({ secret: credentials.session.key }));

function setLock(user) {
    let failedLogin = 0;
    let unusualLogin = 0;
    let forbiddenTime = Date.now();
    if (user.failedLogin == 3) {
        failedLogin = 0;
        unusualLogin = parseInt(user.unusualLogin) + 1;
        forbiddenTime = Date.now() + 60;
    } else {
        failedLogin = parseInt(user.failedLogin) + 1;
        unusualLogin = parseInt(user.unusualLogin);
    }
    User.updateOne(
        { username: { $eq: user.username } },
        {
            $set: {
                failedLogin: failedLogin,
                unusualLogin: unusualLogin,
                forbiddenTime: forbiddenTime,
            }
        }
    )
        .then(() => {
            return true;
        })
        .catch(err => {
            console.log(err);
            return false;
        })
}

router.get('/', (req, res) => {
    if (req.session.username !== undefined) {
        return res.redirect(303, '/home');
    }
    let context = {
        title: 'Đăng nhập | BKTPay',
        layout: 'sublayout'
    }
    res.render('login', context);
});

router.post('/',
    body('user').not().isEmpty().isLength({ min: 10, max: 10 }),
    body('pass').not().isEmpty().isLength({ min: 6 }),
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty) {
            let context = {
                title: 'Đăng nhập | BKTPay',
                layout: 'sublayout',
                errors: errors.array(),
            }
            console.log(errors.array());
            res.status(401);
            return res.render('login', context);
        }
        let username = req.body.user;
        let password = req.body.pass;
        User.findOne({ username: username }, (err, row) => {
            if (err) console.log(err);
            if (row !== null) {
                if (row.unusualLogin < 2) {
                    let time = Math.round((Date.now() - row.forbiddenTime) / 1000);
                    if (time >= 60) {
                        if (row.username == username) {
                            bcrypt.compare(password, row.password, (err, result) => {
                                if (err) console.log(err);
                                if (result) {
                                    req.session.username = username;
                                    User.updateOne(
                                        {username: {$eq: username}},
                                        {
                                            $set: {
                                                failedLogin: 0,
                                                unusualLogin: 0,
                                            }
                                        }
                                    )
                                    .then(() => {
                                        if (row.isFirstLogin) {
                                            return res.redirect(303, '/changepassword');
                                        } else {
                                            return res.redirect(303, '/home');
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        let context = {
                                            title: 'Đăng nhập | BKTPay',
                                            layout: 'sublayout',
                                            errors: [
                                                'Server can not serve now'
                                            ],
                                        }
                                        res.status(500);
                                        return res.render('login', context);
                                    })
                                } else {
                                    let context = {
                                        title: 'Đăng nhập | BKTPay',
                                        layout: 'sublayout',
                                        errors: [
                                            'Password is invalid'
                                        ],
                                    }
                                    setLock(row);
                                    res.status(401);
                                    return res.render('login', context);
                                }
                            })
                        }
                    } else {
                        let context = {
                            title: 'Đăng nhập | BKTPay',
                            layout: 'sublayout',
                            errors: [
                                `Account is locked for ${time} seconds`
                            ],
                        }
                        console.log(context);
                        res.status(401);
                        return res.render('login', context);
                    }
                } else {
                    let context = {
                        title: 'Đăng nhập | BKTPay',
                        layout: 'sublayout',
                        errors: [
                            `Your account is baned. Please contact admin to unlock`
                        ],
                    }
                    console.log(context);
                    res.status(401);
                    return res.render('login', context);
                }
            } else {
                let context = {
                    title: 'Đăng nhập | BKTPay',
                    layout: 'sublayout',
                    errors: [
                        'Username is invalid'
                    ],
                }
                setLock(row);
                res.status(401);
                return res.render('login', context);
            }
        })
    });

module.exports = router;
