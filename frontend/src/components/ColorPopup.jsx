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

function sortByHSL(a, b) {
    const [ha, sa, la] = rgbToHsl(a.rgb);
    const [hb, sb, lb] = rgbToHsl(b.rgb);

    const hueA = isNaN(ha) ? 999 : ha;
    const hueB = isNaN(hb) ? 999 : hb;

    // 按 hue 升序排序（色相环）
    if (hueA !== hueB) return hueA - hueB;

    // hue 相同，按 饱和度（s）降序，饱和度越高越靠前
    if (sa !== sb) return sb - sa;

    // 饱和度相同，按 明度（l）升序，越亮越靠前
    return la - lb;
}

function rgbToHsl([r, g, b]) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }

    return [h, s, l];
}

function safeHue(rgb) {
    const [h] = rgbToHsl(rgb);
    return isNaN(h) ? 999 : h; // 灰色、白色等没有 hue 的放最后
}

export default function ColorPopup({ newColors, existingColors, onClose }) {

    const sortedNewColors = [...newColors].sort(sortByHSL);
    const sortedExistingColors = [...existingColors].sort(sortByHSL);

    return (
        <div style={overlayStyle}>
            <div style={popupStyle}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Color Analysis Result</h2>

                {newColors.length > 0 && (
                    <div>
                        <div style={sectionTitleStyle}>New Colors</div>
                        <div style={colorGridStyle}>
                            {sortedNewColors.map((color, index) => (
                                <ColorBox key={`new-${index}`} color={color} />
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <div style={sectionTitleStyle}>Recognized Colors</div>
                    <div style={colorGridStyle}>
                        {sortedExistingColors.map((color, index) => (
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
