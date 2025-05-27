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

    // ✅ 用户头像（默认为一张默认图）
    avatar: {
        type: String,
        default: '/default-avatar.png',
    },

    // ✅ 用户名（可编辑）
    username: {
        type: String,
        default: '',
    },

    // ✅ 个性签名
    signature: {
        type: String,
        default: '',
    },

    // ✅ 关注列表（引用其他用户）
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // ✅ 粉丝列表（引用其他用户）
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

});

module.exports = mongoose.model('User', userSchema);