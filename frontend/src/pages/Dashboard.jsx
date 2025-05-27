import React from 'react';
import Header from '../components/Header';
import UploadPanel from "../components/UploadPanel";

function Dashboard() {
    return(
        <div>
            <Header />   {/* ✅ 传入不同身份 */}
            <UploadPanel />
        </div>
    );
}

export default Dashboard;