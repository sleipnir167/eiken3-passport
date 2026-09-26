// 手書き英字の認識
//  1) オンライン：Google 手書き入力 API（1マスずつ別のリクエストにして、単語の自動補正が入らないようにする）
//  2) オフライン：$P 点群認識 ＋ 4線の位置（上に出るか・下に出るか）で判定（端末内で完結）
import { TEMPLATES } from './letters.js';
import { LINES4 } from './pad.js';
import { settings } from './store.js';

const API = 'https://inputtools.google.com/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8';

// 認識エンジンが取り違えやすい記号・数字 → 同じ文字とみなす
const LOOKALIKE = {
  l: ['1', '|', 'I', 'ǀ', '/'], o: ['0', 'O', 'ο', 'о', '°'], s: ['5', '$', 'S'], z: ['2', 'Z'], g: ['9'], q: ['9'],
  b: ['6'], i: ['ì', 'í', 'î', 'ï', 'ı', 'ί'], e: ['é', 'è', 'ê', 'ë'], a: ['à', 'á', 'â', 'ä', 'α', 'ɑ'],
  c: ['(', 'C', '¢'], u: ['ü', 'ù', 'ú', 'µ'], n: ['ñ', 'η'], y: ['ý', 'ÿ', 'γ'], x: ['×', 'χ'], t: ['+', 'ť'],
  v: ['ν', '√'], w: ['ω'], p: ['ρ', 'þ'], k: ['κ'], j: ['ĵ'], r: ['г'],
};
export function sameChar(cand, expected) {
  if (!cand) return false;
  const e = expected.toLowerCase();
  if (cand.toLowerCase() === e) return true;
  return (LOOKALIKE[e] || []).includes(cand);
}
/** 候補を表示用の1文字に */
export function displayChar(cands) {
  for (const c of cands || []) {
    if (/^[a-zA-Z]$/.test(c)) return c;
    for (const [k, list] of Object.entries(LOOKALIKE)) if (list.includes(c)) return k;
  }
  return (cands && cands[0]) || '';
}

export const STRICTNESS = {
  easy:   { label: 'やさしい', topN: 3, wordTopN: 3 },
  normal: { label: 'ふつう',   topN: 2, wordTopN: 1 },
  strict: { label: 'きびしい', topN: 1, wordTopN: 1 },
};

export function judgeChar(cands, expected) {
  const topN = STRICTNESS[settings().strict]?.topN ?? 2;
  const letters = (cands || []).filter((c) => c.length === 1);
  return letters.slice(0, topN).some((c) => sameChar(c, expected));
}

const toInk = (strokes) => strokes.map((s) => [s.map((p) => Math.round(p[0])), s.map((p) => Math.round(p[1])), s.map((p) => Math.round(p[2] || 0))]);

async function googleBatch(list, timeoutMs = 4500) {
  const body = {
    options: 'enable_pre_space',
    requests: list.map(({ strokes, w, h }) => ({
      writing_guide: { writing_area_width: Math.round(w), writing_area_height: Math.round(h) },
      ink: toInk(strokes), language: 'en',
    })),
  };
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctl.signal });
    const data = await res.json();
    if (data[0] !== 'SUCCESS') throw new Error('recognition failed');
    return data[1].map((r) => r[1] || []);
  } finally {
    clearTimeout(timer);
  }
}

// ---------- オフライン：$P 点群認識 ----------
const N = 40;

function resampleCloud(strokes) {
  // ストロークをまたいで等間隔に N 点を取る（ストローク間の移動は数えない）
  let L = 0;
  for (const s of strokes) for (let i = 1; i < s.length; i++) L += Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
  if (L === 0) {
    const p = strokes[0]?.[0] || [0, 0];
    return Array.from({ length: N }, () => [p[0], p[1]]);
  }
  const I = L / (N - 1);
  const out = [[strokes[0][0][0], strokes[0][0][1]]];
  let D = 0;
  for (const s0 of strokes) {
    const s = s0.map((p) => [p[0], p[1]]);
    for (let i = 1; i < s.length; i++) {
      const d = Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
      if (D + d >= I && d > 0) {
        const t = (I - D) / d;
        const q = [s[i - 1][0] + t * (s[i][0] - s[i - 1][0]), s[i - 1][1] + t * (s[i][1] - s[i - 1][1])];
        out.push(q);
        s.splice(i, 0, q);
        D = 0;
      } else D += d;
    }
  }
  while (out.length < N) out.push(out[out.length - 1]);
  return out.slice(0, N);
}

function normalizeCloud(pts) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of pts) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  const size = Math.max(maxX - minX, maxY - minY, 1e-6);
  let cx = 0, cy = 0;
  const sc = pts.map(([x, y]) => [(x - minX) / size, (y - minY) / size]);
  for (const [x, y] of sc) { cx += x; cy += y; }
  cx /= sc.length; cy /= sc.length;
  return sc.map(([x, y]) => [x - cx, y - cy]);
}

function cloudDistance(a, b, start) {
  const n = a.length;
  const matched = new Uint8Array(n);
  let sum = 0, i = start;
  do {
    let min = Infinity, idx = -1;
    for (let j = 0; j < n; j++) {
      if (matched[j]) continue;
      const d = Math.hypot(a[i][0] - b[j][0], a[i][1] - b[j][1]);
      if (d < min) { min = d; idx = j; }
    }
    matched[idx] = 1;
    sum += (1 - ((i - start + n) % n) / n) * min;
    i = (i + 1) % n;
  } while (i !== start);
  return sum;
}
function greedyMatch(a, b) {
  const step = Math.floor(Math.pow(N, 0.5));
  let min = Infinity;
  for (let i = 0; i < N; i += step) min = Math.min(min, cloudDistance(a, b, i), cloudDistance(b, a, i));
  return min;
}

// 字の特徴：上下の位置（4線単位）と i/j の点
function features(strokes) {
  let top = Infinity, bot = -Infinity, minX = Infinity, maxX = -Infinity;
  for (const s of strokes) for (const [x, y] of s) { top = Math.min(top, y); bot = Math.max(bot, y); minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
  // 点：小さい画が、ほかの画より上にある
  let dot = false, bodyTop = Infinity;
  const small = [];
  for (const s of strokes) {
    let t = Infinity, b = -Infinity, l = Infinity, r = -Infinity;
    for (const [x, y] of s) { t = Math.min(t, y); b = Math.max(b, y); l = Math.min(l, x); r = Math.max(r, x); }
    if (Math.hypot(r - l, b - t) < 0.3 && strokes.length > 1) small.push(b);
    else bodyTop = Math.min(bodyTop, t);
  }
  if (small.some((b) => b < bodyTop + 0.05)) dot = true;
  return { top, bot, dot, width: maxX - minX };
}

let TPL = null;
function templates() {
  if (TPL) return TPL;
  TPL = TEMPLATES.map(([ch, strokes]) => ({ ch, cloud: normalizeCloud(resampleCloud(strokes)), f: features(strokes), dotted: ch === 'i' || ch === 'j' }));
  return TPL;
}

/** 1マスのストローク（パッドの座標）を認識。候補の文字を良い順に返す */
export function offlineChar(strokes, w, h) {
  if (!strokes.length) return [];
  const unit = h * (LINES4[1] - LINES4[0]);
  const top0 = h * LINES4[0];
  const lined = strokes.map((s) => s.map((p) => [p[0] / unit, (p[1] - top0) / unit]));
  const cloud = normalizeCloud(resampleCloud(lined));
  const f = features(lined);
  const scored = templates().map((t) => {
    let d = greedyMatch(cloud, t.cloud);
    // 上下の位置のずれ（ゆるめに）
    const dz = Math.min(1.2, Math.abs(f.top - t.f.top)) + Math.min(1.2, Math.abs(f.bot - t.f.bot));
    d += dz * 1.6;
    if (t.dotted !== f.dot) d += 2.5;
    return { ch: t.ch, d };
  }).sort((a, b) => a.d - b.d);
  const out = [];
  for (const s of scored) if (!out.includes(s.ch)) out.push(s.ch);
  return out.slice(0, 6);
}

/**
 * 複数のマスをまとめて認識。boxes: [{ strokes, w, h }]
 * 返り値: [{ cands, src }]（空のマスは cands = []）
 */
export async function recognizeBoxes(boxes, mode = settings().judge) {
  const idx = boxes.map((b, i) => (b.strokes.length ? i : -1)).filter((i) => i >= 0);
  const out = boxes.map(() => ({ cands: [], src: '' }));
  if (!idx.length || mode === 'self') return out;
  if (mode === 'auto' && navigator.onLine !== false) {
    try {
      const res = await googleBatch(idx.map((i) => boxes[i]));
      idx.forEach((i, k) => { out[i] = { cands: res[k].filter((c) => c.trim().length === 1), src: 'google' }; });
      // 1文字の候補がなければオフラインで補う
      idx.forEach((i) => { if (!out[i].cands.length) out[i] = { cands: offlineChar(boxes[i].strokes, boxes[i].w, boxes[i].h), src: 'offline' }; });
      return out;
    } catch (e) { console.warn('google hw failed → offline', e); }
  }
  idx.forEach((i) => { out[i] = { cands: offlineChar(boxes[i].strokes, boxes[i].w, boxes[i].h), src: 'offline' }; });
  return out;
}

/** 1行に続けて書いた単語・文を認識（オンラインのみ）。候補の文字列を返す */
export async function recognizeLine(strokes, w, h) {
  if (!strokes.length) return [];
  const [res] = await googleBatch([{ strokes, w, h }], 6000);
  return res;
}

/** 複数行の手書き答案を行ごとに認識（オンラインのみ） */
export async function recognizeLines(lines) {
  const idx = lines.map((l, i) => (l.strokes.length ? i : -1)).filter((i) => i >= 0);
  if (!idx.length) return lines.map(() => '');
  const res = await googleBatch(idx.map((i) => lines[i]), 12000);
  const out = lines.map(() => '');
  idx.forEach((i, k) => { out[i] = res[k][0] || ''; });
  return out;
}
