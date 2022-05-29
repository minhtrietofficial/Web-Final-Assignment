var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.username !== undefined) {
    return res.redirect(303, '/home');
  }
  let context = {
    title: 'BKTPay',
    layout: 'sublayout'
  }
  res.render('index', context);
});

module.exports = router;
