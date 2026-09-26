// 演出：紙吹雪・星・紙飛行機・ポップアップ
const canvas = () => document.getElementById('fx-canvas');
let particles = [];
let raf = 0;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize() {
  const c = canvas();
  const dpr = Math.min(devicePixelRatio || 1, 2);
  c.width = innerWidth * dpr; c.height = innerHeight * dpr;
  c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', () => canvas() && resize());

const CONFETTI = ['#ff6f59', '#ffc53d', '#2ec4a6', '#4fa3e3', '#8a6cf0', '#ff9ec4', '#1d3461'];
const STARS = ['#ffd84d', '#ffc53d', '#fff3b0', '#ffe27a'];

/** 紙吹雪（kind='confetti'）または星（kind='star'） */
export function burst({ count = 80, kind = 'confetti', x = innerWidth / 2, y = innerHeight * 0.35, spread = 1 } = {}) {
  if (reduced()) return;
  const c = canvas();
  if (!c.width) resize();
  const colors = kind === 'star' ? STARS : CONFETTI;
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = (4 + Math.random() * 9) * spread;
    particles.push({
      kind, x, y,
      vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6,
      r: kind === 'star' ? 6 + Math.random() * 7 : 5 + Math.random() * 5,
      rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3,
      sway: Math.random() * 6.28,
      color: colors[i % colors.length],
      life: 0, max: 130 + Math.random() * 90,
    });
  }
  if (!raf) raf = requestAnimationFrame(loop);
}

/** 画面上から紙吹雪が降る */
export function rain(count = 90) {
  if (reduced()) return;
  if (!canvas().width) resize();
  for (let i = 0; i < count; i++) {
    particles.push({
      kind: i % 5 === 0 ? 'star' : 'confetti', x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.8,
      vx: (Math.random() - 0.3) * 1.5, vy: 1.5 + Math.random() * 2.5,
      r: 5 + Math.random() * 6, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.12,
      sway: Math.random() * 6.28, color: i % 5 === 0 ? STARS[i % 4] : CONFETTI[i % 7], life: 0, max: 420, rain: true,
    });
  }
  if (!raf) raf = requestAnimationFrame(loop);
}

/** 紙飛行機が画面を横切る */
export function paperPlane() {
  if (reduced()) return;
  if (!canvas().width) resize();
  particles.push({ kind: 'plane', x: -60, y: innerHeight * (0.25 + Math.random() * 0.3), vx: 9, vy: -1.2, r: 26, rot: 0, vr: 0, sway: 0, color: '#fff', life: 0, max: 400, rain: true });
  if (!raf) raf = requestAnimationFrame(loop);
}

function star(ctx, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}
function plane(ctx, r) {
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#1d3461';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(r, 0); ctx.lineTo(-r, -r * 0.55); ctx.lineTo(-r * 0.45, 0); ctx.lineTo(-r, r * 0.55); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(r, 0); ctx.lineTo(-r * 0.45, 0); ctx.stroke();
}

function loop() {
  const c = canvas();
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  particles = particles.filter((p) => p.life < p.max && p.y < innerHeight + 40 && p.x < innerWidth + 80);
  for (const p of particles) {
    p.life++;
    p.sway += 0.05;
    if (p.kind === 'plane') { p.x += p.vx; p.y += p.vy + Math.sin(p.life / 12) * 1.4; p.rot = Math.sin(p.life / 12) * 0.12 - 0.1; }
    else if (p.rain) { p.x += p.vx + Math.sin(p.sway) * 0.8; p.y += p.vy; }
    else {
      p.vx *= 0.96; p.vy = p.vy * 0.96 + 0.32;
      p.x += p.vx + Math.sin(p.sway) * 0.5; p.y += p.vy;
    }
    p.rot += p.vr;
    const alpha = p.kind === 'plane' ? 1 : Math.min(1, (p.max - p.life) / 40);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.kind === 'star') star(ctx, p.r);
    else if (p.kind === 'plane') plane(ctx, p.r);
    else {
      ctx.scale(1, Math.abs(Math.sin(p.sway * 2)) + 0.1);
      ctx.fillRect(-p.r / 2, -p.r / 3, p.r, p.r * 0.66);
    }
    ctx.restore();
  }
  raf = particles.length ? requestAnimationFrame(loop) : 0;
  if (!raf) ctx.clearRect(0, 0, c.width, c.height);
}

/** 要素の上に「+10」などを浮かび上がらせる */
export function floatText(text, el, cls = '') {
  const r = el?.getBoundingClientRect?.() || { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  const d = document.createElement('div');
  d.className = `float-text ${cls}`;
  d.textContent = text;
  d.style.left = `${r.left + r.width / 2}px`;
  d.style.top = `${r.top + r.height / 2}px`;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 1400);
}

export function shake(el) {
  if (!el || reduced()) return;
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
}

/** 正解の大きな○・不正解の×を画面中央に出す */
export function judgeMark(ok) {
  const d = document.createElement('div');
  d.className = `judge-mark ${ok ? 'ok' : 'ng'}`;
  d.innerHTML = ok
    ? '<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="70"/></svg>'
    : '<svg viewBox="0 0 200 200"><path d="M50 50L150 150M150 50L50 150"/></svg>';
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 900);
}
