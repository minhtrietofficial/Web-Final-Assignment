var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let context = {
    title: 'BKTPay',
    layout:'sublayout'
  }
  res.render('index', context);
});

module.exports = router;
