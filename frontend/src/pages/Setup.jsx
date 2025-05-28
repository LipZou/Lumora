import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';



function Setup() {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [signature, setSignature] = useState('');
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams();

    const checkUsername = async () => {
        if (!username) return;
        try {
            const res = await axios.post('/api/profile/check-username', { username });
            setUsernameAvailable(res.data.available);
        } catch (err) {
            setUsernameAvailable(false);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('username', username);
        if (avatar) formData.append('avatar', avatar);
        if (signature) formData.append('signature', signature);

        try {
            setLoading(true);
            const res = await axios.put(`/api/profile/${userId}`, formData);
            if (res.data.success) {
                alert('Profile setup complete!');
                navigate('/signin');
            } else {
                alert(res.data.message || 'Setup failed');
            }
        } catch (err) {
            alert('Network error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={outerStyle}>
            <div style={cardStyle}>
                {step === 1 && (
                    <>
                        <h3>Choose a username</h3>
                        <div style={{width: '100%'}}>
                            <input
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onBlur={checkUsername}
                                style={inputStyle}
                                required
                            />
                            {/* 🔽 保留固定高度，避免按钮跳动 */}
                            <div style={{height: '16px'}}>
                                {username && usernameAvailable === false && (
                                    <p style={{color: 'red', fontSize: '12px', margin: 0}}>
                                        Username is already taken.
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            disabled={!username || usernameAvailable === false}
                            onClick={() => setStep(2)}
                            style={buttonStyle}
                        >
                            Next
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h3>Upload an avatar</h3>
                        <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])}/>
                        <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                            <button onClick={() => setStep(3)} style={buttonStyle}>Skip</button>
                            <button onClick={() => setStep(3)} style={buttonStyle}>Next</button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h3>Leave a word</h3>
                        <input
                            type="text"
                            value={signature}
                            onChange={(e) => setSignature(e.target.value)}
                            placeholder="Your signature..."
                            style={inputStyle}
                        />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button onClick={handleSubmit} style={buttonStyle}>Submit</button>
                            <button onClick={handleSubmit} style={buttonStyle}>Skip</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const outerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
};

const cardStyle = {
    background: '#fff',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '360px',
    textAlign: 'center',
};

const inputStyle = {
    padding: '10px',
    marginTop: '10px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
};

const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '30px'
};

export default Setup;
