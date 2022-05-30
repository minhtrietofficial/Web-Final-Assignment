var express = require('express');
var router = express.Router();
var session = require('express-session');
var credentials = require('../credentials');
var User = require('../models/user');
router.use(session({ secret: credentials.session.key }));

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.username === undefined) {
    return res.redirect(303, '/');
  }
  User.findOne({username:req.session.username},(err, row) => {
    if(err)
      console.log(err);
    if(row != null){
      let context = {
        fullname: row.firstName + ' ' + row.lastName,
        typeaccount: row.role,
        numberphone: row.numberphone,
        money: row.coin,
        status: row.statusAccount,
        title: 'Home | BKTPay',
        layout: 'layout'
      }
      return res.render('home', context);
    }
  })
});


module.exports = router;
