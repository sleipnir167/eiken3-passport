// つづりの手書き入力（1マス1字・1行・キーボード）と正誤判定
import { Pad } from './pad.js';
import { recognizeBoxes, recognizeLine, judgeChar, displayChar, STRICTNESS } from './recognizer.js';
import { settings } from './store.js';
import { esc } from './ui.js';
import { sfx } from './sound.js';

const BOX_W = 200, BOX_H = 300;
const isLetter = (c) => /[a-zA-Z]/.test(c);
export const normAnswer = (s) => String(s || '').toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, ' ').trim();

export class SpellInput {
  /**
   * answer: 正解のつづり / mode: box | line | keyboard（省略時は設定）
   */
  constructor({ answer, mode, onInput = null }) {
    const st = settings();
    this.answer = answer;
    this.onInput = onInput;
    this.mode = mode || st.spellMode;
    if (this.mode === 'box' && !st.lengthHint) this.mode = 'line';
    this.el = document.createElement('div');
    this.el.className = `spell spell-${this.mode}`;
    this.boxes = [];
    this.timers = new Map();
    if (this.mode === 'box') this.buildBoxes();
    else if (this.mode === 'line') this.buildLine();
    else this.buildKeyboard();
  }

  buildBoxes() {
    const chars = [...this.answer];
    const row = document.createElement('div');
    row.className = 'spell-row';
    row.style.setProperty('--n', chars.filter(isLetter).length);
    chars.forEach((ch, i) => {
      if (!isLetter(ch)) {
        const fixed = document.createElement('div');
        fixed.className = ch === ' ' ? 'spell-gap' : 'spell-fixed';
        fixed.textContent = ch === ' ' ? '' : ch;
        row.appendChild(fixed);
        return;
      }
      const cell = document.createElement('div');
      cell.className = 'lbox';
      const pad = new Pad({
        w: BOX_W, h: BOX_H, guide: '4line', cls: 'pad-letter',
        onStrokeStart: () => { this.cancelRecog(box); cell.classList.remove('read'); },
        onStrokeEnd: () => { sfx.pen(); this.scheduleRecog(box); this.onInput?.(); },
        onChange: (p) => { if (p.isEmpty()) { box.cands = []; this.showRead(box); } },
      });
      const box = { i, ch, pad, cell, cands: [], pending: null };
      cell.appendChild(pad.el);
      cell.insertAdjacentHTML('beforeend', '<span class="lbox-read"></span><button type="button" class="lbox-clear" aria-label="このマスを消す">×</button><span class="lbox-ans"></span>');
      cell.querySelector('.lbox-clear').addEventListener('click', (e) => { e.stopPropagation(); pad.clear(); sfx.tap(); });
      row.appendChild(cell);
      this.boxes.push(box);
    });
    this.el.appendChild(row);
  }

  buildLine() {
    this.pad = new Pad({ w: 1000, h: 300, guide: '4line', cls: 'pad-line', pen: 11, onStrokeEnd: () => { sfx.pen(); this.onInput?.(); } });
    this.el.appendChild(this.pad.el);
    this.el.insertAdjacentHTML('beforeend', '<div class="line-read"></div>');
  }

  buildKeyboard() {
    this.el.innerHTML = `<input class="spell-kb" type="text" inputmode="latin" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="ここに入力（iPad はペンで書いても OK）" aria-label="つづりを入力">`;
    this.input = this.el.querySelector('input');
    this.input.addEventListener('input', () => this.onInput?.());
  }

  focus() { this.input?.focus(); }

  cancelRecog(box) { clearTimeout(this.timers.get(box)); }
  scheduleRecog(box) {
    this.cancelRecog(box);
    this.timers.set(box, setTimeout(() => { box.pending = this.recog([box]); }, 450));
  }
  async recog(list) {
    const res = await recognizeBoxes(list.map((b) => ({ strokes: b.pad.getStrokes(), w: BOX_W, h: BOX_H })));
    list.forEach((b, k) => { b.cands = res[k].cands; b.src = res[k].src; this.showRead(b); });
  }
  showRead(box) {
    const r = box.cell.querySelector('.lbox-read');
    const ch = displayChar(box.cands);
    r.textContent = ch ? (box.ch === box.ch.toUpperCase() ? ch : ch.toLowerCase()) : '';
    box.cell.classList.toggle('read', !!ch);
  }

  isEmpty() {
    if (this.mode === 'box') return this.boxes.every((b) => b.pad.isEmpty());
    if (this.mode === 'line') return this.pad.isEmpty();
    return !this.input.value.trim();
  }

  clear() {
    if (this.mode === 'box') this.boxes.forEach((b) => { b.pad.clear(); b.cands = []; this.showRead(b); });
    else if (this.mode === 'line') { this.pad.clear(); this.el.querySelector('.line-read').textContent = ''; }
    else this.input.value = '';
  }
  undo() {
    if (this.mode === 'box') {
      // いちばん最後に書いたマスの最後の1画
      let best = null, bt = -1;
      for (const b of this.boxes) { const s = b.pad.strokes[b.pad.strokes.length - 1]; if (s && s[0][2] > bt) { bt = s[0][2]; best = b; } }
      if (best) { best.pad.undo(); this.scheduleRecog(best); }
    } else if (this.mode === 'line') this.pad.undo();
  }

  /**
   * 判定する。{ ok: true|false|null（null=自己判定が必要）, got: 読み取った文字列, letters: [{exp, got, ok}] }
   */
  async check() {
    const st = settings();
    const ans = this.answer;
    if (this.mode === 'keyboard') {
      const got = this.input.value;
      const ok = normAnswer(got) === normAnswer(ans);
      return { ok, got, letters: diffLetters(ans, got) };
    }
    if (st.judge === 'self') return { ok: null, got: '' };
    if (this.mode === 'box') {
      // 未認識のマスをまとめて認識
      this.boxes.forEach((b) => this.cancelRecog(b));
      await Promise.all(this.boxes.map((b) => b.pending).filter(Boolean));
      const need = this.boxes.filter((b) => !b.pad.isEmpty() && !b.cands.length);
      if (need.length) await this.recog(need);
      const letters = this.boxes.map((b) => ({ exp: b.ch, got: displayChar(b.cands), ok: !b.pad.isEmpty() && judgeChar(b.cands, b.ch) }));
      let gi = 0;
      const got = [...ans].map((c) => (isLetter(c) ? (letters[gi++].got || '_') : c)).join('');
      return { ok: letters.every((l) => l.ok), got, letters, src: this.boxes.find((b) => b.src)?.src };
    }
    // 1行：単語ごと認識（オンラインのみ）
    if (st.judge === 'offline' || navigator.onLine === false) return { ok: null, got: '' };
    try {
      const cands = await recognizeLine(this.pad.getStrokes(), 1000, 300);
      const topN = STRICTNESS[st.strict]?.wordTopN ?? 1;
      const norm = (s) => normAnswer(s).replace(/[^a-z' -]/g, '');
      const ok = cands.slice(0, topN).some((c) => norm(c) === norm(ans));
      const got = ok ? ans : (cands[0] || '');
      this.el.querySelector('.line-read').innerHTML = `読み取り：<b>${esc(got)}</b>`;
      return { ok, got, letters: diffLetters(ans, got), src: 'google' };
    } catch {
      return { ok: null, got: '' };
    }
  }

  /** 答え合わせの表示 */
  reveal(res) {
    this.el.classList.add('revealed');
    if (this.mode === 'box') {
      this.boxes.forEach((b, k) => {
        const l = res.letters?.[k];
        b.pad.lock();
        b.cell.classList.toggle('ok', !!l?.ok);
        b.cell.classList.toggle('ng', res.ok !== null && !l?.ok);
        b.cell.querySelector('.lbox-ans').textContent = b.ch;
      });
    } else if (this.mode === 'line') {
      this.pad.lock();
    } else {
      this.input.readOnly = true;
      this.input.classList.add(res.ok ? 'ok' : 'ng');
    }
  }

  /** 判定の修正（認識ミスのとき） */
  override(ok) {
    if (this.mode === 'box') this.boxes.forEach((b) => { b.cell.classList.toggle('ok', ok); b.cell.classList.toggle('ng', !ok); });
    if (this.mode === 'keyboard') { this.input.classList.toggle('ok', ok); this.input.classList.toggle('ng', !ok); }
  }

  destroy() {
    this.timers.forEach((t) => clearTimeout(t));
    this.boxes.forEach((b) => b.pad.destroy());
    this.pad?.destroy();
  }
}

/** 正解と入力を1字ずつ比べる（表示用） */
export function diffLetters(ans, got) {
  const a = [...ans].filter(isLetter), g = [...String(got || '')].filter(isLetter);
  return a.map((c, i) => ({ exp: c, got: g[i] || '', ok: (g[i] || '').toLowerCase() === c.toLowerCase() }));
}

/** 正解のつづりを、まちがえた字に色をつけて表示 */
export function answerHTML(ans, letters) {
  if (!letters) return esc(ans);
  let k = 0;
  return [...ans].map((c) => {
    if (!isLetter(c)) return esc(c);
    const l = letters[k++];
    return `<span class="${l && !l.ok ? 'miss' : ''}">${esc(c)}</span>`;
  }).join('');
}
