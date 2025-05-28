import React from 'react';
import Header from '../components/Header';
import UploadPanel from "../components/UploadPanel";

function Dashboard() {
    return(
        <div style={wrapperStyle}>
            <Header />   {/* ✅ 传入不同身份 */}
            <UploadPanel />
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

export default Dashboard;