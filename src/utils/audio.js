// Web Audio API Synthesizer for BOO! — completely self-contained, zero external asset dependencies

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.sfxGain = null;
    this.isMuted = false;
    this.ambientPlaying = false;
    this.ambientNodes = [];
    this.volume = 0.7;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);
    } catch (e) {
      console.warn("Web Audio not supported or blocked", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  // Play subtle UI click
  playClick() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Clue discovery / Item pickup sparkle
  playDiscovery() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.4);
    });
  }

  // Creaking iron door unlock sound
  playUnlock() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Low heavy thud
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(140, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.3);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(this.sfxGain);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Creak harmonic
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(220, now + 0.1);
    osc2.frequency.linearRampToValueAtTime(440, now + 0.35);
    osc2.frequency.linearRampToValueAtTime(320, now + 0.6);
    gain2.gain.setValueAtTime(0.01, now + 0.1);
    gain2.gain.linearRampToValueAtTime(0.18, now + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.6);
  }

  // Puzzle error / lock jam sound
  playError() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.setValueAtTime(90, now + 0.1);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Witch's rune chime (with custom note pitch 1 to 4)
  playRuneChime(index = 0) {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const frequencies = [329.63, 392.00, 493.88, 587.33]; // E4, G4, B4, D5 (mystic minor)
    const freq = frequencies[index % frequencies.length];
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  // Cauldron bubble effect
  playBubble() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(500 + Math.random() * 300, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Jack-o'-lantern giggle / playful warble
  playPumpkinGiggle() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const chirps = [350, 480, 400, 560, 440];
    chirps.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.06);
      gain.gain.setValueAtTime(0.18, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.07);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.08);
    });
  }

  // Grand victory fanfare
  playVictory() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const notes = [
      { f: 440.00, t: 0.0 }, // A4
      { f: 554.37, t: 0.15 }, // C#5
      { f: 659.25, t: 0.3 }, // E5
      { f: 880.00, t: 0.5 }, // A5
      { f: 1108.73, t: 0.8 } // C#6
    ];

    notes.forEach(({ f, t }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + t);

      gain.gain.setValueAtTime(0, now + t);
      gain.gain.linearRampToValueAtTime(0.25, now + t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + t);
      osc.stop(now + t + 0.85);
    });
  }

  // Ambient spooky wind & organ drone
  startAmbience() {
    this.init();
    this.resume();
    if (!this.ctx || this.ambientPlaying) return;

    try {
      this.ambientPlaying = true;
      const now = this.ctx.currentTime;

      // Filtered drone 1 (Low C organ pedal)
      const osc1 = this.ctx.createOscillator();
      const filter1 = this.ctx.createBiquadFilter();
      filter1.type = 'lowpass';
      filter1.frequency.setValueAtTime(180, now);

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(65.41, now); // C2

      const oscGain1 = this.ctx.createGain();
      oscGain1.gain.setValueAtTime(0.08, now);

      osc1.connect(filter1);
      filter1.connect(oscGain1);
      oscGain1.connect(this.ambientGain);
      osc1.start();
      this.ambientNodes.push(osc1, filter1, oscGain1);

      // Eerie Fifth (G2)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(98.00, now); // G2
      const oscGain2 = this.ctx.createGain();
      oscGain2.gain.setValueAtTime(0.06, now);

      osc2.connect(oscGain2);
      oscGain2.connect(this.ambientGain);
      osc2.start();
      this.ambientNodes.push(osc2, oscGain2);

      // LFO for slow breath-like pulsing
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.15, now); // Slow 0.15 Hz pulse
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.03, now);
      lfo.connect(lfoGain);
      lfoGain.connect(this.ambientGain.gain);
      lfo.start();
      this.ambientNodes.push(lfo, lfoGain);
    } catch (e) {
      console.warn("Could not start ambient sound", e);
    }
  }

  stopAmbience() {
    if (!this.ambientPlaying) return;
    this.ambientNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.ambientNodes = [];
    this.ambientPlaying = false;
  }

  toggleAmbience() {
    if (this.ambientPlaying) {
      this.stopAmbience();
      return false;
    } else {
      this.startAmbience();
      return true;
    }
  }
}

export const soundEngine = new SoundEngine();
