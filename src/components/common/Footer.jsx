import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Ghost, Sparkles, RefreshCw, Heart, HelpCircle } from 'lucide-react';

export const Footer = ({ setTab }) => {
  const { clickEasterGhost, resetEntireGame } = useGame();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSurpriseMe = () => {
    const screens = ['escape', 'decorator', 'rewards'];
    const randomChoice = screens[Math.floor(Math.random() * screens.length)];
    setTab(randomChoice);
  };

  return (
    <footer className="footer-wrapper">
      <div className="container footer-content">
        <div className="footer-top">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <span className="footer-pumpkin">🎃</span>
              <span className="footer-title">BOO!</span>
            </div>
            <p className="footer-desc">
              The spellbinding Halloween adventure in your browser. Solve riddles, unlock the haunted mansion, and design your spooky sanctuary before midnight strikes.
            </p>
            <div className="footer-tags">
              <span className="spooky-badge">🕸️ 100% Client-Side</span>
              <span className="spooky-badge">🎵 Web Audio Synth</span>
              <span className="spooky-badge">♿ Reduced Motion</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Experiences</h4>
            <button onClick={() => setTab('explore')} className="footer-link">🏰 The Haunted House</button>
            <button onClick={() => setTab('escape')} className="footer-link">🗝️ Escape Adventure</button>
            <button onClick={() => setTab('decorator')} className="footer-link">🎨 Spooky Room Decorator</button>
            <button onClick={() => setTab('rewards')} className="footer-link">🏆 Achievements & Lore</button>
            <button onClick={() => setTab('settings')} className="footer-link">⚙️ Sound & Settings</button>
          </div>

          <div className="footer-actions-col">
            <h4 className="footer-heading">Quick Play</h4>
            <p className="footer-subtext">Cannot decide where to begin? Let the spirits choose:</p>
            <button onClick={handleSurpriseMe} className="btn-primary surprise-btn">
              <Sparkles size={18} />
              <span>Surprise Me!</span>
            </button>

            <div className="reset-section">
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="reset-btn-link"
                >
                  <RefreshCw size={14} /> Reset All Game Data
                </button>
              ) : (
                <div className="confirm-box">
                  <p className="confirm-text">Erase all clues and progress?</p>
                  <div className="confirm-actions">
                    <button
                      onClick={() => {
                        resetEntireGame();
                        setShowResetConfirm(false);
                      }}
                      className="confirm-yes-btn"
                    >
                      Yes, Reset
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="confirm-cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            Crafted with eerie love for the Halloween Hackathon 🦇
          </div>
          <div className="footer-easter">
            {/* Third hidden ghost for achievement! */}
            <button
              onClick={() => clickEasterGhost('footer_ghost')}
              className="footer-ghost-btn"
              title="A timid ghost peeks from behind the gravestone..."
              aria-label="Click secret graveyard ghost"
            >
              <Ghost size={16} />
            </button>
            <span className="easter-hint">Hallow's Eve Forever</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background: #090614;
          border-top: 1px solid rgba(185, 154, 232, 0.15);
          padding: 60px 0 30px;
          margin-top: 80px;
          position: relative;
          z-index: 10;
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }

        @media (min-width: 768px) {
          .footer-top {
            grid-template-columns: 2fr 1fr 1.5fr;
          }
        }

        .footer-brand-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-pumpkin {
          font-size: 2rem;
        }

        .footer-title {
          font-family: var(--font-spooky);
          font-size: 2rem;
          color: var(--color-pumpkin);
          letter-spacing: 0.05em;
        }

        .footer-desc {
          color: #b5a8c9;
          line-height: 1.6;
          font-size: 0.95rem;
          max-width: 380px;
        }

        .footer-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .footer-links-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-heading {
          color: var(--color-amber);
          font-family: var(--font-display);
          font-size: 1.1rem;
          margin-bottom: 4px;
        }

        .footer-link {
          text-align: left;
          color: #c9bede;
          font-size: 0.95rem;
          padding: 4px 0;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: var(--color-pumpkin);
          transform: translateX(4px);
        }

        .footer-actions-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-subtext {
          font-size: 0.9rem;
          color: #9c8fb3;
        }

        .surprise-btn {
          width: fit-content;
        }

        .reset-section {
          margin-top: 10px;
        }

        .reset-btn-link {
          color: #8c7f9e;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }

        .reset-btn-link:hover {
          color: var(--color-blood-red);
        }

        .confirm-box {
          background: rgba(255, 77, 109, 0.1);
          border: 1px solid rgba(255, 77, 109, 0.3);
          border-radius: var(--radius-sm);
          padding: 10px;
          max-width: 260px;
        }

        .confirm-text {
          font-size: 0.85rem;
          color: #ffccd5;
          margin-bottom: 8px;
        }

        .confirm-actions {
          display: flex;
          gap: 8px;
        }

        .confirm-yes-btn {
          background: var(--color-blood-red);
          color: white;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .confirm-cancel-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #ccc;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(185, 154, 232, 0.1);
          padding-top: 24px;
          color: #7b6f91;
          font-size: 0.9rem;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-easter {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-ghost-btn {
          color: #63587a;
          transition: all 0.2s;
        }

        .footer-ghost-btn:hover {
          color: var(--color-mint);
          transform: translateY(-3px) scale(1.2);
        }

        .easter-hint {
          font-size: 0.8rem;
          font-style: italic;
        }
      `}</style>
    </footer>
  );
};
