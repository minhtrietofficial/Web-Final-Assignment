var express = require('express');
var router = express.Router();
var session = require('express-session');
const req = require('express/lib/request');
var credentials = require('../credentials');
var trans = require('../models/transaction');
router.use(session({ secret: credentials.session.key }));

/* GET home page. */
router.get('/:id', function (req, res, next) {
  if (req.session.username === undefined) {
    return res.redirect(303, '/');
  }
  trans.findOne({ _id: req.params.id }, (err, row) => {
    if (err)
      console.log(err);
    if (row != null) {
      let context = {
        creator: row.creator,
        receiver: row.receiver,
        cardInfo: row.cardInfo,
        type: row.type,
        coin: row.coin,
        note: row.note,
        created: row.created,
        status: row.status,
        title: 'Chi tiết giao dịch | BKTPay',
        layout: 'detaillayout'

      }
      return res.render('detailtran', context);
    }
  })
});
module.exports = router;
