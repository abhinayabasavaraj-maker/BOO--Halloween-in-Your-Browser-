import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Volume2, VolumeX, Music, Zap, Menu, X, Shield, Sparkles, Ghost } from 'lucide-react';

export const Header = ({ currentTab, setTab }) => {
  const {
    state,
    toggleSound,
    toggleAmbience,
    toggleReducedMotion,
    clickEasterGhost
  } = useGame();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'explore', label: 'Explore', icon: '🏰' },
    { id: 'escape', label: 'Haunted House', icon: '🗝️' },
    { id: 'decorator', label: 'My Spooky Room', icon: '🎨' },
    { id: 'rewards', label: 'Rewards', icon: '🏆' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleNavClick = (tabId) => {
    setTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="header-wrapper">
      <div className="container header-container">
        {/* Brand / Logo */}
        <button
          onClick={() => handleNavClick('explore')}
          className="brand-logo-btn"
          aria-label="BOO! Return to Home"
        >
          <div className="pumpkin-logo-glow">
            <span className="logo-emoji">🎃</span>
          </div>
          <div className="brand-text-col">
            <span className="brand-name">BOO!</span>
            <span className="brand-sub">HALLOWEEN ESCAPE</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-link ${currentTab === item.id ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {currentTab === item.id && <span className="nav-active-pill" />}
            </button>
          ))}
        </nav>

        {/* Quick Actions (Points + Audio + Mobile menu) */}
        <div className="header-actions">
          {/* Pumpkin Points Pill */}
          <div
            className="points-badge"
            title="Your Total Pumpkin Points"
            onClick={() => handleNavClick('rewards')}
          >
            <span className="points-pumpkin">🎃</span>
            <span className="points-count">{state.stats.pumpkinPoints}</span>
            <span className="points-label">PTS</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`icon-btn ${state.settings.soundEnabled ? 'active-glow' : 'muted'}`}
            title={state.settings.soundEnabled ? 'Mute Sound (Web Audio)' : 'Unmute Sound'}
            aria-label="Toggle Sound Effects"
          >
            {state.settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Ambient Music Toggle */}
          <button
            onClick={toggleAmbience}
            className={`icon-btn ${state.settings.ambienceEnabled ? 'ambient-on' : ''}`}
            title={state.settings.ambienceEnabled ? 'Stop Spooky Ambience' : 'Play Spooky Ambience'}
            aria-label="Toggle Atmospheric Drone"
          >
            <Music size={18} />
          </button>

          {/* Hidden Easter Egg Spirit wandering in header */}
          <button
            onClick={() => clickEasterGhost('header_ghost')}
            className="easter-ghost-btn"
            title="A wandering spirit smiles at you..."
            aria-label="Hidden Wandering Spirit"
          >
            <Ghost size={16} />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel">
          <nav className="mobile-nav-links">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`mobile-nav-item ${currentTab === item.id ? 'active' : ''}`}
              >
                <span className="mobile-nav-icon">{item.icon}</span>
                <span className="mobile-nav-text">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      <style>{`
        .header-wrapper {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(16, 11, 32, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(185, 154, 232, 0.15);
          transition: all 0.3s ease;
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }

        .brand-logo-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          padding: 6px 10px;
          border-radius: var(--radius-md);
        }

        .pumpkin-logo-glow {
          font-size: 1.8rem;
          line-height: 1;
          filter: drop-shadow(0 0 10px rgba(255, 138, 42, 0.6));
          animation: pulseGlow 3s infinite ease-in-out;
        }

        .brand-text-col {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-family: var(--font-spooky);
          font-size: 1.7rem;
          line-height: 1;
          color: var(--color-pumpkin);
          text-shadow: 0 0 12px rgba(255, 138, 42, 0.5);
          letter-spacing: 0.05em;
        }

        .brand-sub {
          font-family: var(--font-display);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--color-lavender);
        }

        .desktop-nav {
          display: none;
          align-items: center;
          gap: 6px;
        }

        @media (min-width: 860px) {
          .desktop-nav {
            display: flex;
          }
        }

        .nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-ghost);
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          color: var(--color-amber);
          background: rgba(255, 193, 108, 0.08);
        }

        .nav-link.active {
          color: var(--color-midnight);
          background: var(--color-amber);
          box-shadow: 0 0 15px rgba(255, 193, 108, 0.4);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .points-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(33, 19, 51, 0.9);
          border: 1px solid rgba(255, 138, 42, 0.4);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .points-badge:hover {
          transform: scale(1.05);
          border-color: var(--color-pumpkin);
          box-shadow: 0 0 12px rgba(255, 138, 42, 0.4);
        }

        .points-pumpkin {
          font-size: 1.1rem;
        }

        .points-count {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1rem;
          color: var(--color-amber);
        }

        .points-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-lavender);
        }

        .icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(33, 19, 51, 0.7);
          border: 1px solid rgba(185, 154, 232, 0.2);
          color: var(--color-ghost);
          transition: all 0.2s ease;
        }

        .icon-btn:hover {
          background: rgba(68, 36, 104, 0.6);
          color: var(--color-amber);
          transform: translateY(-2px);
        }

        .icon-btn.active-glow {
          border-color: var(--color-amber);
          color: var(--color-amber);
        }

        .icon-btn.ambient-on {
          border-color: var(--color-mint);
          color: var(--color-mint);
          animation: mysticalPulse 2s infinite ease-in-out;
        }

        .easter-ghost-btn {
          opacity: 0.35;
          color: var(--color-ghost);
          padding: 6px;
          border-radius: 50%;
          animation: floatGhost 4s infinite ease-in-out;
          transition: opacity 0.2s;
        }

        .easter-ghost-btn:hover {
          opacity: 1;
          color: var(--color-mint);
          transform: scale(1.2);
        }

        .mobile-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: rgba(33, 19, 51, 0.8);
          border: 1px solid rgba(185, 154, 232, 0.25);
          color: var(--color-ghost);
        }

        @media (min-width: 860px) {
          .mobile-menu-btn {
            display: none;
          }
        }

        .mobile-nav-panel {
          border-top: 1px solid rgba(185, 154, 232, 0.15);
          background: rgba(16, 11, 32, 0.98);
          padding: 16px 20px;
          backdrop-filter: blur(20px);
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--color-ghost);
          text-align: left;
        }

        .mobile-nav-item.active {
          background: var(--color-amber);
          color: var(--color-midnight);
        }

        .mobile-nav-icon {
          font-size: 1.3rem;
        }
      `}</style>
    </header>
  );
};
