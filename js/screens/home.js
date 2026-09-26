// ホーム：搭乗券（本番までの日数・合格予測）・今日のフライトプラン・技能別の予測
import * as store from '../store.js';
import { CARDS, meanKey, exampleHTML } from '../bank.js';
import { isDue, status } from '../srs.js';
import { levelInfo } from '../game.js';
import { mascot, greeting } from '../mascot.js';
import { ring, actions, esc, daysUntil } from '../ui.js';
import { go } from '../app.js';
import { sfx } from '../sound.js';
import { say } from '../speech.js';
import { estimate, PASS1, PASS2, SKILL_MAX, SKILL_LINE } from '../predict.js';
import { paperPlane } from '../fx.js';

/** 今日のフライトプラン（分野ごとの目標） */
export function todayPlan() {
  const s = store.get();
  const k = store.today().k || {};
  const exam2 = daysUntil(s.settings.exam2Date);
  const speakDay = (exam2 != null && exam2 >= 0 && exam2 <= 30) || new Date().getDay() % 3 === 0;
  const due = CARDS.filter((c) => isDue(s.items[meanKey(c)])).length;
  const sum = (...keys) => keys.reduce((a, x) => a + (k[x] || 0), 0);
  return [
    { id: 'words', icon: '🃏', label: '単語カード', sub: due ? `復習どき ${due} 枚` : '新しい単語も', done: sum('words'), target: 20, to: ['wordplay', { mode: 'flash', src: 'auto' }] },
    { id: 'spell', icon: '✍️', label: '手書きスペル', sub: 'ペンでつづりを書く', done: sum('spell'), target: 10, to: ['wordplay', { mode: 'spell', src: 'auto' }] },
    { id: 'drill', icon: '📖', label: '筆記ドリル', sub: '大問1・2・3', done: sum('r1', 'r2', 'r3'), target: 10, to: ['quiz', { part: 'mix' }] },
    { id: 'listen', icon: '🎧', label: 'リスニング', sub: '第1〜3部', done: sum('l1', 'l2', 'l3'), target: 6, to: ['quiz', { part: 'lmix' }] },
    speakDay
      ? { id: 'speak', icon: '🎤', label: 'AI面接', sub: '声に出して練習', done: sum('speak'), target: 1, to: ['talk', { card: 'random' }] }
      : { id: 'write', icon: '✉️', label: 'ライティング', sub: 'Eメール・英作文', done: sum('write'), target: 1, to: ['write'] },
  ];
}

export function renderHome(root) {
  const s = store.get();
  const st = s.settings;
  const lv = levelInfo();
  const streak = store.streak();
  const today = store.today();
  let due = 0, learned = 0;
  for (const c of CARDS) {
    const it = s.items[meanKey(c)];
    if (!it?.n) continue;
    if (['review', 'mastered'].includes(status(it))) learned++;
    if (isDue(it)) due++;
  }
  const examDays = daysUntil(st.examDate);
  const exam2Days = daysUntil(st.exam2Date);
  const est = estimate(s);
  const plan = todayPlan();
  const planDone = plan.filter((p) => p.done >= p.target).length;
  const hour = new Date().getHours();
  const hello = hour < 10 ? 'Good morning' : hour < 18 ? 'Hello' : 'Good evening';
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const cod = CARDS[Math.floor(Date.now() / 864e5) % CARDS.length]; // 今日の単語
  const flightScore = est.total1 ?? est.guess1;
  const flight = flightScore != null ? Math.min(1, flightScore / PASS1) : 0;
  const target = exam2Days != null && exam2Days >= 0 && (examDays == null || examDays < 0) ? { d: exam2Days, label: 'SPEAKING TEST', ja: '二次試験（面接）' } : examDays != null && examDays >= 0 ? { d: examDays, label: 'FIRST STAGE', ja: '一次試験' } : null;
  const noWriting = !s.writings.length;

  const bar = (key, name, data, max = SKILL_MAX, line = SKILL_LINE) => `
    <div class="skill ${data ? '' : 'none'}">
      <div class="skill-head"><b>${name}</b><span>${data ? `${data.cse}<small>/${max}</small>` : '<small>データなし</small>'}</span></div>
      <div class="skill-bar"><i style="width:${data ? (data.cse / max) * 100 : 0}%" class="${data && data.cse >= line ? 'ok' : ''}"></i><em style="left:${(line / max) * 100}%"></em></div>
      <small class="muted">${data ? `正答率 ${Math.round(data.ratio * 100)}%（直近${data.n}${key === 'w' || key === 's' ? '回' : '問'}）` : { r: '筆記ドリルを10問以上解くと表示', l: 'リスニングを8問以上解くと表示', w: 'ライティングに挑戦すると表示', s: 'AI面接を受けると表示' }[key]}</small>
    </div>`;

  root.innerHTML = `
  <header class="home-hero">
    <svg class="hero-sky" viewBox="0 0 1000 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g class="cl c1" fill="#fff"><ellipse cx="760" cy="52" rx="46" ry="20"/><ellipse cx="730" cy="60" rx="30" ry="16"/><ellipse cx="795" cy="60" rx="34" ry="16"/><ellipse cx="765" cy="40" rx="26" ry="18"/></g>
      <g class="cl c2" fill="#fff"><ellipse cx="920" cy="120" rx="34" ry="14"/><ellipse cx="898" cy="126" rx="22" ry="11"/><ellipse cx="945" cy="126" rx="24" ry="11"/></g>
      <g class="cl c3" fill="#fff"><ellipse cx="560" cy="200" rx="70" ry="22"/><ellipse cx="515" cy="208" rx="44" ry="18"/><ellipse cx="610" cy="208" rx="48" ry="18"/></g>
      <path d="M430 190 Q650 40 990 70" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="8 10" opacity=".35"/>
    </svg>
    <button class="icon-btn gear" data-action="settings" aria-label="設定">
      <svg viewBox="0 0 24 24"><path d="M19.14 12.94a7.07 7.07 0 0 0 0-1.88l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.47.47 0 0 0-.47.41l-.36 2.54a7.3 7.3 0 0 0-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58a7.4 7.4 0 0 0 0 1.88l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54a7 7 0 0 0 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"/></svg>
    </button>
    <div class="hero-inner">
      <div class="hero-mascot" data-action="poke">${mascot(planDone >= plan.length ? 'cheer' : 'normal', 'bob')}</div>
      <div class="hero-text">
        <p class="bubble">${esc(greeting({ due, streak, examDays, exam2Days, noWriting }))}</p>
        <h1><span class="h1-sub">${hello}${st.name ? `, ${esc(st.name)}` : ''}!</span>英検3級 <span class="brand">Passport</span></h1>
        <div class="hero-stats">
          <div class="lv-chip"><b>Lv.${lv.level}</b><span>${lv.title.ja}</span></div>
          <div class="xp-bar" title="次のレベルまで ${lv.need - lv.into} XP"><i style="width:${(lv.ratio * 100).toFixed(1)}%"></i><small>${lv.into} / ${lv.need} XP</small></div>
          <div class="streak-chip ${streak ? 'on' : ''}"><span class="flame">🔥</span><b>${streak}</b>日連続</div>
        </div>
      </div>
    </div>
  </header>

  <section class="home-grid">
    <article class="boarding card" data-action="settings" role="button" aria-label="試験日を設定">
      <div class="bp-main">
        <div class="bp-top"><span class="bp-airline">✈ EIKEN AIR</span><span class="bp-class">GRADE 3</span></div>
        <div class="bp-route">
          <div><small>FROM</small><b>TODAY</b><span>${new Date().toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}</span></div>
          <div class="bp-path">
            <svg viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true"><path d="M4 30 Q100 -6 196 30" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5 6"/></svg>
            <span class="bp-plane" style="--p:${flight}">✈</span>
          </div>
          <div><small>TO</small><b>PASS</b><span>${target ? target.ja : '試験日を設定'}</span></div>
        </div>
        <div class="bp-info">
          <div><small>PASSENGER</small><b>${esc(st.name || 'GUEST')}</b></div>
          <div><small>SEAT</small><b>Lv.${lv.level}</b></div>
          <div><small>STAMPS</small><b>${Object.keys(s.badges).length}</b></div>
          <div><small>WORDS</small><b>${learned}</b></div>
        </div>
      </div>
      <div class="bp-stub">
        ${target ? `<small>${target.label}</small><b class="bp-days">${target.d}</b><span>DAYS LEFT</span>` : '<small>DEPARTURE</small><b class="bp-days">--</b><span>タップして<br>試験日を設定</span>'}
        <div class="bp-barcode" aria-hidden="true"></div>
      </div>
    </article>

    <article class="card predict-card">
      <h2>合格予測 <small>CSEスコアの目安</small></h2>
      <div class="predict-total">
        ${ring(flightScore != null ? flightScore / 1650 : 0, { size: 118, stroke: 12, color: flightScore >= PASS1 ? 'var(--mint)' : 'var(--coral)', label: flightScore ?? '--', sub: est.total1 != null ? '一次の予測' : '一次の見込み' })}
        <p class="small">${flightScore == null ? '問題を解くと、技能ごとの予測スコアが出ます。' : flightScore >= PASS1 ? `<b class="ok-text">合格ライン（${PASS1}）をこえています！</b>この調子で維持しよう。` : `合格ライン <b>${PASS1}</b> まであと <b>${PASS1 - flightScore}</b>。<br>いちばん低い技能をのばすのが近道！`}</p>
      </div>
      <div class="skills">
        ${bar('r', 'Reading', est.r)}${bar('l', 'Listening', est.l)}${bar('w', 'Writing', est.w)}
        ${bar('s', 'Speaking（二次）', est.s, SKILL_MAX, PASS2)}
      </div>
      <p class="tiny muted">※ 正答率からの換算による目安です。ライティングは2問だけで一次試験の3分の1（550点）をしめます。</p>
    </article>

    <article class="card plan-card">
      <h2>今日のフライトプラン <small>${planDone}/${plan.length} クリア</small></h2>
      <div class="plan-list">
        ${plan.map((p, i) => `
          <button class="plan-item ${p.done >= p.target ? 'done' : ''}" data-action="plan" data-i="${i}">
            <span class="plan-icon">${p.icon}</span>
            <span class="plan-text"><b>${p.label}</b><small>${p.sub}</small></span>
            <span class="plan-count">${p.done >= p.target ? '<span class="check">✓</span>' : `${Math.min(p.done, p.target)}<small>/${p.target}</small>`}</span>
            <i class="plan-prog" style="width:${Math.min(1, p.done / p.target) * 100}%"></i>
          </button>`).join('')}
      </div>
      <button class="btn primary big wide" data-action="auto">✈ おまかせで出発</button>
    </article>

    <article class="card today-card">
      ${ring(today.n / st.dailyGoal, { size: 110, stroke: 12, color: 'var(--sky)', label: `${today.n}<small>/${st.dailyGoal}</small>`, sub: '今日の問題' })}
      <div>
        <h2>今日の記録</h2>
        <ul class="mini-stats">
          <li><b>${today.n ? Math.round((today.c / today.n) * 100) : '--'}<small>%</small></b><span>正答率</span></li>
          <li class="${due ? 'hot' : ''}"><b>${due}</b><span>復習どき</span></li>
          <li><b>${Math.round((today.sec || 0) / 60)}<small>分</small></b><span>学習時間</span></li>
        </ul>
      </div>
    </article>

    <article class="card word-day" data-action="speak-cod">
      <p class="eyebrow">Word of the Day</p>
      <p class="wod-word">${esc(cod.w)} <button class="icon-btn speak" aria-label="発音を聞く">🔊</button></p>
      <p class="wod-mean">${esc(cod.pos)}　${esc(cod.m)}</p>
      <p class="wod-ex">${exampleHTML(cod)}</p>
      <p class="muted small">${esc(cod.ej)}</p>
    </article>

    <article class="card quick-card">
      <h2>ほかのメニュー</h2>
      <div class="quick-grid">
        <button class="quick" data-go="exam"><span>📝</span><b>模擬試験</b><small>本番形式で力試し</small></button>
        <button class="quick" data-go="wordplay" data-params='{"mode":"speed","src":"rank:1"}'><span>⚡</span><b>高速周回</b><small>単語を大量に回す</small></button>
        <button class="quick" data-go="grammar"><span>🧩</span><b>文法レッスン</b><small>3級の文法15項目</small></button>
        <button class="quick" data-go="quiz" data-params='{"part":"weak"}'><span>🎯</span><b>苦手ノート</b><small>まちがえた問題</small></button>
      </div>
    </article>

    ${!standalone && isIOS ? `
    <article class="card install-card">
      <h2>📲 ホーム画面に追加しよう</h2>
      <p class="small">Safari の共有ボタン <b>⎋</b> →「ホーム画面に追加」で、全画面・オフラインで使えるアプリになります。</p>
    </article>` : ''}
  </section>`;

  actions(root, {
    settings: () => { sfx.tap(); go('settings'); },
    poke: (el) => { sfx.pop(); el.firstElementChild?.classList.remove('jump'); void el.offsetWidth; el.firstElementChild?.classList.add('jump'); paperPlane(); },
    plan: (el) => { sfx.select(); const p = plan[+el.dataset.i]; go(...p.to); },
    auto: () => {
      sfx.takeoff();
      const p = plan.find((x) => x.done < x.target) || plan[0];
      go(...p.to);
    },
    'speak-cod': () => say(cod.kind === 'phrase' ? cod.w : `${cod.w}.`),
  });
  root.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
    sfx.select();
    go(b.dataset.go, b.dataset.params ? JSON.parse(b.dataset.params) : {});
  }));
}
