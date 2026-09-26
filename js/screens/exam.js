// 模擬試験（一次試験）：リーディング・ライティング（時間制限つき）→ リスニング（自動で進行）→ 採点
import * as store from '../store.js';
import { PART1, PART2, PART3, L1, L2, L3, part1Pool, shuffleChoices, passageById } from '../bank.js';
import { EMAILS, ESSAYS } from '../../data/writing.js';
import { review, pick, shuffle } from '../srs.js';
import { gainXP, checkBadges } from '../game.js';
import { actions, esc, toast, confirmDialog, fmtTime, wait } from '../ui.js';
import { go } from '../app.js';
import { sfx } from '../sound.js';
import { mascot } from '../mascot.js';
import { stemHTML, passageHTML, feedbackHTML, bindFeedback, playListening, stopAudio, partOf, PART_LABEL } from '../question.js';
import { checkWriting, countWords, RANGE, SCORE_LABEL } from '../wcheck.js';
import { chatJSON, aiReady } from '../ai.js';
import { gradeWritingPrompt } from '../prompts.js';
import { cse, PASS1, SKILL_MAX, SKILL_LINE } from '../predict.js';
import { rain, burst } from '../fx.js';

const byId = () => new Map([...part1Pool(store.get().custom), ...PART2, ...PART3.flatMap((p) => p.qs), ...L1, ...L2, ...L3].map((q) => [q.id, q]));

const KINDS = {
  full: { name: '本番サイズ模試', desc: 'リーディング30問＋ライティング2題（65分）→ リスニング30問（約25分）', min: 65, r: [15, 5], r3: ['A', 'B', 'C'], w: ['email', 'essay'], l: [10, 10, 10] },
  rw: { name: 'リーディング・ライティングだけ', desc: '本番どおり65分。リスニングはなし', min: 65, r: [15, 5], r3: ['A', 'B', 'C'], w: ['email', 'essay'], l: [0, 0, 0] },
  listen: { name: 'リスニングだけ', desc: '30問・約25分。本番どおり2回ずつ放送', min: 0, r: [0, 0], r3: [], w: [], l: [10, 10, 10] },
  mini: { name: 'ミニ模試', desc: '筆記12問＋Eメール1題（20分）→ リスニング9問', min: 20, r: [7, 3], r3: ['A'], w: ['email'], l: [3, 3, 3] },
};

function build(kind) {
  const k = KINDS[kind];
  const s = store.get();
  const opt = { newRatio: 0.5 };
  const r1 = k.r[0] ? pick(part1Pool(s.custom), s.items, k.r[0], opt) : [];
  const r2 = k.r[1] ? pick(PART2, s.items, k.r[1], opt) : [];
  const passages = k.r3.map((t) => shuffle(PART3.filter((p) => p.type === t))[0]);
  const r3 = passages.flatMap((p) => p.qs);
  const l = [L1, L2, L3].flatMap((pool, i) => (k.l[i] ? pick(pool, s.items, k.l[i], opt) : []));
  const writing = k.w.map((w) => { const list = w === 'email' ? EMAILS : ESSAYS; return { kind: w, id: shuffle([...list])[0].id, text: '' }; });
  const read = [...r1, ...r2, ...r3];
  const all = [...read, ...l];
  return {
    kind, started: Date.now(), phase: read.length || writing.length ? 'rw' : 'l',
    remain: k.min * 60, read: read.map((q) => q.id), listen: l.map((q) => q.id), passages: passages.map((p) => p.id),
    sh: Object.fromEntries(all.map((q) => { const x = shuffleChoices(q); return [q.id, x]; })),
    ans: {}, writing, lIdx: 0,
  };
}

export function renderExam(root, params) {
  if (params.run) return runExam(root, store.loadExamDraft());
  const s = store.get();
  const draft = store.loadExamDraft();
  const hist = [...s.exams].reverse().slice(0, 10);
  root.innerHTML = `
    <header class="play-head">
      <button class="icon-btn close" data-action="home" aria-label="閉じる">✕</button>
      <div class="play-title"><b>模擬試験</b><small>本番の形式で実力をチェック</small></div>
    </header>
    <div class="stage exam-menu">
      ${draft ? `<section class="card resume-card"><h2>⏸ 中断した模試があります</h2><p class="small">${KINDS[draft.kind]?.name}（${new Date(draft.started).toLocaleString('ja-JP')}）</p><div class="row-btns"><button class="btn primary" data-action="resume">続きから</button><button class="btn ghost" data-action="discard">破棄する</button></div></section>` : ''}
      <section class="exam-kinds">
        ${Object.entries(KINDS).map(([id, k]) => `<button class="card exam-kind" data-action="start" data-k="${id}"><span class="ek-icon">${{ full: '✈️', rw: '📖', listen: '🎧', mini: '⚡' }[id]}</span><b>${k.name}</b><small>${k.desc}</small></button>`).join('')}
      </section>
      <section class="card">
        <h2>英検3級 一次試験の構成</h2>
        <table class="exam-table">
          <tr><th>技能</th><th>内容</th><th>CSE</th></tr>
          <tr><td>リーディング</td><td>大問1 語句15問・大問2 会話文5問・大問3 長文10問</td><td>550</td></tr>
          <tr><td>ライティング</td><td>Eメール（15〜25語）・英作文（25〜35語）</td><td>550</td></tr>
          <tr><td>リスニング</td><td>第1部〜第3部 各10問（2回放送）</td><td>550</td></tr>
          <tr class="sum"><td colspan="2">合格基準スコア</td><td>${PASS1} / 1650</td></tr>
        </table>
        <p class="tiny muted">筆記（リーディング＋ライティング）65分、リスニング約25分。この模試の CSE は正答率からの換算による目安です。</p>
      </section>
      ${hist.length ? `<section class="card"><h2>これまでの模試</h2><ul class="exam-hist">${hist.map((e) => `<li class="${e.pass ? 'pass' : ''}"><span>${new Date(e.t).toLocaleDateString('ja-JP')}</span><b>${KINDS[e.kind]?.name || ''}</b><span>R ${e.r ? `${e.r.c}/${e.r.n}` : '-'}・L ${e.l ? `${e.l.c}/${e.l.n}` : '-'}・W ${e.w ? `${e.w.s}/${e.w.max}` : '-'}</span><b class="ecse">${e.cse?.total ?? '--'}</b></li>`).join('')}</ul></section>` : ''}
    </div>`;
  actions(root, {
    home: () => go('home'),
    start: async (el) => {
      if (draft && !(await confirmDialog('中断中の模試は破棄されます。新しく始めますか？', { ok: '始める' }))) return;
      const d = build(el.dataset.k);
      store.saveExamDraft(d);
      sfx.chime();
      go('exam', { run: 1, t: Date.now() });
    },
    resume: () => go('exam', { run: 1, t: Date.now() }),
    discard: async () => { if (await confirmDialog('中断した模試を破棄しますか？', { ok: '破棄', danger: true })) { store.clearExamDraft(); go('exam', { t: Date.now() }); } },
  });
}

function runExam(root, d) {
  if (!d) { go('exam'); return; }
  const Q = byId();
  let finished = false;
  const save = () => { if (!finished) store.saveExamDraft(d); };
  let timer = null;
  let aborted = false;

  // ---------------- リーディング・ライティング ----------------
  function rw() {
    const read = d.read.map((id) => Q.get(id)).filter(Boolean);
    const r1 = read.filter((q) => partOf(q) === 'r1'), r2 = read.filter((q) => partOf(q) === 'r2');
    let n = 0;
    const qBlock = (q) => {
      n++;
      const sh = d.sh[q.id];
      const a = d.ans[q.id];
      return `<div class="exq" id="q-${n}" data-id="${esc(q.id)}"><span class="exq-n">(${n})</span>${stemHTML(q)}<div class="choices compact">${sh.c.map((c, i) => `<button class="choice ${a === i ? 'sel' : ''}" data-action="ans" data-id="${esc(q.id)}" data-i="${i}"><span class="num">${i + 1}</span><span class="ctext">${esc(c)}</span></button>`).join('')}</div></div>`;
    };
    const wBlock = (w, i) => {
      const p = (w.kind === 'email' ? EMAILS : ESSAYS).find((x) => x.id === w.id);
      const [lo, hi] = RANGE[w.kind];
      return `<section class="card exam-sec" id="w-${i}">
        <h2>${w.kind === 'email' ? '4 ライティング（Eメール）' : '5 ライティング（英作文）'}</h2>
        ${w.kind === 'email'
          ? `<p class="small">外国人の友達（${esc(p.from)}）からのEメールに返信を書きなさい。<b>下線部の2つの質問</b>に答えること。語数の目安は${lo}〜${hi}語。</p><div class="mail"><div class="mail-body">${esc(p.body).replace(/\[\[(.+?)\]\]/g, '<u>$1</u>').replace(/\n/g, '<br>')}</div></div><p class="mail-fixed">Hi, ${esc(p.from)}!<br>Thank you for your e-mail.</p>`
          : `<p class="small">QUESTION について、あなたの考えとその理由を2つ英文で書きなさい。語数の目安は${lo}〜${hi}語。</p><div class="question-box"><small>QUESTION</small><p>${esc(p.q)}</p></div>`}
        <textarea class="w-text" data-w="${i}" rows="5" autocapitalize="sentences" autocorrect="off" spellcheck="false" placeholder="ここに英文を書く（iPad はペンで書いてもOK）">${esc(w.text)}</textarea>
        ${w.kind === 'email' ? '<p class="mail-fixed">Best wishes,</p>' : ''}
        <p class="wc" data-wc="${i}">${countWords(w.text)} 語 <small>/ ${lo}〜${hi}</small></p>
      </section>`;
    };
    const passages = d.passages.map((pid) => passageById.get(pid)).filter(Boolean);
    let html = '';
    if (r1.length) html += `<section class="card exam-sec"><h2>1 短文の語句空所補充</h2><p class="small muted">(　)に入れるのに最も適切なものを1つ選びなさい。</p>${r1.map(qBlock).join('')}</section>`;
    if (r2.length) html += `<section class="card exam-sec"><h2>2 会話文の文空所補充</h2><p class="small muted">(　)に入れるのに最も適切なものを1つ選びなさい。</p>${r2.map(qBlock).join('')}</section>`;
    for (const p of passages) html += `<section class="card exam-sec"><h2>3${p.type} ${p.type === 'A' ? '掲示' : p.type === 'B' ? 'Eメール' : '長文'}</h2>${passageHTML(p.id)}${p.qs.map(qBlock).join('')}</section>`;
    html += d.writing.map(wBlock).join('');
    const total = n;
    root.innerHTML = `
      <header class="play-head exam-head">
        <button class="icon-btn close" data-action="pause" aria-label="中断">⏸</button>
        <div class="play-title"><b>${KINDS[d.kind].name}</b><small>リーディング・ライティング</small></div>
        <span class="exam-timer"><b>${fmtTime(d.remain)}</b></span>
        <button class="btn primary small" data-action="to-next">${d.listen.length ? 'リスニングへ ▶' : '提出する'}</button>
      </header>
      <div class="exam-layout">
        <nav class="exam-nav">
          ${Array.from({ length: total }, (_, i) => `<a href="#q-${i + 1}" class="en-q" data-n="${i + 1}">${i + 1}</a>`).join('')}
          ${d.writing.map((w, i) => `<a href="#w-${i}" class="en-q w" data-w="${i}">${w.kind === 'email' ? '✉' : '✎'}</a>`).join('')}
        </nav>
        <main class="exam-main">${html}</main>
      </div>`;
    const updNav = () => {
      root.querySelectorAll('.exq').forEach((el, i) => root.querySelector(`.en-q[data-n="${i + 1}"]`)?.classList.toggle('done', d.ans[el.dataset.id] != null));
      d.writing.forEach((w, i) => root.querySelector(`.en-q[data-w="${i}"]`)?.classList.toggle('done', countWords(w.text) > 3));
    };
    updNav();
    root.querySelectorAll('.en-q').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); root.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }));
    root.querySelectorAll('.w-text').forEach((ta) => ta.addEventListener('input', () => {
      const i = +ta.dataset.w;
      d.writing[i].text = ta.value;
      const [lo, hi] = RANGE[d.writing[i].kind];
      root.querySelector(`[data-wc="${i}"]`).innerHTML = `${countWords(ta.value)} 語 <small>/ ${lo}〜${hi}</small>`;
      save(); updNav();
    }));
    clearInterval(timer);
    timer = setInterval(() => {
      d.remain = Math.max(0, d.remain - 1);
      const el = root.querySelector('.exam-timer b');
      if (el) { el.textContent = fmtTime(d.remain); el.parentElement.classList.toggle('low', d.remain < 300); }
      if (d.remain % 10 === 0) save();
      if (d.remain === 300) toast('残り5分です', { icon: '⏰' });
      if (d.remain <= 0) { clearInterval(timer); toast('時間になりました', { icon: '⏰' }); sfx.chime(); nextPhase(true); }
    }, 1000);
    actions(root, {
      ans: (el) => {
        d.ans[el.dataset.id] = +el.dataset.i;
        el.parentElement.querySelectorAll('.choice').forEach((b) => b.classList.toggle('sel', b === el));
        sfx.tap(); save(); updNav();
      },
      'to-next': () => nextPhase(false),
      pause: async () => { save(); if (await confirmDialog('模試を中断しますか？<br><small>あとで続きから再開できます</small>', { ok: '中断する' })) { aborted = true; go('exam'); } },
    });
  }

  async function nextPhase(force) {
    const unanswered = d.read.filter((id) => d.ans[id] == null).length;
    if (!force && unanswered && !(await confirmDialog(`まだ答えていない問題が ${unanswered} 問あります。${d.listen.length ? 'リスニングに進みますか？' : '提出しますか？'}<br><small>リーディング・ライティングには戻れません</small>`, { ok: '進む' }))) return;
    clearInterval(timer);
    if (d.listen.length) { d.phase = 'l'; save(); listenPhase(); } else submit();
  }

  // ---------------- リスニング ----------------
  function listenPhase() {
    const list = d.listen.map((id) => Q.get(id)).filter(Boolean);
    let paused = false;
    root.innerHTML = `
      <header class="play-head exam-head">
        <button class="icon-btn close" data-action="pause" aria-label="中断">⏸</button>
        <div class="play-title"><b>${KINDS[d.kind].name}</b><small>リスニング</small></div>
        <div class="play-prog"><i></i></div>
        <span class="play-count"></span>
      </header>
      <div class="stage exam-listen">
        <div class="card el-card">
          <p class="el-part"></p>
          <div class="listen-box big"><div class="lb-visual"><span class="lb-emoji">🎧</span><span class="eq"><i></i><i></i><i></i><i></i><i></i></span></div></div>
          <p class="el-status">準備中…</p>
          <div class="choices el-choices"></div>
          <div class="row-btns"><button class="mini-btn" data-action="hold">⏯ 一時停止</button><button class="mini-btn" data-action="skip">次の問題へ ▶</button></div>
        </div>
      </div>`;
    const status = root.querySelector('.el-status');
    const box = root.querySelector('.listen-box');
    let skipper = null;
    async function playOne(i) {
      if (aborted) return;
      if (i >= list.length) return submit();
      d.lIdx = i; save();
      const q = list[i];
      const p = partOf(q);
      const sh = d.sh[q.id];
      const partStart = p === 'l1' ? 0 : p === 'l2' ? list.findIndex((x) => partOf(x) === 'l2') : list.findIndex((x) => partOf(x) === 'l3');
      root.querySelector('.el-part').textContent = `${PART_LABEL[p]}　No.${i - partStart + 1}`;
      root.querySelector('.play-prog i').style.width = `${(i / list.length) * 100}%`;
      root.querySelector('.play-count').textContent = `${i + 1} / ${list.length}`;
      const ch = root.querySelector('.el-choices');
      ch.innerHTML = sh.c.map((c, k) => `<button class="choice ${d.ans[q.id] === k ? 'sel' : ''}" data-action="lans" data-id="${esc(q.id)}" data-i="${k}"><span class="num">${k + 1}</span><span class="ctext">${p === 'l1' ? '' : esc(c)}</span></button>`).join('');
      if (p === 'l1' && q.icon) root.querySelector('.lb-emoji').textContent = q.icon; else root.querySelector('.lb-emoji').textContent = '🎧';
      await wait(900);
      status.textContent = '🔊 放送中…（2回流れます）';
      box.classList.add('playing');
      let skipped = false;
      skipper = () => { skipped = true; stopAudio(); };
      await playListening(q, sh, { times: 2 });
      box.classList.remove('playing');
      if (aborted) return;
      if (!skipped) {
        for (let t = 10; t > 0; t--) {
          if (aborted || skipped) break;
          while (paused && !aborted) await wait(300);
          status.textContent = `✏️ 解答時間 ${t} 秒`;
          await wait(1000);
        }
      }
      skipper = null;
      playOne(i + 1);
    }
    actions(root, {
      lans: (el) => { d.ans[el.dataset.id] = +el.dataset.i; el.parentElement.querySelectorAll('.choice').forEach((b) => b.classList.toggle('sel', b === el)); sfx.tap(); save(); },
      hold: (el) => { paused = !paused; el.textContent = paused ? '▶ 再開' : '⏯ 一時停止'; if (paused) status.textContent = '⏸ 一時停止中（解答時間を止めています）'; },
      skip: () => skipper?.(),
      pause: async () => { save(); if (await confirmDialog('模試を中断しますか？<br><small>リスニングは今の問題から再開できます</small>', { ok: '中断する' })) { aborted = true; stopAudio(); go('exam'); } },
    });
    playOne(d.lIdx || 0);
  }

  // ---------------- 採点 ----------------
  async function submit() {
    if (finished) return;
    finished = true;
    clearInterval(timer);
    stopAudio();
    root.innerHTML = `<div class="stage"><div class="card ai-loading">${mascot('think', 'bob', 'examiner')}<p>採点しています…</p></div></div>`;
    const s = store.get();
    const readQs = d.read.map((id) => Q.get(id)).filter(Boolean);
    const lisQs = d.listen.map((id) => Q.get(id)).filter(Boolean);
    const okOf = (q) => d.ans[q.id] === d.sh[q.id].a;
    // 忘却曲線にも反映
    store.update((st) => { for (const q of [...readQs, ...lisQs]) if (d.ans[q.id] != null) st.items[q.id] = review(st.items[q.id], okOf(q)); });
    for (const q of [...readQs, ...lisQs]) if (d.ans[q.id] != null) store.logAnswer(partOf(q), okOf(q), 0);
    const r = readQs.length ? { c: readQs.filter(okOf).length, n: readQs.length } : null;
    const l = lisQs.length ? { c: lisQs.filter(okOf).length, n: lisQs.length } : null;
    // ライティング
    let w = null;
    const wDetails = [];
    if (d.writing.length) {
      let sum = 0, max = 0, usedAI = false;
      for (const wt of d.writing) {
        const p = (wt.kind === 'email' ? EMAILS : ESSAYS).find((x) => x.id === wt.id);
        const local = checkWriting(wt.text, { kind: wt.kind, checks: p.checks || [] });
        let scores = local.estimate.scores, total = local.estimate.total, mx = local.estimate.max, ai = false, fb = '';
        if (aiReady() && countWords(wt.text) >= 5) {
          try {
            const res = await chatJSON(gradeWritingPrompt({ kind: wt.kind, prompt: wt.kind === 'email' ? p.body.replace(/\[\[(.+?)\]\]/g, '<u>$1</u>') : `QUESTION: ${p.q}`, text: wt.text }), { maxTokens: 1500 });
            if (res.data?.scores) {
              const me = wt.kind === 'email' ? 3 : 4;
              scores = Object.fromEntries(Object.keys(local.estimate.scores).map((k) => [k, Math.max(0, Math.min(me, Math.round(Number(res.data.scores[k]) || 0)))]));
              total = Object.values(scores).reduce((a, b) => a + b, 0);
              ai = true; usedAI = true;
              fb = [res.data.summary, res.data.advice].filter(Boolean).join('\n');
              wDetails.push({ ...wt, p, scores, total, max: mx, ai, fb, model: res.data.model_answer, corrected: res.data.corrected_text });
            }
          } catch (e) { console.warn(e); }
        }
        if (!ai) wDetails.push({ ...wt, p, scores, total, max: mx, ai, fb: '', errors: local.errors });
        sum += total; max += mx;
        store.update((st) => st.writings.push({ kind: wt.kind, pid: wt.id, prompt: wt.kind === 'email' ? p.body : p.q, text: wt.text, scores, total, max: mx, ai, feedback: fb, t: Date.now(), exam: true }));
      }
      w = { s: sum, max, ai: usedAI };
    }
    const cs = {
      r: r ? cse(r.c / r.n) : null, l: l ? cse(l.c / l.n) : null, w: w ? cse(w.s / w.max) : null,
    };
    const full = cs.r != null && cs.l != null && cs.w != null;
    cs.total = full ? cs.r + cs.l + cs.w : [cs.r, cs.l, cs.w].filter((x) => x != null).reduce((a, b) => a + b, 0);
    const pass = full ? cs.total >= PASS1 : [cs.r, cs.l, cs.w].filter((x) => x != null).every((x) => x >= SKILL_LINE);
    store.update((st) => { st.exams.push({ t: Date.now(), kind: d.kind, r, l, w, cse: cs, pass, full }); });
    store.clearExamDraft();
    const xp = 60 + Math.round(((r?.c || 0) + (l?.c || 0)) * 2 + (w ? (w.s / w.max) * 30 : 0));
    gainXP(xp);
    checkBadges({});
    if (pass) { sfx.pass(); rain(120); } else sfx.finish();
    showResult({ readQs, lisQs, r, l, w, cs, pass, full, xp, wDetails, okOf });
    void s;
  }

  function showResult({ readQs, lisQs, r, l, w, cs, pass, full, xp, wDetails, okOf }) {
    const bar = (label, v, raw) => `<div class="skill ${v == null ? 'none' : ''}"><div class="skill-head"><b>${label}</b><span>${v ?? '--'}<small>/${SKILL_MAX}</small></span></div><div class="skill-bar"><i style="width:${((v || 0) / SKILL_MAX) * 100}%" class="${v >= SKILL_LINE ? 'ok' : ''}"></i><em style="left:${(SKILL_LINE / SKILL_MAX) * 100}%"></em></div><small class="muted">${raw}</small></div>`;
    const wrong = [...readQs, ...lisQs].filter((q) => !okOf(q)).map((q) => q.id);
    root.innerHTML = `
      <header class="play-head"><button class="icon-btn close" data-action="close" aria-label="閉じる">✕</button><div class="play-title"><b>模試の結果</b><small>${KINDS[d.kind].name}</small></div></header>
      <div class="stage exam-result">
        <section class="card result ${pass ? 'pass' : ''}">
          <div class="result-top">
            ${mascot(pass ? 'cheer' : 'normal', 'bob')}
            <div>
              <p class="eyebrow">${full ? '一次試験 CSE スコア（目安）' : '技能別 CSE スコア（目安）'}</p>
              <p class="result-score"><b>${cs.total}</b>${full ? ` / 1650` : ''}</p>
              <p class="result-sub">${pass ? '🌸 合格ラインをこえています！' : full ? `合格ライン ${PASS1} まであと ${PASS1 - cs.total}` : '各技能の合格ラインの目安と比べてみよう'}・+${xp} XP</p>
            </div>
          </div>
          <div class="skills">
            ${r ? bar('Reading', cs.r, `${r.c} / ${r.n} 問正解`) : ''}
            ${l ? bar('Listening', cs.l, `${l.c} / ${l.n} 問正解`) : ''}
            ${w ? bar('Writing', cs.w, `${w.s} / ${w.max} 点（${w.ai ? 'AI採点' : '自動チェックの目安'}）`) : ''}
          </div>
        </section>
        ${wDetails.map((wd) => `
          <section class="card">
            <h2>${wd.kind === 'email' ? 'Eメール' : '英作文'} <small>${wd.total}/${wd.max}（${Object.entries(wd.scores).map(([k, v]) => `${SCORE_LABEL[k]} ${v}`).join('・')}）</small></h2>
            <div class="answer-view">${esc(wd.text) || '<span class="muted">（無回答）</span>'}</div>
            ${wd.fb ? `<p class="small">${esc(wd.fb)}</p>` : ''}
            ${wd.errors?.length ? `<ul class="err-list">${wd.errors.map((e) => `<li><mark>${esc(e.text)}</mark> ${esc(e.msg)}</li>`).join('')}</ul>` : ''}
            <details><summary>模範解答</summary><div class="answer-view model">${esc(wd.model || wd.p.model)}</div></details>
          </section>`).join('')}
        <section class="card">
          <h2>見直し <small>タップで解説</small></h2>
          <ul class="review-list">
            ${[...readQs, ...lisQs].map((q, i) => `<li class="${okOf(q) ? 'ok' : 'ng'}"><button data-action="rev" data-id="${esc(q.id)}"><span class="mark">${okOf(q) ? '○' : '×'}</span><small>${PART_LABEL[partOf(q)].split(' ')[0]}</small><span>${esc((q.q || q.lines?.map((x) => x[1]).join(' ') || '').slice(0, 60))}</span><span class="ra">${d.ans[q.id] != null ? d.ans[q.id] + 1 : '-'} → ${d.sh[q.id].a + 1}</span></button><div class="rev-body" hidden></div></li>`).join('')}
          </ul>
        </section>
        <div class="result-actions">
          ${wrong.length ? `<button class="btn ghost" data-action="retry-wrong">まちがえた${wrong.length}問を練習</button>` : ''}
          <button class="btn primary" data-action="close">模試メニューへ</button>
        </div>
      </div>`;
    actions(root, {
      close: () => go('exam', { t: Date.now() }),
      'retry-wrong': () => go('quiz', { part: 'ids', ids: wrong.join(',') }),
      rev: (el) => {
        const body = el.nextElementSibling;
        if (!body.hidden) { body.hidden = true; return; }
        const q = Q.get(el.dataset.id);
        const p = partOf(q);
        body.innerHTML = `${q.pid && p === 'r3' ? '' : stemHTML(q, { fill: d.sh[q.id].c[d.sh[q.id].a] })}${feedbackHTML(q, d.sh[q.id], d.ans[q.id] ?? null)}`;
        body.hidden = false;
        bindFeedback(body, q, d.sh[q.id], d.ans[q.id] ?? null);
      },
    });
    if (pass) burst({ count: 80, kind: 'star' });
  }

  if (d.phase === 'l') listenPhase(); else rw();
  return () => { aborted = true; clearInterval(timer); stopAudio(); save(); };
}
