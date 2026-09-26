// マスコット「フート先生」（パイロット帽のフクロウ）
const EYES = {
  normal: `<circle cx="74" cy="90" r="12" fill="#1b2340"/><circle cx="126" cy="90" r="12" fill="#1b2340"/>
           <circle cx="78" cy="85" r="4.2" fill="#fff"/><circle cx="130" cy="85" r="4.2" fill="#fff"/>
           <circle cx="70" cy="95" r="1.8" fill="#fff" opacity=".7"/><circle cx="122" cy="95" r="1.8" fill="#fff" opacity=".7"/>`,
  happy: `<path d="M61 94 q13 -16 26 0" stroke="#1b2340" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M113 94 q13 -16 26 0" stroke="#1b2340" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  sad: `<path d="M62 88 q12 9 24 3" stroke="#1b2340" stroke-width="5.5" fill="none" stroke-linecap="round"/>
        <path d="M114 91 q12 6 24 -3" stroke="#1b2340" stroke-width="5.5" fill="none" stroke-linecap="round"/>
        <path class="tear" d="M70 100 q-6 10 0 14 q6 -4 0 -14z" fill="#7cc8ff"/>`,
  think: `<circle cx="69" cy="84" r="11" fill="#1b2340"/><circle cx="121" cy="84" r="11" fill="#1b2340"/>
          <circle cx="72" cy="80" r="3.6" fill="#fff"/><circle cx="124" cy="80" r="3.6" fill="#fff"/>`,
  wow: `<circle cx="74" cy="90" r="14" fill="#1b2340"/><circle cx="126" cy="90" r="14" fill="#1b2340"/>
        <circle cx="79" cy="84" r="5" fill="#fff"/><circle cx="131" cy="84" r="5" fill="#fff"/>`,
};

/**
 * mood: normal | happy | sad | think | wow | cheer | talk
 * outfit: pilot（パイロット帽）| examiner（めがね＋ネクタイの面接官）
 */
export function mascot(mood = 'normal', cls = '', outfit = 'pilot') {
  const eye = EYES[mood] ? mood : mood === 'cheer' ? 'happy' : 'normal';
  const cheer = mood === 'cheer' || mood === 'happy';
  const uid = Math.random().toString(36).slice(2, 7);
  return `
<svg class="mascot ${cls} mood-${mood}" viewBox="0 0 200 200" aria-hidden="true">
  <defs>
    <radialGradient id="ow-b${uid}" cx="0.35" cy="0.3" r="0.8">
      <stop offset="0" stop-color="#e7a468"/><stop offset="0.65" stop-color="#c77b3e"/><stop offset="1" stop-color="#9c5a28"/>
    </radialGradient>
  </defs>
  <ellipse cx="100" cy="190" rx="50" ry="7" fill="rgba(0,0,0,.13)"/>
  <g class="mascot-body">
    <!-- 耳の羽 -->
    <path d="M50 58 L40 20 L80 44 Z" fill="#9c5a28"/>
    <path d="M150 58 L160 20 L120 44 Z" fill="#9c5a28"/>
    <!-- からだ -->
    <path d="M100 32 C152 32 174 72 172 118 C170 162 142 186 100 186 C58 186 30 162 28 118 C26 72 48 32 100 32 Z" fill="url(#ow-b${uid})"/>
    <!-- おなか -->
    <ellipse cx="100" cy="142" rx="46" ry="40" fill="#fbe8cc"/>
    <path d="M78 132 q6 6 12 0 M110 132 q6 6 12 0 M92 150 q6 6 12 0 M76 160 q6 6 12 0 M112 160 q6 6 12 0" stroke="#e2b98a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- 羽 -->
    ${cheer
      ? `<path class="wing-l" d="M36 118 C16 100 12 78 20 62 C30 80 42 94 50 104 Z" fill="#9c5a28"/>
         <path class="wing-r" d="M164 118 C184 100 188 78 180 62 C170 80 158 94 150 104 Z" fill="#9c5a28"/>`
      : `<path d="M34 104 C18 124 20 152 36 166 C42 146 46 128 48 112 Z" fill="#9c5a28"/>
         <path d="M166 104 C182 124 180 152 164 166 C158 146 154 128 152 112 Z" fill="#9c5a28"/>`}
    <!-- 目のまわり -->
    <circle cx="74" cy="90" r="27" fill="#fff8ee"/><circle cx="126" cy="90" r="27" fill="#fff8ee"/>
    <circle cx="74" cy="90" r="27" fill="none" stroke="#9c5a28" stroke-width="3" opacity=".5"/>
    <circle cx="126" cy="90" r="27" fill="none" stroke="#9c5a28" stroke-width="3" opacity=".5"/>
    ${EYES[eye]}
    ${outfit === 'examiner' ? `
      <circle cx="74" cy="90" r="22" fill="none" stroke="#1d3461" stroke-width="4"/>
      <circle cx="126" cy="90" r="22" fill="none" stroke="#1d3461" stroke-width="4"/>
      <path d="M96 88 q4 -4 8 0" stroke="#1d3461" stroke-width="4" fill="none"/>` : ''}
    <!-- くちばし -->
    <g class="beak">
      <path d="M100 104 L88 114 Q100 132 112 114 Z" fill="#ffb13b" stroke="#e08a12" stroke-width="2" stroke-linejoin="round"/>
      <path class="beak-open" d="M91 118 Q100 126 109 118" stroke="#9c5a28" stroke-width="2" fill="none" opacity="0"/>
    </g>
    <ellipse cx="54" cy="116" rx="8" ry="5" fill="#ff8fa3" opacity=".45"/>
    <ellipse cx="146" cy="116" rx="8" ry="5" fill="#ff8fa3" opacity=".45"/>
    <!-- 足 -->
    <path d="M78 184 l-6 6 M84 185 l0 7 M90 184 l6 6 M110 184 l-6 6 M116 185 l0 7 M122 184 l6 6" stroke="#e08a12" stroke-width="4" stroke-linecap="round"/>
    ${outfit === 'examiner' ? `
      <!-- えり・ネクタイ -->
      <path d="M78 136 L100 146 L122 136 L118 128 L100 138 L82 128 Z" fill="#fff" stroke="#d9cbb5" stroke-width="1.5"/>
      <path d="M94 144 L106 144 L103 152 L110 176 L100 184 L90 176 L97 152 Z" fill="#ff6f59"/>
      <path d="M96 160 L106 156 M94 170 L108 164" stroke="#e0513c" stroke-width="2.5"/>` : `
      <!-- パイロット帽 -->
      <path d="M52 52 C60 26 140 26 148 52 C132 46 68 46 52 52 Z" fill="#1d3461"/>
      <path d="M46 54 C70 44 130 44 154 54 C150 60 50 60 46 54 Z" fill="#14264a"/>
      <path d="M86 38 l14 -4 l14 4 l-14 4 z" fill="#ffc53d"/>
      <circle cx="100" cy="38" r="4" fill="#ffc53d"/>`}
  </g>
</svg>`;
}

const LINES = {
  morning: ['おはよう！朝の10分は記憶のゴールデンタイムだよ', '朝の単語チェック、いってみよう！'],
  day: ['今日もいっしょに飛び立とう！', 'コツコツが合格への近道だよ', 'まちがえた単語は、覚えたときがいちばん強い！', '英語は声に出すと覚えやすいよ'],
  evening: ['おつかれさま！少しだけやっていこう', '寝る前の復習は記憶に残りやすいよ'],
  due: (n) => `復習どきの単語・問題が${n}こあるよ。忘れる前にやっつけよう！`,
  streak: (n) => `${n}日連続！その調子でフライト続行！`,
  exam: (d) => `一次試験まであと${d}日。いっしょに合格しよう！`,
  exam2: (d) => `面接まであと${d}日！AI面接で声を出して練習しよう`,
  writing: 'ライティングは2問で全体の3分の1の配点！1日1題書いてみよう',
};

export function greeting({ due = 0, streak = 0, examDays = null, exam2Days = null, noWriting = false } = {}) {
  const h = new Date().getHours();
  const opts = [];
  if (exam2Days != null && exam2Days >= 0 && exam2Days <= 30) opts.push(LINES.exam2(exam2Days));
  if (due >= 10) opts.push(LINES.due(due));
  if (streak >= 2) opts.push(LINES.streak(streak));
  if (examDays != null && examDays >= 0 && examDays <= 60) opts.push(LINES.exam(examDays));
  if (noWriting) opts.push(LINES.writing);
  opts.push(...(h < 10 ? LINES.morning : h >= 18 ? LINES.evening : LINES.day));
  return opts[Math.floor(Math.random() * Math.min(opts.length, 3))];
}
