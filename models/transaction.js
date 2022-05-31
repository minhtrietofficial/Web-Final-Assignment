var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
    creator: String, // username 1: active
    receiver: { // username 2: passive
        type: String,
        default: '',
    }, 
    cardInfo: Object,
    type: String,
    coin: Number,
    note: { // note of creator
        type: String,
        default: '',
    } ,
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