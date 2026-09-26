// AI への指示文（プロンプト）
//  出力を短く・JSON にして、安いモデルや小さなモデル（Gemma など）でも安定して動くようにしている

const SYS_TEACHER = `あなたは日本の中学生に英語を教える、やさしくて的確な英検対策の先生です。
英検3級（中学卒業程度）の学習者に向けて、日本語でわかりやすく説明します。専門用語は少なめに、具体例を添えてください。
説明は必ず自然な日本語で書きます（中国語の簡体字や、英語だけの説明文を混ぜません）。英語の例文・語句だけは英語で書きます。`;

/** 英作文・Eメールの添削 */
export function gradeWritingPrompt({ kind, prompt, text }) {
  const email = kind === 'email';
  const rubric = email
    ? `【Eメール問題の採点観点（各0〜3点、合計9点）】
- content（内容）：Eメールの2つの質問（下線部）の両方に、具体的に答えているか。返信として自然か。
- vocabulary（語彙）：内容に合った語句を正しく使えているか。つづりは正しいか。
- grammar（文法）：文法的に正しいか。文の形にバリエーションがあるか。
語数の目安は15〜25語（大きく外れると減点の対象）。質問に答えていなければ内容は0点。`
    : `【英作文（意見論述）の採点観点（各0〜4点、合計16点）】
- content（内容）：QUESTIONにきちんと答え、自分の意見と理由を2つ書いているか。理由が意見を支えているか。
- structure（構成）：意見→理由1→理由2 の流れがわかりやすいか。First, / Second, / Also, などのつなぎ言葉を使えているか。
- vocabulary（語彙）：内容に合った語句を正しく使えているか。つづりは正しいか。
- grammar（文法）：文法的に正しいか。文の形にバリエーションがあるか。
語数の目安は25〜35語。QUESTIONに答えていない・関係のない内容の場合は、全観点0点になることがある。`;
  const keys = email ? '"content":0-3,"vocabulary":0-3,"grammar":0-3' : '"content":0-4,"structure":0-4,"vocabulary":0-4,"grammar":0-4';
  return [
    { role: 'system', content: `${SYS_TEACHER}\nあなたは英検3級ライティングの採点者として、公式の観点にそって公平に採点・添削します。` },
    {
      role: 'user',
      content: `次の${email ? 'Eメール問題' : '英作文'}の答案を採点・添削してください。

${rubric}

【問題】
${prompt}

【答案】
${text}

次の JSON だけを出力してください（説明文やコードブロックは不要）。
summary・good・reason・advice は必ず日本語で、中学生にわかる言葉で書くこと（英語で書かない）。
{
 "scores": {${keys}},
 "summary": "総評（2〜3文）",
 "good": ["よかった点（1〜3個）"],
 "corrections": [{"original": "まちがいを含む元の語句", "corrected": "直した語句", "reason": "理由（短く）"}],
 "corrected_text": "答案を最小限だけ直した全文（元の内容をできるだけ生かす）",
 "model_answer": "英検3級レベルの語彙で書いた模範解答（${email ? '15〜25語' : '25〜35語'}）",
 "advice": "次に書くときのアドバイス（1〜2文）"
}
corrections はまちがいが無ければ空配列。最大6個。`,
    },
  ];
}

/** 4択問題の解説 */
export function explainPrompt({ question, choices, answer, chosen, passage }) {
  return [
    { role: 'system', content: SYS_TEACHER },
    {
      role: 'user',
      content: `英検3級の問題です。${chosen != null && chosen !== answer ? `生徒は「${choices[chosen]}」を選んでまちがえました。` : ''}
${passage ? `【本文】\n${passage}\n\n` : ''}【問題】
${question}
【選択肢】
${choices.map((c, i) => `${i + 1}. ${c}`).join('\n')}
【正解】${answer + 1}. ${choices[answer]}

次の形で、全体で350字以内にまとめてください。
■ 正解の理由
■ ほかの選択肢がちがう理由（1つずつ短く）
■ 覚えておきたいポイント（関連する表現や文法）
■ 例文（英文と日本語訳を1つ）`,
    },
  ];
}

/** 解説へのフォローアップ質問 */
export function followupPrompt({ context, question }) {
  return [
    { role: 'system', content: `${SYS_TEACHER}\n回答は200字以内で簡潔に。` },
    { role: 'user', content: `【問題と解説】\n${context}\n\n【生徒の質問】\n${question}` },
  ];
}

/** 面接（二次試験）の採点 */
export function gradeInterviewPrompt({ card, readingRatio, readingText, answers, name }) {
  const qa = answers.map((a, i) => `No.${i + 1}\n質問: ${a.q}\n模範解答の例: ${a.model || '(自由回答)'}\n受験者の答え: ${a.text || '(無回答)'}`).join('\n\n');
  return [
    { role: 'system', content: `${SYS_TEACHER}\nあなたは英検3級の二次試験（面接）の面接官・採点者です。音声認識で書き起こした答えなので、句読点や大文字小文字の誤り、軽い認識ミスは減点しないでください。` },
    {
      role: 'user',
      content: `英検3級の面接練習の結果を採点してください。
【問題カード】
タイトル: ${card.title}
${card.passage}

【音読】原文との一致率（音声認識による目安）: ${Math.round(readingRatio * 100)}%
読み取った音読: ${readingText || '(なし)'}

【質疑応答】
${qa}

【採点の基準】
- reading（音読）0〜5点：意味のまとまりに注意して、正しい発音で読めているか（一致率を参考に）
- 各質問 0〜5点：質問に正しく答えているか。主語と動詞のある文で答えているか（単語だけは減点）。No.1 は代名詞に置き換えて答えているか。No.5 は Yes/No だけでなく2文目で詳しく言えているか
- アティチュードはここでは採点しない

次の JSON だけを出力してください。comment・summary・tips は必ず日本語で書くこと（better だけは英文）。
{
 "reading": {"score": 0-5, "comment": "音読へのコメント（短く）"},
 "answers": [{"no": 1, "score": 0-5, "comment": "短いコメント", "better": "よりよい答えの例（英文）"}],
 "summary": "全体の総評（2〜3文）",
 "tips": ["次に向けたアドバイス（2〜3個）"]
}`,
    },
  ];
}

/** 新しい問題を作る（大問1形式） */
export function generateQuizPrompt({ words, grammar, count = 5 }) {
  return [
    { role: 'system', content: 'You are an expert item writer for the Japanese EIKEN Grade 3 test (junior-high-school graduate level, CEFR A1-A2). You write natural, correct English.' },
    {
      role: 'user',
      content: `Write ${count} original multiple-choice questions in the style of EIKEN Grade 3, Part 1 (短文の語句空所補充).
Each question is one sentence or a short A/B dialogue with one blank written as "( )". Give 4 choices of the same part of speech; exactly one is correct.
${words?.length ? `Target words/phrases (use them as the correct answers): ${words.join(', ')}` : ''}
${grammar ? `Target grammar: ${grammar}` : ''}
Use only vocabulary appropriate for EIKEN Grade 3.
Output ONLY a JSON array like:
[{"q":"A: ... B: ... ( ) ...","c":["...","...","...","..."],"a":0,"x":"日本語の短い解説（正解の理由とポイント）","j":"問題文の日本語訳"}]
"a" is the 0-based index of the correct choice. Vary the position of the correct answer.`,
    },
  ];
}

/** 自由英会話（面接の No.4・5 形式の追加質問を作る） */
export function personalQuestionPrompt({ topics = [] }) {
  return [
    { role: 'system', content: 'You are an EIKEN Grade 3 interviewer.' },
    {
      role: 'user',
      content: `Make 5 new interview questions in the style of EIKEN Grade 3 No.4 (a Wh- question about the examinee) and No.5 (a Yes/No question with follow-ups).
${topics.length ? `Topics: ${topics.join(', ')}` : ''}
Output ONLY JSON: [{"q":"...","type":"wh","model":"sample answer"},{"q":"Do you ...?","type":"yn","yes":"Please tell me more.","no":"Why not?","model":"Yes, I do. I ..."}]`,
    },
  ];
}
