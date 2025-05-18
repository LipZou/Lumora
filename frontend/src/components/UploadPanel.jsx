import React, { useState, useRef, useEffect } from 'react';
import ColorPopup from './ColorPopup';
import { extractDominantColors, matchColorsWithDatabase } from '../utils/colorUtils';
import { colorDB } from '../data/colorDB'; // 如果你系统色表在另一个文件中

function UploadPanel() {
    const [image, setImage] = useState(null);
    const [pixelImage, setPixelImage] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [blockSize, setBlockSize] = useState(50);
    const [processingType, setProcessingType] = useState('pixel');
    const [styleEffect, setStyleEffect] = useState('none');
    const [processed, setProcessed] = useState(false);

    const canvasRef = useRef(null);
    const validTypes = ['image/jpeg', 'image/png'];

    // 弹窗状态控制
    const [showColorPopup, setShowColorPopup] = useState(false);
    const [newColors, setNewColors] = useState([]);
    const [existingColors, setExistingColors] = useState([]);

    useEffect(() => {
        if (image && processed) {
            switchMode(processingType, styleEffect);
        }
    }, [processingType, styleEffect, blockSize]);

    const handleFile = (file) => {
        if (!validTypes.includes(file.type)) {
            alert('Only JPG and PNG images are supported.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };
    const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const handleDragLeave = () => setDragging(false);
    const handleBrowse = (e) => handleFile(e.target.files[0]);

    const switchMode = (type, style) => {
        if (!image) return;

        const applyStyle = (baseImg) => {
            if (style === 'palette') {
                generatePaletteStyle(baseImg, blockSize, setPixelImage);
            } else if (style === 'edge') {
                generateEdgeStyle(baseImg, blockSize, setPixelImage);
            } else {
                setPixelImage(baseImg);
            }
        };

        if (type === 'pixel') {
            generatePixelStyle(image, blockSize, applyStyle);
        } else if (type === 'triangle') {
            generateTriangleStyle(image, blockSize, applyStyle);
        }
    };

    const handleProcess = async () => {
        if (!image) return;

        // Step 1: 图像处理
        switchMode(processingType, styleEffect);
        setProcessed(true);

        // Step 2: 调用正确的颜色分析函数
        const { newColors, existingColors } = await analyzeImageColors(image, colorDB, []); // 第三个参数为用户已有色表，暂传空

        console.log("🆕 newColors", newColors);
        console.log("✅ existingColors", existingColors);

        // Step 3: 显示弹窗
        setNewColors(newColors);
        setExistingColors(existingColors);
        setShowColorPopup(true);
    };

    const generatePixelStyle = (imageSrc, blockSize, callback) => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const width = img.width, height = img.height;
            const tempCanvas = document.createElement('canvas');
            const ctx = tempCanvas.getContext('2d');
            tempCanvas.width = width;
            tempCanvas.height = height;
            ctx.drawImage(img, 0, 0);

            const { data } = ctx.getImageData(0, 0, width, height);
            const outCanvas = document.createElement('canvas');
            const outCtx = outCanvas.getContext('2d');
            outCanvas.width = width;
            outCanvas.height = height;

            for (let y = 0; y < height; y += blockSize) {
                for (let x = 0; x < width; x += blockSize) {
                    let r = 0, g = 0, b = 0, count = 0;
                    for (let dy = 0; dy < blockSize; dy++) {
                        for (let dx = 0; dx < blockSize; dx++) {
                            const px = x + dx, py = y + dy;
                            if (px >= width || py >= height) continue;
                            const i = (py * width + px) * 4;
                            r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
                        }
                    }
                    r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);
                    outCtx.fillStyle = `rgb(${r},${g},${b})`;
                    outCtx.fillRect(x, y, blockSize, blockSize);
                }
            }
            callback(outCanvas.toDataURL());
        };
    };

    const generateTriangleStyle = (imageSrc, blockSize, callback) => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const width = img.width, height = img.height;
            const tempCanvas = document.createElement('canvas');
            const ctx = tempCanvas.getContext('2d');
            tempCanvas.width = width;
            tempCanvas.height = height;
            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(0, 0, width, height).data;

            const triangleCanvas = document.createElement('canvas');
            const tctx = triangleCanvas.getContext('2d');
            triangleCanvas.width = width;
            triangleCanvas.height = height;

            for (let y = 0; y < height; y += blockSize) {
                for (let x = 0; x < width; x += blockSize) {
                    const avg1 = averageColor(data, x, y, blockSize, width, height, 'upper');
                    const avg2 = averageColor(data, x, y, blockSize, width, height, 'lower');

                    tctx.fillStyle = `rgb(${avg1.join(',')})`;
                    tctx.beginPath();
                    tctx.moveTo(x, y);
                    tctx.lineTo(x + blockSize, y);
                    tctx.lineTo(x + blockSize, y + blockSize);
                    tctx.closePath();
                    tctx.fill();

                    tctx.fillStyle = `rgb(${avg2.join(',')})`;
                    tctx.beginPath();
                    tctx.moveTo(x, y);
                    tctx.lineTo(x, y + blockSize);
                    tctx.lineTo(x + blockSize, y + blockSize);
                    tctx.closePath();
                    tctx.fill();
                }
            }
            callback(triangleCanvas.toDataURL());
        };
    };

    const averageColor = (data, x0, y0, size, width, height, part) => {
        let r = 0, g = 0, b = 0, count = 0;
        for (let dy = 0; dy < size; dy++) {
            for (let dx = 0; dx < size; dx++) {
                const px = x0 + dx, py = y0 + dy;
                if (px >= width || py >= height) continue;
                if ((part === 'upper' && dy <= dx) || (part === 'lower' && dy > dx)) {
                    const i = (py * width + px) * 4;
                    r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
                }
            }
        }
        return count === 0 ? [0, 0, 0] : [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
    };

    const generatePaletteStyle = (imageSrc, blockSize, callback) => {
        const palette = [ [190,180,170], [140,130,120], [180,210,200], [100,90,80], [220,200,190], [160,170,180] ];
        const findNearest = (r, g, b) => {
            let best = palette[0], minDist = Infinity;
            for (const [pr, pg, pb] of palette) {
                const dist = (r-pr)**2 + (g-pg)**2 + (b-pb)**2;
                if (dist < minDist) { best = [pr, pg, pb]; minDist = dist; }
            }
            return best;
        };

        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const [pr, pg, pb] = findNearest(data[i], data[i + 1], data[i + 2]);
                data[i] = pr; data[i + 1] = pg; data[i + 2] = pb;
            }
            ctx.putImageData(imageData, 0, 0);
            callback(canvas.toDataURL());
        };
    };

    const generateEdgeStyle = (imageSrc, blockSize, callback) => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            for (let y = 0; y < canvas.height; y += blockSize) {
                for (let x = 0; x < canvas.width; x += blockSize) {
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, blockSize, blockSize);
                }
            }
            callback(canvas.toDataURL());
        };
    };

    // 颜色匹配算法
    function findClosestColor(rgb, colorList, threshold = 30) {
        let closest = null;
        let minDist = Infinity;

        for (const color of colorList) {
            const [r2, g2, b2] = color.rgb;
            const dist = Math.sqrt(
                (rgb[0] - r2) ** 2 + (rgb[1] - g2) ** 2 + (rgb[2] - b2) ** 2
            );

            if (dist < minDist) {
                minDist = dist;
                closest = color;
            }
        }

        return minDist <= threshold ? closest : null;
    }

    // 从图像提取颜色
    function extractDominantColors(imageSrc, blockSize = 10) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = imageSrc;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const colorMap = new Map();

                const step = blockSize;
                for (let y = 0; y < canvas.height; y += step) {
                    for (let x = 0; x < canvas.width; x += step) {
                        const i = (y * canvas.width + x) * 4;
                        const r = imageData.data[i];
                        const g = imageData.data[i + 1];
                        const b = imageData.data[i + 2];
                        const key = `${r},${g},${b}`;
                        colorMap.set(key, (colorMap.get(key) || 0) + 1);
                    }
                }

                const sorted = [...colorMap.entries()]
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 20)
                    .map(([key]) => key.split(',').map(Number));

                resolve(sorted); // Array of [r, g, b]
            };
        });
    }

    // 颜色处理主函数
    async function analyzeImageColors(imageSrc, allColors, userColors) {
        const detectedRGBs = await extractDominantColors(imageSrc);

        const userColorHexSet = new Set(userColors.map(c => c.hex.toLowerCase()));
        const detectedColors = [];
        const newColors = [];
        const existingColors = [];

        for (const rgb of detectedRGBs) {
            const matched = findClosestColor(rgb, allColors);

            if (matched) {
                detectedColors.push(matched);
                if (userColorHexSet.has(matched.hex.toLowerCase())) {
                    existingColors.push(matched);
                } else {
                    newColors.push(matched);
                }
            } else {
                // 没有匹配，认为是新颜色，临时生成一个 hex
                const hex = `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
                const newColor = { name: 'Unknown', rgb, hex };
                newColors.push(newColor);
                detectedColors.push(newColor);
            }
        }

        return { detectedColors, newColors, existingColors };
    }


    // ✅ UI 渲染略（留空）
    return (
        <div style={wrapperStyle}>
            {!image && (
                <div
                    style={{
                        ...dropZoneStyle,
                        borderColor: dragging ? '#4ecca3' : '#ccc',
                        backgroundColor: dragging ? '#f0fdf4' : '#fafafa',
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <p>Click or drag an image here to upload (JPG/PNG)</p>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleBrowse}
                        style={{ display: 'none' }}
                        id="fileInput"
                    />
                    <label htmlFor="fileInput" style={browseStyle}>
                        Browse
                    </label>
                </div>
            )}

            {image && !processed && (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <img src={image} alt="Preview" style={finalImageStyle} />
                    <div style={buttonGroupStyle}>
                        <button style={processButtonStyle} onClick={handleProcess}>Process</button>
                        <button style={resetButtonStyle} onClick={() => setImage(null)}>Choose Another</button>
                    </div>
                </div>
            )}

            {image && processed && (
                <>
                    {/* 顶部标题 */}
                    <div style={topTitleStyle}>
                        <h2 style={sectionTitle}>Preview Result</h2>
                        <hr style={{ borderTop: '1px solid #aaa', marginBottom: '20px' }} />
                    </div>

                    {/* 主体区域 */}
                    <div style={resultContainer}>
                        {/* 左边图片 */}
                        <div style={imagePreviewArea}>
                            <img src={pixelImage} alt="Processed" style={finalImageStyle} />
                        </div>

                        {/* 右边控制面板 */}
                        <div style={controlPanelStyle}>
                            <div style={sectionStyle}>
                                <label>Pixel Size: {blockSize}</label>
                                <input
                                    type="range"
                                    min="4"
                                    max="100"
                                    step="4"
                                    value={blockSize}
                                    onChange={(e) => setBlockSize(parseInt(e.target.value))}
                                />
                            </div>

                            <div style={sectionStyle}>
                                <label>Type:</label>
                                <div style={buttonGroup}>
                                    <button onClick={() => setProcessingType('pixel')}>Pixel</button>
                                    <button onClick={() => setProcessingType('triangle')}>Triangle</button>
                                </div>
                            </div>

                            <div style={sectionStyle}>
                                <label>Style:</label>
                                <div style={buttonGroup}>
                                    <button onClick={() => setStyleEffect('none')}>None</button>
                                    <button onClick={() => setStyleEffect('edge')}>Edge</button>
                                    <button onClick={() => setStyleEffect('palette')}>Palette</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ✅ 独立按钮区域 */}
                    <div style={buttonGroupStyle}>
                        <button
                            onClick={() => {
                                setImage(null);
                                setPixelImage(null);
                                setProcessed(false);
                            }}
                        >
                            Choose Another
                        </button>
                        <a href={pixelImage} download="lumora.png">
                            <button>Save Image</button>
                        </a>
                    </div>
                </>
            )}

            {/* ✅ 弹窗遮罩层（放在最底部 return 内部） */}
            {showColorPopup && (
                <ColorPopup
                    newColors={newColors}
                    existingColors={existingColors}
                    onClose={() => setShowColorPopup(false)}
                />
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
}

const wrapperStyle = {
    maxWidth: '1500px',
    margin: '60px auto',
    color: '#333',
};

const dropZoneStyle = {
    border: '2px dashed #ccc',
    borderRadius: '12px',
    padding: '40px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    textAlign: 'center',
};

const browseStyle = {
    marginTop: '12px',
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
};

const buttonGroupStyle = {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
};

const processButtonStyle = {
    padding: '10px 24px',
    backgroundColor: '#000',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
};

const resetButtonStyle = {
    ...processButtonStyle,
    backgroundColor: '#444',
};

const resultContainer = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '60px',
    marginTop: '40px',
};

const imagePreviewArea = {
    flex: 2,
};

const sectionTitle = {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: 'left',
};

const finalImageStyle = {
    width: '100%',
    maxWidth: '1800px',
    borderRadius: '12px',
};

const controlPanelStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    padding: '20px',
    backgroundColor: '#f8f8f8',
    borderRadius: '12px',
};

const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
};

const buttonGroup = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
};

const blackButton = {
    padding: '10px 20px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
};

const topTitleStyle = {
    width: '100%',
    paddingLeft: '10px',
    marginBottom: '20px',
};

export default UploadPanel;
