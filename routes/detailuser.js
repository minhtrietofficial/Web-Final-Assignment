var express = require('express');
var router = express.Router();
var session = require('express-session');
var credentials = require('../credentials');
var User = require('../models/user');
router.use(session({ secret: credentials.session.key }));
var methodOverride = require('method-override');
router.use(methodOverride('_method'));



router.get('/:username', function (req, res, next) {
    if (req.session.username === undefined) {
        return res.redirect(303, '/');
    }
    
    User.findOne({ username: req.session.username }, (err, row) => {
        if (err)
            console.log(err);
        if (row != null) {
            let username = req.params.username;
            User.findOne({ username: username }, (err2, row2) => {
                if (err2) console.log(err2);
                if (row2 != null) {
                   
                    let context = {
                        fullname: row.firstName + ' ' + row.lastName,
                        typeaccount: row.role,
                        numberphone: row.numberphone,
                        money: row.coin,
                        status: row.statusAccount,
                        title: 'Chi tiết tài khoản | BKTPay',
                        layout: 'layout',
                        user1: {
                            fullname2: row2.firstName + ' ' + row2.lastName,
                            username2: row2.username,
                            datecreate2: row2.created,
                            statusAccount2: row2.statusAccount,
                            email2: row2.email + '@gmail.com',
                            gender2: row2.gender, 
                            numberphone2: row2.numberphone,
                            money2: row2.coin,
                            cccd2: row2.cccd,
                        }
                        
                    }
                    console.log(context.layout);
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