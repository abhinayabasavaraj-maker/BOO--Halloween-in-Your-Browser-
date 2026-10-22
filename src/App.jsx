import React, { useState, useEffect } from 'react';
import { GameProvider } from './context/GameContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { SpookyBackground } from './components/common/SpookyBackground';
import { VictoryModal } from './pages/VictoryModal';
import { LandingPage } from './pages/LandingPage';
import { EscapeGamePage } from './pages/EscapeGamePage';
import { RoomDecoratorPage } from './pages/RoomDecoratorPage';
import { RewardsPage } from './pages/RewardsPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('explore');

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'explore':
        return <LandingPage setTab={setCurrentTab} />;
      case 'escape':
        return <EscapeGamePage setTab={setCurrentTab} />;
      case 'decorator':
        return <RoomDecoratorPage />;
      case 'rewards':
        return <RewardsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <LandingPage setTab={setCurrentTab} />;
    }
  };

  return (
    <div className="app-shell">
      {/* Background layer */}
      <SpookyBackground />

      {/* Persistent Navigation Header */}
      <Header currentTab={currentTab} setTab={setCurrentTab} />

      {/* Main Screen Content */}
      <main className="main-content" id="main-content">
        {renderActiveScreen()}
      </main>

      {/* Persistent Footer */}
      <Footer setTab={setCurrentTab} />

      {/* Floating Notifications */}
      <ToastContainer />

      {/* Victory Celebration Modal */}
      <VictoryModal setTab={setCurrentTab} />

      <style>{`
        .app-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .main-content {
          flex: 1;
          position: relative;
          z-index: 10;
          padding-top: 24px;
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
