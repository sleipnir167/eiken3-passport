// 英作文の自動チェック（AIを使わない・端末内で完結・無料）
//  語数・形式・よくあるまちがいをチェックし、採点の目安を出す

/** 英検の数え方にならった語数（カンマ・ピリオドは数えない、短縮形は1語） */
export function countWords(text) {
  return (String(text).match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) || []).length;
}

export const RANGE = { email: [15, 25], essay: [25, 35] };

const DAYS = 'Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday';
const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
const NOT_AUX = "(?<!\\b(?:does|did|can|will|could|would|should|may|must|might|doesn't|didn't|don't|won't|can't|cannot|to|let|make|help|and|or|does not|did not)\\s)";

// 三人称単数の s 忘れ（does / can などのあとは除く）。後読みに対応していない古い Safari では簡易版にする
function thirdPerson() {
  const verbs = '(like|want|go|play|have|live|study|watch|read|eat|come|get|make|know|think|need|help|teach|swim|run|walk|talk|say)';
  try { return new RegExp(`${NOT_AUX}\\b(he|she) ${verbs}\\b`, 'gi'); }
  catch { return new RegExp(`(?:^|[.!?]\\s+)(he|she) ${verbs}\\b`, 'gi'); }
}

// [正規表現, メッセージ]
const RULES = [
  [/\bI am agree\b|\bI'm agree\b/gi, 'agree は動詞なので be動詞は不要（I agree）'],
  [/\b(am|is|are|was|were) (like|likes|want|wants|play|plays|go|goes|have|has|think|live|lives|enjoy|study|studies)\b/gi, 'be動詞と一般動詞をいっしょに使っていない？（I am like → I like）'],
  [/\benjoy(s|ed)? to \w+/gi, 'enjoy のあとは ～ing（enjoy playing）'],
  [/\b(finish|finished|stop|stopped) to \w+/gi, 'finish / stop のあとは ～ing（finish doing）'],
  [/\b(want|wants|wanted|would like|hope|hopes|decided) to \w+ing\b/gi, 'to のあとは動詞の原形（want to play）'],
  [/\b(didn't|don't|doesn't|did not|does not|do not) (went|came|saw|ate|had|made|took|got|bought|played|visited|watched|studied|liked|goes|plays|likes|has)\b/gi, "don't / didn't のあとは動詞の原形"],
  [/\b(can|will|must|should|could|would|may) (went|came|saw|ate|played|goes|plays|likes|has|visited|watched|was|is|are)\b/gi, '助動詞（can / will など）のあとは動詞の原形'],
  [/\bmore (better|faster|bigger|easier|happier|larger|smaller|older|younger|longer|higher|cheaper)\b/gi, '比較級に more は不要（more better → better）'],
  [/\bmost (best|biggest|fastest|easiest|happiest|largest|smallest|oldest|youngest)\b/gi, '最上級に most は不要（the best）'],
  [/\bgo(es)? to (shopping|swimming|fishing|camping|skiing|hiking|skating)\b/gi, 'go ～ing に to は不要（go shopping）'],
  [/\b(go|goes|went|come|came|get|got) to (home|abroad|there|here|downtown)\b/gi, 'home / abroad / there の前に to は不要（go home）'],
  [/\b(homeworks|informations|furnitures|advices|moneys|breads|waters)\b/gi, '数えられない名詞に s はつけない（homework）'],
  [/\bpeoples\b/gi, 'people はそれだけで複数（people）'],
  [/\bevery (days|weeks|years|mornings|weekends|nights|months)\b/gi, 'every のあとは単数（every day）'],
  [new RegExp(`\\b(at|in) (${DAYS})s?\\b`, 'gi'), '曜日の前は on（on Sunday）'],
  [new RegExp(`\\b(on|at) (${MONTHS}|summer|winter|spring|fall|autumn)\\b`, 'gi'), '月・季節の前は in（in summer）'],
  [/\bin (the )?weekends?\b/gi, '「週末に」は on weekends / on the weekend'],
  [/\bvery like\b/gi, '「とても好き」は like ～ very much'],
  [/\b(two|three|many|some) reason\b/gi, 'reason を複数形に（two reasons）'],
  [/\bplay the (soccer|baseball|tennis|basketball|volleyball|badminton|football|golf)\b/gi, 'スポーツの前に the は不要（play soccer）'],
  [/\bplay (piano|guitar|violin|drums|flute|trumpet)\b/gi, '楽器の前には the（play the piano）'],
  [/\bvisit(s|ed)? to\b/gi, 'visit のあとに to は不要（visit Kyoto）'],
  [/\bdiscuss(es|ed)? about\b/gi, 'discuss に about は不要'],
  [/\blisten(s|ed)? (music|the radio|songs?)\b/gi, '「～を聞く」は listen to ～'],
  [/\barrive(s|d)? to\b/gi, 'arrive のあとは at / in（arrive at the station）'],
  [/\bI (has|likes|wants|goes|plays|lives|is|was not|studies|watches)\b/g, 'I のあとの動詞に s はつけない（I like）'],
  [/\b(they|we|you) (has|likes|wants|goes|plays|lives|is|was)\b/gi, '主語が複数（you）なら動詞に s はつけない・be動詞は are / were'],
  [/\b(he|she|it) (are|were|have)\b/gi, 'he / she / it なら is / was / has'],
  [thirdPerson(), '三人称単数の s を忘れていない？（he likes）'],
  [/\bthere is (many|two|three|four|five|a lot of|some) \w+s\b/gi, '複数のものなら there are'],
  [/\ba (apple|egg|orange|hour|interesting|old|important|idea|umbrella|elephant|animal|actor|artist|easy|exciting|excellent|English|e-mail|email)\b/gi, '母音で始まる語の前は an（an apple）'],
  [/\b(im|dont|cant|didnt|doesnt|isnt|arent|ive|youre|theyre|thats|whats)\b/gi, "アポストロフィ（'）を忘れていない？（I'm / don't）"],
  [/\bin my opinion,? I think\b/gi, 'In my opinion と I think はどちらか一方でOK'],
  [/\bso so\b/gi, '「まあまあ」は会話の表現。作文では避けよう'],
  [/[.!?,](?=[A-Za-z])/g, '句読点（. , ! ?）のあとはスペースを空けよう'],
  [/\bi\b/g, '「私」は大文字の I'],
  [/\bbecause of I\b|\bbecause of (he|she|they|we)\b/gi, 'because of のあとは名詞。文をつなぐなら because'],
];

export function splitSentences(text) {
  return String(text).replace(/\s+/g, ' ').trim().replace(/([.!?])\s+/g, '$1\n').split('\n').filter(Boolean);
}

/**
 * 答案をチェック
 * @returns { words, range, items: [{ state: 'ok'|'warn'|'ng', label }], errors: [{ text, index, msg }], estimate: { scores, total, max } }
 */
export function checkWriting(text, { kind = 'essay', checks = [] } = {}) {
  const t = String(text || '');
  const words = countWords(t);
  const [lo, hi] = RANGE[kind];
  const items = [];
  const sentences = splitSentences(t);

  // 語数
  items.push({
    state: words >= lo && words <= hi ? 'ok' : words >= lo - 4 && words <= hi + 5 ? 'warn' : 'ng',
    label: `語数 ${words} 語（目安 ${lo}〜${hi} 語）`,
  });
  // 日本語
  if (/[぀-ヿ㐀-鿿]/.test(t)) items.push({ state: 'ng', label: '日本語が入っています（すべて英語で書こう）' });
  // 大文字・文末
  const noCap = sentences.filter((s) => /^[a-z]/.test(s));
  const noEnd = /[.!?]["”']?\s*$/.test(t.trim()) || !t.trim();
  items.push({ state: noCap.length ? 'warn' : 'ok', label: noCap.length ? `文の最初が小文字の文があります（${noCap.length}か所）` : '文の最初は大文字' });
  items.push({ state: noEnd ? 'ok' : 'warn', label: noEnd ? '文の終わりにピリオド' : '最後の文にピリオド（.）をつけよう' });

  let opinion = true, reasons = 2, markers = 0;
  if (kind === 'essay') {
    opinion = /\b(I think|I like|I want|I would like|I'd like|my favorite|I prefer|I believe|I agree|I disagree|I don't think|I do not think|I love|I'd rather|is better|are better)\b/i.test(sentences[0] || '');
    items.push({ state: opinion ? 'ok' : 'warn', label: opinion ? '最初の文で意見を書いている' : '最初の文で、自分の意見をはっきり書こう（I think ～ / I like ～）' });
    markers = (t.match(/\b(first|second|also|another|third|besides|finally)\b/gi) || []).length;
    const because = (t.match(/\bbecause\b/gi) || []).length;
    reasons = Math.min(2, markers + (markers ? 0 : because));
    items.push({ state: reasons >= 2 ? 'ok' : reasons === 1 ? 'warn' : 'ng', label: reasons >= 2 ? '理由を2つ書いている（First, / Second, など）' : '理由を2つ書こう（First, ～. Second, ～.）' });
    const frag = sentences.filter((s) => /^Because\b/i.test(s) && !/,/.test(s));
    if (frag.length) items.push({ state: 'warn', label: '「Because ～.」だけの文は不完全。前の文とつなげよう' });
  }
  let answered = checks.length;
  if (kind === 'email') {
    for (const c of checks) {
      const ok = new RegExp(c.re, 'i').test(t);
      if (!ok) answered--;
      items.push({ state: ok ? 'ok' : 'warn', label: ok ? `${c.label}：答えている` : `${c.label}：答えているか確認しよう` });
    }
    if (/^\s*(hi|hello|dear)\b/i.test(t)) items.push({ state: 'warn', label: 'あいさつ（Hi, ～!）と結び（Best wishes,）は解答用紙に印刷済み。本文だけ書けばOK' });
  }

  // よくあるまちがい
  const errors = [];
  for (const [re, msg] of RULES) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(t))) {
      errors.push({ text: m[0], index: m.index, msg });
      if (!re.global) break;
    }
  }
  errors.sort((a, b) => a.index - b.index);

  // 採点の目安
  const inRange = words >= lo - 3 && words <= hi + 5;
  const g = errors.length;
  let scores, max;
  if (kind === 'email') {
    max = 9;
    const content = Math.max(0, 3 - (checks.length - answered) - (inRange ? 0 : 1) - (words < 8 ? 2 : 0));
    scores = { content, vocabulary: words < 10 ? 1 : words < lo ? 2 : 3, grammar: Math.max(0, 3 - Math.min(3, Math.ceil(g / 1.5))) };
  } else {
    max = 16;
    const content = Math.max(0, 4 - (opinion ? 0 : 2) - (2 - reasons) - (inRange ? 0 : 1));
    const structure = markers >= 2 ? 4 : markers === 1 ? 3 : reasons ? 2 : 1;
    scores = { content, structure, vocabulary: words < 15 ? 1 : words < lo ? 2 : 3, grammar: Math.max(0, 4 - Math.min(4, Math.ceil(g / 1.5))) };
  }
  if (!words) Object.keys(scores).forEach((k) => { scores[k] = 0; });
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  return { words, range: [lo, hi], items, errors, estimate: { scores, total, max } };
}

export const SCORE_LABEL = { content: '内容', structure: '構成', vocabulary: '語彙', grammar: '文法' };
