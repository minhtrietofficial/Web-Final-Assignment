var express = require('express');
var router = express.Router();
var session = require('express-session');
const req = require('express/lib/request');
var credentials = require('../credentials');
var trans = require('../models/transaction');
router.use(session({ secret: credentials.session.key }));

/* GET home page. */
router.get('/:id', function (req, res, next) {
  if (req.session.username === undefined) {
    return res.redirect(303, '/');
  }
  trans.findOne({ _id: req.params.id }, (err, row) => {
    if (err)
      console.log(err);
    if (row != null) {
      let context = {
        fullname: row.firstName + ' ' + row.lastName,
        typeaccount: row.role,
        email: row.email + '@gmail.com',
        gender: row.gender,
        numberphone: row.numberphone,
        money: row.coin,
        status: row.statusAccount,
        cccd: row.cccd,
        title: 'Thông tin tài khoản | BKTPay',
        layout: 'detaillayout'
      }
      return res.render('detailtran', context);
    }
  })
});
    module.exports = router;
