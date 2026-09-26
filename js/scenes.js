// 面接カード・リスニング用のイラストを SVG で組み立てる（画像ファイル不要）
//  person() で人物（ポーズ・持ち物つき）、各種の物・背景を組み合わせて1枚の絵にする

const W = 480, H = 300;
const rad = (d) => (d * Math.PI) / 180;
const f1 = (n) => Math.round(n * 10) / 10;

export const SKIN = ['#f9d7b9', '#f1c29d', '#e3a97f', '#c98c5f'];
export const HAIR = { black: '#2a1f1b', brown: '#6b4428', light: '#a0692f', blond: '#d9ad5b', gray: '#9b9b9b' };

// ---------------- 背景 ----------------
const sky = (id, a = '#a9dcff', b = '#e6f5ff') => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
export const cloud = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".95"><ellipse cx="0" cy="0" rx="26" ry="12"/><ellipse cx="-16" cy="4" rx="16" ry="10"/><ellipse cx="18" cy="4" rx="18" ry="10"/><ellipse cx="4" cy="-8" rx="15" ry="11"/></g>`;
export const sun = (x, y, r = 22) => `<g><circle cx="${x}" cy="${y}" r="${r + 8}" fill="#ffe27a" opacity=".45"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffc53d"/></g>`;

const BG = {
  park: (u) => `${sky(`sk${u}`)}${sun(420, 44)}${cloud(90, 50)}${cloud(260, 34, 0.8)}
    <path d="M0 168 Q80 130 170 160 T340 150 T480 158 V${H} H0Z" fill="#b9e29a"/>
    <rect y="186" width="${W}" height="${H - 186}" fill="#92cf6d"/>
    <path d="M150 ${H} Q230 230 300 200 T480 196 V214 Q360 214 300 234 T200 ${H}Z" fill="#e9d9b0"/>`,
  garden: (u) => `${sky(`sk${u}`)}${sun(60, 44)}${cloud(300, 40)}
    <rect y="170" width="${W}" height="${H - 170}" fill="#92cf6d"/>
    ${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 31 + 2}" y="128" width="24" height="62" rx="3" fill="#fff4e0" stroke="#e2cfae"/>`).join('')}
    <rect y="146" width="${W}" height="7" fill="#f3e3c4"/>`,
  room: () => `<rect width="${W}" height="${H}" fill="#fcecd6"/>
    <rect y="0" width="${W}" height="8" fill="#f3dcbc"/>
    <rect y="224" width="${W}" height="${H - 224}" fill="#d8b187"/>
    ${Array.from({ length: 8 }, (_, i) => `<line x1="${i * 64}" y1="224" x2="${i * 64 - 30}" y2="${H}" stroke="#c99f73" stroke-width="2"/>`).join('')}
    <rect y="218" width="${W}" height="8" fill="#b88a5c"/>`,
  kitchen: () => `<rect width="${W}" height="${H}" fill="#eef7f6"/>
    <g stroke="#d6e8e6" stroke-width="2">${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="150"/>`).join('')}${Array.from({ length: 4 }, (_, i) => `<line x1="0" y1="${i * 40}" x2="${W}" y2="${i * 40}"/>`).join('')}</g>
    <rect y="150" width="${W}" height="80" fill="#f7efe3"/>
    <rect y="226" width="${W}" height="${H - 226}" fill="#cfd8dc"/>
    ${Array.from({ length: 10 }, (_, i) => `<rect x="${i * 50}" y="226" width="25" height="${H - 226}" fill="#c3ced3"/>`).join('')}`,
  classroom: () => `<rect width="${W}" height="${H}" fill="#f5f0e2"/>
    <rect x="50" y="26" width="250" height="100" rx="6" fill="#2f5d4a" stroke="#8a6a44" stroke-width="7"/>
    <rect x="60" y="128" width="230" height="5" fill="#8a6a44"/>
    <rect y="226" width="${W}" height="${H - 226}" fill="#caa57a"/>
    <rect y="220" width="${W}" height="7" fill="#a88157"/>`,
  library: () => `<rect width="${W}" height="${H}" fill="#f1e5d1"/>
    ${[0, 1, 2].map((k) => `<g transform="translate(${20 + k * 150} 18)"><rect width="130" height="190" fill="#9a6b43"/>${[0, 1, 2, 3].map((r) => `<rect x="6" y="${8 + r * 46}" width="118" height="40" fill="#7a5233"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${9 + i * 13}" y="${12 + r * 46 + (i % 3) * 3}" width="11" height="${36 - (i % 3) * 3}" fill="${['#e76f51', '#2a9d8f', '#e9c46a', '#457b9d', '#f4a261', '#8a6cf0'][(i + r + k) % 6]}"/>`).join('')}`).join('')}</g>`).join('')}
    <rect y="226" width="${W}" height="${H - 226}" fill="#b98f65"/>`,
  street: (u) => `${sky(`sk${u}`, '#9fb5c9', '#dfe7ee')}
    ${[[0, 70, 90], [95, 40, 70], [170, 90, 100], [275, 55, 80], [360, 30, 120]].map(([x, y, w], i) => `<rect x="${x}" y="${y}" width="${w}" height="${190 - y}" fill="${['#c8cfd8', '#b5bfcb', '#d3d8de', '#aeb8c4', '#c1c9d3'][i]}"/>${Array.from({ length: Math.floor((190 - y - 20) / 26) }, (_, r) => Array.from({ length: Math.floor(w / 26) }, (_, c) => `<rect x="${x + 8 + c * 26}" y="${y + 12 + r * 26}" width="14" height="14" fill="#eef3f8" opacity=".8"/>`).join('')).join('')}`).join('')}
    <rect y="190" width="${W}" height="36" fill="#d9d3c7"/>
    <rect y="226" width="${W}" height="${H - 226}" fill="#8b9097"/>
    ${Array.from({ length: 6 }, (_, i) => `<rect x="${i * 90 + 20}" y="262" width="50" height="6" fill="#f1f1f1"/>`).join('')}`,
  beach: (u) => `${sky(`sk${u}`, '#86d0ff', '#dff4ff')}${sun(410, 46)}${cloud(120, 44)}
    <rect y="128" width="${W}" height="60" fill="#46b6e4"/>
    <path d="M0 150 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#bfe9fb" stroke-width="3" fill="none"/>
    <path d="M0 184 Q120 172 240 182 T480 178 V${H} H0Z" fill="#f3dca2"/>`,
  station: (u) => `${sky(`sk${u}`)}${cloud(380, 40)}
    <rect y="120" width="${W}" height="70" fill="#c9d3dd"/>
    <rect y="186" width="${W}" height="${H - 186}" fill="#d8d1c3"/>
    <rect y="186" width="${W}" height="8" fill="#f2c94c"/>`,
};

// ---------------- 物 ----------------
export const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-8" y="-70" width="16" height="70" rx="4" fill="#8a5a33"/><circle cx="0" cy="-92" r="38" fill="#5cb85c"/><circle cx="-26" cy="-72" r="24" fill="#4ea94e"/><circle cx="26" cy="-74" r="26" fill="#63c063"/><circle cx="-8" cy="-112" r="22" fill="#6dc86d"/></g>`;
export const bench = (x, y, w = 120) => `<g transform="translate(${x} ${y})"><rect x="0" y="-44" width="${w}" height="8" rx="3" fill="#b07a45"/><rect x="0" y="-30" width="${w}" height="9" rx="3" fill="#c48a52"/><rect x="8" y="-22" width="6" height="22" fill="#555"/><rect x="${w - 14}" y="-22" width="6" height="22" fill="#555"/><rect x="8" y="-44" width="5" height="16" fill="#555"/><rect x="${w - 13}" y="-44" width="5" height="16" fill="#555"/></g>`;
export const table = (x, y, w = 150, h = 58, color = '#c48a52') => `<g transform="translate(${x} ${y})"><rect x="0" y="-${h}" width="${w}" height="10" rx="3" fill="${color}"/><rect x="10" y="-${h - 10}" width="8" height="${h - 10}" fill="#9b6a3d"/><rect x="${w - 18}" y="-${h - 10}" width="8" height="${h - 10}" fill="#9b6a3d"/></g>`;
export const desk = (x, y, w = 130) => table(x, y, w, 54, '#d6a86f');
export const chair = (x, y, face = 1) => `<g transform="translate(${x} ${y}) scale(${face} 1)"><rect x="-16" y="-34" width="34" height="7" rx="2" fill="#a36f3f"/><rect x="-16" y="-80" width="7" height="53" rx="2" fill="#a36f3f"/><rect x="-14" y="-27" width="5" height="27" fill="#7a5230"/><rect x="11" y="-27" width="5" height="27" fill="#7a5230"/></g>`;
export const counter = (x, y, w = 200) => `<g transform="translate(${x} ${y})"><rect x="0" y="-70" width="${w}" height="70" fill="#9fc4c9"/><rect x="-4" y="-76" width="${w + 8}" height="9" rx="2" fill="#e8eef0"/>${Array.from({ length: Math.floor(w / 66) }, (_, i) => `<rect x="${8 + i * 66}" y="-60" width="56" height="52" rx="3" fill="#b3d3d7"/><rect x="${30 + i * 66}" y="-40" width="12" height="4" rx="2" fill="#6f8f94"/>`).join('')}</g>`;
export const sink = (x, y) => `<g transform="translate(${x} ${y})"><rect x="0" y="-8" width="52" height="10" rx="3" fill="#b9c4c8"/><path d="M34 -8 V-30 Q34 -38 24 -38 H18" stroke="#8d9aa0" stroke-width="5" fill="none" stroke-linecap="round"/>${[0, 1, 2].map((i) => `<ellipse cx="${12 + i * 5}" cy="${-12 - i * 4}" rx="12" ry="3.5" fill="#fff" stroke="#c8d0d4"/>`).join('')}</g>`;
export const cat = (x, y, s = 1, color = '#f2a65a', pose = 'sit') => pose === 'sleep'
  ? `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-10" rx="24" ry="11" fill="${color}"/><circle cx="18" cy="-14" r="10" fill="${color}"/><path d="M12 -22 l3 -8 l5 6 M20 -22 l5 -7 l2 8" fill="${color}"/><path d="M15 -14 q3 2 6 0" stroke="#333" stroke-width="1.5" fill="none"/><path d="M-22 -8 q-12 4 -4 10" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/><text x="28" y="-28" font-size="12" fill="#6d7ea0" font-family="sans-serif">z z</text></g>`
  : `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 0 Q-18 -26 -6 -30 L8 -30 Q18 -26 14 0Z" fill="${color}"/><circle cx="0" cy="-38" r="13" fill="${color}"/><path d="M-11 -44 l-2 -13 l10 7Z M11 -44 l2 -13 l-10 7Z" fill="${color}"/><circle cx="-5" cy="-39" r="2" fill="#333"/><circle cx="5" cy="-39" r="2" fill="#333"/><path d="M-2 -34 q2 2 4 0" stroke="#333" stroke-width="1.3" fill="none"/><path d="M13 -4 q16 -2 12 -22" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
export const dog = (x, y, s = 1, face = 1, color = '#c98b4f') => `<g transform="translate(${x} ${y}) scale(${s * face} ${s})"><ellipse cx="0" cy="-22" rx="22" ry="12" fill="${color}"/><rect x="-18" y="-16" width="6" height="16" rx="3" fill="${color}"/><rect x="-6" y="-16" width="6" height="16" rx="3" fill="${color}"/><rect x="8" y="-16" width="6" height="16" rx="3" fill="${color}"/><rect x="15" y="-16" width="6" height="16" rx="3" fill="${color}"/><circle cx="24" cy="-34" r="11" fill="${color}"/><ellipse cx="33" cy="-31" rx="7" ry="5" fill="${color}"/><circle cx="38" cy="-32" r="2.5" fill="#333"/><path d="M18 -42 q-6 8 -2 16" stroke="#8a5a2b" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="26" cy="-37" r="2" fill="#333"/><path d="M-21 -26 q-10 -8 -6 -16" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="15" y="-27" width="12" height="4" rx="2" fill="#ff6f59"/></g>`;
export const bird = (x, y, s = 1, color = '#4fa3e3') => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-8" rx="10" ry="8" fill="${color}"/><circle cx="8" cy="-14" r="6" fill="${color}"/><path d="M13 -14 l6 2 l-6 2Z" fill="#ffb13b"/><circle cx="9" cy="-15" r="1.4" fill="#222"/><path d="M-9 -9 l-8 -3 l2 7Z" fill="${color}"/><path d="M-4 -10 q6 -8 10 0" fill="#fff" opacity=".35"/><path d="M-2 0 v4 M3 0 v4" stroke="#e08a12" stroke-width="1.6"/></g>`;
export const flyingBird = (x, y, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-14 0 q7 -9 14 0 q7 -9 14 0" stroke="#40506a" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
export const bike = (x, y, s = 1, color = '#ff6f59') => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke-linecap="round"><circle cx="-26" cy="-18" r="17" stroke="#333" stroke-width="4"/><circle cx="26" cy="-18" r="17" stroke="#333" stroke-width="4"/><path d="M-26 -18 L-6 -18 L10 -44 L-14 -44 Z M-6 -18 L-16 -50 M10 -44 L26 -18 M8 -50 L12 -44" stroke="${color}" stroke-width="4"/><path d="M-22 -52 h14 M4 -52 h10" stroke="#333" stroke-width="4"/></g>`;
export const car = (x, y, s = 1, color = '#4fa3e3', face = 1) => `<g transform="translate(${x} ${y}) scale(${s * face} ${s})"><path d="M-60 -16 Q-62 -36 -44 -38 L-28 -38 L-14 -58 L28 -58 L44 -38 L56 -36 Q64 -34 62 -16Z" fill="${color}"/><path d="M-10 -53 L-20 -40 L8 -40 L8 -53Z M14 -53 L14 -40 L38 -40 L28 -53Z" fill="#dff3ff"/><circle cx="-34" cy="-14" r="12" fill="#333"/><circle cx="-34" cy="-14" r="5" fill="#bbb"/><circle cx="36" cy="-14" r="12" fill="#333"/><circle cx="36" cy="-14" r="5" fill="#bbb"/><rect x="54" y="-32" width="8" height="5" rx="2" fill="#ffe27a"/></g>`;
export const bus = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-80" y="-80" width="160" height="66" rx="10" fill="#ffc53d"/><rect x="-80" y="-36" width="160" height="8" fill="#e89a1a"/>${[0, 1, 2, 3].map((i) => `<rect x="${-70 + i * 36}" y="-72" width="28" height="26" rx="3" fill="#dff3ff"/>`).join('')}<circle cx="-48" cy="-12" r="12" fill="#333"/><circle cx="48" cy="-12" r="12" fill="#333"/></g>`;
export const clock = (x, y, r = 18, h = 3, m = 0) => {
  const ha = rad((h % 12) * 30 + m * 0.5 - 90), ma = rad(m * 6 - 90);
  return `<g><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#1d3461" stroke-width="3.5"/>${Array.from({ length: 12 }, (_, i) => { const a = rad(i * 30); return `<circle cx="${f1(x + Math.cos(a) * r * 0.78)}" cy="${f1(y + Math.sin(a) * r * 0.78)}" r="1.2" fill="#1d3461"/>`; }).join('')}<line x1="${x}" y1="${y}" x2="${f1(x + Math.cos(ha) * r * 0.5)}" y2="${f1(y + Math.sin(ha) * r * 0.5)}" stroke="#1d3461" stroke-width="3" stroke-linecap="round"/><line x1="${x}" y1="${y}" x2="${f1(x + Math.cos(ma) * r * 0.75)}" y2="${f1(y + Math.sin(ma) * r * 0.75)}" stroke="#1d3461" stroke-width="2" stroke-linecap="round"/></g>`;
};
export const windowBox = (x, y, w = 90, h = 70) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#bfe6ff" stroke="#fff" stroke-width="6"/><line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="#fff" stroke-width="4"/><line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" stroke="#fff" stroke-width="4"/>${cloud(x + w * 0.3, y + h * 0.3, 0.45)}</g>`;
export const picture = (x, y, w = 60, h = 44) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="#b07a45" stroke-width="5"/><path d="M${x + 4} ${y + h - 4} L${x + w * 0.35} ${y + h * 0.4} L${x + w * 0.55} ${y + h * 0.65} L${x + w * 0.72} ${y + h * 0.45} L${x + w - 4} ${y + h - 4}Z" fill="#7cc47c"/><circle cx="${x + w * 0.75}" cy="${y + h * 0.28}" r="5" fill="#ffc53d"/></g>`;
export const flower = (x, y, color = '#ff6f8a', s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-34" stroke="#3f9a3f" stroke-width="3"/><path d="M0 -14 q-10 -6 -12 2 q8 2 12 -2" fill="#4ea94e"/>${[0, 72, 144, 216, 288].map((a) => `<circle cx="${f1(Math.cos(rad(a)) * 7)}" cy="${f1(-40 + Math.sin(rad(a)) * 7)}" r="6" fill="${color}"/>`).join('')}<circle cx="0" cy="-40" r="4.5" fill="#ffd84d"/></g>`;
export const pot = (x, y, color = '#ff6f8a') => `<g>${flower(x - 8, y - 22, color, 0.8)}${flower(x + 8, y - 22, '#ffc53d', 0.7)}<path d="M${x - 18} ${y - 26} h36 l-5 26 h-26z" fill="#d9774a"/></g>`;
export const ball = (x, y, r = 10, color = '#ff6f59') => `<g><circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/><path d="M${x - r} ${y} q${r} ${-r * 0.8} ${r * 2} 0" stroke="#fff" stroke-width="2" fill="none"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.4}" r="${r * 0.22}" fill="#fff" opacity=".5"/></g>`;
export const balloon = (x, y, color = '#ff6f59') => `<g><path d="M${x} ${y + 26} q-6 14 2 30" stroke="#888" stroke-width="1.5" fill="none"/><ellipse cx="${x}" cy="${y}" rx="15" ry="19" fill="${color}"/><path d="M${x - 3} ${y + 19} l3 6 l3 -6z" fill="${color}"/><ellipse cx="${x - 5}" cy="${y - 7}" rx="4" ry="6" fill="#fff" opacity=".45"/></g>`;
export const cup = (x, y, color = '#fff') => `<g><path d="M${x - 8} ${y - 18} h16 l-2 18 h-12z" fill="${color}" stroke="#9aa6b2" stroke-width="1.5"/><path d="M${x + 8} ${y - 14} q7 1 5 8 q-2 4 -6 3" stroke="#9aa6b2" stroke-width="2" fill="none"/></g>`;
export const apple = (x, y) => `<g><circle cx="${x}" cy="${y - 8}" r="8" fill="#e84a3c"/><path d="M${x} ${y - 16} v-5" stroke="#6b4428" stroke-width="2"/><path d="M${x + 1} ${y - 19} q6 -4 8 1 q-5 2 -8 -1" fill="#4ea94e"/></g>`;
export const bookObj = (x, y, color = '#457b9d', w = 26, h = 7) => `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="1.5" fill="${color}" stroke="rgba(0,0,0,.15)"/>`;
export const piano = (x, y) => `<g transform="translate(${x} ${y})"><rect x="0" y="-110" width="130" height="80" rx="4" fill="#2b2b33"/><rect x="0" y="-34" width="130" height="10" fill="#1d1d22"/><rect x="6" y="-60" width="118" height="20" fill="#fff"/>${Array.from({ length: 13 }, (_, i) => `<line x1="${6 + i * 9.1}" y1="-60" x2="${6 + i * 9.1}" y2="-40" stroke="#ccc"/>`).join('')}${[0, 1, 3, 4, 5, 7, 8, 10, 11].map((i) => `<rect x="${11 + i * 9.1}" y="-60" width="5" height="12" fill="#222"/>`).join('')}<rect x="8" y="-24" width="10" height="24" fill="#2b2b33"/><rect x="112" y="-24" width="10" height="24" fill="#2b2b33"/></g>`;
export const busStop = (x, y) => `<g><rect x="${x - 3}" y="${y - 110}" width="6" height="110" fill="#666"/><circle cx="${x}" cy="${y - 116}" r="16" fill="#2ec4a6" stroke="#fff" stroke-width="3"/><text x="${x}" y="${y - 111}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="Fredoka, sans-serif">BUS</text></g>`;
export const parasol = (x, y) => `<g><rect x="${x - 2}" y="${y - 110}" width="4" height="110" fill="#8a6a44"/><path d="M${x - 62} ${y - 100} Q${x} ${y - 150} ${x + 62} ${y - 100}Z" fill="#ff6f59"/><path d="M${x - 30} ${y - 118} Q${x - 20} ${y - 138} ${x} ${y - 138} Q${x - 8} ${y - 120} ${x - 10} ${y - 104}" fill="#fff" opacity=".85"/><path d="M${x + 30} ${y - 118} Q${x + 20} ${y - 138} ${x} ${y - 138} Q${x + 8} ${y - 120} ${x + 10} ${y - 104}" fill="#fff" opacity=".85"/></g>`;
export const boardText = (x, y, text) => `<text x="${x}" y="${y}" font-size="20" fill="#f5f5f5" font-family="Andika, sans-serif">${text}</text>`;
export const computer = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-26" y="-44" width="52" height="34" rx="3" fill="#2b2f3a"/><rect x="-22" y="-40" width="44" height="26" fill="#9fd4ff"/><rect x="-5" y="-10" width="10" height="8" fill="#555"/><rect x="-16" y="-3" width="32" height="3" rx="1" fill="#555"/></g>`;
export const puddle = (x, y, w = 60) => `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="7" fill="#9cc7e6" opacity=".8"/>`;
export const raindrops = () => `<g stroke="#7fa7cf" stroke-width="2" stroke-linecap="round" opacity=".8">${Array.from({ length: 40 }, (_, i) => { const x = (i * 97) % W, y = (i * 53) % 210; return `<line x1="${x}" y1="${y}" x2="${x - 4}" y2="${y + 12}"/>`; }).join('')}</g>`;
export const poster = (x, y, w = 70, h = 50, text = 'WELCOME!') => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff6c7" stroke="#e0b93f" stroke-width="3"/><text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle" font-size="12" font-weight="700" fill="#ff6f59" font-family="Fredoka, sans-serif">${text}</text></g>`;
export const box = (x, y, w = 40, h = 30) => `<g><rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" fill="#d9a066" stroke="#b37d45" stroke-width="2"/><path d="M${x - w / 2} ${y - h + 8} H${x + w / 2}" stroke="#b37d45" stroke-width="2"/></g>`;

// ---------------- 小さなアイコン（考えごとの吹き出しの中身） ----------------
export function icon(name, x, y, s = 1) {
  const g = (inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
  switch (name) {
    case 'bike': return g(bike(0, 22, 0.55));
    case 'swim': return g(`<path d="M-30 6 q7 -6 14 0 t14 0 t14 0 t14 0" stroke="#46b6e4" stroke-width="4" fill="none"/><path d="M-30 14 q7 -6 14 0 t14 0 t14 0 t14 0" stroke="#46b6e4" stroke-width="4" fill="none"/><circle cx="0" cy="-6" r="9" fill="#f1c29d"/><path d="M-9 -8 a9 9 0 0 1 18 0z" fill="#ff6f59"/><path d="M8 0 q10 -10 18 -2" stroke="#f1c29d" stroke-width="5" fill="none" stroke-linecap="round"/>`);
    case 'dishes': return g(`${sink(-26, 18)}<circle cx="10" cy="-14" r="5" fill="#fff" stroke="#9cd" /><circle cx="18" cy="-20" r="3.5" fill="#fff" stroke="#9cd"/>`);
    case 'camera': return g('<rect x="-22" y="-14" width="44" height="30" rx="5" fill="#40506a"/><rect x="-10" y="-20" width="16" height="8" rx="2" fill="#40506a"/><circle cx="0" cy="1" r="10" fill="#9fd4ff" stroke="#fff" stroke-width="3"/><circle cx="15" cy="-8" r="2.5" fill="#ffc53d"/>');
    case 'icecream': return g('<path d="M-9 -2 L0 24 L9 -2Z" fill="#e3a257"/><circle cx="0" cy="-8" r="11" fill="#ff9ec4"/><circle cx="-5" cy="-16" r="8" fill="#fff3b0"/>');
    case 'bus': return g(bus(0, 22, 0.32));
    case 'cake': return g('<rect x="-20" y="-6" width="40" height="22" rx="3" fill="#fff3e0" stroke="#e8c9a0"/><rect x="-20" y="-6" width="40" height="7" fill="#ff9ec4"/><rect x="-2" y="-20" width="4" height="14" fill="#8a6cf0"/><path d="M0 -26 q4 4 0 6 q-4 -2 0 -6" fill="#ffc53d"/>');
    case 'tennis': return g('<ellipse cx="-6" cy="-6" rx="13" ry="17" fill="none" stroke="#ff6f59" stroke-width="4"/><path d="M2 8 L16 26" stroke="#8a5a33" stroke-width="5" stroke-linecap="round"/><circle cx="18" cy="-14" r="6" fill="#d4e157"/>');
    case 'soccer': return g('<circle cx="0" cy="0" r="16" fill="#fff" stroke="#333" stroke-width="2"/><path d="M0 -6 l6 4 l-2 7 h-8 l-2 -7z" fill="#333"/>');
    case 'book': return g('<path d="M-22 -12 q11 -6 22 0 v28 q-11 -6 -22 0z" fill="#fff" stroke="#457b9d" stroke-width="2.5"/><path d="M22 -12 q-11 -6 -22 0 v28 q11 -6 22 0z" fill="#fff" stroke="#457b9d" stroke-width="2.5"/>');
    case 'shopping': return g('<path d="M-16 -8 h32 l-3 30 h-26z" fill="#ff6f59"/><path d="M-8 -8 q0 -14 8 -14 q8 0 8 14" stroke="#ff6f59" stroke-width="3" fill="none"/>');
    case 'train': return g('<rect x="-26" y="-18" width="52" height="30" rx="6" fill="#2ec4a6"/><rect x="-20" y="-12" width="14" height="10" fill="#dff3ff"/><rect x="6" y="-12" width="14" height="10" fill="#dff3ff"/><circle cx="-14" cy="16" r="5" fill="#333"/><circle cx="14" cy="16" r="5" fill="#333"/>');
    case 'bed': return g('<rect x="-28" y="0" width="56" height="12" fill="#8a6cf0"/><rect x="-28" y="-10" width="18" height="10" rx="3" fill="#fff"/><rect x="-30" y="-14" width="5" height="32" fill="#8a5a33"/><text x="6" y="-8" font-size="14" fill="#1d3461" font-family="sans-serif">Zzz</text>');
    case 'letter': return g('<rect x="-22" y="-14" width="44" height="30" rx="3" fill="#fff" stroke="#1d3461" stroke-width="2"/><path d="M-22 -14 L0 4 L22 -14" stroke="#1d3461" stroke-width="2" fill="none"/>');
    case 'pizza': return g('<path d="M-20 -14 L20 -14 L0 22Z" fill="#ffd27a" stroke="#e3a257" stroke-width="3"/><circle cx="-6" cy="-6" r="3.5" fill="#e84a3c"/><circle cx="6" cy="-4" r="3.5" fill="#e84a3c"/><circle cx="0" cy="6" r="3" fill="#e84a3c"/>');
    case 'movie': return g('<rect x="-26" y="-18" width="52" height="34" rx="4" fill="#40506a"/><path d="M-6 -8 L8 0 L-6 8Z" fill="#fff"/>');
    case 'guitar': return g('<ellipse cx="-6" cy="8" rx="12" ry="11" fill="#e3a257"/><ellipse cx="4" cy="-4" rx="9" ry="8" fill="#e3a257"/><circle cx="-2" cy="4" r="3.5" fill="#6b4428"/><path d="M6 -8 L24 -26" stroke="#6b4428" stroke-width="4"/>');
    case 'piano': return g('<rect x="-26" y="-10" width="52" height="20" fill="#fff" stroke="#333" stroke-width="2"/>' + [0, 1, 3, 4, 5].map((i) => `<rect x="${-22 + i * 9}" y="-10" width="5" height="11" fill="#333"/>`).join(''));
    case 'umbrella': return g('<path d="M-24 0 Q0 -30 24 0Z" fill="#8a6cf0"/><path d="M0 0 V18 q0 5 -5 5" stroke="#555" stroke-width="3" fill="none"/>');
    case 'car': return g(car(0, 20, 0.42, '#ff6f59'));
    case 'rice': return g('<path d="M-20 -4 h40 q-2 22 -20 22 q-18 0 -20 -22z" fill="#fff" stroke="#9aa6b2" stroke-width="2"/><ellipse cx="0" cy="-4" rx="20" ry="7" fill="#fdfdf8"/><path d="M8 -20 L22 -4 M14 -22 L26 -8" stroke="#8a5a33" stroke-width="2.5"/>');
    default: return '';
  }
}

export function thought(x, y, tx, ty, iconName, { w = 90, h = 62 } = {}) {
  // 吹き出しの本体から人物の頭 (tx, ty) に向かって小さな丸が続く
  const dx = tx - x, dy = ty - (y + h / 2);
  const dots = [0.35, 0.62, 0.84].map((t, i) => `<circle cx="${f1(x + dx * t)}" cy="${f1(y + h / 2 + dy * t)}" r="${6 - i * 1.6}" fill="#fff" stroke="#9aa6b2" stroke-width="1.5"/>`).join('');
  const bumps = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return `<circle cx="${f1(x + Math.cos(a) * w * 0.42)}" cy="${f1(y + Math.sin(a) * h * 0.38)}" r="${f1(h * 0.28)}"/>`;
  }).join('');
  return `<g class="thought">${dots}<g fill="#fff" stroke="#9aa6b2" stroke-width="2">${bumps}</g><g fill="#fff">${bumps.replace(/r="([\d.]+)"/g, (m, r) => `r="${f1(r - 2)}"`)}</g><ellipse cx="${x}" cy="${y}" rx="${w * 0.42}" ry="${h * 0.38}" fill="#fff"/>${icon(iconName, x, y, 0.95)}</g>`;
}

// ---------------- 人物 ----------------
// 角度（度）：0 = 真下、90 = 正面方向（向いている方向に水平）、180 = 真上、マイナス = 後ろ向き
const POSES = {
  stand: { an: [8, 4], af: [-8, -4], ln: [3, 0], lf: [-3, 0] },
  walk: { an: [-24, -10], af: [28, 45], ln: [22, 6], lf: [-18, -32] },
  run: { an: [-40, 40], af: [55, 115], ln: [55, -15], lf: [-28, -80], lean: 12 },
  sit: { an: [22, 72], af: [18, 70], ln: [88, 0], lf: [84, 2], sit: true },
  wave: { an: [150, 172], af: [-8, -4], ln: [3, 0], lf: [-3, 0] },
  hold: { an: [30, 100], af: [26, 95], ln: [3, 0], lf: [-3, 0] },
  read: { an: [22, 112], af: [18, 108], ln: [3, 0], lf: [-3, 0] },
  sitread: { an: [22, 112], af: [18, 108], ln: [88, 0], lf: [84, 2], sit: true },
  phone: { an: [18, 165], af: [-8, -4], ln: [3, 0], lf: [-3, 0] },
  sitphone: { an: [18, 165], af: [20, 70], ln: [88, 0], lf: [84, 2], sit: true },
  point: { an: [92, 92], af: [-8, -4], ln: [3, 0], lf: [-3, 0] },
  carry: { an: [18, 88], af: [14, 84], ln: [3, 0], lf: [-3, 0] },
  drink: { an: [24, 150], af: [18, 70], ln: [88, 0], lf: [84, 2], sit: true },
  reach: { an: [128, 140], af: [-6, -4], ln: [3, 0], lf: [-3, 0] },
  cook: { an: [34, 78], af: [30, 72], ln: [3, 0], lf: [-3, 0] },
  water: { an: [48, 70], af: [-8, -4], ln: [8, 0], lf: [-6, 0] },
  photo: { an: [38, 150], af: [44, 152], ln: [3, 0], lf: [-3, 0] },
  guitar: { an: [34, 98], af: [72, 96], ln: [88, 0], lf: [84, 2], sit: true },
  throw: { an: [160, 150], af: [60, 80], ln: [14, 0], lf: [-16, -6] },
  umbrella: { an: [40, 125], af: [-8, -4], ln: [22, 6], lf: [-18, -32] },
  walkdog: { an: [45, 60], af: [-24, -10], ln: [22, 6], lf: [-18, -32] },
};

function seg(x, y, ang, len, f) {
  return [x + f * Math.sin(rad(ang)) * len, y + Math.cos(rad(ang)) * len];
}
function limb([x0, y0], [a1, a2], [l1, l2], f) {
  const [x1, y1] = seg(x0, y0, a1, l1, f);
  const [x2, y2] = seg(x1, y1, a2, l2, f);
  return { d: `M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)} L${f1(x2)} ${f1(y2)}`, end: [x2, y2], mid: [x1, y1] };
}
const shade = (hex, k = 0.82) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * k), g = Math.round(((n >> 8) & 255) * k), b = Math.round((n & 255) * k);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

function propSVG(prop, [hx, hy], f, s, extra = {}) {
  const t = (inner) => `<g transform="translate(${f1(hx)} ${f1(hy)}) scale(${f * s} ${s})">${inner}</g>`;
  switch (prop) {
    case 'book': return t('<path d="M0 -10 q-9 -4 -16 0 v18 q7 -4 16 0z" fill="#fff" stroke="#457b9d" stroke-width="2"/><path d="M0 -10 q9 -4 16 0 v18 q-7 -4 -16 0z" fill="#fff" stroke="#457b9d" stroke-width="2"/>');
    case 'books': return t('<rect x="-18" y="-24" width="36" height="8" fill="#e76f51"/><rect x="-16" y="-16" width="34" height="8" fill="#2a9d8f"/><rect x="-18" y="-8" width="36" height="8" fill="#e9c46a"/>');
    case 'phone': return t('<rect x="-4" y="-8" width="8" height="14" rx="2" fill="#40506a"/>');
    case 'cup': return t('<path d="M-5 -10 h10 l-1 12 h-8z" fill="#fff" stroke="#9aa6b2" stroke-width="1.5"/>');
    case 'box': return t('<rect x="-24" y="-30" width="44" height="32" fill="#d9a066" stroke="#b37d45" stroke-width="2"/><path d="M-24 -22 H20" stroke="#b37d45" stroke-width="2"/>');
    case 'bag': return t('<path d="M-2 0 q0 -8 6 -8 q6 0 6 8" stroke="#8a5a33" stroke-width="2" fill="none"/><rect x="-5" y="0" width="18" height="15" rx="3" fill="#8a6cf0"/>');
    case 'umbrella': return t('<path d="M0 0 V-62" stroke="#555" stroke-width="3"/><path d="M-46 -54 Q0 -100 46 -54 Q34 -60 23 -54 Q12 -60 0 -54 Q-12 -60 -23 -54 Q-34 -60 -46 -54Z" fill="#8a6cf0"/>');
    case 'guitar': return t('<g transform="rotate(-28)"><ellipse cx="-4" cy="10" rx="15" ry="13" fill="#e3a257"/><ellipse cx="8" cy="-4" rx="11" ry="10" fill="#e3a257"/><circle cx="2" cy="4" r="4" fill="#6b4428"/><rect x="14" y="-12" width="40" height="5" fill="#6b4428"/></g>');
    case 'camera': return t('<rect x="-8" y="-6" width="16" height="11" rx="2" fill="#40506a"/><circle cx="4" cy="0" r="3.5" fill="#9fd4ff"/>');
    case 'ball': return t(ball(0, -6, 8, extra.color || '#ff6f59'));
    case 'wateringcan': return t('<rect x="-6" y="-14" width="22" height="16" rx="3" fill="#2ec4a6"/><path d="M16 -8 L34 -20" stroke="#2ec4a6" stroke-width="4" stroke-linecap="round"/><path d="M36 -18 q4 8 8 14 M38 -20 q6 6 12 10" stroke="#7fc8ef" stroke-width="2" stroke-dasharray="3 3" fill="none"/>');
    case 'pen': return t('<path d="M0 0 L8 -12" stroke="#fff" stroke-width="3" stroke-linecap="round"/>');
    case 'chalk': return t('<path d="M0 0 L6 -6" stroke="#fff" stroke-width="4" stroke-linecap="round"/>');
    case 'icecream': return t('<path d="M-5 -2 L0 12 L5 -2Z" fill="#e3a257"/><circle cx="0" cy="-6" r="6" fill="#ff9ec4"/>');
    case 'knife': return t('<rect x="-14" y="-2" width="28" height="4" rx="1" fill="#cfd8dc"/>');
    case 'flowers': return t(`${flower(-4, 0, '#ff6f8a', 0.5)}${flower(4, 0, '#ffc53d', 0.5)}`);
    default: return '';
  }
}

/**
 * 人物を描く
 * o: { x, y（足もと）, s, pose, face(1|-1), skin, hair: short|long|pony|bun|cap|bald, hairColor, shirt, pants, skirt, kid, hold, eyes, leash:[x,y] }
 */
export function person(o) {
  const f = o.face ?? 1;
  const s = (o.s ?? 1) * (o.kid ? 0.8 : 1);
  const P = POSES[o.pose || 'stand'];
  const skin = o.skin || SKIN[0];
  const hc = o.hairColor || HAIR.black;
  const shirt = o.shirt || '#4fa3e3';
  const pants = o.pants || '#1d3461';
  const LEG = [27 * s, 27 * s], ARM = [21 * s, 19 * s], TORSO = 42 * s, HEAD = 15 * s;
  // 腰の位置
  let hip;
  if (P.sit) hip = [o.x, o.y - (o.seat ?? 44) * s + 4 * s];
  else hip = [o.x, o.y - (Math.cos(rad(P.ln[0])) * LEG[0] + Math.cos(rad(P.ln[1])) * LEG[1])];
  const lean = P.lean || 0;
  const neck = seg(hip[0], hip[1], 180 - lean, TORSO, f);
  const shoulder = seg(hip[0], hip[1], 180 - lean, TORSO - 6 * s, f);
  const head = seg(neck[0], neck[1], 180 - lean * 0.5, HEAD + 3 * s, f);
  const legF = limb(hip, P.lf, LEG, f);
  const legN = limb(hip, P.ln, LEG, f);
  const armF = limb([shoulder[0] - f * 3 * s, shoulder[1]], P.af, ARM, f);
  const armN = limb([shoulder[0] + f * 2 * s, shoulder[1]], P.an, ARM, f);
  const lw = 11 * s, aw = 8.5 * s;
  const shoe = (end, c) => `<ellipse cx="${f1(end[0] + f * 4 * s)}" cy="${f1(end[1] - 1)}" rx="${f1(7.5 * s)}" ry="${f1(4.2 * s)}" fill="${c}"/>`;
  const hand = (end) => `<circle cx="${f1(end[0])}" cy="${f1(end[1])}" r="${f1(4.6 * s)}" fill="${skin}"/>`;
  const [hx, hy] = head;
  const r = HEAD;

  // 髪（後ろ側）
  let hairBack = '', hairFront = '';
  const style = o.hair || 'short';
  if (style === 'long') hairBack = `<path d="M${f1(hx - r * 1.05)} ${f1(hy - 2)} Q${f1(hx - r * 1.2)} ${f1(hy + r * 1.7)} ${f1(hx - f * r * 0.2)} ${f1(hy + r * 1.8)} Q${f1(hx + r * 1.2)} ${f1(hy + r * 1.7)} ${f1(hx + r * 1.05)} ${f1(hy - 2)}Z" fill="${hc}"/>`;
  if (style === 'pony') hairBack = `<ellipse cx="${f1(hx - f * r * 1.15)}" cy="${f1(hy + r * 0.4)}" rx="${f1(r * 0.45)}" ry="${f1(r * 0.8)}" fill="${hc}"/>`;
  if (style === 'bun') hairBack = `<circle cx="${f1(hx - f * r * 0.3)}" cy="${f1(hy - r * 1.05)}" r="${f1(r * 0.5)}" fill="${hc}"/>`;
  if (style !== 'bald' && style !== 'cap') hairFront = `<path d="M${f1(hx - r * 1.02)} ${f1(hy + 1)} A${f1(r * 1.02)} ${f1(r * 1.02)} 0 0 1 ${f1(hx + r * 1.02)} ${f1(hy + 1)} Q${f1(hx + f * r * 0.2)} ${f1(hy - r * 0.55)} ${f1(hx - f * r * 0.6)} ${f1(hy - r * 0.25)} Q${f1(hx - f * r * 0.9)} ${f1(hy + r * 0.3)} ${f1(hx - f * r * 1.02)} ${f1(hy + r * 0.5)}Z" fill="${hc}"/>`;
  if (style === 'cap') hairFront = `<path d="M${f1(hx - r)} ${f1(hy - 1)} A${f1(r)} ${f1(r)} 0 0 1 ${f1(hx + r)} ${f1(hy - 1)}Z" fill="${o.capColor || '#ff6f59'}"/><path d="M${f1(hx + f * r * 0.4)} ${f1(hy - 2)} h${f1(f * r * 0.95)} v${f1(3 * s)} h${f1(-f * r * 0.95)}z" fill="${o.capColor || '#ff6f59'}"/>`;
  const eyes = o.eyes === 'closed'
    ? `<path d="M${f1(hx + f * 1)} ${f1(hy)} h${f1(f * 3.4 * s)} M${f1(hx + f * 8 * s)} ${f1(hy)} h${f1(f * 3.4 * s)}" stroke="#2a1f1b" stroke-width="${f1(1.6 * s)}" stroke-linecap="round"/>`
    : `<circle cx="${f1(hx + f * 2.6 * s)}" cy="${f1(hy)}" r="${f1(1.9 * s)}" fill="#2a1f1b"/><circle cx="${f1(hx + f * 9.6 * s)}" cy="${f1(hy)}" r="${f1(1.9 * s)}" fill="#2a1f1b"/>`;
  const mouth = o.mouth === 'open'
    ? `<ellipse cx="${f1(hx + f * 6.5 * s)}" cy="${f1(hy + 6.5 * s)}" rx="${f1(2.6 * s)}" ry="${f1(2.2 * s)}" fill="#c0392b"/>`
    : `<path d="M${f1(hx + f * 3.5 * s)} ${f1(hy + 5.5 * s)} q${f1(f * 3 * s)} ${f1(3 * s)} ${f1(f * 6 * s)} 0" stroke="#8a3b2b" stroke-width="${f1(1.5 * s)}" fill="none" stroke-linecap="round"/>`;

  // 胴体（服）
  const torsoPath = `M${f1(hip[0])} ${f1(hip[1])} L${f1(shoulder[0])} ${f1(shoulder[1])}`;
  const skirt = o.skirt ? `<path d="M${f1(hip[0] - 13 * s)} ${f1(hip[1] - 6 * s)} L${f1(hip[0] + 13 * s)} ${f1(hip[1] - 6 * s)} L${f1(hip[0] + (P.sit ? f * 24 : 17) * s)} ${f1(hip[1] + 16 * s)} L${f1(hip[0] - (P.sit ? -f * 2 : 17) * s)} ${f1(hip[1] + 16 * s)}Z" fill="${o.skirtColor || pants}"/>` : '';

  const leash = o.leash ? `<path d="M${f1(armN.end[0])} ${f1(armN.end[1])} Q${f1((armN.end[0] + o.leash[0]) / 2)} ${f1(Math.max(armN.end[1], o.leash[1]) + 12)} ${f1(o.leash[0])} ${f1(o.leash[1])}" stroke="#ff6f59" stroke-width="2" fill="none"/>` : '';
  let prop = '';
  if (o.hold) {
    const two = ['box', 'books', 'book', 'guitar', 'camera'].includes(o.hold);
    const at = two ? [(armN.end[0] + armF.end[0]) / 2, (armN.end[1] + armF.end[1]) / 2] : armN.end;
    prop = propSVG(o.hold, at, f, s, { color: o.propColor });
  }
  const propBehind = o.hold === 'guitar' || o.hold === 'umbrella';

  return `<g class="person">
    ${hairBack}
    <path d="${armF.d}" stroke="${shade(shirt)}" stroke-width="${f1(aw)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${hand(armF.end)}
    <path d="${legF.d}" stroke="${shade(pants)}" stroke-width="${f1(lw)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${shoe(legF.end, '#3b3b44')}
    <path d="${legN.d}" stroke="${pants}" stroke-width="${f1(lw)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${shoe(legN.end, '#44444f')}
    ${propBehind ? prop : ''}
    ${skirt}
    <path d="${torsoPath}" stroke="${shirt}" stroke-width="${f1(25 * s)}" stroke-linecap="round"/>
    <rect x="${f1(neck[0] - 3.5 * s)}" y="${f1(neck[1] - 4 * s)}" width="${f1(7 * s)}" height="${f1(8 * s)}" fill="${skin}"/>
    <circle cx="${f1(hx)}" cy="${f1(hy)}" r="${f1(r)}" fill="${skin}"/>
    ${hairFront}
    ${eyes}${mouth}
    <ellipse cx="${f1(hx + f * 11 * s)}" cy="${f1(hy + 4 * s)}" rx="${f1(2.6 * s)}" ry="${f1(1.6 * s)}" fill="#ff8fa3" opacity=".6"/>
    ${propBehind ? '' : prop}
    <path d="${armN.d}" stroke="${shirt}" stroke-width="${f1(aw)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${hand(armN.end)}
    ${leash}
  </g>`;
}

/** 背景＋部品で1枚の絵にする */
let uid = 0;
export function scene(bg, parts, { label = '' } = {}) {
  const u = ++uid;
  return `<svg class="scene" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}"><rect width="${W}" height="${H}" fill="#fff"/>${(BG[bg] || BG.room)(u)}${parts.join('')}</svg>`;
}
