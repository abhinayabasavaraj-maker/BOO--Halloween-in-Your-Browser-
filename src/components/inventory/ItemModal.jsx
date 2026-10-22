import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { X, Key, Scroll, Gem, Shield, FileText, Sparkles } from 'lucide-react';

export const ItemModal = () => {
  const { activeItemModal, setActiveItemModal } = useGame();

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveItemModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveItemModal]);

  if (!activeItemModal) return null;

  const renderItemGraphic = () => {
    switch (activeItemModal.id) {
      case 'rusty_key':
        return <Key size={56} className="item-icon-graphic key-color" />;
      case 'parchment_left':
      case 'parchment_right':
        return <Scroll size={56} className="item-icon-graphic scroll-color" />;
      case 'amethyst_crystal':
        return <Gem size={56} className="item-icon-graphic crystal-color" />;
      case 'pumpkin_seal':
        return <Shield size={56} className="item-icon-graphic seal-color" />;
      default:
        return <Sparkles size={56} className="item-icon-graphic" />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveItemModal(null)}>
      <div
        className="item-modal-box spooky-card"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-modal-title"
      >
        <button
          onClick={() => setActiveItemModal(null)}
          className="modal-close-btn"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="item-visual-pod">
          <div className="item-halo" />
          {renderItemGraphic()}
        </div>

        <h3 id="item-modal-title" className="item-modal-title">
          {activeItemModal.name}
        </h3>

        <div className="spooky-badge modal-badge">
          <span>🎃 Quest Inventory Item</span>
        </div>

        <p className="item-modal-lore">
          {activeItemModal.lore || 'A mysterious relic from the haunted mansion.'}
        </p>

        <div className="item-modal-footer">
          <span className="esc-hint">Press ESC or click anywhere outside to close</span>
          <button
            onClick={() => setActiveItemModal(null)}
            className="btn-primary modal-action-btn"
          >
            Stow in Pack
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(8, 5, 18, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: itemDrop 0.25s ease-out;
        }

        .item-modal-box {
          position: relative;
          max-width: 440px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 36px 28px 28px;
          border-color: rgba(255, 138, 42, 0.4);
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          color: var(--color-lavender);
          padding: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
        }

        .modal-close-btn:hover {
          color: var(--color-ghost);
          background: rgba(255, 255, 255, 0.15);
        }

        .item-visual-pod {
          position: relative;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: rgba(16, 11, 32, 0.9);
          border: 2px solid rgba(185, 154, 232, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .item-halo {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 138, 42, 0.3) 0%, transparent 70%);
          animation: mysticalPulse 3s infinite ease-in-out;
        }

        .item-icon-graphic {
          position: relative;
          z-index: 1;
        }

        .key-color { color: var(--color-amber); filter: drop-shadow(0 0 10px rgba(255, 193, 108, 0.6)); }
        .scroll-color { color: #f4d06f; filter: drop-shadow(0 0 10px rgba(244, 208, 111, 0.5)); }
        .crystal-color { color: var(--color-lavender); filter: drop-shadow(0 0 12px rgba(185, 154, 232, 0.8)); }
        .seal-color { color: var(--color-pumpkin); filter: drop-shadow(0 0 12px rgba(255, 138, 42, 0.8)); }

        .item-modal-title {
          font-size: 1.5rem;
          color: var(--color-ghost);
          margin-bottom: 8px;
        }

        .modal-badge {
          margin-bottom: 16px;
        }

        .item-modal-lore {
          color: #d1c5e4;
          line-height: 1.6;
          font-size: 1rem;
          margin-bottom: 24px;
        }

        .item-modal-footer {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }

        .esc-hint {
          font-size: 0.75rem;
          color: #7f7396;
        }

        .modal-action-btn {
          width: 100%;
        }
      `}</style>
    </div>
  );
};
