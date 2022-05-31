var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
    creator: String, // username 1: active
    receiver: String, // username 2: passive
    cardInfo: Object,
    deposit: Number, // deposit not equal 0 --> withdraw equal 0 | if user 1 send coin to user 2 --> deposit not equal 0 and withdraw equal 0
    withdraw: Number, // withdraw not equal 0 --> deposit equal 0
    note: String, // note of creator
    created: {
        type: Date,
        default: Date.now(),
    },
    status: {
        type: String,
        default: 'THÀNH CÔNG',
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);