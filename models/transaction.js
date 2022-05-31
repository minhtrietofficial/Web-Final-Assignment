var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
    creator: String, // username 1: active
    receiver: String, // username 2: passive
    cardInfo: Object,
    type: String,
    coin: Number,
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