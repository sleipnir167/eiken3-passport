// 手書きパッド（Apple Pencil の筆圧対応・パームリジェクション付き）
//  座標は w×h の単位系で保存する（表示サイズが変わっても同じ座標）
import { settings } from './store.js';

let penSeen = false; // 一度でもペンが使われたら指の入力は無視する（手のひら対策）

// 英語ノートの4線（上から：上の線・x-height の点線・ベースライン・下の線）
export const LINES4 = [0.17, 0.39, 0.61, 0.83];

export class Pad {
  /**
   * @param {object} o
   *  w, h: 座標系の大きさ / guide: '4line' | 'ruled' | 'none' / rows: ruled のときの行数
   *  pen: 線の太さ（座標系の単位）
   */
  constructor({ w = 200, h = 300, guide = '4line', rows = 1, pen = null, onChange = null, onStrokeEnd = null, onStrokeStart = null, cls = '' } = {}) {
    this.w = w; this.h = h;
    this.guide = guide;
    this.rows = rows;
    this.pen = pen ?? Math.min(w, h / rows) * 0.045;
    this.strokes = [];
    this.onChange = onChange;
    this.onStrokeEnd = onStrokeEnd;
    this.onStrokeStart = onStrokeStart;
    this.locked = false;
    this.el = document.createElement('div');
    this.el.className = `pad ${cls}`;
    this.el.style.aspectRatio = `${w} / ${h}`;
    this.el.innerHTML = `${this.guideSVG()}<canvas></canvas>`;
    this.canvas = this.el.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.bind();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.el);
  }

  guideSVG() {
    const { w, h } = this;
    let lines = '';
    if (this.guide === '4line') {
      const [a, b, c, d] = LINES4.map((r) => r * h);
      lines = `<line x1="0" x2="${w}" y1="${a}" y2="${a}" class="g-top"/>
        <line x1="0" x2="${w}" y1="${b}" y2="${b}" class="g-mid"/>
        <line x1="0" x2="${w}" y1="${c}" y2="${c}" class="g-base"/>
        <line x1="0" x2="${w}" y1="${d}" y2="${d}" class="g-bot"/>`;
    } else if (this.guide === 'ruled') {
      const rh = h / this.rows;
      for (let i = 0; i < this.rows; i++) {
        const top = i * rh;
        const [a, b, c, d] = LINES4.map((r) => top + r * rh);
        lines += `<line x1="0" x2="${w}" y1="${a}" y2="${a}" class="g-top"/>
          <line x1="0" x2="${w}" y1="${b}" y2="${b}" class="g-mid"/>
          <line x1="0" x2="${w}" y1="${c}" y2="${c}" class="g-base"/>
          <line x1="0" x2="${w}" y1="${d}" y2="${d}" class="g-bot"/>`;
      }
    }
    return `<svg class="pad-guide" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>`;
  }

  resize() {
    const r0 = this.el.getBoundingClientRect();
    if (!r0.width) return;
    // aspect-ratio 未対応の古い Safari では高さを自分で決める
    if (!r0.height || !window.CSS?.supports?.('aspect-ratio: 1')) this.el.style.height = `${(r0.width * this.h) / this.w}px`;
    const r = this.el.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 3);
    this.px = r.width;
    this.canvas.width = r.width * dpr;
    this.canvas.height = r.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.redraw();
  }

  bind() {
    const c = this.canvas;
    let active = null;
    let last = 0;
    const pos = (e) => {
      const r = c.getBoundingClientRect();
      return [(e.clientX - r.left) * (this.w / r.width), (e.clientY - r.top) * (this.h / r.height), Math.round(e.timeStamp)];
    };
    const width = (e, p, prev) => {
      const base = this.pen;
      if (e.pointerType === 'pen' && e.pressure > 0) return base * (0.6 + e.pressure * 0.8);
      if (!prev) return base * 1.05;
      const dt = Math.max(1, p[2] - prev[2]);
      const v = Math.hypot(p[0] - prev[0], p[1] - prev[1]) / dt / (this.w / 300);
      return base * Math.max(0.7, Math.min(1.2, 1.25 - v * 0.8));
    };
    const allowed = (e) => {
      if (this.locked) return false;
      if (e.pointerType === 'pen') penSeen = true;
      const st = settings();
      if (e.pointerType === 'touch' && (st.pencilOnly || (st.autoPalm && penSeen))) return false;
      return e.isPrimary !== false || e.pointerType === 'pen';
    };
    c.addEventListener('pointerdown', (e) => {
      if (active !== null || !allowed(e)) return;
      e.preventDefault();
      active = e.pointerId;
      try { c.setPointerCapture(e.pointerId); } catch { /* 合成イベントなど */ }
      this.onStrokeStart?.(this);
      const p = pos(e);
      p.push(width(e, p, null));
      this.strokes.push([p]);
      this.el.classList.add('has-ink');
      this.drawDot(p);
      last = p[2];
    });
    c.addEventListener('pointermove', (e) => {
      if (e.pointerId !== active) return;
      e.preventDefault();
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      const s = this.strokes[this.strokes.length - 1];
      for (const ev of evs.length ? evs : [e]) {
        const prev = s[s.length - 1];
        const p = pos(ev);
        if (Math.hypot(p[0] - prev[0], p[1] - prev[1]) < this.w / 400) continue;
        const w = width(ev, p, prev);
        p.push(prev[3] * 0.6 + w * 0.4);
        s.push(p);
        this.drawSeg(prev, p, s.length > 2 ? s[s.length - 3] : null);
        last = p[2];
      }
    });
    const end = (e) => {
      if (e.pointerId !== active) return;
      active = null;
      const s = this.strokes[this.strokes.length - 1];
      if (s && s.length === 1) { const p = s[0]; s.push([p[0] + 0.3, p[1] + 0.3, last + 1, p[3]]); }
      this.onStrokeEnd?.(this);
      this.onChange?.(this);
    };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
    // iOS の拡大鏡・スクロール・長押しメニューを防ぐ
    c.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    c.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  inkColor() { return getComputedStyle(this.el).getPropertyValue('--pad-ink').trim() || '#1b2340'; }
  k() { return (this.px || this.w) / this.w; }

  drawDot(p) {
    const k = this.k();
    this.ctx.fillStyle = this.inkColor();
    this.ctx.beginPath();
    this.ctx.arc(p[0] * k, p[1] * k, (p[3] * k) / 2, 0, Math.PI * 2);
    this.ctx.fill();
  }
  drawSeg(a, b, before) {
    const k = this.k();
    const ctx = this.ctx;
    ctx.strokeStyle = this.inkColor();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = ((a[3] + b[3]) / 2) * k;
    ctx.beginPath();
    if (before) {
      const m1 = [(before[0] + a[0]) / 2, (before[1] + a[1]) / 2];
      const m2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      ctx.moveTo(m1[0] * k, m1[1] * k);
      ctx.quadraticCurveTo(a[0] * k, a[1] * k, m2[0] * k, m2[1] * k);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(m2[0] * k, m2[1] * k);
    } else {
      ctx.moveTo(a[0] * k, a[1] * k);
    }
    ctx.lineTo(b[0] * k, b[1] * k);
    ctx.stroke();
  }
  redraw() {
    this.el.classList.toggle('has-ink', this.strokes.length > 0);
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();
    for (const s of this.strokes) {
      this.drawDot(s[0]);
      for (let i = 1; i < s.length; i++) this.drawSeg(s[i - 1], s[i], i > 1 ? s[i - 2] : null);
    }
  }

  clear() { if (this.locked) return; this.strokes = []; this.redraw(); this.onChange?.(this); }
  undo() { if (this.locked) return; this.strokes.pop(); this.redraw(); this.onChange?.(this); }
  isEmpty() { return this.strokes.length === 0; }
  getStrokes() { return this.strokes.map((s) => s.map((p) => [p[0], p[1], p[2]])); }
  setStrokes(strokes) {
    this.strokes = (strokes || []).map((s) => s.map((p) => [p[0], p[1], p[2], p[3] ?? this.pen]));
    this.redraw();
  }
  lock(v = true) { this.locked = v; this.el.classList.toggle('locked', v); }
  destroy() { this.ro.disconnect(); }
}

/** ストロークを SVG に（見直し用） */
export function strokesToSVG(strokes, w, h, cls = 'ink-thumb') {
  const paths = (strokes || []).map((s) => (s.length ? `<path d="M${s.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L')}"/>` : '')).join('');
  return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${paths}</svg>`;
}
