import React, { useRef } from 'react';

function UploadButton({onImageSelect}) {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        if(onImageSelect) {
            onImageSelect(e);
        }
    };

    return (
        <div>
            <button onClick={handleButtonClick} style={buttonStyle}>Upload Image</button>
            <input type = "file"
                   accept = "image/*"
                   ref = {fileInputRef}
                   style = {{ display: 'none'}}
                   onChange={handleFileChange}
            />
        </div>
    );
}

const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
}

export default UploadButton;