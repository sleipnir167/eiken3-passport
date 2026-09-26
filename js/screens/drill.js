// 筆記（リーディング）メニュー：大問1〜3・文法・問題の追加（AI生成・取り込み）
import * as store from '../store.js';
import { PART1, PART2, PART3, R1_CATS, R3_TYPES, part1Pool, hashId, WORDS, meanKey } from '../bank.js';
import { status } from '../srs.js';
import { actions, esc, modal, toast, confirmDialog } from '../ui.js';
import { go } from '../app.js';
import { sfx } from '../sound.js';
import { GRAMMAR } from '../../data/grammar.js';
import { chatJSON, aiReady } from '../ai.js';
import { generateQuizPrompt } from '../prompts.js';

/** 問題の集まりの成績 */
export function statsOf(list) {
  const items = store.get().items;
  let seen = 0, c = 0, n = 0, mastered = 0;
  for (const q of list) {
    const st = items[q.id];
    if (!st?.n) continue;
    seen++; c += st.c; n += st.n;
    if (['review', 'mastered'].includes(status(st))) mastered++;
  }
  return { seen, total: list.length, acc: n ? c / n : null, mastered };
}
const pct = (x) => (x == null ? '--' : `${Math.round(x * 100)}%`);

export function renderDrill(root) {
  const draw = () => {
    const s = store.get();
    const p1 = part1Pool(s.custom);
    const custom = s.custom.filter((q) => q.part === 1);
    const catStats = Object.keys(R1_CATS).map((k) => [k, statsOf(PART1.filter((q) => q.k === k))]);
    const s2 = statsOf(PART2);
    root.innerHTML = `
    <header class="page-head"><h1>筆記 <small>リーディング 30問・65分（ライティングとあわせて）</small></h1></header>

    <section class="card drill-card">
      <div class="dc-head"><span class="dc-num">1</span><div><h2>短文の語句空所補充 <small>本番 15問</small></h2><p class="small muted">単語・熟語・文法の知識を問う。1問30秒で解けるようにしよう</p></div>
        <button class="btn primary" data-go="quiz" data-p='{"part":"r1"}'>おまかせ ▶</button></div>
      <div class="cat-grid">
        ${catStats.map(([k, st]) => `<button class="cat" data-go="quiz" data-p='{"part":"r1","cat":"${k}"}'><b>${R1_CATS[k]}</b><small>${st.total}問・正答率 ${pct(st.acc)}</small><i class="cat-bar" style="width:${(st.mastered / st.total) * 100}%"></i></button>`).join('')}
        ${custom.length ? `<button class="cat" data-go="quiz" data-p='{"part":"r1","src":"custom"}'><b>追加した問題</b><small>${custom.length}問</small></button>` : ''}
      </div>
    </section>

    <section class="card drill-card">
      <div class="dc-head"><span class="dc-num">2</span><div><h2>会話文の文空所補充 <small>本番 5問</small></h2><p class="small muted">会話の流れに合う文を選ぶ。空所の「あと」の文がヒント</p></div>
        <button class="btn primary" data-go="quiz" data-p='{"part":"r2"}'>練習 ▶</button></div>
      <p class="small">${s2.total}問・解いた ${s2.seen}問・正答率 ${pct(s2.acc)}</p>
    </section>

    <section class="card drill-card">
      <div class="dc-head"><span class="dc-num">3</span><div><h2>長文の内容一致選択 <small>本番 10問（A 2問・B 3問・C 5問）</small></h2><p class="small muted">先に質問を読んでから本文を読むと速い</p></div>
        <button class="btn primary" data-go="quiz" data-p='{"part":"r3"}'>おまかせ ▶</button></div>
      <div class="passage-list">
        ${PART3.map((p) => { const st = statsOf(p.qs); return `<button class="passage-item" data-go="quiz" data-p='{"part":"r3","pid":"${p.id}"}'><span class="pt pt-${p.type}">${p.type}</span><b>${esc(p.title)}</b><small>${R3_TYPES[p.type]}・${p.qs.length}問</small><span class="ps">${st.seen ? `${pct(st.acc)}` : '未'}</span></button>`; }).join('')}
      </div>
    </section>

    <section class="card">
      <h2>🧩 文法レッスン <small>3級で出る15項目</small></h2>
      <div class="grammar-grid">
        ${GRAMMAR.map((g) => { const st = statsOf(PART1.filter((q) => q.g === g.key)); return `<button class="gram" data-go="grammar" data-p='{"key":"${g.key}"}'><span>${g.icon}</span><b>${g.title}</b><small>${g.level}${st.total ? `・${st.total}問` : ''}</small></button>`; }).join('')}
      </div>
    </section>

    <section class="card add-card">
      <h2>➕ 問題をふやす</h2>
      <p class="small muted">追加した問題は「大問1」の練習や模試に混ざって出題され、忘却曲線で管理されます。</p>
      <div class="add-actions">
        <button class="btn ghost" data-action="gen">🤖 AIで大問1の問題を作る</button>
        <button class="btn ghost" data-action="import">📥 問題を取り込む（過去問・問題集など）</button>
        ${custom.length ? `<button class="btn ghost" data-action="manage">追加した問題（${custom.length}問）</button>` : ''}
      </div>
    </section>`;
    root.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => { sfx.select(); go(b.dataset.go, b.dataset.p ? JSON.parse(b.dataset.p) : {}); }));
  };

  actions(root, {
    gen: () => openGenerator(draw),
    import: () => openImport(draw),
    manage: () => openManage(draw),
  });
  draw();
}

function saveCustom(list, src) {
  let added = 0;
  store.update((s) => {
    const have = new Set(s.custom.map((q) => q.id));
    for (const q of list) {
      const id = `r1:c${hashId(q.q)}`;
      if (have.has(id)) continue;
      s.custom.push({ id, part: 1, custom: true, src, q: q.q, c: q.c, a: 0, k: 'custom', x: q.x || '', j: q.j || '', t: Date.now() });
      have.add(id);
      added++;
    }
  });
  return added;
}

/** AI で大問1形式の問題を作る（作った問題は端末に保存して何度でも使える） */
function openGenerator(onDone) {
  const s = store.get();
  const weakWords = WORDS.filter((c) => status(s.items[meanKey(c)]) === 'weak').slice(0, 8).map((c) => c.w);
  const m = modal(`
    <h2>🤖 AIで問題を作る</h2>
    <p class="small muted">英検3級の大問1形式の4択問題を作ります。1回で5問（AIの利用は1回分）。作った問題は端末に保存され、何度でも無料で解けます。</p>
    <label class="set-row col"><span>ねらい</span>
      <select class="text-in" data-k="target">
        <option value="weak">苦手な単語から${weakWords.length ? `（${weakWords.slice(0, 4).join(', ')} など）` : '（まだ苦手な単語がありません）'}</option>
        ${GRAMMAR.map((g) => `<option value="g:${g.key}">文法：${g.title}</option>`).join('')}
        <option value="words">単語を指定する</option>
      </select></label>
    <label class="set-row col words-in" hidden><span>単語（カンマ区切り）</span><input class="text-in" data-k="words" placeholder="borrow, decide, famous"></label>
    <div class="modal-actions"><button class="btn ghost" data-close>キャンセル</button><button class="btn primary" data-go>作る</button></div>`);
  const sel = m.el.querySelector('[data-k="target"]');
  sel.addEventListener('change', () => { m.el.querySelector('.words-in').hidden = sel.value !== 'words'; });
  m.el.querySelector('[data-go]').addEventListener('click', async (e) => {
    if (!aiReady()) { toast('設定 → AI で接続先を登録してください', { icon: '🤖' }); return; }
    const v = sel.value;
    const words = v === 'weak' ? weakWords : v === 'words' ? m.el.querySelector('[data-k="words"]').value.split(/[,、\s]+/).filter(Boolean) : [];
    const grammar = v.startsWith('g:') ? GRAMMAR.find((g) => g.key === v.slice(2))?.title : '';
    if (v === 'weak' && !words.length) { toast('苦手な単語がまだないので、文法か単語を指定してください'); return; }
    const btn = e.currentTarget;
    btn.classList.add('loading');
    try {
      const r = await chatJSON(generateQuizPrompt({ words, grammar, count: 5 }), { cache: false, maxTokens: 1600, temperature: 0.7 });
      const list = (Array.isArray(r.data) ? r.data : []).filter((q) => q && typeof q.q === 'string' && /\(\s*\)/.test(q.q) && Array.isArray(q.c) && q.c.length === 4 && q.a >= 0 && q.a < 4)
        .map((q) => ({ q: q.q.trim(), c: [q.c[q.a], ...q.c.filter((_, i) => i !== q.a)].map(String), x: q.x, j: q.j }))
        .filter((q) => new Set(q.c).size === 4);
      if (!list.length) throw new Error('AIの返答を問題として読み取れませんでした。もう一度試すか、別のモデルを使ってください。');
      const n = saveCustom(list, 'ai');
      sfx.badge();
      toast(`${n}問を追加しました`, { icon: '✨' });
      m.close();
      onDone();
      go('quiz', { part: 'r1', src: 'custom' });
    } catch (err) {
      toast(esc(err.message), { icon: '⚠️', ms: 5000 });
    } finally {
      btn.classList.remove('loading');
    }
  });
}

/** 取り込み：1行1問（| 区切り または タブ区切り） */
function openImport(onDone) {
  const m = modal(`
    <h2>📥 問題を取り込む</h2>
    <p class="small">手持ちの問題集や過去問（<b>自分の学習用</b>）を大問1の形式で追加できます。1行に1問、次のどちらかの形で貼りつけてください。</p>
    <pre class="code">問題文（空所は ( ) ）|正解 / 誤答 / 誤答 / 誤答|解説|訳</pre>
    <pre class="code">問題文 [タブ] 正解 [タブ] 誤答 [タブ] 誤答 [タブ] 誤答 [タブ] 解説 [タブ] 訳</pre>
    <p class="tiny muted">※ スプレッドシートからコピーするとタブ区切りになります。解説・訳は省略可。</p>
    <textarea class="text-in import-area" rows="8" placeholder="I'm interested ( ) music.|in / at / on / for|be interested in ～|私は音楽に興味があります。"></textarea>
    <div class="modal-actions"><button class="btn ghost" data-close>キャンセル</button><button class="btn primary" data-go>取り込む</button></div>`);
  m.el.querySelector('[data-go]').addEventListener('click', () => {
    const text = m.el.querySelector('textarea').value;
    const list = [], bad = [];
    for (const line of text.split('\n').map((l) => l.trim()).filter(Boolean)) {
      let q, c, x = '', j = '';
      if (line.includes('\t')) {
        const cols = line.split('\t').map((t) => t.trim());
        [q] = cols; c = cols.slice(1, 5); x = cols[5] || ''; j = cols[6] || '';
      } else {
        const cols = line.split('|').map((t) => t.trim());
        q = cols[0]; c = (cols[1] || '').split('/').map((t) => t.trim()).filter(Boolean); x = cols[2] || ''; j = cols[3] || '';
      }
      if (!q || c.length !== 4 || new Set(c).size !== 4) { bad.push(line); continue; }
      if (!/\(\s*\)/.test(q)) q = q.replace(/_{2,}|（\s*）/, '( )');
      list.push({ q, c, x, j });
    }
    if (!list.length) { toast('取り込める行がありませんでした。形式を確認してください', { icon: '⚠️' }); return; }
    const n = saveCustom(list, 'import');
    toast(`${n}問を取り込みました${bad.length ? `（${bad.length}行は形式エラー）` : ''}`, { icon: '📥', ms: 4000 });
    m.close();
    onDone();
  });
}

function openManage(onDone) {
  const s = store.get();
  const list = s.custom.filter((q) => q.part === 1);
  const m = modal(`
    <h2>追加した問題 <small>${list.length}問</small></h2>
    <ul class="custom-list">${list.map((q) => `<li><span class="tag">${q.src === 'ai' ? 'AI' : '取込'}</span><span>${esc(q.q)}</span><small>正解：${esc(q.c[0])}</small><button class="mini-btn" data-del="${esc(q.id)}">削除</button></li>`).join('')}</ul>
    <div class="modal-actions"><button class="btn danger" data-all>すべて削除</button><button class="btn ghost" data-close>閉じる</button></div>`, { onClose: onDone });
  m.el.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-del]');
    if (b) {
      store.update((st) => { st.custom = st.custom.filter((q) => q.id !== b.dataset.del); });
      b.closest('li').remove();
    }
    if (e.target.closest('[data-all]') && await confirmDialog('追加した問題をすべて削除しますか？', { ok: '削除', danger: true })) {
      store.update((st) => { st.custom = st.custom.filter((q) => q.part !== 1); });
      m.close();
    }
  });
}
