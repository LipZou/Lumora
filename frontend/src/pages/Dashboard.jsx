import React from 'react';
import UserHeader from '../components/UserHeader';
import UploadPanel from "../components/UploadPanel";

function Dashboard() {
    return(
        <div>
            <UserHeader currentPage="dashboard" />   {/* ✅ 传入不同身份 */}
            <UploadPanel />
        </div>
    );
}

export default Dashboard;