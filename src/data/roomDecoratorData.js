// Data for Spooky Room Decorator

export const DECORATOR_THEMES = [
  {
    id: 'pumpkin_night',
    name: 'Pumpkin Night',
    description: 'A cozy autumnal glow with floating jack-o\'-lantern embers and warm timber beams.',
    bgGradient: 'radial-gradient(circle at 50% 30%, #3a1a08 0%, #200f07 50%, #0d0604 100%)',
    wallColor: '#2b160b',
    accentColor: '#FF8A2A',
    floorColor: '#1c0c05'
  },
  {
    id: 'haunted_mansion',
    name: 'Haunted Mansion',
    description: 'Chilling midnight Victorian parlor with moonlight streaming through arched gothic windows.',
    bgGradient: 'radial-gradient(circle at 50% 30%, #151a36 0%, #0f1226 50%, #080914 100%)',
    wallColor: '#121630',
    accentColor: '#B99AE8',
    floorColor: '#090a18'
  },
  {
    id: 'witching_hour',
    name: 'Witching Hour',
    description: 'Mystical emerald and amethyst vapors curling around ancient apothecary shelves.',
    bgGradient: 'radial-gradient(circle at 50% 30%, #102920 0%, #0b1a15 50%, #050d0a 100%)',
    wallColor: '#0b241c',
    accentColor: '#9CF2C1',
    floorColor: '#04120e'
  }
];

export const LIGHTING_MODES = [
  { id: 'torchlight', name: 'Warm Torchlight', color: 'rgba(255, 138, 42, 0.25)', filter: 'sepia(0.2) saturate(1.3)' },
  { id: 'moonlight', name: 'Cold Moonlight', color: 'rgba(185, 154, 232, 0.25)', filter: 'hue-rotate(200deg) contrast(1.1)' },
  { id: 'mystic_violet', name: 'Eerie Amethyst', color: 'rgba(156, 100, 255, 0.3)', filter: 'hue-rotate(260deg) saturate(1.4)' },
  { id: 'shadow', name: 'Deep Crypt Shadow', color: 'rgba(0, 0, 0, 0.6)', filter: 'brightness(0.7) contrast(1.2)' }
];

export const DECORATION_CATEGORIES = [
  {
    id: 'pumpkin_pedestal',
    label: 'Jack-o\'-Lantern',
    options: [
      { id: 'none', name: 'None', preview: '🚫' },
      { id: 'jack_smile', name: 'Cheerful Grin', preview: '🎃' },
      { id: 'jack_spooky', name: 'Ghoulish Snarl', preview: '😈' },
      { id: 'jack_golden', name: 'Golden Sovereign', preview: '👑' }
    ]
  },
  {
    id: 'floating_ghost',
    label: 'Spirit Companion',
    options: [
      { id: 'none', name: 'None', preview: '🚫' },
      { id: 'ghost_waving', name: 'Friendly Boo', preview: '👻' },
      { id: 'ghost_specter', name: 'Hovering Wraith', preview: '🌫️' },
      { id: 'ghost_sheet', name: 'Sheet Ghost', preview: '🧻' }
    ]
  },
  {
    id: 'wall_bat',
    label: 'Bat Colony',
    options: [
      { id: 'none', name: 'None', preview: '🚫' },
      { id: 'bats_cluster', name: 'Swarming Bats', preview: '🦇' },
      { id: 'bat_hanging', name: 'Roosting Vampire Bat', preview: '🌑' },
      { id: 'bat_giant', name: 'Shadow Wings', preview: '🦅' }
    ]
  },
  {
    id: 'hearth_candle',
    label: 'Candlelight',
    options: [
      { id: 'none', name: 'None', preview: '🚫' },
      { id: 'candle_trio', name: 'Dripping Candelabra', preview: '🕯️' },
      { id: 'candle_skull', name: 'Skull Torch', preview: '💀' },
      { id: 'candle_floating', name: 'Floating Tapers', preview: '✨' }
    ]
  },
  {
    id: 'spider_web',
    label: 'Cobwebs',
    options: [
      { id: 'none', name: 'None', preview: '🚫' },
      { id: 'web_corner', name: 'Dusty Corner Web', preview: '🕸️' },
      { id: 'web_spider', name: 'Venomous Weaver', preview: '🕷️' }
    ]
  },
  {
    id: 'mystic_portrait',
    label: 'Haunted Portrait',
    options: [
      { id: 'none', name: 'None', preview: '🚫' },
      { id: 'portrait_witch', name: 'The Watching Witch', preview: '🧙‍♀️' },
      { id: 'portrait_vampire', name: 'Count of Whispers', preview: '🧛' },
      { id: 'portrait_gargoyle', name: 'Stone Sentinel', preview: '🗿' }
    ]
  },
  {
    id: 'witch_plant',
    label: 'Botanical Herb',
    options: [
      { id: 'none', name: 'None', preview: '🚫' },
      { id: 'nightshade_glow', name: 'Bioluminescent Nightshade', preview: '🌿' },
      { id: 'mandragora', name: 'Screaming Mandrake Pot', preview: '🪴' }
    ]
  },
  {
    id: 'altar_skull',
    label: 'Altar Relic',
    options: [
      { id: 'none', name: 'None', preview: '🚫' },
      { id: 'skull_golden', name: 'Gilded Cranium', preview: '💀' },
      { id: 'crystal_orb', name: 'Seer\'s Scrying Orb', preview: '🔮' }
    ]
  }
];
