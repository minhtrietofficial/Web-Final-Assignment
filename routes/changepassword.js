var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt');
var session = require('express-session');
var credentials = require('../credentials');
var { body, validationResult } = require('express-validator');

router.use(session({ secret: credentials.session.key }));

router.get('/', (req, res) => {
    if (req.session.username !== undefined) {
        return res.redirect(303, '/login');
    }
    let context = {
        title: 'Change Password | BKTPay',
        layout: 'sublayout'
    }
    res.render('changepassword', context);
});

router.post('/',
    body('password').not().isEmpty().length({ min: 6 }),
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty) {
            let context = {
                title: 'Change Password | BKTPay',
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
                                }
                            }
                        )
                            .then(() => {
                                row.isFirstLogin = false;
                                res.redirect(303, '/home');
                            })
                            .catch(err => {
                                req.session.username = undefined;
                                return res.render('announce', {
                                    title: 'Login | BKTPay',
                                    layout: 'sublayout',
                                    content: err,
                                });
                            })
                    });
                });
            } else {
                let context = {
                    title: 'Change Password | BKTPay',
                    layout: 'sublayout',
                    errors: [
                        'Username is invalid'
                    ],
                }
                res.status(401);
                return res.render('changepassword', context);
            }
        });
    });

module.exports = router;