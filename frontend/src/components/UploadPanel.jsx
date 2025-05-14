import React, { useState, useRef } from 'react';

function UploadPanel() {
    const [image, setImage] = useState(null);
    const [dragging, setDragging]  = useState(false);
    const [pixelImage, setPixelImage] = useState(null);
    const [blockSize, setBlockSize] = useState(50);
    const [processingMode, setProcessingMode] = useState('pixel');

    const canvasRef = useRef(null);

    const validTypes = ['image/jpeg', 'image/png'];

    const handleFile = (file) => {
        if(!validTypes.includes(file.type)) {
            alert('Only JPG and PNG images are supported.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);

    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleBrowse = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleProcess = () => {
        if (!image) return;

        setProcessingMode('pixel');
        setBlockSize(50);
        generatePixelStyle(image, 50, (result) => {
            setPixelImage(result);
        });
    };


    function generatePixelStyle(imageSrc, blockSize, callback) {
        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            const width = img.width;
            const height = img.height;

            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = width;
            tempCanvas.height = height;
            tempCtx.drawImage(img, 0, 0, width, height);

            const imageData = tempCtx.getImageData(0, 0, width, height);
            const data = imageData.data;

            const pixelCanvas = document.createElement('canvas');
            const pixelCtx = pixelCanvas.getContext('2d');
            pixelCanvas.width = width;
            pixelCanvas.height = height;

            for (let y = 0; y < height; y += blockSize) {
                for (let x = 0; x < width; x += blockSize) {
                    let r = 0, g = 0, b = 0, count = 0;

                    for (let dy = 0; dy < blockSize; dy++) {
                        for (let dx = 0; dx < blockSize; dx++) {
                            const px = x + dx;
                            const py = y + dy;
                            if (px >= width || py >= height) continue;

                            const i = (py * width + px) * 4;
                            r += data[i];
                            g += data[i + 1];
                            b += data[i + 2];
                            count++;
                        }
                    }

                    r = Math.round(r / count);
                    g = Math.round(g / count);
                    b = Math.round(b / count);

                    pixelCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                    pixelCtx.fillRect(x, y, blockSize, blockSize);
                }
            }

            const pixelURL = pixelCanvas.toDataURL();
            callback(pixelURL); // ✅ 返回生成后的图片
        };
    };

    // 莫兰迪风格
    const palette = [
        [190, 180, 170],
        [140, 130, 120],
        [180, 210, 200],
        [100, 90, 80],
        [220, 200, 190],
        [160, 170, 180],
    ];

    function findNearestColor(r, g, b, palette) {
        let minDist = Infinity;
        let bestColor = palette[0];

        for (const [pr, pg, pb] of palette) {
            const dist = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
            if (dist < minDist) {
                minDist = dist;
                bestColor = [pr, pg, pb];
            }
        }

        return bestColor;
    }

    function generatePaletteStyle(imageSrc, blockSize, callback) {
        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            const width = img.width;
            const height = img.height;

            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = width;
            tempCanvas.height = height;
            tempCtx.drawImage(img, 0, 0, width, height);

            const imageData = tempCtx.getImageData(0, 0, width, height);
            const data = imageData.data;

            const pixelCanvas = document.createElement('canvas');
            const pixelCtx = pixelCanvas.getContext('2d');
            pixelCanvas.width = width;
            pixelCanvas.height = height;

            for (let y = 0; y < height; y += blockSize) {
                for (let x = 0; x < width; x += blockSize) {
                    let r = 0, g = 0, b = 0, count = 0;

                    for (let dy = 0; dy < blockSize; dy++) {
                        for (let dx = 0; dx < blockSize; dx++) {
                            const px = x + dx;
                            const py = y + dy;
                            if (px >= width || py >= height) continue;

                            const i = (py * width + px) * 4;
                            r += data[i];
                            g += data[i + 1];
                            b += data[i + 2];
                            count++;
                        }
                    }

                    r = Math.round(r / count);
                    g = Math.round(g / count);
                    b = Math.round(b / count);

                    const [pr, pg, pb] = findNearestColor(r, g, b, palette);
                    pixelCtx.fillStyle = `rgb(${pr}, ${pg}, ${pb})`;
                    pixelCtx.fillRect(x, y, blockSize, blockSize);
                }
            }

            const result = pixelCanvas.toDataURL();
            callback(result);
        };
    };

    function generateTriangleStyle(imageSrc, blockSize, callback) {
        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            const width = img.width;
            const height = img.height;

            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = width;
            tempCanvas.height = height;
            tempCtx.drawImage(img, 0, 0, width, height);

            const imageData = tempCtx.getImageData(0, 0, width, height);
            const data = imageData.data;

            const triangleCanvas = document.createElement('canvas');
            const ctx = triangleCanvas.getContext('2d');
            triangleCanvas.width = width;
            triangleCanvas.height = height;

            for (let y = 0; y < height; y += blockSize) {
                for (let x = 0; x < width; x += blockSize) {
                    // 左上三角形：左上 → 右上 → 右下
                    const color1 = averageColor(data, x, y, blockSize, blockSize / 2, width, height, 'upper');
                    ctx.fillStyle = `rgb(${color1.join(',')})`;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + blockSize, y);
                    ctx.lineTo(x + blockSize, y + blockSize);
                    ctx.closePath();
                    ctx.fill();

                    // 右下三角形：左上 → 左下 → 右下
                    const color2 = averageColor(data, x, y, blockSize, blockSize / 2, width, height, 'lower');
                    ctx.fillStyle = `rgb(${color2.join(',')})`;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + blockSize);
                    ctx.lineTo(x + blockSize, y + blockSize);
                    ctx.closePath();
                    ctx.fill();
                }
            }

            const result = triangleCanvas.toDataURL();
            callback(result);
        };
    };

    function averageColor(data, x0, y0, size, half, width, height, part) {
        let r = 0, g = 0, b = 0, count = 0;
        for (let dy = 0; dy < size; dy++) {
            for (let dx = 0; dx < size; dx++) {
                const px = x0 + dx;
                const py = y0 + dy;

                if (px >= width || py >= height) continue;

                if (
                    (part === 'upper' && dy <= dx) ||
                    (part === 'lower' && dy > dx)
                ) {
                    const i = (py * width + px) * 4;
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count++;
                }
            }
        }

        if (count === 0) return [0, 0, 0];
        return [
            Math.round(r / count),
            Math.round(g / count),
            Math.round(b / count),
        ];
    };

    function generateEdgeStyle(imageSrc, blockSize, callback) {
        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            const width = img.width;
            const height = img.height;

            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = width;
            tempCanvas.height = height;
            tempCtx.drawImage(img, 0, 0, width, height);

            const imageData = tempCtx.getImageData(0, 0, width, height);
            const data = imageData.data;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;

            for (let y = 0; y < height; y += blockSize) {
                for (let x = 0; x < width; x += blockSize) {
                    let r = 0, g = 0, b = 0, count = 0;

                    for (let dy = 0; dy < blockSize; dy++) {
                        for (let dx = 0; dx < blockSize; dx++) {
                            const px = x + dx;
                            const py = y + dy;
                            if (px >= width || py >= height) continue;

                            const i = (py * width + px) * 4;
                            r += data[i];
                            g += data[i + 1];
                            b += data[i + 2];
                            count++;
                        }
                    }

                    r = Math.round(r / count);
                    g = Math.round(g / count);
                    b = Math.round(b / count);

                    // ✅ 填充色块
                    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.fillRect(x, y, blockSize, blockSize);

                    // ✅ 画黑色边框
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, blockSize, blockSize);
                }
            }

            const result = canvas.toDataURL();
            callback(result);
        };
    }

    const updatePixelImage = (imageSrc, blockSize, mode) => {
        // 根据当前 mode，调用不同处理函数
        if (mode === 'pixel') generatePixelStyle(imageSrc, blockSize);
        else if (mode === 'triangle') generateTriangleStyle(imageSrc);
        else if (mode === 'palette') generatePaletteStyle(imageSrc, blockSize);
        else if (mode === 'edge') generateEdgeStyle(imageSrc, blockSize);
    };

    const switchMode = (mode) => {
        setProcessingMode(mode); // 记录当前风格模式
        if (!image) return;

        if (mode === 'pixel') {
            generatePixelStyle(image, blockSize, setPixelImage);
        } else if (mode === 'palette') {
            generatePaletteStyle(image, blockSize, setPixelImage);  // ✅ 在这里绑定了
        } else if (mode === 'triangle') {
            generateTriangleStyle(image, blockSize, setPixelImage);
        } else if (mode === 'edge') {
            generateEdgeStyle(image, blockSize, setPixelImage);
        }
    };

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
                    <label htmlFor="fileInput" style={browseStyle}>Browse</label>
                </div>
            )}

            {image && (
                <div style={previewStyle}>
                    {/* 图片区域（原图或像素图） */}
                    <img
                        src={pixelImage ? pixelImage : image}
                        alt="Preview"
                        style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '20px' }}
                    />

                    {/* 如果还没处理，显示 Process 按钮 */}
                    {!pixelImage && (
                        <div style={buttonGroupStyle}>
                            <button style={processButtonStyle} onClick={handleProcess}>Process</button>
                            <button style={resetButtonStyle} onClick={() => { setImage(null); }}>Choose Another</button>
                        </div>
                    )}

                    {/* 如果已经处理完成，显示风格 + 保存按钮 */}
                    {pixelImage && (
                        <>
                            <div style={controlPanelStyle}>
                                <label sylte={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333'}}>
                                    Pixel Size: {blockSize}
                                </label>
                                <input
                                    type="range"
                                    min="4"
                                    max="100"
                                    step="4"
                                    value={blockSize}
                                    onChange={(e) => {
                                        const size = parseInt(e.target.value);
                                        setBlockSize(size);
                                        switchMode(processingMode);
                                    }}
                                />

                                <div style={modeButtonGroup}>
                                    <button
                                        style={processingMode === 'pixel' ? styleButtonSelected : styleButton}
                                        onClick={() => switchMode('pixel')}
                                    >
                                        Pixel
                                    </button>

                                    <button
                                        style={processingMode === 'triangle' ? styleButtonSelected : styleButton}
                                        onClick={() => switchMode('triangle')}
                                    >
                                        Triangle
                                    </button>

                                    <button
                                        style={processingMode === 'palette' ? styleButtonSelected : styleButton}
                                        onClick={() => switchMode('palette')}
                                    >
                                        Palette
                                    </button>

                                    <button
                                        style={processingMode === 'edge' ? styleButtonSelected : styleButton}
                                        onClick={() => switchMode('edge')}
                                    >
                                        Edge
                                    </button>
                                </div>
                            </div>

                            <div style={buttonGroupStyle}>
                                <button style = {styleButton}
                                        onClick={() => {
                                    setImage(null);
                                    setPixelImage(null);
                                }}>Choose Another
                                </button>
                                <a href={pixelImage} download="lumora.png">
                                    <button style = {styleButton}>Save Image</button>
                                </a>
                            </div>
                        </>
                    )}
                </div>
            )}

            <canvas ref={canvasRef} style={{display: 'none' }} />
        </div>
    );

}

const wrapperStyle = {
    maxWidth: '600px',
    margin: '60px auto',
    textAlign: 'center',
    color: '#333',
};

const dropZoneStyle = {
    border: '2px dashed #ccc',
    borderRadius: '12px',
    padding: '40px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
};

const browseStyle = {
    marginTop: '12px',
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#4ecca3',
    color: '#fff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
};

const previewStyle = {
    marginTop: '30px',
    textAlign: 'center',
};

const buttonGroupStyle = {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
};

const processButtonStyle = {
    padding: '10px 24px',
    backgroundColor: '#4ecca3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
};

const resetButtonStyle = {
    padding: '10px 24px',
    backgroundColor: '#eeeeee',
    color: '#333',
    border: '1px solid #aaa',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
};

const controlPanelStyle = {
    marginTop: '30px',
    textAlign: 'center',
};

const modeButtonGroup = {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '20px',
};

const styleButton = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #4ecca3',
    backgroundColor: 'white',
    color: '#4ecca3',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
};

const styleButtonSelected = {
    ...styleButton,
    backgroundColor: '#4ecca3',
    color: 'white',
};

export default UploadPanel;