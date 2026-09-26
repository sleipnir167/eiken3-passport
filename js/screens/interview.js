// AI 面接（二次試験の模擬面接）
//  入室 → 黙読20秒 → 音読 → No.1〜3（カード）→ カードを裏返して No.4・5（自分のこと）→ 退室
//  音声：ブラウザの読み上げ（面接官）と音声認識（受験者）。音声認識がない端末では文字入力で答える
import * as store from '../store.js';
import { CARDS, PERSONAL_WH, PERSONAL_YN, SCRIPT } from '../../data/interview.js';
import { speak, stop as stopSpeech, listen, stopListening, abortListening, sttSupported, alignReading, normWords } from '../speech.js';
import { chatJSON, aiReady } from '../ai.js';
import { gradeInterviewPrompt } from '../prompts.js';
import { actions, esc, toast, confirmDialog, modal, wait } from '../ui.js';
import { go } from '../app.js';
import { sfx } from '../sound.js';
import { mascot } from '../mascot.js';
import { gainXP, logActivity, checkBadges, award } from '../game.js';
import { cse, PASS2 } from '../predict.js';
import { burst, rain } from '../fx.js';

/** No.4 の答えが質問の形に合っているか（例：did → 過去形、going to → 予定、How many → 数） */
function whFits(q, ans) {
  const a = ` ${String(ans).toLowerCase()} `;
  const rules = [
    [/\b(did|last|yesterday|this morning)\b/i, /\b(\w+ed|went|ate|had|saw|made|got|took|bought|came|did|was|were|read|met|slept|swam|ran|wrote|sang|drank)\b/],
    [/going to|this evening|next weekend/i, /(going to|gonna|\bwill\b|'ll|\bplan)/],
    [/want to be/i, /\b(want|be|become)\b/],
    [/would like/i, /\b(like|want|'d)\b/],
    [/how many/i, /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b/],
    [/what time/i, /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|o'clock|thirty|at)\b/],
    [/how do you (usually )?come/i, /\b(by|walk|on foot|bike|bus|train|car)\b/],
    [/\bwhere\b/i, /\b(to|in|at|go|visit)\b/],
    [/\busually\b/i, /\b(usually|often|always|sometimes|i \w+)\b/],
  ];
  for (const [qre, are] of rules) if (qre.test(q)) return are.test(a);
  return true;
}

const bestOf = (id) => store.get().interviews.filter((x) => x.card === id).reduce((m, x) => Math.max(m, x.total), -1);

export function renderInterview(root) {
  const s = store.get();
  const hist = [...s.interviews].reverse().slice(0, 10);
  root.innerHTML = `
    <header class="page-head"><h1>AI面接 <small>二次試験（スピーキング）の練習</small></h1></header>
    <section class="card interview-intro">
      <div class="ii-owl">${mascot('normal', 'bob', 'examiner')}</div>
      <div>
        <h2>本番と同じ流れで練習しよう</h2>
        <ol class="flow">
          <li><b>入室</b>：あいさつ・名前・カードを受け取る</li>
          <li><b>黙読</b>：20秒でカードの英文を読む</li>
          <li><b>音読</b>：英文を声に出して読む（5点）</li>
          <li><b>No.1〜3</b>：英文とイラストについての質問（各5点）</li>
          <li><b>No.4・5</b>：あなた自身についての質問（各5点）</li>
          <li><b>アティチュード</b>：積極的に・はっきり答える態度（3点）</li>
        </ol>
        <p class="small muted">合計33点。合格の目安は CSE ${PASS2}点（素点でおよそ6割）。${sttSupported() ? 'マイクで話して答えます。' : 'この端末は音声認識に対応していないので、文字入力（キーボードの音声入力🎤も可）で答えます。'}</p>
      </div>
    </section>
    <section class="card">
      <h2>モードを選ぶ</h2>
      <div class="mode-grid two">
        <button class="mode" data-action="start" data-m="practice"><span class="mode-icon">🌱</span><b>練習モード</b><small>字幕あり・答えたあとに模範解答が見られる・言い直しOK</small></button>
        <button class="mode" data-action="start" data-m="real"><span class="mode-icon">🎯</span><b>本番モード</b><small>字幕なし・黙読は20秒ちょうど・本番どおりの流れ</small></button>
      </div>
      <h3 class="sub-h">問題カード</h3>
      <div class="icard-grid">
        <button class="icard random" data-action="start" data-m="practice" data-card="random"><span>🎲</span><b>おまかせ</b></button>
        ${CARDS.map((c) => { const b = bestOf(c.id); return `<button class="icard" data-action="start" data-m="practice" data-card="${c.id}"><div class="icard-img">${c.scene()}</div><b>${esc(c.title)}</b>${b >= 0 ? `<span class="pi-score ${b >= 20 ? 'good' : ''}">${b}/33</span>` : '<span class="pi-score new">NEW</span>'}</button>`; }).join('')}
      </div>
    </section>
    <section class="card">
      <h2>🎤 マイクのテスト</h2>
      <p class="small muted">「Hello, my name is ～.」と話してみよう。iPad は「設定 → 一般 → キーボード → 音声入力」をオンにしておくと認識されやすくなります。</p>
      <div class="row-btns"><button class="btn ghost" data-action="mic-test" ${sttSupported() ? '' : 'disabled'}>🎤 テスト</button><span class="mic-test-out small"></span></div>
    </section>
    ${hist.length ? `<section class="card"><h2>これまでの面接</h2><ul class="hist-list">${hist.map((h) => `<li><button data-action="hist" data-t="${h.t}"><span class="tag">${esc(CARDS.find((c) => c.id === h.card)?.title || '')}</span><span class="hl-text">音読 ${h.scores?.reading ?? '-'}・No.1〜5 ${(h.scores?.answers || []).join('/')}</span><b>${h.total}/33</b><small>${h.ai ? 'AI' : '自動'}・${new Date(h.t).toLocaleDateString('ja-JP')}</small></button></li>`).join('')}</ul></section>` : ''}`;

  actions(root, {
    start: (el) => { sfx.chime(); go('talk', { mode: el.dataset.m, card: el.dataset.card || 'random' }); },
    'mic-test': async (el) => {
      const out = root.querySelector('.mic-test-out');
      el.classList.add('loading');
      out.textContent = '聞いています…';
      try {
        const r = await listen({ onInterim: (t) => { out.textContent = t; }, maxMs: 8000 });
        out.textContent = r.text ? `認識：「${r.text}」` : '聞き取れませんでした';
      } catch (e) { out.textContent = e.message; }
      el.classList.remove('loading');
    },
    hist: (el) => {
      const h = store.get().interviews.find((x) => String(x.t) === el.dataset.t);
      if (h) modal(`<h2>面接の記録</h2>${h.report || ''}<div class="modal-actions"><button class="btn ghost" data-close>閉じる</button></div>`, { cls: 'wide' });
    },
  });
}

// ================= 面接セッション =================
export function renderInterviewSession(root, params) {
  const real = params.mode === 'real';
  const st = store.settings();
  const s = store.get();
  const card = CARDS.find((c) => c.id === params.card) || (() => {
    const fresh = CARDS.filter((c) => bestOf(c.id) < 0);
    const list = fresh.length ? fresh : CARDS;
    return list[Math.floor(Math.random() * list.length)];
  })();
  const wh = PERSONAL_WH[Math.floor(Math.random() * PERSONAL_WH.length)];
  const yn = PERSONAL_YN[Math.floor(Math.random() * PERSONAL_YN.length)];
  const examinerGender = Math.random() < 0.5 ? 'M' : 'F';
  const name = st.name || '';
  const subtitles = !real && st.subtitles;
  let aborted = false;
  const log = { greet: [], reading: '', readingRatio: 0, answers: [] };

  const STEPS = ['入室', '黙読', '音読', 'No.1', 'No.2', 'No.3', 'No.4', 'No.5', '退室'];
  root.innerHTML = `
    <header class="play-head">
      <button class="icon-btn close" data-action="quit" aria-label="やめる">✕</button>
      <div class="play-title"><b>AI面接 ${real ? '本番モード' : '練習モード'}</b><small>${esc(card.title)}</small></div>
      <ol class="talk-steps">${STEPS.map((x, i) => `<li data-i="${i}">${x}</li>`).join('')}</ol>
    </header>
    <div class="stage talk-stage">
      <section class="examiner">
        <div class="ex-avatar">${mascot('normal', '', 'examiner')}</div>
        <div class="ex-bubble ${subtitles ? '' : 'nosub'}"><span class="ex-text">…</span></div>
      </section>
      <section class="card-area">
        <div class="pcard" hidden>
          <div class="pcard-front">
            <h3>${esc(card.title)}</h3>
            <p class="pcard-passage">${esc(card.passage)}</p>
            <div class="pcard-img">${card.scene()}</div>
          </div>
          <div class="pcard-back"><span>EIKEN<br>GRADE 3</span></div>
          <div class="countdown" hidden><b>20</b><small>黙読</small></div>
        </div>
        <div class="card-placeholder">${mascot('normal', 'sm bob')}<p>面接官の話を聞いて、声に出して答えよう</p></div>
      </section>
      <section class="you">
        <div class="transcript" aria-live="polite"></div>
        <div class="you-row">
          <button class="mic-btn" data-action="mic" aria-label="話す" disabled><span>🎤</span></button>
          <div class="you-tools">
            <button class="btn ok small" data-action="done" hidden>答え終わった ✓</button>
            <button class="mini-btn" data-action="type">⌨️ 文字で答える</button>
            <button class="mini-btn" data-action="repeat" hidden>🔁 もう一度（Pardon?）</button>
          </div>
        </div>
        <form class="type-answer" hidden><input class="text-in" placeholder="英語で答えを入力（キーボードの🎤でも入力できます）" autocomplete="off" autocapitalize="sentences"><button class="btn primary small">送信</button></form>
        <div class="hint-box" hidden></div>
      </section>
    </div>`;

  const $ = (sel) => root.querySelector(sel);
  const exText = $('.ex-text');
  const exAvatar = $('.ex-avatar');
  const transcript = $('.transcript');
  const mic = $('.mic-btn');
  let answerResolve = null, lastQuestion = '', listening = false, typed = !sttSupported(), repeatCount = 0;

  const setStep = (i) => root.querySelectorAll('.talk-steps li').forEach((li) => { li.classList.toggle('now', +li.dataset.i === i); li.classList.toggle('done', +li.dataset.i < i); });
  const check = () => { if (aborted) throw new Error('aborted'); };

  async function say(text, { sub = text } = {}) {
    check();
    exText.textContent = subtitles ? sub : '🔊 ……';
    exAvatar.firstElementChild?.classList.add('talking');
    await speak(text, { gender: examinerGender, rate: Math.min(1, (st.rate || 0.9) + 0.02) });
    exAvatar.firstElementChild?.classList.remove('talking');
    check();
  }

  /** 答えを受けつけている間だけ、マイクと入力欄を使えるようにする */
  function setWaiting(on) {
    mic.disabled = !on;
    root.querySelectorAll('.type-answer input, .type-answer button').forEach((x) => { x.disabled = !on; });
    root.querySelector('.you').classList.toggle('waiting', on);
  }
  setWaiting(false);

  /** 受験者の答えを待つ */
  function waitAnswer({ reading = false, maxMs = 30000 } = {}) {
    check();
    transcript.textContent = '';
    transcript.className = 'transcript';
    $('.hint-box').hidden = true;
    return new Promise((resolve) => {
      answerResolve = (t) => { answerResolve = null; setWaiting(false); resolve(t); };
      setWaiting(true);
      $('[data-action="repeat"]').hidden = reading || repeatCount >= 2;
      if (typed) { showType(); return; }
      startListen({ reading, maxMs });
    });
  }
  async function startListen({ reading = false, maxMs = 30000 } = {}) {
    if (listening) return;
    listening = true;
    mic.classList.add('on');
    $('[data-action="done"]').hidden = false;
    sfx.micOn();
    try {
      const r = await listen({ onInterim: (t) => { transcript.textContent = t; }, maxMs: reading ? 60000 : maxMs, silenceMs: reading ? 3500 : 2600 });
      listening = false;
      mic.classList.remove('on');
      sfx.micOff();
      $('[data-action="done"]').hidden = true;
      if (!answerResolve) return;
      if (!r.text) {
        transcript.innerHTML = '<span class="muted">聞き取れませんでした。🎤 をタップしてもう一度話すか、⌨️ 文字で答えてね</span>';
        return;
      }
      transcript.textContent = r.text;
      answerResolve(r.text);
    } catch (e) {
      listening = false;
      mic.classList.remove('on');
      $('[data-action="done"]').hidden = true;
      transcript.innerHTML = `<span class="err">${esc(e.message)}</span>`;
      if (/許可|not-allowed|service/.test(e.message)) { typed = true; showType(); }
    }
  }
  function showType() {
    const f = $('.type-answer');
    f.hidden = false;
    setTimeout(() => { if (answerResolve) f.querySelector('input').focus(); }, 50);
  }
  $('.type-answer').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const v = input.value.trim();
    if (!v || !answerResolve) return;
    input.value = '';
    transcript.textContent = v;
    answerResolve(v);
  });

  const isPardon = (t) => /\b(pardon|sorry|again|repeat)\b/i.test(t) && normWords(t).length <= 6;

  /** 練習モード：答えのあとに例を見せて「言い直す／次へ」を選ぶ */
  function practicePause(hint) {
    return new Promise((resolve) => {
      const hb = $('.hint-box');
      hb.hidden = false;
      hb.innerHTML = `<p><b>💡 答え方の例</b> ${esc(hint)} <button class="icon-btn speak small" data-hint-say aria-label="例を聞く">🔊</button></p>
        <div class="row-btns"><button class="mini-btn" data-p="redo">↺ 言い直す</button><button class="btn primary small" data-p="next">次へ ▶</button></div>`;
      hb.querySelector('[data-hint-say]').addEventListener('click', () => speak(hint));
      hb.querySelectorAll('[data-p]').forEach((b) => b.addEventListener('click', () => { hb.hidden = true; sfx.tap(); resolve(b.dataset.p); }));
    });
  }

  /** 質問して答えを受け取る（Pardon? ならくり返す） */
  async function ask(text, { sub, hint, pause = false } = {}) {
    lastQuestion = text;
    await say(text, { sub });
    let a = await waitAnswer();
    while (isPardon(a) && repeatCount < 2) {
      repeatCount++;
      await say(`${SCRIPT.pardon} ${text}`, { sub: `${SCRIPT.pardon} ${sub || text}` });
      a = await waitAnswer();
    }
    if (!real && hint) {
      if (pause) {
        while ((await practicePause(hint)) === 'redo') { check(); a = await waitAnswer(); }
      } else {
        const hb = $('.hint-box');
        hb.hidden = false;
        hb.innerHTML = `<p class="small"><b>💡</b> ${esc(hint)}</p>`;
      }
    }
    check();
    return a;
  }

  async function silentReading() {
    const pc = $('.pcard');
    $('.card-placeholder').hidden = true;
    pc.hidden = false;
    pc.classList.add('dealt');
    sfx.flip();
    const cd = pc.querySelector('.countdown');
    cd.hidden = false;
    for (let i = 20; i > 0; i--) {
      check();
      cd.querySelector('b').textContent = i;
      if (i <= 3) sfx.tick();
      await wait(1000);
    }
    cd.hidden = true;
  }

  async function run() {
    try {
      await wait(600);
      // --- 入室 ---
      setStep(0);
      log.greet.push(await ask(SCRIPT.hello, { hint: 'Hello.' }));
      log.greet.push(await ask(SCRIPT.card, { hint: 'Here you are.' }));
      log.greet.push(await ask(SCRIPT.seat, { hint: 'Thank you.' }));
      log.greet.push(await ask(SCRIPT.name, { hint: `My name is ${name || 'Ken Sato'}.` }));
      log.greet.push(await ask(SCRIPT.grade, { hint: 'Yes.' }));
      log.greet.push(await ask(SCRIPT.how, { hint: "I'm fine, thank you." }));
      // --- 黙読 ---
      setStep(1);
      await say(`${SCRIPT.start} ${SCRIPT.silent}`);
      await silentReading();
      // --- 音読 ---
      setStep(2);
      await say(SCRIPT.aloud);
      transcript.dataset.mode = 'reading';
      log.reading = await waitAnswer({ reading: true });
      const al = alignReading(card.passage, log.reading);
      log.readingRatio = al.ratio;
      log.readingWords = al.words;
      if (!real) {
        transcript.innerHTML = `<div class="read-check">${al.words.map((w) => `<span class="${w.ok ? '' : 'miss'}">${esc(w.w)}</span>`).join(' ')}</div><small class="muted">一致率 ${Math.round(al.ratio * 100)}%（赤は聞き取れなかった語）</small>`;
        await wait(800);
        await practicePause(card.passage);
      }
      // --- No.1〜3 ---
      await say(SCRIPT.questions);
      const qs = [card.q1, card.q2, card.q3];
      for (let i = 0; i < 3; i++) {
        setStep(3 + i);
        const text = await ask(`No. ${i + 1}. ${qs[i].q}`, { hint: qs[i].a, pause: true });
        log.answers.push({ q: qs[i].q, model: qs[i].a, text, keys: qs[i].keys });
      }
      // --- No.4・5（カードを裏返す） ---
      setStep(6);
      const turn = name ? `Now, ${name}, please turn the card over.` : SCRIPT.turn;
      await say(turn);
      $('.pcard').classList.add('turned');
      sfx.flip();
      await wait(500);
      const a4 = await ask(`No. 4. ${wh.q}`, { hint: wh.model, pause: true });
      log.answers.push({ q: wh.q, model: wh.model, text: a4, type: 'wh' });
      setStep(7);
      const a5 = await ask(`No. 5. ${yn.q}`, { hint: 'Yes, I do. / No, I don\'t.' });
      const saidNo = /\b(no|not|don't|didn't|haven't|never|aren't|isn't|can't)\b/i.test(a5) && !/^\s*yes\b/i.test(a5);
      const follow = saidNo ? yn.no : yn.yes;
      const a5b = await ask(follow, { hint: saidNo ? yn.modelNo : yn.model, pause: true });
      log.answers.push({ q: `${yn.q} → ${follow}`, model: saidNo ? yn.modelNo : yn.model, text: `${a5} ${a5b}`.trim(), type: 'yn', a: a5, b: a5b });
      // --- 退室 ---
      setStep(8);
      log.greet.push(await ask(SCRIPT.end, { hint: 'Here you are.' }));
      await say(SCRIPT.bye);
      await wait(300);
      finish();
    } catch (e) {
      if (e.message !== 'aborted') { console.error(e); toast(esc(e.message), { icon: '⚠️' }); }
    }
  }

  // ---------- 採点（端末内・無料） ----------
  function localScore() {
    const r = log.readingRatio;
    const reading = r >= 0.9 ? 5 : r >= 0.8 ? 4 : r >= 0.65 ? 3 : r >= 0.45 ? 2 : r > 0.05 ? 1 : 0;
    const ans = log.answers.map((a) => {
      const w = normWords(a.text);
      if (!w.length) return 0;
      if (a.keys) {
        const set = new Set(w);
        const hit = a.keys.filter((g) => g.some((k) => k.split(' ').every((x) => set.has(x.toLowerCase())))).length / a.keys.length;
        const base = w.length >= 3 ? 5 : 3;
        return Math.max(1, Math.round(base * (0.2 + 0.8 * hit)));
      }
      if (a.type === 'yn') {
        const yesno = /\b(yes|no)\b/i.test(a.a || '') ? 2 : normWords(a.a || '').length ? 1 : 0;
        const more = normWords(a.b || '').length >= 4 ? 3 : normWords(a.b || '').length >= 2 ? 2 : normWords(a.b || '').length ? 1 : 0;
        return yesno + more;
      }
      // No.4：質問の形（時制・疑問詞）に合った答え方かを簡易チェック
      const fits = whFits(a.q, a.text);
      const base = w.length >= 5 && w.includes('i') ? 5 : w.length >= 3 ? 4 : 2;
      return fits ? base : Math.min(base, 3);
    });
    const responded = log.greet.filter((g) => normWords(g).length).length;
    const attitude = responded >= log.greet.length - 1 && ans.every((x) => x > 0) ? 3 : responded >= 3 ? 2 : 1;
    return { reading, answers: ans, attitude };
  }

  function reportHTML(sc, extra = {}) {
    const total = sc.reading + sc.answers.reduce((a, b) => a + b, 0) + sc.attitude;
    const al = log.readingWords || [];
    return `
      <div class="score-table big">
        <div><small>音読</small><b>${sc.reading}</b><span>/5</span></div>
        ${sc.answers.map((v, i) => `<div><small>No.${i + 1}</small><b>${v}</b><span>/5</span></div>`).join('')}
        <div><small>態度</small><b>${sc.attitude}</b><span>/3</span></div>
        <div class="total"><small>合計</small><b>${total}</b><span>/33</span></div>
      </div>
      <h3>📖 音読 <small>一致率 ${Math.round(log.readingRatio * 100)}%</small></h3>
      <div class="read-check">${al.map((w) => `<span class="${w.ok ? '' : 'miss'}">${esc(w.w)}</span>`).join(' ')}</div>
      ${extra.reading ? `<p class="small">${esc(extra.reading)}</p>` : ''}
      <h3>💬 質疑応答</h3>
      <ol class="qa-list">
        ${log.answers.map((a, i) => `
          <li>
            <p class="qa-q"><b>No.${i + 1}</b> ${esc(a.q)}</p>
            <p class="qa-a">あなた：${a.text ? esc(a.text) : '<span class="muted">（無回答）</span>'} <span class="qa-score">${sc.answers[i]}/5</span></p>
            ${extra.answers?.[i]?.comment ? `<p class="qa-c">🦉 ${esc(extra.answers[i].comment)}</p>` : ''}
            <p class="qa-m">例：${esc(extra.answers?.[i]?.better || a.model)} <button class="icon-btn speak small" data-say-text="${esc(extra.answers?.[i]?.better || a.model)}">🔊</button></p>
          </li>`).join('')}
      </ol>`;
  }

  function finish() {
    setStep(9);
    const sc = localScore();
    const total = sc.reading + sc.answers.reduce((a, b) => a + b, 0) + sc.attitude;
    const save = (scores, tot, ai, report) => {
      store.update((st2) => {
        const prev = st2.interviews.findIndex((x) => x.t === sessionT);
        const rec = { t: sessionT, card: card.id, mode: real ? 'real' : 'practice', scores: { reading: scores.reading, answers: scores.answers, attitude: scores.attitude }, total: tot, ai, report };
        if (prev >= 0) st2.interviews[prev] = rec; else st2.interviews.push(rec);
        if (st2.interviews.length > 40) st2.interviews.splice(0, st2.interviews.length - 40);
      });
    };
    const sessionT = Date.now();
    logActivity('speak');
    const xp = 30 + total * 2;
    gainXP(xp);
    save(sc, total, false, reportHTML(sc));
    checkBadges({});
    const pass = cse(total / 33, 0.8) >= PASS2;
    if (pass) { sfx.pass(); rain(90); } else sfx.finish();
    const stage = root.querySelector('.stage');
    stage.className = 'stage talk-result';
    stage.innerHTML = `
      <div class="card result">
        <div class="result-top">
          ${mascot(pass ? 'cheer' : 'normal', 'bob', 'examiner')}
          <div>
            <p class="eyebrow">INTERVIEW RESULT</p>
            <p class="result-score"><b class="tot">${total}</b> / 33</p>
            <p class="result-sub">CSE 目安 <b class="cse">${cse(total / 33, 0.8)}</b>（合格ライン ${PASS2}）・+${xp} XP</p>
          </div>
        </div>
        <div class="report">${reportHTML(sc)}</div>
        <div class="ai-area">
          ${aiReady() ? '<button class="btn primary" data-action="ai-grade">🤖 AIにくわしく採点してもらう</button>' : '<p class="small muted">AIを設定すると、答えの内容まで見てコメントと改善例をもらえます（設定 → AI）。</p>'}
        </div>
        <p class="tiny muted">※ 自動採点は音声認識とキーワードによる目安です。発音・声の大きさ・間のとり方は評価していません。</p>
        <div class="result-actions">
          <button class="btn ghost" data-action="again">同じカードでもう一度</button>
          <button class="btn primary" data-action="other">別のカードで練習</button>
          <button class="btn ghost" data-action="back">もどる</button>
        </div>
      </div>`;
    const bindSay = () => stage.querySelectorAll('[data-say-text]').forEach((b) => b.addEventListener('click', () => speak(b.dataset.sayText)));
    bindSay();
    actions(root, {
      'ai-grade': async (el) => {
        el.classList.add('loading');
        try {
          const res = await chatJSON(gradeInterviewPrompt({ card, readingRatio: log.readingRatio, readingText: log.reading, answers: log.answers, name }), { maxTokens: 1400, cache: false });
          const d = res.data;
          if (!d?.answers) throw new Error('AIの返答を読み取れませんでした');
          const sc2 = {
            reading: Math.max(0, Math.min(5, Math.round(d.reading?.score ?? sc.reading))),
            answers: log.answers.map((_, i) => Math.max(0, Math.min(5, Math.round(d.answers[i]?.score ?? sc.answers[i])))),
            attitude: sc.attitude,
          };
          const tot = sc2.reading + sc2.answers.reduce((a, b) => a + b, 0) + sc2.attitude;
          const html = `${d.summary ? `<p class="air-summary">${esc(d.summary)}</p>` : ''}${reportHTML(sc2, { reading: d.reading?.comment, answers: d.answers })}${d.tips?.length ? `<h3>💡 アドバイス</h3><ul>${d.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}`;
          stage.querySelector('.report').innerHTML = html;
          stage.querySelector('.tot').textContent = tot;
          stage.querySelector('.cse').textContent = cse(tot / 33, 0.8);
          save(sc2, tot, true, html);
          award('ai');
          checkBadges({ ai: true });
          el.remove();
          bindSay();
          burst({ count: 40, kind: 'star' });
        } catch (e) {
          toast(esc(e.message), { icon: '⚠️', ms: 5000 });
        } finally {
          el.classList.remove('loading');
        }
      },
      again: () => go('talk', { mode: params.mode, card: card.id, t: Date.now() }),
      other: () => go('talk', { mode: params.mode, card: 'random', t: Date.now() }),
      back: () => go('interview'),
    });
  }

  actions(root, {
    quit: async () => { if (await confirmDialog('面接をやめますか？', { ok: 'やめる' })) { aborted = true; go('interview'); } },
    mic: () => { if (listening) stopListening(); else if (answerResolve) startListen({ reading: transcript.dataset.mode === 'reading' && !log.reading }); },
    done: () => stopListening(),
    type: () => { typed = true; if (listening) abortListening(); showType(); },
    repeat: async () => {
      if (!answerResolve || !lastQuestion) return;
      repeatCount++;
      if (listening) abortListening();
      listening = false;
      mic.classList.remove('on');
      const res = answerResolve;
      answerResolve = null;
      setWaiting(false);
      await say(`${SCRIPT.pardon} ${lastQuestion}`);
      answerResolve = res;
      setWaiting(true);
      if (!typed) startListen({}); else showType();
      $('[data-action="repeat"]').hidden = repeatCount >= 2;
    },
  });

  run();
  return () => { aborted = true; stopSpeech(); abortListening(); };
}
