import React from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { signOut } from '../utils/auth'

function UserHeader({ currentPage }) {
    const navigate = useNavigate();

    return (
        <div style={headerStyle}>
            <div style={logoStyle}>Lumora</div>
            <div style={navStyle}>
                {/* 根据 currentPage 决定显示哪个按钮 */}
                {currentPage !== 'home' && (
                    <Link to="/home" style={linkStyle}>Home</Link>
                )}
                {currentPage !== 'dashboard' && (
                    <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                )}
                <Link to="/profile" style={linkStyle}>Profile</Link>
                <button onClick={() => signOut(navigate)} style={{ ...linkStyle, background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    Sign Out
                </button>
            </div>
        </div>
    );
}

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ddd',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
};

const logoStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#222831',
};

const navStyle = {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
};

const linkStyle = {
    textDecoration: 'none',
    fontSize: '16px',
    color: '#222831',
    fontWeight: '500',
};

export default UserHeader;