// 画面部品のヘルパー
import { sfx } from './sound.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/** data-action 属性でクリックを振り分ける */
export function actions(root, map) {
  const first = !root._actions;
  root._actions = { ...(root._actions || {}), ...map };
  if (!first) return;
  root.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t || !root.contains(t) || t.disabled) return;
    const fn = root._actions[t.dataset.action];
    if (fn) fn(t, e);
  });
}

export function toast(msg, { icon = '', ms = 2600, cls = '' } = {}) {
  let wrap = $('.toast-wrap');
  if (!wrap) { wrap = el('<div class="toast-wrap" role="status"></div>'); document.body.appendChild(wrap); }
  const t = el(`<div class="toast ${cls}">${icon ? `<span class="toast-icon">${icon}</span>` : ''}<span>${msg}</span></div>`);
  wrap.appendChild(t);
  setTimeout(() => t.classList.add('out'), ms);
  setTimeout(() => t.remove(), ms + 400);
}

/** モーダル。{ el, close } を返す */
export function modal(html, { cls = '', onClose, dismissable = true } = {}) {
  const root = $('#overlay-root');
  const m = el(`<div class="modal-back ${cls}"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`);
  root.appendChild(m);
  requestAnimationFrame(() => m.classList.add('in'));
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    m.classList.remove('in');
    setTimeout(() => m.remove(), 250);
    onClose?.();
  };
  if (dismissable) m.addEventListener('click', (e) => { if (e.target === m) close(); });
  m.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => { sfx.tap(); close(); }));
  return { el: m.querySelector('.modal'), close };
}

export function confirmDialog(message, { ok = 'OK', cancel = 'キャンセル', danger = false } = {}) {
  return new Promise((resolve) => {
    let result = false;
    const m = modal(`
      <p class="confirm-msg">${message}</p>
      <div class="modal-actions">
        <button class="btn ghost" data-close>${cancel}</button>
        <button class="btn ${danger ? 'danger' : 'primary'}" data-ok>${ok}</button>
      </div>`, { onClose: () => resolve(result) });
    m.el.querySelector('[data-ok]').addEventListener('click', () => { result = true; m.close(); });
  });
}

/** 円形プログレス（SVG） */
export function ring(value, { size = 120, stroke = 12, color = 'var(--coral)', track = 'var(--track)', label = '', sub = '' } = {}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value || 0));
  return `
  <div class="ring" style="width:${size}px;height:${size}px">
    <svg viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${track}" stroke-width="${stroke}"/>
      <circle class="ring-bar" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
        stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - v)}"
        style="--c:${c}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    </svg>
    <div class="ring-label"><b>${label}</b>${sub ? `<small>${sub}</small>` : ''}</div>
  </div>`;
}

export const fmtTime = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T00:00:00`);
  const t = new Date(); t.setHours(0, 0, 0, 0);
  return Math.round((d - t) / 864e5);
}

/** 文字列のハッシュ（問題IDに使う） */
export function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}

/** AIの返答などの簡単なマークアップ（**太字**・見出し・箇条書き）を HTML に */
export function richText(text) {
  const lines = esc(text).split(/\r?\n/);
  let html = '', list = false;
  for (let ln of lines) {
    ln = ln.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>');
    const li = ln.match(/^\s*(?:[-・*]|\d+[.)])\s+(.*)/);
    if (li) { if (!list) { html += '<ul>'; list = true; } html += `<li>${li[1]}</li>`; continue; }
    if (list) { html += '</ul>'; list = false; }
    if (/^\s*#{1,4}\s+/.test(ln)) html += `<h4>${ln.replace(/^\s*#+\s+/, '')}</h4>`;
    else if (/^\s*[■◆●【]/.test(ln)) html += `<h4>${ln.trim()}</h4>`;
    else if (ln.trim()) html += `<p>${ln}</p>`;
  }
  if (list) html += '</ul>';
  return html;
}

/** 英文を単語ごとの <span> に（タップで発音するため） */
export function wordSpans(text, cls = 'tw') {
  // 先に単語で区切ってから、それぞれをエスケープする（&quot; などを壊さないため）
  return String(text).split(/([A-Za-z][A-Za-z'’-]*)/).map((part, i) => (i % 2
    ? `<span class="${cls}" data-w="${esc(part.toLowerCase().replace(/’/g, "'"))}">${esc(part)}</span>`
    : esc(part))).join('');
}

/** 空所「( )」を見やすい箱に */
export function blankify(text, fill = '') {
  return esc(text).replace(/\(\s*\)/g, `<span class="blank${fill ? ' filled' : ''}">${fill ? esc(fill) : '&nbsp;'}</span>`).replace(/\n/g, '<br>');
}

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));
