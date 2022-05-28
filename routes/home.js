var express = require('express');
var router = express.Router();
var session = require('express-session');

router.use(session({ secret: 'bkttt' }));

/* GET home page. */
router.get('/', function (req, res, next) {
  let context = {
    title: 'Home | BKTPay',
    layout: 'layout'
  }
  res.render('home', context);
});

module.exports = router;
