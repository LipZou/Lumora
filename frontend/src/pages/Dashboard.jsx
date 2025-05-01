import React from 'react';
import UserHeader from '../components/UserHeader';

function Dashboard() {
    return(
        <div>
            <UserHeader currentPage="dashboard" />   {/* ✅ 传入不同身份 */}
        </div>
    );
}

export default Dashboard;