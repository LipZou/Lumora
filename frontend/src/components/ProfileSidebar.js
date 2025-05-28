import React, { useState } from 'react'

const sidebarItems = [
    { key: 'colors', label: 'Colors' },
    { key: 'following', label: 'Following' },
    { key: 'followers', label: 'Followers' },
    { key: 'world', label: 'World' },
    { key: 'settings', label: 'Settings' },
    { key: 'signout', label: 'Sign Out' },
];



function Sidebar({ active, onSelect, user, onEditProfile, onChangeAvatar }) {

    const safeUser = user || {
        avatar: '/default-avatar.png',
        username: 'Your Name',
        signature: 'Your signature here',
    };

    return (
        <div style={leftPanelStyle}>
            {/* Profile Block */}
            <div style={profileBlockStyle}>
                <div style={avatarWrapper} onClick={onChangeAvatar}>
                    <img
                        src={safeUser.avatar}
                        alt="avatar"
                        style={avatarStyle}
                    />
                </div>
                <div style={profileTextWrapper}>
                    <div style={usernameRow}>
                        <span>{safeUser.username}</span>
                        <button style={editBtn} onClick={onEditProfile}>Edit</button>
                    </div>
                    <div style={signatureStyle}>{safeUser.signature}</div>
                </div>
            </div>

            {/* Sidebar Menu */}
            <div style={menuWrapper}>
                {sidebarItems.map(item => (
                    <div
                        key={item.key}
                        onClick={() => onSelect(item.key)}
                        style={{
                            ...menuItemStyle,
                            ...(active === item.key ? activeItemStyle : {}),
                        }}
                    >
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
}

const leftPanelStyle = {
    flex: 1,
    minWidth: '180px',
    maxWidth: '240px',
    paddingRight: '20px',
};

const profileBlockStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px',
    alignItems: 'center',
};

const avatarWrapper = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    overflow: 'hidden',
    cursor: 'pointer',
};

const avatarStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
};

const profileTextWrapper = {
    flex: 1,
};

const usernameRow = {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    marginBottom: '4px',
};

const editBtn = {
    fontSize: '0.75rem',
    border: 'none',
    background: 'none',
    color: '#007bff',
    cursor: 'pointer',
};

const signatureStyle = {
    fontSize: '0.85rem',
    color: '#666',
};

const menuWrapper = {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
};

const menuItemStyle = {
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#333',
    padding: '6px 8px',
    borderRadius: '6px',
    transition: 'background 0.2s',
};

const activeItemStyle = {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
};

export default Sidebar;
