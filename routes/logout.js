var express = require('express');
var router = express.Router();
var session = require('express-session');
var credentials = require('../credentials');

router.use(session({ secret: credentials.session.key }));

router.get('/', function (req, res, next) {
  req.session.username = undefined;
  let context = {
    Nameresult: 'Đăng xuất thành công',
    title: 'Đăng xuất | BKTPay',
    layout: 'sublayout',
    content: 'Chúng tôi sẽ tự động đưa bạn về trang chủ, đợi chút...'
  }
  res.render('announce', context);
});



module.exports = router;
