const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User'); // 你的用户模型

// 设置 Multer 用于上传头像
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 确保项目根目录存在 uploads 文件夹
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});
const upload = multer({ storage });


// ✅ 1. 检查用户名是否重复
router.post('/check-username', async (req, res) => {
    const { username } = req.body;

    if (!username || username.trim() === '') {
        return res.status(400).json({ available: false, message: 'Username is required' });
    }

    try {
        const existing = await User.findOne({ username });
        if (existing) {
            return res.json({ available: false });
        } else {
            return res.json({ available: true });
        }
    } catch (err) {
        console.error('Check username error:', err);
        return res.status(500).json({ available: false });
    }
});


// ✅ 2. 更新用户资料
router.put('/:userId', upload.single('avatar'), async (req, res) => {
    const { userId } = req.params;
    const { username, signature } = req.body;
    let avatarUrl = null;

    if (req.file) {
        avatarUrl = `/uploads/${req.file.filename}`;
    }

    try {
        const updated = await User.findByIdAndUpdate(
            userId,
            {
                ...(username && { username }),
                ...(signature && { signature }),
                ...(avatarUrl && { avatar: avatarUrl }),
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.json({ success: true, user: updated });
    } catch (err) {
        console.error('Update user error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;