// models/User.js
const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    name: String,
    hex: String,
    rgb: [Number],
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    colors: [colorSchema], // ✅ 每个用户一个颜色列表
});

module.exports = mongoose.model('User', userSchema);