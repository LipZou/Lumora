// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // 你也可以用其他 SMTP 服务
    auth: {
        user: process.env.EMAIL_USER, // 邮箱
        pass: process.env.EMAIL_PASS, // 邮箱授权码
    },
});

async function sendVerificationEmail(to, code) {
    await transporter.sendMail({
        from: `"Lumora" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Lumora Verification Code',
        text: `Your Verification code is：${code}，expired in 5 minutes`,
    });
}

module.exports = { sendVerificationEmail };