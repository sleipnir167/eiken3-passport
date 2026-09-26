// 間隔反復（忘却曲線）にもとづく出題スケジューラー
//
//  記憶の定着度 R(t) = (1 + t / (9·S))^-1   … t: 前回からの経過日数, S: 安定度（日）
//  R が 0.9 を下回るころ（= S 日後）に復習するのが最も効率がよい。
//  正解するたびに S は伸び、まちがえると大きく縮む。まちがえた問題ほど早く・多く出題される。

export const DAY = 864e5;
const TARGET = 0.9;

export function retrievability(st, t = Date.now()) {
  if (!st || !st.last) return 0;
  const days = Math.max(0, (t - st.last) / DAY);
  return Math.pow(1 + days / (9 * st.s), -1);
}

/**
 * 解答結果を反映した新しい状態を返す
 * grade: 0 = まちがい / 1 = あやしい / 2 = 正解 / 3 = かんたん
 */
export function review(prev, grade, t = Date.now()) {
  if (grade === true) grade = 2;
  if (grade === false) grade = 0;
  const correct = grade > 0;
  const st = prev ? { ...prev } : { n: 0, c: 0, w: 0, s: 0, d: 5, last: 0, due: 0, streak: 0, h: '' };
  const R = retrievability(prev, t);
  if (st.n === 0) {
    st.s = [0.15, 1, 2.5, 6][grade];
    st.d = [6.5, 5.5, 4, 3][grade];
  } else if (correct) {
    // 忘れかけていた問題に正解するほど、安定度は大きく伸びる
    const bonus = grade === 1 ? 0.5 : grade === 3 ? 1.4 : 1;
    const growth = 1 + (4 * ((11 - st.d) / 10) * (1.1 - R) * Math.pow(st.s, -0.08) + 0.4) * bonus;
    st.s = Math.min(365, Math.max(st.s * growth, st.s + 0.5));
    st.d = Math.max(1, Math.min(10, st.d - (grade - 1.5) * 0.5));
  } else {
    st.s = Math.max(0.1, st.s * 0.25);
    st.d = Math.min(10, st.d + 1.5);
  }
  st.n++;
  if (correct) { st.c++; st.streak++; } else { st.w++; st.streak = 0; }
  st.h = (st.h + (correct ? '1' : '0')).slice(-8);
  st.last = t;
  st.due = t + st.s * DAY * ((1 / TARGET - 1) * 9);
  return st;
}

export function status(st, t = Date.now()) {
  if (!st || !st.n) return 'new';
  const lastWrong = st.h.endsWith('0');
  if (lastWrong || (st.n >= 3 && st.c / st.n < 0.6)) return 'weak';
  if (st.s >= 20 && retrievability(st, t) >= 0.85) return 'mastered';
  if (st.s >= 4) return 'review';
  return 'learning';
}
export const STATUS_LABEL = {
  new: '未学習', learning: '学習中', review: '定着中', mastered: '習得', weak: '苦手',
};

export const isDue = (st, t = Date.now()) => !!st?.n && st.due <= t;

/** 苦手度（大きいほど苦手） */
export function weakness(st, t = Date.now()) {
  if (!st?.n) return 0;
  const acc = (st.c + 1) / (st.n + 2);
  const recentWrong = [...st.h].slice(-3).filter((x) => x === '0').length;
  return (1 - acc) * 2 + recentWrong * 0.6 + (1 - retrievability(st, t)) + (st.d - 5) * 0.1;
}

export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function weightedPick(list, n, wfn) {
  const pool = list.map((x) => ({ x, w: Math.max(0.0001, wfn(x)) }));
  const out = [];
  while (out.length < n && pool.length) {
    const total = pool.reduce((s, p) => s + p.w, 0);
    let r = Math.random() * total, i = 0;
    for (; i < pool.length - 1; i++) { r -= pool[i].w; if (r <= 0) break; }
    out.push(pool.splice(i, 1)[0].x);
  }
  return out;
}

/**
 * 出題するものを選ぶ
 * - 復習時期が来たもの（忘れかけている順）と苦手なもの
 * - 新しいもの（weight が大きいほど選ばれやすい。単語なら重要度）
 * - 足りなければ定着度の低い既習のもの
 */
export function pick(pool, items, count, { newRatio = 0.3, t = Date.now(), weight = () => 1, keepOrderNew = false } = {}) {
  const due = [], seen = [], fresh = [];
  for (const q of pool) {
    const st = items[q.id];
    if (!st?.n) fresh.push(q);
    else if (isDue(st, t) || status(st, t) === 'weak') due.push(q);
    else seen.push(q);
  }
  const pri = (q) => {
    const st = items[q.id];
    return (1 - retrievability(st, t)) * 2 + weakness(st, t);
  };
  due.sort((a, b) => pri(b) - pri(a));

  const wantNew = Math.min(fresh.length, Math.max(fresh.length && count > 2 ? 1 : 0, Math.round(count * newRatio)));
  const fromDue = due.slice(0, count - wantNew);
  const nNew = count - fromDue.length;
  const newOnes = keepOrderNew ? fresh.slice(0, nNew) : weightedPick(fresh, nNew, weight);
  let chosen = [...fromDue, ...newOnes];
  if (chosen.length < count) {
    const rest = weightedPick(seen, count - chosen.length, (q) => 1.05 - retrievability(items[q.id], t));
    chosen = chosen.concat(rest);
  }
  if (chosen.length < count) {
    const used = new Set(chosen.map((q) => q.id));
    chosen = chosen.concat(shuffle(pool.filter((q) => !used.has(q.id))).slice(0, count - chosen.length));
  }
  return shuffle(chosen);
}

/** 今後 days 日間、復習しなかった場合の平均定着度（忘却曲線の予測） */
export function forecast(items, days = 30, t = Date.now()) {
  const learned = Object.values(items).filter((s) => s.n);
  if (!learned.length) return [];
  const out = [];
  for (let d = 0; d <= days; d++) {
    const tt = t + d * DAY;
    out.push(learned.reduce((s, st) => s + retrievability(st, tt), 0) / learned.length);
  }
  return out;
}

/** 今後 days 日間の、日ごとの復習予定数 */
export function dueSchedule(items, days = 14, t = Date.now(), filter = () => true) {
  const counts = new Array(days).fill(0);
  const start = new Date(t); start.setHours(0, 0, 0, 0);
  for (const [id, st] of Object.entries(items)) {
    if (!st.n || !filter(id)) continue;
    const idx = Math.max(0, Math.floor((st.due - start.getTime()) / DAY));
    if (idx < days) counts[idx]++;
  }
  return counts;
}
