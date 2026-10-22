import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ACHIEVEMENTS_LIST } from '../data/gameData';
import { soundEngine } from '../utils/audio';
import {
  Trophy,
  Search,
  Key,
  Flame,
  BookOpen,
  Sparkles,
  Compass,
  Palette,
  Ghost,
  Zap,
  Lock,
  CheckCircle,
  Share2,
  Check
} from 'lucide-react';

export const RewardsPage = () => {
  const { state, addToast } = useGame();
  const [copied, setCopied] = useState(false);

  const getAchIcon = (iconName, size = 24) => {
    switch (iconName) {
      case 'Search': return <Search size={size} />;
      case 'Key': return <Key size={size} />;
      case 'Flame': return <Flame size={size} />;
      case 'BookOpen': return <BookOpen size={size} />;
      case 'Sparkles': return <Sparkles size={size} />;
      case 'Compass': return <Compass size={size} />;
      case 'Palette': return <Palette size={size} />;
      case 'Ghost': return <Ghost size={size} />;
      case 'Zap': return <Zap size={size} />;
      default: return <Trophy size={size} />;
    }
  };

  const unlockedCount = state.achievements.length;
  const totalCount = ACHIEVEMENTS_LIST.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  const handleShare = async () => {
    soundEngine.playClick();
    const shareText = `🎃 I've earned ${state.stats.pumpkinPoints} Pumpkin Points and unlocked ${unlockedCount}/${totalCount} trophies in BOO! — The Halloween Escape Browser Game! Can you beat my score?`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BOO! Halloween Achievements',
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (e) {}
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      addToast('Achievements copied to clipboard!', 'success', '📋');
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      addToast('Could not copy to clipboard', 'info', '⚠️');
    }
  };

  return (
    <div className="rewards-page-root">
      <div className="container">
        {/* Header */}
        <div className="rewards-header">
          <div className="spooky-badge">
            <Trophy size={16} />
            <span>HALL OF HALLOWS</span>
          </div>
          <h1 className="rewards-title">REWARDS & ACHIEVEMENTS</h1>
          <p className="rewards-desc">
            Earn golden Pumpkin Points by solving mysteries, locating forgotten relics, deciphering ancient riddles, and exploring the mansion.
          </p>
        </div>

        {/* Global Statistics Banner */}
        <div className="stats-overview-grid">
          <div className="stat-card spooky-card">
            <span className="stat-icon">🎃</span>
            <div className="stat-details">
              <span className="stat-number">{state.stats.pumpkinPoints}</span>
              <span className="stat-name">Pumpkin Points</span>
            </div>
          </div>

          <div className="stat-card spooky-card">
            <span className="stat-icon">🧩</span>
            <div className="stat-details">
              <span className="stat-number">{state.stats.puzzlesSolved} / 4</span>
              <span className="stat-name">Puzzles Solved</span>
            </div>
          </div>

          <div className="stat-card spooky-card">
            <span className="stat-icon">📜</span>
            <div className="stat-details">
              <span className="stat-number">{state.stats.cluesFound}</span>
              <span className="stat-name">Clues Discovered</span>
            </div>
          </div>

          <div className="stat-card spooky-card">
            <span className="stat-icon">⏱️</span>
            <div className="stat-details">
              <span className="stat-number">
                {state.stats.bestTime !== null
                  ? `${Math.floor(state.stats.bestTime / 60)}m ${state.stats.bestTime % 60}s`
                  : '—'}
              </span>
              <span className="stat-name">Best Escape Time</span>
            </div>
          </div>
        </div>

        {/* Achievement Progress Bar Card */}
        <div className="progress-banner spooky-card">
          <div className="progress-top-row">
            <div>
              <h3 className="progress-heading">Trophy Completion</h3>
              <p className="progress-sub">
                {unlockedCount} of {totalCount} trophies unlocked ({completionPercent}%)
              </p>
            </div>
            <button onClick={handleShare} className="btn-secondary share-ach-btn">
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              <span>{copied ? 'Copied!' : 'Share Trophies'}</span>
            </button>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        {/* Achievements Gallery Grid */}
        <div className="achievements-grid">
          {ACHIEVEMENTS_LIST.map(ach => {
            const isUnlocked = state.achievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`achievement-card spooky-card ${isUnlocked ? 'unlocked-card' : 'locked-card'}`}
              >
                <div className={`ach-icon-pod ${isUnlocked ? 'pod-lit' : 'pod-dim'}`}>
                  {isUnlocked ? getAchIcon(ach.icon, 28) : <Lock size={24} />}
                </div>

                <div className="ach-body">
                  <div className="ach-title-row">
                    <h3 className="ach-title">{ach.title}</h3>
                    <span className="ach-points">+{ach.points} pts</span>
                  </div>

                  <p className="ach-desc">{ach.description}</p>

                  <div className="ach-status-badge">
                    {isUnlocked ? (
                      <span className="status-unlocked">
                        <CheckCircle size={14} /> Unlocked
                      </span>
                    ) : (
                      <span className="status-locked">
                        <Lock size={14} /> Locked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .rewards-page-root {
          padding-bottom: 90px;
        }

        .rewards-header {
          margin-bottom: 28px;
        }

        .rewards-title {
          font-size: 2.4rem;
          color: var(--color-ghost);
          margin: 6px 0 8px;
        }

        .rewards-desc {
          color: #d1c5e4;
          font-size: 1.05rem;
          max-width: 680px;
          line-height: 1.5;
        }

        .stats-overview-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 28px;
        }

        @media (min-width: 540px) {
          .stats-overview-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 900px) {
          .stats-overview-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
        }

        .stat-icon {
          font-size: 2.2rem;
          line-height: 1;
        }

        .stat-details {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--color-amber);
        }

        .stat-name {
          font-size: 0.85rem;
          color: #b5a8c9;
        }

        .progress-banner {
          padding: 24px;
          margin-bottom: 28px;
          border-color: rgba(255, 138, 42, 0.3);
        }

        .progress-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
        }

        .progress-heading {
          font-size: 1.3rem;
          color: var(--color-ghost);
        }

        .progress-sub {
          font-size: 0.9rem;
          color: #b5a8c9;
        }

        .progress-track {
          width: 100%;
          height: 12px;
          border-radius: var(--radius-full);
          background: rgba(16, 11, 32, 0.8);
          overflow: hidden;
          border: 1px solid rgba(185, 154, 232, 0.2);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #FF8A2A 0%, #FFC16C 100%);
          border-radius: var(--radius-full);
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 0 14px rgba(255, 138, 42, 0.6);
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 680px) {
          .achievements-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .achievement-card {
          display: flex;
          gap: 16px;
          padding: 20px;
          transition: transform 0.2s, border-color 0.2s;
        }

        .unlocked-card {
          border-color: rgba(255, 138, 42, 0.4);
          background: rgba(36, 20, 56, 0.85);
        }

        .unlocked-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(255, 138, 42, 0.2);
        }

        .locked-card {
          opacity: 0.7;
          border-color: rgba(185, 154, 232, 0.15);
        }

        .ach-icon-pod {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pod-lit {
          background: rgba(255, 138, 42, 0.15);
          border: 1px solid rgba(255, 138, 42, 0.4);
          color: var(--color-amber);
          box-shadow: 0 0 16px rgba(255, 138, 42, 0.3);
        }

        .pod-dim {
          background: rgba(16, 11, 32, 0.6);
          border: 1px solid rgba(185, 154, 232, 0.15);
          color: #6d6182;
        }

        .ach-body {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .ach-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .ach-title {
          font-size: 1.1rem;
          color: var(--color-ghost);
        }

        .ach-points {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-amber);
        }

        .ach-desc {
          font-size: 0.88rem;
          color: #b5a8c9;
          line-height: 1.4;
        }

        .ach-status-badge {
          margin-top: 4px;
        }

        .status-unlocked {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-mint);
        }

        .status-locked {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #7b6f91;
        }
      `}</style>
    </div>
  );
};
