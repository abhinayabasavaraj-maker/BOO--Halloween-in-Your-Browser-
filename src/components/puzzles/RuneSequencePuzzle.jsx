import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { PUZZLES_DATA } from '../../data/gameData';
import { soundEngine } from '../../utils/audio';
import { X, Flame, Sprout, Moon, Eye, CheckCircle, RotateCcw, Lightbulb, AlertTriangle } from 'lucide-react';

export const RuneSequencePuzzle = ({ onClose }) => {
  const { solvePuzzle, recordMistake, recordHintUsed, state } = useGame();
  const puzzle = PUZZLES_DATA.rune_sequence;

  const [sequence, setSequence] = useState([]);
  const [errorShake, setErrorShake] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [activeRuneId, setActiveRuneId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSolved, setIsSolved] = useState(
    state.game.completedPuzzles.includes(puzzle.id)
  );

  const getRuneIcon = (iconName, size = 32) => {
    switch (iconName) {
      case 'Flame': return <Flame size={size} />;
      case 'Sprout': return <Sprout size={size} />;
      case 'Moon': return <Moon size={size} />;
      case 'Eye': return <Eye size={size} />;
      default: return <Flame size={size} />;
    }
  };

  const handleRuneClick = (rune) => {
    if (isSolved) return;

    soundEngine.playRuneChime(rune.soundIdx);
    setActiveRuneId(rune.id);
    setTimeout(() => setActiveRuneId(null), 300);

    const nextSeq = [...sequence, rune.id];
    setSequence(nextSeq);

    // Validate step
    const stepIdx = nextSeq.length - 1;
    if (rune.id !== puzzle.correctSequence[stepIdx]) {
      // Mistake!
      recordMistake();
      setErrorShake(true);
      setFeedback({ type: 'error', message: 'Discordant resonance! The runes reset.' });
      setTimeout(() => {
        setSequence([]);
        setErrorShake(false);
      }, 600);
      return;
    }

    // Check completion
    if (nextSeq.length === puzzle.correctSequence.length) {
      setIsSolved(true);
      setFeedback({ type: 'success', message: 'The runes harmonized! The Amethyst Crystal emerged!' });
      solvePuzzle(puzzle.id, puzzle.points, null, puzzle.rewardItem);
    } else {
      setFeedback(null);
    }
  };

  const handleReset = () => {
    setSequence([]);
    soundEngine.playClick();
  };

  const handleRequestHint = () => {
    if (hintLevel < 2) {
      setHintLevel(prev => prev + 1);
      recordHintUsed();
    }
  };

  return (
    <div className="puzzle-backdrop" onClick={onClose}>
      <div
        className={`puzzle-modal spooky-card ${errorShake ? 'animate-shake' : ''}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-labelledby="rune-puzzle-title"
      >
        <button onClick={onClose} className="puzzle-close-btn" aria-label="Close puzzle">
          <X size={20} />
        </button>

        <div className="puzzle-header">
          <span className="puzzle-badge">🔮 Witch's Altar Challenge</span>
          <h2 id="rune-puzzle-title" className="puzzle-title">{puzzle.title}</h2>
          <p className="puzzle-inst">{puzzle.instructions}</p>
        </div>

        {/* Sequence Progress Sockets */}
        <div className="sequence-progress-bar">
          <span className="sequence-label">Ritual Attunement:</span>
          <div className="sockets-row">
            {puzzle.correctSequence.map((_, i) => (
              <div
                key={i}
                className={`socket-dot ${sequence.length > i ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Interactive Runes Grid */}
        <div className="runes-grid">
          {puzzle.runes.map(rune => {
            const isPressed = activeRuneId === rune.id;
            return (
              <button
                key={rune.id}
                onClick={() => handleRuneClick(rune)}
                disabled={isSolved}
                className={`rune-card ${isPressed ? 'rune-pressed' : ''}`}
                style={{
                  '--rune-color': rune.color,
                  borderColor: isPressed ? rune.color : 'rgba(185, 154, 232, 0.25)'
                }}
                aria-label={`Rune ${rune.name}`}
              >
                <div className="rune-glyph-box" style={{ color: rune.color }}>
                  {getRuneIcon(rune.icon)}
                </div>
                <span className="rune-name">{rune.name}</span>
              </button>
            );
          })}
        </div>

        {feedback && (
          <div className={`feedback-msg feedback-${feedback.type}`}>
            {feedback.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {isSolved ? (
          <div className="solved-banner">
            <CheckCircle size={32} className="success-icon" />
            <div>
              <h4 className="solved-title">Harmonized!</h4>
              <p className="solved-desc">
                The runes flared with cosmic light, bestowing the <strong>Witch's Amethyst Crystal</strong> into your inventory!
              </p>
            </div>
            <button onClick={onClose} className="btn-primary continue-btn">
              Back to Library
            </button>
          </div>
        ) : (
          <div className="puzzle-controls-bottom">
            <button onClick={handleReset} className="btn-ghost reset-btn">
              <RotateCcw size={16} /> Reset Sequence
            </button>

            {/* Progressive hints */}
            <div className="hint-section">
              {hintLevel === 0 && (
                <button
                  type="button"
                  onClick={handleRequestHint}
                  className="hint-btn"
                >
                  <Lightbulb size={16} /> Need a subtle whisper? (Hint 1)
                </button>
              )}

              {hintLevel >= 1 && (
                <div className="hint-card">
                  <span className="hint-label">💡 Whisper 1:</span>
                  <p className="hint-text">{puzzle.hint1}</p>
                </div>
              )}

              {hintLevel === 1 && (
                <button
                  type="button"
                  onClick={handleRequestHint}
                  className="hint-btn second-hint-btn"
                >
                  <Lightbulb size={16} /> Still puzzled? (Hint 2)
                </button>
              )}

              {hintLevel >= 2 && (
                <div className="hint-card hint-card-direct">
                  <span className="hint-label">🕯️ Whisper 2:</span>
                  <p className="hint-text">{puzzle.hint2}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .puzzle-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(8, 5, 18, 0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: itemDrop 0.25s ease-out;
        }

        .puzzle-modal {
          position: relative;
          max-width: 520px;
          width: 100%;
          border-color: rgba(185, 154, 232, 0.4);
          padding: 32px 28px;
        }

        .puzzle-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          color: var(--color-lavender);
          padding: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
        }

        .puzzle-close-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.15);
        }

        .puzzle-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .puzzle-badge {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-lavender);
          margin-bottom: 6px;
        }

        .puzzle-title {
          font-size: 1.6rem;
          color: var(--color-ghost);
          margin-bottom: 6px;
        }

        .puzzle-inst {
          font-size: 0.9rem;
          color: #b5a8c9;
        }

        .sequence-progress-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(16, 11, 32, 0.7);
          border: 1px solid rgba(185, 154, 232, 0.2);
          border-radius: var(--radius-full);
          padding: 8px 16px;
          margin-bottom: 20px;
        }

        .sequence-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-amber);
        }

        .sockets-row {
          display: flex;
          gap: 8px;
        }

        .socket-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: rgba(185, 154, 232, 0.2);
          border: 1px solid rgba(185, 154, 232, 0.4);
          transition: all 0.2s;
        }

        .socket-dot.active {
          background: var(--color-lavender);
          box-shadow: 0 0 10px var(--color-lavender);
        }

        .runes-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }

        @media (min-width: 480px) {
          .runes-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .rune-card {
          background: rgba(22, 13, 36, 0.85);
          border: 1px solid rgba(185, 154, 232, 0.25);
          border-radius: var(--radius-md);
          padding: 18px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          transition: all 0.15s;
        }

        .rune-card:hover:not(:disabled) {
          transform: translateY(-4px);
          box-shadow: 0 0 16px var(--rune-color);
        }

        .rune-pressed {
          transform: scale(0.95);
          background: rgba(45, 25, 75, 0.95);
          box-shadow: 0 0 24px var(--rune-color);
        }

        .rune-glyph-box {
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 6px currentColor);
        }

        .rune-name {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          color: #eee;
        }

        .feedback-msg {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 14px;
        }

        .feedback-error {
          background: rgba(255, 77, 109, 0.15);
          border: 1px solid rgba(255, 77, 109, 0.4);
          color: #ffccd5;
        }

        .feedback-success {
          background: rgba(156, 242, 193, 0.15);
          border: 1px solid rgba(156, 242, 193, 0.4);
          color: var(--color-mint);
        }

        .puzzle-controls-bottom {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .reset-btn {
          align-self: flex-start;
          font-size: 0.85rem;
        }

        .hint-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .hint-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--color-lavender);
          padding: 4px 0;
          align-self: flex-start;
        }

        .hint-btn:hover {
          color: var(--color-amber);
        }

        .hint-card {
          background: rgba(185, 154, 232, 0.08);
          border-left: 3px solid var(--color-lavender);
          padding: 10px 14px;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }

        .hint-card-direct {
          border-left-color: var(--color-amber);
          background: rgba(255, 193, 108, 0.08);
        }

        .hint-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-amber);
          display: block;
          margin-bottom: 2px;
        }

        .hint-text {
          font-size: 0.88rem;
          color: #e2d9f3;
        }

        .solved-banner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 14px;
          padding: 10px 0;
        }

        .success-icon {
          color: var(--color-mint);
          filter: drop-shadow(0 0 10px rgba(156, 242, 193, 0.6));
        }

        .solved-title {
          font-size: 1.4rem;
          color: var(--color-mint);
        }

        .solved-desc {
          font-size: 0.95rem;
          color: #d1c5e4;
        }

        .continue-btn {
          width: 100%;
        }
      `}</style>
    </div>
  );
};
