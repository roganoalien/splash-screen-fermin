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
    name: { type: String, required: true },
    modem_data: {
        base_grant_url: { type: String, required: true },
        user_continue_url: { type: String, required: true },
        node_id: { type: String, required: true },
        node_mac: { type: String, required: true },
        gateway_id: { type: String, required: true },
        client_ip: { type: String, required: true },
        client_mac: { type: String, required: true }
    }
});

function customDate() {
    return moment().format('DD/MM/YYYY');
}

module.exports = mongoose.model('User', UserSchema);
