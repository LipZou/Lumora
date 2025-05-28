import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header'
import ProfileSidebar from "../components/ProfileSidebar";


function Profile() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        axios.get(`http://localhost:5001/api/users/${userId}`)
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.error('Failed to fetch user:', err);
            });
    }, []);

    return (
        <div style={wrapperStyle}>
            <Header/>

            <div style={containerStyle}>
                {/* 左侧 1/5 */}
                <div style={leftPanelStyle}>
                    <ProfileSidebar user={user}/>
                </div>

                {/* 右侧 4/5 */}
                <div style={rightPanelStyle}>
                    <h2>Welcome to your Profile</h2>
                    <p>This is where your user information and preferences will appear.</p>
                    {/* 后续填入功能内容 */}
                </div>

            </div>

            {/* 下面是Gallery和Text */}
        </div>
    );
}

const wrapperStyle = {
    width: '100%',
    maxWidth: '1500px',
    margin: '0 auto',
    padding: '0 20px',  // 左右留白
    boxSizing: 'border-box',
    position: 'relative',
};


const containerStyle = {
    display: 'flex',
    padding: '30px 50px',
    gap: '40px',
};

const leftPanelStyle = {
    flex: 1,
    minWidth: '180px',
    maxWidth: '240px',
    borderRight: '1px solid #ccc',
    paddingRight: '20px',
};

const rightPanelStyle = {
    flex: 4,
};


export default Profile;