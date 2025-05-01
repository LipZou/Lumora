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
    marginTop: '40px',
    textAlign: 'center',
    maxWidth: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#222831',
};

const headlineStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: '16px',
};

const paragraphStyle = {
    fontSize: '18px',
    lineHeight: '1.6',
    fontStyle: 'italic',
    textAlign: 'left',
    color: '#393E46',
};

export default Intro;