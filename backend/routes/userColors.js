// routes/userColors.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/colors/:userId 获取用户颜色库
router.get('/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    if (!user.colors) user.colors = [];

    res.json(user.colors);
});

// POST /api/colors/:userId 添加新颜色
router.post('/:userId', async (req, res) => {
    const { name, hex, rgb } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    // 检查是否已存在该颜色
    const exists = user.colors.some(c => c.hex.toLowerCase() === hex.toLowerCase());
    if (!exists) {
        user.colors.push({ name, hex, rgb });
        await user.save();
    }

    res.json(user.colors);
});

// POST /api/colors/:userId/batch 批量添加颜色
router.post('/:userId/batch', async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    const newColors = req.body.colors || [];

    for (const color of newColors) {
        const exists = user.colors.some(c => c.hex.toLowerCase() === color.hex.toLowerCase());
        if (!exists) {
            user.colors.push(color);
        }
    }

    await user.save();
    res.json(user.colors);
});

module.exports = router;