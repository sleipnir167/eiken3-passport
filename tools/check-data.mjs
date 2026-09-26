// データの検証：node tools/check-data.mjs
//  - 単語の重複・例文の { } ・重要度
//  - 問題の選択肢の数・重複・空所「( )」
//  - 模範解答の語数（Eメール 15〜25語・英作文 25〜35語）
import { WORDS_RAW, IDIOMS_RAW, PHRASES_RAW } from '../data/words.js';
import { PART1_RAW, PART2_RAW, PASSAGES } from '../data/reading.js';
import { L1_RAW, L2_RAW, L3_RAW } from '../data/listening.js';
import { EMAILS, ESSAYS } from '../data/writing.js';
import { GRAMMAR } from '../data/grammar.js';

let errors = 0, warns = 0;
const err = (m) => { errors++; console.log('✗', m); };
const warn = (m) => { warns++; console.log('△', m); };
const lines = (raw) => raw.split('\n').map((l) => l.trim()).filter(Boolean);
const words = (t) => (t.match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) || []).length;

// 単語
for (const [name, raw, n] of [['WORDS', WORDS_RAW, 6], ['IDIOMS', IDIOMS_RAW, 6], ['PHRASES', PHRASES_RAW, 6]]) {
  const seen = new Map();
  let count = 0;
  for (const l of lines(raw)) {
    const c = l.split('|');
    count++;
    if (c.length < n) { err(`${name}: 列が足りない: ${l}`); continue; }
    const [w, , m, e, ej, r] = c;
    if (seen.has(w)) warn(`${name}: 重複 "${w}"（最初のものを使用）`);
    seen.set(w, true);
    if (!/\{[^}]+\}/.test(e)) err(`${name}: 例文に { } がない: ${w} / ${e}`);
    if (!m || !ej) err(`${name}: 意味か訳がない: ${w}`);
    if (!['1', '2', '3'].includes(r?.trim())) err(`${name}: 重要度が不正: ${w} (${r})`);
  }
  console.log(`${name}: ${count} 件`);
}

// 大問1
const gkeys = new Set(GRAMMAR.map((g) => g.key));
let p1 = 0;
const qset = new Set();
for (const l of lines(PART1_RAW)) {
  const [q, c, k, x, j] = l.split('|');
  p1++;
  const ch = c.split(' / ').map((s) => s.trim());
  if (ch.length !== 4) err(`大問1: 選択肢が4つでない: ${q}`);
  if (new Set(ch).size !== ch.length) err(`大問1: 選択肢が重複: ${q}`);
  if (!/\(\s*\)/.test(q)) err(`大問1: ( ) がない: ${q}`);
  if (!x || !j) err(`大問1: 解説か訳がない: ${q}`);
  const [cat, g] = k.split(':');
  if (!['noun', 'verb', 'adj', 'adv', 'idiom', 'grammar'].includes(cat)) err(`大問1: 分野が不正: ${k}`);
  if (cat === 'grammar' && !gkeys.has(g)) err(`大問1: 文法キーが不正: ${k}`);
  if (qset.has(q)) err(`大問1: 問題が重複: ${q}`);
  qset.add(q);
}
console.log(`大問1: ${p1} 問`);
// 大問2
let p2 = 0;
for (const l of lines(PART2_RAW)) {
  const [d, c, x, j] = l.split('|');
  p2++;
  const ch = c.split(' / ').map((s) => s.trim()).filter(Boolean);
  if (ch.length !== 4) err(`大問2: 選択肢が4つでない: ${d}`);
  if (!/\(\s*\)/.test(d)) err(`大問2: ( ) がない: ${d}`);
  if (!x || !j) err(`大問2: 解説か訳がない: ${d}`);
}
console.log(`大問2: ${p2} 問`);
// 大問3
let p3 = 0;
for (const p of PASSAGES) {
  for (const q of p.qs) {
    p3++;
    if (q.c.length !== 4) err(`大問3: ${p.id} 選択肢が4つでない: ${q.q}`);
    if (!q.x) err(`大問3: ${p.id} 解説がない`);
  }
  const need = { A: 2, B: 3, C: 5 }[p.type];
  if (p.qs.length !== need) warn(`大問3: ${p.id} の問題数 ${p.qs.length}（本番は ${need}）`);
  console.log(`  ${p.id}: 本文 ${words(p.body)} 語`);
}
console.log(`大問3: ${PASSAGES.length} 題 ${p3} 問`);
// リスニング
for (const [name, raw, nc, cols] of [['第1部', L1_RAW, 3, 5], ['第2部', L2_RAW, 4, 5], ['第3部', L3_RAW, 4, 5]]) {
  let n = 0;
  for (const l of lines(raw)) {
    const c = l.split('|');
    n++;
    if (c.length !== cols) { err(`${name}: 列数 ${c.length}: ${l.slice(0, 60)}`); continue; }
    const ch = (name === '第1部' ? c[1] : c[2]).split(' / ').map((s) => s.trim());
    if (ch.length !== nc) err(`${name}: 選択肢の数 ${ch.length}: ${l.slice(0, 60)}`);
    if (!c[0].split(' // ').every((t) => /^(M|W):\s/.test(t.trim()))) err(`${name}: 話者（M: / W:）がない: ${l.slice(0, 60)}`);
  }
  console.log(`リスニング${name}: ${n} 問`);
}
// ライティング
for (const e of EMAILS) {
  const n = words(e.model);
  if (n < 15 || n > 25) warn(`Eメール ${e.id}: 模範解答 ${n} 語`);
  const qs = (e.body.match(/\[\[(.+?)\]\]/g) || []).length;
  if (qs !== 2) err(`Eメール ${e.id}: 下線部の質問が ${qs} 個`);
  for (const c of e.checks) if (!new RegExp(c.re, 'i').test(e.model)) warn(`Eメール ${e.id}: 模範解答がチェック「${c.label}」に合わない`);
}
for (const e of ESSAYS) {
  const n = words(e.model);
  if (n < 25 || n > 35) warn(`英作文 ${e.id}: 模範解答 ${n} 語`);
}
console.log(`ライティング: Eメール ${EMAILS.length} 題 / 英作文 ${ESSAYS.length} 題`);
console.log(`\nエラー ${errors} / 注意 ${warns}`);
process.exit(errors ? 1 : 0);
