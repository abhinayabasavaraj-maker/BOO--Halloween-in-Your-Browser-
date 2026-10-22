import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { DECORATOR_THEMES, LIGHTING_MODES, DECORATION_CATEGORIES } from '../data/roomDecoratorData';
import { soundEngine } from '../utils/audio';
import { Palette, Sparkles, RotateCcw, Save, Share2, Sun, Moon, Cloud, Check } from 'lucide-react';

export const RoomDecoratorPage = () => {
  const {
    state,
    updateDecoratorTheme,
    updateLighting,
    updateFogLevel,
    updateDecorationItem,
    saveDecoratorDesign,
    resetDecoratorDesign,
    addToast
  } = useGame();

  const [activeCategory, setActiveCategory] = useState(DECORATION_CATEGORIES[0].id);
  const [copiedShare, setCopiedShare] = useState(false);

  const decorator = state.decorator;
  const currentTheme = DECORATOR_THEMES.find(t => t.id === decorator.theme) || DECORATOR_THEMES[0];
  const currentLighting = LIGHTING_MODES.find(l => l.id === decorator.lighting) || LIGHTING_MODES[0];

  const handleShareRoom = async () => {
    soundEngine.playClick();
    const shareText = `🎃 Check out my custom Spooky Room in BOO! Halloween in Your Browser! Theme: "${currentTheme.name}", Lighting: "${currentLighting.name}"!`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My BOO! Spooky Room',
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err) {}
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopiedShare(true);
      addToast('Room showpiece copied to clipboard!', 'success', '📋');
      setTimeout(() => setCopiedShare(false), 3000);
    } catch (e) {
      addToast('Could not copy to clipboard', 'info', '⚠️');
    }
  };

  return (
    <div className="decorator-page-root">
      <div className="container">
        {/* Page Header */}
        <div className="decorator-header">
          <div className="spooky-badge">
            <Palette size={16} />
            <span>CREATIVE SANCTUARY</span>
          </div>
          <h1 className="decorator-title">MY SPOOKY ROOM</h1>
          <p className="decorator-desc">
            Design your personal haunted chamber. Choose your wallpaper theme, bathe the room in eerie lighting, tune the fog, and place enchanted Halloween curiosities.
          </p>
        </div>

        {/* Theme and Lighting Selector Bar */}
        <div className="atmosphere-bar spooky-card">
          <div className="control-group">
            <label className="control-label">Mansion Theme:</label>
            <div className="theme-pills-row">
              {DECORATOR_THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => updateDecoratorTheme(theme.id)}
                  className={`theme-pill ${decorator.theme === theme.id ? 'active' : ''}`}
                >
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">Lighting Mood:</label>
            <div className="lighting-pills-row">
              {LIGHTING_MODES.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => updateLighting(mode.id)}
                  className={`lighting-pill ${decorator.lighting === mode.id ? 'active' : ''}`}
                >
                  <span>{mode.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="control-group fog-control-group">
            <label className="control-label">
              <Cloud size={14} /> Fog Density: Level {decorator.fogLevel}
            </label>
            <input
              type="range"
              min="0"
              max="4"
              value={decorator.fogLevel}
              onChange={e => updateFogLevel(Number(e.target.value))}
              className="fog-slider"
              aria-label="Adjust fog level"
            />
          </div>
        </div>

        {/* Main Work Area: Room Canvas + Decoration Picker */}
        <div className="decorator-main-grid">
          {/* Interactive Room Canvas */}
          <div className="room-canvas-wrapper spooky-card">
            <div
              className="room-canvas-interior"
              style={{
                background: currentTheme.bgGradient,
                filter: currentLighting.filter
              }}
            >
              {/* Lighting Color Wash Overlay */}
              <div
                className="lighting-color-wash"
                style={{ backgroundColor: currentLighting.color }}
              />

              {/* Fog Density Overlay */}
              {decorator.fogLevel > 0 && (
                <div
                  className="canvas-fog-layer"
                  style={{ opacity: decorator.fogLevel * 0.2 }}
                />
              )}

              {/* Gothic Arched Window */}
              <div className="canvas-window">
                <div className="window-moon" />
                <div className="window-mullions" />
              </div>

              {/* Wallpaper Wall & Flooring */}
              <div className="canvas-room-geometry">
                <div
                  className="canvas-backwall"
                  style={{ backgroundColor: currentTheme.wallColor }}
                />
                <div
                  className="canvas-floor"
                  style={{ backgroundColor: currentTheme.floorColor }}
                />
              </div>

              {/* Placed Interactive Decor Items */}

              {/* 1. Cobweb Corner */}
              {decorator.items.spider_web !== 'none' && (
                <div className="placed-item slot-web">
                  <span className="web-emoji">
                    {decorator.items.spider_web === 'web_spider' ? '🕸️🕷️' : '🕸️'}
                  </span>
                </div>
              )}

              {/* 2. Haunted Portrait */}
              {decorator.items.mystic_portrait !== 'none' && (
                <div className="placed-item slot-portrait">
                  <div className="portrait-frame">
                    <span className="portrait-face">
                      {decorator.items.mystic_portrait === 'portrait_witch' && '🧙‍♀️'}
                      {decorator.items.mystic_portrait === 'portrait_vampire' && '🧛'}
                      {decorator.items.mystic_portrait === 'portrait_gargoyle' && '🗿'}
                    </span>
                  </div>
                </div>
              )}

              {/* 3. Wall Bats */}
              {decorator.items.wall_bat !== 'none' && (
                <div className="placed-item slot-bats">
                  <span className="bats-swarm">
                    {decorator.items.wall_bat === 'bats_cluster' && '🦇 🦇 🦇'}
                    {decorator.items.wall_bat === 'bat_hanging' && '🌑 🦇'}
                    {decorator.items.wall_bat === 'bat_giant' && '🦅 🦇'}
                  </span>
                </div>
              )}

              {/* 4. Floating Ghost */}
              {decorator.items.floating_ghost !== 'none' && (
                <div className="placed-item slot-ghost animate-ghost">
                  <span className="ghost-avatar">
                    {decorator.items.floating_ghost === 'ghost_waving' && '👻'}
                    {decorator.items.floating_ghost === 'ghost_specter' && '🌫️👻'}
                    {decorator.items.floating_ghost === 'ghost_sheet' && '🧻'}
                  </span>
                </div>
              )}

              {/* 5. Jack-o'-Lantern on Pedestal */}
              {decorator.items.pumpkin_pedestal !== 'none' && (
                <div className="placed-item slot-pumpkin">
                  <div className="pumpkin-glow-halo" />
                  <span className="pumpkin-avatar">
                    {decorator.items.pumpkin_pedestal === 'jack_smile' && '🎃'}
                    {decorator.items.pumpkin_pedestal === 'jack_spooky' && '😈'}
                    {decorator.items.pumpkin_pedestal === 'jack_golden' && '👑🎃'}
                  </span>
                </div>
              )}

              {/* 6. Candle Candelabra */}
              {decorator.items.hearth_candle !== 'none' && (
                <div className="placed-item slot-candle">
                  <span className="candle-avatar">
                    {decorator.items.hearth_candle === 'candle_trio' && '🕯️🕯️'}
                    {decorator.items.hearth_candle === 'candle_skull' && '💀🕯️'}
                    {decorator.items.hearth_candle === 'candle_floating' && '✨🕯️✨'}
                  </span>
                </div>
              )}

              {/* 7. Altar Skull / Relic */}
              {decorator.items.altar_skull !== 'none' && (
                <div className="placed-item slot-skull">
                  <span className="skull-avatar">
                    {decorator.items.altar_skull === 'skull_golden' && '💀'}
                    {decorator.items.altar_skull === 'crystal_orb' && '🔮'}
                  </span>
                </div>
              )}

              {/* 8. Botanical Plant */}
              {decorator.items.witch_plant !== 'none' && (
                <div className="placed-item slot-plant">
                  <span className="plant-avatar">
                    {decorator.items.witch_plant === 'nightshade_glow' && '🌿✨'}
                    {decorator.items.witch_plant === 'mandragora' && '🪴'}
                  </span>
                </div>
              )}
            </div>

            {/* Room Bottom Action Bar */}
            <div className="room-canvas-footer">
              <button onClick={saveDecoratorDesign} className="btn-primary">
                <Save size={18} />
                <span>Save Room Layout</span>
              </button>

              <button onClick={handleShareRoom} className="btn-secondary">
                {copiedShare ? <Check size={18} /> : <Share2 size={18} />}
                <span>{copiedShare ? 'Copied Link!' : 'Share Room'}</span>
              </button>

              <button onClick={resetDecoratorDesign} className="btn-ghost">
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>

          {/* Decoration Categories & Picker Panel */}
          <div className="picker-panel spooky-card">
            <h3 className="picker-panel-title">Decorations</h3>

            {/* Category Tabs */}
            <div className="category-tabs-row">
              {DECORATION_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Active Category Options Grid */}
            {(() => {
              const category = DECORATION_CATEGORIES.find(c => c.id === activeCategory) || DECORATION_CATEGORIES[0];
              const currentVal = decorator.items[category.id];

              return (
                <div className="options-pod">
                  <span className="options-pod-header">Select style for {category.label}:</span>
                  <div className="options-grid">
                    {category.options.map(opt => {
                      const isSelected = currentVal === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => updateDecorationItem(category.id, opt.id)}
                          className={`option-tile ${isSelected ? 'selected' : ''}`}
                        >
                          <span className="tile-emoji">{opt.preview}</span>
                          <span className="tile-name">{opt.name}</span>
                          {isSelected && <span className="selected-dot" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      <style>{`
        .decorator-page-root {
          padding-bottom: 90px;
        }

        .decorator-header {
          margin-bottom: 24px;
        }

        .decorator-title {
          font-size: 2.4rem;
          color: var(--color-ghost);
          margin: 6px 0 8px;
        }

        .decorator-desc {
          color: #d1c5e4;
          font-size: 1.05rem;
          max-width: 680px;
          line-height: 1.5;
        }

        .atmosphere-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          padding: 20px 24px;
          margin-bottom: 28px;
          border-color: rgba(185, 154, 232, 0.25);
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .control-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-amber);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .theme-pills-row, .lighting-pills-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .theme-pill, .lighting-pill {
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          background: rgba(16, 11, 32, 0.7);
          border: 1px solid rgba(185, 154, 232, 0.2);
          color: var(--color-ghost);
          transition: all 0.2s;
        }

        .theme-pill:hover, .lighting-pill:hover {
          border-color: var(--color-amber);
          color: var(--color-amber);
        }

        .theme-pill.active {
          background: var(--color-pumpkin);
          color: var(--color-midnight);
          border-color: var(--color-pumpkin);
          box-shadow: 0 0 12px rgba(255, 138, 42, 0.4);
        }

        .lighting-pill.active {
          background: var(--color-lavender);
          color: var(--color-midnight);
          border-color: var(--color-lavender);
          box-shadow: 0 0 12px rgba(185, 154, 232, 0.4);
        }

        .fog-control-group {
          min-width: 170px;
        }

        .fog-slider {
          accent-color: var(--color-lavender);
          cursor: pointer;
        }

        .decorator-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 900px) {
          .decorator-main-grid {
            grid-template-columns: 1.4fr 0.9fr;
          }
        }

        .room-canvas-wrapper {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          border-color: rgba(255, 138, 42, 0.3);
        }

        .room-canvas-interior {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .lighting-color-wash {
          position: absolute;
          inset: 0;
          pointer-events: none;
          mix-blend-mode: overlay;
          transition: background-color 0.4s ease;
        }

        .canvas-fog-layer {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 80%, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .canvas-window {
          position: absolute;
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
          width: 110px;
          height: 150px;
          border-radius: 55px 55px 0 0;
          border: 4px solid #100b20;
          background: radial-gradient(circle at 60% 30%, #FFC16C 0%, #1a1638 70%);
          overflow: hidden;
          box-shadow: 0 0 25px rgba(255, 193, 108, 0.3);
        }

        .window-moon {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #FFF5E9;
          box-shadow: 0 0 14px #FFF5E9;
        }

        .window-mullions {
          position: absolute;
          inset: 0;
          border-left: 2px solid #100b20;
          border-right: 2px solid #100b20;
          margin: 0 35px;
        }

        .canvas-room-geometry {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 40%;
          pointer-events: none;
        }

        .canvas-floor {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: perspective(300px) rotateX(25deg);
          transform-origin: bottom center;
          border-top: 2px solid rgba(255, 255, 255, 0.05);
        }

        /* Placed Item Positioning */
        .placed-item {
          position: absolute;
          z-index: 10;
          user-select: none;
        }

        .slot-web { top: 0; right: 0; font-size: 2.5rem; }
        .slot-portrait { top: 15%; left: 12%; }
        .slot-bats { top: 8%; left: 35%; font-size: 1.3rem; }
        .slot-ghost { top: 30%; right: 18%; font-size: 2.8rem; }
        .slot-pumpkin { bottom: 12%; left: 38%; font-size: 3.2rem; }
        .slot-candle { bottom: 18%; left: 18%; font-size: 2.2rem; }
        .slot-skull { bottom: 15%; right: 34%; font-size: 2.2rem; }
        .slot-plant { bottom: 12%; right: 12%; font-size: 2.5rem; }

        .portrait-frame {
          border: 4px solid #FFC16C;
          border-radius: 6px;
          background: #140d24;
          padding: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
        }

        .portrait-face {
          font-size: 2rem;
          display: block;
        }

        .animate-ghost {
          animation: floatGhost 3.5s infinite ease-in-out;
        }

        .pumpkin-glow-halo {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 138, 42, 0.4) 0%, transparent 70%);
          animation: pulseGlow 3s infinite ease-in-out;
        }

        .room-canvas-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          flex-wrap: wrap;
        }

        .picker-panel {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .picker-panel-title {
          font-size: 1.3rem;
          color: var(--color-amber);
        }

        .category-tabs-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          border-bottom: 1px solid rgba(185, 154, 232, 0.15);
          padding-bottom: 14px;
        }

        .cat-tab {
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          color: #b5a8c9;
          background: rgba(16, 11, 32, 0.5);
          transition: all 0.2s;
        }

        .cat-tab:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
        }

        .cat-tab.active {
          color: var(--color-amber);
          background: rgba(255, 193, 108, 0.15);
          border: 1px solid rgba(255, 193, 108, 0.35);
        }

        .options-pod-header {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-lavender);
          margin-bottom: 10px;
          display: block;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .option-tile {
          position: relative;
          background: rgba(16, 11, 32, 0.7);
          border: 1px solid rgba(185, 154, 232, 0.2);
          border-radius: var(--radius-md);
          padding: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-align: center;
          transition: all 0.2s;
        }

        .option-tile:hover {
          border-color: var(--color-amber);
          transform: translateY(-2px);
        }

        .option-tile.selected {
          border-color: var(--color-pumpkin);
          background: rgba(45, 24, 70, 0.8);
          box-shadow: 0 0 16px rgba(255, 138, 42, 0.3);
        }

        .tile-emoji {
          font-size: 1.8rem;
          line-height: 1;
        }

        .tile-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: #eee;
        }

        .selected-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-pumpkin);
          box-shadow: 0 0 6px var(--color-pumpkin);
        }
      `}</style>
    </div>
  );
};
