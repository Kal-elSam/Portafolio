/* eslint-disable no-bitwise, no-param-reassign -- hot pixel and simulation loops mutate typed arrays and state in place, and the packed colour math needs integer bit ops */
// Short synthesised effects. Off until the visitor turns sound on; the
// AudioContext is created then, from a user gesture. No files, no music.

import type { WorldEvent } from './world';

type Wave = OscillatorType;

export class Sfx {
  private ctx: AudioContext | null = null;

  private master: GainNode | null = null;

  private noise: AudioBuffer | null = null;

  enabled = false;

  setEnabled(on: boolean): void {
    this.enabled = on;
    if (!on) return;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) {
        this.enabled = false;
        return;
      }
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.35;
      this.master.connect(this.ctx.destination);
      const len = Math.floor(this.ctx.sampleRate * 0.4);
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
    }
    this.ctx.resume().catch(() => undefined);
  }

  close(): void {
    if (this.ctx) this.ctx.close().catch(() => undefined);
    this.ctx = null;
    this.master = null;
  }

  private tone(
    freq: number,
    end: number,
    dur: number,
    type: Wave,
    gain: number,
    delay = 0
  ): void {
    const { ctx, master } = this;
    if (!ctx || !master) return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, end), t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private hiss(dur: number, gain: number, delay = 0): void {
    const { ctx, master, noise } = this;
    if (!ctx || !master || !noise) return;
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    src.buffer = noise;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    src.connect(g);
    g.connect(master);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  play(ev: WorldEvent): void {
    if (!this.enabled || !this.ctx) return;
    switch (ev) {
      case 'shoot':
        this.tone(900, 160, 0.1, 'square', 0.14);
        this.hiss(0.05, 0.1);
        break;
      case 'dry':
        this.tone(130, 100, 0.04, 'triangle', 0.16);
        break;
      case 'hit':
        this.tone(320, 210, 0.06, 'square', 0.1);
        break;
      case 'kill':
        this.tone(420, 55, 0.28, 'sawtooth', 0.14);
        this.hiss(0.18, 0.12);
        break;
      case 'hurt':
        this.tone(120, 55, 0.22, 'sine', 0.3);
        this.hiss(0.1, 0.1);
        break;
      case 'hotfix':
        this.tone(660, 660, 0.07, 'triangle', 0.14);
        this.tone(990, 990, 0.12, 'triangle', 0.14, 0.07);
        break;
      case 'patch':
        this.tone(520, 520, 0.06, 'square', 0.08);
        this.tone(780, 780, 0.1, 'square', 0.08, 0.06);
        break;
      case 'cleared':
        [440, 554, 660].forEach((f, i) =>
          this.tone(f, f, 0.14, 'triangle', 0.16, i * 0.1)
        );
        break;
      case 'won':
        [523, 659, 784, 1047].forEach((f, i) =>
          this.tone(f, f, 0.2, 'triangle', 0.18, i * 0.12)
        );
        break;
      case 'lost':
        [330, 262, 196, 147].forEach((f, i) =>
          this.tone(f, f * 0.9, 0.3, 'sawtooth', 0.14, i * 0.2)
        );
        break;
      default:
    }
  }
}
