var express = require('express');
var router = express.Router();
var session = require('express-session');
var credentials = require('../credentials');
var User = require('../models/user');
var trans = require('../models/transaction');

router.use(session({ secret: credentials.session.key }));

router.get('/', function (req, res, next) {
    if (req.session.username === undefined) {
        return res.redirect(303, '/');
    }
    User.findOne({ username: req.session.username }, (err, row) => {
        if (err)
            console.log(err);
        if (row != null) {
            trans.find({ $or: [{ creator: req.session.username }, { status: "ĐANG CHỜ" }] }, (err, rows) => {
                if (err) console.log(err);
                if (rows != null) {
                    let trans = rows.map(row => {
                        return {
                            creator: row.creator,
                            receiver: row.receiver,
                            cardInfo: row.cardInfo,
                            type: row.type,
                            coin: row.coin,
                            note: row.note,
                            created: row.created,
                            status: row.status,                   
                        }
                    });
                    let context = {
                        fullname: row.firstName + ' ' + row.lastName,
                        typeaccount: row.role,
                        numberphone: row.numberphone,
                        money: row.coin,
                        status: row.statusAccount,
                        trans: trans,
                        title: 'Giao dịch đang chờ | BKTPay',
                        layout: 'layout'
                    }
                    return res.render('tranpending', context);
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