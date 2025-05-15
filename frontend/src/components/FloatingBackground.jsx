import React, { useEffect, useState } from "react";

const colors = [
    'rgba(255, 204, 204, 0.2)',
    'rgba(204, 255, 255, 0.2)',
    'rgba(255, 255, 204, 0.2)',
    'rgba(204, 255, 204, 0.2)',
    'rgba(204, 204, 255, 0.2)',
];


const generateBlob = () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${40 + Math.random() * 80}px`,
    delay: `${Math.random() * 5}s`,
    duration: `${20 + Math.random() * 20}s`,
    color: colors[Math.floor(Math.random() * colors.length)],
});

function FloatingBackground() {

    console.log('FloatingBackground mounted');

    const [blobs, setBlobs] = useState([]);

    useEffect(() => {
        const newBlobs = Array.from({ length: 20 }, () => generateBlob());
        setBlobs(newBlobs);
    }, []);

    return (
        <div style={bgContainer}>
            {blobs.map((blob, index) => (
                <div
                    key={index}
                    style={{
                        ...blobStyle,
                        backgroundColor: blob.color,
                        top: blob.top,
                        left: blob.left,
                        width: blob.size,
                        height: blob.size,
                        animationDelay: blob.delay,
                        animationDuration: blob.duration,
                    }}
                />
            ))}
        </div>
    );

}

const bgContainer = {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    overflow: 'hidden',
    zIndex: -1,
};

const blobStyle = {
    position: 'absolute',
    borderRadius: '50%',
    animationName: 'floatUp',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
};

export default FloatingBackground;