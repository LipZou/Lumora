const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost:27017/lumora';


mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error', err))

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const User = require('./models/User')

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user) {
            return res.json({ success: false, message: 'User doesn\'t exit'})
        }
        if(user.password !== password) {
            return res.json({success: false, message: 'Incorrect Password'})
        }

        return res.json({success: true})
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Server failed'})
    }
});

app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email })
        if(existingUser) {
            return res.json({ success: false, message: 'Email already registered'});
        }

        const newUser = new User({ email, password });
        await newUser.save();

        return res.json({ success: true, message: 'Registration successful'});
    } catch(error) {
        console.error('Signup Error:', error);
        return res.status(500).json({ success: false, message: 'Server error'});
    }

});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});