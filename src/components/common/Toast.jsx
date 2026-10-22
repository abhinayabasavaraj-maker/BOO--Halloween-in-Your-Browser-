import React from 'react';
import { useGame } from '../../context/GameContext';

export const ToastContainer = () => {
  const { toasts } = useGame();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast-card toast-${toast.type}`}>
          <span className="toast-icon">{toast.icon}</span>
          <span className="toast-text">{toast.message}</span>
        </div>
      ))}

      <style>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
          max-width: 360px;
        }

        .toast-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(33, 19, 51, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(185, 154, 232, 0.3);
          border-radius: var(--radius-md);
          padding: 12px 18px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
          color: var(--color-ghost);
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 600;
          animation: itemDrop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toast-achievement {
          border-color: var(--color-amber);
          background: rgba(45, 20, 10, 0.95);
          box-shadow: 0 0 20px rgba(255, 193, 108, 0.4);
        }

        .toast-success {
          border-color: var(--color-mint);
          box-shadow: 0 0 20px rgba(156, 242, 193, 0.3);
        }

        .toast-clue {
          border-color: var(--color-lavender);
          box-shadow: 0 0 20px rgba(185, 154, 232, 0.3);
        }

        .toast-icon {
          font-size: 1.3rem;
          line-height: 1;
        }

        .toast-text {
          line-height: 1.3;
        }
      `}</style>
    </div>
  );
};
