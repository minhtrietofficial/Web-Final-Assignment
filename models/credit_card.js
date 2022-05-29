var mongoose = require('mongoose');

var creditCard = mongoose.Schema({
    cardNumber: Number,
    expired: Date,
    cvv: Number,
});

module.exports = mongoose.model('CreditCard', creditCard);