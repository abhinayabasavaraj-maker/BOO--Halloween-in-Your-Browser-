// Persistent state storage for BOO! with versioning and validation

const STORAGE_KEY = 'BOO_HALLOWEEN_V1';

export const DEFAULT_STATE = {
  version: 1,
  settings: {
    soundEnabled: true,
    ambienceEnabled: false,
    volume: 0.7,
    reducedMotion: false
  },
  stats: {
    pumpkinPoints: 0,
    puzzlesSolved: 0,
    roomsExplored: 1,
    cluesFound: 0,
    bestTime: null,
    totalEscapes: 0
  },
  game: {
    currentRoom: 'foyer',
    visitedRooms: ['foyer'],
    discoveredClues: [],
    inventory: [],
    completedPuzzles: [],
    hintsUsed: 0,
    mistakes: 0,
    isEscaped: false,
    escapeTime: null,
    timerMode: 'relaxed', // 'relaxed' or 'countdown'
    timeRemaining: 600, // 10 minutes
    isTimerRunning: false,
    foyerDoorUnlocked: false,
    librarySecretUnlocked: false,
    vaultAltarUnlocked: false
  },
  decorator: {
    theme: 'pumpkin_night', // 'pumpkin_night', 'haunted_mansion', 'witching_hour'
    lighting: 'torchlight', // 'torchlight', 'moonlight', 'mystic_violet', 'shadow'
    fogLevel: 2, // 0 to 4
    items: {
      pumpkin_pedestal: 'jack_smile',
      floating_ghost: 'ghost_waving',
      wall_bat: 'bats_cluster',
      hearth_candle: 'candle_trio',
      spider_web: 'web_corner',
      mystic_portrait: 'portrait_witch',
      witch_plant: 'nightshade_glow',
      altar_skull: 'skull_golden'
    }
  },
  achievements: [],
  easterEggs: {
    clickedGhosts: [],
    foundSecretTome: false
  }
};

export const loadSavedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1) {
      console.warn("Storage version mismatch or invalid, resetting to default");
      return DEFAULT_STATE;
    }
    // Deep merge to ensure all defaults exist even if schema evolved
    return {
      version: 1,
      settings: { ...DEFAULT_STATE.settings, ...parsed.settings },
      stats: { ...DEFAULT_STATE.stats, ...parsed.stats },
      game: { ...DEFAULT_STATE.game, ...parsed.game },
      decorator: { ...DEFAULT_STATE.decorator, ...parsed.decorator },
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      easterEggs: { ...DEFAULT_STATE.easterEggs, ...parsed.easterEggs }
    };
  } catch (e) {
    console.error("Failed to load state from localStorage", e);
    return DEFAULT_STATE;
  }
};

export const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state to localStorage", e);
  }
};

export const clearSavedState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear localStorage", e);
  }
};
