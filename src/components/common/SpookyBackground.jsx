import React, { useMemo } from 'react';

export const SpookyBackground = () => {
  // Generate stable random star positions
  const stars = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: (i * 23.7 + 11) % 98,
      y: (i * 17.3 + 5) % 65,
      size: (i % 3) + 1.2,
      duration: 2.5 + (i % 4) * 0.8,
      delay: (i % 5) * 0.5
    }));
  }, []);

  return (
    <div className="spooky-bg-canvas" aria-hidden="true">
      {/* Moonlit Glow */}
      <div className="moon-container">
        <div className="moon-halo" />
        <svg className="moon-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="#FFC16C" filter="drop-shadow(0 0 15px rgba(255, 193, 108, 0.8))" />
          {/* Craters / shadows */}
          <circle cx="38" cy="35" r="8" fill="#e6a449" opacity="0.35" />
          <circle cx="60" cy="45" r="12" fill="#e6a449" opacity="0.3" />
          <circle cx="48" cy="65" r="9" fill="#e6a449" opacity="0.25" />
        </svg>
      </div>

      {/* Stars */}
      <div className="stars-layer">
        {stars.map(star => (
          <div
            key={star.id}
            className="twinkle-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* Drifting Bats */}
      <div className="bat-sky">
        <svg className="floating-bat bat-1" viewBox="0 0 100 50">
          <path
            d="M 10 35 Q 25 10 50 25 Q 75 10 90 35 Q 70 30 50 45 Q 30 30 10 35 Z"
            fill="#120b22"
          />
        </svg>
        <svg className="floating-bat bat-2" viewBox="0 0 100 50">
          <path
            d="M 10 35 Q 25 10 50 25 Q 75 10 90 35 Q 70 30 50 45 Q 30 30 10 35 Z"
            fill="#180f2d"
          />
        </svg>
        <svg className="floating-bat bat-3" viewBox="0 0 100 50">
          <path
            d="M 10 35 Q 25 10 50 25 Q 75 10 90 35 Q 70 30 50 45 Q 30 30 10 35 Z"
            fill="#1e1338"
          />
        </svg>
      </div>

      {/* Atmospheric Fog Layers */}
      <div className="fog-layer fog-back" />
      <div className="fog-layer fog-mid" />

      <style>{`
        .spooky-bg-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .moon-container {
          position: absolute;
          top: 40px;
          right: 8%;
          width: 110px;
          height: 110px;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .moon-container {
            top: 20px;
            right: 4%;
            width: 75px;
            height: 75px;
          }
        }

        .moon-halo {
          position: absolute;
          inset: -25px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 193, 108, 0.35) 0%, rgba(255, 138, 42, 0.15) 50%, transparent 75%);
          filter: blur(12px);
          animation: mysticalPulse 6s infinite ease-in-out;
        }

        .moon-svg {
          width: 100%;
          height: 100%;
        }

        .stars-layer {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .twinkle-star {
          position: absolute;
          background: #FFF5E9;
          border-radius: 50%;
          box-shadow: 0 0 6px #FFF5E9;
          animation: starTwinkle infinite ease-in-out;
        }

        .bat-sky {
          position: absolute;
          inset: 0;
          z-index: 2;
        }

        .floating-bat {
          position: absolute;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));
        }

        .bat-1 {
          width: 48px;
          top: 15%;
          left: 20%;
          animation: batFly 14s infinite linear;
        }

        .bat-2 {
          width: 34px;
          top: 28%;
          left: 60%;
          animation: batFly 18s infinite linear 4s;
        }

        .bat-3 {
          width: 26px;
          top: 8%;
          left: 40%;
          animation: batFly 22s infinite linear 9s;
        }

        .fog-layer {
          position: absolute;
          bottom: 0;
          left: -20%;
          width: 140%;
          height: 250px;
          background-repeat: repeat-x;
          opacity: 0.28;
          pointer-events: none;
        }

        .fog-back {
          background: radial-gradient(ellipse at 50% 100%, rgba(185, 154, 232, 0.25) 0%, rgba(33, 19, 51, 0) 70%);
          animation: fogDriftSlow 20s infinite ease-in-out alternate;
          z-index: 2;
        }

        .fog-mid {
          background: radial-gradient(ellipse at 30% 100%, rgba(255, 138, 42, 0.15) 0%, rgba(16, 11, 32, 0) 65%);
          animation: fogDriftSlow 28s infinite ease-in-out alternate-reverse;
          z-index: 3;
        }
      `}</style>
    </div>
  );
};
