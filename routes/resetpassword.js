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
    res.render('resetpassword', context);
});

router.get('/confirm', (req, res) => {
    let context = {
        title: 'Confirm Reset Password | BKTPay',
        layout: 'sublayout'
    }
    res.render('otp', context);
});

router.post('/', (req, res) => {
    let email = req.body.email;
    User.findOne({ email: email }, (err, row) => {
        if (err) console.log(err);
        if (row != null) {
            let otp = '';
            while (otp.length < 4) {
                otp += Math.floor(Math.random() * 10);
            }
            User.updateOne(
                { email: { $eq: email } },
                {
                    $set: {
                        OTP: otp,
                        expiredOTP: Date.now() + 60,
                    }
                }
            )
                .then(() => {
                    transporter.sendMail({
                        from: 'BKTTT Team',
                        to: email + '@gmail.com',
                        subject: "Confirm reset password for your account",
                        html: `Dear ${row.firstName} ${row.lastName},<br>
                        You has been sent the request to reset your password.<br>
                        OTP: ${otp}<br>
                        Please enter otp to confirm reset your password.<br>
                        Thank you.<br>
                        -- BKTTT Team --`,
                    }, function (err, info) {
                        if (err) {
                            console.log(err);
                            return res.render('announce', {
                                title: 'Reset Password | BKTPay',
                                layout: 'sublayout',
                                content: 'You has been sent otp to reset password not successfully<br>Please try again! Chúng tôi sẽ tự động đưa bạn về trang chủ, đợi chút...',
                            });
                        } else {
                            console.log(info.response);
                            return res.redirect(303, '/resetpassword/confirm');      
                        }
                    })
                })
                .catch(err => {
                    console.log(err);
                    return res.render('announce', {
                        title: 'Reset Password | BKTPay',
                        layout: 'sublayout',
                        content: 'Server can not serve now. Please try again!',
                    });
                })
        } else {
            return res.redirect(303, '/resetpassword');
        }
    });
});

router.post('/confirm', (req, res) => {
    let email = req.body.email;
    let otp = req.body.otp;
    User.findOne({ email: email, OTP: otp }, (err, row) => {
        if (err) console.log(err);
        if (row != null) {
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
                    if (err) console.log(err);
                    User.findOne({ email: email }, (err, row) => {
                        if (err) console.log(err);
                        if (row != null) {
                            User.updateOne(
                                { email: { $eq: email } },
                                {
                                    $set: {
                                        password: hash,
                                        OTP: '',
                                    }
                                }
                            )
                                .then(() => {
                                    transporter.sendMail({
                                        from: 'BKTTT Team',
                                        to: email + '@gmail.com',
                                        subject: "Reset password for your account",
                                        html: `Dear ${row.firstName} ${row.lastName},<br>
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
                                                content: 'You has been sent reset password request not successfully<br>Please try again! Chúng tôi sẽ tự động đưa bạn về trang chủ, đợi chút...',
                                            });
                                        } else {
                                            console.log(info.response);
                                            return res.render('announce', {
                                                title: 'Reset Password | BKTPay',
                                                layout: 'sublayout',
                                                content: 'You has been sent reset password request successfully<br>Please check your email to get your new password! Chúng tôi sẽ tự động đưa bạn về trang chủ, đợi chút...',
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
                        }
                    })
                });
            });
        } else {
            return res.redirect(303, '/resetpassword');
        }
    });

});

module.exports = router;
