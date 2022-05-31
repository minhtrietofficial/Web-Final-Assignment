var express = require('express');
var router = express.Router();
var session = require('express-session');
var credentials = require('../credentials');
var User = require('../models/user');
var Credit = require('../models/credit_card');

router.use(session({ secret: credentials.session.key }));

router.get('/', function (req, res, next) {
  if (req.session.username === undefined) {
    return res.redirect(303, '/');
  }
  User.findOne({ username: req.session.username }, (err, row) => {
    if (err)
      console.log(err);
    if (row != null) {
      Credit.find({}, (err, rows) => {
        if (err) console.log(err);
        if (rows != null) {
          let credits = rows.map(row => {
            return {
              card_Number: row.cardNumber,
              dateexpired: row.expired,
              cvvnumber: row.cvv,
            }
          });
          let context = {
            fullname: row.firstName + ' ' + row.lastName,
            typeaccount: row.role,
            numberphone: row.numberphone,
            money: row.coin,
            status: row.statusAccount,
            credits: credits,
            title: 'Chuyển tiền | BKTPay',
            layout: 'layout'
          }
          return res.render('moneytransfers', context);
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