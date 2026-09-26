// ライティング問題（本番の形式にならったオリジナル問題）

// Eメール問題：外国人の友達からのEメールを読み、2つの質問（下線部）に答える返信を書く（15〜25語）
// checks: 答えたかどうかの簡易チェック（正規表現）
export const EMAILS = [
  {
    id: 'em-festival', from: 'Alex',
    body: 'Hi!\nI heard you went to a summer festival last weekend. I have never been to a Japanese summer festival, so I want to know about it. [[What did you eat there?]] And [[who did you go with?]]\nYour friend,\nAlex',
    checks: [
      { label: '何を食べたか', re: '\\b(ate|eat|had|food|takoyaki|yakisoba|ice|candy|cake|ramen|noodles|chicken|fruit|apple|banana)\\b' },
      { label: 'だれと行ったか', re: '\\bwith\\b|\\b(alone|myself)\\b' },
    ],
    model: 'I ate takoyaki and shaved ice there. They were delicious. I went to the festival with my sister and two of my friends.',
    ja: '私はそこでたこ焼きとかき氷を食べました。とてもおいしかったです。姉と友達2人とお祭りに行きました。',
  },
  {
    id: 'em-club', from: 'Emma',
    body: 'Hi!\nThank you for your last e-mail. You said you joined a new club at school. That\'s great! [[What club did you join?]] And [[how often do you practice?]] Please tell me about it.\nBest,\nEmma',
    checks: [
      { label: '何の部か', re: '\\b(club|team|band)\\b' },
      { label: '練習の回数', re: '\\b(every|once|twice|times|days?|week|weekends?|mondays?|tuesdays?|wednesdays?|thursdays?|fridays?|saturdays?|sundays?)\\b' },
    ],
    model: 'I joined the brass band. I play the flute. We practice five days a week, from Monday to Friday after school.',
    ja: '私は吹奏楽部に入りました。フルートをふいています。放課後、月曜日から金曜日まで週に5日練習します。',
  },
  {
    id: 'em-kyoto', from: 'Jack',
    body: 'Hi!\nI heard that you visited Kyoto on your school trip. I saw pictures of Kyoto on the Internet, and it looks beautiful. [[What was your favorite place?]] And [[what did you buy there?]]\nTalk soon,\nJack',
    checks: [
      { label: 'いちばん好きな場所', re: '\\b(favorite|liked|best|temple|shrine|castle|garden|kinkakuji|kiyomizu|place)\\b' },
      { label: '何を買ったか', re: '\\b(bought|buy|got)\\b' },
    ],
    model: 'My favorite place was Kinkakuji. The golden temple was very beautiful. I bought some Japanese sweets for my family.',
    ja: 'いちばん好きな場所は金閣寺でした。金色のお寺はとても美しかったです。家族に和菓子を買いました。',
  },
  {
    id: 'em-pet', from: 'Lucy',
    body: 'Hi!\nYou said you have a new pet. I love animals, so I\'m very excited! [[What kind of pet is it?]] And [[what is its name?]] Please send me a picture sometime.\nLove,\nLucy',
    checks: [
      { label: 'どんなペットか', re: '\\b(dog|cat|rabbit|bird|hamster|fish|turtle|puppy|kitten|parrot)\\b' },
      { label: 'ペットの名前', re: '\\b(name|named|call|called)\\b' },
    ],
    model: 'It is a small white dog. Her name is Shiro. She is very cute and likes to play with a ball.',
    ja: '小さな白い犬です。名前はシロです。とてもかわいくて、ボール遊びが好きです。',
  },
  {
    id: 'em-baseball', from: 'Ben',
    body: 'Hi!\nI heard you went to see a professional baseball game last Sunday. I like baseball, too! [[Which team won the game?]] And [[how did you get to the stadium?]]\nSee you,\nBen',
    checks: [
      { label: 'どちらが勝ったか', re: '\\b(won|win|lost|lose)\\b' },
      { label: 'スタジアムへの行き方', re: '\\b(by|train|bus|car|bike|walked|foot|drove|subway)\\b' },
    ],
    model: 'The Tigers won the game. It was very exciting. I went to the stadium by train with my father.',
    ja: 'タイガースが勝ちました。とてもわくわくしました。父と電車でスタジアムに行きました。',
  },
  {
    id: 'em-visit', from: 'Sophie',
    body: 'Hi!\nI have great news. I\'m going to visit Japan next spring with my family! We will stay in your town for two days. [[Where should we go in your town?]] And [[what food should we try?]]\nThanks,\nSophie',
    checks: [
      { label: 'おすすめの場所', re: '\\b(go|visit|park|temple|museum|shrine|castle|mountain|beach|place|lake|river|zoo)\\b' },
      { label: 'おすすめの食べ物', re: '\\b(eat|try|food|ramen|sushi|tempura|udon|soba|takoyaki|okonomiyaki|curry|fish)\\b' },
    ],
    model: 'You should go to the castle in my town. It is very old and beautiful. You should try our local ramen.',
    ja: '私の町のお城に行くといいですよ。とても古くて美しいです。地元のラーメンを食べてみてください。',
  },
  {
    id: 'em-cook', from: 'Mike',
    body: 'Hi!\nYou told me you are learning how to cook. That\'s cool! I can only make sandwiches. [[What did you cook last time?]] And [[who teaches you?]]\nTake care,\nMike',
    checks: [
      { label: '前回作ったもの', re: '\\b(made|cooked|curry|cake|pancakes?|omelets?|rice|soup|pizza|hamburgers?|spaghetti|cookies)\\b' },
      { label: 'だれが教えているか', re: '\\b(mother|father|grandmother|grandfather|sister|brother|teacher|friend|mom|dad|aunt|uncle|myself|videos?)\\b' },
    ],
    model: 'I cooked curry and rice last Sunday. My family liked it. My grandmother teaches me how to cook every weekend.',
    ja: 'この前の日曜日にカレーライスを作りました。家族は気に入ってくれました。毎週末、祖母が料理を教えてくれます。',
  },
  {
    id: 'em-bike', from: 'Olivia',
    body: 'Hi!\nI heard you got a new bike for your birthday. Happy birthday! [[What color is your bike?]] And [[where do you want to go with it?]]\nYour friend,\nOlivia',
    checks: [
      { label: '自転車の色', re: '\\b(red|blue|black|white|green|yellow|silver|pink|gray|grey|orange|purple|brown)\\b' },
      { label: '行きたい場所', re: '\\b(go|ride|visit|to the|lake|park|beach|library|river|mountain)\\b' },
    ],
    model: 'My new bike is blue. I love it. I want to ride it to the big lake near my town with my friends.',
    ja: '新しい自転車は青です。とても気に入っています。友達といっしょに町の近くの大きな湖まで乗って行きたいです。',
  },
  {
    id: 'em-book', from: 'Daniel',
    body: 'Hi!\nYou said you like reading books. I like reading, too. [[What book are you reading now?]] And [[when do you usually read?]]\nBest wishes,\nDaniel',
    checks: [
      { label: '今読んでいる本', re: '\\b(book|reading|story|comic|novel|about)\\b' },
      { label: 'ふだん読む時間', re: '\\b(before|after|every|night|morning|evening|weekends?|train|bed|dinner|school)\\b' },
    ],
    model: 'I am reading a book about a boy and his dog. It is very interesting. I usually read before I go to bed.',
    ja: '男の子とその犬についての本を読んでいます。とてもおもしろいです。たいてい寝る前に読みます。',
  },
  {
    id: 'em-snow', from: 'Grace',
    body: 'Hi!\nI saw the news. It snowed a lot in your town last week! We don\'t have snow here. [[What did you do in the snow?]] And [[do you like winter?]]\nLove,\nGrace',
    checks: [
      { label: '雪の中でしたこと', re: '\\b(made|played|built|snowman|ski|skied|skiing|threw|snowball|walked|sled)\\b' },
      { label: '冬が好きか', re: '\\b(like|love|don\'t|do not|hate)\\b' },
    ],
    model: 'I made a big snowman with my brother. It was fun. Yes, I like winter because I can enjoy skiing.',
    ja: '弟と大きな雪だるまを作りました。楽しかったです。はい、スキーを楽しめるので冬が好きです。',
  },
  {
    id: 'em-beach', from: 'Tom',
    body: 'Hi!\nYou said you went to the beach with your family last Saturday. That sounds fun! [[What did you do at the beach?]] And [[how was the weather?]]\nTalk to you soon,\nTom',
    checks: [
      { label: '浜辺でしたこと', re: '\\b(swam|swim|swimming|played|ate|built|looked|found|took|walked|fished|collected)\\b' },
      { label: '天気', re: '\\b(sunny|hot|cloudy|rainy|windy|warm|nice|good|weather|cold)\\b' },
    ],
    model: 'I swam in the sea and played volleyball with my father. The weather was sunny and very hot.',
    ja: '海で泳いで、父とバレーボールをしました。天気は晴れていて、とても暑かったです。',
  },
  {
    id: 'em-teacher', from: 'Hannah',
    body: 'Hi!\nYou told me you have a new English teacher at your school. [[Where is your teacher from?]] And [[what do you like about the class?]]\nBye for now,\nHannah',
    checks: [
      { label: '先生の出身', re: '\\bfrom\\b' },
      { label: '授業の好きなところ', re: '\\b(like|fun|interesting|games?|songs?|love|enjoy|kind)\\b' },
    ],
    model: 'My new teacher is from Australia. I like the class because we play fun games and sing English songs.',
    ja: '新しい先生はオーストラリア出身です。楽しいゲームをしたり英語の歌を歌ったりするので、授業が好きです。',
  },
];

// 英作文（意見論述）：QUESTION に対して、意見と理由2つを 25〜35語で書く
export const ESSAYS = [
  { id: 'es-weekend', q: 'What do you like to do on weekends?', model: 'I like to play soccer with my friends on weekends. I have two reasons. First, playing soccer is good for my health. Second, I can have a good time with my friends.', ja: '私は週末に友達とサッカーをするのが好きです。理由は2つあります。第一に、サッカーをすることは健康によいです。第二に、友達と楽しい時間を過ごせます。' },
  { id: 'es-season', q: 'Which do you like better, summer or winter?', model: 'I like summer better than winter. First, I can swim in the sea with my family. Second, summer vacation is long, so I can visit my grandparents in Okinawa.', ja: '私は冬より夏のほうが好きです。第一に、家族と海で泳げます。第二に、夏休みは長いので、沖縄の祖父母を訪ねることができます。' },
  { id: 'es-vacation', q: 'Where do you want to go on your next vacation?', model: 'I want to go to Hokkaido on my next vacation. First, I want to see a lot of snow there. Second, I want to eat fresh seafood because it is famous for it.', ja: '次の休みには北海道に行きたいです。第一に、そこでたくさんの雪を見たいです。第二に、北海道は海産物で有名なので、新鮮な海産物を食べたいです。' },
  { id: 'es-favseason', q: 'What is your favorite season?', model: 'My favorite season is spring. I have two reasons. First, the weather is warm and comfortable. Second, I can enjoy looking at beautiful cherry blossoms with my family.', ja: '私の好きな季節は春です。理由は2つあります。第一に、天気が暖かくて過ごしやすいです。第二に、家族と美しい桜を見て楽しめます。' },
  { id: 'es-bookmovie', q: 'Which do you like better, reading books or watching movies?', model: 'I like reading books better. First, I can read books anywhere, for example, on the train. Second, books help me learn many new words, so they are good for my studies.', ja: '私は本を読むほうが好きです。第一に、たとえば電車の中など、どこでも本を読めます。第二に、本はたくさんの新しい言葉を学ぶのに役立つので、勉強によいです。' },
  { id: 'es-future', q: 'What do you want to be in the future?', model: 'I want to be a nurse in the future. First, I like helping people. Second, my aunt is a nurse, and she is always kind to sick people. I want to be like her.', ja: '私は将来看護師になりたいです。第一に、人を助けるのが好きです。第二に、おばが看護師で、いつも病気の人に親切です。私も彼女のようになりたいです。' },
  { id: 'es-restaurant', q: 'Do you like to eat at restaurants?', model: 'Yes, I do. I have two reasons. First, I can eat food that I cannot make at home. Second, eating at restaurants with my family is a special time for me.', ja: 'はい、好きです。理由は2つあります。第一に、家では作れない料理を食べられます。第二に、家族とレストランで食事をすることは私にとって特別な時間です。' },
  { id: 'es-sports', q: 'Which do you like better, playing sports or watching sports?', model: 'I like playing sports better. First, playing sports is good for my health. Second, I can make many friends when I play on a team. It is more exciting than watching.', ja: '私はスポーツをするほうが好きです。第一に、スポーツをすることは健康によいです。第二に、チームでプレーすると友達がたくさんできます。見るよりもわくわくします。' },
  { id: 'es-country', q: 'What country do you want to visit in the future?', model: 'I want to visit Australia in the future. First, I want to see koalas and kangaroos. Second, I want to practice English there because people in Australia speak English.', ja: '将来オーストラリアを訪れたいです。第一に、コアラやカンガルーを見たいです。第二に、オーストラリアの人々は英語を話すので、そこで英語を練習したいです。' },
  { id: 'es-shopping', q: 'Do you like to go shopping?', model: 'Yes, I do. First, I like to look at new clothes and shoes. Second, I often go shopping with my friends, and we enjoy talking together. It is a lot of fun.', ja: 'はい、好きです。第一に、新しい服や靴を見るのが好きです。第二に、よく友達と買い物に行き、いっしょにおしゃべりを楽しみます。とても楽しいです。' },
  { id: 'es-event', q: 'What is your favorite school event?', model: 'My favorite school event is the sports day. First, I love running, so I can enjoy the relay race. Second, all the students in my class work together, and we become good friends.', ja: '私の好きな学校行事は運動会です。第一に、走るのが大好きなのでリレーを楽しめます。第二に、クラスの生徒みんなで協力して、仲良くなれます。' },
  { id: 'es-pets', q: 'Which do you like better, cats or dogs?', model: 'I like dogs better than cats. First, dogs are friendly, and they like to play with people. Second, walking with a dog every day is good exercise for me.', ja: '私はネコより犬のほうが好きです。第一に、犬は人なつっこくて、人と遊ぶのが好きです。第二に、毎日犬と散歩することは私にとってよい運動になります。' },
  { id: 'es-afterschool', q: 'What do you usually do after school?', model: 'I usually practice the piano after school. First, I want to play in a concert next year. Second, playing the piano helps me relax after a busy day at school.', ja: '私はたいてい放課後にピアノを練習します。第一に、来年コンサートで演奏したいです。第二に、ピアノをひくと学校で忙しかった日のあとにリラックスできます。' },
  { id: 'es-study', q: 'Which do you like better, studying at home or studying at the library?', model: 'I like studying at the library better. First, the library is quiet, so I can study hard. Second, there are many books there, and I can use them when I have questions.', ja: '私は図書館で勉強するほうが好きです。第一に、図書館は静かなので一生懸命勉強できます。第二に、そこにはたくさんの本があり、疑問があるときに使えます。' },
  { id: 'es-city', q: 'Do you want to live in a big city in the future?', model: 'No, I don\'t. First, big cities are too crowded and noisy for me. Second, I love nature, so I want to live in a small town near the mountains and the sea.', ja: 'いいえ、住みたくありません。第一に、大都市は私には混雑していてうるさすぎます。第二に、自然が大好きなので、山や海の近くの小さな町に住みたいです。' },
  { id: 'es-subject', q: 'What subject do you like the best at school?', model: 'I like English the best. First, I can talk with people from other countries in English. Second, my English teacher is very kind, and her classes are always fun.', ja: '私は英語がいちばん好きです。第一に、英語で外国の人々と話せます。第二に、英語の先生はとても親切で、授業がいつも楽しいです。' },
  { id: 'es-beachmountain', q: 'Which do you like better, going to the beach or going to the mountains?', model: 'I like going to the mountains better. First, it is cool in the mountains in summer. Second, I like hiking with my family and looking at beautiful views from the top.', ja: '私は山に行くほうが好きです。第一に、夏の山は涼しいです。第二に、家族とハイキングをして、頂上から美しい景色を見るのが好きです。' },
  { id: 'es-friends', q: 'What do you like to do with your friends?', model: 'I like to play video games with my friends. First, it is exciting to play together. Second, we can talk about the games at school the next day, so we become closer friends.', ja: '私は友達とテレビゲームをするのが好きです。第一に、いっしょに遊ぶとわくわくします。第二に、次の日に学校でゲームの話ができるので、もっと仲良くなれます。' },
  { id: 'es-cook', q: 'Do you like to cook?', model: 'Yes, I do. First, I enjoy making dinner for my family on weekends. Second, cooking is a useful skill. When I live alone in the future, I can make healthy meals.', ja: 'はい、好きです。第一に、週末に家族のために夕食を作るのが楽しいです。第二に、料理は役に立つ技術です。将来1人暮らしをするとき、健康的な食事を作れます。' },
  { id: 'es-bustrain', q: 'Which do you like better, taking a bus or taking a train?', model: 'I like taking a train better. First, trains are usually faster than buses. Second, trains are not late because there is no traffic. So I can arrive on time.', ja: '私は電車に乗るほうが好きです。第一に、電車はたいていバスより速いです。第二に、渋滞がないので電車は遅れません。だから時間どおりに着けます。' },
];

// 書き方の「型」（タップで入力欄に入れられる）
export const TEMPLATES = {
  email: [
    ['お礼', 'Thank you for your e-mail.'],
    ['答え1', 'I ~.'],
    ['理由を足す', 'It was ~.'],
    ['答え2', 'Also, I ~.'],
  ],
  essay: [
    ['意見', 'I think ~.'],
    ['好み', 'I like ~ better than ~.'],
    ['前置き', 'I have two reasons.'],
    ['理由1', 'First, ~.'],
    ['理由2', 'Second, ~.'],
    ['まとめ', 'For these reasons, ~.'],
  ],
};
