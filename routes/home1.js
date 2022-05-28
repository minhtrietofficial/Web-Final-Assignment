var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    let context = {
        title: 'Home1 | BKTPay',
        layout:'layout1'
      }
  res.render('home1', context);
});

module.exports = router;
