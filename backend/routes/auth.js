// server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 登录
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        if (user.password !== password) {
            return res.json({ success: false, message: 'Incorrect Password' });
        }

        // ✅ 返回用户信息（前端需要 _id）
        return res.json({
            success: true,
            message: 'Login successful',
            user: {
                _id: user._id,
                email: user.email,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 注册
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: 'Email already registered' });
        }

        const newUser = new User({ email, password });
        await newUser.save();

        return res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;