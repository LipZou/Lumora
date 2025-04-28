const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    console.log('Data from frontend:', email, password);

    if(email === 'test@test.com' && password === '123456') {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});