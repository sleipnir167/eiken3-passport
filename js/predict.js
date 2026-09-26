// 合格予測：直近の正答率などから技能ごとの CSE スコアの目安を出す
//  英検3級：一次試験 1650 点満点（リーディング・リスニング・ライティング 各550）で合格基準 1103
//           二次試験（面接）550 点満点で合格基準 353
//  ※ 実際の CSE スコアは統計的に算出されるため、ここでの値はあくまで目安（正答率 約6割強で合格ライン付近になるよう換算）
import * as store from './store.js';

export const PASS1 = 1103, PASS2 = 353, SKILL_MAX = 550;
export const cse = (ratio, k = 0.84) => Math.round(SKILL_MAX * Math.pow(Math.max(0, Math.min(1, ratio)), k));

const ratioOf = (bits) => (bits.length ? [...bits].filter((b) => b === '1').length / bits.length : null);

export function estimate(s = store.get()) {
  const rb = s.recent.r.slice(-80), lb = s.recent.l.slice(-60);
  const r = rb.length >= 10 ? { ratio: ratioOf(rb), n: rb.length } : null;
  const l = lb.length >= 8 ? { ratio: ratioOf(lb), n: lb.length } : null;
  const ws = s.writings.slice(-4);
  const w = ws.length ? { ratio: ws.reduce((a, x) => a + x.total / x.max, 0) / ws.length, n: ws.length } : null;
  const is = s.interviews.slice(-3);
  const sp = is.length ? { ratio: is.reduce((a, x) => a + x.total / 33, 0) / is.length, n: is.length } : null;
  const out = { r, l, w, s: sp };
  for (const k of ['r', 'l', 'w']) if (out[k]) out[k].cse = cse(out[k].ratio);
  if (sp) sp.cse = cse(sp.ratio, 0.8);
  out.total1 = r && l && w ? r.cse + l.cse + w.cse : null;
  // 足りない技能は、わかっている技能の平均で仮置きした見込み
  const known = ['r', 'l', 'w'].filter((k) => out[k]);
  out.guess1 = known.length ? Math.round(known.reduce((a, k) => a + out[k].cse, 0) / known.length * 3) : null;
  out.pass1 = out.total1 != null ? out.total1 >= PASS1 : null;
  out.pass2 = sp ? sp.cse >= PASS2 : null;
  return out;
}

/** 一次試験の各技能の合格ラインの目安（1103 / 3） */
export const SKILL_LINE = Math.round(PASS1 / 3);
