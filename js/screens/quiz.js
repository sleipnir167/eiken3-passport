// 筆記・リスニングの練習セッション
//  part: r1 | r2 | r3 | l1 | l2 | l3 | mix | lmix | weak | ids
import * as store from '../store.js';
import { PART1, PART2, PART3, PART3_QS, L1, L2, L3, LISTENING, R1_CATS, R3_TYPES, part1Pool, shuffleChoices, passageById } from '../bank.js';
import { review, pick, shuffle, status, retrievability } from '../srs.js';
import { recordAnswer, xpForAnswer, checkBadges } from '../game.js';
import { actions, esc, confirmDialog } from '../ui.js';
import { go } from '../app.js';
import { sfx } from '../sound.js';
import { burst, floatText, shake, rain } from '../fx.js';
import { mascot } from '../mascot.js';
import { stemHTML, passageHTML, feedbackHTML, bindFeedback, playListening, stopAudio, PART_LABEL, partOf } from '../question.js';
import { GRAMMAR } from '../../data/grammar.js';

const allItems = () => [...part1Pool(store.get().custom), ...PART2, ...PART3_QS, ...L1, ...L2, ...L3];

export function renderQuiz(root, params) {
  const part = params.part || 'r1';
  if (part === 'r3') return passageSession(root, params);
  const st = store.settings();
  const s = store.get();
  let pool, title;
  switch (part) {
    case 'r1': {
      pool = part1Pool(s.custom);
      if (params.cat) pool = pool.filter((q) => q.k === params.cat);
      if (params.g) pool = pool.filter((q) => q.g === params.g);
      if (params.src === 'custom') pool = pool.filter((q) => q.custom);
      const g = GRAMMAR.find((x) => x.key === params.g);
      title = `${PART_LABEL.r1}${params.cat ? `・${R1_CATS[params.cat]}` : ''}${g ? `（${g.title}）` : ''}`;
      break;
    }
    case 'r2': pool = PART2; title = PART_LABEL.r2; break;
    case 'l1': case 'l2': case 'l3': pool = LISTENING[part[1]]; title = PART_LABEL[part]; break;
    case 'lmix': pool = [...L1, ...L2, ...L3]; title = 'リスニング（第1〜3部ミックス）'; break;
    case 'weak': pool = allItems().filter((q) => status(s.items[q.id]) === 'weak' || s.stars[`q:${q.id}`]); title = '苦手ノート'; break;
    case 'ids': { const set = new Set((params.ids || '').split(',')); pool = allItems().filter((q) => set.has(q.id)); title = 'まちがえた問題'; break; }
    default: pool = [...part1Pool(s.custom), ...PART2]; title = '筆記ドリル（大問1・2ミックス）';
  }
  if (!pool.length) {
    root.innerHTML = `<div class="empty-state card">${mascot(part === 'weak' ? 'happy' : 'think')}<h2>${part === 'weak' ? '苦手ノートは空っぽです' : '出題できる問題がありません'}</h2><p class="muted">${part === 'weak' ? 'まちがえた問題や☆をつけた問題がここに集まります。' : ''}</p><button class="btn primary" onclick="history.back()">もどる</button></div>`;
    return;
  }
  const size = part === 'lmix' ? 6 : part === 'ids' || part === 'weak' ? Math.min(pool.length, 20) : st.sessionSize;
  const deck = part === 'ids' ? shuffle([...pool]) : pick(pool, s.items, Math.min(size, pool.length), { newRatio: part === 'weak' ? 0 : st.newRatio });
  return questionSession(root, deck, { title, part, params });
}

// ================= 1問ずつの練習 =================
function questionSession(root, deck, { title, part, params }) {
  const st = store.settings();
  const queue = deck.map((q) => ({ q, retry: false }));
  let idx = 0, combo = 0, maxCombo = 0, xpSum = 0, busy = false, shuffled = null;
  const results = new Map();
  let playing = false;

  root.innerHTML = `
    <header class="play-head">
      <button class="icon-btn close" data-action="quit" aria-label="やめる">✕</button>
      <div class="play-title"><b>${esc(title)}</b><small class="q-part-label"></small></div>
      <div class="play-prog"><i></i></div>
      <span class="play-count"></span>
      <span class="combo-chip" hidden></span>
    </header>
    <div class="stage quiz-stage"></div>`;
  const stage = root.querySelector('.stage');
  const updateHead = () => {
    root.querySelector('.play-prog i').style.width = `${(idx / queue.length) * 100}%`;
    root.querySelector('.play-count').textContent = `${Math.min(idx + 1, queue.length)} / ${queue.length}`;
    const cc = root.querySelector('.combo-chip');
    cc.hidden = combo < 3;
    cc.textContent = `🔥 ${combo} combo`;
  };

  async function play() {
    const { q } = queue[idx];
    const btn = stage.querySelector('[data-action="replay"]');
    playing = true;
    stage.querySelector('.listen-box')?.classList.add('playing');
    if (btn) btn.textContent = '■ 停止';
    const times = busy ? 1 : st.playTwice ? 2 : 1;
    await playListening(q, shuffled, {
      times,
      onLine: (i) => stage.querySelectorAll('.script-line').forEach((l) => l.classList.toggle('now', +l.dataset.i === i)),
    });
    playing = false;
    stage.querySelector('.listen-box')?.classList.remove('playing');
    if (btn) btn.textContent = '▶ もう一度聞く';
  }

  function show() {
    updateHead();
    stopAudio();
    busy = false;
    const { q, retry } = queue[idx];
    const p = partOf(q);
    shuffled = shuffleChoices(q);
    const listening = p[0] === 'l';
    const catLabel = p === 'r1' ? [R1_CATS[q.k], q.custom && (q.src === 'ai' ? 'AIで作った問題' : '取り込んだ問題')].filter(Boolean).join('・') : '';
    root.querySelector('.q-part-label').textContent = `${PART_LABEL[p]}${catLabel ? `・${catLabel}` : ''}`;
    const passage = q.pid ? passageById.get(q.pid) : null;
    stage.innerHTML = `
      ${retry ? '<p class="retry-tag">🔁 もう一度</p>' : ''}
      <div class="q-card card ${p}">
        ${passage ? `<details class="passage-wrap"><summary>📄 長文を読む：${esc(passage.title)}</summary>${passageHTML(q.pid)}</details>` : ''}
        ${listening ? `
          <div class="listen-box">
            <div class="lb-visual">${p === 'l1' ? `<span class="lb-emoji">${q.icon || '💬'}</span>` : '<span class="lb-emoji">🎧</span>'}<span class="eq"><i></i><i></i><i></i><i></i><i></i></span></div>
            <button class="btn ghost" data-action="replay">▶ もう一度聞く</button>
            <p class="small muted">${p === 'l1' ? '会話の最後の発言への応答として、最もふさわしいものを選ぼう（選択肢も音声で流れます）' : '会話・英文と質問を聞いて、答えを選ぼう'}</p>
          </div>` : stemHTML(q)}
        <div class="choices ${p === 'l1' ? 'l1-choices' : ''}">
          ${shuffled.c.map((c, i) => `<button class="choice" data-action="pick" data-i="${i}"><span class="num">${i + 1}</span><span class="ctext">${p === 'l1' ? '' : esc(c)}</span></button>`).join('')}
        </div>
      </div>
      <div class="fb-host"></div>`;
    if (listening) setTimeout(() => { if (queue[idx]?.q === q && !busy) play(); }, 400);
  }

  function choose(i, btn) {
    if (busy) return;
    busy = true;
    const entry = queue[idx];
    const { q, retry } = entry;
    const p = partOf(q);
    const ok = i === shuffled.a;
    if (playing) stopAudio();
    stage.querySelectorAll('.choice').forEach((b, k) => {
      b.disabled = true;
      if (p === 'l1') b.querySelector('.ctext').textContent = shuffled.c[k];
      if (k === shuffled.a) b.classList.add('correct');
      else if (k === i) b.classList.add('wrong');
    });
    if (!retry) {
      store.update((s) => { s.items[q.id] = review(s.items[q.id], ok); });
      results.set(q.id, ok);
    }
    combo = ok ? combo + 1 : 0;
    maxCombo = Math.max(maxCombo, combo);
    const xp = retry ? (ok ? 3 : 0) : xpForAnswer(ok, combo);
    xpSum += xp;
    recordAnswer(p, ok, xp);
    if (ok) {
      sfx.correct(combo);
      if (xp) floatText(`+${xp}`, btn, 'xp');
      if (combo && combo % 5 === 0) { sfx.combo(combo); burst({ count: 45, kind: 'star', y: btn.getBoundingClientRect().top }); }
    } else {
      sfx.wrong();
      shake(btn);
      if (!retry) queue.splice(Math.min(queue.length, idx + 4), 0, { q, retry: true });
    }
    // 問題文に答えを入れて見せる
    if (p === 'r1' || p === 'r2') {
      const stem = stage.querySelector('.stem');
      if (stem) stem.outerHTML = stemHTML(q, { fill: shuffled.c[shuffled.a] });
    }
    const host = stage.querySelector('.fb-host');
    host.innerHTML = `${feedbackHTML(q, shuffled, i, { showScript: st.showScript !== 'never' })}
      <div class="next-row"><button class="btn primary big" data-action="next">${idx + 1 >= queue.length ? '結果を見る' : '次へ ▶'}</button></div>`;
    bindFeedback(host, q, shuffled, i);
    updateHead();
    host.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function finish() {
    stopAudio();
    const total = results.size;
    const okN = [...results.values()].filter(Boolean).length;
    checkBadges({ combo: maxCombo, perfect: total >= 10 && okN === total });
    store.update((s) => { s.bestCombo = Math.max(s.bestCombo, maxCombo); });
    sfx.finish();
    if (okN / Math.max(1, total) >= 0.8) setTimeout(() => rain(70), 300);
    const wrong = [...results.entries()].filter(([, ok]) => !ok).map(([id]) => id);
    root.querySelector('.play-head').innerHTML = `<button class="icon-btn close" data-action="close" aria-label="閉じる">✕</button><div class="play-title"><b>${esc(title)}</b><small>おつかれさま！</small></div>`;
    const snippet = (q) => esc((q.q || q.lines?.map((l) => l[1]).join(' ') || '').slice(0, 70));
    stage.innerHTML = `
      <div class="result card">
        <div class="result-top">
          ${mascot(okN / Math.max(1, total) >= 0.8 ? 'cheer' : okN / Math.max(1, total) >= 0.5 ? 'happy' : 'think', 'bob')}
          <div>
            <p class="eyebrow">RESULT</p>
            <p class="result-score"><b>${okN}</b> / ${total}</p>
            <p class="result-sub">正答率 ${Math.round((okN / Math.max(1, total)) * 100)}%・+${xpSum} XP・最大 ${maxCombo} コンボ</p>
          </div>
        </div>
        <ul class="result-list q-results">
          ${deck.map((q) => `<li class="${results.get(q.id) ? 'ok' : 'ng'}"><span class="mark">${results.get(q.id) ? '○' : '×'}</span><small>${PART_LABEL[partOf(q)].split(' ')[0]}</small><span>${snippet(q)}…</span></li>`).join('')}
        </ul>
        <div class="result-actions">
          ${wrong.length ? `<button class="btn ghost" data-action="again-wrong">まちがえた${wrong.length}問をもう一度</button>` : ''}
          <button class="btn primary" data-action="again">続けて練習</button>
          <button class="btn ghost" data-action="close">もどる</button>
        </div>
      </div>`;
  }

  actions(root, {
    quit: async () => { if (idx === 0 || await confirmDialog('練習をやめますか？<br><small>ここまでの記録は保存されています</small>', { ok: 'やめる' })) history.back(); },
    close: () => (part[0] === 'l' ? go('listen') : part === 'weak' ? go('stats') : go('drill')),
    pick: (el) => choose(+el.dataset.i, el),
    replay: () => { if (playing) { stopAudio(); playing = false; stage.querySelector('.listen-box')?.classList.remove('playing'); stage.querySelector('[data-action="replay"]').textContent = '▶ もう一度聞く'; } else play(); },
    next: () => { sfx.tap(); idx++; if (idx >= queue.length) finish(); else show(); },
    'again-wrong': () => go('quiz', { part: 'ids', ids: [...results.entries()].filter(([, ok]) => !ok).map(([id]) => id).join(',') }),
    again: () => go('quiz', { ...params, t: Date.now() }),
  });
  const onKey = (e) => {
    if (e.target.matches('input, textarea')) return;
    if (/^[1-4]$/.test(e.key)) stage.querySelectorAll('.choice')[+e.key - 1]?.click();
    else if (e.key === 'Enter') stage.querySelector('[data-action="next"]')?.click();
    else if (e.key === ' ' && stage.querySelector('[data-action="replay"]')) { e.preventDefault(); stage.querySelector('[data-action="replay"]').click(); }
  };
  addEventListener('keydown', onKey);
  show();
  return () => { removeEventListener('keydown', onKey); stopAudio(); };
}

// ================= 長文（大問3） =================
function passageSession(root, params) {
  const s = store.get();
  let list = PART3;
  if (params.type) list = list.filter((p) => p.type === params.type);
  let passage = params.pid ? passageById.get(params.pid) : null;
  if (!passage) {
    // まだ解いていない長文 → 記憶が薄れている長文 の順
    const score = (p) => {
      const sts = p.qs.map((q) => s.items[q.id]);
      if (sts.some((x) => !x?.n)) return 10 + Math.random();
      return sts.reduce((a, x) => a + (1 - retrievability(x)) + (status(x) === 'weak' ? 1 : 0), 0) / sts.length + Math.random() * 0.2;
    };
    passage = [...list].sort((a, b) => score(b) - score(a))[0];
  }
  const shuffles = passage.qs.map((q) => shuffleChoices(q));
  const answered = new Map();
  let xpSum = 0, combo = 0;

  root.innerHTML = `
    <header class="play-head">
      <button class="icon-btn close" data-action="quit" aria-label="やめる">✕</button>
      <div class="play-title"><b>${PART_LABEL.r3}</b><small>${R3_TYPES[passage.type]}・${esc(passage.title)}</small></div>
      <div class="play-prog"><i></i></div>
      <span class="play-count">0 / ${passage.qs.length}</span>
    </header>
    <div class="stage passage-stage">
      <div class="passage-col card">
        <div class="passage-tools"><span class="eyebrow">${R3_TYPES[passage.type]}</span><button class="mini-btn" data-action="ja">日本語訳</button><button class="mini-btn" data-action="read">🔊 読み上げ</button></div>
        ${passageHTML(passage.id)}
        <div class="passage-ja" hidden><p>${esc(passage.ja).replace(/\n/g, '<br>')}</p></div>
      </div>
      <div class="q-col">
        ${passage.qs.map((q, n) => `
          <div class="pq card" data-n="${n}">
            <p class="pq-num">(${n + 1})</p>
            ${stemHTML(q)}
            <div class="choices">${shuffles[n].c.map((c, i) => `<button class="choice" data-action="pick" data-n="${n}" data-i="${i}"><span class="num">${i + 1}</span><span class="ctext">${esc(c)}</span></button>`).join('')}</div>
            <div class="fb-host"></div>
          </div>`).join('')}
        <div class="passage-end" hidden></div>
      </div>
    </div>`;
  const stage = root.querySelector('.stage');
  // 本文の単語をタップすると発音
  stage.querySelector('.passage')?.addEventListener('click', async (e) => {
    const w = e.target.closest('.tw');
    if (!w) return;
    const { say } = await import('../speech.js');
    w.classList.add('said');
    setTimeout(() => w.classList.remove('said'), 800);
    say(w.dataset.w);
  });

  function choose(n, i, btn) {
    if (answered.has(n)) return;
    const q = passage.qs[n], sh = shuffles[n];
    const ok = i === sh.a;
    answered.set(n, ok);
    const box = stage.querySelector(`.pq[data-n="${n}"]`);
    box.querySelectorAll('.choice').forEach((b, k) => {
      b.disabled = true;
      if (k === sh.a) b.classList.add('correct'); else if (k === i) b.classList.add('wrong');
    });
    store.update((st) => { st.items[q.id] = review(st.items[q.id], ok); });
    combo = ok ? combo + 1 : 0;
    const xp = xpForAnswer(ok, combo);
    xpSum += xp;
    recordAnswer('r3', ok, xp);
    if (ok) { sfx.correct(combo); floatText(`+${xp}`, btn, 'xp'); } else { sfx.wrong(); shake(btn); }
    const host = box.querySelector('.fb-host');
    host.innerHTML = feedbackHTML(q, sh, i);
    bindFeedback(host, q, sh, i);
    root.querySelector('.play-prog i').style.width = `${(answered.size / passage.qs.length) * 100}%`;
    root.querySelector('.play-count').textContent = `${answered.size} / ${passage.qs.length}`;
    if (answered.size === passage.qs.length) done();
  }

  function done() {
    const okN = [...answered.values()].filter(Boolean).length;
    checkBadges({ combo });
    sfx.finish();
    if (okN === passage.qs.length) burst({ count: 70, kind: 'star' });
    const end = stage.querySelector('.passage-end');
    end.hidden = false;
    end.innerHTML = `
      <div class="card result mini">
        <p class="result-score"><b>${okN}</b> / ${passage.qs.length} <small>+${xpSum} XP</small></p>
        <div class="result-actions">
          <button class="btn primary" data-action="next-passage">次の長文へ ▶</button>
          <button class="btn ghost" data-action="close">もどる</button>
        </div>
      </div>`;
    end.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  actions(root, {
    pick: (el) => choose(+el.dataset.n, +el.dataset.i, el),
    ja: (el) => { const j = stage.querySelector('.passage-ja'); j.hidden = !j.hidden; el.classList.toggle('on', !j.hidden); },
    read: async (el) => {
      if (el.classList.contains('on')) { stopAudio(); el.classList.remove('on'); return; }
      el.classList.add('on');
      const { speakLines } = await import('../speech.js');
      await speakLines(passage.body.split(/\n+/).filter(Boolean).map((t) => ['W', t]), { gap: 300 });
      el.classList.remove('on');
    },
    'next-passage': () => go('quiz', { part: 'r3', ...(params.type ? { type: params.type } : {}), t: Date.now() }),
    close: () => go('drill'),
    quit: async () => { if (!answered.size || answered.size === passage.qs.length || await confirmDialog('長文をやめますか？', { ok: 'やめる' })) go('drill'); },
  });
  return () => stopAudio();
}
