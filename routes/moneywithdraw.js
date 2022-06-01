var express = require('express');
var router = express.Router();
var session = require('express-session');
var credentials = require('../credentials');
var User = require('../models/user');
var Credit = require('../models/credit_card');
var Transaction = require('../models/transaction');

router.use(session({ secret: credentials.session.key }));

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
            title: 'Rút tiền | BKTPay',
            layout: 'layout'
          }
          return res.render('moneywithdraw', context);
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
  if (req.session.username === undefined) {
    return res.redirect(303, '/');
  }
  let cardNumner = req.body.cardNumber;
  let expired = req.body.expired;
  let cvv = req.body.cvv;
  let coin = req.body.coin;
  let note = req.body.note;
  Credit.findOne({ cardNumber: cardNumner }, (err, card) => {
    if (err) console.log(err);
    if (card != null) {
      if (new Date(card.expired).getTime() == new Date(expired).getTime() && card.cvv == cvv) {
        // Transaction.findOne({ $and: [{ creator: req.session.username }, { created: Date.now() }] }, (err, rows) => {
        Transaction.find({ creator: req.session.username }, (err, rows) => {
          if (err) console.log(err);
          let count = 0;
          if (rows != null)
            for (let i = 0; i < rows.length; i++) {
              if (new Date(Date.now()).toLocaleDateString('en-US') == new Date(rows[i].created).toLocaleDateString('en-US')) {
                count += 1;
              }
            }
          if (count < 2) {
            if (coin % 50000 == 0) {
              User.findOne({ username: req.session.username }, (err, user) => {
                if (err) console.log(err);
                if (user != null) {
                  if (user.coin - coin + coin * 0.05 >= 0) {
                    coin = parseInt(coin) + coin * 0.05;
                    let status = 'THÀNH CÔNG';
                    let coin2 = coin;
                    if (coin >= 5000000) {
                      coin2 = 0;
                      status = 'ĐANG CHỜ DUYỆT'
                    }
                    User.updateOne(
                      { username: { $eq: req.session.username } },
                      {
                        $set: {
                          coin: user.coin - coin2,
                        }
                      }
                    )
                      .then(() => {
                        // Cập nhật số dư người dùng thành công
                        Transaction.insertMany({
                          creator: req.session.username,
                          cardInfo: card,
                          type: 'withdraw',
                          coin: coin,
                          note: note,
                          status: status,
                        })
                          .then(() => {
                            // Thêm lịch sử giao dịch thành công
                            return res.redirect(303, '/moneywithdraw');
                          })
                          .catch(err => {
                            // Thêm lịch sử giao dịch thất bại
                            console.log(err);
                            req.session.errors = [
                              'Thêm lịch sử giao dịch thất bại'
                            ];
                            return res.redirect(303, '/moneywithdraw');
                          })
                      })
                      .catch(err => {
                        // Cập nhật số dư người dùng thất bại
                        console.log(err);
                        req.session.errors = [
                          'Cập nhật số dư người dùng thất bại'
                        ];
                        return res.redirect(303, '/moneywithdraw');
                      })
                  } else {
                    // Không đủ số dư thực hiện giao dịch
                    req.session.errors = [
                      'Không đủ số dư thực hiện giao dịch'
                    ];
                    return res.redirect(303, '/moneywithdraw');
                  }
                }
              })
            } else {
              // Số tiền rút Không là bội số của 50K
              req.session.errors = [
                'Số tiền rút Không là bội số của 50.000'
              ];
              return res.redirect(303, '/moneywithdraw');
            }
          } else {
            // Vượt quá 2 giao dịch/ngày
            req.session.errors = [
              'Không thể giao dịch hơn 2 lần/ngày'
            ];
            return res.redirect(303, '/moneywithdraw');
          }
        })
      } else {
        // Thông tin thẻ tín dụng không hợp lệ
        req.session.errors = [
          'Thông tin thẻ tín dụng không hợp lệ'
        ];
        return res.redirect(303, '/moneywithdraw');
      }
    } else {
      // Thẻ tín dụng không tồn tại
      req.session.errors = [
        'Thẻ tín dụng không tồn tại'
      ];
      return res.redirect(303, '/moneywithdraw');
    }
  })
});

module.exports = router;