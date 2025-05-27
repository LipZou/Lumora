import React from 'react';
import Header from '../components/Header';
import Carousel from '../components/Carousel';
import ColorQuote from '../components/Intro';

function LoggedInHome() {
    return (
        <div>
            <Header />
            <Carousel />
            <ColorQuote />
        </div>
    );
}

export default LoggedInHome;
