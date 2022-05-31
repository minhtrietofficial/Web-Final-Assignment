var mongoose = require('mongoose');

var mobilecard = mongoose.Schema({
    cardNumber: Number,
    name: String,
});

module.exports = mongoose.model('mobilecard', creditCard);