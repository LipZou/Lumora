import React, { useState, useRef } from 'react';

function UploadPanel() {
    const [image, setImage] = useState(null);
    const [dragging, setDragging]  = useState(false);
    const [pixelImage, setPixelImage] = useState(null);

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
        if(!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.src = image;

        img.onload = () => {
            const blockSize = 16;
            const { width, height } = img;

            canvas.width = width;
            canvas.height = height;


            ctx.drawImage(img, 0, 0, width, height);

            const imageData = ctx.getImageData(0, 0, width, height);
            const data  = imageData.data;

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
            setPixelImage(pixelURL);
        };
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
                    <p>Preview:</p>
                    <img src={image} alt="Original" style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '20px' }} />

                    {pixelImage && (
                        <>
                            <p>Pixelated:</p>
                            <img src={pixelImage} alt="Pixelated" style={{ maxWidth: '100%', borderRadius: '12px' }} />
                        </>
                    )}

                    <div style={buttonGroupStyle}>
                        <button style={processButtonStyle} onClick={handleProcess}>Process</button>
                        <button style={resetButtonStyle} onClick={() => { setImage(null); setPixelImage(null);}}>Choose Another</button>
                    </div>
                </div>
            )}

            <canvas ref = {canvasRef} style={{ display: 'none' }} />
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

export default UploadPanel;