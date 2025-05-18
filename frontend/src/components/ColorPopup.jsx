import React from 'react';

function ColorBox({ color }) {
    const [hover, setHover] = React.useState(false);
    return (
        <div
            style={colorBoxStyle(color)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div
                style={{
                    ...tooltipStyle,
                    ...(hover ? tooltipVisibleStyle : {}),
                }}
            >
                {color.name} ({color.hex})
            </div>
        </div>
    );
}

export default function ColorPopup({ newColors, existingColors, onClose }) {
    return (
        <div style={overlayStyle}>
            <div style={popupStyle}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Color Analysis Result</h2>

                {newColors.length > 0 && (
                    <div>
                        <div style={sectionTitleStyle}>New Colors</div>
                        <div style={colorGridStyle}>
                            {newColors.map((color, index) => (
                                <ColorBox key={`new-${index}`} color={color} />
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <div style={sectionTitleStyle}>Recognized Colors</div>
                    <div style={colorGridStyle}>
                        {existingColors.map((color, index) => (
                            <ColorBox key={`exist-${index}`} color={color} />
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const popupStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '16px',
    maxWidth: '800px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
};

const sectionTitleStyle = {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#222',
};

const colorGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
};

const colorBoxStyle = (color) => ({
    width: '100%',
    aspectRatio: '1',
    backgroundColor: color.hex,
    borderRadius: '12px',
    position: 'relative',
    cursor: 'pointer',
});

const tooltipStyle = {
    position: 'absolute',
    bottom: '110%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#333',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    zIndex: 100,
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity 0.2s',
};

const tooltipVisibleStyle = {
    opacity: 1,
};
