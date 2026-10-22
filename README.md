# BOO--Halloween-in-Your-Browser-
🎃 BOO! is a spooky escape room game built with React, JavaScript, Vite, and CSS. Explore a haunted mansion, solve puzzles, collect treasures, unlock the Pumpkin Vault, and earn achievements. Customize rooms with eerie themes, fog, and lighting. 👻 Dare to enter and escape before midnight!

# 🎃 BOO! — Halloween in Your Browser

> **"The night is yours to escape."**  
> An atmospheric, playable indie Halloween puzzle escape game, haunted mansion explorer, and spooky room decorator built entirely for the browser.

---

## 🌟 Project Overview

**BOO!** is a solo hackathon submission that brings a rich, story-driven Halloween universe directly into your browser. Trapped inside the mysterious **Midnight Manor** before the clock strikes twelve, the player must explore treacherous chambers, inspect antique oddities, solve arcane riddles, collect mystical relics in their inventory, and crack the master combination to the **Pumpkin Vault**.

Between perilous adventures, players can retreat to their **Spooky Room Sanctuary**, an interactive room customizer with live wallpaper themes, eerie lighting modes, fog sliders, and placeable Halloween curiosities.

---

## 🎮 Key Features

### 1. 🏰 The Three-Chamber Haunted House Escape Game
- **Room 1: The Forgotten Foyer**
  - Atmospheric gothic entrance with floorboard perspectives, creaking grandfather clock, gargoyle chandelier, dusty welcome mat, and an iron-bolted threshold.
  - **The Grandfather Riddle:** A poetic verse deciphering challenge with progressive whispers (Hint 1 & Hint 2).
  - Discover the **Torn Parchment (Left)** and the **Rusty Skeleton Key**.
- **Room 2: The Witch's Library**
  - Vaulted bookshelves sagging with leather-bound grimoires, glowing floating candles, an astronomy globe, and a bubbling lavender cauldron.
  - **Witch's Rune Harmony Puzzle:** 4 alchemical elemental runes (Ember, Nightshade, Moon, Bat) that play real synthesized musical notes in a harmonic sequence.
  - **The 3-Digit Guardian Combination Lock:** Brass rotary tumblers linked to clues on the astronomy globe (`3 - 5 - 8`), sliding open the secret passage.
  - Acquire the **Witch's Amethyst Crystal** and **Torn Parchment (Right)**.
- **Room 3: The Pumpkin Vault (Climax)**
  - Monumental altar room with gothic stained glass windows and two mystical stone pedestals.
  - Dual pedestal mechanics: Slot in the **Witch's Amethyst Crystal** and the **Golden Pumpkin Seal** to awaken the altar.
  - **The 4 Celestial Glyph Dials:** Rotate the four dials (`🎃 Pumpkin`, `💀 Skull`, `👻 Ghost`, `🦇 Bat`) synthesized from clues discovered across all three rooms.
  - Escape sequence triggering golden light, grand fanfare, and custom Halloween confetti celebration!

### 2. 🎒 Interactive Relic Inventory & Clue Journal
- Persistent floating bottom dock displaying gathered relics:
  - **Rusty Skeleton Key**
  - **Torn Parchment (Left Half)**
  - **Witch's Amethyst Crystal**
  - **Torn Parchment (Right Half)**
  - **Golden Pumpkin Seal**
- High-res inspection modal detailing the lore, origins, and purpose of every relic.
- Built-in **Clue Journal Drawer** summarizing every discovered clue for quick reference during puzzle solving.

### 3. 🎨 "My Spooky Room" Decorator Sandbox
- Full creative customization suite:
  - **3 Mansion Themes:** Pumpkin Night (warm timber glow), Haunted Mansion (Victorian moonlight), and Witching Hour (emerald mist).
  - **4 Dynamic Lighting Modes:** Warm Torchlight, Cold Moonlight, Eerie Amethyst, and Deep Crypt Shadow.
  - **Interactive Fog Slider:** Adjust volumetric mist density from 0 to 4.
  - **8 Decor Categories:** Glowing Jack-o'-lanterns, floating ghosts, bat swarms, candelabras, cobwebs, haunted portraits with watching eyes, alchemical plants, and altar skulls.
  - **Save & Share:** Room designs are automatically saved to `localStorage` and can be copied/shared.

### 4. 🏆 Hall of Hallows: Rewards & Achievements
- 10 unlockable trophies with custom badges, point rewards, and completion criteria:
  - *Curious Cat* (First clue discovered)
  - *Master of Keys* (Foyer door unlocked)
  - *Alchemical Adept* (4-rune harmony sequence completed)
  - *Secret Keeper* (Bookcase combination cracked)
  - *Altar Awakener* (Both vault pedestals energized)
  - *Midnight Escape* (The Great Escape finished)
  - *Fearless Explorer* (Escaped without using a single hint)
  - *Spooky Stylist* (Customized and saved your spooky room)
  - *Ghost Whisperer* (Found and clicked all 3 wandering spirits)
  - *Speed Demon* (Escaped in under 5 minutes)
- Live **Pumpkin Points** currency system with victory screen stat breakdown.

### 5. 🎵 Real-Time Web Audio Synthesizer
- **100% procedural Web Audio API** sound engine — **zero external audio file dependencies** (never fails to load, zero 404s, zero latency).
- Atmospheric midnight organ drone and eerie wind ambience with slow harmonic LFO breath.
- Rich sound effects:
  - Key rattles & heavy iron door creaks
  - Sparkling discovery chimes
  - Witch rune frequencies (E4, G4, B4, D5)
  - Cauldron bubbling liquids
  - Jack-o'-lantern giggles
  - Grand victory brass fanfare
- Global audio toggle, ambience toggle, and volume slider.

### 6. ♿ Accessibility & Micro-Interactions
- Full **Reduced Motion Mode** support (`prefers-reduced-motion` and user manual toggle).
- Comprehensive keyboard navigation support (`Tab`, `Enter`, `Escape`, `Arrow Keys`).
- High-contrast Halloween color palette:
  - Midnight: `#100B20`
  - Deep Purple: `#211333`
  - Pumpkin Orange: `#FF8A2A`
  - Golden Amber: `#FFC16C`
  - Ghost White: `#FFF5E9`
  - Mystical Lavender: `#B99AE8`
  - Success Mint: `#9CF2C1`
- Seamless responsiveness across desktop, tablet, and mobile screens.

---

## 🛠️ Technologies Actually Used

- **React 19** — Component architecture, state management, custom hooks, and context providers.
- **Vite 6** — Ultra-fast modern frontend development and optimized production bundling.
- **Web Audio API** — Real-time synthesized soundscapes, harmonic drones, and procedural audio effects.
- **Lucide React** — Crisp vector icons for UI controls and inventory items.
- **Canvas Confetti** — Custom celebratory fireworks particle burst for the victory escape sequence.
- **CSS3 & SVG** — Layered vector illustrations, glowing window filters, drifting fog, and keyframe animations.
- **Versioned `localStorage`** (`BOO_HALLOWEEN_V1`) — Deep persistence of room progress, clues, inventory, points, trophies, and room decorations.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js (v18 or higher recommended, tested on Node v26.10.0)
- npm (v9 or higher, tested on npm 11.19.1)

### 1. Installation
Clone or navigate to the repository directory and install dependencies:
```bash
cd boo-halloween
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000/
```

### 3. Build for Production
To create an optimized production build:
```bash
npm run build
```
The output files will be generated in the `dist/` directory.

### 4. Preview the Production Build
```bash
npm run preview
```

---

## 📜 Walkthrough & Demo Script

Follow this script to experience the full gameplay loop in under 3 minutes:

1. **Arrival & Opening:**
   - On the Landing Page, click the glowing Jack-o'-lantern mascot ("Spooky Jack") to hear his giggle and read his spooky wisdom.
   - Click the wandering spirit in the top header to discover Easter Egg 1/3!
   - Click **"ENTER THE HAUNTED HOUSE"** to begin your escape.
2. **Room 1: The Forgotten Foyer:**
   - Click the **Gargoyle Chandelier** hotspot to pull the cord — you obtain the **Rusty Skeleton Key**!
   - Click the **Dusty Welcome Mat** to reveal **Torn Parchment (Left)** (Vault Symbol 2: 💀 Skull).
   - Click the **Grandfather Clock** to open the riddle modal. Enter `echo` and click Unlock to decipher the first clue (Vault Symbol 1: 🎃 Pumpkin).
   - Click the **Heavy Wrought-Iron Door** (or use your Rusty Key) to unlock the door with an iron creak.
   - Click **"Advance to Next Room"** into The Witch's Library!
3. **Room 2: The Witch's Library:**
   - Click the **Open Grimoire** on the lectern to read the ritual formula.
   - Click the **Mystic Rune Altar** and touch the runes in sequence: **Ember ➔ Nightshade ➔ Moon ➔ Bat**. The runes chime musically and dispense the **Witch's Amethyst Crystal**!
   - Click the **Astronomy Globe** to read the guardian counts: 3 ravens, 5 skulls, 8 candles.
   - Click the **Secret Bookcase Lock** and set dials to `3 - 5 - 8`. Click **Test Tumblers** to slide the secret passage open and acquire **Torn Parchment (Right)** (Vault Symbol 3: 👻 Ghost)!
   - Click the bubbling cauldron for sweet lavender bubble sounds.
   - Click **"Advance to Next Room"** into The Pumpkin Vault!
4. **Room 3: The Pumpkin Vault (Escape!):**
   - Click the **Gargoyle Sconce** hotspot on the right wall to reach inside and grab the **Golden Pumpkin Seal**!
   - Click the **Amethyst Pedestal** on the left to place the crystal (glows violet).
   - Click the **Pumpkin Pedestal** on the right to place the golden seal (glows amber).
   - Click **The Master Vault Portal** to open the final glyph dial challenge.
   - Align the 4 dials: `🎃 Pumpkin`, `💀 Skull`, `👻 Ghost`, `🦇 Bat`.
   - Click **"Turn Master Vault Key"**!
   - Golden beams burst from the screen, fanfare plays, confetti fireworks erupt, and your victory stats are displayed!
5. **After Escape:**
   - Click **"Design Your Spooky Room"** to customize your personal Halloween haven, switch lighting moods, and save your setup.
   - Check the **Rewards** page to see your unlocked trophies and copy your score card to share!

---

## 📁 Project Structure

```
boo-halloween/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx           # Logo, nav, points badge, sound toggles, ghost egg
│   │   │   ├── Footer.jsx           # Credits, surprise me, reset progress, graveyard ghost
│   │   │   ├── SpookyBackground.jsx # Layered moon, stars, fog, and animated bats
│   │   │   └── Toast.jsx            # Dynamic toast alerts for clues, items, trophies
│   │   ├── inventory/
│   │   │   ├── InventoryTray.jsx    # Docked bottom pouch and clue journal drawer
│   │   │   └── ItemModal.jsx        # Relic inspection modal with high-res graphics & lore
│   │   └── puzzles/
│   │       ├── RiddlePuzzle.jsx     # Room 1 clock riddle with progressive hints
│   │       ├── RuneSequencePuzzle.jsx # Room 2 musical 4-rune sequence puzzle
│   │       ├── CombinationDialPuzzle.jsx # Room 2 3-digit rotary tumbler lock
│   │       └── MasterVaultPuzzle.jsx # Room 3 dual pedestals & 4-glyph vault alignment
│   ├── context/
│   │   └── GameContext.jsx          # Central state, audio triggers, timer, achievements
│   ├── data/
│   │   ├── gameData.js              # Room metadata, inspectables, puzzles, trophies
│   │   └── roomDecoratorData.js     # Decorator themes, lighting moods, 8 decor categories
│   ├── pages/
│   │   ├── LandingPage.jsx          # Moonlit manor SVG, countdown, mascot, how-to-play
│   │   ├── EscapeGamePage.jsx       # 3 illustrated room stages with interactive hotspots
│   │   ├── RoomDecoratorPage.jsx    # Real-time room decorator sandbox
│   │   ├── RewardsPage.jsx          # Trophies gallery and global player stats
│   │   ├── SettingsPage.jsx         # Audio synth controls, accessibility, storage reset
│   │   └── VictoryModal.jsx         # Confetti escape celebration & Web Share API
│   ├── styles/
│   │   ├── theme.css                # CSS variables, color scheme, keyframe animations
│   │   └── index.css                # Global resets, typography, buttons, glass cards
│   ├── utils/
│   │   ├── audio.js                 # Procedural Web Audio API sound synthesizer
│   │   └── storage.js               # Versioned localStorage serializer with schema safety
│   ├── App.jsx                      # App shell orchestrator
│   └── main.jsx                     # Vite/React entry point
├── index.html                       # HTML5 entry with Google Fonts & responsive meta tags
├── package.json                     # Dependencies & scripts
├── vite.config.js                   # Vite configuration
└── README.md                        # Documentation & submission guide
```

---
## Deployment Link: https://boo-halloween-in-your-browser.vercel.app 
## Youtube Video Link : https://youtu.be/GxNsyYmE_Q0

## ✅ Hackathon Submission Checklist

- [x] **Project Name:** BOO! — HALLOWEEN IN YOUR BROWSER
- [x] **Live Playable Product:** No placeholders, dead buttons, or TODO screens.
- [x] **Core Escape Game:** Complete 3-room progression with solvable puzzles and dual pedestal mechanics.
- [x] **Inventory & Clue Journal:** 5 unique quest relics with lore modals and a clue history log.
- [x] **Creative Sandbox:** Interactive "My Spooky Room" decorator with 3 themes, 4 lighting moods, and fog slider.
- [x] **Achievement & Reward System:** 10 trophies with tracking, points, and score sharing.
- [x] **Sound & Audio Engine:** 100% self-contained procedural Web Audio API synthesizer with zero external asset lag.
- [x] **Accessibility:** Reduced-motion mode, keyboard navigation, high-contrast palette, and screen reader-friendly attributes.
- [x] **Cross-Device Responsiveness:** Fully responsive on desktop, tablet, and mobile.
- [x] **Persistence:** Safe versioned storage (`BOO_HALLOWEEN_V1`) with full reset support.
- [x] **Production Build:** Passes `npm run build` cleanly with zero errors.

---

## 🔮 Future Enhancements
- Multiplayer co-op escape mode using WebRTC peer-to-peer connections.
- Community room gallery allowing players to browse and rate each other's spooky rooms.
- Additional rooms (The Crypt, The Clocktower, and The Secret Alchemist Garden).

---

*Happy Haunting! May you escape the manor before midnight strikes! 🎃👻*
