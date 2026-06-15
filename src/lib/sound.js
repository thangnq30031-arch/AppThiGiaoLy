import { getPublicUrl } from "../utils/publicPath";

class SoundSynth {
  constructor() {
    this.audio = {
      tick: null,
      drumroll: null,
      correct: null,
      claphand: null,
    };
    this.gain = 1.0;
  }

  init() {
    // Lazy-load audio elements from public/sound
    try {
      if (!this.audio.tick) {
        this.audio.tick = new Audio(getPublicUrl('sound', 'tick.mp3'));
        this.audio.tick.preload = 'auto';
        this.audio.tick.volume = 0.7;
      }
      if (!this.audio.drumroll) {
        this.audio.drumroll = new Audio(getPublicUrl('sound', 'drumroll.mp3'));
        this.audio.drumroll.preload = 'auto';
        this.audio.drumroll.volume = 0.9;
      }
      if (!this.audio.correct) {
        this.audio.correct = new Audio(getPublicUrl('sound', 'correct.mp3'));
        this.audio.correct.preload = 'auto';
        this.audio.correct.volume = 0.9;
      }
      if (!this.audio.claphand) {
        this.audio.claphand = new Audio(getPublicUrl('sound', 'claphand.mp3'));
        this.audio.claphand.preload = 'auto';
        this.audio.claphand.volume = 0.9;
      }
    } catch (e) {
      // ignore
    }
  }

  playTick() {
    this.init();
    try {
      // clone to allow overlapping plays if needed
      const a = this.audio.tick.cloneNode(true);
      a.volume = (this.gain * 0.7);
      a.play().catch(() => {});
    } catch (e) {
      // fallback: no-op
    }
  }

  playTimeUp() {
    this.init();
    try {
      const a = this.audio.drumroll.cloneNode(true);
      a.volume = (this.gain * 0.9);
      a.play().catch(() => {});
    } catch (e) {}
  }

  playReveal() {
    this.init();
    try {
      const a = this.audio.correct.cloneNode(true);
      a.volume = (this.gain * 0.9);
      a.play().catch(() => {});
    } catch (e) {}
  }

  playClapHand() {
    this.init();
    try {
      const a = this.audio.claphand.cloneNode(true);
      a.volume = (this.gain * 0.9);
      a.play().catch(() => {});
    } catch (e) {}
  }

  // keep previous synthesized star sound for celebration
  playStar() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);
        gain.gain.setValueAtTime(0.1, now + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.3);
      });
      // close context after a short delay
      setTimeout(() => ctx.close(), 1200);
    } catch (e) {}
  }
}

const sound = new SoundSynth();
export default sound;
