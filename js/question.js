// 問題の表示・音声・解説（練習と模試で共通）
import { esc, blankify, wordSpans, richText, toast } from './ui.js';
import { speakLines, speak, stop as stopSpeech } from './speech.js';
import { passageById } from './bank.js';
import * as store from './store.js';
import { chat, aiReady } from './ai.js';
import { explainPrompt, followupPrompt } from './prompts.js';
import { award } from './game.js';

export const PART_LABEL = {
  r1: '大問1 語句の空所補充', r2: '大問2 会話文の空所補充', r3: '大問3 長文の内容一致',
  l1: 'リスニング第1部 会話の応答', l2: 'リスニング第2部 会話の内容', l3: 'リスニング第3部 文の内容',
};
export const partOf = (item) => item.id.split(':')[0];

const SPEAKER_JA = { Girl: '女の子', Boy: '男の子', Man: '男性', Woman: '女性', Mother: '母', Father: '父', Son: '息子', Daughter: '娘', Teacher: '先生', Student: '生徒', Waiter: 'ウェイター', Clerk: '店員' };

/** 大問1の問題文（A: / B: の会話は改行） */
function r1Stem(q, fill = '') {
  const parts = q.split(/\s(?=[AB]:\s)/);
  return parts.map((p) => `<p class="stem-line">${blankify(p, fill).replace(/^([AB]):/, '<b class="spk">$1:</b>')}</p>`).join('');
}

/** 問題文の HTML */
export function stemHTML(item, { fill = '' } = {}) {
  const p = partOf(item);
  if (p === 'r1' || item.custom) return `<div class="stem r1">${r1Stem(item.q, fill)}</div>`;
  if (p === 'r2') {
    return `<div class="stem r2">${item.lines.map(([who, t]) => `<p class="dlg"><b class="spk">${esc(who)}${SPEAKER_JA[who] ? `<small>${SPEAKER_JA[who]}</small>` : ''}</b><span>${blankify(t, fill)}</span></p>`).join('')}</div>`;
  }
  if (p === 'r3') return `<div class="stem r3"><p>${esc(item.q)}</p></div>`;
  return '';
}

/** 長文の本文 */
export function passageHTML(pid) {
  const p = passageById.get(pid);
  if (!p) return '';
  const paras = p.body.split(/\n\s*\n/).map((para) => `<p>${wordSpans(para).replace(/\n/g, '<br>')}</p>`).join('');
  return `<article class="passage type-${p.type}"><div class="passage-body">${paras}</div></article>`;
}

/** リスニングのスクリプト（答え合わせ用） */
export function scriptHTML(item, shuffled) {
  const who = (g) => (g === 'M' ? '<b class="spk m">♂</b>' : '<b class="spk w">♀</b>');
  let html = item.lines.map(([g, t], i) => `<p class="script-line" data-i="${i}">${who(g)}<span>${esc(t)}</span><button class="icon-btn speak small" data-line="${i}" aria-label="この文を聞く">🔊</button></p>`).join('');
  if (partOf(item) === 'l1' && shuffled) html += `<ol class="script-choices">${shuffled.c.map((c, i) => `<li class="${i === shuffled.a ? 'ans' : ''}">${esc(c)}</li>`).join('')}</ol>`;
  if (item.q) html += `<p class="script-q"><b>Question:</b> ${esc(item.q)}</p>`;
  return `<div class="script">${html}</div>`;
}

/** リスニング音声を流す（本番どおり、第1部は選択肢も読み上げる） */
export async function playListening(item, shuffled, { times = 1, onLine, onDone } = {}) {
  const p = partOf(item);
  for (let t = 0; t < times; t++) {
    const lines = [...item.lines];
    if (p === 'l1') {
      const responder = item.lines[item.lines.length - 1][0] === 'M' ? 'W' : 'M';
      shuffled.c.forEach((c, i) => lines.push([responder, `${['One', 'Two', 'Three'][i]}. ${c}`]));
    } else if (item.q) {
      lines.push(['N', `Question. ${item.q}`]);
    }
    const ok = await speakLines(lines.map(([g, x]) => [g === 'N' ? 'W' : g, x]), { gap: 450, onLine });
    if (!ok) return false;
    if (t < times - 1) await new Promise((r) => setTimeout(r, 1200));
  }
  onDone?.();
  return true;
}
export const stopAudio = () => stopSpeech();

/** 解説ブロック（AI つき） */
export function feedbackHTML(item, shuffled, chosen, { showScript = true } = {}) {
  const p = partOf(item);
  const ok = chosen === shuffled.a;
  const listening = p[0] === 'l';
  const starKey = `q:${item.id}`;
  const starred = !!store.get().stars[starKey];
  return `
    <div class="feedback ${ok ? 'ok' : 'ng'}">
      <div class="fb-head">
        <span class="fb-mark">${ok ? '○ 正解！' : chosen == null ? '⏱ 時間切れ' : '× 不正解'}</span>
        <span class="fb-ans">正解：<b>${shuffled.a + 1}</b> ${esc(shuffled.c[shuffled.a])}</span>
        <button class="mini-btn star-btn ${starred ? 'on' : ''}" data-action="star" data-key="${esc(starKey)}">${starred ? '★ 苦手ノート' : '☆ 苦手ノート'}</button>
      </div>
      ${item.x ? `<p class="fb-x">${esc(item.x)}</p>` : ''}
      ${item.j ? `<details class="fb-j" ${listening ? '' : 'open'}><summary>日本語訳</summary><p>${esc(item.j).replace(/\n/g, '<br>')}</p></details>` : ''}
      ${listening && showScript ? `<details class="fb-script" open><summary>スクリプト（英文）</summary>${scriptHTML(item, shuffled)}</details>` : ''}
      <div class="ai-box">
        <button class="btn ai-btn" data-action="ai">🤖 AIにくわしく聞く</button>
        <div class="ai-out" hidden></div>
        <form class="ai-ask" hidden><input class="text-in" placeholder="AI先生に質問（例：なぜ ${esc(shuffled.c[(shuffled.a + 1) % shuffled.c.length])} はだめ？）" maxlength="200"><button class="btn small primary">質問</button></form>
      </div>
    </div>`;
}

/** 解説ブロックの動作（AI・スクリプトの読み上げ・☆） */
export function bindFeedback(root, item, shuffled, chosen) {
  const box = root.querySelector('.feedback');
  if (!box) return;
  box.querySelectorAll('[data-line]').forEach((b) => b.addEventListener('click', () => {
    const [g, t] = item.lines[+b.dataset.line];
    stopSpeech();
    speak(t, { gender: g });
  }));
  box.querySelector('[data-action="star"]')?.addEventListener('click', (e) => {
    const k = e.currentTarget.dataset.key;
    store.update((s) => { if (s.stars[k]) delete s.stars[k]; else s.stars[k] = Date.now(); });
    const on = !!store.get().stars[k];
    e.currentTarget.classList.toggle('on', on);
    e.currentTarget.textContent = on ? '★ 苦手ノート' : '☆ 苦手ノート';
  });
  const out = box.querySelector('.ai-out');
  const ask = box.querySelector('.ai-ask');
  const passage = item.pid ? passageById.get(item.pid)?.body : '';
  const question = item.lines
    ? `${partOf(item)[0] === 'l' ? '（リスニング）' : ''}${item.lines.map(([w, t]) => `${w === 'M' ? 'Man' : w === 'W' ? 'Woman' : w}: ${t}`).join('\n')}${item.q ? `\nQuestion: ${item.q}` : ''}`
    : item.q;
  const context = () => `${question}\n選択肢: ${shuffled.c.map((c, i) => `${i + 1}. ${c}`).join(' / ')}\n正解: ${shuffled.c[shuffled.a]}\n解説: ${item.x || ''}\n${out.textContent || ''}`;
  box.querySelector('[data-action="ai"]').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    if (!aiReady()) {
      toast('AI を使うには 設定 → AI で接続先を登録してください', { icon: '🤖', ms: 4000 });
      return;
    }
    btn.classList.add('loading');
    out.hidden = false;
    out.innerHTML = '<p class="ai-thinking">🦉 フート先生が考えています…（10〜20秒ほど）</p>';
    try {
      // 正解の文とまちがえた選択肢で、同じ解説は端末に保存して使い回す（2回目からは無料）
      const r = await chat(explainPrompt({ question, choices: shuffled.c, answer: shuffled.a, chosen: chosen === shuffled.a ? null : chosen, passage }), {
        cacheKey: `ex:${item.id}:${chosen == null || chosen === shuffled.a ? '' : shuffled.c[chosen]}`, maxTokens: 700,
      });
      out.innerHTML = `${richText(r.text)}<p class="ai-meta">${r.cached ? '💾 保存済みの解説（クレジット消費なし）' : `🤖 ${esc(r.model)}`}</p>`;
      btn.hidden = true;
      ask.hidden = false;
      award('ai');
    } catch (err) {
      out.innerHTML = `<p class="err">${esc(err.message)}</p>`;
    } finally {
      btn.classList.remove('loading');
    }
  });
  ask.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = ask.querySelector('input');
    const qtext = input.value.trim();
    if (!qtext) return;
    const b = ask.querySelector('button');
    b.classList.add('loading');
    try {
      const r = await chat(followupPrompt({ context: context(), question: qtext }), { cacheKey: `fu:${item.id}:${qtext}`, maxTokens: 400 });
      out.insertAdjacentHTML('beforeend', `<div class="ai-qa"><p class="ai-q">🙋 ${esc(qtext)}</p>${richText(r.text)}</div>`);
      input.value = '';
    } catch (err) {
      out.insertAdjacentHTML('beforeend', `<p class="err">${esc(err.message)}</p>`);
    } finally {
      b.classList.remove('loading');
    }
  });
}
