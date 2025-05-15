import React from 'react';

function Intro() {
    return (
        <div style={containerStyle}>
            <h2 style={headlineStyle}>Collect the colors of life</h2>
            <p style={paragraphStyle}>
                Have you ever wondered how many colors exist in the world? How many have you truly seen?
                Sometimes, we need to slow down to find the base tones of our lives.
            </p>
        </div>
    );
}

const containerStyle = {
    margin: '40px auto 0',
    padding: '0 20px',
    maxWidth: '900px',
    textAlign: 'left',
    color: '#222831',
};

const headlineStyle = {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    marginBottom: '16px',
};

const paragraphStyle = {
    fontSize: '1.125rem',
    lineHeight: '1.6',
    fontStyle: 'italic',
    color: '#393E46',
};

export default Intro;