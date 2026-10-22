// Game data for BOO! — Rooms, inspectables, puzzles, items, clues, and achievements

export const ROOMS_DATA = {
  foyer: {
    id: 'foyer',
    name: 'The Forgotten Foyer',
    subtitle: 'Room 1: The Creaking Threshold',
    description: 'A grand entrance shrouded in cobwebs and cold whispers. The grandfather clock ticks out of time, and shadows dance around an iron-bolted oak door.',
    nextRoom: 'library',
    bgClass: 'room-foyer-bg',
    inspectables: [
      {
        id: 'foyer_clock',
        name: 'Grandfather Clock',
        icon: 'Clock',
        description: 'An imposing grandfather clock with stopped hands and a tarnished brass plaque. Something is carved beneath the glass.',
        actionLabel: 'Inspect Clock Plaque',
        puzzleId: 'riddle_clock'
      },
      {
        id: 'foyer_mat',
        name: 'Dusty Welcome Mat',
        icon: 'Footprints',
        description: 'A ragged mat reading "NEVER WELCOME". A corner of weathered parchment peeks out from underneath.',
        actionLabel: 'Lift Mat',
        clueFound: {
          id: 'clue_parchment_1',
          name: 'Torn Parchment (Left)',
          text: 'The Vault Cipher reveals: The 2nd guardian glyph is the 💀 SKULL of Sorrow.'
        },
        itemReward: {
          id: 'parchment_left',
          name: 'Torn Parchment (Left)',
          icon: 'Scroll',
          lore: 'A fragment of an ancient manuscript. It clearly points to the second symbol for the Master Vault.'
        }
      },
      {
        id: 'foyer_chandelier',
        name: 'Gargoyle Chandelier',
        icon: 'Sparkles',
        description: 'An iron chandelier adorned with stone gargoyles. A glint of metal catches your eye tangled in the cobwebs above.',
        actionLabel: 'Pull Chandelier Cord',
        itemReward: {
          id: 'rusty_key',
          name: 'Rusty Skeleton Key',
          icon: 'Key',
          lore: 'A heavy, cold iron key fashioned with bat wings. Fits the locked door of the Forgotten Foyer.'
        }
      },
      {
        id: 'foyer_door',
        name: 'Heavy Wrought-Iron Door',
        icon: 'DoorClosed',
        description: 'The reinforced oak and iron door leading deeper into the mansion. It is secured by a massive antique padlock.',
        actionLabel: 'Unlock with Rusty Key',
        requiresItem: 'rusty_key'
      }
    ]
  },

  library: {
    id: 'library',
    name: "The Witch's Library",
    subtitle: 'Room 2: The Chamber of Tomes',
    description: 'Towering shelves sag beneath leather-bound grimoires and glowing vials. A bubbling cauldron sends violet mist curling toward the timber ceiling.',
    nextRoom: 'vault',
    prevRoom: 'foyer',
    bgClass: 'room-library-bg',
    inspectables: [
      {
        id: 'library_grimoire',
        name: 'The Open Grimoire',
        icon: 'BookOpen',
        description: 'A heavy leather book resting on an eagle lectern. Illuminated runes glow faintly in crimson and gold.',
        actionLabel: 'Read the Formula',
        clueFound: {
          id: 'clue_rune_order',
          name: "Witch's Potion Sequence",
          text: 'The ritual sequence: First EMBER (Fire), then NIGHTSHADE (Herb), followed by MOON (Crescent), and finally BAT (Shadow).'
        }
      },
      {
        id: 'library_rune_altar',
        name: 'Mystic Rune Altar',
        icon: 'Flame',
        description: 'Four glowing crystal runes inlaid upon the mahogany table. They seem to react to touch with musical tones.',
        actionLabel: 'Attune the Runes',
        puzzleId: 'rune_sequence'
      },
      {
        id: 'library_globe',
        name: 'Astronomy Globe & Shelf',
        icon: 'Globe',
        description: 'A brass celestial globe surrounded by curious artifacts on the upper bookshelf.',
        actionLabel: 'Count Guardians',
        clueFound: {
          id: 'clue_bookcase_code',
          name: 'Guardian Counter Clue',
          text: 'Carved on the globe: "Count the guardians: Ravens on the rafters (3), Skulls on the high shelf (5), Candles lit on the desk (8)."'
        }
      },
      {
        id: 'library_lockbox',
        name: 'Secret Bookcase Lock',
        icon: 'Lock',
        description: 'A hidden compartment in the hollowed spines of three encyclopedias. A 3-digit brass dial lock blocks entry.',
        actionLabel: 'Enter 3-Digit Code',
        puzzleId: 'bookcase_combination'
      },
      {
        id: 'library_cauldron',
        name: 'Bubbling Cauldron',
        icon: 'Atom',
        description: 'An iron cauldron emitting sweet lavender smoke and soft popping bubbles.',
        actionLabel: 'Stir Cauldron'
      }
    ]
  },

  vault: {
    id: 'vault',
    name: 'The Pumpkin Vault',
    subtitle: 'Room 3: The Sanctuary of Midnight',
    description: 'The heart of the mansion. Stained glass beams cast golden amber light upon the Master Vault Door, flanked by two ancient carved pedestals.',
    prevRoom: 'library',
    bgClass: 'room-vault-bg',
    inspectables: [
      {
        id: 'vault_pedestal_crystal',
        name: 'Amethyst Pedestal (Left)',
        icon: 'Gem',
        description: 'A carved stone pedestal with a hexagonal indentation glowing with faint violet energy.',
        actionLabel: 'Insert Amethyst Crystal',
        requiresItem: 'amethyst_crystal'
      },
      {
        id: 'vault_pedestal_pumpkin',
        name: 'Pumpkin Pedestal (Right)',
        icon: 'Shield',
        description: 'A carved stone pillar with a circular crest slot awaiting a sacred talisman.',
        actionLabel: 'Insert Pumpkin Seal',
        requiresItem: 'pumpkin_seal'
      },
      {
        id: 'vault_wall_niche',
        name: 'Gargoyle Sconce',
        icon: 'Search',
        description: 'A stone gargoyle sconce mounted beside the stained glass window. Its mouth is slightly ajar.',
        actionLabel: 'Reach Inside Mouth',
        itemReward: {
          id: 'pumpkin_seal',
          name: 'Golden Pumpkin Seal',
          icon: 'Shield',
          lore: 'An intricately carved amber medal depicting a smiling Jack-o\'-lantern. Emits a warm internal pulse.'
        }
      },
      {
        id: 'vault_master_door',
        name: 'The Master Vault Portal',
        icon: 'ShieldAlert',
        description: 'The monumental brass vault door locked by four rotating celestial glyphs. Aligns the final escape mechanism.',
        actionLabel: 'Align Master Glyphs',
        puzzleId: 'master_vault'
      }
    ]
  }
};

export const PUZZLES_DATA = {
  riddle_clock: {
    id: 'riddle_clock',
    title: 'The Grandfather Riddle',
    room: 'foyer',
    instructions: 'A brass plaque is inscribed with a cryptic riddle. Type the answer to release the clockwork mechanism.',
    riddleText: '"I speak without a mouth and hear without ears.\nI have no body, but I come alive with wind.\nWhat am I?"',
    placeholder: 'Type your answer...',
    validAnswers: ['echo', 'an echo', 'the echo'],
    hint1: 'It lives in canyons, empty halls, and repeats your words back to you.',
    hint2: 'Think sound bouncing off stone walls... begins with E.',
    points: 100,
    rewardClue: {
      id: 'clue_clock_vault',
      name: 'Clockwork Inscription',
      text: 'Vault Symbol 1 is the 🎃 PUMPKIN of Midnight.'
    }
  },

  rune_sequence: {
    id: 'rune_sequence',
    title: "Witch's Rune Harmony",
    room: 'library',
    instructions: 'Touch the runes in the exact order recorded in the Open Grimoire to attune the alchemical matrix.',
    runes: [
      { id: 'ember', name: 'Ember', icon: 'Flame', color: '#FF8A2A', soundIdx: 0 },
      { id: 'nightshade', name: 'Nightshade', icon: 'Sprout', color: '#9CF2C1', soundIdx: 1 },
      { id: 'moon', name: 'Moon', icon: 'Moon', color: '#B99AE8', soundIdx: 2 },
      { id: 'bat', name: 'Bat', icon: 'Eye', color: '#FFC16C', soundIdx: 3 }
    ],
    correctSequence: ['ember', 'nightshade', 'moon', 'bat'],
    hint1: 'Check the Open Grimoire on the eagle lectern for the sacred formula.',
    hint2: 'The natural order is Fire (Ember) -> Herb (Nightshade) -> Moon -> Bat.',
    points: 150,
    rewardItem: {
      id: 'amethyst_crystal',
      name: "Witch's Amethyst Crystal",
      icon: 'Gem',
      lore: 'A pulsing purple gemstone radiating pure moonlight. Required for the Left Pedestal in the Vault.'
    }
  },

  bookcase_combination: {
    id: 'bookcase_combination',
    title: 'The Guardian Number Lock',
    room: 'library',
    instructions: 'Rotate each of the 3 tumblers to the correct digit according to the Astronomy Globe count.',
    correctDigits: [3, 5, 8],
    hint1: 'Examine the Astronomy Globe: count Ravens, Skulls, and lit Candles.',
    hint2: 'Ravens = 3, Skulls = 5, Candles = 8.',
    points: 150,
    rewardClue: {
      id: 'clue_parchment_2',
      name: 'Torn Parchment (Right)',
      text: 'Vault Symbol 3 is the 👻 GHOST of the Mist.'
    },
    rewardItem: {
      id: 'parchment_right',
      name: 'Torn Parchment (Right)',
      icon: 'FileText',
      lore: 'The matching piece of the torn map. Confirms the third symbol for the final escape portal.'
    }
  },

  master_vault: {
    id: 'master_vault',
    title: 'The Master Vault Glyphs',
    room: 'vault',
    instructions: 'Rotate the four dials until all four vault symbols match the collected clues from across the mansion.',
    glyphs: [
      { id: 'pumpkin', label: 'Pumpkin', emoji: '🎃' },
      { id: 'skull', label: 'Skull', emoji: '💀' },
      { id: 'ghost', label: 'Ghost', emoji: '👻' },
      { id: 'bat', label: 'Bat', emoji: '🦇' }
    ],
    correctCombination: ['pumpkin', 'skull', 'ghost', 'bat'],
    hint1: 'Review your collected clues: Grandfather Clock, Parchment Left, Parchment Right, and the Vault Inscription.',
    hint2: 'Symbol order: 1. Pumpkin, 2. Skull, 3. Ghost, 4. Bat.',
    points: 300
  }
};

export const ACHIEVEMENTS_LIST = [
  {
    id: 'first_clue',
    title: 'Curious Cat',
    description: 'Uncovered your first hidden clue inside the mansion.',
    icon: 'Search',
    points: 50
  },
  {
    id: 'foyer_unlocked',
    title: 'Master of Keys',
    description: 'Unlocked the heavy foyer door and entered the Witch\'s Library.',
    icon: 'Key',
    points: 100
  },
  {
    id: 'potion_master',
    title: 'Alchemical Adept',
    description: 'Solved the Witch\'s four-rune sequence in perfect harmony.',
    icon: 'Flame',
    points: 150
  },
  {
    id: 'secret_keeper',
    title: 'Secret Keeper',
    description: 'Cracked the 3-digit guardian bookcase combination lock.',
    icon: 'BookOpen',
    points: 150
  },
  {
    id: 'pedestals_lit',
    title: 'Altar Awakener',
    description: 'Placed both the Amethyst Crystal and Pumpkin Seal onto the pedestals.',
    icon: 'Sparkles',
    points: 200
  },
  {
    id: 'midnight_escape',
    title: 'Midnight Escape',
    description: 'Unlocked the Master Vault and successfully escaped the haunted house!',
    icon: 'Trophy',
    points: 500
  },
  {
    id: 'fearless_explorer',
    title: 'Fearless Explorer',
    description: 'Escaped the haunted mansion without using a single hint.',
    icon: 'Compass',
    points: 250
  },
  {
    id: 'spooky_stylist',
    title: 'Spooky Stylist',
    description: 'Decorated and customized your personal spooky room.',
    icon: 'Palette',
    points: 100
  },
  {
    id: 'ghost_whisperer',
    title: 'Ghost Whisperer',
    description: 'Discovered and clicked 3 hidden wandering spirits across the website.',
    icon: 'Ghost',
    points: 150
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Escaped the haunted house in under 5 minutes.',
    icon: 'Zap',
    points: 200
  }
];
