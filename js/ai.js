// AI（OpenAI 互換の Chat Completions API）
//  - OpenRouter・自前サーバー（Ollama / llama.cpp / vLLM で動かす Gemma など）・その他の無料 LLM に対応
//  - 有効なプロバイダーを上から順に試す（無料・自前を上に置けば、失敗したときだけ有料に回る）
//  - 同じ入力への回答は端末（IndexedDB）に保存して再利用し、クレジットを節約する
import * as store from './store.js';
import { kvGet, kvSet } from './kv.js';
import { hash } from './ui.js';

export class AIError extends Error {
  constructor(msg, code) { super(msg); this.code = code; }
}

export const activeProviders = () => store.settings().ai.providers.filter((p) => p.on && p.baseUrl && p.model);
export const aiReady = () => activeProviders().length > 0;
const isOpenRouter = (p) => /openrouter\.ai/i.test(p.baseUrl);
const monthKey = () => new Date().toISOString().slice(0, 7);

/**
 * messages: [{ role, content }]
 * 返り値: { text, provider, model, cached }
 */
export async function chat(messages, { maxTokens = 1200, temperature = 0.3, cache = true, cacheKey, timeoutMs, onProvider, validate } = {}) {
  const st = store.settings().ai;
  const key = cacheKey || `ai:${hash(JSON.stringify(messages))}`;
  if (cache && st.cache) {
    const hit = await kvGet(key);
    if (hit?.text && (!validate || validate(hit.text))) return { ...hit, cached: true };
  }
  const list = activeProviders();
  if (!list.length) throw new AIError('AI が設定されていません。設定 →「AI」で接続先を登録してください。', 'noconfig');
  let lastErr = null;
  for (const p of list) {
    try {
      onProvider?.(p);
      const r = await callProvider(p, messages, { maxTokens, temperature, timeoutMs });
      recordUsage(r.usage);
      const out = { text: r.text, provider: p.name, model: p.model, t: Date.now() };
      if (cache && st.cache && (!validate || validate(r.text))) kvSet(key, out);
      return { ...out, cached: false };
    } catch (e) {
      lastErr = e;
      console.warn('AI provider failed:', p.name, e);
    }
  }
  throw lastErr;
}

async function callProvider(p, messages, { maxTokens, temperature, timeoutMs }) {
  let msgs = messages;
  if (p.mergeSystem) {
    // system ロールに対応していないモデル向け：最初の user にまとめる
    const sys = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n');
    msgs = messages.filter((m) => m.role !== 'system');
    if (sys && msgs[0]) msgs = [{ role: msgs[0].role, content: `${sys}\n\n---\n\n${msgs[0].content}` }, ...msgs.slice(1)];
  }
  const body = { model: p.model, messages: msgs, temperature, max_tokens: maxTokens };
  if (isOpenRouter(p)) body.usage = { include: true };
  const headers = { 'Content-Type': 'application/json' };
  if (p.key) headers.Authorization = `Bearer ${p.key}`;
  if (isOpenRouter(p)) { headers['HTTP-Referer'] = location.origin; headers['X-Title'] = 'Eiken3 Passport'; }
  const url = `${p.baseUrl.replace(/\/+$/, '')}/chat/completions`;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs || (p.builtin ? 90000 : isOpenRouter(p) ? 60000 : 120000));
  try {
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body), signal: ctl.signal });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new AIError(`${p.name}: ${data?.error?.message || `HTTP ${res.status}`}`, 'http');
    let text = data.choices?.[0]?.message?.content ?? '';
    if (Array.isArray(text)) text = text.map((x) => x.text || '').join('');
    text = String(text).replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    if (!text) throw new AIError(`${p.name}: 返答が空でした`, 'empty');
    return { text, usage: data.usage || {} };
  } catch (e) {
    if (e.name === 'AbortError') throw new AIError(`${p.name}: 返答がタイムアウトしました`, 'timeout');
    if (e instanceof TypeError) throw new AIError(`${p.name}: サーバーに接続できません（URL・HTTPS・CORS の設定を確認してください）`, 'network');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

function recordUsage(u = {}) {
  store.update((s) => {
    const m = monthKey();
    const cur = s.aiUsage[m] || (s.aiUsage[m] = { calls: 0, tokens: 0, cost: 0 });
    cur.calls++;
    cur.tokens += (u.total_tokens || (u.prompt_tokens || 0) + (u.completion_tokens || 0)) || 0;
    cur.cost += Number(u.cost) || 0;
  });
}
export const usageThisMonth = () => store.get().aiUsage[monthKey()] || { calls: 0, tokens: 0, cost: 0 };

/** 返答から JSON を取り出す（```json … ``` や前後の文章があっても OK） */
export function parseJSON(text) {
  if (!text) return null;
  let t = String(text).replace(/```(?:json)?/gi, '').trim();
  const s = Math.min(...['{', '['].map((c) => { const i = t.indexOf(c); return i < 0 ? Infinity : i; }));
  if (s === Infinity) return null;
  const close = t[s] === '{' ? '}' : ']';
  const e = t.lastIndexOf(close);
  if (e < s) return null;
  t = t.slice(s, e + 1);
  try { return JSON.parse(t); } catch { /* 修復を試す */ }
  try { return JSON.parse(t.replace(/,\s*([}\]])/g, '$1').replace(/[“”]/g, '"')); } catch { return null; }
}

/** 接続テスト */
export async function testProvider(p) {
  const t0 = performance.now();
  const r = await callProvider({ ...p }, [{ role: 'user', content: 'Reply with just: OK' }], { maxTokens: 20, temperature: 0 , timeoutMs: 45000 });
  return { text: r.text, ms: Math.round(performance.now() - t0) };
}

/** モデル一覧（OpenRouter なら料金つき） */
export async function listModels(p) {
  const headers = {};
  if (p.key) headers.Authorization = `Bearer ${p.key}`;
  const res = await fetch(`${p.baseUrl.replace(/\/+$/, '')}/models`, { headers });
  if (!res.ok) throw new AIError(`HTTP ${res.status}`, 'http');
  const data = await res.json();
  const list = (data.data || data.models || []).map((m) => {
    const pr = m.pricing || {};
    const inP = Number(pr.prompt) * 1e6, outP = Number(pr.completion) * 1e6;
    return { id: m.id || m.name, name: m.name || m.id, in: isFinite(inP) ? inP : null, out: isFinite(outP) ? outP : null, ctx: m.context_length || null };
  });
  return list.sort((a, b) => ((a.in ?? 0) + (a.out ?? 0)) - ((b.in ?? 0) + (b.out ?? 0)) || a.id.localeCompare(b.id));
}

/** JSON で答えてもらう（パースできなければ text をそのまま返す） */
export async function chatJSON(messages, opts = {}) {
  const r = await chat(messages, { ...opts, validate: (t) => parseJSON(t) !== null });
  return { ...r, data: parseJSON(r.text) };
}
