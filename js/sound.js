// 効果音（Web Audio でその場で合成するので音声ファイルは不要）
import { settings } from './store.js';

let ctx = null, master = null;

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
  }
  master.gain.value = settings().volume ?? 0.7;
  return ctx;
}

// iOS Safari はユーザー操作の中で一度鳴らさないと音が出ない
export function unlock() {
  const c = ac();
  if (!c) return;
  if (c.state === 'suspended') c.resume();
  const b = c.createBuffer(1, 1, 22050);
  const s = c.createBufferSource();
  s.buffer = b; s.connect(master); s.start(0);
}
['pointerdown', 'touchend', 'keydown'].forEach((ev) =>
  addEventListener(ev, function once() { unlock(); removeEventListener(ev, once, true); }, true));

const on = () => settings().sound && ac();

function tone(freq, start, dur, { type = 'sine', vol = 0.3, attack = 0.005, release, slideTo } = {}) {
  const c = ctx;
  const t0 = c.currentTime + start;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + (release ?? dur));
  o.connect(g).connect(master);
  o.start(t0);
  o.stop(t0 + (release ?? dur) + 0.05);
}

function noise(start, dur, { vol = 0.2, freq = 1200, q = 0.8, type = 'bandpass', sweepTo } = {}) {
  const c = ctx;
  const t0 = c.currentTime + start;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = c.createBufferSource();
  s.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = type; f.frequency.setValueAtTime(freq, t0); f.Q.value = q;
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  s.connect(f).connect(g).connect(master);
  s.start(t0);
}

function bell(freq, start, dur = 1.2, vol = 0.22) {
  tone(freq, start, dur, { type: 'sine', vol, release: dur });
  tone(freq * 2.01, start, dur * 0.6, { type: 'sine', vol: vol * 0.35, release: dur * 0.6 });
  tone(freq * 3.02, start, dur * 0.3, { type: 'sine', vol: vol * 0.12, release: dur * 0.3 });
}

const semi = (base, n) => base * Math.pow(2, n / 12);

export const sfx = {
  tap() { if (!on()) return; tone(1200, 0, 0.045, { type: 'triangle', vol: 0.07 }); },
  select() { if (!on()) return; tone(700, 0, 0.07, { type: 'triangle', vol: 0.11 }); tone(1050, 0.04, 0.08, { type: 'triangle', vol: 0.08 }); },
  pen() { if (!on()) return; noise(0, 0.04, { vol: 0.03, freq: 3600, q: 0.6 }); },
  // 正解：コンボが続くほど音程が上がる「キラリン」
  correct(combo = 0) {
    if (!on()) return;
    const up = Math.min(combo, 12);
    tone(semi(988, up), 0, 0.12, { type: 'square', vol: 0.05 });
    bell(semi(1319, up), 0.07, 0.6, 0.18);
    bell(semi(1976, up), 0.14, 0.8, 0.12);
  },
  wrong() {
    if (!on()) return;
    tone(311, 0, 0.16, { type: 'sawtooth', vol: 0.06, slideTo: 260 });
    tone(233, 0.14, 0.28, { type: 'sawtooth', vol: 0.06, slideTo: 180 });
  },
  combo(n) {
    if (!on()) return;
    [0, 4, 7, 12, 16].forEach((s, i) => tone(semi(784, s + Math.min(n, 20) / 5), i * 0.05, 0.2, { type: 'triangle', vol: 0.11 }));
  },
  // カードをめくる
  flip() { if (!on()) return; noise(0, 0.09, { vol: 0.12, freq: 2200, q: 0.9, sweepTo: 700 }); },
  // スワイプ
  swipe(dir = 1) {
    if (!on()) return;
    noise(0, 0.16, { vol: 0.13, freq: dir > 0 ? 900 : 2400, q: 1.2, sweepTo: dir > 0 ? 3000 : 600 });
    if (dir > 0) tone(1568, 0.03, 0.08, { type: 'sine', vol: 0.06 });
  },
  coin() { if (!on()) return; tone(1976, 0, 0.06, { type: 'square', vol: 0.05 }); tone(2637, 0.06, 0.25, { type: 'square', vol: 0.05 }); },
  pop() { if (!on()) return; tone(520, 0, 0.08, { type: 'sine', vol: 0.18, slideTo: 1100 }); },
  // 空港のアナウンス前のチャイム「ポーン・ポーン」
  chime() {
    if (!on()) return;
    bell(784, 0, 1.1, 0.16); bell(659, 0.42, 1.1, 0.16); bell(523, 0.84, 1.6, 0.16);
  },
  // 飛行機の離陸（ゴォーッ）
  takeoff() {
    if (!on()) return;
    noise(0, 1.4, { vol: 0.18, freq: 300, q: 0.4, type: 'lowpass', sweepTo: 2400 });
    tone(110, 0, 1.3, { type: 'sawtooth', vol: 0.03, slideTo: 330 });
  },
  micOn() { if (!on()) return; tone(880, 0, 0.08, { type: 'sine', vol: 0.12 }); tone(1320, 0.08, 0.12, { type: 'sine', vol: 0.12 }); },
  micOff() { if (!on()) return; tone(1320, 0, 0.08, { type: 'sine', vol: 0.1 }); tone(880, 0.08, 0.12, { type: 'sine', vol: 0.1 }); },
  // スタンプを押す
  stamp() {
    if (!on()) return;
    tone(150, 0, 0.18, { type: 'sine', vol: 0.5, slideTo: 60 });
    noise(0, 0.08, { vol: 0.25, freq: 700, q: 0.5 });
  },
  xp() { if (!on()) return; tone(1760, 0, 0.05, { type: 'sine', vol: 0.05 }); tone(2349, 0.05, 0.07, { type: 'sine', vol: 0.05 }); },
  levelup() {
    if (!on()) return;
    const seq = [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.3], [1319, 0.45], [1568, 0.6]];
    seq.forEach(([f, t]) => { tone(f, t, 0.3, { type: 'square', vol: 0.05 }); tone(f, t, 0.35, { type: 'triangle', vol: 0.13 }); });
    bell(2093, 0.75, 1.5, 0.14);
  },
  badge() {
    if (!on()) return;
    this.stamp();
    [0, 0.07, 0.14, 0.21].forEach((t, i) => bell(semi(1319, [0, 4, 7, 12][i]), 0.18 + t, 0.6, 0.09));
  },
  tick() { if (!on()) return; tone(1500, 0, 0.03, { type: 'square', vol: 0.03 }); },
  finish() {
    if (!on()) return;
    [[784, 0], [988, 0.1], [1175, 0.2], [1568, 0.34]].forEach(([f, t]) => bell(f, t, 0.9, 0.13));
  },
  pass() {
    if (!on()) return;
    const m = [[523, 0], [659, 0.15], [784, 0.3], [1047, 0.45], [784, 0.65], [1047, 0.8], [1319, 1.0]];
    m.forEach(([f, t]) => { tone(f, t, 0.3, { type: 'sawtooth', vol: 0.04 }); tone(f, t, 0.32, { type: 'triangle', vol: 0.12 }); tone(f / 2, t, 0.3, { type: 'sine', vol: 0.08 }); });
    bell(2093, 1.25, 2, 0.15);
  },
  fail() {
    if (!on()) return;
    [[392, 0], [349, 0.25], [330, 0.5], [262, 0.8]].forEach(([f, t]) => tone(f, t, 0.4, { type: 'triangle', vol: 0.12 }));
  },
};
