var express = require('express');
var router = express.Router();
var session = require('express-session');
var credentials = require('../credentials');
var User = require('../models/user');
var Transaction = require('../models/Transaction');
var { ObjectId } = require('mongoose').Types;
var methodOverride = require('method-override');
router.use(methodOverride('_method'));



router.use(session({ secret: credentials.session.key }));

router.get('/', function (req, res, next) {
  if (req.session.username === undefined) {
    return res.redirect(303, '/');
  }
  User.findOne({ username: req.session.username }, (err, row) => {
    if (err)
      console.log(err);
    if (row != null) {
      Transaction.find({ $and: [{ status: "ĐANG CHỜ DUYỆT" }, { type: "withdraw" }] }, (err, rows) => {
        if (err) console.log(err);
        if (rows != null) {
          let trans = rows.map(row => {
            return {
              _id: row.id,
              creator: row.creator,
              receiver: row.receiver,
              cardInfo: row.cardInfo,
              type: row.type,
              coin: row.coin,
              note: row.note,
              created: row.created,
              status: row.status,
            }
          });
          let context = {

            fullname: row.firstName + ' ' + row.lastName,
            typeaccount: row.role,
            numberphone: row.numberphone,
            money: row.coin,
            status: row.statusAccount,
            trans: trans,
            title: 'Phê duyệt rút tiền | BKTPay',
            layout: 'layout'
          }
          return res.render('approvewithdraw', context);
        } else {
          res.redirect(303, '/home');
        }
      });
    } else {
      res.redirect(303, '/home');
    }
  });
});

router.put('/accept/:id/', (req, res, next) => {
  let _id = ObjectId(req.params.id);
  let username = req.body.username;
  let coin = req.body.coin;
  Transaction.updateOne(
    { _id: { $eq: _id } },
    {
      $set: {
        status: 'THÀNH CÔNG',
      }
    }
  )
    .then(() => {
      User.findOne({ username: username }, (err, user) => {
        if (err) console.log(err);
        if (user != null) {
          User.updateOne(
            { username: { $eq: username } },
            {
              $set: {
                coin: parseInt(user.coin) - coin,
              }
            }
          )
            .then(() => {
              res.redirect(303, '/approvewithdraw');
            })
            .catch(err => {
              console.log(err);
              req.session.errors = [
                'Cập nhật số dư thất bại'
              ]
              res.redirect(303, '/approvewithdraw');
            })
        }
      })
    })
    .catch(err => {
      console.log(err);
      req.session.errors = [
        'Cập nhật trạng thái giao dịch thất bại'
      ]
      res.redirect(303, '/approvewithdraw');
    })
});

router.put('/cancel/:_id', (req, res, next) => {
  let _id = ObjectId(req.params.id);
  Transaction.updateOne(
    { _id: { $eq: _id } },
    {
      $set: {
        status: 'ĐÃ HỦY'
      }
    }
  )
    .then(() => {
      res.redirect(303, '/approvewithdraw');
    })
    .catch(err => {
      console.log(err);
      req.session.errors = [
        'Cập nhật trạng thái giao dịch thất bại'
      ]
      res.redirect(303, '/approvewithdraw');
    })
});

module.exports = router;


