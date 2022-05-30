var express = require('express');
var router = express.Router();
var session = require('express-session');
var credentials = require('../credentials');
var User = require('../models/user');
router.use(session({ secret: credentials.session.key }));

router.get('/', function (req, res, next) {
  if (req.session.username === undefined) {
    return res.redirect(303, '/');
  }
  let context = {

  }
  User.findOne({ username: req.session.username }, (err, row) => {
    if (err)
      console.log(err);
    if (row != null) {
      context = {
        fullname: row.firstName + ' ' + row.lastName,
        typeaccount: row.role,
        numberphone: row.numberphone,
        money: row.coin,
        status: row.statusAccount,
        title: 'Home | BKTPay',
        layout: 'layout'
      }
    }
  });
  User.find({statusAccount: "ĐÃ XÁC MINH"}).sort({created: -1})
      .then(User => {
        User = User.map(User => User.toObject())
        for (var i = 0; i < User.length; i++) {
          User[i].created = User[i].created.toLocaleDateString("en-US")
        }
        context["users"] = User;
      })
  console.log(context);
  return res.render('activeaccount', context);
});
module.exports = router;