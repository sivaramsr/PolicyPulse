import React from 'react';

// Ornate Corner Scrollwork SVG Flourish
const GoldCornerFlourish = ({ style }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 100 100"
    fill="none"
    style={{ position: 'absolute', pointerEvents: 'none', zIndex: 10, ...style }}
  >
    <path
      d="M10 90 C 10 40, 40 10, 90 10 C 60 10, 30 30, 30 60 C 30 75, 45 75, 45 60 C 45 45, 25 45, 25 60 M20 90 L 20 80 C 20 50, 50 20, 80 20 L 90 20 M5 90 Q 5 5, 90 5"
      stroke="#D4AF37"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="20" cy="20" r="5" fill="#D4AF37" />
    <circle cx="40" cy="15" r="3" fill="#D4AF37" />
    <circle cx="15" cy="40" r="3" fill="#D4AF37" />
  </svg>
);

export default function OrnateFrame({ children, style = {}, innerStyle = {} }) {
  return (
    <div style={{ ...styles.outerBorderContainer, ...style }}>
      {/* Corner Flourishes */}
      <GoldCornerFlourish style={{ top: '6px', left: '6px' }} />
      <GoldCornerFlourish style={{ top: '6px', right: '6px', transform: 'scaleX(-1)' }} />
      <GoldCornerFlourish style={{ bottom: '6px', left: '6px', transform: 'scaleY(-1)' }} />
      <GoldCornerFlourish style={{ bottom: '6px', right: '6px', transform: 'scale(-1, -1)' }} />

      {/* Inner Cream Content Box */}
      <div style={{ ...styles.innerIvoryBox, ...innerStyle }}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  outerBorderContainer: {
    position: 'relative',
    padding: '12px',
    backgroundColor: '#fffdf2',
    borderRadius: '16px',
    border: '3px double #d4af37',
    boxShadow: '0 15px 35px rgba(0,0,0,0.4), inset 0 0 20px rgba(212, 175, 55, 0.15)',
  },
  innerIvoryBox: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: '#fffdf2',
    borderRadius: '10px',
    border: '1px solid rgba(212, 175, 55, 0.4)',
    padding: '1.75rem',
  },
};
