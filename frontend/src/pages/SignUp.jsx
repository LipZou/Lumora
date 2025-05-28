import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState(null);

    const navigate = useNavigate();

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const sendCode = async () => {
        if (!isValidEmail(email)) {
            setMessage('Please enter a valid email address.');
            return;
        }

        try {
            const res = await axios.post('/api/send-code', { email });
            if (res.data.success) {
                setStep(2);
                setMessage('Verification code sent. Please check your email.');
            } else {
                setMessage(res.data.message);
            }
        } catch (err) {
            setMessage('Failed to send verification code.');
        }
    };

    const verifyCode = async () => {
        try {
            const res = await axios.post('/api/verify-code', { email, code });
            if (res.data.success) {
                setStep(3);
                setMessage('Verification successful. Please set your password.');
            } else {
                setMessage(res.data.message);
            }
        } catch (err) {
            setMessage('Verification failed.');
        }
    };


    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            const res = await axios.post('/api/signup', {
                email,
                password
            });

            if (res.data.success) {
                const userId = res.data.userId; // ✅ 后端需要返回 userId
                navigate(`/setup/${res.data.userId}`);   // ✅ 跳转到 setup 页面
            } else {
                alert(res.data.message || 'Registration failed.');
            }
        } catch (err) {
            alert('Network error. Registration failed.');
        }
    };


    return (
        <div style={containerStyle}>
            <h2>Register for Lumora</h2>

            <form onSubmit={handleRegister} style={formStyle}>
                {/* Email Field */}
                <div style={{ marginBottom: '8px' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                        disabled={step > 1}
                    />
                    <div style={{ height: '16px' }}>
                        {email && !isValidEmail(email) && (
                            <p style={{ color: 'orange', fontSize: '12px', margin: '2px 0 0' }}>
                                Invalid email format
                            </p>
                        )}
                    </div>
                </div>

                {/* Step 1 */}
                {step === 1 && (
                    <button type="button" style={buttonStyle} onClick={sendCode}>
                        Send Verification Code
                    </button>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <>
                        <input
                            placeholder="Enter verification code"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            required
                            style={inputStyle}
                        />
                        <button type="button" style={buttonStyle} onClick={verifyCode}>
                            Verify Code
                        </button>
                    </>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <>
                        <input
                            type="password"
                            placeholder="Set password (at least 8 characters)"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                        />
                        <button type="submit" style={buttonStyle} disabled={password.length < 8}>
                            Register
                        </button>
                    </>
                )}

                {message && <p style={{ color: 'red' }}>{message}</p>}
            </form>
        </div>
    );
}

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '80px',
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '300px',
    alignItems: 'center',
};

const inputStyle = {
    width: '300px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
};

const buttonStyle = {
    width: '300px',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default SignUp;