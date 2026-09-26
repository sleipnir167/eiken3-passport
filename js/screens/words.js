// 単語帳：学習モードの選択・範囲・一覧と検索
import * as store from '../store.js';
import { WORDS, IDIOMS, PHRASES, CARDS, cardById, meanKey, spellKey, exampleHTML, spellable, RANK_LABEL, KIND_LABEL } from '../bank.js';
import { status, STATUS_LABEL, retrievability, isDue } from '../srs.js';
import { actions, esc, modal, ring, toast } from '../ui.js';
import { go } from '../app.js';
import { sfx } from '../sound.js';
import { say } from '../speech.js';

export const CHUNK = 50;
// でる順（重要度順・同じ重要度は元の順）
export const WORDS_BY_RANK = [...WORDS].sort((a, b) => a.r - b.r || a.n - b.n);

/** 範囲（src）からカードの集合を作る */
export function cardsFor(src = 'auto') {
  const s = store.get();
  const [type, arg, arg2] = String(src).split(':');
  switch (type) {
    case 'rank': return WORDS_BY_RANK.filter((c) => c.r === +arg);
    case 'kind': return arg === 'idiom' ? IDIOMS : arg === 'phrase' ? PHRASES : WORDS_BY_RANK;
    case 'chunk': {
      const list = arg === 'idiom' ? IDIOMS : arg === 'phrase' ? PHRASES : WORDS_BY_RANK;
      return list.slice(+arg2 * CHUNK, (+arg2 + 1) * CHUNK);
    }
    case 'weak': return CARDS.filter((c) => status(s.items[meanKey(c)]) === 'weak' || status(s.items[spellKey(c)]) === 'weak');
    case 'star': return CARDS.filter((c) => s.stars[`c:${c.id}`]);
    case 'due': return CARDS.filter((c) => isDue(s.items[meanKey(c)]));
    case 'new': return WORDS_BY_RANK.filter((c) => !s.items[meanKey(c)]?.n);
    default: return [...WORDS_BY_RANK, ...IDIOMS, ...PHRASES];
  }
}
export function srcLabel(src = 'auto') {
  const [type, arg, arg2] = String(src).split(':');
  if (type === 'rank') return `ランク${RANK_LABEL[arg]}`;
  if (type === 'kind') return KIND_LABEL[arg] || '単語';
  if (type === 'chunk') {
    const len = (arg === 'idiom' ? IDIOMS : arg === 'phrase' ? PHRASES : WORDS).length;
    return `${KIND_LABEL[arg] || '単語'} ${+arg2 * CHUNK + 1}〜${Math.min((+arg2 + 1) * CHUNK, len)}`;
  }
  return { weak: '苦手', star: '☆つき', due: '復習どき', new: '未学習', auto: 'おまかせ' }[type] || 'おまかせ';
}

const MODES = [
  { id: 'flash', icon: '🃏', name: 'フラッシュカード', desc: '見て・聞いて・思い出す。自己評価で忘却曲線に反映' },
  { id: 'speed', icon: '⚡', name: '高速周回', desc: '1枚1秒。スワイプで「知ってる／知らない」を大量に回す' },
  { id: 'choice', icon: '✅', name: '4択クイズ', desc: '意味を4つから選ぶ。制限時間つき' },
  { id: 'listen', icon: '🎧', name: '聞いて選ぶ', desc: '発音を聞いて意味を選ぶ' },
  { id: 'spell', icon: '✍️', name: '手書きスペル', desc: '意味を見てつづりをペンで書く。自動で採点' },
  { id: 'dictation', icon: '👂', name: 'ディクテーション', desc: '発音を聞いてつづりを書く' },
];

export function renderWords(root, params) {
  const s = store.get();
  let mode = params.mode || localStorage.getItem('e3-wmode') || 'flash';
  let src = params.src || localStorage.getItem('e3-wsrc') || 'auto';
  let dir = localStorage.getItem('e3-wdir') || 'en';
  let q = '', filter = 'all';

  const stat = (list, key = meanKey) => {
    const out = { new: 0, learning: 0, review: 0, mastered: 0, weak: 0 };
    for (const c of list) out[status(s.items[key(c)])]++;
    return out;
  };
  const groups = [
    ['A 最重要', WORDS_BY_RANK.filter((c) => c.r === 1), 'var(--coral)'],
    ['B 重要', WORDS_BY_RANK.filter((c) => c.r === 2), 'var(--sun-deep)'],
    ['C おさえたい', WORDS_BY_RANK.filter((c) => c.r === 3), 'var(--sky)'],
    ['熟語', IDIOMS, 'var(--violet)'],
    ['会話表現', PHRASES, 'var(--mint)'],
  ];
  const all = stat(CARDS);
  const total = CARDS.length;

  const chunkOpts = () => {
    const out = [];
    for (let i = 0; i < Math.ceil(WORDS_BY_RANK.length / CHUNK); i++) out.push([`chunk:word:${i}`, `単語 ${i * CHUNK + 1}〜${Math.min((i + 1) * CHUNK, WORDS_BY_RANK.length)}`]);
    for (let i = 0; i < Math.ceil(IDIOMS.length / CHUNK); i++) out.push([`chunk:idiom:${i}`, `熟語 ${i * CHUNK + 1}〜${Math.min((i + 1) * CHUNK, IDIOMS.length)}`]);
    for (let i = 0; i < Math.ceil(PHRASES.length / CHUNK); i++) out.push([`chunk:phrase:${i}`, `会話表現 ${i * CHUNK + 1}〜${Math.min((i + 1) * CHUNK, PHRASES.length)}`]);
    return out;
  };
  const lapInfo = (k) => { const l = s.laps[k]; return l ? `${l.count}周・ベスト ${(l.best / 1000).toFixed(0)}秒` : ''; };

  const draw = () => {
    const srcSet = cardsFor(src);
    const spellMode = mode === 'spell' || mode === 'dictation';
    const avail = spellMode ? srcSet.filter(spellable) : srcSet;
    root.innerHTML = `
    <header class="page-head">
      <h1>単語帳 <small>${total}語・熟語・会話表現</small></h1>
    </header>
    <section class="card words-overview">
      <div class="wo-rings">
        ${groups.map(([name, list, color]) => {
          const st = stat(list);
          const done = st.review + st.mastered;
          return `<div class="wo-ring">${ring(done / list.length, { size: 84, stroke: 9, color, label: `${Math.round((done / list.length) * 100)}<small>%</small>`, sub: '' })}<b>${name}</b><small>${done}/${list.length}</small></div>`;
        }).join('')}
      </div>
      <div class="status-bar" aria-label="状態の内訳">
        ${['mastered', 'review', 'learning', 'weak', 'new'].map((k) => `<i class="st-${k}" style="flex:${all[k] || 0.0001}" title="${STATUS_LABEL[k]} ${all[k]}"></i>`).join('')}
      </div>
      <div class="status-legend">${['mastered', 'review', 'learning', 'weak', 'new'].map((k) => `<span><i class="dot st-${k}"></i>${STATUS_LABEL[k]} ${all[k]}</span>`).join('')}</div>
    </section>

    <section class="card mode-card">
      <h2>学習モード</h2>
      <div class="mode-grid">
        ${MODES.map((m) => `<button class="mode ${m.id === mode ? 'on' : ''}" data-action="mode" data-m="${m.id}"><span class="mode-icon">${m.icon}</span><b>${m.name}</b><small>${m.desc}</small></button>`).join('')}
      </div>
      <h3 class="sub-h">範囲</h3>
      <div class="chips">
        ${[['auto', 'おまかせ（忘却曲線）'], ['due', '復習どき'], ['new', '未学習'], ['rank:1', 'ランクA'], ['rank:2', 'ランクB'], ['rank:3', 'ランクC'], ['kind:idiom', '熟語'], ['kind:phrase', '会話表現'], ['weak', '苦手'], ['star', '☆つき']]
          .map(([v, l]) => `<button class="chip ${src === v ? 'on' : ''}" data-action="src" data-v="${v}">${l}</button>`).join('')}
        <select class="chip-select ${src.startsWith('chunk') ? 'on' : ''}" aria-label="番号で範囲を選ぶ">
          <option value="">番号で選ぶ…</option>
          ${chunkOpts().map(([v, l]) => `<option value="${v}" ${src === v ? 'selected' : ''}>${l}</option>`).join('')}
        </select>
      </div>
      ${mode === 'flash' ? `<div class="dir-row"><span class="muted small">表に出すのは</span><div class="seg">${[['en', '英語 → 意味'], ['ja', '意味 → 英語']].map(([v, l]) => `<button class="${dir === v ? 'on' : ''}" data-action="dir" data-v="${v}">${l}</button>`).join('')}</div></div>` : ''}
      <div class="start-row">
        <p class="small">${srcLabel(src)}：<b>${avail.length}</b> ${spellMode ? '語（つづりを書けるもの）' : '枚'}${mode === 'speed' && lapInfo(src) ? `<span class="lap-info">⚡ ${lapInfo(src)}</span>` : ''}</p>
        <button class="btn primary big" data-action="start" ${avail.length ? '' : 'disabled'}>${mode === 'speed' ? '⚡ 周回スタート' : 'スタート'}</button>
      </div>
    </section>

    <section class="card word-list-card">
      <div class="wl-head">
        <h2>単語リスト</h2>
        <input class="text-in search" type="search" placeholder="英語・日本語で検索" value="${esc(q)}" aria-label="検索" autocapitalize="off" autocorrect="off" spellcheck="false">
      </div>
      <div class="chips small-chips">
        ${[['all', 'すべて'], ['weak', '苦手'], ['new', '未学習'], ['learning', '学習中'], ['review', '定着中'], ['mastered', '習得'], ['star', '☆']].map(([v, l]) => `<button class="chip ${filter === v ? 'on' : ''}" data-action="filter" data-v="${v}">${l}</button>`).join('')}
      </div>
      <ul class="word-list" id="wl"></ul>
    </section>`;
    root.querySelector('.search').addEventListener('input', (e) => { q = e.target.value; drawList(); });
    root.querySelector('.chip-select').addEventListener('change', (e) => { if (e.target.value) { src = e.target.value; localStorage.setItem('e3-wsrc', src); sfx.select(); draw(); } });
    drawList();
  };

  const drawList = () => {
    const ul = root.querySelector('#wl');
    const qq = q.trim().toLowerCase();
    let list = cardsFor(src.startsWith('chunk') || src.startsWith('rank') || src.startsWith('kind') ? src : 'auto');
    if (qq) list = CARDS.filter((c) => c.w.toLowerCase().includes(qq) || c.m.includes(q.trim()));
    if (filter === 'star') list = list.filter((c) => s.stars[`c:${c.id}`]);
    else if (filter !== 'all') list = list.filter((c) => status(s.items[meanKey(c)]) === filter);
    const shown = list.slice(0, 300);
    ul.innerHTML = shown.map((c) => {
      const st = status(s.items[meanKey(c)]);
      return `<li><button class="wl-row" data-id="${esc(c.id)}">
        <i class="dot st-${st}" title="${STATUS_LABEL[st]}"></i>
        <b class="wl-w">${esc(c.w)}</b><span class="wl-pos">${esc(c.pos)}</span><span class="wl-m">${esc(c.m)}</span>
        ${s.stars[`c:${c.id}`] ? '<span class="star-on">★</span>' : ''}
      </button></li>`;
    }).join('') + (list.length > shown.length ? `<li class="muted small center">ほか ${list.length - shown.length} 件（検索でしぼりこめます）</li>` : '') + (!list.length ? '<li class="muted center">該当する単語はありません</li>' : '');
  };

  actions(root, {
    mode: (el) => { mode = el.dataset.m; localStorage.setItem('e3-wmode', mode); sfx.select(); draw(); },
    src: (el) => { src = el.dataset.v; localStorage.setItem('e3-wsrc', src); sfx.select(); draw(); },
    dir: (el) => { dir = el.dataset.v; localStorage.setItem('e3-wdir', dir); sfx.select(); draw(); },
    filter: (el) => { filter = el.dataset.v; sfx.tap(); root.querySelectorAll('[data-action="filter"]').forEach((b) => b.classList.toggle('on', b === el)); drawList(); },
    start: () => { sfx.takeoff(); go('wordplay', { mode, src, dir }); },
  });
  root.addEventListener('click', (e) => {
    const row = e.target.closest('.wl-row');
    if (row) { sfx.tap(); openCard(row.dataset.id, () => drawList()); }
  });
  draw();
}

/** 単語の詳細 */
export function openCard(id, onClose) {
  const c = cardById.get(id);
  if (!c) return;
  const s = store.get();
  const stM = s.items[meanKey(c)], stS = s.items[spellKey(c)];
  const starKey = `c:${c.id}`;
  const info = (st) => (st?.n ? `${STATUS_LABEL[status(st)]}・${st.c}/${st.n}回正解・記憶 ${Math.round(retrievability(st) * 100)}%` : '未学習');
  const m = modal(`
    <div class="card-detail">
      <p class="eyebrow">${KIND_LABEL[c.kind]}・${RANK_LABEL[c.r]}</p>
      <h2 class="cd-word">${esc(c.w)} <button class="icon-btn speak" data-say="${esc(c.w)}" aria-label="発音">🔊</button></h2>
      <p class="cd-mean"><span class="pos">${esc(c.pos)}</span> ${esc(c.m)}</p>
      ${c.f ? `<p class="cd-forms">変化：${esc(c.f)}</p>` : ''}
      <div class="cd-ex"><p>${exampleHTML(c)} <button class="icon-btn speak small" data-say="${esc(c.e.replace(/[{}]/g, ''))}" aria-label="例文を聞く">🔊</button></p><p class="muted">${esc(c.ej)}</p></div>
      <dl class="cd-stats"><dt>意味</dt><dd>${info(stM)}</dd>${spellable(c) ? `<dt>つづり</dt><dd>${info(stS)}</dd>` : ''}</dl>
      <div class="modal-actions">
        <button class="btn ghost" data-star>${s.stars[starKey] ? '★ ☆をはずす' : '☆ 苦手ノートに入れる'}</button>
        ${spellable(c) ? '<button class="btn primary" data-spell>✍️ つづりを練習</button>' : ''}
        <button class="btn ghost" data-close>閉じる</button>
      </div>
    </div>`, { onClose });
  m.el.querySelectorAll('[data-say]').forEach((b) => b.addEventListener('click', () => say(b.dataset.say)));
  m.el.querySelector('[data-star]').addEventListener('click', (e) => {
    store.update((st) => { if (st.stars[starKey]) delete st.stars[starKey]; else st.stars[starKey] = Date.now(); });
    sfx.select();
    e.target.textContent = store.get().stars[starKey] ? '★ ☆をはずす' : '☆ 苦手ノートに入れる';
    toast(store.get().stars[starKey] ? '苦手ノートに入れました' : '苦手ノートからはずしました', { icon: '☆' });
  });
  m.el.querySelector('[data-spell]')?.addEventListener('click', () => { m.close(); go('wordplay', { mode: 'spell', ids: c.id }); });
  say(c.w);
}
