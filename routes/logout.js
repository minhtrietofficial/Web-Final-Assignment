var express = require('express');
var router = express.Router();
var session = require('express-session');
var credentials = require('../credentials');

router.use(session({ secret: credentials.session.key }));

router.get('/', function (req, res, next) {
  if (req.session.username === undefined) {
    return res.redirect(303, '/');
  }
  let context = {
    Nameresult: 'Đăng xuất thành công',
    title: 'Logout | BKTPay',
    layout: 'sublayout',
    content: 'Đăng xuất thành công'
  }
  res.render('announce', context);
});

router.post('/', (req, res) => {
    req.session = null
    res.json({ logout: true })
})

module.exports = router;
