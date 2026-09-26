// アプリ本体：画面の切りかえ・テーマ・Service Worker
import * as store from './store.js';
import { sfx } from './sound.js';
import { toast } from './ui.js';
import { renderHome } from './screens/home.js';
import { renderWords } from './screens/words.js';
import { renderWordPlay } from './screens/wordplay.js';
import { renderDrill } from './screens/drill.js';
import { renderQuiz } from './screens/quiz.js';
import { renderGrammar } from './screens/grammar.js';
import { renderListen } from './screens/listen.js';
import { renderWrite, renderWriteEditor } from './screens/write.js';
import { renderInterview, renderInterviewSession } from './screens/interview.js';
import { renderExam } from './screens/exam.js';
import { renderStats } from './screens/stats.js';
import { renderSettings } from './screens/settings.js';

const SCREENS = {
  home: { render: renderHome, tab: 'home' },
  words: { render: renderWords, tab: 'words' },
  wordplay: { render: renderWordPlay, full: true },
  drill: { render: renderDrill, tab: 'drill' },
  quiz: { render: renderQuiz, full: true },
  grammar: { render: renderGrammar, tab: 'drill' },
  listen: { render: renderListen, tab: 'listen' },
  write: { render: renderWrite, tab: 'write' },
  writing: { render: renderWriteEditor, full: true },
  interview: { render: renderInterview, tab: 'interview' },
  talk: { render: renderInterviewSession, full: true },
  exam: { render: renderExam, full: true },
  stats: { render: renderStats, tab: 'stats' },
  settings: { render: renderSettings, tab: 'home' },
};
const TABS = [
  ['home', 'ホーム', '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>'],
  ['words', '単語', '<rect x="3" y="6" width="14" height="14" rx="2.5"/><path d="M7 3h11a3 3 0 0 1 3 3v11"/><path d="M7 11h6M7 15h4"/>'],
  ['drill', '筆記', '<path d="M5 4h10l4 4v12H5z"/><path d="M15 4v4h4M8 12h8M8 16h6"/>'],
  ['listen', 'リスニング', '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="5" height="7" rx="2"/><rect x="16" y="14" width="5" height="7" rx="2"/>'],
  ['write', '作文', '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'],
  ['interview', '面接', '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'],
  ['stats', '記録', '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'],
];

let cleanup = null;
let leaveHooks = [];
/** 画面を離れるときに呼ばれる処理を登録 */
export const onLeave = (fn) => leaveHooks.push(fn);
let transient = null;
let enterAt = Date.now();

export function go(name, params = {}, data = null) {
  transient = data;
  const qs = new URLSearchParams(params).toString();
  const hash = `#/${name}${qs ? `?${qs}` : ''}`;
  if (location.hash === hash) route(); else location.hash = hash;
}
export const takeTransient = () => { const d = transient; transient = null; return d; };
export const back = (fallback = 'home') => (history.length > 1 ? history.back() : go(fallback));

function parse() {
  const h = location.hash.replace(/^#\/?/, '');
  const [name, qs] = h.split('?');
  return { name: SCREENS[name] ? name : 'home', params: Object.fromEntries(new URLSearchParams(qs || '')) };
}

function route() {
  const { name, params } = parse();
  const scr = SCREENS[name];
  // 学習時間（全画面の学習セッションにいた時間）
  if (document.body.classList.contains('fullscreen-mode')) store.addStudyTime((Date.now() - enterAt) / 1000);
  enterAt = Date.now();
  try { cleanup?.(); } catch (e) { console.warn(e); }
  cleanup = null;
  leaveHooks.forEach((f) => { try { f(); } catch (e) { console.warn(e); } });
  leaveHooks = [];
  const app = document.getElementById('app');
  app.innerHTML = '';
  const main = document.createElement('main');
  main.className = `screen screen-${name}`;
  app.appendChild(main);
  if (!scr.full) app.appendChild(tabbar(scr.tab));
  document.body.classList.toggle('fullscreen-mode', !!scr.full);
  window.scrollTo(0, 0);
  try {
    cleanup = scr.render(main, params) || null;
  } catch (e) {
    console.error(e);
    main.innerHTML = `<div class="card"><h2>表示できませんでした</h2><p class="muted small">${String(e.message || e)}</p><button class="btn primary" onclick="location.hash='#/home'">ホームへ</button></div>`;
  }
}

function tabbar(active) {
  const nav = document.createElement('nav');
  nav.className = 'tabbar';
  nav.innerHTML = TABS.map(([id, label, icon]) => `
    <a href="#/${id}" class="tab${id === active ? ' active' : ''}" aria-label="${label}">
      <svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg><span>${label}</span></a>`).join('');
  nav.addEventListener('click', () => sfx.tap());
  return nav;
}

export function applyTheme() {
  const t = store.settings().theme;
  const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#0f1629' : '#1d3461';
}
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);

async function registerSW() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  try {
    const reg = await navigator.serviceWorker.register('sw.js');
    const offer = (w) => {
      window.__applyUpdate = () => w.postMessage('skipWaiting');
      toast('新しいバージョンがあります。<button class="toast-btn" onclick="__applyUpdate()">更新</button>', { icon: '✨', ms: 12000 });
    };
    if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw?.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) offer(nw);
      });
    });
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloaded) return;
      reloaded = true;
      store.saveNow();
      location.reload();
    });
  } catch (e) { console.warn('SW registration failed', e); }
}

function start() {
  applyTheme();
  addEventListener('hashchange', route);
  route();
  registerSW();
  store.requestPersist();
}
start();
