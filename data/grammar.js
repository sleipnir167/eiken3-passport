// 英検3級で出る文法のミニレッスン
// key は大問1の問題の「grammar:キー」と対応している（レッスンから関連問題を練習できる）
export const GRAMMAR = [
  {
    key: 'perfect', title: '現在完了', icon: '⏳', level: '最重要',
    summary: '〈have / has ＋ 過去分詞〉で「（今までに）～したことがある」「（ずっと）～している」「（もう）～した」を表す。',
    points: [
      { h: '経験：～したことがある', t: 'ever（今までに）・never（一度も～ない）・once（1回）・twice（2回）・before（以前に）といっしょに使うことが多い。', ex: [['Have you ever been to Kyoto?', '京都に行ったことはありますか。'], ['I have never seen a koala.', 'コアラを一度も見たことがありません。']] },
      { h: '継続：ずっと～している', t: 'for ＋ 期間（for three years）、since ＋ 始まった時（since 2020）。How long ～? で期間をたずねる。', ex: [['I have lived here for five years.', '私はここに5年間住んでいます。'], ['How long have you known Ken?', 'ケンとはどのくらい知り合いですか。']] },
      { h: '完了：もう～した・ちょうど～したところ', t: 'just（ちょうど）・already（もう）は肯定文、yet は否定文「まだ」・疑問文「もう」で使う。', ex: [['I have just finished my homework.', 'ちょうど宿題を終えたところです。'], ['Have you eaten lunch yet?', 'もう昼食を食べましたか。']] },
    ],
    tips: ['ago（～前）や yesterday など「過去のある時点」を表す語は現在完了といっしょに使えない（過去形を使う）。', 'have been to ～＝～に行ったことがある。have gone to ～ は「行ってしまった（今はここにいない）」。'],
  },
  {
    key: 'passive', title: '受け身（受動態）', icon: '🔁', level: '最重要',
    summary: '〈be動詞 ＋ 過去分詞〉で「～される」「～されている」を表す。「だれによって」は by ～。',
    points: [
      { h: '基本の形', t: '主語と時制で be動詞（is / are / was / were）を変える。', ex: [['English is spoken in many countries.', '英語は多くの国で話されています。'], ['This temple was built in 1400.', 'このお寺は1400年に建てられました。']] },
      { h: 'by ～（～によって）', t: 'だれがしたのかを言いたいときに by をつける。', ex: [['This book was written by a famous writer.', 'この本は有名な作家によって書かれました。']] },
      { h: 'よく出る不規則な過去分詞', t: 'write → written、speak → spoken、take → taken、make → made、build → built、see → seen、sell → sold、know → known', ex: [['These pictures were taken in Hokkaido.', 'これらの写真は北海道で撮られました。']] },
    ],
    tips: ['be made of（材料）／ be made from（原料）／ be known to（～に知られている）／ be covered with（～でおおわれている）は熟語としても出る。'],
  },
  {
    key: 'compare', title: '比較', icon: '⚖️', level: '最重要',
    summary: '2つを比べるときは比較級（-er / more）＋ than、3つ以上の中でいちばんは the ＋ 最上級（-est / most）。',
    points: [
      { h: '比較級：～より…だ', t: '短い語は -er（tall → taller）、長い語は more（popular → more popular）。', ex: [['Ken is taller than his father.', 'ケンはお父さんより背が高いです。'], ['This book is more interesting than that one.', 'この本はあの本よりおもしろいです。']] },
      { h: '最上級：いちばん…だ', t: 'in ＋ 場所・集団（in my class）、of ＋ 複数（of the three）。', ex: [['Mt. Fuji is the highest mountain in Japan.', '富士山は日本でいちばん高い山です。'], ['This is the most popular song of all.', 'これはすべての中でいちばん人気の歌です。']] },
      { h: 'as ～ as …：…と同じくらい～', t: '否定の not as ～ as … は「…ほど～でない」。', ex: [['My bag is as big as yours.', '私のかばんはあなたのと同じくらい大きいです。'], ['I can\'t run as fast as Mike.', '私はマイクほど速く走れません。']] },
      { h: '好みをたずねる', t: 'Which do you like better, A or B? ／ What do you like the best?', ex: [['Which do you like better, tea or coffee?', '紅茶とコーヒーではどちらが好きですか。']] },
    ],
    tips: ['good / well → better → best、bad → worse → worst、many / much → more → most は不規則。', 'more better のように more と -er を重ねない。'],
  },
  {
    key: 'infinitive', title: '不定詞（to ＋ 動詞の原形）', icon: '➡️', level: '重要',
    summary: '〈to ＋ 動詞の原形〉で「～すること」「～するための」「～するために」などを表す。',
    points: [
      { h: '名詞的用法：～すること', t: 'want to ～（～したい）、like to ～、start to ～、decide to ～、hope to ～', ex: [['I want to be a doctor.', '私は医者になりたいです。']] },
      { h: '形容詞的用法：～するための・～すべき', t: '名詞や something のあとに置く。', ex: [['I have a lot of homework to do.', 'やるべき宿題がたくさんあります。'], ['I want something cold to drink.', '何か冷たい飲み物がほしいです。']] },
      { h: '副詞的用法：～するために・～して', t: '目的「～するために」、感情の原因「～して（うれしい など）」。', ex: [['I went to the library to study.', '勉強するために図書館へ行きました。'], ['I was glad to see you.', 'あなたに会えてうれしかったです。']] },
      { h: 'よく出る形', t: 'It is ～ (for 人) to …（…することは～だ）／ how to ～（～のしかた）／ want 人 to ～ ／ tell 人 to ～ ／ ask 人 to ～', ex: [['It is important to sleep well.', 'よく眠ることは大切です。'], ['My mother told me to clean my room.', '母は私に部屋をそうじするように言いました。']] },
    ],
    tips: ['to のあとは必ず動詞の原形（to plays / to played は×）。', 'enjoy・finish・stop のあとは不定詞ではなく動名詞（～ing）。'],
  },
  {
    key: 'gerund', title: '動名詞（～ing）', icon: '🏃', level: '重要',
    summary: '動詞の ～ing 形で「～すること」を表す。主語・目的語・前置詞のあとに置ける。',
    points: [
      { h: '動名詞だけをとる動詞', t: 'enjoy ～ing（～して楽しむ）・finish ～ing（～し終える）・stop ～ing（～するのをやめる）', ex: [['I enjoyed talking with you.', 'あなたと話せて楽しかったです。'], ['She finished writing her report.', '彼女はレポートを書き終えました。']] },
      { h: '主語になる', t: '「～することは…だ」。三人称単数扱い（is）。', ex: [['Playing soccer is fun.', 'サッカーをすることは楽しいです。']] },
      { h: '前置詞のあと', t: 'be good at ～ing、How about ～ing?、Thank you for ～ing、look forward to ～ing', ex: [['Thank you for helping me.', '手伝ってくれてありがとう。'], ['I\'m looking forward to seeing you.', 'あなたに会えるのを楽しみにしています。']] },
    ],
    tips: ['like・start・begin は不定詞・動名詞のどちらもとれる。', 'stop to ～ は「～するために立ち止まる」で意味がちがう。'],
  },
  {
    key: 'relative', title: '関係代名詞（who / which / that）', icon: '🔗', level: '重要',
    summary: '名詞のあとに〈関係代名詞 ＋ 文〉を置いて、その名詞を説明する。',
    points: [
      { h: '人を説明する who', t: '〈人 ＋ who ＋ 動詞〉＝～する人', ex: [['I have a friend who lives in Canada.', '私にはカナダに住んでいる友達がいます。'], ['The boy who is playing the guitar is Ken.', 'ギターをひいている男の子はケンです。']] },
      { h: '物・動物を説明する which', t: '〈物 ＋ which ＋ 動詞〉〈物 ＋ which ＋ 主語 ＋ 動詞〉', ex: [['This is the bus which goes to the airport.', 'これは空港へ行くバスです。'], ['The cake which my mother made was delicious.', '母が作ったケーキはとてもおいしかったです。']] },
      { h: 'that はどちらにも使える', t: '人にも物にも使える。〈物 ＋ 主語 ＋ 動詞〉のときは省略もできる。', ex: [['This is the book (that) I bought yesterday.', 'これは私が昨日買った本です。']] },
    ],
    tips: ['関係代名詞のあとの動詞は、説明される名詞に合わせる（a friend who lives ／ friends who live）。'],
  },
  {
    key: 'participle', title: '分詞の後置修飾', icon: '🏷️', level: '重要',
    summary: '〈名詞 ＋ ～ing ＋ 語句〉で「～している…」、〈名詞 ＋ 過去分詞 ＋ 語句〉で「～された…」。',
    points: [
      { h: '～ing：～している', t: '1語なら名詞の前（a sleeping baby）、2語以上なら名詞のあと。', ex: [['Look at the boy running in the park.', '公園を走っている男の子を見て。'], ['The man standing over there is my uncle.', '向こうに立っている男の人は私のおじです。']] },
      { h: '過去分詞：～された', t: '受け身の意味。', ex: [['This is a picture painted by my sister.', 'これは姉がかいた（姉によってかかれた）絵です。'], ['I have a car made in Germany.', '私はドイツ製の車を持っています。']] },
    ],
    tips: ['「している」なら ～ing、「される」なら過去分詞、と意味で見分ける。'],
  },
  {
    key: 'indirect', title: '間接疑問', icon: '❓', level: 'おさえたい',
    summary: '疑問文が文の中に入るときは〈疑問詞 ＋ 主語 ＋ 動詞〉の語順になる。',
    points: [
      { h: '語順に注意', t: 'Where does he live? → Do you know where he lives?（does が消えて lives になる）', ex: [['Do you know where he lives?', '彼がどこに住んでいるか知っていますか。'], ['Please tell me what this is.', 'これが何か教えてください。']] },
      { h: 'よく使う形', t: 'I don\'t know ～ ／ Do you know ～? ／ Can you tell me ～?', ex: [['I don\'t know when the bus will come.', 'バスがいつ来るのかわかりません。']] },
    ],
    tips: ['Do you know what time is it? は×。what time it is が○。'],
  },
  {
    key: 'progressive', title: '進行形', icon: '🎬', level: '基本',
    summary: '〈be動詞 ＋ ～ing〉で「（今・そのとき）～している」を表す。',
    points: [
      { h: '現在進行形', t: 'am / is / are ＋ ～ing。now・right now・Look! などといっしょに。', ex: [['Ken is playing tennis now.', 'ケンは今テニスをしています。']] },
      { h: '過去進行形', t: 'was / were ＋ ～ing。「～したとき、…していた」の形でよく出る。', ex: [['I was taking a bath when you called me.', 'あなたが電話してきたとき、私はおふろに入っていました。']] },
      { h: '予定を表す進行形', t: '近い未来の予定も現在進行形で表せる。', ex: [['I\'m visiting my aunt tomorrow.', '明日おばを訪ねる予定です。']] },
    ],
    tips: ['like・know・want など「状態」を表す動詞はふつう進行形にしない。'],
  },
  {
    key: 'modal', title: '助動詞', icon: '🗝️', level: '重要',
    summary: 'can・will・must・should・may・shall などは動詞の前に置き、後ろの動詞は原形。',
    points: [
      { h: '義務・禁止', t: 'must ～（～しなければならない）＝ have to ～。must not ～（～してはいけない）。don\'t have to ～（～する必要はない）。', ex: [['You must not run here.', 'ここで走ってはいけません。'], ['You don\'t have to come tomorrow.', '明日は来る必要はありません。']] },
      { h: 'お願い・申し出・さそい', t: 'Can / Could you ～?（～してくれますか）、Shall I ～?（～しましょうか）、Shall we ～?（～しましょうか）、May I ～?（～してもいいですか）', ex: [['Could you open the window?', '窓を開けていただけますか。'], ['Shall I carry your bag?', 'かばんを持ちましょうか。']] },
      { h: 'すすめ・未来', t: 'should ～（～したほうがいい）、will ～（～するだろう）、be going to ～（～するつもり）', ex: [['You should see a doctor.', '医者に診てもらったほうがいいですよ。']] },
    ],
    tips: ['can の過去・未来は was able to ／ will be able to。', 'Would you like ～?（～はいかがですか）、I\'d like ～（～がほしい）も会話で頻出。'],
  },
  {
    key: 'tag', title: '付加疑問', icon: '↩️', level: 'おさえたい',
    summary: '文の最後につけて「～ですよね」と確認する。肯定文には否定、否定文には肯定の形をつける。',
    points: [
      { h: '作り方', t: 'be動詞・助動詞はそのまま使い、一般動詞は do / does / did を使う。主語は代名詞にする。', ex: [['It\'s hot today, isn\'t it?', '今日は暑いですね。'], ['You like soccer, don\'t you?', 'あなたはサッカーが好きですよね。'], ['Ken can swim, can\'t he?', 'ケンは泳げますよね。']] },
    ],
    tips: ['Let\'s ～, shall we?（～しましょうね）も覚えておこう。'],
  },
  {
    key: 'there', title: 'There is / are', icon: '📍', level: '基本',
    summary: '「（ある場所に）～がある・いる」。後ろの名詞が単数なら is、複数なら are。',
    points: [
      { h: '時制と数', t: 'There is / are（現在）、There was / were（過去）、There will be（未来）', ex: [['There are many parks in this city.', 'この市にはたくさんの公園があります。'], ['There was a big festival last week.', '先週大きなお祭りがありました。']] },
      { h: '数をたずねる', t: 'How many ＋ 複数名詞 ＋ are there ～?', ex: [['How many students are there in your class?', 'あなたのクラスには何人の生徒がいますか。']] },
    ],
    tips: ['面接の No.2・3 で How many ～ are there? と聞かれたら There are three. のように答える。'],
  },
  {
    key: 'pronoun', title: '代名詞', icon: '👤', level: '基本',
    summary: '主格（I）・所有格（my）・目的格（me）・所有代名詞（mine）を使い分ける。',
    points: [
      { h: '変化表', t: 'I-my-me-mine ／ you-your-you-yours ／ he-his-him-his ／ she-her-her-hers ／ we-our-us-ours ／ they-their-them-theirs', ex: [['This bag is mine.', 'このかばんは私のものです。'], ['Please help us.', '私たちを手伝ってください。']] },
      { h: '再帰代名詞', t: 'myself・yourself など。by oneself（ひとりで・自分で）、enjoy oneself（楽しむ）、Help yourself.（ご自由にどうぞ）', ex: [['I made this cake by myself.', 'このケーキを自分で作りました。']] },
    ],
    tips: ['面接の No.1 では、質問の名詞（many people など）を they などの代名詞にかえて答える。'],
  },
  {
    key: 'wh', title: '疑問詞', icon: '🔍', level: '基本',
    summary: 'What・Who・Where・When・Why・How と、How ＋ 形容詞の組み合わせ。',
    points: [
      { h: 'How ＋ 形容詞・副詞', t: 'How many（数）、How much（値段・量）、How long（長さ・期間）、How far（距離）、How often（頻度）、How old（年齢）', ex: [['How often do you play tennis?', 'どのくらいの頻度でテニスをしますか。'], ['How far is it to the station?', '駅までどのくらいの距離ですか。']] },
      { h: 'Why と Because', t: 'Why ～? には Because ～. または To ～.（～するために）で答える。', ex: [['Why did you go to the library? — To study.', 'なぜ図書館へ行ったの？ — 勉強するためです。']] },
    ],
    tips: ['リスニングでは最初の疑問詞を聞き取ることがいちばん大切。'],
  },
  {
    key: 'conj', title: '接続詞', icon: '🧩', level: '重要',
    summary: 'when・if・because・so・but・that などで文と文をつなぐ。',
    points: [
      { h: '時・条件・理由', t: 'when（～するとき）、if（もし～なら）、because（～なので）、before / after（～する前・あと）、until（～するまで）', ex: [['If it rains tomorrow, I will stay home.', 'もし明日雨が降ったら、家にいます。'], ['I was sleeping when you called.', 'あなたが電話したとき、私は眠っていました。']] },
      { h: 'so と because', t: 'A, so B（A だから B）＝ B because A。向きが逆になる。', ex: [['It was cold, so I wore a coat.', '寒かったのでコートを着ました。']] },
      { h: 'that（～ということ）', t: 'think that ～、know that ～、hope that ～。that は省略できる。', ex: [['I think (that) he is right.', '彼は正しいと思います。']] },
    ],
    tips: ['if・when の文の中では、未来のことでも現在形を使う（If it will rain は×）。'],
  },
];
