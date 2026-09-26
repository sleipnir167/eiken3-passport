// やる気を引き出す仕組み：XP・レベル・称号・パスポートスタンプ（バッジ）
import * as store from './store.js';
import { status } from './srs.js';
import { sfx } from './sound.js';
import { toast } from './ui.js';

export const xpFor = (L) => 80 * (L - 1) + 20 * (L - 1) * (L - 2);
export function levelInfo(xp = store.get().xp) {
  let L = 1;
  while (xp >= xpFor(L + 1)) L++;
  const cur = xpFor(L), next = xpFor(L + 1);
  return { level: L, into: xp - cur, need: next - cur, ratio: (xp - cur) / (next - cur), title: titleFor(L) };
}
const TITLES = [
  [1, 'Passenger', '乗客'], [3, 'Traveler', '旅人'], [5, 'Explorer', '探検家'], [8, 'Navigator', '航海士'],
  [11, 'Co-pilot', '副操縦士'], [14, 'Pilot', 'パイロット'], [18, 'Captain', '機長'], [22, 'Ambassador', '大使'],
  [27, 'Globetrotter', '世界旅行者'], [33, 'Legend', '伝説の旅人'], [40, 'English Master', '英語マスター'],
];
export const titleFor = (L) => { const t = TITLES.filter(([l]) => L >= l).pop(); return { en: t[1], ja: t[2] }; };

export const xpForAnswer = (correct, combo = 0) => (correct ? 10 + Math.min(combo, 10) * 2 : 2);

export const BADGES = [
  { id: 'first', icon: '🛫', name: 'Take off!', desc: 'はじめて問題に答えた' },
  { id: 'combo10', icon: '🔥', name: '10連続正解', desc: '10問続けて正解した' },
  { id: 'combo30', icon: '💥', name: '30連続正解', desc: '30問続けて正解した' },
  { id: 'n100', icon: '📗', name: '100問達成', desc: '合計100問（枚）に答えた' },
  { id: 'n500', icon: '📘', name: '500問達成', desc: '合計500問（枚）に答えた' },
  { id: 'n2000', icon: '📕', name: '2000問達成', desc: '合計2000問（枚）に答えた' },
  { id: 'w100', icon: '🔤', name: '単語100', desc: '100語を「定着中」以上にした' },
  { id: 'w300', icon: '🧠', name: '単語300', desc: '300語を「定着中」以上にした' },
  { id: 'w600', icon: '🏆', name: '単語600', desc: '600語を「定着中」以上にした' },
  { id: 'streak3', icon: '📅', name: '3日連続', desc: '3日続けて学習した' },
  { id: 'streak7', icon: '🗓️', name: '1週間皆勤', desc: '7日続けて学習した' },
  { id: 'streak30', icon: '🌏', name: '1か月皆勤', desc: '30日続けて学習した' },
  { id: 'goal', icon: '🎯', name: '今日の目標達成', desc: '1日の目標をクリアした' },
  { id: 'perfect', icon: '💯', name: 'パーフェクト', desc: '10問以上の練習で全問正解した' },
  { id: 'lap', icon: '⚡', name: 'スピード周回', desc: '高速周回を1周した' },
  { id: 'lap10', icon: '🌀', name: '10周の達人', desc: '高速周回を合計10周した' },
  { id: 'spell50', icon: '✍️', name: '手書きスペル50', desc: '手書きのつづりを50回正解した' },
  { id: 'writing', icon: '✉️', name: 'はじめての作文', desc: 'ライティングに挑戦した' },
  { id: 'writing-hi', icon: '🖋️', name: '作文の達人', desc: 'ライティングで8割以上の点をとった' },
  { id: 'interview', icon: '🎤', name: '面接デビュー', desc: 'AI面接を受けた' },
  { id: 'interview-hi', icon: '🗣️', name: '面接合格ライン', desc: '面接練習で合格ラインをこえた' },
  { id: 'exam', icon: '📝', name: '模試デビュー', desc: '模擬試験を受けた' },
  { id: 'exam-pass', icon: '🌸', name: 'サクラサク', desc: '模擬試験で合格ラインをこえた' },
  { id: 'allparts', icon: '🧭', name: '全分野制覇', desc: '単語・筆記・リスニング・作文・面接すべてに挑戦した' },
  { id: 'ai', icon: '🤖', name: 'AI先生に質問', desc: 'AI解説・AI添削を使った' },
  { id: 'early', icon: '🌅', name: '早起き学習', desc: '朝6時前に学習した' },
];

function unlock(id) {
  const s = store.get();
  if (s.badges[id]) return false;
  store.update((st) => { st.badges[id] = Date.now(); });
  const b = BADGES.find((x) => x.id === id);
  setTimeout(() => {
    sfx.badge();
    toast(`<b>スタンプ獲得！</b> ${b.name}`, { icon: b.icon, ms: 3500, cls: 'badge-toast' });
  }, 700);
  return true;
}
export const award = unlock;

/** 状況に応じてバッジを判定する */
export function checkBadges(ctx = {}) {
  const s = store.get();
  const total = Object.values(s.days).reduce((a, d) => a + (d.n || 0), 0);
  if (total >= 1) unlock('first');
  if (total >= 100) unlock('n100');
  if (total >= 500) unlock('n500');
  if (total >= 2000) unlock('n2000');
  if (ctx.combo >= 10) unlock('combo10');
  if (ctx.combo >= 30) unlock('combo30');
  const sk = store.streak();
  if (sk >= 3) unlock('streak3');
  if (sk >= 7) unlock('streak7');
  if (sk >= 30) unlock('streak30');
  if (store.today().n >= s.settings.dailyGoal) unlock('goal');
  if (ctx.perfect) unlock('perfect');
  let learned = 0, spellOk = 0;
  for (const [id, st] of Object.entries(s.items)) {
    if (id.startsWith('wm:') && ['review', 'mastered'].includes(status(st))) learned++;
    if (id.startsWith('ws:')) spellOk += st.c || 0;
  }
  if (learned >= 100) unlock('w100');
  if (learned >= 300) unlock('w300');
  if (learned >= 600) unlock('w600');
  if (spellOk >= 50) unlock('spell50');
  const laps = Object.values(s.laps).reduce((a, l) => a + (l.count || 0), 0);
  if (laps >= 1) unlock('lap');
  if (laps >= 10) unlock('lap10');
  if (s.writings.length) unlock('writing');
  if (s.writings.some((w) => w.total / w.max >= 0.8)) unlock('writing-hi');
  if (s.interviews.length) unlock('interview');
  if (s.interviews.some((w) => w.total >= 20)) unlock('interview-hi');
  if (s.exams.length) unlock('exam');
  if (s.exams.some((e) => e.pass)) unlock('exam-pass');
  const k = new Set(Object.values(s.days).flatMap((d) => Object.keys(d.k || {})));
  if (['words', 'r1', 'r2', 'r3', 'l1', 'l2', 'l3', 'write', 'speak'].every((x) => k.has(x))) unlock('allparts');
  if (ctx.ai) unlock('ai');
  const h = new Date().getHours();
  if (total > 0 && h < 6 && h >= 4) unlock('early');
}

function levelCheck(before) {
  const after = levelInfo();
  if (after.level > before) {
    setTimeout(() => {
      sfx.levelup();
      toast(`<b>レベルアップ！ Lv.${after.level}</b> ${after.title.ja}（${after.title.en}）`, { icon: '✈️', ms: 4000, cls: 'level-toast' });
    }, 400);
  }
}

/** 1問（1枚）の解答を記録（XP・日ごとの記録・レベルアップ） */
export function recordAnswer(k, correct, xp) {
  const before = levelInfo().level;
  store.logAnswer(k, correct, xp);
  levelCheck(before);
}

/** ボーナス XP（作文・面接・模試など） */
export function gainXP(n) {
  const before = levelInfo().level;
  store.update((s) => {
    s.xp += n;
    const key = store.dayKey();
    const d = s.days[key] || (s.days[key] = { n: 0, c: 0, xp: 0, sec: 0, k: {} });
    d.xp += n;
  });
  levelCheck(before);
}

/** 分野だけ記録（作文・面接は「問題数」に数えず、挑戦したことを残す） */
export function logActivity(k) {
  store.update((s) => {
    const key = store.dayKey();
    const d = s.days[key] || (s.days[key] = { n: 0, c: 0, xp: 0, sec: 0, k: {} });
    d.k = d.k || {};
    d.k[k] = (d.k[k] || 0) + 1;
  });
}
