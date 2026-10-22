import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Music,
  Zap,
  RefreshCw,
  Sliders,
  Shield,
  HelpCircle,
  Keyboard,
  Info,
  Check
} from 'lucide-react';

export const SettingsPage = () => {
  const {
    state,
    toggleSound,
    toggleAmbience,
    setVolume,
    toggleReducedMotion,
    setTimerMode,
    resetEntireGame,
    addToast
  } = useGame();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleTestSound = () => {
    soundEngine.playDiscovery();
    addToast('Web Audio chime test played!', 'info', '🔔');
  };

  return (
    <div className="settings-page-root">
      <div className="container">
        {/* Header */}
        <div className="settings-header">
          <div className="spooky-badge">
            <Sliders size={16} />
            <span>PREFERENCES & ACCESS</span>
          </div>
          <h1 className="settings-title">SETTINGS & AUDIO CONTROLS</h1>
          <p className="settings-desc">
            Customize your auditory ambiance, accessibility preferences, and escape challenge mode.
          </p>
        </div>

        <div className="settings-grid">
          {/* Audio Settings Card */}
          <div className="settings-card spooky-card">
            <h2 className="card-section-title">
              <Volume2 size={20} className="title-icon" /> Audio & Soundscapes
            </h2>
            <p className="card-section-desc">
              BOO! features an original, real-time procedural Web Audio synthesizer with zero external asset lag.
            </p>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Sound Effects</span>
                <span className="setting-subtext">Interactive chimes, clicks, unlocks, and reactions</span>
              </div>
              <button
                onClick={toggleSound}
                className={`toggle-switch ${state.settings.soundEnabled ? 'on' : 'off'}`}
                aria-label="Toggle sound effects"
              >
                <span className="switch-handle" />
              </button>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Atmospheric Drone</span>
                <span className="setting-subtext">Continuous spooky midnight wind & organ harmonic ambience</span>
              </div>
              <button
                onClick={toggleAmbience}
                className={`toggle-switch ${state.settings.ambienceEnabled ? 'on' : 'off'}`}
                aria-label="Toggle background ambience"
              >
                <span className="switch-handle" />
              </button>
            </div>

            <div className="setting-row slider-row">
              <div className="setting-info">
                <span className="setting-label">Master Volume: {Math.round(state.settings.volume * 100)}%</span>
              </div>
              <div className="slider-action-box">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={state.settings.volume}
                  onChange={e => setVolume(parseFloat(e.target.value))}
                  className="volume-slider"
                  aria-label="Volume slider"
                />
                <button onClick={handleTestSound} className="btn-secondary test-btn">
                  Test Chime
                </button>
              </div>
            </div>
          </div>

          {/* Accessibility & Game Preferences */}
          <div className="settings-card spooky-card">
            <h2 className="card-section-title">
              <Zap size={20} className="title-icon" /> Accessibility & Mode
            </h2>
            <p className="card-section-desc">
              Ensure comfort, low-fatigue visuals, and your preferred pace of gameplay.
            </p>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Reduced Motion Mode</span>
                <span className="setting-subtext">Disables floating ghosts, bats, camera shakes, and fog drift</span>
              </div>
              <button
                onClick={toggleReducedMotion}
                className={`toggle-switch ${state.settings.reducedMotion ? 'on' : 'off'}`}
                aria-label="Toggle reduced motion"
              >
                <span className="switch-handle" />
              </button>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Default Escape Pace</span>
                <span className="setting-subtext">Choose between a thrilling 10m countdown or relaxed exploration</span>
              </div>
              <div className="mode-toggle-group">
                <button
                  onClick={() => setTimerMode('relaxed')}
                  className={`mode-btn ${state.game.timerMode === 'relaxed' ? 'active' : ''}`}
                >
                  Relaxed
                </button>
                <button
                  onClick={() => setTimerMode('countdown')}
                  className={`mode-btn ${state.game.timerMode === 'countdown' ? 'active' : ''}`}
                >
                  Countdown
                </button>
              </div>
            </div>
          </div>

          {/* Keyboard Controls Guide Card */}
          <div className="settings-card spooky-card">
            <h2 className="card-section-title">
              <Keyboard size={20} className="title-icon" /> Keyboard Shortcuts
            </h2>
            <div className="keyboard-shortcuts-grid">
              <div className="shortcut-item">
                <kbd className="key-cap">Tab</kbd>
                <span className="key-desc">Navigate through interactive objects & hotspots</span>
              </div>
              <div className="shortcut-item">
                <kbd className="key-cap">Enter</kbd>
                <span className="key-desc">Activate focused item or submit puzzle answer</span>
              </div>
              <div className="shortcut-item">
                <kbd className="key-cap">Esc</kbd>
                <span className="key-desc">Close puzzle modal or relic inspection card</span>
              </div>
              <div className="shortcut-item">
                <kbd className="key-cap">↑ / ↓</kbd>
                <span className="key-desc">Rotate number dials & glyph tumblers</span>
              </div>
            </div>
          </div>

          {/* Data Persistence & Reset Card */}
          <div className="settings-card spooky-card danger-card">
            <h2 className="card-section-title">
              <RefreshCw size={20} className="title-icon" /> Storage & Reset
            </h2>
            <p className="card-section-desc">
              All progress, clues, inventory relics, and custom room layouts are automatically persisted in your browser's versioned localStorage.
            </p>

            <div className="storage-summary-box">
              <span className="storage-meta">Schema: BOO_HALLOWEEN_V1 · Clues: {state.game.discoveredClues.length} · Relics: {state.game.inventory.length}</span>
            </div>

            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="btn-secondary reset-danger-btn"
              >
                <RefreshCw size={16} /> Reset All Progress & Data
              </button>
            ) : (
              <div className="reset-confirm-box">
                <p className="reset-confirm-prompt">
                  Are you sure? This will delete all your pumpkin points, clues, and unlocked rooms.
                </p>
                <div className="reset-confirm-actions">
                  <button
                    onClick={() => {
                      resetEntireGame();
                      setShowResetConfirm(false);
                    }}
                    className="btn-primary confirm-erase-btn"
                  >
                    Confirm Erase
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .settings-page-root {
          padding-bottom: 90px;
        }

        .settings-header {
          margin-bottom: 28px;
        }

        .settings-title {
          font-size: 2.4rem;
          color: var(--color-ghost);
          margin: 6px 0 8px;
        }

        .settings-desc {
          color: #d1c5e4;
          font-size: 1.05rem;
          max-width: 680px;
          line-height: 1.5;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .settings-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .card-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.3rem;
          color: var(--color-amber);
        }

        .title-icon {
          color: var(--color-pumpkin);
        }

        .card-section-desc {
          font-size: 0.9rem;
          color: #b5a8c9;
          line-height: 1.5;
        }

        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-top: 1px solid rgba(185, 154, 232, 0.12);
          gap: 16px;
        }

        .slider-row {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        .setting-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .setting-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-ghost);
        }

        .setting-subtext {
          font-size: 0.8rem;
          color: #9f91b7;
        }

        .toggle-switch {
          width: 52px;
          height: 28px;
          border-radius: var(--radius-full);
          background: rgba(16, 11, 32, 0.8);
          border: 1px solid rgba(185, 154, 232, 0.3);
          position: relative;
          cursor: pointer;
          transition: background-color 0.2s;
          flex-shrink: 0;
        }

        .toggle-switch.on {
          background: var(--color-pumpkin);
          border-color: var(--color-pumpkin);
        }

        .switch-handle {
          position: absolute;
          top: 3px;
          left: 4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toggle-switch.on .switch-handle {
          transform: translateX(23px);
        }

        .slider-action-box {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
        }

        .volume-slider {
          flex: 1;
          accent-color: var(--color-pumpkin);
          cursor: pointer;
        }

        .test-btn {
          font-size: 0.8rem;
          padding: 8px 14px;
        }

        .mode-toggle-group {
          display: flex;
          background: rgba(16, 11, 32, 0.7);
          border-radius: var(--radius-full);
          padding: 4px;
          border: 1px solid rgba(185, 154, 232, 0.2);
        }

        .mode-btn {
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          color: #b5a8c9;
          transition: all 0.2s;
        }

        .mode-btn.active {
          background: var(--color-lavender);
          color: var(--color-midnight);
        }

        .keyboard-shortcuts-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .shortcut-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .key-cap {
          background: rgba(16, 11, 32, 0.9);
          border: 1px solid rgba(255, 193, 108, 0.4);
          border-radius: 6px;
          padding: 4px 10px;
          font-family: monospace;
          font-size: 0.85rem;
          color: var(--color-amber);
          min-width: 50px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        }

        .key-desc {
          font-size: 0.88rem;
          color: #d1c5e4;
        }

        .storage-summary-box {
          background: rgba(16, 11, 32, 0.6);
          border: 1px solid rgba(185, 154, 232, 0.15);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          font-size: 0.8rem;
          color: #a496bd;
        }

        .reset-danger-btn {
          color: #ff859d;
          border-color: rgba(255, 77, 109, 0.3);
          align-self: flex-start;
        }

        .reset-danger-btn:hover {
          background: rgba(255, 77, 109, 0.15);
          border-color: var(--color-blood-red);
          color: #fff;
        }

        .reset-confirm-box {
          background: rgba(255, 77, 109, 0.12);
          border: 1px solid rgba(255, 77, 109, 0.4);
          border-radius: var(--radius-md);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .reset-confirm-prompt {
          font-size: 0.9rem;
          color: #ffccd5;
        }

        .reset-confirm-actions {
          display: flex;
          gap: 10px;
        }

        .confirm-erase-btn {
          background: var(--color-blood-red);
          color: #fff;
          font-size: 0.85rem;
          padding: 8px 16px;
        }
      `}</style>
    </div>
  );
};
