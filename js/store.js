// 学習データの保存（localStorage）
import { BUILTIN_AI } from './config.js';

const KEY = 'eiken3-passport-v1';

// アプリ内蔵の AI（中継サーバー経由・キー不要）。URL などは毎回 config.js の値を使う
const builtinProvider = (on = true) => ({ id: 'builtin', builtin: true, name: BUILTIN_AI.name, baseUrl: BUILTIN_AI.baseUrl, key: '', model: BUILTIN_AI.model, on, mergeSystem: false });

export const DEFAULT_AI = {
  cache: true,          // 同じ質問への回答は端末に保存して再利用（クレジット節約）
  providers: [
    builtinProvider(),
    { id: 'self', name: '自前サーバー（Gemma など）', baseUrl: '', key: '', model: '', on: false, mergeSystem: false },
    { id: 'free', name: '無料 LLM（OpenAI互換）', baseUrl: '', key: '', model: '', on: false, mergeSystem: false },
    { id: 'openrouter', name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1', key: '', model: 'google/gemini-2.5-flash-lite', on: false, mergeSystem: false },
  ],
};

export const DEFAULT_SETTINGS = {
  name: '',
  examDate: '',         // 一次試験の日
  exam2Date: '',        // 二次試験（面接）の日
  sound: true,
  volume: 0.7,
  theme: 'auto',        // auto | light | dark
  dailyGoal: 40,        // 1日の目標（問題・カードの合計）
  sessionSize: 10,
  newRatio: 0.3,
  // 手書き
  judge: 'auto',        // auto | offline | self
  strict: 'normal',     // easy | normal | strict
  spellMode: 'box',     // box（1マス1字）| line（1行に続けて）| keyboard
  lengthHint: true,     // マス目の数＝文字数を見せる
  pencilOnly: false,
  autoPalm: true,
  // 音声
  voiceF: '',
  voiceM: '',
  rate: 0.9,
  autoSpeak: true,      // 単語カードで自動で発音
  playTwice: true,      // リスニングは本番どおり2回
  showScript: 'after',  // リスニングのスクリプト：after | never
  subtitles: true,      // 面接官の字幕
  // AI
  ai: DEFAULT_AI,
};

const clone = (x) => JSON.parse(JSON.stringify(x));

const fresh = () => ({
  v: 1,
  created: Date.now(),
  settings: clone(DEFAULT_SETTINGS),
  items: {},       // 問題・カードID → 記憶の状態
  days: {},        // 'YYYY-MM-DD' → { n, c, xp, sec, k: {分野: 数} }
  recent: { r: '', l: '' }, // 直近の正誤（1/0）→ 合格予測に使う
  xp: 0,
  bestCombo: 0,
  badges: {},
  stars: {},       // 苦手ノート（☆）
  laps: {},        // 高速周回の記録
  writings: [],    // 英作文・Eメールの記録
  interviews: [],  // 面接練習の記録
  exams: [],       // 模試の記録
  custom: [],      // 追加した問題（取り込み・AI生成）
  aiUsage: {},     // 'YYYY-MM' → { calls, tokens, cost }
});

function merge(d) {
  const base = fresh();
  const s = { ...base, ...d };
  s.settings = { ...base.settings, ...(d.settings || {}) };
  const ai = d.settings?.ai || {};
  s.settings.ai = { ...DEFAULT_AI, ...ai };
  // 保存済みのプロバイダーに、新しく増えた既定のプロバイダーを足す
  const have = new Map((ai.providers || []).map((p) => [p.id, p]));
  s.settings.ai.providers = [
    ...(ai.providers || []).map((p) => ({ ...(DEFAULT_AI.providers.find((x) => x.id === p.id) || {}), ...p })),
    ...DEFAULT_AI.providers.filter((p) => !have.has(p.id)).map((p) => ({ ...p })),
  ];
  // 内蔵 AI はいつも先頭に置き、URL・モデルは config.js の値に合わせる（オン・オフだけ利用者が決める）
  const bi = s.settings.ai.providers.find((p) => p.id === 'builtin');
  s.settings.ai.providers = [builtinProvider(bi ? bi.on !== false : true), ...s.settings.ai.providers.filter((p) => p.id !== 'builtin')];
  s.recent = { ...base.recent, ...(d.recent || {}) };
  return s;
}

let state = load();
let saveTimer = null;
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return merge(JSON.parse(raw));
  } catch (e) { console.warn('load failed', e); }
  return fresh();
}

export const get = () => state;
export const settings = () => state.settings;

export function update(fn) {
  fn(state);
  scheduleSave();
  listeners.forEach((l) => l(state));
}
export const subscribe = (fn) => (listeners.add(fn), () => listeners.delete(fn));

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 250);
}
export function saveNow() {
  clearTimeout(saveTimer);
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch (e) { console.warn('save failed', e); }
}
addEventListener('pagehide', saveNow);
document.addEventListener('visibilitychange', () => document.hidden && saveNow());

export async function requestPersist() {
  try { if (navigator.storage?.persist && !(await navigator.storage.persisted())) await navigator.storage.persist(); }
  catch { /* 非対応 */ }
}

/** バックアップ（APIキーは書き出さない） */
export function exportJSON() {
  const copy = clone(state);
  copy.settings.ai.providers.forEach((p) => { p.key = ''; });
  return JSON.stringify({ app: 'eiken3-passport', exported: new Date().toISOString(), data: copy }, null, 1);
}
export function importJSON(text) {
  const obj = JSON.parse(text);
  const d = obj.data || obj;
  if (!d || typeof d !== 'object' || !d.items) throw new Error('バックアップファイルの形式が違います');
  // 端末に保存してある API キーは引き継ぐ
  const keys = Object.fromEntries(state.settings.ai.providers.map((p) => [p.id, p.key]));
  state = merge(d);
  state.settings.ai.providers.forEach((p) => { if (!p.key && keys[p.id]) p.key = keys[p.id]; });
  saveNow();
  listeners.forEach((l) => l(state));
}
export function resetAll() {
  const keep = state.settings;
  state = fresh();
  state.settings = keep;
  saveNow();
  listeners.forEach((l) => l(state));
}

// ---- 日付 ----
export const dayKey = (t = Date.now()) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const active = (d) => !!d && (d.n > 0 || Object.keys(d.k || {}).length > 0);
export function streak() {
  let n = 0;
  const d = new Date();
  if (!active(state.days[dayKey(d)])) d.setDate(d.getDate() - 1);
  while (active(state.days[dayKey(d)])) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
export const today = () => state.days[dayKey()] || { n: 0, c: 0, xp: 0, sec: 0, k: {} };

/** 1問（1枚）答えたことを記録する。k は分野（words / spell / r1 / r2 / r3 / l1 / l2 / l3 / write / speak） */
export function logAnswer(k, correct, xp = 0) {
  update((s) => {
    const key = dayKey();
    const d = s.days[key] || (s.days[key] = { n: 0, c: 0, xp: 0, sec: 0, k: {} });
    d.k = d.k || {};
    d.n++;
    if (correct) d.c++;
    d.xp += xp;
    d.k[k] = (d.k[k] || 0) + 1;
    s.xp += xp;
    const skill = k[0] === 'r' ? 'r' : k[0] === 'l' ? 'l' : null;
    if (skill) s.recent[skill] = (s.recent[skill] + (correct ? '1' : '0')).slice(-120);
  });
}
export function addStudyTime(sec) {
  if (!(sec > 0)) return;
  update((s) => {
    const key = dayKey();
    const d = s.days[key] || (s.days[key] = { n: 0, c: 0, xp: 0, sec: 0, k: {} });
    d.sec = (d.sec || 0) + Math.min(sec, 1800);
  });
}

// ---- 模試の途中保存 ----
const EXAM_KEY = 'eiken3-passport-exam';
export const saveExamDraft = (d) => { try { localStorage.setItem(EXAM_KEY, JSON.stringify(d)); } catch { /* 容量不足 */ } };
export const loadExamDraft = () => { try { return JSON.parse(localStorage.getItem(EXAM_KEY)); } catch { return null; } };
export const clearExamDraft = () => localStorage.removeItem(EXAM_KEY);
