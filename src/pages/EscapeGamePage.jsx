import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ROOMS_DATA } from '../data/gameData';
import { soundEngine } from '../utils/audio';
import { InventoryTray } from '../components/inventory/InventoryTray';
import { ItemModal } from '../components/inventory/ItemModal';
import { RiddlePuzzle } from '../components/puzzles/RiddlePuzzle';
import { RuneSequencePuzzle } from '../components/puzzles/RuneSequencePuzzle';
import { CombinationDialPuzzle } from '../components/puzzles/CombinationDialPuzzle';
import { MasterVaultPuzzle } from '../components/puzzles/MasterVaultPuzzle';
import {
  Clock,
  Key,
  DoorOpen,
  DoorClosed,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  ShieldAlert,
  Flame,
  CheckCircle,
  HelpCircle,
  Eye
} from 'lucide-react';

export const EscapeGamePage = ({ setTab }) => {
  const {
    state,
    setCurrentRoom,
    discoverClue,
    addInventoryItem,
    unlockFoyerDoor,
    placeVaultItem,
    recordMistake,
    setTimerMode,
    addToast
  } = useGame();

  const [activePuzzleId, setActivePuzzleId] = useState(null);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  const currentRoomKey = state.game.currentRoom;
  const currentRoom = ROOMS_DATA[currentRoomKey] || ROOMS_DATA.foyer;

  const isFoyerUnlocked = state.game.foyerDoorUnlocked;
  const isLibraryUnlocked = state.game.librarySecretUnlocked;
  const isEscaped = state.game.isEscaped;

  // Format countdown
  const timeSec = state.game.timeRemaining;
  const mins = Math.floor(timeSec / 60);
  const secs = timeSec % 60;
  const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  // Handle Object Inspection in Room
  const handleInspect = (inspectable) => {
    soundEngine.playClick();

    // If it's a puzzle
    if (inspectable.puzzleId) {
      setActivePuzzleId(inspectable.puzzleId);
      return;
    }

    // If it requires an item to unlock
    if (inspectable.requiresItem) {
      if (inspectable.requiresItem === 'rusty_key') {
        const hasKey = state.game.inventory.some(i => i.id === 'rusty_key');
        if (hasKey) {
          unlockFoyerDoor();
        } else {
          recordMistake();
          addToast('The door is locked tight! You need a key with bat-wing fluting.', 'error', '🔒');
        }
        return;
      }

      if (inspectable.requiresItem === 'amethyst_crystal') {
        const hasCrystal = state.game.inventory.some(i => i.id === 'amethyst_crystal');
        if (hasCrystal) {
          placeVaultItem('crystal');
        } else {
          recordMistake();
          addToast('The pedestal socket is cold. You need the Witch\'s Amethyst Crystal from Room 2!', 'error', '💎');
        }
        return;
      }

      if (inspectable.requiresItem === 'pumpkin_seal') {
        const hasSeal = state.game.inventory.some(i => i.id === 'pumpkin_seal');
        if (hasSeal) {
          placeVaultItem('seal');
        } else {
          recordMistake();
          addToast('The pedestal awaits a sacred talisman. Search the gargoyle sconce!', 'error', '🎃');
        }
        return;
      }
    }

    // If it drops a clue
    if (inspectable.clueFound) {
      discoverClue(inspectable.clueFound);
    }

    // If it drops an item reward
    if (inspectable.itemReward) {
      addInventoryItem(inspectable.itemReward);
    }

    // Special: Bubbling Cauldron easter egg
    if (inspectable.id === 'library_cauldron') {
      soundEngine.playBubble();
      addToast('The cauldron bubbles with sweet lavender sparks! (+15 pts)', 'success', '🫧');
    }
  };

  return (
    <div className="escape-page-root">
      {/* Top Game Navigation & Status Bar */}
      <div className="escape-top-bar">
        <div className="container escape-bar-inner">
          {/* Room Selector Breadcrumbs */}
          <div className="room-nav-pills">
            <button
              onClick={() => setCurrentRoom('foyer')}
              className={`room-pill ${currentRoomKey === 'foyer' ? 'active' : ''}`}
            >
              <span>1. Forgotten Foyer</span>
            </button>

            <button
              onClick={() => {
                if (isFoyerUnlocked) setCurrentRoom('library');
                else addToast('Unlock the Foyer Door first!', 'info', '🔒');
              }}
              className={`room-pill ${currentRoomKey === 'library' ? 'active' : ''} ${!isFoyerUnlocked ? 'locked' : ''}`}
              title={isFoyerUnlocked ? 'Enter The Witch\'s Library' : 'Locked by heavy foyer door'}
            >
              {!isFoyerUnlocked && <Lock size={14} />}
              <span>2. Witch's Library</span>
            </button>

            <button
              onClick={() => {
                if (isLibraryUnlocked) setCurrentRoom('vault');
                else addToast('Solve the Bookcase lock in the Library first!', 'info', '🔒');
              }}
              className={`room-pill ${currentRoomKey === 'vault' ? 'active' : ''} ${!isLibraryUnlocked ? 'locked' : ''}`}
              title={isLibraryUnlocked ? 'Enter The Pumpkin Vault' : 'Locked behind bookcase passage'}
            >
              {!isLibraryUnlocked && <Lock size={14} />}
              <span>3. Pumpkin Vault</span>
            </button>
          </div>

          {/* Timer and Mode Controls */}
          <div className="game-status-controls">
            {state.game.timerMode === 'countdown' ? (
              <div className="timer-badge countdown-active" title="Midnight is approaching!">
                <Clock size={16} />
                <span className="timer-val">{formattedTime}</span>
                <button
                  onClick={() => setTimerMode('relaxed')}
                  className="mode-toggle-link"
                  title="Switch to Relaxed Mode (no timer)"
                >
                  (Relax?)
                </button>
              </div>
            ) : (
              <div className="timer-badge relaxed-active" title="Relaxed Mode enabled">
                <Sparkles size={16} />
                <span>Relaxed Exploration</span>
                <button
                  onClick={() => setTimerMode('countdown')}
                  className="mode-toggle-link"
                  title="Switch to 10-Minute Countdown challenge"
                >
                  (10m Timer?)
                </button>
              </div>
            )}

            <button
              onClick={() => setShowRestartConfirm(true)}
              className="btn-ghost restart-btn"
              title="Restart Escape Game"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Room Viewport */}
      <div className="container room-viewport-container">
        {/* Room Header Info */}
        <div className="room-meta-header">
          <span className="room-subtitle-tag">{currentRoom.subtitle}</span>
          <h1 className="room-title">{currentRoom.name}</h1>
          <p className="room-desc">{currentRoom.description}</p>
        </div>

        {/* Room Visual Canvas & Hotspot Stage */}
        <div className={`room-stage-card spooky-card ${currentRoom.bgClass}`}>
          {/* Dynamic SVG / Scene Backdrop */}
          {currentRoomKey === 'foyer' && (
            <svg className="room-scene-svg" viewBox="0 0 800 450">
              {/* Floorboards */}
              <polygon points="0,320 800,320 800,450 0,450" fill="#180e06" />
              <line x1="160" y1="320" x2="80" y2="450" stroke="#2b160b" strokeWidth="2" />
              <line x1="320" y1="320" x2="280" y2="450" stroke="#2b160b" strokeWidth="2" />
              <line x1="480" y1="320" x2="520" y2="450" stroke="#2b160b" strokeWidth="2" />
              <line x1="640" y1="320" x2="720" y2="450" stroke="#2b160b" strokeWidth="2" />

              {/* Foyer Door Archway */}
              <path d="M 330 320 L 330 140 Q 400 90 470 140 L 470 320 Z" fill="#0c0714" stroke="#FF8A2A" strokeWidth="4" />
              {isFoyerUnlocked ? (
                /* Door Open */
                <path d="M 340 310 L 370 150 Q 400 120 410 150 L 380 310 Z" fill="#291b4f" opacity="0.9" />
              ) : (
                /* Door Closed */
                <path d="M 335 315 L 335 145 Q 400 100 465 145 L 465 315 Z" fill="#1f112e" />
              )}
              {/* Door Knocker / Padlock */}
              <circle cx="400" cy="230" r="12" fill={isFoyerUnlocked ? "#9CF2C1" : "#FFC16C"} />

              {/* Grandfather Clock Silhouette */}
              <rect x="120" y="120" width="80" height="200" fill="#241407" stroke="#FFC16C" strokeWidth="2" rx="6" />
              <circle cx="160" cy="160" r="26" fill="#FFF5E9" opacity="0.9" />
              <line x1="160" y1="160" x2="160" y2="145" stroke="#100B20" strokeWidth="3" />
              <line x1="160" y1="160" x2="175" y2="160" stroke="#100B20" strokeWidth="2" />
              {/* Pendulum */}
              <line x1="160" y1="200" x2="160" y2="270" stroke="#FFC16C" strokeWidth="3" />
              <circle cx="160" cy="270" r="10" fill="#FFC16C" />

              {/* Welcome Mat */}
              <ellipse cx="400" cy="360" rx="90" ry="24" fill="#301c0c" stroke="#523116" strokeWidth="2" />
              <text x="400" y="365" textAnchor="middle" fill="#8c5828" fontSize="14" fontFamily="sans-serif" fontWeight="bold">NEVER WELCOME</text>

              {/* Chandelier Top */}
              <polygon points="380,0 420,0 410,70 390,70" fill="#1b122c" />
              <line x1="400" y1="70" x2="400" y2="110" stroke="#FFC16C" strokeWidth="2" />
              <ellipse cx="400" cy="110" rx="70" ry="12" fill="#2d1c47" stroke="#FFC16C" strokeWidth="2" />
              {/* Candle flames */}
              <circle cx="340" cy="100" r="6" fill="#FF8A2A" className="candle-flame" />
              <circle cx="400" cy="95" r="7" fill="#FFC16C" className="candle-flame" />
              <circle cx="460" cy="100" r="6" fill="#FF8A2A" className="candle-flame" />
            </svg>
          )}

          {currentRoomKey === 'library' && (
            <svg className="room-scene-svg" viewBox="0 0 800 450">
              {/* High Gothic Bookshelves */}
              <rect x="40" y="60" width="220" height="280" fill="#160e24" stroke="#442468" strokeWidth="3" />
              <line x1="40" y1="130" x2="260" y2="130" stroke="#5d328c" strokeWidth="4" />
              <line x1="40" y1="200" x2="260" y2="200" stroke="#5d328c" strokeWidth="4" />
              <line x1="40" y1="270" x2="260" y2="270" stroke="#5d328c" strokeWidth="4" />

              {/* Colored Book Spines */}
              <rect x="55" y="70" width="16" height="55" fill="#FF8A2A" />
              <rect x="75" y="75" width="20" height="50" fill="#9CF2C1" />
              <rect x="100" y="68" width="18" height="58" fill="#B99AE8" />
              <rect x="122" y="72" width="22" height="54" fill="#FFC16C" />
              {/* Skulls on middle shelf */}
              <text x="70" y="190" fontSize="24">💀</text>
              <text x="110" y="190" fontSize="24">💀</text>
              <text x="150" y="190" fontSize="24">💀</text>
              <text x="190" y="190" fontSize="24">💀</text>
              <text x="230" y="190" fontSize="24">💀</text>

              {/* Right Secret Bookcase Passage */}
              <rect x="540" y="60" width="220" height="280" fill="#120b1f" stroke="#FFC16C" strokeWidth={isLibraryUnlocked ? 4 : 2} />
              {isLibraryUnlocked && (
                <rect x="560" y="80" width="180" height="240" fill="#2b160b" />
              )}

              {/* Central Alchemical Desk */}
              <ellipse cx="400" cy="330" rx="160" ry="40" fill="#211333" stroke="#FF8A2A" strokeWidth="3" />

              {/* Bubbling Cauldron on Left */}
              <ellipse cx="280" cy="340" rx="36" ry="16" fill="#0d0718" stroke="#9CF2C1" strokeWidth="3" />
              <circle cx="280" cy="330" r="10" fill="#9CF2C1" opacity="0.6" className="cauldron-bubble" />
              <circle cx="270" cy="315" r="7" fill="#B99AE8" opacity="0.5" className="cauldron-bubble" />

              {/* Astronomy Globe on Right */}
              <circle cx="510" cy="290" r="28" fill="#1c2b42" stroke="#FFC16C" strokeWidth="3" />
              <ellipse cx="510" cy="290" rx="28" ry="10" fill="none" stroke="#FFC16C" strokeWidth="2" />
            </svg>
          )}

          {currentRoomKey === 'vault' && (
            <svg className="room-scene-svg" viewBox="0 0 800 450">
              {/* Stained Glass Gothic Window */}
              <path d="M 300 180 L 300 80 Q 400 10 500 80 L 500 180 Z" fill="rgba(255, 193, 108, 0.15)" stroke="#FF8A2A" strokeWidth="3" />
              <line x1="400" y1="20" x2="400" y2="180" stroke="#FF8A2A" strokeWidth="2" />
              <circle cx="400" cy="80" r="30" fill="none" stroke="#FFC16C" strokeWidth="2" />

              {/* Monumental Master Vault Door in Center */}
              <circle cx="400" cy="270" r="100" fill="#1a102a" stroke="#FF8A2A" strokeWidth="6" />
              <circle cx="400" cy="270" r="80" fill="#24133b" stroke="#FFC16C" strokeWidth="3" />
              <circle cx="400" cy="270" r="40" fill="#FF8A2A" />
              <text x="400" y="285" textAnchor="middle" fontSize="38">🎃</text>

              {/* Left Pedestal (Amethyst) */}
              <rect x="120" y="240" width="80" height="120" fill="#201336" stroke={state.game.vaultCrystalPlaced ? "#B99AE8" : "#442468"} strokeWidth="3" rx="4" />
              <polygon points="100,240 220,240 200,220 120,220" fill="#2d1c47" />
              <circle cx="160" cy="205" r="16" fill={state.game.vaultCrystalPlaced ? "#B99AE8" : "#160e24"} stroke="#B99AE8" strokeWidth="2" />
              {state.game.vaultCrystalPlaced && <text x="160" y="212" textAnchor="middle" fontSize="20">💎</text>}

              {/* Right Pedestal (Pumpkin Seal) */}
              <rect x="600" y="240" width="80" height="120" fill="#201336" stroke={state.game.vaultSealPlaced ? "#FF8A2A" : "#442468"} strokeWidth="3" rx="4" />
              <polygon points="580,240 700,240 680,220 600,220" fill="#2d1c47" />
              <circle cx="640" cy="205" r="16" fill={state.game.vaultSealPlaced ? "#FF8A2A" : "#160e24"} stroke="#FF8A2A" strokeWidth="2" />
              {state.game.vaultSealPlaced && <text x="640" y="212" textAnchor="middle" fontSize="20">🎃</text>}
            </svg>
          )}

          {/* Interactive Inspectable Hotspots Overlay */}
          <div className="hotspots-overlay">
            {currentRoom.inspectables.map(item => {
              const isLockedDoor = item.id === 'foyer_door' && !isFoyerUnlocked;
              const isOpenDoor = item.id === 'foyer_door' && isFoyerUnlocked;

              return (
                <button
                  key={item.id}
                  onClick={() => handleInspect(item)}
                  className={`hotspot-btn hotspot-${item.id}`}
                  title={`${item.name} — ${item.actionLabel}`}
                  aria-label={`${item.name}: ${item.actionLabel}`}
                >
                  <div className="hotspot-pulse" />
                  <div className="hotspot-content">
                    <span className="hotspot-icon">
                      {isOpenDoor ? <DoorOpen size={18} /> : isLockedDoor ? <Lock size={18} /> : <Sparkles size={18} />}
                    </span>
                    <span className="hotspot-label">{item.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Room Action Cards Row */}
        <div className="inspectables-cards-grid">
          {currentRoom.inspectables.map(item => (
            <div key={item.id} className="inspect-quick-card spooky-card">
              <div className="card-top-row">
                <span className="card-item-name">{item.name}</span>
                {item.puzzleId && (
                  <span className="card-puzzle-tag">Puzzle</span>
                )}
              </div>
              <p className="card-item-desc">{item.description}</p>
              <button
                onClick={() => handleInspect(item)}
                className="btn-secondary card-action-btn"
              >
                {item.actionLabel}
              </button>
            </div>
          ))}
        </div>

        {/* Room Navigation Buttons */}
        <div className="room-nav-bottom-row">
          {currentRoom.prevRoom && (
            <button
              onClick={() => setCurrentRoom(currentRoom.prevRoom)}
              className="btn-secondary nav-dir-btn"
            >
              <ArrowLeft size={18} />
              <span>Back to Previous Room</span>
            </button>
          )}

          {currentRoom.nextRoom && (
            <button
              onClick={() => {
                if (currentRoomKey === 'foyer' && !isFoyerUnlocked) {
                  addToast('Unlock the Foyer Door with the Rusty Key first!', 'error', '🔒');
                } else if (currentRoomKey === 'library' && !isLibraryUnlocked) {
                  addToast('Solve the Bookcase combination lock first!', 'error', '🔒');
                } else {
                  setCurrentRoom(currentRoom.nextRoom);
                }
              }}
              className="btn-primary nav-dir-btn glow-orange"
            >
              <span>Advance to Next Room</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Floating Bottom Inventory Dock */}
      <InventoryTray />

      {/* Item Inspection Modal */}
      <ItemModal />

      {/* Active Puzzle Modals */}
      {activePuzzleId === 'riddle_clock' && (
        <RiddlePuzzle onClose={() => setActivePuzzleId(null)} />
      )}
      {activePuzzleId === 'rune_sequence' && (
        <RuneSequencePuzzle onClose={() => setActivePuzzleId(null)} />
      )}
      {activePuzzleId === 'bookcase_combination' && (
        <CombinationDialPuzzle onClose={() => setActivePuzzleId(null)} />
      )}
      {activePuzzleId === 'master_vault' && (
        <MasterVaultPuzzle onClose={() => setActivePuzzleId(null)} />
      )}

      {/* Restart Game Modal Confirmation */}
      {showRestartConfirm && (
        <div className="modal-backdrop" onClick={() => setShowRestartConfirm(false)}>
          <div className="spooky-card confirm-modal" onClick={e => e.stopPropagation()}>
            <h3 className="confirm-title">Restart Escape Adventure?</h3>
            <p className="confirm-desc">
              This will reset your current room back to the Foyer and relock doors. Your unlocked trophies will be saved!
            </p>
            <div className="confirm-btn-row">
              <button
                onClick={() => {
                  setCurrentRoom('foyer');
                  setShowRestartConfirm(false);
                  addToast('Reset back to The Forgotten Foyer.', 'info', '🔄');
                }}
                className="btn-primary"
              >
                Restart Room 1
              </button>
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="btn-secondary"
              >
                Keep Playing
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .escape-page-root {
          padding-bottom: 120px;
        }

        .escape-top-bar {
          background: rgba(16, 11, 32, 0.9);
          border-bottom: 1px solid rgba(185, 154, 232, 0.15);
          padding: 12px 0;
          margin-bottom: 24px;
        }

        .escape-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .room-nav-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .room-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 700;
          background: rgba(33, 19, 51, 0.7);
          border: 1px solid rgba(185, 154, 232, 0.2);
          color: var(--color-ghost);
          transition: all 0.2s;
        }

        .room-pill:hover:not(.locked) {
          border-color: var(--color-amber);
          color: var(--color-amber);
        }

        .room-pill.active {
          background: var(--color-pumpkin);
          color: var(--color-midnight);
          border-color: var(--color-pumpkin);
          box-shadow: 0 0 14px rgba(255, 138, 42, 0.5);
        }

        .room-pill.locked {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .game-status-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .timer-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 700;
        }

        .countdown-active {
          background: rgba(255, 77, 109, 0.15);
          border: 1px solid rgba(255, 77, 109, 0.4);
          color: #ffccd5;
        }

        .timer-val {
          font-family: var(--font-display);
          font-size: 1.05rem;
        }

        .relaxed-active {
          background: rgba(156, 242, 193, 0.15);
          border: 1px solid rgba(156, 242, 193, 0.35);
          color: var(--color-mint);
        }

        .mode-toggle-link {
          font-size: 0.75rem;
          color: var(--color-amber);
          text-decoration: underline;
        }

        .restart-btn {
          padding: 8px;
        }

        .room-meta-header {
          margin-bottom: 20px;
        }

        .room-subtitle-tag {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--color-amber);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .room-title {
          font-size: 2.2rem;
          color: var(--color-ghost);
          margin: 4px 0 8px;
        }

        .room-desc {
          color: #d1c5e4;
          font-size: 1.05rem;
          line-height: 1.5;
          max-width: 720px;
        }

        .room-stage-card {
          position: relative;
          padding: 0;
          overflow: hidden;
          margin-bottom: 28px;
          border: 2px solid rgba(185, 154, 232, 0.25);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
        }

        .room-foyer-bg {
          background: radial-gradient(circle at 50% 30%, #29150b 0%, #150904 100%);
        }

        .room-library-bg {
          background: radial-gradient(circle at 50% 30%, #181938 0%, #0d0e1e 100%);
        }

        .room-vault-bg {
          background: radial-gradient(circle at 50% 30%, #361706 0%, #170902 100%);
        }

        .room-scene-svg {
          width: 100%;
          height: auto;
          display: block;
          max-height: 480px;
        }

        .candle-flame {
          animation: flicker 2s infinite ease-in-out;
        }

        .cauldron-bubble {
          animation: floatGhost 3s infinite ease-in-out;
        }

        .hotspots-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .hotspot-btn {
          position: absolute;
          pointer-events: auto;
          background: rgba(16, 11, 32, 0.88);
          border: 1px solid var(--color-amber);
          border-radius: var(--radius-full);
          padding: 6px 12px;
          color: var(--color-ghost);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
          transition: all 0.2s;
        }

        .hotspot-btn:hover {
          transform: scale(1.08) translateY(-2px);
          border-color: var(--color-pumpkin);
          background: rgba(33, 19, 51, 0.95);
          box-shadow: 0 0 18px rgba(255, 138, 42, 0.6);
        }

        .hotspot-pulse {
          position: absolute;
          inset: -4px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-amber);
          animation: pulseGlow 2.5s infinite;
          pointer-events: none;
        }

        .hotspot-content {
          display: flex;
          align-items: center;
          gap: 6px;
          position: relative;
          z-index: 1;
        }

        /* Hotspot Absolute Layouts */
        .hotspot-foyer_clock { top: 32%; left: 16%; }
        .hotspot-foyer_mat { top: 76%; left: 45%; }
        .hotspot-foyer_chandelier { top: 18%; left: 45%; }
        .hotspot-foyer_door { top: 48%; left: 45%; }

        .hotspot-library_grimoire { top: 62%; left: 45%; }
        .hotspot-library_rune_altar { top: 44%; left: 32%; }
        .hotspot-library_globe { top: 58%; left: 60%; }
        .hotspot-library_lockbox { top: 28%; left: 72%; }
        .hotspot-library_cauldron { top: 68%; left: 28%; }

        .hotspot-vault_pedestal_crystal { top: 48%; left: 14%; }
        .hotspot-vault_pedestal_pumpkin { top: 48%; left: 72%; }
        .hotspot-vault_wall_niche { top: 22%; left: 78%; }
        .hotspot-vault_master_door { top: 56%; left: 44%; }

        @media (max-width: 600px) {
          .hotspot-label {
            display: none;
          }
          .hotspot-btn {
            padding: 8px;
            border-radius: 50%;
          }
        }

        .inspectables-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 28px;
        }

        @media (min-width: 600px) {
          .inspectables-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 900px) {
          .inspectables-cards-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .inspect-quick-card {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-item-name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-amber);
        }

        .card-puzzle-tag {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--color-lavender);
          background: rgba(185, 154, 232, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .card-item-desc {
          font-size: 0.85rem;
          color: #b5a8c9;
          line-height: 1.4;
          flex: 1;
        }

        .card-action-btn {
          width: 100%;
          font-size: 0.85rem;
          padding: 8px 12px;
        }

        .room-nav-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .nav-dir-btn {
          font-size: 0.95rem;
        }

        .confirm-modal {
          max-width: 420px;
          width: 100%;
          padding: 30px;
          text-align: center;
        }

        .confirm-title {
          font-size: 1.4rem;
          color: var(--color-ghost);
          margin-bottom: 10px;
        }

        .confirm-desc {
          color: #b5a8c9;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .confirm-btn-row {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};
