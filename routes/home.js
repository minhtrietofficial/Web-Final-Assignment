var express = require('express');
var router = express.Router();
var session = require('express-session');
var credentials = require('../credentials');

router.use(session({ secret: credentials.session.key }));

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.username === undefined) {
    return res.redirect(303, '/');
  }
  let context = {
    title: 'Home | BKTPay',
    layout: 'layout'
  }
  res.render('home', context);
});

module.exports = router;
