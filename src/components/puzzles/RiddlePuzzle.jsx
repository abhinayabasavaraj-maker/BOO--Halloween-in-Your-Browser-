import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { PUZZLES_DATA } from '../../data/gameData';
import { X, HelpCircle, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

export const RiddlePuzzle = ({ onClose }) => {
  const { solvePuzzle, recordMistake, recordHintUsed, state } = useGame();
  const puzzle = PUZZLES_DATA.riddle_clock;

  const [inputVal, setInputVal] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isSolved, setIsSolved] = useState(
    state.game.completedPuzzles.includes(puzzle.id)
  );

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && !isSolved) {
      inputRef.current.focus();
    }
  }, [isSolved]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSolved) return;

    const normalized = inputVal.trim().toLowerCase();
    const isCorrect = puzzle.validAnswers.includes(normalized);

    if (isCorrect) {
      setIsSolved(true);
      setFeedback({ type: 'success', message: 'Correct! The ancient clock springs to life!' });
      solvePuzzle(puzzle.id, puzzle.points, puzzle.rewardClue);
    } else {
      recordMistake();
      setErrorShake(true);
      setFeedback({ type: 'error', message: 'The clock gears groan in refusal. Try another answer.' });
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
        aria-labelledby="puzzle-title"
      >
        <button onClick={onClose} className="puzzle-close-btn" aria-label="Close puzzle">
          <X size={20} />
        </button>

        <div className="puzzle-header">
          <span className="puzzle-badge">🕰️ Room 1 Challenge</span>
          <h2 id="puzzle-title" className="puzzle-title">{puzzle.title}</h2>
          <p className="puzzle-inst">{puzzle.instructions}</p>
        </div>

        <div className="riddle-parchment-box">
          <p className="riddle-text">{puzzle.riddleText}</p>
        </div>

        {isSolved ? (
          <div className="solved-banner">
            <CheckCircle size={32} className="success-icon" />
            <div>
              <h4 className="solved-title">Riddle Solved!</h4>
              <p className="solved-desc">
                A secret compartment clicked open behind the pendulum, revealing an ancient cipher inscription!
              </p>
              <div className="clue-reveal-box">
                <span className="clue-reveal-tag">📜 Clue Inscribed:</span>
                <p className="clue-reveal-text">{puzzle.rewardClue.text}</p>
              </div>
            </div>
            <button onClick={onClose} className="btn-primary continue-btn">
              Back to Foyer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="puzzle-form">
            <div className="input-group">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder={puzzle.placeholder}
                className="puzzle-input"
                aria-label="Answer the riddle"
              />
              <button type="submit" className="btn-primary submit-btn">
                Unlock
              </button>
            </div>

            {feedback && (
              <div className={`feedback-msg feedback-${feedback.type}`}>
                {feedback.type === 'error' && <AlertTriangle size={16} />}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Progressive Hint Section */}
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
          </form>
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
          border-color: rgba(255, 138, 42, 0.4);
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

        .riddle-parchment-box {
          background: rgba(25, 14, 40, 0.8);
          border: 1px solid rgba(255, 193, 108, 0.3);
          border-radius: var(--radius-md);
          padding: 20px;
          margin-bottom: 24px;
          text-align: center;
          box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5);
        }

        .riddle-text {
          font-family: Georgia, serif;
          font-style: italic;
          font-size: 1.15rem;
          color: var(--color-amber);
          line-height: 1.6;
          white-space: pre-line;
        }

        .puzzle-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-group {
          display: flex;
          gap: 10px;
        }

        .puzzle-input {
          flex: 1;
          background: rgba(16, 11, 32, 0.8);
          border: 1px solid rgba(185, 154, 232, 0.3);
          border-radius: var(--radius-full);
          padding: 12px 20px;
          font-size: 1rem;
          color: var(--color-ghost);
        }

        .puzzle-input:focus {
          border-color: var(--color-amber);
          box-shadow: 0 0 15px rgba(255, 193, 108, 0.3);
        }

        .submit-btn {
          padding: 12px 24px;
        }

        .feedback-msg {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .feedback-error {
          background: rgba(255, 77, 109, 0.15);
          border: 1px solid rgba(255, 77, 109, 0.4);
          color: #ffccd5;
        }

        .hint-section {
          margin-top: 10px;
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
          padding: 6px 0;
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
          margin-bottom: 4px;
        }

        .solved-desc {
          font-size: 0.95rem;
          color: #d1c5e4;
          margin-bottom: 12px;
        }

        .clue-reveal-box {
          background: rgba(16, 11, 32, 0.8);
          border: 1px solid var(--color-amber);
          border-radius: var(--radius-md);
          padding: 12px;
          text-align: left;
        }

        .clue-reveal-tag {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--color-amber);
          display: block;
          margin-bottom: 4px;
        }

        .clue-reveal-text {
          font-size: 0.95rem;
          color: #fff;
          font-weight: 600;
        }

        .continue-btn {
          margin-top: 10px;
          width: 100%;
        }
      `}</style>
    </div>
  );
};
