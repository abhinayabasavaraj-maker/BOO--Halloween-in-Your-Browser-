import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { loadSavedState, saveState, DEFAULT_STATE, clearSavedState } from '../utils/storage';
import { soundEngine } from '../utils/audio';
import { ACHIEVEMENTS_LIST, ROOMS_DATA } from '../data/gameData';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [state, setState] = useState(() => loadSavedState());
  const [toasts, setToasts] = useState([]);
  const [activeItemModal, setActiveItemModal] = useState(null);
  const [activePuzzleId, setActivePuzzleId] = useState(null);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const timerIntervalRef = useRef(null);

  // Synchronize reduced-motion with document body class
  useEffect(() => {
    if (state.settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [state.settings.reducedMotion]);

  // Save state on changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Audio settings sync
  useEffect(() => {
    soundEngine.setMuted(!state.settings.soundEnabled);
    soundEngine.setVolume(state.settings.volume);
    if (state.settings.ambienceEnabled && state.settings.soundEnabled) {
      soundEngine.startAmbience();
    } else {
      soundEngine.stopAmbience();
    }
  }, [state.settings.soundEnabled, state.settings.ambienceEnabled, state.settings.volume]);

  // Timer tick effect for countdown mode
  useEffect(() => {
    if (state.game.timerMode === 'countdown' && !state.game.isEscaped) {
      timerIntervalRef.current = setInterval(() => {
        setState(prev => {
          if (prev.game.timeRemaining <= 1) {
            clearInterval(timerIntervalRef.current);
            return {
              ...prev,
              game: {
                ...prev.game,
                timeRemaining: 0
              }
            };
          }
          return {
            ...prev,
            game: {
              ...prev.game,
              timeRemaining: prev.game.timeRemaining - 1
            }
          };
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [state.game.timerMode, state.game.isEscaped]);

  // Toast notification helper
  const addToast = useCallback((message, type = 'info', icon = '🎃') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type, icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Achievement unlocker
  const unlockAchievement = useCallback((achievementId) => {
    setState(prev => {
      if (prev.achievements.includes(achievementId)) return prev;

      const achievement = ACHIEVEMENTS_LIST.find(a => a.id === achievementId);
      if (!achievement) return prev;

      soundEngine.playDiscovery();
      addToast(`Achievement Unlocked: ${achievement.title}! (+${achievement.points} pts)`, 'achievement', '🏆');

      return {
        ...prev,
        stats: {
          ...prev.stats,
          pumpkinPoints: prev.stats.pumpkinPoints + achievement.points
        },
        achievements: [...prev.achievements, achievementId]
      };
    });
  }, [addToast]);

  // Audio toggles
  const toggleSound = useCallback(() => {
    setState(prev => {
      const nextSound = !prev.settings.soundEnabled;
      return {
        ...prev,
        settings: {
          ...prev.settings,
          soundEnabled: nextSound,
          ambienceEnabled: nextSound ? prev.settings.ambienceEnabled : false
        }
      };
    });
    soundEngine.playClick();
  }, []);

  const toggleAmbience = useCallback(() => {
    setState(prev => {
      const nextAmbience = !prev.settings.ambienceEnabled;
      return {
        ...prev,
        settings: {
          ...prev.settings,
          ambienceEnabled: nextAmbience
        }
      };
    });
    soundEngine.playClick();
  }, []);

  const setVolume = useCallback((val) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, volume: val }
    }));
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, reducedMotion: !prev.settings.reducedMotion }
    }));
  }, []);

  // Room navigation
  const setCurrentRoom = useCallback((roomId) => {
    soundEngine.playClick();
    setState(prev => {
      const visited = prev.game.visitedRooms.includes(roomId)
        ? prev.game.visitedRooms
        : [...prev.game.visitedRooms, roomId];

      return {
        ...prev,
        stats: {
          ...prev.stats,
          roomsExplored: visited.length
        },
        game: {
          ...prev.game,
          currentRoom: roomId,
          visitedRooms: visited
        }
      };
    });
  }, []);

  // Clue discovery
  const discoverClue = useCallback((clue) => {
    if (!clue) return;
    setState(prev => {
      const alreadyFound = prev.game.discoveredClues.some(c => c.id === clue.id);
      if (alreadyFound) return prev;

      soundEngine.playDiscovery();
      addToast(`New Clue Discovered: ${clue.name}!`, 'clue', '🔍');

      return {
        ...prev,
        stats: {
          ...prev.stats,
          pumpkinPoints: prev.stats.pumpkinPoints + 30,
          cluesFound: prev.stats.cluesFound + 1
        },
        game: {
          ...prev.game,
          discoveredClues: [...prev.game.discoveredClues, clue]
        }
      };
    });

    unlockAchievement('first_clue');
  }, [addToast, unlockAchievement]);

  // Inventory pickup
  const addInventoryItem = useCallback((item) => {
    if (!item) return;
    setState(prev => {
      const alreadyHave = prev.game.inventory.some(i => i.id === item.id);
      if (alreadyHave) return prev;

      soundEngine.playDiscovery();
      addToast(`Acquired: ${item.name}!`, 'item', '🎒');

      return {
        ...prev,
        stats: {
          ...prev.stats,
          pumpkinPoints: prev.stats.pumpkinPoints + 50
        },
        game: {
          ...prev.game,
          inventory: [...prev.game.inventory, item]
        }
      };
    });
  }, [addToast]);

  // Puzzle solve handler
  const solvePuzzle = useCallback((puzzleId, points = 100, rewardClue = null, rewardItem = null) => {
    setState(prev => {
      if (prev.game.completedPuzzles.includes(puzzleId)) return prev;

      soundEngine.playUnlock();
      addToast(`Puzzle Solved! (+${points} Pumpkin Points)`, 'success', '✨');

      let updatedGame = {
        ...prev.game,
        completedPuzzles: [...prev.game.completedPuzzles, puzzleId]
      };

      if (rewardClue && !updatedGame.discoveredClues.some(c => c.id === rewardClue.id)) {
        updatedGame.discoveredClues = [...updatedGame.discoveredClues, rewardClue];
      }

      if (rewardItem && !updatedGame.inventory.some(i => i.id === rewardItem.id)) {
        updatedGame.inventory = [...updatedGame.inventory, rewardItem];
      }

      // Check specific puzzle unlock states
      if (puzzleId === 'riddle_clock') {
        // Unlocked clockwork
      }
      if (puzzleId === 'rune_sequence') {
        // Alchemist solved
      }
      if (puzzleId === 'bookcase_combination') {
        updatedGame.librarySecretUnlocked = true;
      }

      return {
        ...prev,
        stats: {
          ...prev.stats,
          pumpkinPoints: prev.stats.pumpkinPoints + points,
          puzzlesSolved: prev.stats.puzzlesSolved + 1
        },
        game: updatedGame
      };
    });

    // Check achievements
    if (puzzleId === 'rune_sequence') unlockAchievement('potion_master');
    if (puzzleId === 'bookcase_combination') unlockAchievement('secret_keeper');
  }, [addToast, unlockAchievement]);

  // Unlock foyer door
  const unlockFoyerDoor = useCallback(() => {
    soundEngine.playUnlock();
    addToast('The iron foyer door creaks open!', 'success', '🗝️');
    setState(prev => ({
      ...prev,
      game: {
        ...prev.game,
        foyerDoorUnlocked: true
      }
    }));
    unlockAchievement('foyer_unlocked');
  }, [addToast, unlockAchievement]);

  // Place altar items
  const placeVaultItem = useCallback((slotKey) => {
    soundEngine.playUnlock();
    setState(prev => {
      const nextGame = { ...prev.game };
      if (slotKey === 'crystal') nextGame.vaultCrystalPlaced = true;
      if (slotKey === 'seal') nextGame.vaultSealPlaced = true;

      const bothLit = (slotKey === 'crystal' && prev.game.vaultSealPlaced) ||
                       (slotKey === 'seal' && prev.game.vaultCrystalPlaced);

      return {
        ...prev,
        game: nextGame
      };
    });
    addToast(`Altar pedestal activated with magical glow!`, 'success', '🌟');
  }, [addToast]);

  // Escape sequence
  const escapeGame = useCallback(() => {
    soundEngine.playVictory();
    const elapsedTime = 600 - state.game.timeRemaining;

    setState(prev => {
      const nextEscapes = prev.stats.totalEscapes + 1;
      const best = prev.stats.bestTime === null ? elapsedTime : Math.min(prev.stats.bestTime, elapsedTime);

      return {
        ...prev,
        stats: {
          ...prev.stats,
          pumpkinPoints: prev.stats.pumpkinPoints + 500,
          totalEscapes: nextEscapes,
          bestTime: best
        },
        game: {
          ...prev.game,
          isEscaped: true,
          escapeTime: elapsedTime
        }
      };
    });

    unlockAchievement('midnight_escape');

    if (state.game.hintsUsed === 0) {
      unlockAchievement('fearless_explorer');
    }

    if (elapsedTime <= 300) {
      unlockAchievement('speed_demon');
    }

    setIsVictoryModalOpen(true);
  }, [state.game.timeRemaining, state.game.hintsUsed, unlockAchievement]);

  // Hints and mistakes
  const recordMistake = useCallback(() => {
    soundEngine.playError();
    setState(prev => ({
      ...prev,
      game: { ...prev.game, mistakes: prev.game.mistakes + 1 }
    }));
  }, []);

  const recordHintUsed = useCallback(() => {
    soundEngine.playClick();
    setState(prev => ({
      ...prev,
      game: { ...prev.game, hintsUsed: prev.game.hintsUsed + 1 }
    }));
  }, []);

  // Timer settings
  const setTimerMode = useCallback((mode) => {
    setState(prev => ({
      ...prev,
      game: {
        ...prev.game,
        timerMode: mode,
        timeRemaining: mode === 'countdown' ? 600 : 0
      }
    }));
    soundEngine.playClick();
  }, []);

  // Decorator handlers
  const updateDecoratorTheme = useCallback((themeId) => {
    soundEngine.playClick();
    setState(prev => ({
      ...prev,
      decorator: { ...prev.decorator, theme: themeId }
    }));
  }, []);

  const updateLighting = useCallback((lightingId) => {
    soundEngine.playClick();
    setState(prev => ({
      ...prev,
      decorator: { ...prev.decorator, lighting: lightingId }
    }));
  }, []);

  const updateFogLevel = useCallback((level) => {
    setState(prev => ({
      ...prev,
      decorator: { ...prev.decorator, fogLevel: level }
    }));
  }, []);

  const updateDecorationItem = useCallback((slotId, optionId) => {
    soundEngine.playClick();
    setState(prev => ({
      ...prev,
      decorator: {
        ...prev.decorator,
        items: {
          ...prev.decorator.items,
          [slotId]: optionId
        }
      }
    }));
  }, []);

  const saveDecoratorDesign = useCallback(() => {
    soundEngine.playDiscovery();
    addToast('Spooky room layout saved successfully!', 'success', '🎨');
    unlockAchievement('spooky_stylist');
  }, [addToast, unlockAchievement]);

  const resetDecoratorDesign = useCallback(() => {
    soundEngine.playClick();
    setState(prev => ({
      ...prev,
      decorator: { ...DEFAULT_STATE.decorator }
    }));
    addToast('Room decorations reset to default.', 'info', '🧹');
  }, [addToast]);

  // Easter eggs (Clicking hidden ghosts)
  const clickEasterGhost = useCallback((ghostId) => {
    setState(prev => {
      if (prev.easterEggs.clickedGhosts.includes(ghostId)) {
        soundEngine.playPumpkinGiggle();
        return prev;
      }
      soundEngine.playPumpkinGiggle();
      const nextClicked = [...prev.easterEggs.clickedGhosts, ghostId];
      addToast(`You startled a hidden ghost! (${nextClicked.length}/3)`, 'info', '👻');

      return {
        ...prev,
        stats: {
          ...prev.stats,
          pumpkinPoints: prev.stats.pumpkinPoints + 25
        },
        easterEggs: {
          ...prev.easterEggs,
          clickedGhosts: nextClicked
        }
      };
    });

    setTimeout(() => {
      setState(curr => {
        if (curr.easterEggs.clickedGhosts.length >= 3) {
          unlockAchievement('ghost_whisperer');
        }
        return curr;
      });
    }, 500);
  }, [addToast, unlockAchievement]);

  // Reset entire game progress
  const resetEntireGame = useCallback(() => {
    soundEngine.playClick();
    clearSavedState();
    setState({ ...DEFAULT_STATE });
    addToast('All game progress, clues, and inventory have been reset.', 'info', '🔄');
  }, [addToast]);

  return (
    <GameContext.Provider
      value={{
        state,
        toasts,
        activeItemModal,
        setActiveItemModal,
        activePuzzleId,
        setActivePuzzleId,
        isVictoryModalOpen,
        setIsVictoryModalOpen,
        toggleSound,
        toggleAmbience,
        setVolume,
        toggleReducedMotion,
        setCurrentRoom,
        discoverClue,
        addInventoryItem,
        solvePuzzle,
        unlockFoyerDoor,
        placeVaultItem,
        escapeGame,
        recordMistake,
        recordHintUsed,
        setTimerMode,
        updateDecoratorTheme,
        updateLighting,
        updateFogLevel,
        updateDecorationItem,
        saveDecoratorDesign,
        resetDecoratorDesign,
        clickEasterGhost,
        resetEntireGame,
        unlockAchievement,
        addToast
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
