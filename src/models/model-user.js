const mongoose = require('mongoose'),
    moment = require('moment'),
    { Schema } = mongoose;

const UserSchema = new Schema({
    birthday: { type: String, required: true },
    date: { type: String, default: customDate() },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    lastname: { type: String, required: true },
    mac: { type: String },
    name: { type: String, required: true }
});

function customDate() {
    return moment().format('DD/MM/YYYY');
}

module.exports = mongoose.model('User', UserSchema);
