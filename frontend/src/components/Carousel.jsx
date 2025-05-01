import React, { useState, useRef } from 'react';

const images = [
    '/assets/sample1.jpg',
    '/assets/sample2.jpg',
    '/assets/sample3.jpg',
];

function Carousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const startX = useRef(null);
    const dragging = useRef(false);

    // 鼠标按下
    const handleMouseDown = (e) => {
        dragging.current = true;
        startX.current = e.clientX;
    };
    // 鼠标松开
    const handleMouseUp = (e) => {
        if(!dragging.current) return;
        dragging.current = false;
        const endX = e.clientX;
        handleSwipe(endX - startX.current);
    };

    const handleSwipe = (deltaX) => {
        if (deltaX > 50) {
            goToPrev();
        } else if (deltaX < -50) {
            goToNext();
        }
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div style={outerWrapperStyle}>
            <div
                style={carouselStyle}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => (dragging.current = false)}
            >
                {images.map((src, index) => {
                    let offset = index - currentIndex;

                    // 🔁 确保 offset 是 -1, 0, 1（左中右）
                    if (offset < -1) offset += images.length;
                    if (offset > 1) offset -= images.length;

                    return (
                        <img
                            key={index}
                            src={src}
                            draggable={false}
                            alt={`Slide ${index}`}
                            style={{
                                ...imageStyle,
                                transform: `
                                    translateX(${offset * 50}%)
                                    scale(${offset === 0 ? 1 : 0.8})
                                `,
                                opacity: offset === 0 ? 1 : 0.4,
                                zIndex: offset === 0 ? 2 : 1,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}

const outerWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '40px', // ✅ 往下移一点
};

const carouselStyle = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '900px',
    height: '400px',
    overflow: 'hidden',
    borderRadius: '16px',
};

const imageStyle = {
    position: 'absolute',
    width: '70%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '16px',
    transition: 'all 0.5s ease',
    boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
};

export default Carousel;
