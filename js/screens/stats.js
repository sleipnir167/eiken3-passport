// 記録：合格予測・学習カレンダー・分野別の成績・忘却曲線・苦手・スタンプ
import * as store from '../store.js';
import { CARDS, cardById, meanKey, spellKey, PART1, PART2, PART3_QS, L1, L2, L3, R1_CATS } from '../bank.js';
import { status, forecast, dueSchedule, weakness, STATUS_LABEL } from '../srs.js';
import { levelInfo, BADGES } from '../game.js';
import { estimate, PASS1, PASS2, SKILL_MAX, SKILL_LINE } from '../predict.js';
import { usageThisMonth } from '../ai.js';
import { actions, esc, fmtTime } from '../ui.js';
import { go } from '../app.js';
import { sfx } from '../sound.js';
import { statsOf } from './drill.js';
import { openCard } from './words.js';
import { PART_LABEL, partOf } from '../question.js';

export function renderStats(root) {
  const s = store.get();
  const lv = levelInfo();
  const days = Object.entries(s.days);
  const totalN = days.reduce((a, [, d]) => a + d.n, 0);
  const totalC = days.reduce((a, [, d]) => a + d.c, 0);
  const totalSec = days.reduce((a, [, d]) => a + (d.sec || 0), 0);
  const est = estimate(s);

  // 学習カレンダー（12週）
  const cal = [];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = new Date(today); start.setDate(start.getDate() - 7 * 12 + 1 - start.getDay());
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const k = store.dayKey(d);
    const n = s.days[k]?.n || 0;
    const act = n || Object.keys(s.days[k]?.k || {}).length;
    cal.push({ k, n, lvl: !act ? 0 : n < 10 ? 1 : n < 30 ? 2 : n < 60 ? 3 : 4, dow: d.getDay() });
  }
  // 14日の棒グラフ
  const last14 = Array.from({ length: 14 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() - 13 + i); const x = s.days[store.dayKey(d)] || { n: 0, c: 0 }; return { d, n: x.n, c: x.c }; });
  const max14 = Math.max(10, ...last14.map((x) => x.n));
  // 忘却曲線
  const wordItems = Object.fromEntries(Object.entries(s.items).filter(([k]) => k.startsWith('wm:')));
  const fc = forecast(wordItems, 30);
  const sched = dueSchedule(s.items, 14);
  const maxS = Math.max(5, ...sched);
  // 分野別
  const rows = [
    ...Object.entries(R1_CATS).map(([k, l]) => [`大問1 ${l}`, statsOf(PART1.filter((q) => q.k === k)), { part: 'r1', cat: k }]),
    ['大問2 会話文', statsOf(PART2), { part: 'r2' }],
    ['大問3 長文', statsOf(PART3_QS), { part: 'r3' }],
    ['リスニング第1部', statsOf(L1), { part: 'l1' }],
    ['リスニング第2部', statsOf(L2), { part: 'l2' }],
    ['リスニング第3部', statsOf(L3), { part: 'l3' }],
  ];
  const wordStat = { new: 0, learning: 0, review: 0, mastered: 0, weak: 0 };
  for (const c of CARDS) wordStat[status(s.items[meanKey(c)])]++;
  // 苦手ランキング
  const qById = new Map([...PART1, ...PART2, ...PART3_QS, ...L1, ...L2, ...L3].map((q) => [q.id, q]));
  const weakList = Object.entries(s.items)
    .filter(([, st]) => status(st) === 'weak')
    .map(([id, st]) => ({ id, st, w: weakness(st) }))
    .sort((a, b) => b.w - a.w).slice(0, 15);
  const label = (id) => {
    if (id.startsWith('wm:') || id.startsWith('ws:')) { const c = cardById.get(id.slice(3)); return c ? `${id.startsWith('ws:') ? '✍️ ' : ''}${c.w}　${c.m}` : id; }
    const q = qById.get(id);
    return q ? `${PART_LABEL[partOf(q)].split(' ')[0]}　${(q.q || q.lines?.map((l) => l[1]).join(' ') || '').slice(0, 50)}` : id;
  };
  const usage = usageThisMonth();
  const exams = s.exams.slice(-8);
  const starN = Object.keys(s.stars).length;

  const skillBar = (name, d, max = SKILL_MAX, line = SKILL_LINE) => `<div class="skill ${d ? '' : 'none'}"><div class="skill-head"><b>${name}</b><span>${d ? d.cse : '--'}<small>/${max}</small></span></div><div class="skill-bar"><i style="width:${d ? (d.cse / max) * 100 : 0}%" class="${d && d.cse >= line ? 'ok' : ''}"></i><em style="left:${(line / max) * 100}%"></em></div></div>`;

  root.innerHTML = `
    <header class="page-head"><h1>記録 <small>Lv.${lv.level} ${lv.title.ja}</small></h1></header>
    <section class="stat-tiles">
      <div class="tile"><b>${totalN}</b><small>解いた問題・カード</small></div>
      <div class="tile"><b>${totalN ? Math.round((totalC / totalN) * 100) : '--'}<small>%</small></b><small>通算の正答率</small></div>
      <div class="tile"><b>${Math.floor(totalSec / 3600)}<small>時間</small>${Math.round((totalSec % 3600) / 60)}<small>分</small></b><small>学習時間</small></div>
      <div class="tile"><b>${store.streak()}<small>日</small></b><small>連続学習</small></div>
      <div class="tile"><b>${s.xp}</b><small>XP</small></div>
      <div class="tile"><b>${s.bestCombo}</b><small>最大コンボ</small></div>
    </section>

    <section class="card">
      <h2>合格予測 <small>CSE の目安</small></h2>
      <div class="skills two-col">
        ${skillBar('Reading', est.r)}${skillBar('Listening', est.l)}${skillBar('Writing', est.w)}${skillBar('Speaking（二次）', est.s, SKILL_MAX, PASS2)}
      </div>
      <p class="small">${est.total1 != null ? `一次試験の予測：<b>${est.total1}</b> / 1650（合格ライン ${PASS1}）${est.pass1 ? ' 🌸' : ''}` : 'リーディング・リスニング・ライティングがそろうと一次試験の合計を予測します。'}</p>
      ${exams.length ? `
        <h3 class="sub-h">模試の推移</h3>
        <div class="exam-trend">${exams.map((e) => `<div class="et ${e.pass ? 'pass' : ''}" title="${new Date(e.t).toLocaleDateString('ja-JP')}"><i style="height:${Math.min(100, ((e.cse?.total || 0) / (e.full ? 1650 : 1100)) * 100)}%"></i><small>${e.cse?.total ?? '--'}</small></div>`).join('')}</div>` : ''}
    </section>

    <section class="card">
      <h2>学習カレンダー <small>直近12週</small></h2>
      <div class="heatmap">${cal.map((c) => `<i class="h${c.lvl}" title="${c.k}：${c.n}問"></i>`).join('')}</div>
      <div class="bars14">${last14.map((x) => `<div class="b14"><i style="height:${(x.n / max14) * 100}%"><em style="height:${x.n ? (x.c / x.n) * 100 : 0}%"></em></i><small>${x.d.getDate()}</small></div>`).join('')}</div>
      <p class="tiny muted">棒の高さ＝問題数、濃い部分＝正解数</p>
    </section>

    <section class="card two-charts">
      <div>
        <h2>忘却曲線の予測 <small>単語の平均記憶率</small></h2>
        ${fc.length ? `<svg class="line-chart" viewBox="0 0 300 120" preserveAspectRatio="none" aria-label="今後30日の記憶率">
          <line x1="0" y1="${120 - 0.9 * 110}" x2="300" y2="${120 - 0.9 * 110}" class="guide"/>
          <polyline points="${fc.map((v, i) => `${(i / 30) * 300},${120 - v * 110}`).join(' ')}"/>
        </svg><p class="tiny muted">このまま復習しないと、30日後には ${Math.round((fc[30] || 0) * 100)}% に。点線＝90%</p>` : '<p class="muted small">単語を学習すると表示されます</p>'}
      </div>
      <div>
        <h2>復習の予定 <small>今後14日</small></h2>
        <div class="bars14 sched">${sched.map((n, i) => `<div class="b14"><i style="height:${(n / maxS) * 100}%"></i><small>${i === 0 ? '今日' : i}</small></div>`).join('')}</div>
      </div>
    </section>

    <section class="card">
      <h2>単語の状態</h2>
      <div class="status-bar">${['mastered', 'review', 'learning', 'weak', 'new'].map((k) => `<i class="st-${k}" style="flex:${wordStat[k] || 0.0001}"></i>`).join('')}</div>
      <div class="status-legend">${['mastered', 'review', 'learning', 'weak', 'new'].map((k) => `<span><i class="dot st-${k}"></i>${STATUS_LABEL[k]} ${wordStat[k]}</span>`).join('')}</div>
    </section>

    <section class="card">
      <h2>分野別の成績</h2>
      <table class="stat-table">
        <tr><th>分野</th><th>解いた</th><th>正答率</th><th></th></tr>
        ${rows.map(([name, st, p]) => `<tr><td>${name}</td><td>${st.seen}/${st.total}</td><td><span class="acc ${st.acc == null ? '' : st.acc >= 0.7 ? 'good' : st.acc < 0.5 ? 'bad' : ''}">${st.acc == null ? '--' : `${Math.round(st.acc * 100)}%`}</span></td><td><button class="mini-btn" data-p='${JSON.stringify(p)}'>練習</button></td></tr>`).join('')}
      </table>
    </section>

    <section class="card">
      <h2>苦手ランキング <small>☆ ${starN}件</small></h2>
      ${weakList.length ? `<ol class="weak-list">${weakList.map((w) => `<li><button data-weak="${esc(w.id)}">${esc(label(w.id))}<small>${w.st.c}/${w.st.n}</small></button></li>`).join('')}</ol>` : '<p class="muted small">まだ苦手はありません。どんどん解こう！</p>'}
      <div class="row-btns"><button class="btn primary" data-action="weak-q">🎯 苦手な問題を練習</button><button class="btn ghost" data-action="weak-w">🃏 苦手な単語を練習</button></div>
    </section>

    <section class="card">
      <h2>パスポートスタンプ <small>${Object.keys(s.badges).length}/${BADGES.length}</small></h2>
      <div class="stamps">${BADGES.map((b, i) => `<div class="stamp ${s.badges[b.id] ? 'got' : ''}" style="--r:${((i * 37) % 21) - 10}deg" title="${esc(b.desc)}"><span>${b.icon}</span><b>${esc(b.name)}</b><small>${s.badges[b.id] ? new Date(s.badges[b.id]).toLocaleDateString('ja-JP') : esc(b.desc)}</small></div>`).join('')}</div>
    </section>

    <section class="card">
      <h2>🤖 AIの利用（今月）</h2>
      <p class="small">${usage.calls} 回・${usage.tokens.toLocaleString()} トークン${usage.cost ? `・約 $${usage.cost.toFixed(4)}` : ''}</p>
      <p class="tiny muted">一度もらった解説・添削は端末に保存され、同じ内容なら2回目からはAIを使いません。</p>
    </section>`;

  root.querySelectorAll('[data-p]').forEach((b) => b.addEventListener('click', () => { sfx.select(); go('quiz', JSON.parse(b.dataset.p)); }));
  root.querySelectorAll('[data-weak]').forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.weak;
    if (id.startsWith('wm:') || id.startsWith('ws:')) openCard(id.slice(3));
    else go('quiz', { part: 'ids', ids: id });
  }));
  actions(root, {
    'weak-q': () => go('quiz', { part: 'weak' }),
    'weak-w': () => go('wordplay', { mode: 'flash', src: 'weak' }),
  });
  void fmtTime; void spellKey;
}
