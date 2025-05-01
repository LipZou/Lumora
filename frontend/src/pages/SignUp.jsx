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
        <div style={containerStyle}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} style = {formStyle}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    style={inputStyle}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                /><br /><br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    style={inputStyle}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                /><br /><br />
                <button type="submit" style = {buttonStyle}>Register</button>
            </form>
        </div>
    );
}
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '100px',
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '300px',
}

const inputStyle = {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
}

const buttonStyle = {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
}

export default SignUp;