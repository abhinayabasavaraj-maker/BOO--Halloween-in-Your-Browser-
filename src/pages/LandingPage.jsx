import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/audio';
import { Sparkles, Key, Compass, Shield, Palette, Trophy, ArrowRight, Play, Clock, HelpCircle, Ghost } from 'lucide-react';

export const LandingPage = ({ setTab }) => {
  const { state, clickEasterGhost, addToast } = useGame();
  const [mascotMessage, setMascotMessage] = useState(
    'Click me for spooky Halloween secrets! 🎃'
  );
  const [mascotClickCount, setMascotClickCount] = useState(0);

  // Live countdown to real midnight
  const [midnightTimer, setMidnightTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setMidnightTimer({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const pumpkinQuotes = [
    '"Beware! The clock ticks closer to midnight... 🕰️"',
    '"Did you hear that creak behind the bookshelf? 👻"',
    '"A riddle a day keeps the ghoul away! 💀"',
    '"Look under the welcome mat, mortal! 📜"',
    '"Only true escape masters solve all three rooms! 🗝️"',
    '"Boo! Ha ha, did I spook ya? 🎃"'
  ];

  const handleMascotClick = () => {
    soundEngine.playPumpkinGiggle();
    const nextCount = mascotClickCount + 1;
    setMascotClickCount(nextCount);
    const randomQuote = pumpkinQuotes[nextCount % pumpkinQuotes.length];
    setMascotMessage(randomQuote);
  };

  const handleSurpriseMe = () => {
    soundEngine.playClick();
    const choices = ['escape', 'decorator', 'rewards'];
    const pick = choices[Math.floor(Math.random() * choices.length)];
    addToast('The spirits have chosen your destiny...', 'info', '✨');
    setTab(pick);
  };

  return (
    <div className="landing-page-root">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          {/* Text Column */}
          <div className="hero-text-col">
            <div className="spooky-badge midnight-badge">
              <Clock size={16} />
              <span>
                MIDNIGHT COUNTDOWN: {midnightTimer.hours}h {midnightTimer.minutes}m {midnightTimer.seconds}s
              </span>
            </div>

            <h1 className="hero-title">
              THE NIGHT IS YOURS <br />
              <span className="hero-title-highlight">TO ESCAPE.</span>
            </h1>

            <p className="hero-desc">
              The grand wrought-iron gates of Midnight Manor have sealed behind you.
              Explore treacherous chambers, decipher arcane riddles, collect lost relics,
              and unlock the Pumpkin Vault before the stroke of twelve!
            </p>

            <div className="hero-cta-group">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setTab('escape');
                }}
                className="btn-primary hero-btn-main glow-orange"
              >
                <Key size={20} />
                <span>ENTER THE HAUNTED HOUSE</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setTab('decorator');
                }}
                className="btn-secondary hero-btn-sub"
              >
                <Palette size={20} />
                <span>CREATE YOUR SPOOKY ROOM</span>
              </button>

              <button
                onClick={handleSurpriseMe}
                className="btn-ghost surprise-hero-btn"
                title="Randomly plunge into an experience"
              >
                <Sparkles size={16} />
                <span>Surprise Me</span>
              </button>
            </div>

            {/* Live Player Progress Bar */}
            <div className="hero-progress-chip">
              <span className="chip-icon">🎃</span>
              <span className="chip-text">
                Your Progress: <strong>{state.stats.pumpkinPoints} pts</strong> · {state.game.completedPuzzles.length}/4 Puzzles Solved
              </span>
            </div>
          </div>

          {/* Haunted House Illustration & Mascot Column */}
          <div className="hero-art-col">
            <div className="haunted-house-card">
              {/* Interactive SVG Haunted House Illustration */}
              <svg className="haunted-manor-svg" viewBox="0 0 500 420">
                <defs>
                  <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#361d57" />
                    <stop offset="100%" stopColor="#1a0d2d" />
                  </linearGradient>
                  <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#24133b" />
                    <stop offset="100%" stopColor="#120820" />
                  </linearGradient>
                  <filter id="windowGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Hill / Ground */}
                <path d="M 0 380 Q 250 330 500 380 L 500 420 L 0 420 Z" fill="#0d0718" />

                {/* Gnarled Dead Trees */}
                <path d="M 40 370 Q 30 290 60 250 Q 80 220 70 200 Q 60 220 50 250 Q 30 290 35 370 Z" fill="#1b102e" />
                <path d="M 60 250 Q 90 240 100 220" stroke="#1b102e" strokeWidth="6" strokeLinecap="round" />
                <path d="M 460 370 Q 470 280 440 230 Q 420 200 430 180 Q 440 200 450 240 Q 470 280 465 370 Z" fill="#1b102e" />

                {/* Main House Base */}
                <rect x="140" y="180" width="220" height="190" fill="url(#wallGrad)" stroke="#442468" strokeWidth="2" />

                {/* Left Tower */}
                <rect x="90" y="210" width="70" height="160" fill="url(#wallGrad)" stroke="#442468" strokeWidth="2" />
                <polygon points="80,210 125,120 170,210" fill="url(#roofGrad)" />
                {/* Spire tip */}
                <line x1="125" y1="120" x2="125" y2="90" stroke="#FFC16C" strokeWidth="2" />
                <polygon points="120,90 125,75 130,90" fill="#FFC16C" />

                {/* Right Tower */}
                <rect x="340" y="210" width="70" height="160" fill="url(#wallGrad)" stroke="#442468" strokeWidth="2" />
                <polygon points="330,210 375,130 420,210" fill="url(#roofGrad)" />
                <line x1="375" y1="130" x2="375" y2="105" stroke="#FFC16C" strokeWidth="2" />

                {/* Central High Steeple & Roof */}
                <polygon points="120,180 250,70 380,180" fill="url(#roofGrad)" stroke="#5d328c" strokeWidth="2" />
                {/* Weathervane with Bat */}
                <line x1="250" y1="70" x2="250" y2="35" stroke="#FF8A2A" strokeWidth="3" />
                <circle cx="250" cy="35" r="4" fill="#FF8A2A" />

                {/* Chimney with Smoke */}
                <rect x="170" y="100" width="30" height="50" fill="#25133d" />
                <circle cx="185" cy="85" r="8" fill="rgba(185, 154, 232, 0.25)" className="smoke-puff" />
                <circle cx="190" cy="65" r="12" fill="rgba(185, 154, 232, 0.2)" className="smoke-puff-2" />

                {/* Glowing Attic Window (Round) */}
                <circle cx="250" cy="130" r="22" fill="#FFC16C" filter="url(#windowGlow)" />
                <circle cx="250" cy="130" r="20" fill="#FFA500" />
                <line x1="250" y1="110" x2="250" y2="150" stroke="#24133b" strokeWidth="3" />
                <line x1="230" y1="130" x2="270" y2="130" stroke="#24133b" strokeWidth="3" />

                {/* Lower Windows (Glowing Amber) */}
                <rect x="170" y="215" width="32" height="50" rx="16" fill="#FF8A2A" filter="url(#windowGlow)" />
                <rect x="298" y="215" width="32" height="50" rx="16" fill="#FF8A2A" filter="url(#windowGlow)" />
                <rect x="108" y="250" width="34" height="48" rx="4" fill="#9CF2C1" filter="url(#windowGlow)" opacity="0.8" />
                <rect x="358" y="250" width="34" height="48" rx="4" fill="#FFC16C" filter="url(#windowGlow)" opacity="0.8" />

                {/* Iron Front Door */}
                <rect x="225" y="285" width="50" height="85" rx="25" fill="#0d0718" stroke="#FF8A2A" strokeWidth="2" />
                <circle cx="265" cy="335" r="3.5" fill="#FFC16C" />
                {/* Spooky steps */}
                <rect x="205" y="370" width="90" height="10" fill="#1b102e" rx="2" />
                <rect x="195" y="380" width="110" height="10" fill="#140a24" rx="2" />
              </svg>

              {/* Interactive Mascot Pod */}
              <div
                className="mascot-interactive-pod"
                onClick={handleMascotClick}
                role="button"
                tabIndex={0}
                title="Click me for hints and secrets!"
              >
                <div className="mascot-pumpkin-glow">🎃</div>
                <div className="mascot-speech-bubble">
                  <span className="speech-speaker">Spooky Jack:</span>
                  <p className="speech-text">{mascotMessage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="how-to-play-section">
        <div className="container">
          <div className="section-head text-center">
            <span className="spooky-badge">🕯️ SURVIVAL GUIDE</span>
            <h2 className="section-title">HOW TO ESCAPE THE MANOR</h2>
            <p className="section-subtitle">Three straightforward steps between you and freedom.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card spooky-card">
              <div className="step-num-badge">01</div>
              <div className="step-icon-box">
                <Compass size={28} className="step-icon" />
              </div>
              <h3 className="step-title">Explore & Inspect</h3>
              <p className="step-desc">
                Click glowing objects throughout the Forgotten Foyer, Witch's Library, and Vault. Search dusty grandfather clocks, examine rugs, and inspect ancient lecterns.
              </p>
            </div>

            <div className="step-card spooky-card">
              <div className="step-num-badge">02</div>
              <div className="step-icon-box">
                <Key size={28} className="step-icon" />
              </div>
              <h3 className="step-title">Solve Arcane Riddles</h3>
              <p className="step-desc">
                Decode cryptic poetic verses, harmonize mystical colored runes, rotate brass combination dials, and piece together the four sacred vault guardian symbols.
              </p>
            </div>

            <div className="step-card spooky-card">
              <div className="step-num-badge">03</div>
              <div className="step-icon-box">
                <Trophy size={28} className="step-icon" />
              </div>
              <h3 className="step-title">Escape & Decorate</h3>
              <p className="step-desc">
                Activate the dual pedestals, trigger the escape portal, claim your Pumpkin Points, unlock achievements, and retreat to your customizable Spooky Room sanctuary!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Preview Section */}
      <section className="challenges-preview-section">
        <div className="container">
          <div className="section-head text-center">
            <span className="spooky-badge">🏰 CHAMBERS OF MYSTERY</span>
            <h2 className="section-title">THE THREE HAUNTED ROOMS</h2>
            <p className="section-subtitle">Each chamber presents unique interactive puzzles and secrets.</p>
          </div>

          <div className="challenges-grid">
            {/* Room 1 Preview */}
            <div className="challenge-card spooky-card" onClick={() => setTab('escape')}>
              <div className="challenge-banner foyer-banner">
                <span className="challenge-emoji">🕰️</span>
                <span className="challenge-tag">ROOM 1</span>
              </div>
              <div className="challenge-body">
                <h3 className="challenge-name">The Forgotten Foyer</h3>
                <p className="challenge-desc">
                  An ominous reception hall where stopped clocks harbor secrets and floorboards creak underfoot. Solve the Clockwork Riddle to reveal the first Vault symbol.
                </p>
                <div className="challenge-meta">
                  <span>🗝️ Difficulty: Starter</span>
                  <span>🏆 150 Pts</span>
                </div>
              </div>
            </div>

            {/* Room 2 Preview */}
            <div className="challenge-card spooky-card" onClick={() => setTab('escape')}>
              <div className="challenge-banner library-banner">
                <span className="challenge-emoji">📚</span>
                <span className="challenge-tag">ROOM 2</span>
              </div>
              <div className="challenge-body">
                <h3 className="challenge-name">The Witch's Library</h3>
                <p className="challenge-desc">
                  Shelves stacked with grimoires and potion bottles. Attune four glowing musical runes and align the 3-digit guardian combination to slide the secret bookshelf passage.
                </p>
                <div className="challenge-meta">
                  <span>🔮 Difficulty: Moderate</span>
                  <span>🏆 300 Pts</span>
                </div>
              </div>
            </div>

            {/* Room 3 Preview */}
            <div className="challenge-card spooky-card" onClick={() => setTab('escape')}>
              <div className="challenge-banner vault-banner">
                <span className="challenge-emoji">👑</span>
                <span className="challenge-tag">ROOM 3</span>
              </div>
              <div className="challenge-body">
                <h3 className="challenge-name">The Pumpkin Vault</h3>
                <p className="challenge-desc">
                  The climactic sanctuary of the Great Pumpkin. Place the Amethyst Crystal and Pumpkin Seal onto the dual pedestals, rotate four celestial dials, and escape!
                </p>
                <div className="challenge-meta">
                  <span>✨ Difficulty: Climax</span>
                  <span>🏆 500 Pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Room Callout Banner */}
      <section className="room-cta-section">
        <div className="container">
          <div className="spooky-card decorator-callout-card">
            <div className="callout-text-col">
              <span className="spooky-badge">🎨 CREATIVE SANDBOX</span>
              <h2 className="callout-title">Need a Rest From Escaping? Decorate Your Spooky Room!</h2>
              <p className="callout-desc">
                Select between Pumpkin Night, Haunted Mansion, and Witching Hour themes. Arrange custom ghosts, bats, glowing candelabras, skulls, and haunted portraits!
              </p>
              <button onClick={() => setTab('decorator')} className="btn-primary callout-btn">
                <Palette size={18} />
                <span>Open Room Decorator</span>
              </button>
            </div>
            <div className="callout-art-col">
              <div className="preview-polaroid">
                <span className="polaroid-ghost">👻</span>
                <span className="polaroid-pumpkin">🎃</span>
                <span className="polaroid-bat">🦇</span>
                <span className="polaroid-caption">My Haunted Abode</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .landing-page-root {
          display: flex;
          flex-direction: column;
          gap: 90px;
          padding-bottom: 40px;
        }

        .hero-section {
          padding-top: 40px;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
        }

        @media (min-width: 960px) {
          .hero-container {
            grid-template-columns: 1.1fr 0.9fr;
          }
        }

        .hero-text-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .midnight-badge {
          width: fit-content;
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 800;
          line-height: 1.08;
          color: var(--color-ghost);
          letter-spacing: -0.02em;
        }

        .hero-title-highlight {
          font-family: var(--font-spooky);
          color: var(--color-pumpkin);
          text-shadow: 0 0 25px rgba(255, 138, 42, 0.6);
          letter-spacing: 0.04em;
        }

        .hero-desc {
          color: #d1c5e4;
          font-size: 1.15rem;
          line-height: 1.65;
          max-width: 540px;
        }

        .hero-cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
          margin-top: 8px;
        }

        .hero-btn-main {
          font-size: 1.05rem;
          padding: 14px 28px;
        }

        .hero-btn-sub {
          font-size: 1rem;
          padding: 14px 24px;
        }

        .surprise-hero-btn {
          color: var(--color-amber);
        }

        .hero-progress-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(33, 19, 51, 0.6);
          border: 1px solid rgba(185, 154, 232, 0.2);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          color: #b5a8c9;
          width: fit-content;
        }

        .hero-art-col {
          position: relative;
        }

        .haunted-house-card {
          position: relative;
          background: rgba(22, 13, 36, 0.7);
          border: 1px solid rgba(185, 154, 232, 0.2);
          border-radius: var(--radius-lg);
          padding: 16px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .haunted-manor-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .smoke-puff {
          animation: floatGhost 4s infinite ease-in-out;
        }
        .smoke-puff-2 {
          animation: floatGhost 5s infinite ease-in-out 1s;
        }

        .mascot-interactive-pod {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(16, 11, 32, 0.9);
          border: 1px solid rgba(255, 138, 42, 0.4);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          margin-top: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mascot-interactive-pod:hover {
          border-color: var(--color-amber);
          box-shadow: 0 0 20px rgba(255, 138, 42, 0.4);
          transform: translateY(-2px);
        }

        .mascot-pumpkin-glow {
          font-size: 2.2rem;
          line-height: 1;
          animation: pulseGlow 3s infinite ease-in-out;
        }

        .mascot-speech-bubble {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .speech-speaker {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-amber);
        }

        .speech-text {
          font-size: 0.92rem;
          color: var(--color-ghost);
          font-style: italic;
        }

        .section-head {
          margin-bottom: 40px;
        }

        .text-center {
          text-align: center;
        }

        .section-title {
          font-size: 2.2rem;
          color: var(--color-ghost);
          margin: 10px 0 6px;
        }

        .section-subtitle {
          color: #b5a8c9;
          font-size: 1.05rem;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .steps-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .step-card {
          position: relative;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s, border-color 0.2s;
        }

        .step-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-pumpkin);
        }

        .step-num-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 800;
          color: rgba(185, 154, 232, 0.15);
        }

        .step-icon-box {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          background: rgba(255, 138, 42, 0.15);
          border: 1px solid rgba(255, 138, 42, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-amber);
        }

        .step-title {
          font-size: 1.35rem;
          color: var(--color-ghost);
        }

        .step-desc {
          color: #c0b3d6;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .challenges-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .challenges-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .challenge-card {
          padding: 0;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s;
        }

        .challenge-card:hover {
          transform: translateY(-6px);
          border-color: var(--color-amber);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
        }

        .challenge-banner {
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .foyer-banner {
          background: linear-gradient(135deg, #2b160b 0%, #462210 100%);
        }

        .library-banner {
          background: linear-gradient(135deg, #18263e 0%, #291b4f 100%);
        }

        .vault-banner {
          background: linear-gradient(135deg, #3d1b08 0%, #68300c 100%);
        }

        .challenge-emoji {
          font-size: 2.2rem;
        }

        .challenge-tag {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--color-amber);
          background: rgba(0, 0, 0, 0.4);
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .challenge-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .challenge-name {
          font-size: 1.3rem;
          color: var(--color-ghost);
        }

        .challenge-desc {
          font-size: 0.92rem;
          color: #b5a8c9;
          line-height: 1.5;
        }

        .challenge-meta {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid rgba(185, 154, 232, 0.15);
          padding-top: 12px;
          font-size: 0.85rem;
          color: var(--color-amber);
          font-weight: 600;
        }

        .decorator-callout-card {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
          align-items: center;
          padding: 40px;
          border-color: rgba(185, 154, 232, 0.3);
        }

        @media (min-width: 800px) {
          .decorator-callout-card {
            grid-template-columns: 1.3fr 0.7fr;
          }
        }

        .callout-text-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .callout-title {
          font-size: 1.8rem;
          color: var(--color-ghost);
        }

        .callout-desc {
          color: #d1c5e4;
          font-size: 1rem;
          line-height: 1.6;
        }

        .callout-btn {
          width: fit-content;
          margin-top: 6px;
        }

        .callout-art-col {
          display: flex;
          justify-content: center;
        }

        .preview-polaroid {
          background: #fffdfa;
          color: #211333;
          padding: 16px 16px 24px;
          border-radius: 6px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
          transform: rotate(3deg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .polaroid-ghost { font-size: 3rem; animation: floatGhost 3s infinite ease-in-out; }
        .polaroid-pumpkin { font-size: 2.5rem; }
        .polaroid-bat { position: absolute; top: 10px; right: 10px; font-size: 1.5rem; }

        .polaroid-caption {
          font-family: var(--font-spooky);
          font-size: 1.2rem;
          color: #8c420b;
        }
      `}</style>
    </div>
  );
};
