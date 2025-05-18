import React, { useEffect, useState } from "react";

const colors = [
    'rgba(127, 85, 177, 0.4)',   // 紫
    'rgba(155, 126, 189, 0.4)',  // 淡紫
    'rgba(244, 155, 171, 0.4)',  // 桃粉
    'rgba(255, 225, 224, 0.4)',  // 雪粉
    'rgba(254, 93, 38, 0.4)',    // 橘红
    'rgba(242, 192, 120, 0.4)',  // 奶茶橙
    'rgba(250, 237, 202, 0.4)',  // 柔米黄
    'rgba(193, 219, 179, 0.4)',  // 草绿色

    'rgba(108, 182, 255, 0.4)',  // 天空蓝
    'rgba(154, 214, 234, 0.4)',  // 冰蓝
    'rgba(89, 136, 182, 0.4)',   // 深海蓝
    'rgba(210, 226, 255, 0.4)',  // 牛奶蓝

    'rgba(140, 190, 145, 0.4)',  // 青草绿
    'rgba(181, 234, 215, 0.4)',  // 雾绿
    'rgba(107, 153, 144, 0.4)',  // 苔绿灰

    'rgba(171, 171, 171, 0.4)',  // 中性灰
    'rgba(224, 224, 224, 0.4)',  // 云灰白
    'rgba(144, 115, 83, 0.4)',   // 摩卡棕
    'rgba(174, 158, 131, 0.4)',  // 沙棕
    'rgba(244, 244, 244, 0.4)',  // 极浅灰白
];


const generateBlob = () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${50 + Math.random() * 100}px`,
    delay: `${Math.random() * 5}s`,
    duration: `${20 + Math.random() * 30}s`,
    color: colors[Math.floor(Math.random() * colors.length)],
});

function generateBlobGridBased({
                                   count = 40,
                                   baseSize = 80,
                                   sizeVariance = 40,
                                   padding = 10
                               }) {
    const blobs = [];
    const candidates = [];

    const step = baseSize + padding;
    const maxCols = Math.floor(window.innerWidth / step);
    const maxRows = Math.floor(window.innerHeight / step);

    for (let r = 0; r < maxRows; r++) {
        for (let c = 0; c < maxCols; c++) {
            candidates.push({ x: c * step, y: r * step });
        }
    }

    // 打乱所有候选位置
    for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    for (let i = 0; i < Math.min(count, candidates.length); i++) {
        const { x, y } = candidates[i];
        const size = baseSize + Math.random() * sizeVariance;

        blobs.push({
            top: `${y}px`,
            left: `${x}px`,
            size: `${size}px`,
            delay: `${Math.random().toFixed(2)}s`,
            duration: `${(20 + Math.random() * 20).toFixed(2)}s`,
            color: colors[Math.floor(Math.random() * colors.length)],
        });
    }

    return blobs;
}

function FloatingBackground() {

    console.log('FloatingBackground mounted');

    const [blobs, setBlobs] = useState([]);

    useEffect(() => {
        const blobList = generateBlobGridBased({
            count: 30,         // ✅ 想要多少就写多少
            baseSize: 80,      // ✅ 最小尺寸
            sizeVariance: 60,  // ✅ 最大随机浮动
            padding: 10        // ✅ 防止太挤
        });

        setBlobs(blobList);

        const handleScroll = () => {
            const scrollSpeed = window.scrollY;
            document.querySelectorAll('.bg-blob').forEach(el => {
                el.style.transform = `translateY(${-30 + scrollSpeed * 0.1}px)`;
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={bgContainer}>
            {blobs.map((blob, index) => (
                <div
                    key={index}
                    className="bg-blob"
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
    borderRadius: '10px', // ✅ 圆角方块
    animationName: 'floatUpDown',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    willChange: 'transform',
    pointerEvents: 'none',
    border: '1px solid rgba(0,0,0,0.08)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

export default FloatingBackground;