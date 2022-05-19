var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    let context = {
        title: 'Register',
        layout: 'sublayout'
    }
    res.render('register', context);
});

module.exports = router;
