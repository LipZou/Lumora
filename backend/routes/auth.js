const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

require('dotenv').config();

const emailCodes = {}; // { email: { code, expiresAt, verified } }


// 添加上传配置
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 本地 uploads 目录
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });


// gamil验证信息
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// 工具函数：邮箱格式验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ✅ 1. 发送验证码
router.post('/send-code', async (req, res) => {
    const { email } = req.body;

    // 1.1 邮箱格式校验
    if (!isValidEmail(email)) {
        return res.json({ success: false, message: 'Invalid email format' });
    }

    // 1.2 查重
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.json({ success: false, message: 'Email is already registered' });
    }

    // 1.3 生成验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    emailCodes[email] = { code, expiresAt, verified: false };

    // 1.4 发送邮件
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Lumora Verification Code',
            text: `Your verification code is: ${code}. It is valid for 5 minutes.`,
        });

        return res.json({ success: true, message: 'Verification code sent' });
    } catch (error) {
        console.error('Email send error:', error);
        return res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

// ✅ 2. 验证验证码
router.post('/verify-code', (req, res) => {
    const { email, code } = req.body;
    const record = emailCodes[email];

    if (!record) {
        return res.json({ success: false, message: 'No code was sent for this email' });
    }

    if (Date.now() > record.expiresAt) {
        return res.json({ success: false, message: 'Code has expired' });
    }

    if (record.code !== code) {
        return res.json({ success: false, message: 'Incorrect verification code' });
    }

    // ✅ 标记为已验证
    emailCodes[email].verified = true;

    return res.json({ success: true, message: 'Email verified successfully' });
});

// ✅ 3. 注册
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    // 前置校验
    if (!email || !password || password.length < 8) {
        return res.json({ success: false, message: 'Invalid registration data' });
    }

    const record = emailCodes[email];
    if (!record || !record.verified) {
        return res.json({ success: false, message: 'Email not verified' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'Email is already registered' });
        }

        const newUser = new User({ email, password }); // ✅ 不包含用户名、头像
        await newUser.save();

        delete emailCodes[email]; // 清除验证码记录

        return res.json({
            success: true,
            message: 'Registration successful',
            userId: newUser._id, // ✅ 前端需要这个跳转到 /setup/:userId
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ✅ 4. 登录
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        if (user.password !== password) {
            return res.json({ success: false, message: 'Incorrect password' });
        }

        return res.json({
            success: true,
            message: 'Login successful',
            user: {
                _id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;