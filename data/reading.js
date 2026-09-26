// 筆記（リーディング）問題：本番の形式にならったオリジナル問題（過去問の転載ではありません）
// 選択肢は「正解を先頭」に書き、画面に出すときにシャッフルする

// 大問1：短文の語句空所補充
// 問題文|正解 / 誤答 / 誤答 / 誤答|分野（noun verb adj adv idiom grammar:文法キー）|解説|訳
export const PART1_RAW = String.raw`
My sister wants to be a ( ) because she likes to take care of sick people.|nurse / pilot / singer / writer|noun|「病気の人の世話をするのが好き」なので nurse（看護師）。pilot＝パイロット、singer＝歌手、writer＝作家。|姉は病気の人の世話をするのが好きなので、看護師になりたいと思っています。
A: Excuse me. Is there a ( ) near here? B: Yes. You can buy stamps there.|post office / library / hospital / stadium|noun|「切手（stamps）が買える」のは post office（郵便局）。|A: すみません。この近くに郵便局はありますか。B: はい。そこで切手を買えますよ。
We visited an old ( ) in Kyoto. It was built about 1,200 years ago.|temple / airport / stadium / factory|noun|1,200年前に建てられた古い建物なので temple（寺）。|私たちは京都の古い寺を訪れました。それは約1,200年前に建てられました。
I forgot my ( ), so I couldn't buy anything at the store.|wallet / umbrella / dictionary / uniform|noun|「何も買えなかった」の理由は wallet（財布）を忘れたから。|財布を忘れたので、店で何も買えませんでした。
A: What's your favorite ( ), Emi? B: I like science. I want to be a scientist.|subject / season / sport / animal|noun|science（理科）と答えているので subject（教科）。|A: エミ、好きな教科は何？ B: 理科が好き。科学者になりたいの。
There were many ( ) at the stadium. They were cheering for their team.|fans / cooks / pilots / nurses|noun|チームを応援していたのは fans（ファン）。cheer for ～＝～を応援する。|スタジアムにはたくさんのファンがいました。彼らは自分たちのチームを応援していました。
Mr. Brown told us about the ( ) of the town. It was very interesting.|history / weather / traffic / money|noun|「町の～について話してくれた。とてもおもしろかった」→ history（歴史）が自然。|ブラウン先生は私たちに町の歴史について話してくれました。とてもおもしろかったです。
Please be quiet in the ( ). Many people are reading books there.|library / gym / kitchen / stadium|noun|本を読んでいる人が多い静かな場所は library（図書館）。|図書館では静かにしてください。たくさんの人が本を読んでいます。
A: How is the ( ) in Sapporo today? B: It's snowing, and it's very cold.|weather / season / world / temperature|noun|「雪が降っていてとても寒い」と答えているので weather（天気）。How is the weather? は天気をたずねる決まった言い方。|A: 今日の札幌の天気はどうですか。B: 雪が降っていて、とても寒いです。
I have a ( ). I think I ate too much.|stomachache / headache / cold / fever|noun|「食べすぎた」ので stomachache（腹痛）。headache＝頭痛、fever＝熱。|おなかが痛いです。食べすぎたんだと思います。
A: How was your ( ) to Hokkaido? B: It was great. I saw a lot of snow.|trip / job / lesson / hobby|noun|「北海道への～はどうだった？」→ trip（旅行）。trip to ～＝～への旅行。|A: 北海道旅行はどうだった？ B: 最高だったよ。雪をたくさん見たよ。
The ( ) of this T-shirt is 1,500 yen.|price / size / color / shape|noun|1,500円は price（値段）。|このTシャツの値段は1,500円です。
Kenji won first ( ) in the speech contest.|prize / idea / example / problem|noun|win first prize＝1等賞を取る。|ケンジはスピーチコンテストで1等賞を取りました。
My brother is studying about the ( ). He wants to protect nature.|environment / business / furniture / traffic|noun|「自然を守りたい」→ environment（環境）について勉強している。|兄は環境について勉強しています。彼は自然を守りたいと思っています。
I got a lot of ( ) about the museum on its website.|information / weather / furniture / medicine|noun|ウェブサイトで得たのは information（情報）。information は数えられない名詞。|博物館のウェブサイトでたくさんの情報を得ました。
Many ( ) visit Kyoto every year to see the old temples.|tourists / players / doctors / farmers|noun|古い寺を見に京都を訪れるのは tourists（観光客）。|毎年多くの観光客が古い寺を見に京都を訪れます。
A: Can I take your ( )? B: Yes. I'd like a hamburger and orange juice.|order / seat / money / table|noun|レストランで Can I take your order?＝ご注文をうかがいます。|A: ご注文をおうかがいしましょうか。B: はい。ハンバーガーとオレンジジュースをください。
Be careful when you cross the ( ). There are many cars.|road / roof / pool / forest|noun|「車がたくさんある」→ road（道路）を渡るとき。|道路を渡るときは気をつけて。車がたくさん走っています。
The ( ) of Japan is about 125 million.|population / environment / community / temperature|noun|約1億2500万は日本の population（人口）。|日本の人口は約1億2500万人です。
A: Do you have any ( ) for the weekend? B: Yes. I'm going to go camping with my family.|plans / dreams / reasons / examples|noun|「週末に何か予定はある？」→ plans（予定）。|A: 週末の予定は何かある？ B: うん。家族とキャンプに行くんだ。
Can I ( ) your pen? I forgot mine.|borrow / lend / sell / carry|verb|borrow＝（無料で）借りる。lend＝貸す。自分のペンを忘れたので「借りる」。|ペンを借りてもいい？自分のを忘れちゃったんだ。
Could you ( ) me your dictionary? I left mine at home.|lend / borrow / return / catch|verb|lend 人 物＝人に物を貸す。相手に「貸してくれますか」とたのむ場面。|辞書を貸していただけますか。自分のを家に置いてきてしまいました。
Please ( ) this book to the library by Friday.|return / arrive / hear / wear|verb|return A to B＝AをBに返す。|この本を金曜日までに図書館に返してください。
It started to rain, so we ( ) to stay home.|decided / enjoyed / finished / arrived|verb|decide to ～＝～することに決める。enjoy・finish のあとは ～ing。|雨が降り始めたので、私たちは家にいることにしました。
My father ( ) a new house last year.|built / broke / cried / lost|verb|build（建てる）の過去形 built。|父は去年新しい家を建てました。
A: What does this word ( )? B: It means "happy."|mean / say / tell / speak|verb|What does ～ mean?＝～はどういう意味ですか。|A: この単語はどういう意味ですか。B: 「幸せな」という意味です。
I ( ) my umbrella on the train. I have to buy a new one.|left / kept / found / brought|verb|leave（置き忘れる）の過去形 left。新しいのを買わないといけないので「置き忘れた」。|電車にかさを置き忘れました。新しいのを買わなければなりません。
We ( ) Christmas with our family every year.|celebrate / invite / explain / receive|verb|celebrate＝祝う。|私たちは毎年家族でクリスマスを祝います。
The school will ( ) a sports day next month.|hold / catch / build / fix|verb|hold＝（行事を）開催する。|学校は来月運動会を開催します。
I'm going to ( ) at my grandmother's house for three days.|stay / visit / arrive / leave|verb|stay at ～＝～に滞在する。visit は後ろに at が不要（visit my grandmother）。|祖母の家に3日間泊まる予定です。
My mother ( ) me to clean my room.|told / said / spoke / talked|verb|tell 人 to ～＝人に～するように言う。say・speak・talk はこの形をとらない。|母は私に部屋をそうじするように言いました。
A: Did you ( ) the letter from Mike? B: Yes, I got it yesterday.|receive / send / write / carry|verb|「昨日受け取った」と答えているので receive（受け取る）。|A: マイクからの手紙を受け取った？ B: うん、昨日届いたよ。
Don't ( ) to bring your lunch tomorrow.|forget / believe / collect / decide|verb|Don't forget to ～＝～するのを忘れないで。|明日お弁当を持ってくるのを忘れないでね。
Paul ( ) a lot of money on video games.|spends / costs / takes / keeps|verb|spend お金 on ～＝～にお金を使う。|ポールはテレビゲームにたくさんのお金を使います。
How long does it ( ) to get to the station by bus?|take / cost / spend / need|verb|It takes 時間 to ～＝～するのに（時間が）かかる。|駅までバスでどのくらい時間がかかりますか。
This bag ( ) 5,000 yen. It's too expensive for me.|costs / pays / spends / sells|verb|物 cost(s) 金額＝（物が）～の値段である。|このかばんは5,000円します。私には高すぎます。
Tom's dream is to ( ) around the world by ship.|travel / arrive / return / lose|verb|travel around the world＝世界中を旅行する。|トムの夢は船で世界中を旅することです。
I ( ) that you will like this movie.|hope / hear / happen / hurry|verb|I hope that ～＝～だといいなと思う。|あなたがこの映画を気に入るといいなと思います。
Jim ( ) up at six every morning and walks his dog.|wakes / sits / looks / turns|verb|wake up＝目を覚ます。|ジムは毎朝6時に目を覚まし、犬を散歩させます。
Could you ( ) me the salt, please?|pass / put / wear / carry|verb|pass 人 物＝人に物を手渡す。食卓でよく使う表現。|塩を取っていただけますか。
We should ( ) paper and plastic bottles.|recycle / relax / repeat / reserve|verb|recycle＝リサイクルする。|私たちは紙とペットボトルをリサイクルすべきです。
I want to ( ) a table for four people at seven.|reserve / serve / protect / solve|verb|reserve＝予約する。|7時に4人分の席を予約したいのですが。
Let me ( ) my friend, Kate. She is from Australia.|introduce / invite / explain / imagine|verb|introduce＝紹介する。Let me introduce ～＝～を紹介させてください。|友達のケイトを紹介させてください。彼女はオーストラリア出身です。
Our team practiced hard, but we ( ) the game.|lost / won / made / held|verb|but（しかし）があるので「一生懸命練習したが、負けた」。lose の過去形 lost。|私たちのチームは一生懸命練習しましたが、試合に負けました。
I can't ( ) this math problem. Can you help me?|solve / sell / save / send|verb|solve＝（問題を）解く。|この数学の問題が解けません。手伝ってくれる？
Please ( ) the door when you leave the house.|lock / knock / kick / cook|verb|lock＝かぎをかける。|家を出るときはドアにかぎをかけてください。
Emma ( ) her birthday cake with her friends.|shared / spoke / sold / sent|verb|share A with B＝AをBと分け合う。|エマは誕生日ケーキを友達と分け合いました。
My grandfather ( ) vegetables in his garden.|grows / flies / cries / wins|verb|grow＝育てる。|祖父は庭で野菜を育てています。
The children ( ) a big snowman in the park.|made / took / gave / said|verb|make（作る）の過去形 made。|子どもたちは公園で大きな雪だるまを作りました。
The train was very ( ), so I couldn't sit down.|crowded / empty / quiet / comfortable|adj|「座れなかった」→ crowded（混雑した）。|電車がとても混んでいたので、座れませんでした。
This question is too ( ) for me. I can't answer it.|difficult / easy / useful / famous|adj|「答えられない」→ difficult（難しい）。too ～ for 人＝人には～すぎる。|この問題は私には難しすぎます。答えられません。
This dictionary is very ( ). You should buy it.|useful / sick / angry / sleepy|adj|「買うべきだよ」→ useful（役に立つ）。|この辞書はとても役に立ちます。買ったほうがいいですよ。
A: Are you ( ) this Saturday? B: Yes. Let's go shopping.|free / hungry / careful / sorry|adj|free＝ひまな。「土曜日ひま？」「うん、買い物に行こう」。|A: 今度の土曜日はひま？ B: うん。買い物に行こう。
I'm ( ). Can I have something to drink?|thirsty / sleepy / quiet / lucky|adj|「何か飲み物をもらえる？」→ thirsty（のどがかわいた）。|のどがかわきました。何か飲み物をもらえますか。
Kyoto is ( ) for its old temples and shrines.|famous / different / full / afraid|adj|be famous for ～＝～で有名である。|京都は古い寺や神社で有名です。
Please be ( ). The baby is sleeping.|quiet / loud / busy / fast|adj|赤ちゃんが寝ているので quiet（静かな）に。|静かにしてください。赤ちゃんが眠っています。
It's ( ) to swim in this river. The water moves very fast.|dangerous / delicious / friendly / popular|adj|流れが速いので dangerous（危険な）。|この川で泳ぐのは危険です。流れがとても速いです。
Be ( ) when you use a knife.|careful / surprised / excited / tired|adj|Be careful＝気をつけて。|ナイフを使うときは気をつけて。
This watch is too ( ). I can't buy it.|expensive / cheap / light / clean|adj|「買えない」→ expensive（高価な）。|この腕時計は高すぎます。買えません。
I was ( ) at the news. I didn't know that.|surprised / tired / hungry / careful|adj|be surprised at ～＝～に驚く。|その知らせに驚きました。そのことを知らなかったので。
My grandmother is 90 years old, but she is still very ( ).|healthy / sick / sad / hungry|adj|but（しかし）の後なので「90歳だがまだとても健康だ」。|祖母は90歳ですが、まだとても元気です。
The movie was so ( ) that I fell asleep.|boring / exciting / interesting / funny|adj|「眠ってしまった」→ boring（退屈な）。so ～ that …＝とても～なので…。|映画がとても退屈だったので、私は眠ってしまいました。
This soup is ( ). Can I have some more?|delicious / terrible / dirty / expensive|adj|「もっともらえる？」→ delicious（とてもおいしい）。|このスープはとてもおいしいです。もう少しもらえますか。
Mr. Tanaka is very ( ). He always helps us.|kind / angry / sick / lonely|adj|「いつも助けてくれる」→ kind（親切な）。|田中さんはとても親切です。いつも私たちを助けてくれます。
I'm ( ) about my test tomorrow. I didn't study enough.|worried / glad / proud / excited|adj|「十分に勉強しなかった」→ worried（心配して）。be worried about ～。|明日のテストが心配です。十分に勉強しなかったので。
Ken got a new bike for his birthday. He was very ( ).|glad / sorry / afraid / tired|adj|誕生日に新しい自転車をもらって glad（うれしい）。|ケンは誕生日に新しい自転車をもらいました。彼はとても喜びました。
The shop is ( ) on Mondays, so we can't go there today.|closed / open / free / full|adj|「今日は行けない」→ 月曜日は closed（閉まっている）。|その店は月曜日が休みなので、今日は行けません。
The park is ( ) to my house, so I often go there.|close / far / next / late|adj|close to ～＝～に近い。far は far from ～ の形。|公園は家から近いので、よく行きます。
It's getting ( ). Let's go home.|dark / bright / early / light|adj|get dark＝暗くなる。「家に帰ろう」につながる。|暗くなってきました。家に帰りましょう。
I'm very ( ) because I studied until two last night.|sleepy / careful / friendly / thirsty|adj|2時まで勉強したので sleepy（眠い）。|昨夜2時まで勉強したので、とても眠いです。
This T-shirt is too ( ). Do you have a smaller one?|large / small / cheap / short|adj|「もっと小さいのはありますか」→ large（大きい）すぎる。|このTシャツは大きすぎます。もっと小さいのはありますか。
Mika was ( ) before her piano concert, but she played very well.|nervous / hungry / lucky / sleepy|adj|本番前の気持ち＝nervous（緊張して）。but の後の「上手にひけた」と対比。|ミカはピアノの発表会の前は緊張していましたが、とても上手にひきました。
I have ( ) finished my homework, so I can play now.|already / yet / ever / still|adv|現在完了の肯定文で「もう～した」は already。yet は否定文・疑問文で使う。|もう宿題を終えたので、今から遊べます。
Have you ( ) been to Hokkaido?|ever / yet / ago / soon|adv|Have you ever been to ～?＝～に行ったことがありますか（経験）。|北海道に行ったことはありますか。
I haven't finished my report ( ).|yet / already / ever / still|adv|否定文の最後の yet＝まだ（～していない）。|まだレポートを終えていません。
My family moved to Tokyo three years ( ).|ago / since / during / until|adv|～ ago＝～前に（過去形とともに）。|私の家族は3年前に東京に引っ越しました。
I ( ) go to the library on Saturdays. I love reading.|usually / never / once / ago|adv|読書が大好きなので usually（たいてい）行く。|私は土曜日はたいてい図書館に行きます。読書が大好きなんです。
Hurry up. The bus will come ( ).|soon / ago / yet / ever|adv|soon＝まもなく。|急いで。バスはもうすぐ来るよ。
I lost my key. I looked ( ) for it, but I couldn't find it.|everywhere / anywhere / nowhere / somewhere|adv|肯定文で「あらゆる所を」は everywhere。anywhere は否定文・疑問文でよく使う。|かぎをなくしました。あちこちさがしましたが、見つかりませんでした。
It started raining this morning, and it's ( ) raining now.|still / yet / already / ago|adv|still＝まだ（ずっと続いている）。|今朝雨が降り始めて、今もまだ降っています。
We walked for five hours and ( ) got to the top of the mountain.|finally / suddenly / early / once|adv|5時間歩いて「ついに」頂上に着いた→ finally。|私たちは5時間歩いて、ついに山頂に着きました。
I go swimming ( ) a week, on Tuesdays and Fridays.|twice / once / never / ever|adv|火曜と金曜の2回＝twice a week（週2回）。|私は週に2回、火曜日と金曜日に泳ぎに行きます。
( ), it started to rain, and we got wet.|Suddenly / Usually / Always / Already|adv|Suddenly＝突然。|突然雨が降り出して、私たちはぬれてしまいました。
I want to study ( ) in the future, maybe in America.|abroad / outside / away / together|adv|study abroad＝留学する。abroad の前に to や in はつけない。|将来は留学したいです。たぶんアメリカで。
My brother is good ( ) playing baseball.|at / in / on / for|idiom|be good at ～＝～が得意である。前置詞の後なので playing（動名詞）。|兄は野球をするのが得意です。
I'm interested ( ) Japanese history.|in / at / on / with|idiom|be interested in ～＝～に興味がある。|私は日本の歴史に興味があります。
This town is famous ( ) its beautiful beaches.|for / at / to / of|idiom|be famous for ～＝～で有名である。|この町は美しい浜辺で有名です。
Please take care ( ) my dog while I'm away.|of / for / with / to|idiom|take care of ～＝～の世話をする。|私がいない間、犬の世話をしてください。
I'm looking forward ( ) seeing you.|to / for / at / with|idiom|look forward to ～ing＝～するのを楽しみに待つ。to の後は ～ing。|あなたに会えるのを楽しみにしています。
Tom is looking ( ) his glasses. He can't find them.|for / at / like / after|idiom|look for ～＝～をさがす。|トムはめがねをさがしています。見つからないのです。
My mother looks ( ) my little brother when he is sick.|after / for / at / like|idiom|look after ～＝～の世話をする（take care of と同じ意味）。|母は弟が病気のとき世話をします。
A: What does your sister look ( )? B: She is tall and has long hair.|like / at / for / after|idiom|What does ～ look like?＝～はどんな外見ですか。|A: お姉さんはどんな見た目なの？ B: 背が高くて髪が長いよ。
I got ( ) the train at Tokyo Station and walked to the hotel.|off / up / over / out|idiom|get off ～＝（乗り物から）降りる。get on＝乗る。|東京駅で電車を降りて、ホテルまで歩きました。
Don't give ( ). You can do it!|up / off / in / out|idiom|give up＝あきらめる。|あきらめないで。あなたならできる！
Kate took part ( ) the speech contest.|in / on / at / of|idiom|take part in ～＝～に参加する。|ケイトはスピーチコンテストに参加しました。
A: Can you help me ( ) my homework? B: Sure.|with / for / to / on|idiom|help 人 with ～＝人の～を手伝う。|A: 宿題を手伝ってくれる？ B: いいよ。
I was ( ) to swim 100 meters last year.|able / good / sure / ready|idiom|be able to ～＝～することができる（can と同じ意味）。|去年は100メートル泳ぐことができました。
We have ( ) leave now. The train leaves in ten minutes.|to / for / at / of|idiom|have to ～＝～しなければならない。|もう出発しなければなりません。電車はあと10分で出ます。
My father gave ( ) smoking last year.|up / off / out / in|idiom|give up ～ing＝～するのをやめる。|父は去年たばこをやめました。
I made friends ( ) a girl from France.|with / to / for / on|idiom|make friends with ～＝～と友達になる。friends と複数形になる点に注意。|私はフランスから来た女の子と友達になりました。
Please turn ( ) the TV. I want to watch the news.|on / off / up / in|idiom|turn on＝（テレビ・電気を）つける。turn off＝消す。|テレビをつけてください。ニュースが見たいです。
It's cold outside. Put ( ) your coat.|on / off / in / up|idiom|put on＝着る。take off＝脱ぐ。|外は寒いよ。コートを着なさい。
A: I think we're late. B: Don't worry. We'll get there ( ) time.|in / by / with / from|idiom|in time＝間に合って。on time＝時間どおりに。|A: 遅れそうだね。B: 心配しないで。間に合うよ。
The bus arrived ( ) time. It was not late.|on / at / by / for|idiom|on time＝時間どおりに。|バスは時間どおりに着きました。遅れませんでした。
At ( ), I didn't like natto, but now I love it.|first / last / once / all|idiom|at first＝最初は。but now（でも今は）と対比するのがポイント。|最初は納豆が好きではありませんでしたが、今は大好きです。
We waited for the bus for a long time. At ( ), it came.|last / first / once / most|idiom|at last＝ついに（長く待ったあとで）。|私たちは長い間バスを待ちました。ついにバスが来ました。
( ) of the students in my class have a smartphone.|Most / Much / Every / Each|idiom|most of ～＝～の大部分。every は of をとらない。each of は単数扱い（has）。|私のクラスの生徒のほとんどがスマホを持っています。
These days, more ( ) more people are using smartphones.|and / or / but / so|idiom|more and more ～＝ますます多くの～。|このごろ、ますます多くの人がスマホを使っています。
Both Ken ( ) Mike are on the soccer team.|and / or / but / so|idiom|both A and B＝AもBも両方とも。|ケンもマイクもサッカー部に入っています。
You can choose either tea ( ) coffee.|or / and / but / so|idiom|either A or B＝AかBのどちらか。|紅茶かコーヒーのどちらかを選べます。
I was ( ) tired to do my homework last night.|too / so / very / much|idiom|too ～ to …＝～すぎて…できない。|昨夜は疲れすぎて宿題ができませんでした。
The box was ( ) heavy that I couldn't carry it.|so / too / very / such|idiom|so ～ that …＝とても～なので…。|その箱はとても重かったので、私は運べませんでした。
I'll show you ( ) our school.|around / about / along / across|idiom|show 人 around 場所＝人に場所を案内する。|私たちの学校を案内しますね。
Please say hello ( ) your parents.|to / for / with / at|idiom|say hello to ～＝～によろしく伝える。|ご両親によろしくお伝えください。
We had a good ( ) at the party last night.|time / idea / hour / fever|idiom|have a good time＝楽しい時を過ごす。|昨夜のパーティーは楽しかったです。
My dream came ( ). I became a teacher.|true / real / right / sure|idiom|come true＝（夢が）実現する。|私の夢はかないました。先生になったのです。
I'm tired ( ) eating the same food every day.|of / from / with / at|idiom|be tired of ～＝～にうんざりしている。|毎日同じものを食べるのにうんざりしています。
Cheese is made ( ) milk.|from / of / by / in|idiom|be made from ～＝～（原料）から作られる。見た目が変わるものは from。|チーズは牛乳から作られます。
This chair is made ( ) wood.|of / at / to / on|idiom|be made of ～＝～（材料）でできている。見て材料がわかるものは of。|このいすは木でできています。
Ken is very different ( ) his brother.|from / to / at / of|idiom|be different from ～＝～と違っている。|ケンはお兄さんとはとても違います。
The game was stopped because ( ) the heavy rain.|of / for / to / from|idiom|because of ～＝～のために（原因）。後ろは名詞。|大雨のために試合は中止されました。
Tom stayed up ( ) last night, so he is sleepy now.|late / early / long / much|idiom|stay up late＝夜ふかしする。|トムは昨夜夜ふかしをしたので、今眠いです。
I'll pick you ( ) at the station at five.|up / on / off / out|idiom|pick 人 up＝人を車で迎えに行く。|5時に駅に車で迎えに行きますね。
Mr. Smith was ( ) his way to work when he saw the accident.|on / in / at / by|idiom|on one's way to ～＝～へ行く途中で。|スミスさんは仕事に行く途中でその事故を見ました。
Please write ( ) to me soon.|back / out / off / up|idiom|write back＝返事を書く。|すぐに返事を書いてね。
I've never been ( ) Okinawa.|to / at / on / for|idiom|have been to ～＝～に行ったことがある。|私は沖縄に行ったことがありません。
Let's clean ( ) the room before our parents come home.|up / off / on / in|idiom|clean up＝きれいにかたづける。|両親が帰ってくる前に部屋をかたづけよう。
A: What's ( ), Mike? You look sad. B: I lost my wallet.|wrong / bad / sorry / happy|idiom|What's wrong?＝どうしたの？（心配してたずねる）。|A: どうしたの、マイク？ 悲しそうだね。B: 財布をなくしたんだ。
I'm going to ( ) a trip to Kyoto with my family.|take / make / do / get|idiom|take a trip＝旅行する。|家族と京都へ旅行する予定です。
Let's take a ( ) in the park.|walk / meal / trip / fever|idiom|take a walk＝散歩する。|公園を散歩しよう。
My sister is afraid ( ) big dogs.|of / for / at / with|idiom|be afraid of ～＝～をこわがる。|妹は大きな犬をこわがっています。
I was born ( ) 2011.|in / on / at / for|idiom|年・月の前は in。日付・曜日は on、時刻は at。|私は2011年に生まれました。
A: Let's play tennis ( ) school. B: OK. See you at the courts.|after / among / between / until|idiom|after school＝放課後。|A: 放課後テニスをしよう。B: いいよ。コートで会おう。
Please ( ) off your shoes at the door.|take / put / get / turn|idiom|take off＝脱ぐ。|玄関で靴を脱いでください。
My father ( ) TV when I came home.|was watching / is watching / watches / to watch|grammar:progressive|「～したとき、…していた」は過去進行形 was / were ～ing。|私が帰宅したとき、父はテレビを見ていました。
This book was ( ) by a famous writer.|written / write / wrote / writing|grammar:passive|受け身〈be動詞＋過去分詞〉。write の過去分詞は written。|この本は有名な作家によって書かれました。
English is ( ) in many countries.|spoken / speak / spoke / speaking|grammar:passive|「英語は話されている」→ 受け身 is spoken。|英語は多くの国で話されています。
I have ( ) in Tokyo for five years.|lived / live / living / lives|grammar:perfect|〈have＋過去分詞〉で「ずっと～している」（継続）。for ～＝～の間。|私は5年間東京に住んでいます。
Have you ever ( ) to Kyoto?|been / be / was / went|grammar:perfect|Have you ever been to ～?＝～に行ったことがありますか。|京都に行ったことはありますか。
Mt. Fuji is the ( ) mountain in Japan.|highest / higher / high / most high|grammar:compare|the ＋ 最上級 ＋ in ～＝～の中でいちばん…。high → highest。|富士山は日本でいちばん高い山です。
This bag is ( ) than that one.|heavier / heavy / heaviest / more heavy|grammar:compare|than があるので比較級。heavy → heavier（y を i にかえて er）。|このかばんはあのかばんより重いです。
Soccer is ( ) popular than baseball in my class.|more / most / very / better|grammar:compare|popular のような長い語は more ～ than で比較級にする。|私のクラスでは野球よりサッカーのほうが人気です。
I want something cold ( ).|to drink / drink / drinking / drank|grammar:infinitive|something ＋ 形容詞 ＋ to ～＝何か～する（ための）もの。|何か冷たい飲み物がほしいです。
( ) English is interesting.|Studying / Study / Studied / Studies|grammar:gerund|主語になるのは動名詞（～ing）＝～すること。|英語を勉強することはおもしろいです。
I enjoyed ( ) with my friends last weekend.|talking / to talk / talk / talked|grammar:gerund|enjoy の後は動名詞（～ing）。enjoy to ～ とは言わない。|先週末は友達とのおしゃべりを楽しみました。
Do you know ( ) he lives?|where / what / who / which|grammar:indirect|間接疑問〈疑問詞＋主語＋動詞〉。「どこに住んでいるか」→ where。|彼がどこに住んでいるか知っていますか。
The boy ( ) is playing the guitar is my brother.|who / which / what / where|grammar:relative|人を説明する関係代名詞は who。|ギターをひいている男の子は私の弟です。
This is the cake ( ) my mother made.|which / who / where / what|grammar:relative|物を説明する関係代名詞は which（that でもOK）。|これは母が作ったケーキです。
Look at that ( ) baby.|sleeping / sleep / slept / sleeps|grammar:participle|名詞の前の ～ing は「～している」。sleeping baby＝眠っている赤ちゃん。|あの眠っている赤ちゃんを見て。
I have a friend ( ) in Canada.|living / lives / lived / live|grammar:participle|〈名詞＋～ing＋語句〉で「～している…」。a friend living in Canada＝カナダに住んでいる友達。|私にはカナダに住んでいる友達がいます。
It's very hot today, ( ) it?|isn't / doesn't / wasn't / is|grammar:tag|付加疑問：肯定文には否定の形をつける。It's → isn't it?|今日はとても暑いですね。
You can play tennis, ( ) you?|can't / don't / aren't / won't|grammar:tag|can の文の付加疑問は can't ～?|あなたはテニスができますよね。
My mother told me ( ) my room.|to clean / cleaning / clean / cleaned|grammar:infinitive|tell 人 to ～＝人に～するように言う。|母は私に部屋をそうじするように言いました。
I don't know how ( ) this machine.|to use / using / use / used|grammar:infinitive|how to ～＝～のしかた。|この機械の使い方がわかりません。
( ) you help me carry this box?|Could / Shall / Must / May|grammar:modal|Could you ～?＝～していただけますか（ていねいな依頼）。|この箱を運ぶのを手伝っていただけますか。
A: ( ) I open the window? B: Yes, please.|Shall / Will / Do / Are|grammar:modal|Shall I ～?＝（私が）～しましょうか。Yes, please. と答える。|A: 窓を開けましょうか。B: はい、お願いします。
I ( ) go to school tomorrow because it's a holiday.|don't have to / must / have to / should|grammar:modal|don't have to ～＝～する必要はない。祝日なので学校に行く必要はない。|明日は祝日なので、学校に行く必要はありません。
You ( ) run in the hallway. It's dangerous.|must not / don't have to / may / can|grammar:modal|must not ～＝～してはいけない（禁止）。|廊下を走ってはいけません。危ないです。
I have ( ) finished my lunch.|just / yet / ever / ago|grammar:perfect|〈have just＋過去分詞〉＝ちょうど～したところだ（完了）。|ちょうど昼食を食べ終えたところです。
Taro is the ( ) boy in his class.|tallest / taller / tall / most tall|grammar:compare|the ＋ 最上級 ＋ in ～。tall → tallest。|太郎はクラスでいちばん背が高い男の子です。
Emi runs ( ) than Yuki.|faster / fast / fastest / more fast|grammar:compare|than があるので比較級 faster。|エミはユキより速く走ります。
My bike is not as new ( ) yours.|as / than / so / that|grammar:compare|not as ～ as …＝…ほど～でない。|私の自転車はあなたのほど新しくありません。
Which do you like ( ), cats or dogs?|better / more / best / well|grammar:compare|Which do you like better, A or B?＝AとBではどちらが好きですか。|ネコと犬ではどちらが好きですか。
If it ( ) tomorrow, we will stay home.|rains / will rain / rained / raining|grammar:conj|if の文の中では、未来のことでも現在形を使う。|もし明日雨が降れば、私たちは家にいます。
I was very happy ( ) the news.|to hear / hearing / heard / hear|grammar:infinitive|感情の原因を表す不定詞：happy to ～＝～してうれしい。|その知らせを聞いてとてもうれしかったです。
My brother went to the library ( ) study.|to / for / at / with|grammar:infinitive|目的を表す不定詞：to ～＝～するために。|兄は勉強するために図書館へ行きました。
The letter ( ) in English.|is written / writes / is writing / wrote|grammar:passive|「手紙は書かれている」→ 受け身 is written。|その手紙は英語で書かれています。
A: How long ( ) you lived here? B: For ten years.|have / did / do / are|grammar:perfect|How long have you ～?＝どのくらい（ずっと）～していますか（継続）。|A: ここにどのくらい住んでいますか。B: 10年です。
I have known Ken ( ) I was five.|since / for / from / ago|grammar:perfect|since ～＝～以来。後ろに文（I was five）や時点がくる。|私は5歳のときからケンを知っています。
I have lived here ( ) three years.|for / since / from / during|grammar:perfect|for ＋ 期間（three years）＝～の間。|私はここに3年間住んでいます。
There ( ) many children in the park yesterday.|were / was / are / is|grammar:there|children は複数、yesterday なので過去 → were。|昨日は公園にたくさんの子どもがいました。
A: Whose umbrella is this? B: It's ( ).|mine / my / me / I|grammar:pronoun|「私のもの」は mine。|A: これはだれのかさですか。B: 私のです。
Please tell ( ) about your trip.|us / our / we / ours|grammar:pronoun|tell の後の「人」は目的格 us（私たちに）。|あなたの旅行について私たちに話してください。
Ken and Tom ( ) playing soccer now.|are / is / was / be|grammar:progressive|主語が複数（Ken and Tom）で now なので are ～ing。|ケンとトムは今サッカーをしています。
A: ( ) did you go to Osaka? B: By Shinkansen.|How / What / When / Where|grammar:wh|By Shinkansen（新幹線で）は手段 → How。|A: 大阪へはどうやって行きましたか。B: 新幹線で行きました。
A: ( ) is it from here to the station? B: About ten minutes on foot.|How far / How many / How much / How old|grammar:wh|距離をたずねるのは How far。|A: ここから駅までどのくらいの距離ですか。B: 歩いて約10分です。
A: ( ) do you go to the gym? B: Twice a week.|How often / How long / How much / How many|grammar:wh|回数・頻度をたずねるのは How often。|A: どのくらいの頻度でジムに行きますか。B: 週に2回です。
The man ( ) over there is my uncle.|standing / stands / stood / stand|grammar:participle|〈名詞＋～ing＋語句〉＝～している…。|向こうに立っている男の人は私のおじです。
This is a house ( ) in 1950.|built / building / builds / to build|grammar:participle|〈名詞＋過去分詞＋語句〉＝～された…。a house built in 1950＝1950年に建てられた家。|これは1950年に建てられた家です。
I stopped ( ) TV and started my homework.|watching / to watch / watch / watched|grammar:gerund|stop ～ing＝～するのをやめる。|私はテレビを見るのをやめて、宿題を始めました。
She finished ( ) her report.|writing / to write / write / wrote|grammar:gerund|finish の後は動名詞（～ing）。|彼女はレポートを書き終えました。
I want ( ) a doctor in the future.|to be / being / be / been|grammar:infinitive|want to ～＝～したい。be を使って「～になりたい」。|私は将来医者になりたいです。
Mary can't come today ( ) she is sick.|because / but / or / so|grammar:conj|理由を表すのは because。so は「だから」で、前後が逆になる。|メアリーは病気なので今日は来られません。
It is important ( ) eat breakfast every day.|to / for / of / at|grammar:infinitive|It is ～ to …＝…することは～だ。|毎日朝食を食べることは大切です。
When I called Ken, he ( ) a bath.|was taking / takes / is taking / take|grammar:progressive|電話したとき「～していた」は過去進行形。|私がケンに電話したとき、彼はおふろに入っていました。
These pictures were ( ) by my father.|taken / take / took / taking|grammar:passive|受け身 were ＋ 過去分詞。take の過去分詞は taken。|これらの写真は父によって撮られました。
The girl ( ) I met yesterday was very kind.|who / which / whose / what|grammar:relative|人を説明する関係代名詞 who（目的格の whom / that も可）。|昨日会った女の子はとても親切でした。
Can you tell me ( ) this is?|what / how / where / who|grammar:indirect|「これが何か」→ what this is（疑問詞＋主語＋動詞）。|これが何か教えてくれますか。
`;

// 大問2：会話文の文空所補充
// 会話（話者: 文 を " // " でつなぐ）|正解 / 誤答 / 誤答 / 誤答|解説|訳
export const PART2_RAW = String.raw`
Girl: Dad, can we go to the zoo this weekend? // Father: ( ) I have to work on Saturday and Sunday.|I'm sorry, but we can't. / That's a good idea. / Here you are. / It was fun.|父は「土日は仕事がある」と言っているので、断る表現が入る。|女の子：お父さん、今週末動物園に行ける？ 父：ごめんね、行けないんだ。土曜日も日曜日も仕事があるんだよ。
Boy: I'm going to Hokkaido next week. // Girl: That's nice. ( ) // Boy: For five days.|How long will you stay there? / When did you go there? / Who will you go with? / How will you get there? |For five days（5日間）と期間を答えているので How long ～? が入る。|男の子：来週北海道に行くんだ。女の子：いいね。どのくらいそこにいるの？ 男の子：5日間だよ。
Woman: Can I help you? // Man: Yes. ( ) // Woman: It's on the fourth floor.|Where can I buy shoes? / How much are these shoes? / What time do you close? / Do you have a smaller one?|「4階にあります」と場所を答えているので Where ～? が入る。|女性：いらっしゃいませ。男性：はい。靴はどこで買えますか。女性：4階にございます。
Mother: Tom, you look tired. ( ) // Son: Yes. I studied until one last night.|Did you stay up late? / Are you hungry? / Where did you go? / What do you want?|Yes と答えて「1時まで勉強した」と続けるので、夜ふかしをしたかをたずねる文。|母：トム、疲れているみたいね。夜ふかししたの？ 息子：うん。昨夜は1時まで勉強したんだ。
Girl: Would you like some more cake? // Boy: ( ) I'm full.|No, thank you. / Yes, please. / Here you are. / You're welcome.|「おなかがいっぱい」なので断る No, thank you. が入る。|女の子：ケーキをもう少しどう？ 男の子：いいえ、けっこうです。おなかがいっぱいなんだ。
Man: Excuse me. How can I get to the museum? // Woman: ( ) Take the Blue Line and get off at Park Station.|You should take the subway. / It's my first time. / I went there last week. / It's 500 yen.|このあと電車の乗り方を説明しているので「地下鉄に乗るといいですよ」が自然。|男性：すみません。博物館へはどう行けばいいですか。女性：地下鉄に乗るといいですよ。ブルーラインに乗ってパーク駅で降りてください。
Boy: Hello. This is Mike. May I speak to Ken? // Woman: ( ) He's out now.|I'm sorry. / Speaking. / Hold on, please. / Nice to meet you.|ケンは今出かけているので「すみません（いません）」。Speaking. は本人が出たときの表現。|男の子：もしもし、マイクです。ケンをお願いできますか。女性：ごめんなさい。今出かけているの。
Girl: I passed the English test! // Boy: ( ) You studied very hard.|Congratulations! / That's too bad. / I'm sorry to hear that. / Take care.|合格したと聞いたので Congratulations!（おめでとう）。|女の子：英語のテストに合格したよ！ 男の子：おめでとう！一生懸命勉強していたもんね。
Woman: How was your trip to Canada? // Man: ( ) I saw a lot of beautiful lakes.|It was wonderful. / I'll go next month. / By plane. / For a week.|How was ～?（～はどうでしたか）には感想を答える。|女性：カナダ旅行はどうでしたか。男性：すばらしかったです。美しい湖をたくさん見ました。
Boy: I can't find my eraser. // Girl: ( ) // Boy: Thanks. I'll give it back soon.|You can use mine. / It's on sale. / I don't need it. / I have no idea.|男の子が「ありがとう。すぐ返すね」と言っているので、消しゴムを貸す申し出が入る。|男の子：消しゴムが見つからないよ。女の子：私のを使っていいよ。男の子：ありがとう。すぐ返すね。
Teacher: Did you finish your report? // Student: ( ) I'll finish it tonight.|Not yet. / Yes, I did. / Here it is. / That's right.|「今夜終わらせます」と言っているので、まだ終わっていない＝Not yet.|先生：レポートは終わりましたか。生徒：まだです。今夜終わらせます。
Girl: What are you going to do this weekend? // Boy: ( ) How about you?|I'm going to go fishing with my father. / I went to the park. / It was sunny. / Yes, I am.|未来の予定をたずねられているので be going to で答える。|女の子：今週末は何をするの？ 男の子：父と釣りに行くんだ。きみは？
Man: Excuse me. Is this seat free? // Woman: ( ) My friend is sitting there.|Sorry, it isn't. / Yes, go ahead. / Here you are. / That's all.|「友達が座っている」ので空いていない＝Sorry, it isn't.|男性：すみません。この席は空いていますか。女性：すみません、空いていません。友達が座っているんです。
Boy: Let's play basketball after school. // Girl: ( ) I have to go to the dentist today.|Maybe next time. / Sounds good. / Me, too. / I did it.|今日は歯医者に行かなければならないので、Maybe next time.（また今度ね）。|男の子：放課後バスケットボールをしようよ。女の子：また今度ね。今日は歯医者に行かなきゃいけないの。
Waiter: Are you ready to order? // Woman: ( ) I'd like the fish, please.|Yes, I am. / No, I'm not. / It's delicious. / Here you are.|Are you ～? には Yes, I am. で答え、注文を続けている。|ウェイター：ご注文はお決まりですか。女性：はい。魚料理をお願いします。
Girl: This sweater is nice. ( ) // Clerk: It's 3,000 yen.|How much is it? / What size is it? / Can I try it on? / What color is it?|3,000円と値段を答えているので How much ～?|女の子：このセーターすてき。いくらですか。店員：3,000円です。
Mother: Dinner is ready. // Son: ( ) I'm really hungry.|Great! / I'm sorry. / Not yet. / That's too bad.|夕食ができて「おなかがすいている」ので喜ぶ Great!|母：夕食ができたわよ。息子：やった！すごくおなかがすいてるんだ。
Boy: Whose bag is this? // Girl: ( ) Thank you for finding it.|It's mine. / It's yours. / It's his. / It's new.|「見つけてくれてありがとう」と言っているので自分のもの＝It's mine.|男の子：これはだれのかばん？ 女の子：私のよ。見つけてくれてありがとう。
Girl: I'm going to the library. Do you want to come? // Boy: ( ) I have to return some books.|Sure, I'll come with you. / No, I'm not. / It's closed. / I don't like books.|「本を返さなければならない」ので、いっしょに行く。|女の子：図書館に行くんだけど、来る？ 男の子：うん、いっしょに行くよ。本を何冊か返さないといけないんだ。
Man: What time does the next bus come? // Woman: ( ) // Man: Thank you.|In ten minutes. / For ten minutes. / Ten minutes ago. / By bus.|「次のバスはいつ来るか」→ In ten minutes.（10分後に）。|男性：次のバスは何時に来ますか。女性：10分後です。男性：ありがとうございます。
Girl: Hi, Jack. Long time no see. // Boy: Hi, Lisa. ( ) // Girl: I've been fine, thanks.|How have you been? / Where were you? / What's that? / When did you come?|I've been fine と答えているので How have you been?（元気にしてた？）。|女の子：こんにちは、ジャック。久しぶり。男の子：やあ、リサ。元気にしてた？ 女の子：元気だったよ、ありがとう。
Son: Can I watch TV now? // Mother: ( ) Finish your homework first.|No, you can't. / Yes, you can. / That's good. / Sounds fun.|「まず宿題を終わらせなさい」なので No, you can't.|息子：今テレビを見てもいい？ 母：だめよ。まず宿題を終わらせなさい。
Boy: Excuse me. Where is the restroom? // Woman: ( ) It's next to the elevator.|Go down this hall. / I don't know. / It's clean. / It's 100 yen.|場所を案内する文が入る。I don't know. だと後ろとつながらない。|男の子：すみません。トイレはどこですか。女性：この廊下をまっすぐ行ってください。エレベーターのとなりです。
Girl: Your English is very good. // Boy: ( ) I lived in America for three years.|Thank you. / You're welcome. / I'm sorry. / No problem.|ほめられたときは Thank you. で答える。|女の子：英語がとても上手だね。男の子：ありがとう。アメリカに3年間住んでいたんだ。
Woman: How often do you go swimming? // Man: ( ) I really like it.|Twice a week. / For two hours. / Two years ago. / At the pool.|How often（どのくらいの頻度で）には回数で答える。|女性：どのくらい泳ぎに行くの？ 男性：週に2回です。泳ぐのが大好きなんです。
Boy: Is it going to rain tomorrow? // Girl: ( ) The TV said it will be sunny all day.|I don't think so. / Yes, it is. / I hope so. / It was cloudy.|「一日中晴れる」と言っているので「降らないと思う」。|男の子：明日は雨が降るかな？ 女の子：降らないと思うよ。テレビで一日中晴れるって言ってたよ。
Man: Can you take a picture of us? // Woman: ( ) OK, say cheese!|Sure. / No, I can't. / It's my camera. / Here you are.|写真を撮ることを引き受けている。|男性：私たちの写真を撮ってもらえますか。女性：いいですよ。はい、チーズ！
Girl: I'm going to make a cake for Mom's birthday. // Boy: ( ) Can I help you?|That's a nice idea. / That's too bad. / I'm sorry. / It's my birthday.|ケーキを作る計画に賛成している。|女の子：お母さんの誕生日にケーキを作るの。男の子：それはいい考えだね。手伝おうか？
Boy: Do you have any brothers or sisters? // Girl: ( ) She's ten years old.|I have a sister. / I have two brothers. / No, I don't. / I'm an only child.|後ろで She（彼女）と言っているので姉妹が1人いる。|男の子：きょうだいはいる？ 女の子：妹が1人いるよ。10歳なの。
Woman: What's wrong with your leg? // Boy: ( ) It hurts a lot.|I fell down during soccer practice. / I'm going to practice. / It's my new shoes. / I like soccer.|足の具合が悪い理由を答えている。|女性：足をどうしたの？ 男の子：サッカーの練習中に転んだんです。すごく痛いです。
Man: Would you like something to drink? // Girl: ( ) Some orange juice, please.|Yes, please. / No, thank you. / Here you are. / I'm full.|オレンジジュースを頼んでいるので Yes, please.|男性：何か飲み物はいかがですか。女の子：はい、お願いします。オレンジジュースをください。
Girl: Where did you buy that T-shirt? // Boy: ( ) It was on sale.|At the department store near the station. / Last Sunday. / With my mother. / It's 2,000 yen.|Where（どこで）なので場所を答える。|女の子：そのTシャツどこで買ったの？ 男の子：駅の近くのデパートだよ。セールだったんだ。
Mother: Please buy some milk on your way home. // Daughter: ( ) How many bottles?|All right. / That's too bad. / Not yet. / You're welcome.|たのみごとを引き受ける All right.（わかった）。|母：帰りに牛乳を買ってきてね。娘：わかった。何本？
Boy: I'm sorry I'm late. // Teacher: ( ) Please sit down.|That's OK. / You're welcome. / Congratulations. / Good luck.|謝られたときに「いいですよ」と答える。|男の子：遅れてすみません。先生：いいですよ。座ってください。
Girl: Which season do you like the best? // Boy: ( ) I love skiing.|Winter. / Summer. / Spring. / Fall.|スキーが大好き → 冬。|女の子：どの季節がいちばん好き？ 男の子：冬だよ。スキーが大好きなんだ。
Man: How much did you pay for the concert ticket? // Woman: ( ) It was expensive.|Five thousand yen. / Five o'clock. / Five people. / Five days.|How much（いくら）には金額で答える。|男性：コンサートのチケットにいくら払ったの？ 女性：5,000円よ。高かったわ。
Boy: Let's meet at the station at ten. // Girl: ( ) See you then.|Sounds good. / That's too bad. / I'm afraid not. / How about you?|「じゃあそのときに」と続くので賛成の表現。|男の子：10時に駅で会おう。女の子：いいね。じゃあそのときに。
Girl: I can't open this bottle. // Boy: ( ) Wow, it's really hard.|Let me try. / Here you are. / It's empty. / I'll buy it.|自分がやってみると申し出る Let me try.|女の子：このびんが開けられないの。男の子：ぼくにやらせて。わあ、本当に固いね。
Man: Do you know where Ms. Green is? // Woman: ( ) She's in the teachers' room.|Yes, I do. / No, I don't. / I'm Ms. Green. / She's a teacher.|居場所を答えているので Yes, I do.|男性：グリーン先生がどこにいるか知っていますか。女性：はい、知っています。職員室にいますよ。
Boy: What did you do during the summer vacation? // Girl: ( ) It was very hot there.|I visited my aunt in Okinawa. / I'll go camping. / I like summer. / It was a long vacation.|過去のことをたずねているので過去形で答える。there が指す場所があるものを選ぶ。|男の子：夏休みは何をしたの？ 女の子：沖縄のおばを訪ねたよ。そこはとても暑かった。
Girl: I'm really nervous about tomorrow's speech. // Boy: ( ) You practiced a lot.|Don't worry. You'll be fine. / Me, neither. / I'm glad to hear that. / Nice to meet you.|緊張している相手をはげます表現。|女の子：明日のスピーチ、本当に緊張しているの。男の子：心配しないで。きっと大丈夫だよ。たくさん練習したじゃない。
Clerk: May I help you? // Man: ( ) Thank you.|No, thanks. I'm just looking. / Yes, it's mine. / That's too bad. / Here you are.|店員の声かけに「見ているだけです」と答える決まり文句。|店員：いらっしゃいませ。男性：いえ、けっこうです。見ているだけです。ありがとう。
Girl: Shall we go shopping tomorrow? // Boy: ( ) What time shall we meet?|Why not? / No, let's not. / I went yesterday. / I'm sorry.|待ち合わせの時間をたずねているので賛成＝Why not?（いいとも）。|女の子：明日買い物に行かない？ 男の子：いいね。何時に会おうか。
Boy: Mom, where are my glasses? // Mother: ( ) Look on your desk.|I saw them in your room. / I don't wear glasses. / They're new. / Here it is.|「机の上を見て」と続くので、あなたの部屋で見たという文。|男の子：お母さん、ぼくのめがねはどこ？ 母：あなたの部屋で見たわよ。机の上を見てごらん。
Girl: How do you usually go to school? // Boy: ( ) It takes about 15 minutes.|I ride my bike. / At eight. / With my friends. / Every day.|How（どうやって）には手段で答える。|女の子：ふだんどうやって学校に行ってるの？ 男の子：自転車に乗って行くよ。15分くらいかかるんだ。
Man: I'm going to Kyoto this weekend. // Woman: ( ) Please send me some pictures.|Have a nice trip. / Take a rest. / Get well soon. / Good night.|旅行に行く人へのあいさつ Have a nice trip.|男性：今週末京都に行くんだ。女性：よい旅を。写真を送ってね。
Boy: This math homework is too difficult. // Girl: ( ) I'll help you.|Don't give up. / I did it already. / It's easy. / I don't know.|「手伝うよ」と続くので、はげます表現。|男の子：この数学の宿題、難しすぎるよ。女の子：あきらめないで。手伝ってあげる。
Woman: Hello, Sakura Restaurant. // Man: Hi. ( ) // Woman: Sure. What time?|I'd like to make a reservation for tonight. / What's on the menu? / Where are you? / I'm hungry.|「何時ですか」と聞き返しているので予約の依頼。|女性：もしもし、さくらレストランです。男性：こんにちは。今夜の予約をしたいのですが。女性：かしこまりました。何時ですか。
Girl: Are you free this Saturday? // Boy: ( ) Why?|Yes, I am. / No, it isn't. / It's Saturday. / Yes, it is.|Are you ～? には I am で答える。|女の子：今度の土曜日ひま？ 男の子：うん、ひまだよ。どうして？
Teacher: Who wants to read this page? // Student: ( ) Can I start now?|I'll do it. / It's not mine. / I read it yesterday. / Here you are.|「読みたい人？」に「ぼくがやります」。|先生：このページを読みたい人はいますか。生徒：ぼくがやります。今始めていいですか。
Girl: I'm going to the post office. // Boy: ( ) I need some stamps.|Can I come with you? / It's closed today. / I'm not going. / How was it?|切手が必要なのでいっしょに行きたい。|女の子：郵便局に行ってくるね。男の子：いっしょに行ってもいい？ 切手が必要なんだ。
Man: What do you want to be in the future? // Girl: ( ) I love animals.|I want to be a vet. / I'm a student. / I went to the zoo. / I have a dog.|動物が好き→獣医（vet）になりたい。|男性：将来は何になりたいの？ 女の子：獣医になりたいです。動物が大好きなんです。
Boy: Can you come to my birthday party on Sunday? // Girl: ( ) What time does it start?|Of course. / I'm afraid I can't. / It was great. / Happy birthday.|「何時に始まるの？」と続くので参加する返事。|男の子：日曜日のぼくの誕生日パーティーに来られる？ 女の子：もちろん。何時に始まるの？
`;

// 大問3：長文の内容一致選択（A：掲示・お知らせ／B：Eメール・手紙／C：説明文・物語）
export const PASSAGES = [
  {
    id: '3A-library', type: 'A', title: 'Summer Reading Event',
    body: `Summer Reading Event at Lincoln Library

Do you like reading? Join our Summer Reading Event!

Dates: From July 20 to August 31
Who can join: Students from 10 to 15 years old

Read books and write short reports about them. When you write five reports, you will get a free notebook. If you write ten reports, you can get a special bag, too!

On August 31, we will have a party in the library. A famous writer, Ms. Anna White, will come and talk about her new book.

To join, please come to the front desk and write your name.`,
    ja: `リンカーン図書館 夏の読書イベント\n\n読書は好きですか。夏の読書イベントに参加しましょう！\n日程：7月20日から8月31日まで\n参加できる人：10歳から15歳の生徒\n\n本を読んで短い感想文を書いてください。感想文を5つ書くと、無料のノートがもらえます。10書くと、特別なバッグももらえます！\n8月31日には図書館でパーティーがあります。有名な作家のアンナ・ホワイトさんが来て、新しい本について話してくれます。\n参加するには、受付に来て名前を書いてください。`,
    qs: [
      { q: 'What will students get when they write five reports?', c: ['A free notebook.', 'A special bag.', 'A new book.', 'A party ticket.'], x: '"When you write five reports, you will get a free notebook." とある。バッグは10個書いたとき。' },
      { q: 'What will happen on August 31?', c: ['A writer will talk at the library.', 'Students will write their names.', 'The library will be closed.', 'Students will buy new books.'], x: '"On August 31, we will have a party ... Ms. Anna White, will come and talk" とある。' },
    ],
  },
  {
    id: '3A-tennis', type: 'A', title: 'Tennis Club Members Wanted',
    body: `Green Hill Tennis Club
New Members Wanted!

Do you want to play tennis? It's a lot of fun, and it's good for your health!

• Practice days: Every Tuesday and Friday, from 4:00 p.m. to 6:00 p.m.
• Place: Green Hill Park tennis courts
• Cost: 2,000 yen a month

You don't need a racket. You can borrow one from the club for free. Beginners are welcome. Our coach, Mr. Davis, will teach you.

If it rains, we will practice in the gym at Green Hill Junior High School.

For more information, call Mr. Davis at 555-2468.`,
    ja: `グリーンヒル・テニスクラブ　新しいメンバー募集！\nテニスをしたいですか。とても楽しく、健康にもよいです！\n・練習日：毎週火曜日と金曜日、午後4時から6時\n・場所：グリーンヒル公園のテニスコート\n・費用：月2,000円\nラケットは必要ありません。クラブから無料で借りられます。初心者歓迎。コーチのデイビスさんが教えます。\n雨の場合は、グリーンヒル中学校の体育館で練習します。\nくわしくはデイビスさん（555-2468）に電話してください。`,
    qs: [
      { q: 'What do people need to pay to join the club?', c: ['2,000 yen a month.', '2,000 yen for a racket.', 'Nothing.', '4,000 yen a week.'], x: '"Cost: 2,000 yen a month" とある。ラケットは無料で借りられる。' },
      { q: 'Where will the members practice on rainy days?', c: ['In a school gym.', 'At Green Hill Park.', 'At Mr. Davis\'s house.', 'They will not practice.'], x: '"If it rains, we will practice in the gym at Green Hill Junior High School." とある。' },
    ],
  },
  {
    id: '3A-zoo', type: 'A', title: 'Night Zoo',
    body: `Come to the Night Zoo!

Sunny City Zoo will be open at night this summer.

Dates: Every Saturday in August
Time: 6:00 p.m. to 9:00 p.m.
Tickets: Adults 1,200 yen / Children (6-15) 600 yen / Children under 6: free

At night, you can see animals that sleep during the day. Our zoo guides will tell you interesting stories about the owls and the bats at 7:00 p.m. and 8:00 p.m.

There is a special dinner menu at the zoo restaurant. Please bring a flashlight because some paths are dark.`,
    ja: `ナイトズーに来てください！\nサニーシティ動物園はこの夏、夜も開園します。\n日程：8月の毎週土曜日　時間：午後6時〜9時\nチケット：大人1,200円／子ども（6〜15歳）600円／6歳未満は無料\n夜は、昼間眠っている動物を見ることができます。動物園のガイドが午後7時と8時に、フクロウとコウモリについておもしろい話をします。\n動物園のレストランには特別な夕食メニューがあります。暗い道もあるので、懐中電灯を持ってきてください。`,
    qs: [
      { q: 'How much does a ticket cost for a 12-year-old child?', c: ['600 yen.', '1,200 yen.', 'Nothing.', '1,800 yen.'], x: '6〜15歳の子どもは600円。12歳なのでここに入る。' },
      { q: 'Why should visitors bring a flashlight?', c: ['Because some paths are dark.', 'Because the animals like light.', 'Because the restaurant is closed.', 'Because the guides will ask for one.'], x: '"Please bring a flashlight because some paths are dark." とある。' },
    ],
  },
  {
    id: '3A-bake', type: 'A', title: 'Bake Sale',
    body: `Hillside Junior High School Bake Sale

The cooking club is going to have a bake sale!

When: Friday, October 14, from 12:30 p.m. to 1:15 p.m.
Where: In front of the school cafeteria

We will sell cookies, cupcakes, and apple pie. Everything is 100 yen. We made all of them with fruit from our school garden.

We will use the money to buy new books for the school library.

We only have 200 cupcakes, so please come early!`,
    ja: `ヒルサイド中学校 手作りお菓子販売会\n料理部がお菓子の販売会を開きます！\nいつ：10月14日（金）午後12時30分〜1時15分\nどこで：学校の食堂の前\nクッキー、カップケーキ、アップルパイを売ります。すべて100円です。すべて学校の菜園の果物を使って作りました。\n売上金は学校図書館の新しい本を買うのに使います。\nカップケーキは200個しかないので、早めに来てください！`,
    qs: [
      { q: 'What will the cooking club do with the money?', c: ['Buy new books for the library.', 'Buy fruit for the garden.', 'Have a party.', 'Buy new cooking tools.'], x: '"We will use the money to buy new books for the school library." とある。' },
      { q: 'Why should students come early?', c: ['There are only 200 cupcakes.', 'The sale starts in the morning.', 'The cafeteria closes at 12:30.', 'The apple pie is free.'], x: '"We only have 200 cupcakes, so please come early!" とある。' },
    ],
  },
  {
    id: '3B-emma', type: 'B', title: 'Emails about a Trip',
    body: `From: Emma Brown
To: Yuki Sato
Date: March 3
Subject: My visit to Japan

Hi Yuki,
How are you? I'm very excited because I'm going to visit Japan next month with my parents! We will stay in Tokyo for four days and then go to Kyoto for three days. Do you have any ideas about places to visit in Tokyo? My father loves trains, and my mother likes shopping. I want to eat real Japanese food. Can we meet when I'm in Tokyo?
Your friend,
Emma

From: Yuki Sato
To: Emma Brown
Date: March 4
Subject: Welcome to Japan!

Hi Emma,
That's great news! Of course we can meet. How about Saturday, April 12? I'm free that day. You should visit the Railway Museum. Your father will love it. There are many old trains there. After that, we can go shopping in Harajuku. Your mother can buy cute clothes and bags there. For lunch, let's eat sushi. My uncle has a sushi restaurant near Tokyo Station, and his sushi is delicious!
See you soon,
Yuki

From: Emma Brown
To: Yuki Sato
Date: March 5
Subject: Thank you!

Hi Yuki,
Thank you for your ideas! Saturday, April 12 is perfect. My parents want to visit your uncle's restaurant, too. But I have one problem. I can't eat raw fish. Does your uncle's restaurant have other food? Also, my father wants to know how long it takes to go from Tokyo Station to the Railway Museum.
Love,
Emma`,
    ja: `（1通目）エマからユキへ：来月両親と日本を訪れる。東京に4日、京都に3日滞在する予定。東京で訪れるべき場所のアイデアはある？ 父は電車が大好きで、母は買い物が好き。私は本物の日本食が食べたい。東京にいる間に会える？\n（2通目）ユキからエマへ：もちろん会えるよ。4月12日（土）はどう？ その日はひま。鉄道博物館に行くといいよ。古い電車がたくさんある。そのあと原宿で買い物ができる。お昼はおすしを食べよう。おじが東京駅の近くにすし店をやっていて、とてもおいしいの！\n（3通目）エマからユキへ：アイデアをありがとう！4月12日（土）で完璧。両親もおじさんのお店に行きたがっている。でも問題がひとつ。私は生の魚が食べられないの。おじさんのお店にはほかの料理もある？ それから、父が東京駅から鉄道博物館までどのくらい時間がかかるか知りたがっているよ。`,
    qs: [
      { q: 'How long will Emma stay in Japan?', c: ['For seven days.', 'For four days.', 'For three days.', 'For one month.'], x: '東京に4日（four days）、京都に3日（three days）なので合計7日間。' },
      { q: 'Why does Yuki want to take Emma\'s father to the Railway Museum?', c: ['Because he loves trains.', 'Because he likes shopping.', 'Because it is near Harajuku.', 'Because Yuki\'s uncle works there.'], x: '1通目に "My father loves trains" とあり、ユキは "Your father will love it. There are many old trains there." と答えている。' },
      { q: 'What is Emma\'s problem?', c: ['She cannot eat raw fish.', 'She is not free on April 12.', 'She doesn\'t like shopping.', 'She doesn\'t know where Tokyo Station is.'], x: '3通目に "I have one problem. I can\'t eat raw fish." とある。' },
    ],
  },
  {
    id: '3B-kenta', type: 'B', title: 'Kenta\'s Homestay',
    body: `From: Kenta Mori
To: Mrs. Wilson
Date: July 10
Subject: Thank you

Dear Mrs. Wilson,
I'm back in Japan now. Thank you very much for everything during my homestay in Canada. I had a wonderful time with your family. I especially enjoyed the camping trip to the lake. It was my first time to catch a fish! Please say hello to Ben and Lucy. I miss them a lot. I'm sending some pictures from the trip with this e-mail.
Best wishes,
Kenta

From: Mrs. Wilson
To: Kenta Mori
Date: July 11
Subject: We miss you!

Dear Kenta,
Thank you for your e-mail and the pictures. Ben put one of them on his bedroom wall! We miss you, too. Lucy says you were a great teacher. She is still practicing origami every day. She made twenty paper cranes last week. Ben wants to learn more about Japan. He is going to take a Japanese class at his high school from September. Next summer, we are planning to visit Japan. Can you show us around your town?
Love,
Susan Wilson

From: Kenta Mori
To: Mrs. Wilson
Date: July 12
Subject: Re: We miss you!

Dear Mrs. Wilson,
That's wonderful news! Of course I can show you around. There is a big fireworks festival in my town every August. I'm sure you will enjoy it. My mother says you can stay at our house. Please tell Lucy that I'll teach her how to make a paper frog next time.
Best wishes,
Kenta`,
    ja: `（1通目）ケンタからウィルソンさんへ：日本に戻りました。カナダでのホームステイ中、本当にありがとうございました。特に湖へのキャンプ旅行が楽しかったです。初めて魚をつりました！ベンとルーシーによろしく。旅行の写真を送ります。\n（2通目）ウィルソンさんからケンタへ：メールと写真をありがとう。ベンは1枚を寝室の壁にはったのよ！ルーシーはあなたがすばらしい先生だったと言っていて、今も毎日折り紙を練習しているわ。先週は折り鶴を20羽折ったの。ベンは日本についてもっと学びたくて、9月から高校で日本語の授業を取る予定よ。来年の夏に日本を訪れる計画をしているの。町を案内してくれる？\n（3通目）ケンタからウィルソンさんへ：すばらしい知らせです！もちろん案内します。ぼくの町では毎年8月に大きな花火大会があります。母がうちに泊まっていいと言っています。ルーシーに、今度はカエルの折り方を教えると伝えてください。`,
    qs: [
      { q: 'What did Kenta do for the first time in Canada?', c: ['He caught a fish.', 'He made paper cranes.', 'He took a Japanese class.', 'He saw fireworks.'], x: '"It was my first time to catch a fish!" とある。' },
      { q: 'What did Lucy learn from Kenta?', c: ['Origami.', 'Japanese.', 'Fishing.', 'Cooking.'], x: '"Lucy says you were a great teacher. She is still practicing origami every day." とある。' },
      { q: 'What will the Wilsons probably do next summer?', c: ['Visit Kenta\'s town.', 'Go camping at the lake.', 'Take a Japanese class.', 'Move to Japan.'], x: '"Next summer, we are planning to visit Japan. Can you show us around your town?" とある。' },
    ],
  },
  {
    id: '3B-festival', type: 'B', title: 'The School Festival',
    body: `From: Mika Tanaka
To: Lisa Green
Date: October 2
Subject: School festival

Hi Lisa,
Our school festival is on Saturday, October 15. Can you come? My class is going to do a play. It's a Japanese folk story, and I'm going to be a fox! We have practiced it every day after school for two weeks. The brass band will also play some famous songs. My brother is in the band, and he plays the trumpet.
Mika

From: Lisa Green
To: Mika Tanaka
Date: October 3
Subject: Re: School festival

Hi Mika,
Thanks for inviting me! I'd love to come. What time does your play start? I have a piano lesson on Saturday morning, but it finishes at 11:00. Can I bring my sister, Amy? She is interested in Japanese stories. Also, is there any food at the festival? We can have lunch there together.
Lisa

From: Mika Tanaka
To: Lisa Green
Date: October 4
Subject: Re: Re: School festival

Hi Lisa,
Our play starts at 1:30 in the gym, so you'll have enough time. Of course Amy can come, too! There are many food stands at the festival. The third-year students sell curry, and the tea ceremony club serves Japanese sweets. Let's meet at the school gate at 12:00.
Mika`,
    ja: `（1通目）ミカからリサへ：10月15日（土）に学校の文化祭があるの。来られる？ 私のクラスは劇をするよ。日本の昔話で、私はキツネ役！2週間毎日放課後に練習してきたの。吹奏楽部も有名な曲を演奏するよ。兄が部員でトランペットをふくの。\n（2通目）リサからミカへ：誘ってくれてありがとう！ぜひ行きたい。劇は何時に始まるの？ 土曜の午前中はピアノのレッスンがあるけど11時に終わるよ。妹のエイミーを連れて行ってもいい？ 日本の物語に興味があるの。それと、文化祭で何か食べ物はある？ いっしょにお昼を食べられるね。\n（3通目）ミカからリサへ：劇は1時30分に体育館で始まるから、時間は十分あるよ。もちろんエイミーも来ていいよ！食べ物の屋台がたくさんあるの。3年生がカレーを売って、茶道部が和菓子を出すよ。12時に校門で会おう。`,
    qs: [
      { q: 'What will Mika do in the play?', c: ['She will be a fox.', 'She will play the trumpet.', 'She will sell curry.', 'She will serve Japanese sweets.'], x: '"I\'m going to be a fox!" とある。' },
      { q: 'What does Lisa do on Saturday morning?', c: ['She has a piano lesson.', 'She practices a play.', 'She goes to the gym.', 'She cooks lunch with Amy.'], x: '"I have a piano lesson on Saturday morning" とある。' },
      { q: 'Where will Mika and Lisa meet?', c: ['At the school gate.', 'In the gym.', 'At the food stands.', 'At Lisa\'s house.'], x: '"Let\'s meet at the school gate at 12:00." とある。' },
    ],
  },
  {
    id: '3B-teacher', type: 'B', title: 'A Letter to Ms. Hill',
    body: `From: Takuya Ito
To: Ms. Hill
Date: February 20
Subject: My speech

Dear Ms. Hill,
I have a question about the English speech contest next month. I want to talk about my grandfather. He is 80 years old, but he still works on his farm every day. He grows rice and many kinds of vegetables. I think his life is very interesting. Is this a good topic? Also, how long should my speech be?
Takuya

From: Ms. Hill
To: Takuya Ito
Date: February 21
Subject: Re: My speech

Dear Takuya,
Your grandfather sounds like a wonderful person! I think it's a great topic. Your speech should be about three minutes long. Try to tell the audience why his work is important for your town. Also, you can show some pictures of his farm during your speech. After you write your speech, please bring it to the teachers' room. I will check it for you.
Ms. Hill

From: Takuya Ito
To: Ms. Hill
Date: February 24
Subject: Thank you

Dear Ms. Hill,
Thank you for your advice. I visited my grandfather last weekend and asked him many questions. He told me that he started farming when he was fifteen. I also took a lot of pictures of his vegetables. I'll bring my speech to you on Friday.
Takuya`,
    ja: `（1通目）タクヤからヒル先生へ：来月の英語スピーチコンテストについて質問です。祖父について話したいです。80歳ですが、今も毎日畑で働いています。米やいろいろな野菜を育てています。よいテーマでしょうか。また、スピーチはどのくらいの長さにすべきですか。\n（2通目）ヒル先生からタクヤへ：すばらしいおじいさんですね！とてもよいテーマだと思います。スピーチは約3分にしてください。おじいさんの仕事がなぜ町にとって大切なのかを伝えるようにしましょう。スピーチ中に畑の写真を見せてもいいですね。書けたら職員室に持ってきてください。確認します。\n（3通目）タクヤからヒル先生へ：アドバイスをありがとうございます。先週末祖父を訪ねて、たくさん質問しました。15歳のときに農業を始めたそうです。野菜の写真もたくさん撮りました。金曜日にスピーチを持っていきます。`,
    qs: [
      { q: 'What does Takuya want to talk about in his speech?', c: ['His grandfather.', 'His favorite vegetables.', 'His English teacher.', 'His trip to a farm.'], x: '"I want to talk about my grandfather." とある。' },
      { q: 'How long should Takuya\'s speech be?', c: ['About three minutes.', 'About fifteen minutes.', 'About one minute.', 'About eighty seconds.'], x: '"Your speech should be about three minutes long." とある。' },
      { q: 'What did Takuya do last weekend?', c: ['He visited his grandfather.', 'He started farming.', 'He took his speech to the teachers\' room.', 'He won a speech contest.'], x: '"I visited my grandfather last weekend and asked him many questions." とある。' },
    ],
  },
  {
    id: '3C-teddy', type: 'C', title: 'The Teddy Bear',
    body: `The Teddy Bear

Many children around the world have teddy bears. They are soft and cute, and children often sleep with them. But do you know how the teddy bear got its name?

In 1902, Theodore Roosevelt, the President of the United States, went hunting in Mississippi. People around him wanted him to shoot a bear, so they caught a small bear and tied it to a tree. But Roosevelt said, "I won't shoot it. That's not fair." The news soon spread across the country.

A newspaper artist drew a picture of this story. Many people saw the picture and liked it. Morris Michtom, a man who had a small shop in New York, also saw it. He and his wife made a soft toy bear and put it in their shop window. They called it "Teddy's bear," because people called the President "Teddy."

The toy bear became very popular, and many people wanted to buy one. Michtom started a toy company, and it sold a lot of bears. Around the same time, a German company also made toy bears, and they became popular in America and Europe.

Today, there are teddy bear museums in many countries. Some old teddy bears are very expensive. In 1994, one old teddy bear was sold for about 110,000 pounds in London. For many people, a teddy bear is not just a toy. It's a good friend.`,
    ja: `テディベア\n世界中の多くの子どもがテディベアを持っています。やわらかくてかわいく、子どもたちはよくいっしょに眠ります。でも、テディベアがどのようにその名前になったか知っていますか。\n1902年、アメリカ大統領のセオドア・ルーズベルトはミシシッピ州に狩りに行きました。周りの人々は彼にクマを撃ってほしかったので、小さなクマをつかまえて木にしばりました。しかしルーズベルトは「撃たない。それは公平ではない」と言いました。このニュースはすぐに国中に広まりました。\nある新聞の画家がこの話の絵をかきました。多くの人がその絵を見て気に入りました。ニューヨークで小さな店を持っていたモリス・ミットムもそれを見ました。彼と妻はやわらかいクマのおもちゃを作り、店の窓に置きました。人々が大統領を「テディ」と呼んでいたので、彼らはそれを「テディのクマ」と名づけました。\nそのクマのおもちゃはとても人気になり、多くの人が買いたがりました。ミットムはおもちゃ会社を始め、たくさんのクマを売りました。同じころ、ドイツの会社もクマのおもちゃを作り、アメリカやヨーロッパで人気になりました。\n今日、多くの国にテディベアの博物館があります。とても高価な古いテディベアもあります。1994年には、古いテディベアがロンドンで約11万ポンドで売られました。多くの人にとって、テディベアはただのおもちゃではありません。よい友達なのです。`,
    qs: [
      { q: 'Why did people catch a small bear in 1902?', c: ['They wanted the President to shoot it.', 'They wanted to make a toy.', 'They wanted to take it to a zoo.', 'They wanted to draw a picture of it.'], x: '"People around him wanted him to shoot a bear, so they caught a small bear" とある。' },
      { q: 'What did Morris Michtom see?', c: ['A picture in a newspaper.', 'The President in Mississippi.', 'A German toy bear.', 'A bear in his shop.'], x: '新聞の画家がかいた絵を "Morris Michtom ... also saw it." とある。' },
      { q: 'Why was the toy called "Teddy\'s bear"?', c: ['Because people called the President "Teddy."', 'Because Michtom\'s son was named Teddy.', 'Because a German company named it.', 'Because the bear\'s name was Teddy.'], x: '"because people called the President \'Teddy.\'" とある。' },
      { q: 'What happened in London in 1994?', c: ['An old teddy bear was sold for a lot of money.', 'The first teddy bear museum opened.', 'Michtom started a toy company.', 'A German company made toy bears.'], x: '"In 1994, one old teddy bear was sold for about 110,000 pounds in London." とある。' },
      { q: 'What is this story about?', c: ['How the teddy bear got its name and became popular.', 'How to make a teddy bear.', 'The life of a German toy maker.', 'Why bears live in Mississippi.'], x: 'テディベアの名前の由来と、人気になった歴史についての文章。' },
    ],
  },
  {
    id: '3C-lucy', type: 'C', title: 'Lucy\'s Bakery',
    body: `Lucy's Bakery

Lucy Park lives in a small town in Canada. When she was a child, her grandmother often baked bread for her family. Lucy loved the smell of fresh bread in the morning. She always helped her grandmother in the kitchen. "Someday, I want to have my own bakery," she said.

After high school, Lucy went to a cooking school in Toronto. The lessons were hard, and she had to get up at four every morning. Sometimes she wanted to give up. But her grandmother sent her letters and said, "Don't give up. Your bread makes people happy."

When she was twenty-five, Lucy came back to her town and opened a small bakery. At first, only a few people came to her shop. Lucy was worried. Then she had an idea. She made bread with local vegetables and fruit, like pumpkin bread and blueberry rolls. She also started a bread-making class for children on weekends.

Soon, her bakery became popular. People came from other towns to buy her pumpkin bread. The children in her class told their parents about the bakery, too.

Now, Lucy's grandmother is ninety years old. Every Sunday morning, Lucy brings her a loaf of fresh bread. Her grandmother always smiles and says, "This is the best bread in the world."`,
    ja: `ルーシーのパン屋\nルーシー・パークはカナダの小さな町に住んでいます。子どものころ、祖母はよく家族のためにパンを焼いていました。ルーシーは朝の焼きたてのパンのにおいが大好きでした。いつも台所で祖母を手伝いました。「いつか自分のパン屋を持ちたい」と彼女は言っていました。\n高校卒業後、ルーシーはトロントの料理学校に行きました。授業は大変で、毎朝4時に起きなければなりませんでした。あきらめたくなることもありました。しかし祖母が手紙を送ってくれて「あきらめないで。あなたのパンは人を幸せにするのよ」と言いました。\n25歳のとき、ルーシーは町に戻り、小さなパン屋を開きました。最初は数人しか店に来ませんでした。ルーシーは心配しました。そこで彼女はあることを思いつきました。カボチャのパンやブルーベリーのロールパンのように、地元の野菜や果物を使ってパンを作ったのです。週末には子ども向けのパン作り教室も始めました。\nまもなく彼女のパン屋は人気になりました。ほかの町からもカボチャのパンを買いに人々が来ました。教室の子どもたちも両親にパン屋のことを話しました。\n今、ルーシーの祖母は90歳です。毎週日曜日の朝、ルーシーは焼きたてのパンを1斤届けます。祖母はいつもほほえんで「これは世界一のパンだね」と言います。`,
    qs: [
      { q: 'What did Lucy do when she was a child?', c: ['She helped her grandmother in the kitchen.', 'She went to a cooking school.', 'She sold bread at a bakery.', 'She lived in Toronto.'], x: '"She always helped her grandmother in the kitchen." とある。' },
      { q: 'Why did Lucy sometimes want to give up at cooking school?', c: ['The lessons were hard.', 'She didn\'t like bread.', 'Her grandmother was sick.', 'She wanted to go back to high school.'], x: '"The lessons were hard, and she had to get up at four every morning. Sometimes she wanted to give up." とある。' },
      { q: 'What was Lucy\'s idea?', c: ['To make bread with local vegetables and fruit.', 'To move her bakery to Toronto.', 'To sell bread only on Sundays.', 'To make her bakery bigger.'], x: '"She made bread with local vegetables and fruit" とある。' },
      { q: 'Who told their parents about Lucy\'s bakery?', c: ['The children in her class.', 'Her grandmother\'s friends.', 'People from other towns.', 'Her teachers in Toronto.'], x: '"The children in her class told their parents about the bakery, too." とある。' },
      { q: 'What does Lucy do every Sunday morning?', c: ['She takes bread to her grandmother.', 'She teaches a bread-making class.', 'She goes to Toronto.', 'She writes letters to her grandmother.'], x: '"Every Sunday morning, Lucy brings her a loaf of fresh bread." とある。' },
    ],
  },
  {
    id: '3C-penguins', type: 'C', title: 'Emperor Penguins',
    body: `Emperor Penguins

Emperor penguins are the biggest penguins in the world. They are about 115 centimeters tall and weigh about 30 kilograms. They live in Antarctica, one of the coldest places on the earth. In winter, the temperature can be minus 40 degrees.

Emperor penguins cannot fly, but they are very good swimmers. They can dive to a depth of more than 500 meters to catch fish. They can also stay under the water for about 20 minutes.

The life of emperor penguins is very interesting. In winter, the mother penguin lays one egg. Then she gives it to the father and goes to the sea to eat. The father keeps the egg warm on his feet for about two months. During this time, he doesn't eat anything. Many fathers stand close together in a big group because it helps them stay warm in the strong wind.

When the baby is born, the mother comes back with food in her stomach. Then the father goes to the sea because he is very hungry. After that, the parents take turns going to the sea and bringing food to their baby.

Today, emperor penguins have a big problem. Because the earth is getting warmer, the ice in Antarctica is melting. Penguins need ice to have their babies. Scientists say that we must protect the environment to save these amazing birds.`,
    ja: `コウテイペンギン\nコウテイペンギンは世界最大のペンギンです。身長約115センチ、体重約30キロです。地球でもっとも寒い場所の1つ、南極に住んでいます。冬には気温がマイナス40度になることもあります。\nコウテイペンギンは飛べませんが、泳ぐのがとても得意です。魚をとるために500メートル以上の深さまでもぐれます。約20分水中にいることもできます。\nコウテイペンギンの生活はとても興味深いです。冬に母親は卵を1つ産みます。そして卵を父親に渡し、食べるために海へ行きます。父親は約2か月間、卵を足の上で温めます。この間、父親は何も食べません。強い風の中で暖かくいられるように、多くの父親が大きな集団でぴったり寄りそって立ちます。\n赤ちゃんが生まれると、母親が胃に食べ物を入れて戻ってきます。すると父親は、とてもおなかがすいているので海へ行きます。そのあと両親は交代で海へ行き、赤ちゃんに食べ物を運びます。\n今日、コウテイペンギンは大きな問題をかかえています。地球が暖かくなっているため、南極の氷がとけているのです。ペンギンは子育てに氷が必要です。科学者たちは、このすばらしい鳥を救うために環境を守らなければならないと言っています。`,
    qs: [
      { q: 'What can emperor penguins do?', c: ['Dive more than 500 meters.', 'Fly for 20 minutes.', 'Live in warm places.', 'Swim without eating for a year.'], x: '"They can dive to a depth of more than 500 meters" とある。' },
      { q: 'What does the mother penguin do after she lays an egg?', c: ['She goes to the sea to eat.', 'She keeps the egg on her feet.', 'She stands in a big group.', 'She makes a nest of ice.'], x: '"she gives it to the father and goes to the sea to eat." とある。' },
      { q: 'Why do many fathers stand close together?', c: ['To stay warm in the strong wind.', 'To catch fish together.', 'To find their babies.', 'To wait for the scientists.'], x: '"it helps them stay warm in the strong wind." とある。' },
      { q: 'What happens when the baby is born?', c: ['The father goes to the sea.', 'The mother lays another egg.', 'The baby starts swimming.', 'The father stops eating.'], x: '赤ちゃんが生まれると母親が戻り、"Then the father goes to the sea because he is very hungry." とある。' },
      { q: 'What is a big problem for emperor penguins today?', c: ['The ice in Antarctica is melting.', 'There are too many fish.', 'The winter is getting longer.', 'People are catching them.'], x: '"the ice in Antarctica is melting. Penguins need ice to have their babies." とある。' },
    ],
  },
  {
    id: '3C-braille', type: 'C', title: 'Louis Braille',
    body: `Louis Braille

Louis Braille was born in France in 1809. His father made things from leather, and little Louis liked to play in his father's workshop. One day, when Louis was three years old, he hurt his eye with a sharp tool. Soon, he could not see with either of his eyes.

When he was ten, Louis went to a special school for blind children in Paris. At that time, books for blind people had big raised letters. Students touched the letters with their fingers to read. But these books were very heavy, and reading them was slow. There were only a few books at the school.

One day, a soldier visited the school. He showed the students a system called "night writing." Soldiers used it to read messages in the dark without light. It used raised dots on paper. Louis became very interested in it. But the system was difficult to use because it had too many dots.

Louis worked hard to make a better system. He used only six dots for each letter. When he was only fifteen, he finished his new system. Students could read and write much faster with it.

At first, many teachers didn't want to use Louis's system. But the students loved it. After Louis died in 1852, his system became popular around the world. Today, it is called "Braille," and blind people everywhere use it to read books, signs, and even the buttons in elevators.`,
    ja: `ルイ・ブライユ\nルイ・ブライユは1809年にフランスで生まれました。父親は革製品を作っていて、幼いルイは父親の作業場で遊ぶのが好きでした。ある日、3歳のルイはとがった道具で目をけがしました。まもなく両目とも見えなくなりました。\n10歳のとき、ルイはパリの目の見えない子どものための特別な学校に行きました。当時、目の見えない人のための本は大きな浮き出た文字でできていました。生徒は指で文字にさわって読みました。しかしこれらの本はとても重く、読むのに時間がかかりました。学校には本が少ししかありませんでした。\nある日、1人の兵士が学校を訪れました。彼は「夜間文字」というしくみを生徒たちに見せました。兵士たちは明かりなしで暗やみの中でメッセージを読むのにそれを使っていました。紙の上の浮き出た点を使うものでした。ルイはそれにとても興味を持ちました。しかし点が多すぎて使うのが難しいしくみでした。\nルイはよりよいしくみを作るために一生懸命取り組みました。各文字に6つの点だけを使いました。わずか15歳のとき、新しいしくみを完成させました。生徒たちはそれでずっと速く読み書きできるようになりました。\n最初、多くの先生はルイのしくみを使いたがりませんでした。しかし生徒たちは大好きでした。1852年にルイが亡くなったあと、彼のしくみは世界中に広まりました。今日それは「点字（ブライユ）」と呼ばれ、世界中の目の見えない人々が本や標識、エレベーターのボタンまで読むのに使っています。`,
    qs: [
      { q: 'What happened to Louis when he was three years old?', c: ['He hurt his eye.', 'He went to Paris.', 'He met a soldier.', 'He made a new system.'], x: '"when Louis was three years old, he hurt his eye with a sharp tool." とある。' },
      { q: 'What was the problem with the books at Louis\'s school?', c: ['They were heavy and slow to read.', 'They had no letters.', 'They were too expensive.', 'They were written in English.'], x: '"these books were very heavy, and reading them was slow." とある。' },
      { q: 'Why did soldiers use "night writing"?', c: ['To read messages in the dark.', 'To teach blind children.', 'To write letters to their families.', 'To make books lighter.'], x: '"Soldiers used it to read messages in the dark without light." とある。' },
      { q: 'How old was Louis when he finished his new system?', c: ['Fifteen.', 'Ten.', 'Three.', 'Six.'], x: '"When he was only fifteen, he finished his new system." とある。' },
      { q: 'What did many teachers think about Louis\'s system at first?', c: ['They didn\'t want to use it.', 'They loved it.', 'They wanted to change it to eight dots.', 'They thought it was too fast.'], x: '"At first, many teachers didn\'t want to use Louis\'s system." とある。' },
    ],
  },
];
