import React from 'react';
import { Link } from 'react-router-dom'
function HomeHeader() {
    return (
        <div style = {homeHeaderStyle}>
            <div style = {logoStyle}>Lumora</div>
            <div style = {buttonGroupStyle}>
                <Link to="/signin" style={{ textDecoration: 'none' }}>
                    <button style={buttonStyle}>Login</button>
                </Link>
                <button style = {{ ...buttonStyle, backgroundColor: '#4CAF50', color: 'white'}}>Sign Up</button>
            </div>
        </div>
    );
}

const homeHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 50px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ddd',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
};

const logoStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
};

const buttonGroupStyle = {
    display: 'flex',
    gap: '15px',
};

const buttonStyle = {
    padding: '8px 16px',
    border: '1px solid #4CAF50',
    backgroundColor: 'white',
    color: '#4CAF50',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
};

export default HomeHeader;