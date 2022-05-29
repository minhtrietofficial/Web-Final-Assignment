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
        return res.redirect(303, '/home');
    }
    let context = {
        title: 'Login | BKTPay',
        layout: 'sublayout'
    }
    res.render('login', context);
});

router.post('/',
    body('user').not().isEmpty().length({ min: 10, max: 10 }),
    body('pass').not().isEmpty().length({ min: 6 }),
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty) {
            let context = {
                title: 'Login | BKTPay',
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
                if (row.username == username) {
                    bcrypt.compare(password, row.password, (err, result) => {
                        if (err) console.log(err);
                        if (result) {
                            req.session.username = username;
                            if (row.isFirstLogin) {
                                return res.redirect(303, '/changepassword');
                            } else {
                                return res.redirect(303, '/home');
                            }
                        } else {
                            let context = {
                                title: 'Login | BKTPay',
                                layout: 'sublayout',
                                errors: [
                                    'Password is invalid'
                                ],
                            }
                            res.status(401);
                            return res.render('login', context);
                        }
                    })
                }
            } else {
                let context = {
                    title: 'Login | BKTPay',
                    layout: 'sublayout',
                    errors: [
                        'Username is invalid'
                    ],
                }
                res.status(401);
                return res.render('login', context);
            }
        })
    });

module.exports = router;
