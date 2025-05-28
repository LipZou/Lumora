// server/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const colorRoutes = require('./routes/userColors');
const profileRoutes = require('./routes/profile');

require('dotenv').config();

const MONGO_URL = 'mongodb://localhost:27017/lumora';
const PORT = 5001;

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error', err));

const app = express();
app.use(cors());
app.use(express.json());

// 路由模块挂载
app.use('/api', authRoutes);
app.use('/api/colors', colorRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/profile', profileRoutes)

app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});