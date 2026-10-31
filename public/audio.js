// Web Audio API Synthesizer for Ghost in the Machine
// 100% self-contained procedural audio generation without external sound files

class SpectralAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.droneGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.droneLfo = null;
    this.droneFilter = null;
    this.isDronePlaying = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.droneGain && this.ctx) {
      this.droneGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // Toggle ambient dark drone
  toggleAmbientDrone(enable) {
    this.ensureContext();
    if (!this.ctx) return;

    if (enable && !this.isDronePlaying) {
      try {
        const now = this.ctx.currentTime;
        this.droneFilter = this.ctx.createBiquadFilter();
        this.droneFilter.type = 'lowpass';
        this.droneFilter.frequency.setValueAtTime(140, now);

        this.droneGain = this.ctx.createGain();
        this.droneGain.gain.setValueAtTime(0.001, now);
        this.droneGain.gain.exponentialRampToValueAtTime(this.isMuted ? 0.001 : 0.08, now + 3);

        // Sub oscillator (55Hz - A1)
        this.droneOsc1 = this.ctx.createOscillator();
        this.droneOsc1.type = 'sawtooth';
        this.droneOsc1.frequency.setValueAtTime(55, now);

        // Detuned harmonic oscillator (82.4Hz - E2)
        this.droneOsc2 = this.ctx.createOscillator();
        this.droneOsc2.type = 'triangle';
        this.droneOsc2.frequency.setValueAtTime(82.4, now);

        // Slow LFO for filter breath
        this.droneLfo = this.ctx.createOscillator();
        this.droneLfo.type = 'sine';
        this.droneLfo.frequency.setValueAtTime(0.12, now);

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(45, now);

        this.droneLfo.connect(lfoGain);
        lfoGain.connect(this.droneFilter.frequency);

        this.droneOsc1.connect(this.droneFilter);
        this.droneOsc2.connect(this.droneFilter);
        this.droneFilter.connect(this.droneGain);
        this.droneGain.connect(this.ctx.destination);

        this.droneOsc1.start();
        this.droneOsc2.start();
        this.droneLfo.start();
        this.isDronePlaying = true;
      } catch (e) {
        console.warn('Audio drone error', e);
      }
    } else if (!enable && this.isDronePlaying) {
      if (this.droneGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
        setTimeout(() => {
          try {
            if (this.droneOsc1) this.droneOsc1.stop();
            if (this.droneOsc2) this.droneOsc2.stop();
            if (this.droneLfo) this.droneLfo.stop();
          } catch (e) {}
          this.isDronePlaying = false;
        }, 1600);
      }
    }
  }

  // Mechanical terminal keystroke click
  playKeyClick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // High click sound with quick decay
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800 + (Math.random() * 400 - 200), now);
      filter.Q.setValueAtTime(4, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + Math.random() * 60, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.04);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // Ghost whisper glitch burst
  playGhostGlitch() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.4);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.1);
      osc.frequency.linearRampToValueAtTime(440, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.45);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  // Warm chime for ofrenda candles & marigold blessings
  playOfrendaChime() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const frequencies = [528, 660, 792, 1056]; // Harmonics in sacred tuning

      frequencies.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.001, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), now + idx * 0.06 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 2.0);
      });
    } catch (e) {}
  }
}

export const soundEngine = new SpectralAudioEngine();
