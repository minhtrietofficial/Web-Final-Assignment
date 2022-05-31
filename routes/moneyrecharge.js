var express = require('express');
var router = express.Router();
var session = require('express-session');
var credentials = require('../credentials');
var User = require('../models/user');
var Credit = require('../models/credit_card');
var Transaction = require('../models/transaction');

router.use(session({ secret: credentials.session.key }));

router.get('/test', (req, res) => {
  res.render('test');
});

router.post('/test', (req, res) => {
  let cardNumber = req.body.cardNumber;
  let expired = req.body.expired;
  let cvv = req.body.cvv;
  Credit.insertMany({
    cardNumber: cardNumber,
    expired: expired,
    cvv: cvv,
  })
  res.redirect(303, '/moneyrecharge/test');
});

router.get('/', function (req, res, next) {
  if (req.session.username === undefined) {
    return res.redirect(303, '/');
  }
  User.findOne({ username: req.session.username }, (err, row) => {
    if (err)
      console.log(err);
    if (row != null) {
      Credit.find({}, (err, rows) => {
        if (err) console.log(err);
        if (rows != null) {
          let credits = rows.map(row => {
            return {
              card_Number: row.cardNumber,
              dateexpired: row.expired,
              cvvnumber: row.cvv,
            }
          });
          let context = {
            fullname: row.firstName + ' ' + row.lastName,
            typeaccount: row.role,
            numberphone: row.numberphone,
            money: row.coin,
            status: row.statusAccount,
            credits: credits,
            title: 'Nạp tiền | BKTPay',
            layout: 'layout'
          }
          return res.render('moneyrecharge', context);
        } else {
          res.redirect(303, '/home');
        }
      });
    } else {
      res.redirect(303, '/home');
    }
  });
});

router.post('/', (req, res) => {
  let cardNumber = req.body.cardNumber;
  let expired = req.body.expired;
  let cvv = req.body.cvv;
  let coin = req.body.coin;
  if (cardNumber !== undefined && expired !== undefined && cvv !== undefined && coin !== undefined) {
    if (cardNumber.length == 6) {
      Credit.findOne({ cardNumber: cardNumber }, (err, row) => {
        if (err) console.log(err);
        if (row != null) {
          if (new Date(expired).getTime() == new Date(row.expired).getTime()) {
            if (cvv == row.cvv) {
              if (cvv == '577') {
                req.session.error = 'Thẻ hết tiền';
                console.log(req.session.error);
                return res.redirect(303, '/moneyrecharge');
              } else
                if (cvv == '443') {
                  if (coin > 1000000) {
                    req.session.error = 'Số tiền nạp không vượt quá 1 triệu/lần nạp';
                    console.log(req.session.error);
                    return res.redirect(303, '/moneyrecharge');
                  }
                }
              User.findOne({ username: req.session.username }, (err, user) => {
                if (err) console.log(err);
                if (user != null) {
                  User.updateOne(
                    { username: { $eq: req.session.username } },
                    {
                      $set: {
                        coin: parseInt(user.coin) + parseInt(coin),
                      }
                    }
                  )
                    .then(() => {
                      Transaction.insertMany({
                        creator: req.session.username,
                        cardInfo: row,
                        type: 'deposit',
                        coin: coin,
                      }, function (err, info) {
                        if (err) console.log(err)
                        else console.log('add transaction successfully');
                        return res.redirect(303, '/login');
                      })
                    })
                    .catch(err => {
                      console.log(err);
                      req.session.error = 'Nạp tiền không thành công';
                      res.redirect(303, '/moneyrecharge');
                    })
                }
              });
            } else {
              req.session.error = 'Mã cvv không khớp';
              console.log(req.session.error);
              res.redirect(303, '/moneyrecharge');
            }
          } else {
            req.session.error = 'Ngày hết hạn không khớp';
            console.log(req.session.error);
            res.redirect(303, '/moneyrecharge');
          }
        } else {
          req.session.error = 'Thẻ này không được hỗ trợ';
          console.log(req.session.error);
          res.redirect(303, '/moneyrecharge');
        }
      });
    } else {
      req.session.error = 'Số thẻ không hợp lệ';
      console.log(req.session.error);
      res.redirect(303, '/moneyrecharge');
    }
  } else {
    console.log(cardNumber);
    console.log(expired);
    console.log(cvv);
    console.log(coin);
    req.session.error = 'Các thông tin không được bỏ trống';
    res.redirect(303, '/moneyrecharge');
  }
});

module.exports = router;