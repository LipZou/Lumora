import React from 'react';
import UserHeader from '../components/UserHeader';
import Carousel from '../components/Carousel';
import ColorQuote from '../components/Intro';

function LoggedInHome() {
    return (
        <div>
            <UserHeader currentPage="home" />
            <Carousel />
            <ColorQuote />
        </div>
    );
}

export default LoggedInHome;
