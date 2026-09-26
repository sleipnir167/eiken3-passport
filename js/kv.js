// IndexedDB の小さなキー・バリューストア（AIの回答キャッシュなど、localStorage に入りきらないもの）
const DB = 'eiken3-passport';
const STORE = 'kv';
let dbp = null;

function db() {
  if (dbp) return dbp;
  dbp = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbp;
}

async function tx(mode, fn) {
  const d = await db();
  return new Promise((resolve, reject) => {
    const t = d.transaction(STORE, mode);
    const s = t.objectStore(STORE);
    const r = fn(s);
    t.oncomplete = () => resolve(r?.result);
    t.onerror = () => reject(t.error);
  });
}

export const kvGet = (k) => tx('readonly', (s) => s.get(k)).catch(() => undefined);
export const kvSet = (k, v) => tx('readwrite', (s) => s.put(v, k)).catch((e) => console.warn('kv set', e));
export const kvDel = (k) => tx('readwrite', (s) => s.delete(k)).catch(() => {});
export async function kvKeys(prefix = '') {
  const keys = await tx('readonly', (s) => s.getAllKeys()).catch(() => []);
  return (keys || []).filter((k) => String(k).startsWith(prefix));
}
export async function kvClear(prefix = '') {
  const keys = await kvKeys(prefix);
  await tx('readwrite', (s) => { keys.forEach((k) => s.delete(k)); });
  return keys.length;
}
