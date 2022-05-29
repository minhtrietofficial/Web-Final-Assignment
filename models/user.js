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
    isFirstLogin: Boolean,
    created: {
        type: Date,
        default: Date.now(),
    },
    lastModified: {
        type: Date,
        default: Date.now(),
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
});

module.exports = mongoose.model('User', userSchema);