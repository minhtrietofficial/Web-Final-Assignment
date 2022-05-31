var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt');
var session = require('express-session');
var credentials = require('../credentials');
var { body, validationResult } = require('express-validator');

router.use(session({ secret: credentials.session.key }));

router.get('/', (req, res) => {
    if (req.session.username === undefined) {
        return res.redirect(303, '/login');
    }
    let context = {
        title: 'Đổi mật khẩu | BKTPay',
        layout: 'sublayout'
    }
    res.render('changepassword', context);
});

router.get('/user', (req, res) => {
    let context = {
        title: 'Đổi mật khẩu | BKTPay',
        layout: 'sublayout'
    }
    res.render('changepassword_user', context);
});

router.post('/',
    body('password').not().isEmpty().isLength({ min: 6 }),
    (req, res) => {
        console.log(1)
        let errors = validationResult(req);
        if (!errors.isEmpty) {
            let context = {
                title: 'Đổi mật khẩu | BKTPay',
                layout: 'sublayout',
                errors: errors.array(),
            }
            console.log(errors.array());
            res.status(401);
            return res.render('changepassword', context);
        }
        if (req.session.username === undefined) return res.redirect(303, '/login');
        let username = req.session.username;
        let password = req.body.password;
        User.findOne({ username: username }, (err, row) => {
            if (err) console.log(err);
            if (row !== null) {
                bcrypt.genSalt(10, function (err, salt) {
                    if (err) console.log(err);
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) console.log(err);
                        User.updateOne(
                            { username: { $eq: username } },
                            {
                                $set: {
                                    password: hash,
                                    isFirstLogin: false,
                                }
                            }
                        )
                            .then(() => {
                                res.redirect(303, '/home');
                            })
                            .catch(err => {
                                req.session.username = undefined;
                                return res.render('announce', {
                                    title: 'Thông báo | BKTPay',
                                    layout: 'sublayout',
                                    content: err,
                                    Nameresult: 'Đổi mật khẩu không thành công',
                                });
                            })
                    });
                });
            } else {
                let context = {
                    title: 'Đổi mật khẩu | BKTPay',
                    layout: 'sublayout',
                    errors: [
                        'Username is invalid'
                    ],
                    Nameresult: 'Đổi mật khẩu thất bại',
                }
                res.status(401);
                return res.render('changepassword', context);
            }
        });
    });

module.exports = router;
