// models/EmailCode.js
const mongoose = require('mongoose');

const emailCodeSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('EmailCode', emailCodeSchema);