var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/user');
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
    let context = {
        title: 'Reset Password | BKTPay',
        layout: 'sublayout'
    }
    res.render('register', context);
});

router.post('/', (req, res) => {
    let email = req.body.email;
    User.findOne({ email: { $eq: email } }, (err, row) => {
        if (err) console.log(err);
        if (row !== undefined) {
            let password = '';
            const maxNumber = 10;
            while (1) {
                if (password.length < 6) {
                    password += Math.floor(Math.random() * maxNumber);
                    continue;
                }
                break;
            }
            bcrypt.genSalt(10, function (err, salt) {
                if (err) console.log(err);
                bcrypt.hash(password, salt, function (err, hash) {
                    User.updateOne(
                        { email: { $eq: email } },
                        {
                            $set: {
                                password: hash,
                            }
                        }
                    )
                        .then(() => {
                            transporter.sendMail({
                                from: 'BKTTT Team',
                                to: email + '@gmail.com',
                                subject: "Activation for your account",
                                html: `Dear ${firstName} ${lastName},<br>
                                You has been sent the request to reset your password.<br>
                                Your new password: ${password}<br>
                                Please login and change this password.<br>
                                Thank you.<br>
                                -- BKTTT Team --`,
                            }, function (err, info) {
                                if (err) {
                                    console.log(err);
                                    return res.render('announce', {
                                        title: 'Reset Password | BKTPay',
                                        layout: 'sublayout',
                                        content: 'You has been sent reset password request not successfully<br>Please try again!',
                                    });
                                } else {
                                    console.log(info.response);
                                    return res.render('announce', {
                                        title: 'Reset Password | BKTPay',
                                        layout: 'sublayout',
                                        content: 'You has been sent reset password request successfully<br>Please check your email to get your new password!',
                                    });
                                }
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            return res.render('announce', {
                                title: 'Reset Password | BKTPay',
                                layout: 'sublayout',
                                content: 'Server can not serve now. Please try again!',
                            });
                        })
                });
            });
        } else {
            return res.redirect(303, '/resetpassword');
        }
    });
});

module.exports = router;
