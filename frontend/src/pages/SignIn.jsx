import React, { useState } from 'react';
import axios from "axios";
import { useNavigate }  from "react-router-dom";

function SignIn() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5001/api/login', {
                email: email,
                password: password,
            });

            console.log('Server Response:', response.data);

            if(response.data.success) {
                alert('Successful login!');
                navigate('/dashboard')
            } else {
                alert(response.data.message);
            }
        } catch(error){
            console.error('Login Error:', error);
            alert('Login failed, please try again later');
        }
    }

    return (
        <div style = {containerStyle}>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                <input
                    type="email"
                    placeholder="Emial"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    required
                />
                <button type="submit" style={buttonStyle}>Login</button>
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
};

const inputStyle = {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
};

const buttonStyle = {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default SignIn;