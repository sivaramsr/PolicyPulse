import React from 'react';
import ReactDOM from 'react-dom';

// Comic-style Fluffy Cloud Puff SVG Component
const ComicCloudPuff = ({ style }) => (
  <svg
    width="45"
    height="40"
    viewBox="0 0 50 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path
      d="M 12 24 C 6 22 4 14 10 9 C 14 4 22 2 28 6 C 34 2 42 5 44 11 C 48 16 46 24 42 27 C 46 32 42 40 35 40 C 28 42 22 40 18 36 C 12 40 5 36 6 29 C 4 26 8 24 12 24 Z"
      fill="rgba(243, 229, 171, 0.25)"
      stroke="#f3e5ab"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function LoadingScreen({ text = "Loading PolicyPulse..." }) {
  const content = (
    <div style={styles.fullscreenViewport}>
      
      {/* Centered Master Card with margin auto */}
      <div style={styles.masterCenterCard}>
        
        {/* Whistle + Cloud Puffs Group (Strict 160x160 Dimension relative box) */}
        <div style={styles.whistleGroup}>
          
          {/* Whistle SVG Graphic */}
          <div className="whistle-grow-box" style={styles.whistleGraphicBox}>
            <svg
              width="160"
              height="160"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block', margin: '0 auto' }}
            >
              <defs>
                {/* Red - Yellow - Red Horizontal Bands Gradient */}
                <linearGradient id="ryrGradient" x1="0" y1="0" x2="0" y2="100%">
                  <stop offset="0%" stopColor="#b80016" />
                  <stop offset="30%" stopColor="#b80016" />
                  <stop offset="30.1%" stopColor="#ffc700" />
                  <stop offset="70%" stopColor="#ffc700" />
                  <stop offset="70.1%" stopColor="#b80016" />
                  <stop offset="100%" stopColor="#b80016" />
                </linearGradient>

                {/* Clip path for whistle interior body */}
                <clipPath id="whistleBodyClip">
                  {/* Chamber Circle */}
                  <circle cx="95" cy="115" r="48" />
                  {/* Blow Tube */}
                  <path d="M 95 67 L 165 37 L 175 60 L 125 97 Z" />
                </clipPath>
              </defs>

              {/* LAYER 1: BASE COLORED WHISTLE (Red-Yellow-Red horizontal bands) */}
              <g>
                <rect x="20" y="20" width="160" height="160" fill="url(#ryrGradient)" clipPath="url(#whistleBodyClip)" />
              </g>

              {/* LAYER 2: WHITE TOP LAYER (Clip-path shrinks to reveal Layer 1 bottom-to-top) */}
              <g className="whistle-white-top-layer">
                <rect x="20" y="20" width="160" height="160" fill="#ffffff" clipPath="url(#whistleBodyClip)" />
              </g>

              {/* BOLD BLACK LINE-ART CONTOURS */}
              <g>
                <circle cx="95" cy="115" r="48" stroke="#000000" strokeWidth="8" fill="none" />
                <circle cx="95" cy="115" r="38" stroke="#000000" strokeWidth="4" fill="none" />
                <path d="M 90 67 L 165 37 L 175 60 L 125 97" stroke="#000000" strokeWidth="8" strokeLinejoin="round" fill="none" />
                <path d="M 108 60 L 140 47" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
                <circle cx="50" cy="148" r="8" stroke="#000000" strokeWidth="5" fill="#ffffff" />
              </g>
            </svg>
          </div>

          {/* Comic-Book Fluffy Cloud Burst Puffs emitting directly from Whistle Nozzle (x: 135px, y: 25px) */}
          <div style={styles.cloudEmitterOrigin}>
            <ComicCloudPuff style={{ ...styles.cloudPuffStyle, animationDelay: '0s' }} />
            <ComicCloudPuff style={{ ...styles.cloudPuffStyle, animationDelay: '0.45s' }} />
            <ComicCloudPuff style={{ ...styles.cloudPuffStyle, animationDelay: '0.9s' }} />
          </div>

        </div>

        {/* Centered Loading Text Caption */}
        <div style={styles.loadingCaption}>{text}</div>

      </div>

      {/* Embedded CSS Keyframe Animations */}
      <style>{`
        @keyframes cloudBurstPuff {
          0% {
            transform: translate(0, 0) scale(0.25);
            opacity: 0.95;
          }
          40% {
            opacity: 0.85;
          }
          100% {
            transform: translate(45px, -45px) scale(1.15);
            opacity: 0;
          }
        }

        @keyframes whistleGrowth {
          0% {
            transform: scale(0.65);
          }
          50% {
            transform: scale(1.0);
          }
          100% {
            transform: scale(0.65);
          }
        }

        @keyframes colorFillReveal {
          0% {
            clip-path: inset(0 0 0% 0);
          }
          50% {
            clip-path: inset(0 0 100% 0);
          }
          100% {
            clip-path: inset(0 0 0% 0);
          }
        }

        .whistle-grow-box {
          animation: whistleGrowth 2.0s ease-in-out infinite;
          transform-origin: center center;
        }

        .whistle-white-top-layer {
          animation: colorFillReveal 2.0s ease-in-out infinite;
        }
      `}</style>

    </div>
  );

  // Mount directly to document.body via React Portal to bypass all parent bounds
  if (typeof document !== 'undefined') {
    return ReactDOM.createPortal(content, document.body);
  }
  return content;
}

const styles = {
  fullscreenViewport: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 999999,
    backgroundColor: '#7a0016',
    backgroundImage: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 1px, transparent 1px)',
    backgroundSize: '24px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justify: 'center',
    boxShadow: 'inset 0 0 120px rgba(0,0,0,0.7)',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
  },
  masterCenterCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justify: 'center',
    textAlign: 'center',
    margin: 'auto',
  },
  whistleGroup: {
    position: 'relative',
    width: '160px',
    height: '160px',
    display: 'flex',
    alignItems: 'center',
    justify: 'center',
    marginBottom: '2rem',
  },
  whistleGraphicBox: {
    width: '160px',
    height: '160px',
    display: 'flex',
    alignItems: 'center',
    justify: 'center',
  },
  cloudEmitterOrigin: {
    position: 'absolute',
    top: '25px',
    right: '15px',
    width: '1px',
    height: '1px',
    pointerEvents: 'none',
  },
  cloudPuffStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    animation: 'cloudBurstPuff 1.8s cubic-bezier(0.2, 0.8, 0.4, 1) infinite',
    pointerEvents: 'none',
  },
  loadingCaption: {
    fontFamily: "'Merriweather', serif",
    color: '#f3e5ab',
    fontSize: '1.15rem',
    fontWeight: '700',
    letterSpacing: '0.04em',
    textShadow: '1px 2px 4px rgba(0,0,0,0.5)',
  },
};
