import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { PUZZLES_DATA } from '../../data/gameData';
import { soundEngine } from '../../utils/audio';
import { X, ChevronUp, ChevronDown, CheckCircle, Lightbulb, AlertTriangle, ShieldAlert, Sparkles, KeyRound } from 'lucide-react';

export const MasterVaultPuzzle = ({ onClose }) => {
  const { state, solvePuzzle, recordMistake, recordHintUsed, escapeGame, placeVaultItem } = useGame();
  const puzzle = PUZZLES_DATA.master_vault;

  const [selectedGlyphs, setSelectedGlyphs] = useState(['pumpkin', 'pumpkin', 'pumpkin', 'pumpkin']);
  const [errorShake, setErrorShake] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const hasCrystal = state.game.inventory.some(i => i.id === 'amethyst_crystal');
  const hasSeal = state.game.inventory.some(i => i.id === 'pumpkin_seal');
  const crystalPlaced = state.game.vaultCrystalPlaced;
  const sealPlaced = state.game.vaultSealPlaced;

  const glyphList = puzzle.glyphs;

  const cycleGlyph = (index, delta) => {
    soundEngine.playClick();
    setSelectedGlyphs(prev => {
      const currentIdx = glyphList.findIndex(g => g.id === prev[index]);
      const nextIdx = (currentIdx + delta + glyphList.length) % glyphList.length;
      const next = [...prev];
      next[index] = glyphList[nextIdx].id;
      return next;
    });
  };

  const handleTestCombination = () => {
    // Check if pedestals are placed first
    if (!crystalPlaced) {
      recordMistake();
      setErrorShake(true);
      setFeedback({
        type: 'error',
        message: hasCrystal
          ? 'The Left Pedestal is dark! Place the Amethyst Crystal onto it.'
          : 'The Left Pedestal requires the Witch\'s Amethyst Crystal from Room 2!'
      });
      setTimeout(() => setErrorShake(false), 500);
      return;
    }

    if (!sealPlaced) {
      recordMistake();
      setErrorShake(true);
      setFeedback({
        type: 'error',
        message: hasSeal
          ? 'The Right Pedestal is dark! Place the Golden Pumpkin Seal onto it.'
          : 'The Right Pedestal requires the Golden Pumpkin Seal! Search the Vault sconce.'
      });
      setTimeout(() => setErrorShake(false), 500);
      return;
    }

    const isMatch = selectedGlyphs.every((g, idx) => g === puzzle.correctCombination[idx]);

    if (isMatch) {
      solvePuzzle(puzzle.id, puzzle.points);
      setFeedback({
        type: 'success',
        message: 'The celestial glyphs align! Golden light bursts from the portal!'
      });
      setTimeout(() => {
        escapeGame();
        onClose();
      }, 1200);
    } else {
      recordMistake();
      setErrorShake(true);
      setFeedback({
        type: 'error',
        message: 'The glyph array remains dormant. Consult your collected clues for the 4 guardians.'
      });
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
        aria-labelledby="vault-puzzle-title"
      >
        <button onClick={onClose} className="puzzle-close-btn" aria-label="Close puzzle">
          <X size={20} />
        </button>

        <div className="puzzle-header">
          <span className="puzzle-badge">👑 Room 3 Climax</span>
          <h2 id="vault-puzzle-title" className="puzzle-title">{puzzle.title}</h2>
          <p className="puzzle-inst">{puzzle.instructions}</p>
        </div>

        {/* Dual Pedestal Status Indicators */}
        <div className="pedestals-status-grid">
          <div className={`pedestal-card ${crystalPlaced ? 'lit-purple' : ''}`}>
            <span className="pedestal-name">Left Pedestal (Amethyst)</span>
            <div className="pedestal-status-row">
              <span className="pedestal-gem-icon">💎</span>
              <span className="pedestal-state-text">
                {crystalPlaced ? 'Pulsing with Moon Energy' : 'Empty Socket'}
              </span>
            </div>
            {!crystalPlaced && hasCrystal && (
              <button
                onClick={() => placeVaultItem('crystal')}
                className="btn-primary pedestal-place-btn"
              >
                Place Crystal
              </button>
            )}
          </div>

          <div className={`pedestal-card ${sealPlaced ? 'lit-orange' : ''}`}>
            <span className="pedestal-name">Right Pedestal (Talisman)</span>
            <div className="pedestal-status-row">
              <span className="pedestal-gem-icon">🎃</span>
              <span className="pedestal-state-text">
                {sealPlaced ? 'Radiating Golden Warmth' : 'Empty Socket'}
              </span>
            </div>
            {!sealPlaced && hasSeal && (
              <button
                onClick={() => placeVaultItem('seal')}
                className="btn-primary pedestal-place-btn"
              >
                Place Seal
              </button>
            )}
          </div>
        </div>

        {/* 4 Celestial Glyph Dials */}
        <div className="glyph-dials-row">
          {selectedGlyphs.map((glyphId, idx) => {
            const currentGlyph = glyphList.find(g => g.id === glyphId) || glyphList[0];
            return (
              <div key={idx} className="glyph-dial-col">
                <button
                  onClick={() => cycleGlyph(idx, 1)}
                  className="dial-arrow-btn"
                  aria-label={`Cycle glyph dial ${idx + 1} up`}
                >
                  <ChevronUp size={22} />
                </button>

                <div className="glyph-display-box">
                  <span className="glyph-emoji">{currentGlyph.emoji}</span>
                  <span className="glyph-text">{currentGlyph.label}</span>
                </div>

                <button
                  onClick={() => cycleGlyph(idx, -1)}
                  className="dial-arrow-btn"
                  aria-label={`Cycle glyph dial ${idx + 1} down`}
                >
                  <ChevronDown size={22} />
                </button>

                <span className="dial-index-label">Dial {idx + 1}</span>
              </div>
            );
          })}
        </div>

        {feedback && (
          <div className={`feedback-msg feedback-${feedback.type}`}>
            {feedback.type === 'error' ? <AlertTriangle size={18} /> : <Sparkles size={18} />}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="puzzle-actions">
          <button
            onClick={handleTestCombination}
            className="btn-primary unlock-vault-btn glow-orange"
          >
            <KeyRound size={20} />
            <span>Turn Master Vault Key</span>
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
      </div>

      <style>{`
        .puzzle-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(8, 5, 18, 0.9);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: itemDrop 0.25s ease-out;
        }

        .puzzle-modal {
          position: relative;
          max-width: 580px;
          width: 100%;
          border-color: rgba(255, 138, 42, 0.5);
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
          font-size: 1.7rem;
          color: var(--color-ghost);
          margin-bottom: 6px;
        }

        .puzzle-inst {
          font-size: 0.9rem;
          color: #b5a8c9;
        }

        .pedestals-status-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 22px;
        }

        @media (min-width: 500px) {
          .pedestals-status-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .pedestal-card {
          background: rgba(16, 11, 32, 0.7);
          border: 1px dashed rgba(185, 154, 232, 0.25);
          border-radius: var(--radius-md);
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .pedestal-card.lit-purple {
          border-color: var(--color-lavender);
          background: rgba(43, 24, 69, 0.8);
          box-shadow: 0 0 15px rgba(185, 154, 232, 0.35);
        }

        .pedestal-card.lit-orange {
          border-color: var(--color-pumpkin);
          background: rgba(50, 25, 12, 0.8);
          box-shadow: 0 0 15px rgba(255, 138, 42, 0.35);
        }

        .pedestal-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-amber);
        }

        .pedestal-status-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pedestal-gem-icon {
          font-size: 1.2rem;
        }

        .pedestal-state-text {
          font-size: 0.85rem;
          color: #d1c5e4;
        }

        .pedestal-place-btn {
          font-size: 0.8rem;
          padding: 6px 12px;
          align-self: flex-start;
          margin-top: 4px;
        }

        .glyph-dials-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          background: rgba(16, 11, 32, 0.8);
          border: 1px solid rgba(255, 138, 42, 0.3);
          border-radius: var(--radius-lg);
          padding: 20px 14px;
          margin-bottom: 20px;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.6);
        }

        .glyph-dial-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .dial-arrow-btn {
          width: 38px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: rgba(33, 19, 51, 0.8);
          border: 1px solid rgba(185, 154, 232, 0.25);
          color: var(--color-ghost);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dial-arrow-btn:hover {
          background: var(--color-amber);
          color: var(--color-midnight);
          transform: scale(1.08);
        }

        .glyph-display-box {
          width: 100%;
          aspect-ratio: 1;
          max-width: 80px;
          background: linear-gradient(180deg, #1b122c 0%, #3e265c 50%, #1b122c 100%);
          border: 2px solid rgba(255, 138, 42, 0.6);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.8);
          padding: 4px;
        }

        .glyph-emoji {
          font-size: 1.8rem;
          line-height: 1;
          filter: drop-shadow(0 0 6px rgba(255, 138, 42, 0.6));
        }

        .glyph-text {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-amber);
          margin-top: 4px;
        }

        .dial-index-label {
          font-size: 0.7rem;
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

        .unlock-vault-btn {
          width: 100%;
          font-size: 1.1rem;
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
      `}</style>
    </div>
  );
};
