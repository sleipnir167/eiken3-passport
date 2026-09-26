// ライティング：Eメール問題・英作文（意見論述）
//  - キーボード（iPad はスクリブルでペン書きも可）／手書き用紙（行ごとに文字認識）
//  - 無料チェック（語数・形式・よくあるまちがい）→ AI 添削（点数・直し・模範解答）
import * as store from '../store.js';
import { EMAILS, ESSAYS, TEMPLATES } from '../../data/writing.js';
import { checkWriting, countWords, RANGE, SCORE_LABEL } from '../wcheck.js';
import { chatJSON, aiReady } from '../ai.js';
import { gradeWritingPrompt } from '../prompts.js';
import { actions, esc, modal, toast, confirmDialog, fmtTime, richText } from '../ui.js';
import { go } from '../app.js';
import { sfx } from '../sound.js';
import { say } from '../speech.js';
import { Pad } from '../pad.js';
import { recognizeLines } from '../recognizer.js';
import { gainXP, logActivity, checkBadges, award } from '../game.js';
import { burst } from '../fx.js';
import { mascot } from '../mascot.js';

const KIND = { email: 'Eメール問題', essay: '英作文（意見論述）' };
const promptsOf = (kind) => (kind === 'email' ? EMAILS : ESSAYS);
const best = (id) => store.get().writings.filter((w) => w.pid === id).reduce((m, w) => (m && m.total / m.max >= w.total / w.max ? m : w), null);

export function renderWrite(root) {
  let tab = localStorage.getItem('e3-wtab') || 'email';
  const draw = () => {
    const s = store.get();
    const list = promptsOf(tab);
    const hist = [...s.writings].reverse().slice(0, 12);
    root.innerHTML = `
      <header class="page-head"><h1>ライティング <small>2題で一次試験の3分の1（550点）</small></h1></header>
      <section class="card write-intro">
        ${mascot('normal', 'sm')}
        <div>
          <p><b>Eメール問題</b>（15〜25語）：友達からのメールの <u>2つの質問</u> に答える。<br><b>英作文</b>（25〜35語）：QUESTION に <b>意見 ＋ 理由2つ</b> で答える。</p>
          <p class="small muted">まず無料の「自動チェック」で形を整え、仕上げに「AI添削」で点数と直しをもらうのがおすすめ。</p>
        </div>
      </section>
      <div class="seg big-seg">${Object.entries(KIND).map(([k, l]) => `<button class="${tab === k ? 'on' : ''}" data-action="tab" data-k="${k}">${l}</button>`).join('')}</div>
      <section class="prompt-grid">
        <button class="card prompt-item random" data-action="open" data-id="random"><span class="pi-icon">🎲</span><b>おまかせ</b><small>まだ書いていないお題から</small></button>
        ${list.map((p) => {
          const b = best(p.id);
          return `<button class="card prompt-item" data-action="open" data-id="${p.id}">
            <span class="pi-icon">${tab === 'email' ? '✉️' : '💭'}</span>
            <b>${tab === 'email' ? `From ${esc(p.from)}` : esc(p.q)}</b>
            <small>${tab === 'email' ? esc((p.body.match(/\[\[(.+?)\]\]/) || [])[1] || '') : ''}</small>
            ${b ? `<span class="pi-score ${b.total / b.max >= 0.7 ? 'good' : ''}">${b.total}/${b.max}</span>` : '<span class="pi-score new">NEW</span>'}
          </button>`;
        }).join('')}
      </section>
      ${hist.length ? `
      <section class="card">
        <h2>これまでの答案</h2>
        <ul class="hist-list">${hist.map((w, i) => `<li><button data-action="hist" data-i="${s.writings.length - 1 - i}"><span class="tag">${w.kind === 'email' ? 'Eメール' : '英作文'}</span><span class="hl-text">${esc(w.text.slice(0, 60))}…</span><b>${w.total}/${w.max}</b><small>${w.ai ? 'AI' : '自動'}・${new Date(w.t).toLocaleDateString('ja-JP')}</small></button></li>`).join('')}</ul>
      </section>` : ''}`;
  };
  actions(root, {
    tab: (el) => { tab = el.dataset.k; localStorage.setItem('e3-wtab', tab); sfx.select(); draw(); },
    open: (el) => {
      sfx.select();
      let id = el.dataset.id;
      if (id === 'random') {
        const list = promptsOf(tab);
        const fresh = list.filter((p) => !best(p.id));
        id = (fresh.length ? fresh : list)[Math.floor(Math.random() * (fresh.length || list.length))].id;
      }
      go('writing', { kind: tab, id });
    },
    hist: (el) => showHistory(store.get().writings[+el.dataset.i]),
  });
  draw();
}

function showHistory(w) {
  if (!w) return;
  modal(`
    <h2>${KIND[w.kind]} <small>${new Date(w.t).toLocaleString('ja-JP')}</small></h2>
    <p class="hist-prompt small muted">${esc(w.prompt || '')}</p>
    <div class="answer-view">${esc(w.text).replace(/\n/g, '<br>')}</div>
    <p><b>${w.total} / ${w.max}</b>（${Object.entries(w.scores || {}).map(([k, v]) => `${SCORE_LABEL[k]} ${v}`).join('・')}）${w.ai ? ' AI採点' : ' 自動チェックの目安'}</p>
    ${w.feedback ? `<div class="ai-out">${richText(w.feedback)}</div>` : ''}
    <div class="modal-actions"><button class="btn ghost" data-close>閉じる</button></div>`);
}

/** 英文の単語レベルの差分（元の答案 → 直した文） */
function diffHTML(a, b) {
  const A = a.split(/\s+/).filter(Boolean), B = b.split(/\s+/).filter(Boolean);
  const n = A.length, m = B.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  const norm = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, '');
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out = [];
  let i = 0, j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && A[i] === B[j]) { out.push(esc(A[i])); i++; j++; }
    else if (j < m && (i >= n || dp[i][j + 1] >= dp[i + 1][j])) { out.push(`<ins>${esc(B[j])}</ins>`); j++; }
    else { out.push(`<del>${esc(A[i])}</del>`); i++; }
  }
  void norm;
  return out.join(' ');
}

export function renderWriteEditor(root, params) {
  const kind = params.kind === 'essay' ? 'essay' : 'email';
  const p = promptsOf(kind).find((x) => x.id === params.id) || promptsOf(kind)[0];
  const st = store.settings();
  const [lo, hi] = RANGE[kind];
  const draftKey = `e3-draft-${p.id}`;
  let text = localStorage.getItem(draftKey) || '';
  let inputMode = localStorage.getItem('e3-winput') || 'kb';
  let pad = null, t0 = Date.now(), timer = null, saved = false;
  const name = st.name || 'Ken';
  const promptText = kind === 'email' ? p.body.replace(/\[\[(.+?)\]\]/g, '$1') : p.q;

  const emailHTML = () => esc(p.body).replace(/\[\[(.+?)\]\]/g, '<u>$1</u>').replace(/\n/g, '<br>').replace(/^Hi!/, `Hi, ${esc(name)}!`);

  root.innerHTML = `
    <header class="play-head">
      <button class="icon-btn close" data-action="quit" aria-label="閉じる">✕</button>
      <div class="play-title"><b>${KIND[kind]}</b><small>${kind === 'email' ? `${lo}〜${hi}語・目安10分` : `${lo}〜${hi}語・目安15分`}</small></div>
      <span class="w-timer" title="経過時間">⏱ <b>0:00</b></span>
    </header>
    <div class="stage write-stage">
      <section class="card w-prompt">
        ${kind === 'email' ? `
          <p class="w-inst">あなたは、外国人の友達（${esc(p.from)}）から以下のEメールを受け取りました。Eメールを読み、それに対する返信メールを、英文で書きなさい。あなたが書く返信メールの中で、友達（${esc(p.from)}）からの<b>2つの質問（下線部）に対応する内容</b>を、あなた自身で自由に考えて答えなさい。語数の目安は${lo}語〜${hi}語です。</p>
          <div class="mail"><div class="mail-head">✉️ From: ${esc(p.from)}</div><div class="mail-body">${emailHTML()}</div><button class="mini-btn" data-action="read-prompt">🔊 読み上げ</button></div>`
        : `
          <p class="w-inst">あなたは、外国人の友達から以下のQUESTIONをされました。QUESTIONについて、あなたの<b>考え</b>とその<b>理由を2つ</b>英文で書きなさい。語数の目安は${lo}語〜${hi}語です。</p>
          <div class="question-box"><small>QUESTION</small><p>${esc(p.q)}</p></div>`}
        <div class="tpl"><small class="muted">型をタップで入力：</small>${TEMPLATES[kind].map(([l, t]) => `<button class="chip" data-action="tpl" data-t="${esc(t)}">${esc(l)}</button>`).join('')}</div>
        <button class="mini-btn" data-action="model">📖 模範解答を見る</button>
      </section>

      <section class="card w-answer">
        <div class="w-answer-head">
          <div class="seg small-seg">${[['kb', '⌨️ キーボード・スクリブル'], ['hand', '✍️ 手書き用紙']].map(([k, l]) => `<button class="${inputMode === k ? 'on' : ''}" data-action="imode" data-k="${k}">${l}</button>`).join('')}</div>
          <span class="wc"><b class="wc-n">0</b> 語 <small>/ ${lo}〜${hi}</small></span>
        </div>
        ${kind === 'email' ? `<p class="mail-fixed">Hi, ${esc(p.from)}!<br>Thank you for your e-mail.</p>` : ''}
        <div class="kb-area" ${inputMode === 'kb' ? '' : 'hidden'}>
          <textarea class="w-text" rows="6" autocapitalize="sentences" autocorrect="off" spellcheck="false" placeholder="${kind === 'email' ? 'ここに返信を書こう（あいさつと結びは書かなくてOK）' : 'I think ~. I have two reasons. First, ~. Second, ~.'}">${esc(text)}</textarea>
          <p class="tiny muted">iPad：Apple Pencil で入力欄に直接書くと、スクリブル機能で文字になります。</p>
        </div>
        <div class="hand-area" ${inputMode === 'hand' ? '' : 'hidden'}>
          <div class="hand-host"></div>
          <div class="row-btns"><button class="mini-btn" data-action="h-undo">↶ 1画もどす</button><button class="mini-btn" data-action="h-clear">全部消す</button><button class="btn primary small" data-action="h-read">🔤 文字にする</button></div>
          <p class="tiny muted">1行に1〜2文ずつ、線の上に書いてください。「文字にする」でキーボード欄に変換され、まちがいは手で直せます（オンライン時のみ）。</p>
        </div>
        ${kind === 'email' ? '<p class="mail-fixed">Best wishes,</p>' : ''}
        <ul class="check-list"></ul>
        <div class="row-btns w-actions">
          <button class="btn ghost" data-action="check">✅ 自動チェック（無料）</button>
          <button class="btn primary" data-action="ai">🤖 AI添削</button>
        </div>
      </section>
      <section class="w-result" hidden></section>
    </div>`;

  const ta = root.querySelector('.w-text');
  const wcN = root.querySelector('.wc-n');
  const wc = root.querySelector('.wc');
  const checks = root.querySelector('.check-list');
  const result = root.querySelector('.w-result');

  const refresh = () => {
    text = ta.value;
    localStorage.setItem(draftKey, text);
    const n = countWords(text);
    wcN.textContent = n;
    wc.className = `wc ${n >= lo && n <= hi ? 'in' : n > hi ? 'over' : ''}`;
    const r = checkWriting(text, { kind, checks: p.checks || [] });
    checks.innerHTML = text.trim() ? r.items.map((it) => `<li class="${it.state}">${it.state === 'ok' ? '✓' : it.state === 'warn' ? '△' : '✗'} ${esc(it.label)}</li>`).join('') : '';
    return r;
  };
  ta.addEventListener('input', refresh);
  refresh();

  timer = setInterval(() => { root.querySelector('.w-timer b').textContent = fmtTime((Date.now() - t0) / 1000); }, 1000);

  const ensurePad = () => {
    if (pad) return;
    pad = new Pad({ w: 1000, h: 5 * 150, guide: 'ruled', rows: 5, pen: 7, cls: 'pad-sheet', onStrokeEnd: () => sfx.pen() });
    root.querySelector('.hand-host').appendChild(pad.el);
  };
  if (inputMode === 'hand') ensurePad();

  const record = (scores, total, max, ai, feedback = '') => {
    const xp = 15 + Math.round((total / max) * 25);
    store.update((s) => {
      s.writings.push({ kind, pid: p.id, prompt: promptText, text, scores, total, max, ai, feedback, t: Date.now(), sec: Math.round((Date.now() - t0) / 1000) });
      if (s.writings.length > 60) s.writings.splice(0, s.writings.length - 60);
    });
    if (!saved) { logActivity('write'); gainXP(xp); }
    saved = true;
    checkBadges({ ai });
    if (total / max >= 0.8) { burst({ count: 70, kind: 'star' }); sfx.pass(); } else sfx.finish();
    return xp;
  };

  const localResult = () => {
    const r = refresh();
    const e = r.estimate;
    const marked = (() => {
      // まちがいの候補に下線
      let html = '', last = 0;
      for (const er of r.errors) {
        if (er.index < last) continue;
        html += esc(text.slice(last, er.index)) + `<mark title="${esc(er.msg)}">${esc(er.text)}</mark>`;
        last = er.index + er.text.length;
      }
      return (html + esc(text.slice(last))).replace(/\n/g, '<br>');
    })();
    result.hidden = false;
    result.innerHTML = `
      <div class="card">
        <h2>✅ 自動チェックの結果 <small>AIを使わない目安</small></h2>
        <div class="score-table">${Object.entries(e.scores).map(([k, v]) => `<div><small>${SCORE_LABEL[k]}</small><b>${v}</b><span>/${kind === 'email' ? 3 : 4}</span></div>`).join('')}<div class="total"><small>合計（目安）</small><b>${e.total}</b><span>/${e.max}</span></div></div>
        <div class="answer-view">${marked || '<span class="muted">（まだ何も書かれていません）</span>'}</div>
        ${r.errors.length ? `<h3>気になるところ</h3><ul class="err-list">${r.errors.map((er) => `<li><mark>${esc(er.text)}</mark> ${esc(er.msg)}</li>`).join('')}</ul>` : '<p class="ok-text">よくあるまちがいは見つかりませんでした 👍</p>'}
        <p class="tiny muted">※ 自動チェックは形式とよくあるまちがいだけを見ています。内容の良し悪しやつづりの細かい誤りは AI 添削で確認できます。</p>
        <div class="row-btns"><button class="btn ghost" data-action="save-local" ${saved ? 'disabled' : ''}>この点数で記録する</button>${aiReady() ? '<button class="btn primary" data-action="ai">🤖 AI添削へ</button>' : '<button class="btn ghost" data-action="ai-setup">🤖 AI添削を使えるようにする</button>'}</div>
      </div>`;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return r;
  };

  const aiResult = async (btn) => {
    const r = refresh();
    if (r.words < 5) { toast('もう少し書いてから添削しよう', { icon: '✍️' }); return; }
    if (!aiReady()) { localResult(); toast('AIが未設定のため、自動チェックを表示しました（設定 → AI）', { icon: '🤖', ms: 4000 }); return; }
    btn?.classList.add('loading');
    result.hidden = false;
    result.innerHTML = `<div class="card ai-loading">${mascot('think', 'bob')}<p>🦉 フート先生が採点しています…</p></div>`;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try {
      const res = await chatJSON(gradeWritingPrompt({ kind, prompt: kind === 'email' ? `${p.body.replace(/\[\[(.+?)\]\]/g, '<u>$1</u>')}\n（下線部の2つの質問に答える。語数の目安 ${lo}〜${hi} 語）` : `QUESTION: ${p.q}（意見と理由2つ。語数の目安 ${lo}〜${hi} 語）`, text }), { maxTokens: 1500 });
      const d = res.data;
      if (!d || !d.scores) throw new Error('AIの返答を読み取れませんでした。もう一度試してください。');
      const maxEach = kind === 'email' ? 3 : 4;
      const keys = kind === 'email' ? ['content', 'vocabulary', 'grammar'] : ['content', 'structure', 'vocabulary', 'grammar'];
      const scores = Object.fromEntries(keys.map((k) => [k, Math.max(0, Math.min(maxEach, Math.round(Number(d.scores[k]) || 0)))]));
      const total = Object.values(scores).reduce((a, b) => a + b, 0);
      const max = maxEach * keys.length;
      const fbText = [d.summary, ...(d.good || []).map((g) => `- ${g}`), d.advice].filter(Boolean).join('\n');
      const xp = record(scores, total, max, true, fbText);
      award('ai');
      result.innerHTML = `
        <div class="card ai-result">
          <div class="air-top">
            ${mascot(total / max >= 0.7 ? 'cheer' : 'normal', 'bob sm', 'examiner')}
            <div><p class="eyebrow">AI 添削 ${res.cached ? '（保存済み）' : ''}</p><p class="result-score"><b>${total}</b> / ${max}</p><p class="result-sub">+${xp} XP</p></div>
          </div>
          <div class="score-table">${keys.map((k) => `<div><small>${SCORE_LABEL[k]}</small><b>${scores[k]}</b><span>/${maxEach}</span></div>`).join('')}</div>
          ${d.summary ? `<p class="air-summary">${esc(d.summary)}</p>` : ''}
          ${d.good?.length ? `<h3>👍 よかったところ</h3><ul>${d.good.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>` : ''}
          ${d.corrections?.length ? `<h3>✏️ 直したいところ</h3><ul class="corr-list">${d.corrections.map((c) => `<li><del>${esc(c.original)}</del> → <ins>${esc(c.corrected)}</ins><small>${esc(c.reason || '')}</small></li>`).join('')}</ul>` : ''}
          ${d.corrected_text ? `<h3>直した答案</h3><div class="answer-view diff">${diffHTML(text, d.corrected_text)}</div><button class="mini-btn" data-say-text="${esc(d.corrected_text)}">🔊 読み上げ</button>` : ''}
          ${d.model_answer ? `<h3>📖 模範解答</h3><div class="answer-view model">${esc(d.model_answer)} <small class="muted">（${countWords(d.model_answer)}語）</small></div><button class="mini-btn" data-say-text="${esc(d.model_answer)}">🔊 読み上げ</button>` : ''}
          ${d.advice ? `<p class="air-advice">💡 ${esc(d.advice)}</p>` : ''}
          <p class="ai-meta">🤖 ${esc(res.model || '')}${res.cached ? '・保存済みの結果（クレジット消費なし）' : ''}</p>
          <div class="row-btns"><button class="btn ghost" data-action="rewrite">書き直す</button><button class="btn primary" data-action="next-prompt">次のお題へ ▶</button></div>
        </div>`;
      result.querySelectorAll('[data-say-text]').forEach((b) => b.addEventListener('click', () => say(b.dataset.sayText)));
    } catch (err) {
      result.innerHTML = `<div class="card"><p class="err">${esc(err.message)}</p><button class="btn ghost" data-action="check">自動チェックを見る</button></div>`;
    } finally {
      btn?.classList.remove('loading');
    }
  };

  actions(root, {
    quit: async () => { if (!text.trim() || saved || await confirmDialog('書きかけの答案は保存されています。閉じますか？', { ok: '閉じる' })) go('write'); },
    tpl: (el) => {
      const t = el.dataset.t;
      const pos = ta.selectionStart ?? ta.value.length;
      const sep = ta.value && !/\s$/.test(ta.value.slice(0, pos)) ? ' ' : '';
      ta.value = ta.value.slice(0, pos) + sep + t + ta.value.slice(pos);
      const tilde = ta.value.indexOf('~', pos);
      ta.focus();
      if (tilde >= 0) ta.setSelectionRange(tilde, tilde + 1);
      refresh();
      sfx.tap();
    },
    model: async () => {
      if (!saved && !(await confirmDialog('先に自分で書いてから見るのがおすすめです。模範解答を見ますか？', { ok: '見る' }))) return;
      modal(`<h2>📖 模範解答</h2><div class="answer-view model">${esc(p.model)}</div><p class="small muted">${countWords(p.model)}語</p><p class="small">${esc(p.ja)}</p><div class="modal-actions"><button class="btn ghost" data-say>🔊 読み上げ</button><button class="btn primary" data-close>閉じる</button></div>`)
        .el.querySelector('[data-say]').addEventListener('click', () => say(p.model));
    },
    'read-prompt': () => say(p.body.replace(/\[\[|\]\]/g, '').replace(/^Hi!/, `Hi, ${name}!`)),
    imode: (el) => {
      inputMode = el.dataset.k;
      localStorage.setItem('e3-winput', inputMode);
      root.querySelectorAll('[data-action="imode"]').forEach((b) => b.classList.toggle('on', b === el));
      root.querySelector('.kb-area').hidden = inputMode !== 'kb';
      root.querySelector('.hand-area').hidden = inputMode !== 'hand';
      if (inputMode === 'hand') ensurePad();
    },
    'h-undo': () => pad?.undo(),
    'h-clear': () => pad?.clear(),
    'h-read': async (el) => {
      if (!pad || pad.isEmpty()) { toast('まだ何も書かれていません'); return; }
      el.classList.add('loading');
      try {
        const rowH = pad.h / pad.rows;
        const rows = Array.from({ length: pad.rows }, () => []);
        for (const s of pad.getStrokes()) {
          const mid = s.reduce((a, q) => a + q[1], 0) / s.length;
          const r = Math.max(0, Math.min(pad.rows - 1, Math.floor(mid / rowH)));
          rows[r].push(s.map(([x, y, t]) => [x, y - r * rowH, t]));
        }
        const lines = await recognizeLines(rows.map((strokes) => ({ strokes, w: pad.w, h: rowH })));
        const joined = lines.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
        ta.value = (ta.value.trim() ? `${ta.value.trim()} ` : '') + joined;
        refresh();
        root.querySelector('[data-k="kb"]').click();
        toast('文字にしました。まちがいがあれば直してください', { icon: '🔤' });
      } catch {
        toast('文字の認識にはインターネット接続が必要です', { icon: '⚠️' });
      } finally {
        el.classList.remove('loading');
      }
    },
    check: () => { sfx.select(); localResult(); },
    'save-local': (el) => { const r = checkWriting(text, { kind, checks: p.checks || [] }); record(r.estimate.scores, r.estimate.total, r.estimate.max, false); el.disabled = true; toast('記録しました', { icon: '✅' }); },
    ai: (el) => aiResult(el),
    'ai-setup': () => go('settings', { sec: 'ai' }),
    rewrite: () => { saved = false; result.hidden = true; ta.focus(); },
    'next-prompt': () => {
      const list = promptsOf(kind);
      const i = list.findIndex((x) => x.id === p.id);
      go('writing', { kind, id: list[(i + 1) % list.length].id });
    },
  });
  return () => { clearInterval(timer); pad?.destroy(); };
}
