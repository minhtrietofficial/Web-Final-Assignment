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
        trans.find({$or:[{creator: req.session.username},{receiver: req.session.username}]}, (err, rows) => {
        if (err) console.log(err);
        if (rows != null) {
          let credits = rows.map(row => {
            return {
              receiver: row.receiver,
              creator: row.creator,
              cardInfo: row.cardInfo,
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
            title: 'Lịch sử giao dịch | BKTPay',
            layout: 'layout'
          }
          return res.render('historyuser', context);
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