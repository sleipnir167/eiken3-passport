// 設定
import * as store from '../store.js';
import { STRICTNESS, recognizeBoxes, displayChar } from '../recognizer.js';
import { englishVoices, say, speak, sttSupported } from '../speech.js';
import { testProvider, listModels, usageThisMonth } from '../ai.js';
import { kvClear, kvKeys } from '../kv.js';
import { Pad } from '../pad.js';
import { actions, esc, toast, confirmDialog } from '../ui.js';
import { applyTheme, go } from '../app.js';
import { sfx } from '../sound.js';

const PRESETS = [
  { label: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1', model: 'google/gemini-2.5-flash-lite' },
  { label: 'Ollama（自前）', baseUrl: 'https://your-server.example.com/v1', model: 'gemma3:12b' },
  { label: 'llama.cpp / vLLM（自前）', baseUrl: 'https://your-server.example.com/v1', model: 'gemma-3-12b-it' },
];

export function renderSettings(root, params) {
  let testPad = null;
  const draw = () => {
    const st = store.settings();
    const seg = (key, opts) => `<div class="seg" role="radiogroup">${opts.map(([v, l]) => `<button type="button" class="${String(st[key]) === String(v) ? 'on' : ''}" data-action="set" data-k="${key}" data-v="${v}">${l}</button>`).join('')}</div>`;
    const tog = (key) => `<button type="button" class="toggle ${st[key] ? 'on' : ''}" data-action="toggle" data-k="${key}" role="switch" aria-checked="${!!st[key]}"><i></i></button>`;
    const voices = englishVoices();
    const vopts = (sel) => `<option value="">自動で選ぶ</option>${voices.map((v) => `<option value="${esc(v.name)}" ${v.name === sel ? 'selected' : ''}>${esc(v.name)}（${esc(v.lang)}）</option>`).join('')}`;
    const ai = st.ai;
    const usage = usageThisMonth();
    root.innerHTML = `
    <header class="page-head"><button class="icon-btn back" data-action="back" aria-label="もどる">‹</button><h1>設定</h1></header>
    <section class="settings">
      <div class="card set-group" id="sec-profile">
        <h2>プロフィール・目標</h2>
        <label class="set-row"><span>ニックネーム<small>面接で呼ばれる名前（英字がおすすめ）</small></span><input class="text-in" data-k="name" value="${esc(st.name)}" maxlength="16" placeholder="Ken" autocapitalize="words"></label>
        <label class="set-row"><span>一次試験の日</span><input class="text-in" type="date" data-k="examDate" value="${esc(st.examDate)}"></label>
        <label class="set-row"><span>二次試験（面接）の日</span><input class="text-in" type="date" data-k="exam2Date" value="${esc(st.exam2Date)}"></label>
        <div class="set-row"><span>1日の目標（問題・カード）</span>${seg('dailyGoal', [[20, '20'], [40, '40'], [60, '60'], [100, '100']])}</div>
        <div class="set-row"><span>1回の問題数<small>筆記・リスニング・スペル</small></span>${seg('sessionSize', [[5, '5'], [10, '10'], [15, '15'], [20, '20']])}</div>
        <div class="set-row"><span>新しい問題の割合<small>残りは復習と苦手</small></span>${seg('newRatio', [[0.1, '少'], [0.3, 'ふつう'], [0.5, '多']])}</div>
      </div>

      <div class="card set-group" id="sec-hand">
        <h2>手書き（スペル）</h2>
        <div class="set-row col"><span>判定のしかた</span>${seg('judge', [['auto', '自動（おすすめ）'], ['offline', '端末内のみ'], ['self', '自分で判定']])}
          <small class="muted">自動：オンライン時は Google の手書き認識で1文字ずつ判定し、オフライン時は端末内の簡易認識で判定します。<br>※ 自動の場合、書いた線の座標データが Google に送信されます。送信したくない場合は「端末内のみ」を選んでください。</small></div>
        <div class="set-row"><span>判定のきびしさ</span>${seg('strict', Object.entries(STRICTNESS).map(([k, v]) => [k, v.label]))}</div>
        <div class="set-row col"><span>書き方</span>${seg('spellMode', [['box', '1マス1文字（おすすめ）'], ['line', '1行に続けて書く'], ['keyboard', 'キーボード']])}
          <small class="muted">1マス1文字：まちがえた文字がわかり、自動補正も入らないので正確。1行：本番の答案に近い書き方（オンラインのみ）。</small></div>
        <div class="set-row"><span>マスの数で文字数を教える<small>オフにすると「1行」で書きます</small></span>${tog('lengthHint')}</div>
        <div class="set-row"><span>Apple Pencil だけで書く</span>${tog('pencilOnly')}</div>
        <div class="set-row"><span>ペンを使ったら指の入力を無視<small>手のひらの誤反応を防ぎます</small></span>${tog('autoPalm')}</div>
        <div class="set-row col"><span>認識のテスト<small>マスにアルファベットを1文字書いてみよう</small></span><div class="hw-test"><div class="hw-pad"></div><div class="hw-out">?</div><button class="mini-btn" data-action="hw-clear">消す</button></div></div>
      </div>

      <div class="card set-group" id="sec-voice">
        <h2>音声</h2>
        <label class="set-row"><span>女性の声</span><select class="text-in" data-k="voiceF">${vopts(st.voiceF)}</select></label>
        <label class="set-row"><span>男性の声</span><select class="text-in" data-k="voiceM">${vopts(st.voiceM)}</select></label>
        <label class="set-row"><span>読み上げの速さ <b class="rate-v">${st.rate}</b></span><input type="range" min="0.6" max="1.2" step="0.05" value="${st.rate}" data-k="rate" class="range"></label>
        <div class="row-btns"><button class="btn ghost small" data-action="vtest" data-g="F">女性の声を試す</button><button class="btn ghost small" data-action="vtest" data-g="M">男性の声を試す</button></div>
        <div class="set-row"><span>単語を自動で発音</span>${tog('autoSpeak')}</div>
        <div class="set-row"><span>リスニングを2回流す<small>本番は2回</small></span>${tog('playTwice')}</div>
        <div class="set-row"><span>リスニングのスクリプト</span>${seg('showScript', [['after', '答えたあとに表示'], ['never', '表示しない']])}</div>
        <div class="set-row"><span>面接官の字幕（練習モード）</span>${tog('subtitles')}</div>
        <p class="small muted">音声認識：${sttSupported() ? '✅ 使えます' : '⚠️ このブラウザでは使えません（面接は文字入力で答えます）'}。iPad は「設定 → アクセシビリティ → 読み上げコンテンツ → 声」で英語の高音質の声を追加できます。Pixel / Android の Chrome では Google の音声で読み上げ・認識します。</p>
      </div>

      <div class="card set-group" id="sec-ai">
        <h2>🤖 AI（解説・添削・面接の採点）</h2>
        <p class="small">OpenAI 互換の API に対応しています。<b>上から順に試し、失敗したら次へ</b>進みます。無料・自前のサーバーを上に置くと、クレジットを使うのはそれが使えないときだけになります。</p>
        <div class="provider-list">
          ${ai.providers.map((p, i) => `
          <div class="provider ${p.on ? 'on' : ''}" data-i="${i}">
            <div class="pv-head">
              <button type="button" class="toggle ${p.on ? 'on' : ''}" data-action="pv-toggle" data-i="${i}" role="switch" aria-checked="${p.on}"><i></i></button>
              <input class="text-in pv-name" data-pv="name" data-i="${i}" value="${esc(p.name)}">
              <span class="pv-order"><button class="mini-btn" data-action="pv-up" data-i="${i}" ${i ? '' : 'disabled'} aria-label="上へ">▲</button><button class="mini-btn" data-action="pv-down" data-i="${i}" ${i < ai.providers.length - 1 ? '' : 'disabled'} aria-label="下へ">▼</button></span>
            </div>
            <label class="pv-row"><span>URL</span><input class="text-in" data-pv="baseUrl" data-i="${i}" value="${esc(p.baseUrl)}" placeholder="https://…/v1" autocapitalize="off" autocorrect="off" spellcheck="false"></label>
            <label class="pv-row"><span>API キー</span><input class="text-in" type="password" data-pv="key" data-i="${i}" value="${esc(p.key)}" placeholder="（自前サーバーは空でも可）" autocomplete="off"></label>
            <label class="pv-row"><span>モデル</span><input class="text-in" data-pv="model" data-i="${i}" value="${esc(p.model)}" list="models-${i}" placeholder="例：google/gemini-2.5-flash-lite / gemma3:12b" autocapitalize="off" autocorrect="off" spellcheck="false"><datalist id="models-${i}"></datalist></label>
            <div class="pv-actions">
              <button class="mini-btn" data-action="pv-test" data-i="${i}">接続テスト</button>
              <button class="mini-btn" data-action="pv-models" data-i="${i}">モデル一覧</button>
              <label class="mini-check"><input type="checkbox" data-pv="mergeSystem" data-i="${i}" ${p.mergeSystem ? 'checked' : ''}> system を使わない</label>
              <span class="pv-out small" data-out="${i}"></span>
            </div>
          </div>`).join('')}
        </div>
        <div class="row-btns">${PRESETS.map((pr, i) => `<button class="mini-btn" data-action="preset" data-p="${i}">＋ ${esc(pr.label)}</button>`).join('')}</div>
        <div class="set-row"><span>回答を端末に保存して再利用<small>同じ質問ではAIを呼ばない（クレジット節約）</small></span><button type="button" class="toggle ${ai.cache ? 'on' : ''}" data-action="ai-cache" role="switch"><i></i></button></div>
        <p class="small">今月の利用：${usage.calls} 回・${usage.tokens.toLocaleString()} トークン${usage.cost ? `・約 $${usage.cost.toFixed(4)}` : ''} <button class="mini-btn" data-action="clear-cache">保存した回答を消す</button></p>
        <details class="help"><summary>自前サーバー（Oracle Cloud の Gemma など）をつなぐには</summary>
          <ul class="small">
            <li>このアプリを HTTPS で公開している場合、AI サーバーも <b>HTTPS</b> が必要です（Cloudflare Tunnel や Caddy などで HTTPS 化）。</li>
            <li>ブラウザから直接呼ぶので <b>CORS</b> の許可が必要です。Ollama なら環境変数 <code>OLLAMA_ORIGINS=*</code>（またはアプリのURL）を設定して再起動。</li>
            <li>URL は <code>https://サーバー/v1</code>（Ollama・llama.cpp・vLLM・LM Studio 共通の OpenAI 互換エンドポイント）。</li>
            <li>Gemma などで system メッセージがエラーになる場合は「system を使わない」にチェック。</li>
            <li>API キーはこの端末の中だけに保存され、バックアップファイルには含まれません。</li>
          </ul>
        </details>
      </div>

      <div class="card set-group">
        <h2>音と表示</h2>
        <div class="set-row"><span>効果音</span>${tog('sound')}</div>
        <label class="set-row"><span>音量</span><input type="range" min="0" max="1" step="0.05" value="${st.volume}" data-k="volume" class="range"></label>
        <div class="set-row"><span>テーマ</span>${seg('theme', [['auto', '自動'], ['light', 'ライト'], ['dark', 'ダーク']])}</div>
      </div>

      <div class="card set-group">
        <h2>データ</h2>
        <p class="small muted">学習記録はこの端末のブラウザ内に保存されています。Safari の「履歴とWebサイトデータを消去」で消えてしまうので、ときどきバックアップしましょう。</p>
        <div class="set-actions">
          <button class="btn ghost" data-action="export">バックアップを保存</button>
          <label class="btn ghost file-btn">バックアップから復元<input type="file" accept="application/json,.json" hidden></label>
          <button class="btn danger" data-action="reset">記録をすべて消す</button>
        </div>
      </div>

      <div class="card set-group about">
        <h2>このアプリについて</h2>
        <p class="small">英検3級の合格をめざす学習アプリです。問題・例文はすべて本番の出題形式にならったオリジナルです（過去問の転載ではありません）。公益財団法人 日本英語検定協会とは関係ありません。</p>
        <p class="small muted">英検の過去問（直近3回分）は日本英語検定協会の公式サイトで公開されています。取り込み機能（筆記 → 問題をふやす）で自分の学習用に追加できます。</p>
      </div>
    </section>`;

    // 手書きテスト
    testPad?.destroy();
    testPad = new Pad({
      w: 200, h: 300, guide: '4line', cls: 'pad-letter',
      onStrokeEnd: () => {
        clearTimeout(testPad._t);
        testPad._t = setTimeout(async () => {
          const [r] = await recognizeBoxes([{ strokes: testPad.getStrokes(), w: 200, h: 300 }]);
          root.querySelector('.hw-out').innerHTML = `<b>${esc(displayChar(r.cands) || '?')}</b><small>${r.src === 'google' ? 'Google' : r.src === 'offline' ? '端末内' : ''}：${esc(r.cands.slice(0, 5).join(' '))}</small>`;
        }, 400);
      },
    });
    root.querySelector('.hw-pad').appendChild(testPad.el);

    root.querySelectorAll('input[data-k], select[data-k]').forEach((inp) => {
      inp.addEventListener(inp.type === 'range' ? 'input' : 'change', () => {
        const k = inp.dataset.k;
        const v = inp.type === 'range' ? parseFloat(inp.value) : inp.value.trim();
        store.update((s) => { s.settings[k] = v; });
        if (k === 'rate') root.querySelector('.rate-v').textContent = v;
      });
    });
    root.querySelectorAll('[data-pv]').forEach((inp) => {
      inp.addEventListener('change', () => {
        const i = +inp.dataset.i, k = inp.dataset.pv;
        store.update((s) => { s.settings.ai.providers[i][k] = inp.type === 'checkbox' ? inp.checked : inp.value.trim(); });
      });
    });
    root.querySelector('.file-btn input').addEventListener('change', async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      try {
        store.importJSON(await f.text());
        toast('復元しました', { icon: '✅' });
        applyTheme();
        draw();
      } catch (err) { toast(esc(err.message), { icon: '⚠️' }); }
    });
    if (params.sec) setTimeout(() => root.querySelector(`#sec-${params.sec}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const pv = (i) => store.settings().ai.providers[i];
  actions(root, {
    back: () => go('home'),
    set: (el) => {
      const k = el.dataset.k;
      const cur = store.settings()[k];
      const v = typeof cur === 'number' ? parseFloat(el.dataset.v) : el.dataset.v;
      store.update((s) => { s.settings[k] = v; });
      sfx.select();
      if (k === 'theme') applyTheme();
      draw();
    },
    toggle: (el) => {
      const k = el.dataset.k;
      store.update((s) => { s.settings[k] = !s.settings[k]; });
      sfx.select();
      draw();
    },
    vtest: (el) => { const g = el.dataset.g; say(g === 'M' ? 'Hello. My name is Tom. Nice to meet you.' : 'Hi! I am Emma. How are you today?', { gender: g }); },
    'hw-clear': () => { testPad?.clear(); root.querySelector('.hw-out').textContent = '?'; },
    'pv-toggle': (el) => { const i = +el.dataset.i; store.update((s) => { s.settings.ai.providers[i].on = !s.settings.ai.providers[i].on; }); sfx.select(); draw(); },
    'pv-up': (el) => { const i = +el.dataset.i; store.update((s) => { const a = s.settings.ai.providers; [a[i - 1], a[i]] = [a[i], a[i - 1]]; }); draw(); },
    'pv-down': (el) => { const i = +el.dataset.i; store.update((s) => { const a = s.settings.ai.providers; [a[i + 1], a[i]] = [a[i], a[i + 1]]; }); draw(); },
    'pv-test': async (el) => {
      const i = +el.dataset.i;
      const out = root.querySelector(`[data-out="${i}"]`);
      el.classList.add('loading');
      out.textContent = '';
      try {
        const r = await testProvider(pv(i));
        out.innerHTML = `<span class="ok-text">✅ ${esc(r.text.slice(0, 30))}（${r.ms}ms）</span>`;
      } catch (e) { out.innerHTML = `<span class="err">${esc(e.message)}</span>`; }
      el.classList.remove('loading');
    },
    'pv-models': async (el) => {
      const i = +el.dataset.i;
      const out = root.querySelector(`[data-out="${i}"]`);
      el.classList.add('loading');
      try {
        const list = await listModels(pv(i));
        const dl = root.querySelector(`#models-${i}`);
        dl.innerHTML = list.slice(0, 400).map((m) => `<option value="${esc(m.id)}">${m.in != null ? `$${m.in.toFixed(2)} / $${(m.out ?? 0).toFixed(2)} (1M)` : ''}</option>`).join('');
        const free = list.filter((m) => m.in === 0 && m.out === 0).length;
        out.innerHTML = `${list.length} 件${free ? `（無料 ${free} 件）` : ''}。モデル欄をタップすると候補が出ます（安い順）`;
      } catch (e) { out.innerHTML = `<span class="err">${esc(e.message)}</span>`; }
      el.classList.remove('loading');
    },
    preset: (el) => {
      const pr = PRESETS[+el.dataset.p];
      store.update((s) => { s.settings.ai.providers.push({ id: `p${Date.now()}`, name: pr.label, baseUrl: pr.baseUrl, key: '', model: pr.model, on: false, mergeSystem: false }); });
      sfx.select();
      draw();
    },
    'ai-cache': () => { store.update((s) => { s.settings.ai.cache = !s.settings.ai.cache; }); draw(); },
    'clear-cache': async () => {
      const n = (await kvKeys('')).length;
      if (!(await confirmDialog(`保存したAIの回答 ${n} 件を消しますか？`, { ok: '消す', danger: true }))) return;
      await kvClear('');
      toast('消しました');
    },
    export: () => {
      const blob = new Blob([store.exportJSON()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `eiken3-backup-${store.dayKey()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    },
    reset: async () => {
      if (await confirmDialog('学習記録をすべて消しますか？<br>（設定は残ります）', { ok: 'すべて消す', danger: true })) {
        store.resetAll();
        toast('記録を消しました');
        draw();
      }
    },
  });
  draw();
  void speak;
  return () => testPad?.destroy();
}
