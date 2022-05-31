var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    statusAccount: {
        type: String,
        default: 'ChỜ XÁC MINH',
    },
    firstName: String,
    lastName: String,
    gender: String,
    birthdate: String,
    address: String,
    email:{
        unique: true,
        type: String,
    },
    numberphone: {
        type: String,
        unique: true,
        maxLength: 10,
    },
    frontNationalId: String,
    backNationalId: String,
    isFirstLogin: {
        type: Boolean,
        default: true,
    },
    created: {
        type: Date,
        default: Date.now(),
    },
    lastModified: {
        type: Date,
        default: Date.now(),
    },
    failedLogin: {
        type: Number,
        default: 0,
    },
    unusualLogin: {
        type: Number,
        default: 0,
    },
    forbiddenTime: {
        type: Number,
        default: 0,
    },
    role: {
        type: String,
        default: 'user',
    },
    coin: {
        type: Number,
        default: 0,
    },
<<<<<<< HEAD
    cccd: {
        type: Number,
        default: 0, 
        // 1 là admin bấm yêu cầu bổ sung cccd
=======
    OTP: {
        type: String,
        default: '',
    },
    expiredOTP: {
        type: Number,
        default: 0,
>>>>>>> register_v2
    },
});

module.exports = mongoose.model('User', userSchema);