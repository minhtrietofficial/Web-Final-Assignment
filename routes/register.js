var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: '../public/uploads/' });
var fs = require('fs');
var path = require('path');
var { body, validationResult } = require('express-validator');
var User = require('../models/user');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var credentials = require('../credentials');

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: credentials.mailer.gmail.username,
        pass: credentials.mailer.gmail.password,
    },
});

router.get('/', (req, res) => {
    if (req.session.username !== undefined) {
        return res.redirect(303, '/home');
    }
    let context = {
        title: 'Register | BKTPay',
        layout: 'sublayout'
    }
    res.render('register', context);
});

router.post('/',
    upload.fields([
        { name: 'frontnationalid', maxCount: 1 },
        { name: 'backnationalid', maxCount: 1 }
    ]),
    body('firstname').not().isEmpty().isLength({ min: 6, max: 30 }),
    body('lastname').not().isEmpty().isLength({ min: 2, max: 20 }),
    body('birthdate').not().isEmpty().isDate({ format: 'YYYY-MM-DD' }),
    body('gender').not().isEmpty().isLength({ min: 2, max: 4 }),
    body('address').not().isEmpty().isLength({ max: 100 }),
    body('numberphone').not().isEmpty().isLength({ min: 10, max: 10 }),
    body('email').not().isEmpty(),
    (req, res, next) => {
        let frontnationalid = req.files['frontnationalid'][0];
        let backnationalid = req.files['backnationalid'][0];
        if (frontnationalid !== undefined && backnationalid !== undefined) {
            next();
        } else {
            let context = {
                title: 'Register | BKTPay',
                layout: 'sublayout',
                errors: 'front or back of national id is empty',
            }
            console.log('not image');
            res.status(401);
            return res.render('register', context);
        }
    },
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            let context = {
                title: 'Register | BKTPay',
                layout: 'sublayout',
                errors: errors.array(),
            }
            console.log(errors.array());
            res.status(401);
            return res.render('register', context);
        }
        let username = '';
        let password = '';
        let firstName = req.body.firstname;
        let lastName = req.body.lastname;
        let birthdate = req.body.birthdate;
        let gender = req.body.gender;
        let address = req.body.address;
        let email = req.body.email;
        let numberphone = req.body.numberphone;
        const maxNumber = 10;
        while (1) {
            if (username.length < maxNumber) {
                username += Math.floor(Math.random() * maxNumber);
                if (password.length < 6) {
                    password += Math.floor(Math.random() * maxNumber);
                }
                continue;
            }
            User.findOne({ username: username }, (err, row) => {
                if (err) console.log(err);
                if (row === undefined) {
                    username = '';
                    password = '';
                } else {
                    let frontnationalid = req.files['frontnationalid'][0];
                    let backnationalid = req.files['backnationalid'][0];
                    let user_path = path.join('.', 'public', 'uploads', 'national_id', username);
                    let front_path = path.join(user_path, 'front.png');
                    let back_path = path.join(user_path, 'back.png');
                    fs.mkdir(user_path, err => {
                        if (err) {
                            return res.render('announce', {
                                title: 'Register | BKTPay',
                                layout: 'sublayout',
                                content: 'You has been signed up not successfully<br>Please sign up again!',
                            });
                        } else {
                            fs.rename(frontnationalid.path, front_path, err => {
                                if (err) {
                                    return res.render('announce', {
                                        title: 'Register | BKTPay',
                                        layout: 'sublayout',
                                        content: 'You has been signed up not successfully<br>Please sign up again!',
                                    });
                                } else {
                                    fs.rename(backnationalid.path, back_path, err => {
                                        if (err) {
                                            fs.unlink(front_path);
                                            return res.render('announce', {
                                                title: 'Register | BKTPay',
                                                layout: 'sublayout',
                                                content: 'You has been signed up not successfully<br>Please sign up again!',
                                            });
                                        } else {
                                            bcrypt.genSalt(10, function (err, salt) {
                                                if (err) console.log(err);
                                                bcrypt.hash(password, salt, function (err, hash) {
                                                    if (err) console.log(err);
                                                    User.insertMany(
                                                        {
                                                            username: username,
                                                            password: hash,
                                                            firstName: firstName,
                                                            lastName: lastName,
                                                            gender: gender,
                                                            birthdate: birthdate,
                                                            address: address,
                                                            email: email,
                                                            numberphone: numberphone,
                                                            frontNationalId: front_path,
                                                            backNationalId: back_path,
                                                        }
                                                    )
                                                        .then(() => {
                                                            transporter.sendMail({
                                                                from: 'BKTTT Team',
                                                                to: email + '@gmail.com',
                                                                subject: "Activation for your account",
                                                                html: `Dear ${firstName} ${lastName},<br>
                                                                You has been signed up an account on our website.<br>
                                                                Information of your account:<br>
                                                                -username: ${username}<br>
                                                                -password: ${password}<br>
                                                                Please wait administrator active your account (1 - 3 days).<br>
                                                                Thank you.<br>
                                                                -- BKTTT Team --`,
                                                            }, function (err, info) {
                                                                if (err) {
                                                                    console.log(err);
                                                                    return res.render('announce', {
                                                                        title: 'Register | BKTPay',
                                                                        layout: 'sublayout',
                                                                        content: 'You has been signed up not successfully<br>Please sign up again!',
                                                                    })
                                                                } else {
                                                                    console.log(info.response);
                                                                    return res.render('announce', {
                                                                        title: 'Register | BKTPay',
                                                                        layout: 'sublayout',
                                                                        content: 'You has been signed up successfully<br>Please check your email to get your account information!',
                                                                    })
                                                                }
                                                            });
                                                        })
                                                        .catch(err => res.render('announce', {
                                                            title: 'Register | BKTPay',
                                                            layout: 'sublayout',
                                                            content: err,
                                                        }))
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
            break;
        }

    });

router.get('/active/:username', (req, res) => {
    let username = req.params.username;
    User.updateOne(
        { username: { $eq: username } },
        {
            $set: {
                statusAccount: 'ĐÃ XÁC MINH',
            }
        }
    )
        .then(() => res.redirect(303, '/login'))
        .catch(err => {
            console.log(err);
            res.redirect(303, '/register');
        })
});

module.exports = router;