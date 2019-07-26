const mongoose = require('mongoose'),
    { Schema } = mongoose;

const UserSchema = new Schema({
    birthday: { type: String, required: true },
    date: { type: Date, default: Date.now },
    gender: { type: String, required: true },
    lastname: { type: String, required: true },
    mac: { type: String },
    name: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
