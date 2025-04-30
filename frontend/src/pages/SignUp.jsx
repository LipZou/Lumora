import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5001/api/signup', {email, password});
            if (res.data.success) {
                alert('Registration successful! Redirecting to login...');
                navigate('/signin');
            } else {
                alert(res.data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Signup Error:', error);
            alert('Something went wrong, please try again later');
        }
    };

    return (
        <div style={{ padding: '50px' }}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                /><br /><br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                /><br /><br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default SignUp;