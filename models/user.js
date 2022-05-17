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
    birthdate: String,
    address: String,
    email: String,
    phone: {
        type: String,
        maxLength: 10,
    },
    frontNationalId: String,
    backNationalId: String,
});

module.exports = mongoose.model('User', userSchema);