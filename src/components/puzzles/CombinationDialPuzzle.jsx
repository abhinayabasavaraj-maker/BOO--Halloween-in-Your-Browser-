import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { PUZZLES_DATA } from '../../data/gameData';
import { soundEngine } from '../../utils/audio';
import { X, ChevronUp, ChevronDown, CheckCircle, Lightbulb, AlertTriangle, Lock } from 'lucide-react';

export const CombinationDialPuzzle = ({ onClose }) => {
  const { solvePuzzle, recordMistake, recordHintUsed, state } = useGame();
  const puzzle = PUZZLES_DATA.bookcase_combination;

  const [digits, setDigits] = useState([0, 0, 0]);
  const [errorShake, setErrorShake] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isSolved, setIsSolved] = useState(
    state.game.completedPuzzles.includes(puzzle.id)
  );

  const rotateDigit = (index, delta) => {
    if (isSolved) return;
    soundEngine.playClick();
    setDigits(prev => {
      const next = [...prev];
      next[index] = (next[index] + delta + 10) % 10;
      return next;
    });
  };

  const handleTestUnlock = () => {
    if (isSolved) return;

    const isMatch = digits.every((val, idx) => val === puzzle.correctDigits[idx]);

    if (isMatch) {
      setIsSolved(true);
      setFeedback({ type: 'success', message: 'The tumblers align with a satisfying click! The secret passage opens!' });
      solvePuzzle(puzzle.id, puzzle.points, puzzle.rewardClue, puzzle.rewardItem);
    } else {
      recordMistake();
      setErrorShake(true);
      setFeedback({ type: 'error', message: 'The lock stays frozen. The guardians reject this count.' });
      setTimeout(() => setErrorShake(false), 500);
    }
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
        aria-labelledby="dial-puzzle-title"
      >
        <button onClick={onClose} className="puzzle-close-btn" aria-label="Close puzzle">
          <X size={20} />
        </button>

        <div className="puzzle-header">
          <span className="puzzle-badge">🔢 Room 2 Bookcase Lock</span>
          <h2 id="dial-puzzle-title" className="puzzle-title">{puzzle.title}</h2>
          <p className="puzzle-inst">{puzzle.instructions}</p>
        </div>

        {/* 3 Brass Combination Tumblers */}
        <div className="dials-pod">
          {digits.map((digit, idx) => (
            <div key={idx} className="dial-column">
              <button
                onClick={() => rotateDigit(idx, 1)}
                disabled={isSolved}
                className="dial-arrow-btn"
                aria-label={`Increase dial ${idx + 1}`}
              >
                <ChevronUp size={24} />
              </button>

              <div className="dial-cylinder">
                <span className="dial-number">{isSolved ? puzzle.correctDigits[idx] : digit}</span>
              </div>

              <button
                onClick={() => rotateDigit(idx, -1)}
                disabled={isSolved}
                className="dial-arrow-btn"
                aria-label={`Decrease dial ${idx + 1}`}
              >
                <ChevronDown size={24} />
              </button>

              <span className="dial-sub-label">Dial {idx + 1}</span>
            </div>
          ))}
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
              <h4 className="solved-title">Passage Unlocked!</h4>
              <p className="solved-desc">
                The bookcase slid aside to reveal the pathway to <strong>The Pumpkin Vault</strong>! You discovered <strong>Torn Parchment (Right)</strong>!
              </p>
            </div>
            <button onClick={onClose} className="btn-primary continue-btn">
              Return to Chamber
            </button>
          </div>
        ) : (
          <div className="puzzle-actions">
            <button onClick={handleTestUnlock} className="btn-primary unlock-btn">
              <Lock size={18} /> Test Tumblers
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
          max-width: 500px;
          width: 100%;
          border-color: rgba(255, 193, 108, 0.4);
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
          margin-bottom: 24px;
        }

        .puzzle-badge {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-amber);
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

        .dials-pod {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          background: rgba(16, 11, 32, 0.8);
          border: 2px solid rgba(255, 193, 108, 0.3);
          border-radius: var(--radius-lg);
          padding: 24px 20px;
          margin-bottom: 24px;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.6);
        }

        .dial-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .dial-arrow-btn {
          width: 44px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: rgba(33, 19, 51, 0.8);
          border: 1px solid rgba(185, 154, 232, 0.25);
          color: var(--color-ghost);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dial-arrow-btn:hover:not(:disabled) {
          background: var(--color-amber);
          color: var(--color-midnight);
          border-color: var(--color-amber);
          transform: scale(1.08);
        }

        .dial-cylinder {
          width: 64px;
          height: 74px;
          background: linear-gradient(180deg, #1b122c 0%, #3e265c 50%, #1b122c 100%);
          border: 2px solid rgba(255, 193, 108, 0.6);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.8);
        }

        .dial-number {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--color-amber);
          text-shadow: 0 0 10px rgba(255, 193, 108, 0.6);
        }

        .dial-sub-label {
          font-size: 0.75rem;
          color: #9f91b7;
          font-weight: 600;
        }

        .feedback-msg {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 16px;
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

        .puzzle-actions {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .unlock-btn {
          width: 100%;
          font-size: 1.05rem;
          padding: 14px;
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
