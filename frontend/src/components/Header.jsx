import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from '../utils/auth';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('userId');
    const path = location.pathname;

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
        gap: '20px',
        alignItems: 'center',
    };

    const buttonStyle = {
        padding: '8px 16px',
        border: '1px solid #4CAF50',
        backgroundColor: 'white',
        color: '#4CAF50',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        textDecoration: 'none'
    };

    const solidButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#4CAF50',
        color: 'white',
    };

    return (
        <div style={headerStyle}>
            <div style={logoStyle}>Lumora</div>
            <div style={navStyle}>
                {!isLoggedIn ? (
                    <>
                        <Link to="/signin" style={buttonStyle}>Login</Link>
                        <Link to="/signup" style={solidButtonStyle}>Sign Up</Link>
                    </>
                ) : (
                    <>
                        {path !== '/dashboard' && <Link to="/dashboard" style={buttonStyle}>Dashboard</Link>}
                        {path !== '/' && <Link to="/" style={buttonStyle}>Home</Link>}
                        {path !== '/profile' && <Link to="/profile" style={buttonStyle}>Profile</Link>}
                        {path !== '/map' && <Link to="/map" style={buttonStyle}>Map</Link>}
                        {/* ✅ Sign Out 将来可以移动到 profile 内部 */}
                    </>
                )}
            </div>
        </div>
    );
}

export default Header;
