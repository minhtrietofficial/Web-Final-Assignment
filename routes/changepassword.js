var express = require('express');
var router = express.Router();
var session = require('express-session');

router.use(session({ secret: 'bkttt' }));

/* GET home page. */
router.get('/', function (req, res, next) {
  let context = {
    title: 'Change Password | BKTPay',
    layout: 'sublayout'
  }
  res.render('changepassword', context);
});

module.exports = router;
