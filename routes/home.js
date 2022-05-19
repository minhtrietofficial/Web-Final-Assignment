var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    let context = {
        title: 'Home',
        layout:'layout'
      }
  res.render('home', context);
});

module.exports = router;
