import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';
import { Trophy, Share2, RotateCcw, Home, Sparkles, Check, Clock, Compass } from 'lucide-react';
import { ACHIEVEMENTS_LIST } from '../data/gameData';

export const VictoryModal = ({ setTab }) => {
  const { state, isVictoryModalOpen, setIsVictoryModalOpen, addToast, resetEntireGame } = useGame();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isVictoryModalOpen) {
      // Fire Halloween confetti burst
      try {
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          colors: ['#FF8A2A', '#FFC16C', '#9CF2C1', '#B99AE8', '#FFF5E9']
        };

        const fire = (particleRatio, opts) => {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          });
        };

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      } catch (e) {
        console.warn("Confetti effect failed", e);
      }
    }
  }, [isVictoryModalOpen]);

  if (!isVictoryModalOpen) return null;

  const escapeSeconds = state.game.escapeTime || (600 - state.game.timeRemaining);
  const minutes = Math.floor(escapeSeconds / 60);
  const seconds = escapeSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;

  const handleShare = async () => {
    const shareText = `🎃 I escaped BOO! — The Haunted House Browser Game with ${state.stats.pumpkinPoints} Pumpkin Points in ${timeFormatted}! Can you solve the mysteries and escape before midnight?`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BOO! — Halloween in Your Browser',
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      addToast('Escape victory copied to clipboard!', 'success', '📋');
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      addToast('Failed to copy to clipboard', 'info', '⚠️');
    }
  };

  const handleReplay = () => {
    resetEntireGame();
    setIsVictoryModalOpen(false);
    setTab('escape');
  };

  const handleDecorateRoom = () => {
    setIsVictoryModalOpen(false);
    setTab('decorator');
  };

  const handleHome = () => {
    setIsVictoryModalOpen(false);
    setTab('explore');
  };

  return (
    <div className="victory-backdrop">
      <div className="victory-modal spooky-card">
        <div className="victory-halo" />

        <div className="victory-badge">
          <Trophy size={20} />
          <span>HAUNTED HOUSE MASTER</span>
        </div>

        <h1 className="spooky-title victory-title">THE NIGHT IS YOURS!</h1>
        <p className="victory-subtitle">
          You conquered the Forgotten Foyer, mastered the Witch's Grimoire, aligned the celestial glyphs, and unlocked the Pumpkin Vault!
        </p>

        {/* Escape Stats Summary */}
        <div className="victory-stats-grid">
          <div className="stat-pod">
            <span className="stat-label">Total Points</span>
            <span className="stat-val stat-points">🎃 {state.stats.pumpkinPoints}</span>
          </div>

          <div className="stat-pod">
            <span className="stat-label">Escape Time</span>
            <span className="stat-val stat-time">
              <Clock size={16} /> {timeFormatted}
            </span>
          </div>

          <div className="stat-pod">
            <span className="stat-label">Hints Used</span>
            <span className="stat-val">
              {state.game.hintsUsed === 0 ? '✨ 0 (Flawless)' : `${state.game.hintsUsed} Hints`}
            </span>
          </div>

          <div className="stat-pod">
            <span className="stat-label">Achievements</span>
            <span className="stat-val">{state.achievements.length} Unlocked</span>
          </div>
        </div>

        {/* Unlocked Badges Reel */}
        <div className="unlocked-badges-tray">
          <span className="tray-label">Earned Trophies:</span>
          <div className="badges-scroll">
            {state.achievements.map(achId => {
              const ach = ACHIEVEMENTS_LIST.find(a => a.id === achId);
              if (!ach) return null;
              return (
                <div key={achId} className="ach-badge-pill" title={ach.description}>
                  <span>🏆</span>
                  <span>{ach.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="victory-actions-grid">
          <button onClick={handleShare} className="btn-primary share-btn">
            {copied ? <Check size={18} /> : <Share2 size={18} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Share Your Escape'}</span>
          </button>

          <button onClick={handleDecorateRoom} className="btn-secondary decorate-btn">
            <Sparkles size={18} />
            <span>Design Your Spooky Room</span>
          </button>

          <button onClick={handleReplay} className="btn-ghost replay-btn">
            <RotateCcw size={16} /> Play Again
          </button>

          <button onClick={handleHome} className="btn-ghost home-btn">
            <Home size={16} /> Return to Manor
          </button>
        </div>
      </div>

      <style>{`
        .victory-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(8, 5, 18, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          animation: itemDrop 0.3s ease-out;
        }

        .victory-modal {
          position: relative;
          max-width: 620px;
          width: 100%;
          border: 2px solid var(--color-amber);
          padding: 40px 32px;
          text-align: center;
          box-shadow: 0 0 50px rgba(255, 138, 42, 0.35);
        }

        .victory-halo {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          width: 250px;
          height: 80px;
          background: radial-gradient(ellipse, rgba(255, 193, 108, 0.4) 0%, transparent 70%);
          filter: blur(20px);
          pointer-events: none;
        }

        .victory-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 193, 108, 0.15);
          color: var(--color-amber);
          border: 1px solid rgba(255, 193, 108, 0.4);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .victory-title {
          font-size: 2.4rem;
          color: var(--color-pumpkin);
          margin-bottom: 10px;
        }

        .victory-subtitle {
          color: #d8cde9;
          font-size: 1rem;
          line-height: 1.6;
          max-width: 500px;
          margin: 0 auto 24px;
        }

        .victory-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        @media (min-width: 520px) {
          .victory-stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .stat-pod {
          background: rgba(16, 11, 32, 0.7);
          border: 1px solid rgba(185, 154, 232, 0.2);
          border-radius: var(--radius-md);
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #9f91b7;
          font-weight: 600;
        }

        .stat-val {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--color-ghost);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .stat-points {
          color: var(--color-amber);
        }

        .stat-time {
          color: var(--color-mint);
        }

        .unlocked-badges-tray {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 28px;
          background: rgba(16, 11, 32, 0.5);
          border: 1px solid rgba(185, 154, 232, 0.15);
          border-radius: var(--radius-md);
          padding: 12px;
        }

        .tray-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-lavender);
        }

        .badges-scroll {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          max-height: 80px;
          overflow-y: auto;
          width: 100%;
        }

        .ach-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 138, 42, 0.15);
          border: 1px solid rgba(255, 138, 42, 0.3);
          border-radius: var(--radius-full);
          padding: 4px 10px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-amber);
        }

        .victory-actions-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (min-width: 500px) {
          .victory-actions-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }

        .share-btn {
          grid-column: 1 / -1;
          font-size: 1.1rem;
          padding: 14px;
        }

        .decorate-btn {
          grid-column: 1 / -1;
          font-size: 1.05rem;
          padding: 12px;
        }

        .replay-btn, .home-btn {
          justify-content: center;
        }
      `}</style>
    </div>
  );
};
