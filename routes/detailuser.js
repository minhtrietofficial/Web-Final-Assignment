var express = require('express');
var router = express.Router();
var session = require('express-session');
var credentials = require('../credentials');
var User = require('../models/user');
router.use(session({ secret: credentials.session.key }));

router.get('/:username', function (req, res, next) {
    if (req.session.username === undefined) {
        return res.redirect(303, '/');
    }
    
    User.findOne({ username: req.session.username }, (err, row) => {
        if (err)
            console.log(err);
        if (row != null) {
            let username = req.params.username;
            console.log(username);
            User.findOne({ username: username }, (err, row) => {
                if (err) console.log(err);
                if (row != null) {
                    let users = {
                        fullname: row.firstName + ' ' + row.lastName,
                        username: row.username,
                        datecreate: row.created,
                        statusAccount: row.statusAccount
                    }
                    console.log(users);

                    let context = {
                        fullname: row.firstName + ' ' + row.lastName,
                        typeaccount: row.role,
                        numberphone: row.numberphone,
                        money: row.coin,
                        status: row.statusAccount,
                        users: users,
                        title: 'Home | BKTPay',
                        layout: 'layout'
                    }
                    console.log(context);
                    return res.render('detailuser', context);
                } else {
                    res.redirect(303, '/home');
                }
            });
        } else {
            res.redirect(303, '/home');
        }
    });
});
module.exports = router;