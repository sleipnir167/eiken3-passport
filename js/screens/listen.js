// リスニング メニュー
import * as store from '../store.js';
import { L1, L2, L3 } from '../bank.js';
import { actions, esc } from '../ui.js';
import { go } from '../app.js';
import { sfx } from '../sound.js';
import { say, ttsSupported, englishVoices, voiceFor } from '../speech.js';
import { statsOf } from './drill.js';

export function renderListen(root) {
  const st = store.settings();
  const parts = [
    ['l1', '第1部', '会話の応答文選択', 'イラストを見ながら会話を聞き、最後の発言に対する応答を3つから選ぶ。選択肢は問題用紙に印刷されていない（音声だけ）', L1],
    ['l2', '第2部', '会話の内容一致選択', '会話と質問を聞いて、答えを4つの選択肢から選ぶ', L2],
    ['l3', '第3部', '文の内容一致選択', '英文（アナウンス・スピーチなど）と質問を聞いて、答えを4つから選ぶ', L3],
  ];
  const voices = englishVoices();
  const vf = voiceFor('F'), vm = voiceFor('M');
  root.innerHTML = `
    <header class="page-head"><h1>リスニング <small>本番 30問・約25分（各部10問・2回ずつ放送）</small></h1></header>
    ${ttsSupported() ? '' : '<section class="card warn-card"><p>⚠️ このブラウザは読み上げに対応していないため、音声が流れません。Safari・Chrome の最新版で使ってください。</p></section>'}
    <section class="listen-grid">
      ${parts.map(([id, n, name, desc, list]) => {
        const s = statsOf(list);
        return `
        <article class="card listen-part">
          <div class="lp-head"><span class="lp-num">${n}</span><h2>${name}</h2></div>
          <p class="small">${desc}</p>
          <p class="small muted">${list.length}問・解いた ${s.seen}問${s.acc != null ? `・正答率 ${Math.round(s.acc * 100)}%` : ''}</p>
          <button class="btn primary" data-go="${id}">練習する ▶</button>
        </article>`;
      }).join('')}
    </section>
    <section class="card">
      <h2>🎧 聞きとりのコツ</h2>
      <ul class="tips">
        <li><b>第1部</b>：最後の発言が「疑問文」か「お願い」か「報告」かを聞きとる。疑問詞（Where / When / How…）が最大のヒント。</li>
        <li><b>第2部・第3部</b>：放送の前に選択肢に目を通し、「人・場所・時・理由」のどれが問われそうか予想する。</li>
        <li>1回目で大意、2回目で答えの部分を確認。わからなくても次の問題に気持ちを切りかえよう。</li>
      </ul>
      <button class="btn ghost" data-go="lmix">🎲 第1〜3部ミックスで練習</button>
    </section>
    <section class="card">
      <h2>🔈 音声の設定</h2>
      <p class="small muted">男性の声：<b>${esc(vm.voice?.name || '標準')}</b>／女性の声：<b>${esc(vf.voice?.name || '標準')}</b>（英語の声 ${voices.length} 種類）</p>
      <p class="small muted">iPad では「設定 → アクセシビリティ → 読み上げコンテンツ → 声 → 英語」で高音質の声（拡張・プレミアム）をダウンロードすると、より自然になります。</p>
      <div class="row-btns"><button class="btn ghost small" data-action="test-m">男性の声を試す</button><button class="btn ghost small" data-action="test-f">女性の声を試す</button><button class="btn ghost small" data-action="settings">声・速さを変える</button></div>
      <p class="small">本番どおり2回放送：<b>${st.playTwice ? 'オン' : 'オフ'}</b>・速さ：<b>${st.rate}</b></p>
    </section>`;
  root.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => { sfx.takeoff(); go('quiz', { part: b.dataset.go }); }));
  actions(root, {
    'test-m': () => say('Hello. How was your weekend? I went fishing with my father.', { gender: 'M' }),
    'test-f': () => say('Hi. I went to a concert with my friends. It was great!', { gender: 'W' }),
    settings: () => go('settings', { sec: 'voice' }),
  });
}
