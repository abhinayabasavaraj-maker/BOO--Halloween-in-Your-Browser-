import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Briefcase, Key, Scroll, Gem, Shield, FileText, Sparkles, BookOpen, ChevronUp, ChevronDown } from 'lucide-react';

export const InventoryTray = () => {
  const { state, setActiveItemModal } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [cluesOpen, setCluesOpen] = useState(false);

  const inventory = state.game.inventory;
  const clues = state.game.discoveredClues;

  const renderItemIcon = (item) => {
    switch (item.id) {
      case 'rusty_key':
        return <Key size={22} className="inv-icon key-col" />;
      case 'parchment_left':
      case 'parchment_right':
        return <Scroll size={22} className="inv-icon scroll-col" />;
      case 'amethyst_crystal':
        return <Gem size={22} className="inv-icon crystal-col" />;
      case 'pumpkin_seal':
        return <Shield size={22} className="inv-icon seal-col" />;
      default:
        return <Sparkles size={22} className="inv-icon" />;
    }
  };

  return (
    <div className="inventory-tray-dock">
      {/* Top Toggle Bars */}
      <div className="dock-actions-row">
        {/* Clue Journal Button */}
        <button
          onClick={() => {
            setCluesOpen(!cluesOpen);
            if (isOpen) setIsOpen(false);
          }}
          className={`dock-btn ${cluesOpen ? 'active' : ''}`}
          title="Open Clue Journal"
        >
          <BookOpen size={18} />
          <span>Clue Journal</span>
          <span className="badge-pill">{clues.length}</span>
        </button>

        {/* Inventory Toggle Button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (cluesOpen) setCluesOpen(false);
          }}
          className={`dock-btn ${isOpen ? 'active' : ''}`}
          title="Open Bag of Relics"
        >
          <Briefcase size={18} />
          <span>Pouch</span>
          <span className="badge-pill">{inventory.length}/5</span>
          {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* Clues Journal Drawer */}
      {cluesOpen && (
        <div className="clues-panel spooky-card">
          <div className="panel-header">
            <h4 className="panel-title">📜 Discovered Clues & Lore</h4>
            <span className="panel-count">{clues.length} Collected</span>
          </div>
          {clues.length === 0 ? (
            <p className="empty-clues">No clues discovered yet. Search the rooms, inspect clocks, mats, and bookcases!</p>
          ) : (
            <div className="clues-list">
              {clues.map(c => (
                <div key={c.id} className="clue-entry">
                  <span className="clue-tag">CLUE</span>
                  <div className="clue-body">
                    <strong className="clue-name">{c.name}</strong>
                    <p className="clue-text">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Inventory Item Slots Drawer */}
      {isOpen && (
        <div className="inventory-drawer spooky-card">
          <div className="panel-header">
            <h4 className="panel-title">🎒 Inventory & Relics</h4>
            <span className="panel-subtitle">Click any relic to inspect its lore</span>
          </div>

          <div className="slots-grid">
            {/* Total 5 item slots */}
            {Array.from({ length: 5 }).map((_, index) => {
              const item = inventory[index];
              return (
                <div
                  key={index}
                  className={`slot-card ${item ? 'slot-filled' : 'slot-empty'}`}
                  onClick={() => item && setActiveItemModal(item)}
                  tabIndex={item ? 0 : -1}
                  role={item ? 'button' : 'presentation'}
                  title={item ? `${item.name} — Click to inspect` : 'Empty slot'}
                >
                  {item ? (
                    <>
                      <div className="slot-icon-box">{renderItemIcon(item)}</div>
                      <span className="slot-name">{item.name}</span>
                    </>
                  ) : (
                    <div className="empty-slot-mark">·</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .inventory-tray-dock {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 90;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          max-width: 95vw;
        }

        .dock-actions-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(16, 11, 32, 0.85);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          padding: 6px 10px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(185, 154, 232, 0.25);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        .dock-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(33, 19, 51, 0.9);
          border: 1px solid rgba(185, 154, 232, 0.2);
          color: var(--color-ghost);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.9rem;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          transition: all 0.2s;
        }

        .dock-btn:hover {
          background: rgba(68, 36, 104, 0.7);
          color: var(--color-amber);
          transform: translateY(-2px);
        }

        .dock-btn.active {
          background: var(--color-pumpkin);
          color: var(--color-midnight);
          border-color: var(--color-pumpkin);
          box-shadow: 0 0 16px rgba(255, 138, 42, 0.5);
        }

        .badge-pill {
          background: rgba(0, 0, 0, 0.35);
          padding: 2px 7px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .inventory-drawer, .clues-panel {
          width: 520px;
          max-width: 92vw;
          padding: 20px;
          animation: itemDrop 0.25s ease-out;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          border-bottom: 1px solid rgba(185, 154, 232, 0.15);
          padding-bottom: 8px;
        }

        .panel-title {
          font-size: 1.1rem;
          color: var(--color-amber);
        }

        .panel-subtitle, .panel-count {
          font-size: 0.8rem;
          color: #a497bd;
        }

        .slots-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
        }

        @media (max-width: 540px) {
          .slots-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .slot-card {
          aspect-ratio: 1;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          text-align: center;
          cursor: default;
          transition: all 0.2s;
        }

        .slot-empty {
          background: rgba(16, 11, 32, 0.5);
          border: 1px dashed rgba(185, 154, 232, 0.2);
          color: rgba(185, 154, 232, 0.3);
        }

        .empty-slot-mark {
          font-size: 2rem;
          line-height: 1;
        }

        .slot-filled {
          background: rgba(43, 24, 69, 0.8);
          border: 1px solid rgba(255, 138, 42, 0.4);
          cursor: pointer;
        }

        .slot-filled:hover {
          transform: translateY(-3px);
          border-color: var(--color-amber);
          box-shadow: 0 0 15px rgba(255, 193, 108, 0.3);
        }

        .slot-icon-box {
          margin-bottom: 4px;
        }

        .slot-name {
          font-size: 0.7rem;
          font-weight: 600;
          color: #eee;
          line-height: 1.1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .key-col { color: var(--color-amber); }
        .scroll-col { color: #f4d06f; }
        .crystal-col { color: var(--color-lavender); }
        .seal-col { color: var(--color-pumpkin); }

        .clues-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 280px;
          overflow-y: auto;
          padding-right: 6px;
        }

        .clue-entry {
          display: flex;
          gap: 12px;
          background: rgba(16, 11, 32, 0.6);
          border: 1px solid rgba(185, 154, 232, 0.2);
          border-radius: var(--radius-sm);
          padding: 12px;
        }

        .clue-tag {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--color-amber);
          background: rgba(255, 138, 42, 0.15);
          padding: 2px 6px;
          height: fit-content;
          border-radius: 4px;
          border: 1px solid rgba(255, 138, 42, 0.3);
        }

        .clue-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .clue-name {
          font-size: 0.95rem;
          color: var(--color-ghost);
        }

        .clue-text {
          font-size: 0.85rem;
          color: #c0b3d6;
          line-height: 1.4;
        }

        .empty-clues {
          color: #8c7f9e;
          font-size: 0.9rem;
          text-align: center;
          padding: 20px 0;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};
