var express = require('express');
var router = express.Router();
var session = require('express-session');
var credentials = require('../credentials');
var User = require('../models/user');
var trans = require('../models/transaction');

router.use(session({ secret: credentials.session.key }));

router.get('/:username', function (req, res, next) {
    if (req.session.username === undefined) {
        return res.redirect(303, '/');
    }
    User.findOne({ username: req.session.username }, (err, row) => {
        if (err)
            console.log(err);
        if (row != null) {
            trans.find({

                $or: [{ $and: [{ creator: req.params.username }, { status: "THÀNH CÔNG" }] }, { $and: [{ receiver: req.params.username }, { status: "THÀNH CÔNG" }] }]

            }, (err, rows) => {
                if (err) console.log(err);
                if (rows != null) {
                    let trans = rows.map(row => {
                        return {
                          _id: row._id,
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
                    
                        trans: trans,
                        title: 'Lịch sử giao dịch | BKTPay',
                        layout: 'detaillayout'
                    }
                    return res.render('historytran', context);
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