// 単語の学習セッション
//  flash：フラッシュカード（自己評価）／ speed：高速周回（スワイプ）／ choice：4択 ／ listen：聞いて選ぶ
//  spell：意味を見て手書き ／ dictation：発音を聞いて手書き
import * as store from '../store.js';
import { CARDS, cardById, meanKey, spellKey, exampleHTML, exampleTarget, spellable, examplePlain } from '../bank.js';
import { review, pick, shuffle, status } from '../srs.js';
import { recordAnswer, xpForAnswer, checkBadges } from '../game.js';
import { actions, esc, toast, confirmDialog, fmtTime } from '../ui.js';
import { go } from '../app.js';
import { sfx } from '../sound.js';
import { say, stop as stopSpeech } from '../speech.js';
import { burst, floatText, shake, judgeMark, rain } from '../fx.js';
import { mascot } from '../mascot.js';
import { SpellInput, answerHTML } from '../spell.js';
import { cardsFor, srcLabel, openCard } from './words.js';

const TITLES = { flash: 'フラッシュカード', speed: '高速周回', choice: '4択クイズ', listen: '聞いて選ぶ', spell: '手書きスペル', dictation: 'ディクテーション' };

export function renderWordPlay(root, params) {
  const mode = TITLES[params.mode] ? params.mode : 'flash';
  const src = params.src || 'auto';
  const dir = params.dir || 'en';
  const st = store.settings();
  const spellish = mode === 'spell' || mode === 'dictation';
  const key = spellish ? spellKey : meanKey;
  const kind = spellish ? 'spell' : 'words';
  const items = store.get().items;

  let pool = params.ids ? params.ids.split(',').map((id) => cardById.get(id)).filter(Boolean) : cardsFor(src);
  if (spellish) pool = pool.filter(spellable);
  if (!pool.length) {
    root.innerHTML = `<div class="empty-state card">${mascot('think')}<h2>出題できるカードがありません</h2><p class="muted">範囲を変えてみてください。</p><button class="btn primary" onclick="history.back()">もどる</button></div>`;
    return;
  }
  const withId = (c) => ({ ...c, id: key(c), card: c });
  const size = mode === 'speed' ? 100 : mode === 'flash' ? 20 : mode === 'choice' || mode === 'listen' ? 15 : st.sessionSize;
  let deck;
  if (params.ids) deck = shuffle([...pool]);
  else if (mode === 'speed' && src !== 'auto' && pool.length <= 120) deck = shuffle([...pool]);
  else {
    const chosen = pick(pool.map(withId), items, Math.min(size, pool.length), {
      newRatio: src === 'due' ? 0 : st.newRatio + 0.1,
      weight: (c) => 4 - c.card.r,
      keepOrderNew: src.startsWith('chunk') || src.startsWith('rank'),
    });
    deck = chosen.map((x) => x.card);
  }

  if (mode === 'speed') return speedRun(root, deck, { src: params.ids ? 'ids' : src, key });

  // ---- 通常セッション ----
  const queue = deck.map((c) => ({ c, retry: false }));
  let idx = 0, combo = 0, maxCombo = 0, xpSum = 0;
  const results = new Map(); // id → 最初の正誤
  let busy = false;
  let spell = null;
  let keyHandler = null;

  root.innerHTML = `
    <header class="play-head">
      <button class="icon-btn close" data-action="quit" aria-label="やめる">✕</button>
      <div class="play-title"><b>${TITLES[mode]}</b><small>${esc(params.ids ? '選んだ単語' : srcLabel(src))}</small></div>
      <div class="play-prog"><i></i></div>
      <span class="play-count"></span>
      <span class="combo-chip" hidden></span>
    </header>
    <div class="stage"></div>`;
  const stage = root.querySelector('.stage');
  const prog = root.querySelector('.play-prog i');
  const count = root.querySelector('.play-count');
  const comboEl = root.querySelector('.combo-chip');

  const updateHead = () => {
    prog.style.width = `${(idx / queue.length) * 100}%`;
    count.textContent = `${Math.min(idx + 1, queue.length)} / ${queue.length}`;
    comboEl.hidden = combo < 3;
    comboEl.textContent = `🔥 ${combo} combo`;
  };

  /** 解答を記録。grade: 0〜3 */
  let lastPrev = null; // 判定の修正用に、直前の記憶の状態を残す
  function answer(entry, grade, anchor) {
    const { c, retry } = entry;
    const ok = grade > 0;
    if (!retry) {
      lastPrev = { id: key(c), st: store.get().items[key(c)] };
      store.update((s) => { s.items[key(c)] = review(s.items[key(c)], grade); });
      results.set(c.id, ok);
    }
    combo = ok ? combo + 1 : 0;
    maxCombo = Math.max(maxCombo, combo);
    const xp = retry ? (ok ? 3 : 0) : xpForAnswer(ok, combo);
    xpSum += xp;
    recordAnswer(kind, ok, xp);
    if (ok) {
      sfx.correct(combo);
      if (xp && anchor) floatText(`+${xp}`, anchor, 'xp');
      if (combo && combo % 10 === 0) { sfx.combo(combo); burst({ count: 40, kind: 'star' }); }
    } else {
      sfx.wrong();
      if (!retry) {
        // まちがえたカードは少しあとにもう一度
        queue.splice(Math.min(queue.length, idx + 4), 0, { c, retry: true });
      }
    }
    updateHead();
  }

  function next() {
    idx++;
    busy = false;
    spell?.destroy(); spell = null;
    if (idx >= queue.length) return finish();
    show();
  }

  function show() {
    updateHead();
    const entry = queue[idx];
    const c = entry.c;
    stopSpeech();
    if (mode === 'flash') showFlash(entry);
    else if (mode === 'choice' || mode === 'listen') showChoice(entry);
    else showSpell(entry);
    if (entry.retry) stage.insertAdjacentHTML('afterbegin', '<p class="retry-tag">🔁 もう一度</p>');
    void c;
  }

  // ---------- フラッシュカード ----------
  function showFlash(entry) {
    const c = entry.c;
    const front = dir === 'ja'
      ? `<p class="fc-pos">${esc(c.pos)}</p><p class="fc-mean big">${esc(c.m)}</p><p class="fc-hint muted small">英語で言えるかな？</p>`
      : `<p class="fc-word">${esc(c.w)}</p><p class="fc-pos">${esc(c.pos)}</p>`;
    stage.innerHTML = `
      <div class="flash-wrap">
        <button class="flashcard" data-action="flip" aria-label="カードをめくる">
          <div class="fc-face fc-front">${front}<span class="fc-tap">タップでめくる</span></div>
          <div class="fc-face fc-back">
            <p class="fc-word sm">${esc(c.w)} <span class="speak-inline">🔊</span></p>
            <p class="fc-mean"><span class="pos">${esc(c.pos)}</span> ${esc(c.m)}</p>
            ${c.f ? `<p class="fc-forms">${esc(c.f)}</p>` : ''}
            <p class="fc-ex">${exampleHTML(c)}</p>
            <p class="fc-exj">${esc(c.ej)}</p>
          </div>
        </button>
        <div class="grade-row" hidden>
          <button class="grade g0" data-action="grade" data-g="0"><b>もう一度</b><small>わからなかった</small></button>
          <button class="grade g1" data-action="grade" data-g="1"><b>あやしい</b><small>思い出せたけど不安</small></button>
          <button class="grade g2" data-action="grade" data-g="2"><b>覚えた</b><small>すぐ思い出せた</small></button>
          <button class="grade g3" data-action="grade" data-g="3"><b>かんたん</b><small>もう出なくていい</small></button>
        </div>
        <div class="flash-tools"><button class="mini-btn" data-action="say">🔊 発音</button><button class="mini-btn" data-action="star">☆ 苦手ノート</button></div>
      </div>`;
    if (dir === 'en' && st.autoSpeak) say(c.w);
  }

  // ---------- 4択・聞いて選ぶ ----------
  function distractors(c) {
    const same = CARDS.filter((x) => x.kind === c.kind && x.id !== c.id && x.m !== c.m && x.pos[0] === c.pos[0]);
    const other = CARDS.filter((x) => x.kind === c.kind && x.id !== c.id && x.m !== c.m);
    const out = shuffle([...same]).slice(0, 3);
    for (const x of shuffle([...other])) { if (out.length >= 3) break; if (!out.includes(x)) out.push(x); }
    return out;
  }
  let timer = null;
  function showChoice(entry) {
    const c = entry.c;
    const opts = shuffle([c, ...distractors(c)]);
    const listen = mode === 'listen';
    stage.innerHTML = `
      <div class="choice-stage">
        <div class="prompt-card">
          ${listen ? `<button class="big-speaker" data-action="say" aria-label="もう一度聞く">🔊</button><p class="muted small">発音を聞いて意味を選ぼう</p><p class="fc-word reveal-later" hidden>${esc(c.w)}</p>`
            : `<p class="fc-word">${esc(c.w)} <button class="icon-btn speak" data-action="say" aria-label="発音">🔊</button></p><p class="fc-pos">${esc(c.pos)}</p>`}
        </div>
        <div class="timer-bar"><i></i></div>
        <div class="choices">
          ${opts.map((o, i) => `<button class="choice" data-action="pick" data-id="${esc(o.id)}"><span class="num">${i + 1}</span><span>${esc(o.m)}</span></button>`).join('')}
        </div>
        <div class="after" hidden></div>
      </div>`;
    if (listen || st.autoSpeak) say(c.w);
    const bar = stage.querySelector('.timer-bar i');
    const limit = listen ? 12000 : 8000;
    const t0 = performance.now();
    clearInterval(timer);
    timer = setInterval(() => {
      const r = 1 - (performance.now() - t0) / limit;
      bar.style.width = `${Math.max(0, r) * 100}%`;
      bar.classList.toggle('low', r < 0.3);
      if (r <= 0) { clearInterval(timer); pickChoice(null); }
    }, 100);
  }
  function pickChoice(id, btn) {
    if (busy) return;
    busy = true;
    clearInterval(timer);
    const entry = queue[idx], c = entry.c;
    const ok = id === c.id;
    stage.querySelectorAll('.choice').forEach((b) => {
      b.disabled = true;
      if (b.dataset.id === c.id) b.classList.add('correct');
      else if (b.dataset.id === id) b.classList.add('wrong');
    });
    stage.querySelector('.reveal-later')?.removeAttribute('hidden');
    if (!ok) shake(btn || stage.querySelector('.choices'));
    answer(entry, ok ? 2 : 0, btn);
    const after = stage.querySelector('.after');
    after.hidden = false;
    after.innerHTML = `
      <p class="after-word"><b>${esc(c.w)}</b> <span class="pos">${esc(c.pos)}</span> ${esc(c.m)}</p>
      <p class="after-ex">${exampleHTML(c)}<br><small class="muted">${esc(c.ej)}</small></p>
      <button class="btn primary" data-action="next">次へ ▶</button>`;
    if (ok) setTimeout(() => { if (queue[idx] === entry) next(); }, 1100);
    else say(c.w);
  }

  // ---------- 手書きスペル・ディクテーション ----------
  function showSpell(entry) {
    const c = entry.c;
    const dict = mode === 'dictation';
    const target = exampleTarget(c);
    const sameForm = target.toLowerCase() === c.w.toLowerCase();
    stage.innerHTML = `
      <div class="spell-stage">
        <div class="prompt-card spell-prompt">
          ${dict
            ? `<button class="big-speaker" data-action="say" aria-label="もう一度聞く">🔊</button><p class="muted small">聞こえた単語をつづろう</p><p class="sp-mean" hidden>${esc(c.m)}</p>`
            : `<p class="sp-pos">${esc(c.pos)}</p><p class="sp-mean">${esc(c.m)}</p>`}
          ${sameForm && !dict ? `<p class="sp-ex">${exampleHTML(c, { blank: true })}</p>` : ''}
          ${!dict ? `<p class="sp-exj muted">${esc(c.ej)}</p>` : ''}
          ${!dict ? '<button class="mini-btn hint" data-action="hint">💡 ヒント（発音）</button>' : ''}
        </div>
        <div class="spell-host"></div>
        <div class="spell-tools">
          <button class="mini-btn" data-action="undo">↶ 1画もどす</button>
          <button class="mini-btn" data-action="clear">全部消す</button>
          <button class="btn primary" data-action="check">判定する ✓</button>
        </div>
        <div class="spell-result" hidden></div>
      </div>`;
    spell = new SpellInput({ answer: c.w });
    stage.querySelector('.spell-host').appendChild(spell.el);
    spell.focus();
    if (dict) setTimeout(() => say(c.w, { rate: 0.8 }), 250);
    stage.dataset.hinted = '';
  }
  async function checkSpell() {
    if (busy || !spell) return;
    const entry = queue[idx], c = entry.c;
    if (spell.isEmpty()) { toast('まだ何も書かれていません', { icon: '✍️' }); return; }
    busy = true;
    const btn = stage.querySelector('[data-action="check"]');
    btn.classList.add('loading');
    const res = await spell.check();
    btn.classList.remove('loading');
    spell.reveal(res);
    stage.querySelector('.spell-tools').hidden = true;
    stage.querySelector('.sp-mean')?.removeAttribute('hidden');
    const out = stage.querySelector('.spell-result');
    out.hidden = false;
    const hinted = stage.dataset.hinted === '1';
    const finalize = (ok) => {
      const grade = ok ? (hinted ? 1 : 2) : 0;
      answer(entry, grade, out);
      judgeMark(ok);
      out.querySelector('.self-judge')?.remove();
      out.querySelector('.override')?.removeAttribute('hidden');
      out.querySelector('.next-row').hidden = false;
      out.dataset.ok = ok ? '1' : '0';
      setOverride(ok);
    };
    const setOverride = (ok) => {
      const o = out.querySelector('.override');
      o.innerHTML = ok ? '<button class="mini-btn" data-action="flip-judge">実はまちがえていた</button>' : '<button class="mini-btn" data-action="flip-judge">読み取りミス（正しく書けていた）</button>';
    };
    out.innerHTML = `
      <div class="sr-answer">
        <p class="sr-word">${answerHTML(c.w, res.letters)} <button class="icon-btn speak" data-action="say">🔊</button></p>
        <p class="sr-mean"><span class="pos">${esc(c.pos)}</span> ${esc(c.m)}</p>
        ${res.got && res.ok === false ? `<p class="sr-got">読み取り：<b>${esc(res.got)}</b></p>` : ''}
        <p class="sr-ex">${exampleHTML(c)}<br><small class="muted">${esc(c.ej)}</small></p>
      </div>
      ${res.ok === null ? `<div class="self-judge"><p class="small muted">自分で答え合わせしよう（お手本と見比べて）</p><button class="btn ok" data-action="self" data-v="1">○ 書けた</button><button class="btn ng" data-action="self" data-v="0">× まちがえた</button></div>` : ''}
      <div class="override" hidden></div>
      <div class="next-row" hidden><button class="btn primary big" data-action="next">次へ ▶</button></div>`;
    say(c.w);
    if (res.ok !== null) finalize(res.ok);
    out._finalize = finalize;
  }

  // ---------- 終了 ----------
  function finish() {
    clearInterval(timer);
    stopSpeech();
    const total = results.size;
    const okN = [...results.values()].filter(Boolean).length;
    const perfect = total >= 10 && okN === total;
    checkBadges({ combo: maxCombo, perfect });
    store.update((s) => { s.bestCombo = Math.max(s.bestCombo, maxCombo); });
    sfx.finish();
    if (okN / Math.max(1, total) >= 0.8) setTimeout(() => rain(70), 300);
    const wrong = [...results.entries()].filter(([, ok]) => !ok).map(([id]) => id);
    root.querySelector('.play-head').innerHTML = `<button class="icon-btn close" data-action="home" aria-label="閉じる">✕</button><div class="play-title"><b>${TITLES[mode]}</b><small>おつかれさま！</small></div>`;
    stage.innerHTML = `
      <div class="result card">
        <div class="result-top">
          ${mascot(okN / Math.max(1, total) >= 0.8 ? 'cheer' : okN / Math.max(1, total) >= 0.5 ? 'happy' : 'think', 'bob')}
          <div>
            <p class="eyebrow">RESULT</p>
            <p class="result-score"><b>${okN}</b> / ${total}</p>
            <p class="result-sub">+${xpSum} XP・最大 ${maxCombo} コンボ</p>
          </div>
        </div>
        <ul class="result-list">
          ${deck.map((c) => `<li class="${results.get(c.id) ? 'ok' : 'ng'}"><button class="wl-row" data-id="${esc(c.id)}"><span class="mark">${results.get(c.id) ? '○' : '×'}</span><b class="wl-w">${esc(c.w)}</b><span class="wl-m">${esc(c.m)}</span><i class="dot st-${status(store.get().items[key(c)])}"></i></button></li>`).join('')}
        </ul>
        <div class="result-actions">
          ${wrong.length ? `<button class="btn ghost" data-action="again-wrong">まちがえた${wrong.length}語をもう一度</button>` : ''}
          <button class="btn primary" data-action="again">続けて学習</button>
          <button class="btn ghost" data-action="words">単語帳へ</button>
        </div>
      </div>`;
    stage.querySelectorAll('.wl-row').forEach((b) => b.addEventListener('click', () => openCard(b.dataset.id)));
    actions(root, {
      'again-wrong': () => go('wordplay', { mode, ids: wrong.join(','), dir }),
      again: () => go('wordplay', { mode, src, dir, t: Date.now() }),
      words: () => go('words'),
      home: () => go('home'),
    });
  }

  actions(root, {
    quit: async () => {
      if (idx === 0 || await confirmDialog('学習をやめますか？<br><small>ここまでの記録は保存されています</small>', { ok: 'やめる' })) go('words');
    },
    flip: (el) => {
      if (el.classList.contains('flipped')) return;
      el.classList.add('flipped');
      sfx.flip();
      stage.querySelector('.grade-row').hidden = false;
      if (dir === 'ja' || st.autoSpeak) say(queue[idx].c.w);
    },
    grade: (el) => {
      if (busy) return;
      busy = true;
      const g = +el.dataset.g;
      answer(queue[idx], g, el);
      if (g > 0) setTimeout(next, 250);
      else { el.closest('.flash-wrap').classList.add('again'); setTimeout(next, 450); }
    },
    say: () => say(queue[idx]?.c.w, mode === 'dictation' ? { rate: 0.8 } : {}),
    star: (el) => {
      const c = queue[idx].c;
      store.update((s) => { s.stars[`c:${c.id}`] = Date.now(); });
      el.textContent = '★ 追加しました';
      sfx.select();
    },
    pick: (el) => pickChoice(el.dataset.id, el),
    next: () => { sfx.tap(); next(); },
    hint: (el) => { stage.dataset.hinted = '1'; say(queue[idx].c.w, { rate: 0.75 }); el.textContent = '💡 ヒントを使った（評価は「あやしい」に）'; },
    undo: () => spell?.undo(),
    clear: () => { spell?.clear(); sfx.tap(); },
    check: () => checkSpell(),
    self: (el) => stage.querySelector('.spell-result')._finalize(el.dataset.v === '1'),
    'flip-judge': () => {
      // 判定の修正：記憶の状態を解答前に戻してから付け直す
      const out = stage.querySelector('.spell-result');
      const wasOk = out.dataset.ok === '1';
      const entry = queue[idx];
      const c = entry.c;
      if (!entry.retry && lastPrev?.id === key(c)) {
        store.update((s) => { s.items[key(c)] = review(lastPrev.st, wasOk ? 0 : 2); });
        results.set(c.id, !wasOk);
      }
      if (wasOk) queue.splice(Math.min(queue.length, idx + 4), 0, { c, retry: true });
      else {
        const j = queue.findIndex((q, k) => k > idx && q.c === c && q.retry);
        if (j > 0) queue.splice(j, 1);
      }
      out.dataset.ok = wasOk ? '0' : '1';
      spell?.override(!wasOk);
      out.querySelector('.override').innerHTML = `<span class="small muted">判定を「${wasOk ? '×' : '○'}」に直しました</span>`;
      updateHead();
      sfx.select();
    },
  });

  keyHandler = (e) => {
    if (e.target.matches('input, textarea')) { if (e.key === 'Enter' && spellish) { e.preventDefault(); if (!busy) checkSpell(); else next(); } return; }
    if (mode === 'flash') {
      const card = stage.querySelector('.flashcard');
      if ((e.key === ' ' || e.key === 'Enter') && card && !card.classList.contains('flipped')) { e.preventDefault(); card.click(); }
      else if (/^[1-4]$/.test(e.key) && card?.classList.contains('flipped')) stage.querySelector(`.grade.g${+e.key - 1}`)?.click();
    } else if (mode === 'choice' || mode === 'listen') {
      if (/^[1-4]$/.test(e.key)) stage.querySelectorAll('.choice')[+e.key - 1]?.click();
      else if (e.key === 'Enter') stage.querySelector('[data-action="next"]')?.click();
    } else if (e.key === 'Enter') {
      if (!busy) checkSpell(); else stage.querySelector('[data-action="next"]:not([hidden])')?.click();
    }
  };
  addEventListener('keydown', keyHandler);
  show();
  return () => { removeEventListener('keydown', keyHandler); clearInterval(timer); spell?.destroy(); stopSpeech(); };
}

// ================= 高速周回 =================
function speedRun(root, deck, { src, key }) {
  const lapKey = src;
  let queue = [...deck];
  const first = new Map(); // id → 最初の反応
  let pos = 0, t0 = 0, tick = null, undoTimer = null, lastUnknown = 0;
  let speak = localStorage.getItem('e3-speed-say') === '1';
  let peekTimer = null;
  const s = store.get();
  const prev = s.laps[lapKey];

  root.innerHTML = `
    <header class="play-head">
      <button class="icon-btn close" data-action="quit" aria-label="やめる">✕</button>
      <div class="play-title"><b>高速周回</b><small>${esc(srcLabel(src === 'ids' ? 'auto' : src))}・${deck.length}枚</small></div>
      <div class="play-prog"><i></i></div>
      <span class="play-count"></span>
      <button class="mini-btn say-toggle" data-action="say-toggle">${speak ? '🔊 発音あり' : '🔈 発音なし'}</button>
    </header>
    <div class="speed-stage">
      <div class="speed-intro card">
        ${mascot('cheer', 'bob')}
        <h2>⚡ 高速周回</h2>
        <p>1枚ずつ単語が出ます。意味がすぐわかれば <b>右へスワイプ（→）</b>、わからなければ <b>左へスワイプ（←）</b>。</p>
        <p class="small muted">わからなかった単語は少しあとにまた出てきます。全部「わかる」になったら1周クリア！ 考えこまずに1枚1〜2秒のテンポで回すのがコツ。</p>
        ${prev ? `<p class="lap-best">これまで：${prev.count}周 ／ ベスト ${fmtTime(prev.best / 1000)}</p>` : ''}
        <button class="btn primary big" data-action="go">スタート</button>
      </div>
    </div>`;
  const stage = root.querySelector('.speed-stage');
  const prog = root.querySelector('.play-prog i');
  const count = root.querySelector('.play-count');

  const update = () => {
    const done = deck.length - new Set(queue.slice(pos).map((c) => c.id)).size;
    prog.style.width = `${(done / deck.length) * 100}%`;
    count.textContent = `残り ${queue.length - pos}`;
  };

  function start() {
    t0 = performance.now();
    stage.innerHTML = `
      <div class="speed-timer"><b class="t">0.0</b><small>秒</small></div>
      <div class="swipe-area">
        <div class="swipe-hint left">知らない</div><div class="swipe-hint right">知ってる</div>
        <div class="swipe-card"></div>
      </div>
      <div class="peek" aria-live="polite"></div>
      <div class="speed-buttons">
        <button class="btn ng big" data-action="no">← 知らない</button>
        <button class="btn ok big" data-action="yes">知ってる →</button>
      </div>
      <button class="mini-btn undo-btn" data-action="undo" hidden>✗ やっぱり知らなかった</button>`;
    tick = setInterval(() => { stage.querySelector('.t').textContent = ((performance.now() - t0) / 1000).toFixed(1); }, 100);
    bindSwipe();
    showCard();
  }

  function showCard() {
    update();
    if (pos >= queue.length) return finish();
    const c = queue[pos];
    const card = stage.querySelector('.swipe-card');
    // 前のカードを飛ばしたときの位置・透明度を戻して、登場アニメーションをやり直す
    card.style.transition = 'none';
    card.style.transform = '';
    card.style.opacity = '';
    card.className = 'swipe-card';
    void card.offsetWidth;
    card.className = 'swipe-card enter';
    card.innerHTML = `<p class="fc-word">${esc(c.w)}</p><p class="fc-pos">${esc(c.pos)}</p>`;
    requestAnimationFrame(() => { card.style.transition = ''; });
    if (speak) say(c.w, { rate: 1.05 });
  }

  function respond(known) {
    if (pos >= queue.length) return;
    const c = queue[pos];
    const card = stage.querySelector('.swipe-card');
    card.style.transition = 'transform .22s ease-out, opacity .22s';
    card.style.transform = `translateX(${known ? 130 : -130}%) rotate(${known ? 16 : -16}deg)`;
    card.style.opacity = '0';
    sfx.swipe(known ? 1 : -1);
    const firstTime = !first.has(c.id);
    if (firstTime) {
      first.set(c.id, known);
      store.update((st) => { st.items[key(c)] = review(st.items[key(c)], known ? 2 : 0); });
      recordAnswer('words', known, known ? 3 : 1);
    }
    const peek = stage.querySelector('.peek');
    peek.innerHTML = `<b>${esc(c.w)}</b>　${esc(c.m)}`;
    peek.className = `peek show ${known ? 'ok' : 'ng'}`;
    clearTimeout(peekTimer);
    peekTimer = setTimeout(() => { peek.className = 'peek'; }, known ? 900 : 1800);
    if (!known) {
      queue.splice(Math.min(queue.length, pos + 5), 0, c);
      lastUnknown = pos;
    }
    // 「やっぱり知らなかった」を少しの間だけ出す
    const undo = stage.querySelector('.undo-btn');
    clearTimeout(undoTimer);
    if (known) { undo.hidden = false; undo.dataset.id = c.id; undoTimer = setTimeout(() => { undo.hidden = true; }, 1500); }
    else undo.hidden = true;
    pos++;
    setTimeout(showCard, 180);
  }

  function undoKnown() {
    const undo = stage.querySelector('.undo-btn');
    const c = deck.find((x) => x.id === undo.dataset.id);
    undo.hidden = true;
    if (!c) return;
    if (first.get(c.id) === true) {
      first.set(c.id, false);
      store.update((st) => {
        const it = st.items[key(c)];
        if (it) { it.h = `${it.h.slice(0, -1)}0`; it.c = Math.max(0, it.c - 1); it.w = (it.w || 0) + 1; it.s = Math.max(0.1, it.s * 0.25); it.due = Date.now() + it.s * 864e5; }
      });
    }
    queue.splice(Math.min(queue.length, pos + 4), 0, c);
    sfx.select();
    update();
  }

  function bindSwipe() {
    const area = stage.querySelector('.swipe-area');
    let sx = null, dx = 0, id = null;
    area.addEventListener('pointerdown', (e) => { sx = e.clientX; dx = 0; id = e.pointerId; try { area.setPointerCapture(id); } catch { /* */ } });
    area.addEventListener('pointermove', (e) => {
      if (sx == null || e.pointerId !== id) return;
      dx = e.clientX - sx;
      const card = stage.querySelector('.swipe-card');
      card.style.transition = 'none';
      card.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`;
      area.classList.toggle('lean-right', dx > 40);
      area.classList.toggle('lean-left', dx < -40);
    });
    const end = (e) => {
      if (sx == null || e.pointerId !== id) return;
      sx = null;
      area.classList.remove('lean-right', 'lean-left');
      const card = stage.querySelector('.swipe-card');
      if (Math.abs(dx) > 70) respond(dx > 0);
      else { card.style.transition = 'transform .2s'; card.style.transform = ''; }
    };
    area.addEventListener('pointerup', end);
    area.addEventListener('pointercancel', end);
  }

  function finish() {
    clearInterval(tick);
    stopSpeech();
    const ms = performance.now() - t0;
    const knownFirst = [...first.values()].filter(Boolean).length;
    const unknownIds = [...first.entries()].filter(([, k]) => !k).map(([i]) => i);
    let best = false;
    store.update((st) => {
      const l = st.laps[lapKey] || { count: 0, best: Infinity, last: 0 };
      l.count++;
      if (ms < l.best) { best = l.count > 1; l.best = ms; }
      l.last = ms; l.t = Date.now();
      if (!isFinite(l.best)) l.best = ms;
      st.laps[lapKey] = l;
    });
    checkBadges({});
    sfx.finish();
    if (best) { rain(80); sfx.levelup(); } else burst({ count: 60, kind: 'star' });
    const l = store.get().laps[lapKey];
    stage.innerHTML = `
      <div class="result card">
        <div class="result-top">
          ${mascot(knownFirst / deck.length > 0.8 ? 'cheer' : 'happy', 'bob')}
          <div>
            <p class="eyebrow">LAP ${l.count} CLEAR!</p>
            <p class="result-score"><b>${fmtTime(ms / 1000)}</b></p>
            <p class="result-sub">${best ? '🏆 自己ベスト更新！' : `ベスト ${fmtTime(l.best / 1000)}`}・1枚あたり ${(ms / 1000 / Math.max(1, queue.length)).toFixed(1)} 秒</p>
          </div>
        </div>
        <div class="lap-stats">
          <div><b>${knownFirst}</b><small>1回目でわかった</small></div>
          <div><b>${unknownIds.length}</b><small>知らなかった</small></div>
          <div><b>${Math.round((knownFirst / deck.length) * 100)}%</b><small>初見の正解率</small></div>
        </div>
        ${unknownIds.length ? `<p class="small muted">知らなかった単語：${unknownIds.slice(0, 30).map((i) => esc(cardById.get(i)?.w || '')).join(', ')}${unknownIds.length > 30 ? ' …' : ''}</p>` : '<p class="ok-text center">全部1回目でわかった！すばらしい！</p>'}
        <div class="result-actions">
          ${unknownIds.length ? `<button class="btn ghost" data-action="again-unknown">知らなかった${unknownIds.length}語だけ周回</button>` : ''}
          <button class="btn primary" data-action="again">もう1周 ⚡</button>
          <button class="btn ghost" data-action="words">単語帳へ</button>
        </div>
      </div>`;
    actions(root, {
      again: () => go('wordplay', { mode: 'speed', src: src === 'ids' ? 'auto' : src, t: Date.now() }),
      'again-unknown': () => go('wordplay', { mode: 'speed', ids: unknownIds.join(',') }),
      words: () => go('words'),
    });
  }

  actions(root, {
    go: () => { sfx.takeoff(); start(); },
    yes: () => respond(true),
    no: () => respond(false),
    undo: () => undoKnown(),
    'say-toggle': (el) => { speak = !speak; localStorage.setItem('e3-speed-say', speak ? '1' : '0'); el.textContent = speak ? '🔊 発音あり' : '🔈 発音なし'; },
    quit: async () => { if (!t0 || await confirmDialog('周回をやめますか？<br><small>答えた単語の記録は保存されています</small>', { ok: 'やめる' })) go('words'); },
  });
  const onKey = (e) => {
    if (!t0) { if (e.key === 'Enter') { e.preventDefault(); start(); } return; }
    if (e.key === 'ArrowRight') respond(true);
    else if (e.key === 'ArrowLeft') respond(false);
    else if (e.key === 'ArrowDown' || e.key === 'Backspace') { const u = stage.querySelector('.undo-btn'); if (u && !u.hidden) undoKnown(); }
  };
  addEventListener('keydown', onKey);
  void lastUnknown; void examplePlain;
  return () => { removeEventListener('keydown', onKey); clearInterval(tick); clearTimeout(undoTimer); stopSpeech(); };
}
