var express = require('express');
var router = express.Router();
var session = require('express-session');
var credentials = require('../credentials');
var User = require('../models/user');
var methodOverride = require('method-override');

router.use(methodOverride('_method'));


router.use(session({ secret: credentials.session.key }));

router.get('/', function (req, res, next) {
  if (req.session.username === undefined) {
    return res.redirect(303, '/');
  }
  User.findOne({ username: req.session.username }, (err, row) => {
    if (err)
      console.log(err);
    if (row != null) {
      User.find({ role: "user" }, (err, rows) => {
        if (err) console.log(err);
        if (rows != null) {
          let users = rows.map(row => {
            return {
              fullname: row.firstName + ' ' + row.lastName,
              username: row.username,
              datecreate: row.created,
              statusAccount: row.statusAccount,
            }
          });
          let context = {
            
            fullname: row.firstName + ' ' + row.lastName,
            typeaccount: row.role,
            numberphone: row.numberphone,
            money: row.coin,
            status: row.statusAccount,
            users: users,
            title: 'Quản lí tài khoản | BKTPay',
            layout: 'layout'
          }
          return res.render('account', context);
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