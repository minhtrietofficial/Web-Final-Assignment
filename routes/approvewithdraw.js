var express = require('express');
var router = express.Router();
var session = require('express-session');
var credentials = require('../credentials');
var User = require('../models/user');
var Transaction = require('../models/transaction');




router.use(session({ secret: credentials.session.key }));

router.get('/', function (req, res, next) {
  if (req.session.username === undefined) {
    return res.redirect(303, '/');
  }
  User.findOne({ username: req.session.username }, (err, row) => {
    if (err)
      console.log(err);
    if (row != null) {
      Transaction.find({ deposit: {$gt:5000000} }, (err, rows) => { 
        // gt >, >= gte, <lt 
        if (err) console.log(err);
        if (rows != null) {
          let trans = rows.map(row => {
            return {
              creator: row.creator,
              withdraw: row.withdraw,
              note: row.note,
              status: row.status,
              created: row.created,
            }
          });
          let context = {
            fullname: row.firstName + ' ' + row.lastName,
            typeaccount: row.role,
            numberphone: row.numberphone,
            money: row.coin,
            status: row.statusAccount,
            trans: trans,
            title: 'Phê duyệt rút tiền | BKTPay',
            layout: 'layout'
          }
          return res.render('approvewithdraw', context);
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