// 音声の入出力（ブラウザの無料機能：Web Speech API）
//  - 読み上げ：speechSynthesis（iPad は Siri の声、Pixel / Chrome は Google の声）
//  - 音声認識：SpeechRecognition（iPad Safari・Android Chrome で利用可）
import { settings } from './store.js';

const synth = window.speechSynthesis;
let voices = [];
function loadVoices() {
  if (!synth) return;
  voices = synth.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
}
loadVoices();
synth?.addEventListener?.('voiceschanged', loadVoices);

const MALE = /aaron|alex\b|arthur|daniel|fred|gordon|oliver|ralph|rishi|reed|rocko|eddy|grandpa|\bmale|guy|david|mark|james|george|tom\b|evan|nathan|junior|thomas|lee|christopher|eric|roger|brian|andrew|ryan/i;
const FEMALE = /samantha|karen|moira|tessa|victoria|nicky|allison|ava|susan|zoe|female|zira|aria|jenny|serena|kate|fiona|martha|catherine|sandy|shelley|flo\b|grandma|joanna|salli|kendra|emma|libby|sonia|natasha|michelle|ana\b|clara|olivia|google us english/i;

const quality = (v) => (/enhanced|premium|neural|natural|siri/i.test(v.name) ? 3 : 0) + (/^en[-_]us/i.test(v.lang) ? 2 : /^en[-_]gb/i.test(v.lang) ? 1 : 0) + (v.localService ? 0.5 : 0);

export function englishVoices() { if (!voices.length) loadVoices(); return voices; }

/** 性別に合う声を選ぶ（見つからなければ同じ声で高さを変える） */
export function voiceFor(gender = 'F') {
  if (!voices.length) loadVoices();
  const st = settings();
  const want = gender === 'M' ? st.voiceM : st.voiceF;
  if (want) { const v = voices.find((x) => x.name === want); if (v) return { voice: v, pitch: 1 }; }
  const re = gender === 'M' ? MALE : FEMALE;
  const cand = voices.filter((v) => re.test(v.name)).sort((a, b) => quality(b) - quality(a));
  if (cand.length) return { voice: cand[0], pitch: 1 };
  const any = [...voices].sort((a, b) => quality(b) - quality(a))[0] || null;
  return { voice: any, pitch: gender === 'M' ? 0.78 : 1.12 };
}

export const ttsSupported = () => !!synth && 'SpeechSynthesisUtterance' in window;

let seq = 0; // 再生の世代（stop で古い再生を打ち切る）

/** 1文を読み上げる。終わったら resolve */
export function speak(text, { gender = 'F', rate, lang } = {}) {
  if (!ttsSupported() || !text) return Promise.resolve();
  const my = seq;
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    const { voice, pitch } = voiceFor(gender === 'N' ? 'F' : gender);
    if (voice) u.voice = voice;
    u.lang = lang || voice?.lang || 'en-US';
    u.pitch = pitch;
    u.rate = rate ?? settings().rate ?? 0.9;
    let done = false;
    const fin = () => { if (!done) { done = true; clearTimeout(guard); resolve(my === seq); } };
    u.onend = fin;
    u.onerror = fin;
    // Safari は onend が来ないことがあるので、長さから見積もった時間で打ち切る
    const guard = setTimeout(fin, 1500 + text.length * 110 / (u.rate || 1));
    synth.speak(u);
  });
}

/** すぐに話す（前の読み上げは止める） */
export function say(text, opts) { stop(); return speak(text, opts); }

/** 会話を順番に読み上げる。lines: [[話者('M'|'W'|'N'), 文], ...] */
export async function speakLines(lines, { gap = 350, onLine } = {}) {
  const my = ++seq;
  synth?.cancel();
  for (let i = 0; i < lines.length; i++) {
    if (my !== seq) return false;
    const [who, text] = lines[i];
    onLine?.(i);
    await speak(text, { gender: who === 'M' ? 'M' : 'F' });
    if (my !== seq) return false;
    await new Promise((r) => setTimeout(r, gap));
  }
  onLine?.(-1);
  return my === seq;
}

export function stop() {
  seq++;
  try { synth?.cancel(); } catch { /* */ }
}
export const isSpeaking = () => !!synth?.speaking;

// ---------------- 音声認識 ----------------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export const sttSupported = () => !!SR;

// Safari の continuous モードは結果が累積で返ることがあるのでつなぎ方を工夫する
function joinResults(list) {
  let acc = '';
  for (const t of list) {
    const s = t.trim();
    if (!s) continue;
    if (!acc) acc = s;
    else if (s.toLowerCase().startsWith(acc.toLowerCase())) acc = s;
    else if (!acc.toLowerCase().endsWith(s.toLowerCase())) acc += ` ${s}`;
  }
  return acc;
}

let current = null;

/**
 * 英語を聞き取る。{ text, alts } を返す
 * - onInterim(text)：途中経過
 * - silenceMs：話し終わってからこの時間だまっていたら終了
 */
export function listen({ lang = 'en-US', onInterim, maxMs = 30000, silenceMs = 2200 } = {}) {
  if (!SR) return Promise.reject(new Error('このブラウザは音声認識に対応していません'));
  stopListening();
  return new Promise((resolve, reject) => {
    const r = new SR();
    current = r;
    r.lang = lang;
    r.interimResults = true;
    r.continuous = true;
    r.maxAlternatives = 3;
    let finals = [], interim = '', alts = [], heard = false, settled = false;
    let silenceTimer = null;
    const maxTimer = setTimeout(() => r.stop(), maxMs);
    const text = () => joinResults([...finals, interim]);
    const finish = (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(maxTimer); clearTimeout(silenceTimer);
      if (current === r) current = null;
      if (err) reject(err); else resolve({ text: text(), alts });
    };
    r.onresult = (e) => {
      heard = true;
      finals = []; interim = '';
      for (let i = 0; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) {
          finals.push(res[0].transcript);
          alts = [...res].map((a) => a.transcript);
        } else interim += res[0].transcript;
      }
      onInterim?.(text());
      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => { try { r.stop(); } catch { /* */ } }, silenceMs);
    };
    r.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return finish();
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') return finish(new Error('マイクまたは音声認識が許可されていません（設定 → Safari → マイク、または「音声入力」をオンに）'));
      finish(new Error(`音声認識のエラー：${e.error}`));
    };
    r.onend = () => finish();
    r.onspeechend = () => { if (heard) { clearTimeout(silenceTimer); silenceTimer = setTimeout(() => { try { r.stop(); } catch { /* */ } }, 600); } };
    try { r.start(); } catch (e) { finish(e); }
  });
}
export function stopListening() {
  if (current) { try { current.stop(); } catch { /* */ } }
}
export function abortListening() {
  if (current) { try { current.abort(); } catch { /* */ } current = null; }
}

// ---------------- 音読の採点（音声認識の結果と原文を照合） ----------------
export const normWords = (s) => String(s || '').toLowerCase()
  .replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]+/g, ' ')
  .split(/\s+/).filter(Boolean)
  .map((w) => w.replace(/^'+|'+$/g, ''));

const NUM = { one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12', twenty: '20', thirty: '30', hundred: '100' };
const canon = (w) => NUM[w] || w.replace(/'s$/, 's');

/**
 * 原文 ref と読み上げ hyp を単語単位で対応づける（最長共通部分列）
 * 返り値：{ words: [{ w, ok }], ratio }
 */
export function alignReading(ref, hyp) {
  const raw = String(ref).split(/\s+/).filter(Boolean);
  const a = raw.map((w) => canon(normWords(w)[0] || ''));
  const b = normWords(hyp).map(canon);
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) {
    dp[i][j] = a[i] && a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  }
  const ok = new Array(n).fill(false);
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] && a[i] === b[j]) { ok[i] = true; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  const counted = a.filter(Boolean).length || 1;
  return { words: raw.map((w, k) => ({ w, ok: ok[k] || !a[k] })), ratio: ok.filter(Boolean).length / counted };
}
