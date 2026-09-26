// 英検3級の単語・熟語・会話表現（オリジナルの例文つき）
// 1行 = 単語|品詞|意味|例文（{ } が見出し語）|例文の訳|重要度（1=最重要 2=重要 3=おさえたい）|変化形（不規則動詞など）
// 品詞：名 動 形 副 前 接 代 助 熟（熟語）会（会話表現）

export const WORDS_RAW = String.raw`
answer|名/動|答え；答える|Can you {answer} my question?|私の質問に答えてくれますか。|1
area|名|地域；区域|There are many parks in this {area}.|この地域には公園がたくさんあります。|2
art|名|芸術；美術|I am interested in {art}.|私は芸術に興味があります。|1
beach|名|浜辺；海岸|We played volleyball on the {beach}.|私たちは浜辺でバレーボールをしました。|1
bakery|名|パン屋|I bought some bread at the {bakery}.|私はパン屋でパンを買いました。|2
bottle|名|びん；ボトル|Please bring a {bottle} of water.|水を1本持ってきてください。|2
bridge|名|橋|There is a long {bridge} over the river.|川に長い橋がかかっています。|2
building|名|建物；ビル|That tall {building} is a hotel.|あの高い建物はホテルです。|1
camera|名|カメラ|My father gave me a new {camera}.|父が新しいカメラをくれました。|2
castle|名|城|We visited an old {castle} in Himeji.|私たちは姫路の古い城を訪れました。|2
century|名|世紀；100年|This temple was built in the 8th {century}.|この寺は8世紀に建てられました。|3
chance|名|機会；チャンス|I had a {chance} to talk with a famous singer.|有名な歌手と話す機会がありました。|1
child|名|子ども|Every {child} in the town loves the festival.|町のどの子どももそのお祭りが大好きです。|1|複数形 children
city|名|市；都市|Osaka is a big {city}.|大阪は大都市です。|1
class|名|授業；クラス|We have a math {class} today.|今日は数学の授業があります。|1
classmate|名|クラスメート|Ken is my {classmate}.|ケンは私のクラスメートです。|1
club|名|クラブ；部|I am in the tennis {club}.|私はテニス部に入っています。|1
coach|名|コーチ；指導者|Our {coach} is very strict.|私たちのコーチはとても厳しいです。|2
college|名|大学|My sister goes to {college} in Tokyo.|姉は東京の大学に通っています。|2
color|名|色|What {color} do you like?|何色が好きですか。|1
company|名|会社|My uncle works for a computer {company}.|おじはコンピューター会社で働いています。|2
concert|名|コンサート|We went to a rock {concert} last night.|私たちは昨夜ロックのコンサートに行きました。|1
contest|名|コンテスト；大会|She won the speech {contest}.|彼女はスピーチコンテストで優勝しました。|1
country|名|国；いなか|Canada is a large {country}.|カナダは大きな国です。|1
course|名|講座；進路|I'm taking a cooking {course}.|私は料理講座を受けています。|3
culture|名|文化|I want to learn about Japanese {culture}.|日本の文化について学びたいです。|1
customer|名|客；顧客|The shop has many {customers} on weekends.|その店は週末に客が多いです。|2
dentist|名|歯医者|I have to go to the {dentist} today.|今日は歯医者に行かなければなりません。|2
department store|名|デパート|Let's go shopping at the {department store}.|デパートに買い物に行こう。|2
dessert|名|デザート|What would you like for {dessert}?|デザートは何にしますか。|2
dictionary|名|辞書|Can I use your {dictionary}?|あなたの辞書を使ってもいいですか。|1
dish|名|皿；料理|Please wash the {dish}.|お皿を洗ってください。|2|複数形 dishes
doctor|名|医者|I want to be a {doctor} in the future.|将来医者になりたいです。|1
dream|名/動|夢；夢を見る|My {dream} is to travel around the world.|私の夢は世界中を旅行することです。|1
environment|名|環境|We should protect the {environment}.|私たちは環境を守るべきです。|2
event|名|行事；出来事|The school has a big {event} in June.|学校では6月に大きな行事があります。|1
example|名|例|Can you give me an {example}?|例をあげてくれますか。|1
experience|名/動|経験；経験する|It was a great {experience} for me.|それは私にとってすばらしい経験でした。|1
factory|名|工場|My father works at a car {factory}.|父は自動車工場で働いています。|2
farm|名|農場|My grandparents have a {farm} in Hokkaido.|祖父母は北海道に農場を持っています。|2
festival|名|祭り|The summer {festival} starts tomorrow.|夏祭りは明日始まります。|1
field|名|野原；競技場|The children are playing in the {field}.|子どもたちは野原で遊んでいます。|2
floor|名|床；階|The shoe store is on the third {floor}.|靴屋は3階にあります。|1
future|名|将来；未来|What do you want to do in the {future}?|将来何をしたいですか。|1
garden|名|庭|My mother grows tomatoes in the {garden}.|母は庭でトマトを育てています。|1
gift|名|贈り物|This is a {gift} for you.|これはあなたへの贈り物です。|2
goal|名|目標；ゴール|My {goal} is to pass the test.|私の目標はそのテストに合格することです。|2
grade|名|学年；成績|I'm in the ninth {grade}.|私は9年生（中3）です。|2
guest|名|客；招待客|We had some {guests} at our party.|パーティーにお客さんが何人か来ました。|2
guide|名/動|案内人；案内する|Our {guide} told us about the history of the temple.|ガイドがお寺の歴史について話してくれました。|2
health|名|健康|Walking is good for your {health}.|歩くことは健康によいです。|1
history|名|歴史|I like {history} the best of all subjects.|すべての教科の中で歴史がいちばん好きです。|1
hobby|名|趣味|My {hobby} is taking pictures.|私の趣味は写真を撮ることです。|1
holiday|名|休日；祝日|Tomorrow is a {holiday}.|明日は祝日です。|1
hospital|名|病院|My grandfather is in the {hospital}.|祖父は入院しています。|1
idea|名|考え；アイデア|That's a good {idea}.|それはいい考えですね。|1
information|名|情報|You can get {information} on the Internet.|インターネットで情報を得られます。|1
instrument|名|楽器；道具|Can you play any musical {instrument}?|何か楽器を演奏できますか。|2
interview|名|面接；インタビュー|I had an {interview} for a part-time job.|アルバイトの面接を受けました。|2
job|名|仕事|My father has a new {job}.|父は新しい仕事に就きました。|1
language|名|言語；言葉|How many {languages} can you speak?|何か国語を話せますか。|1
lesson|名|授業；レッスン|I take piano {lessons} every Friday.|毎週金曜日にピアノのレッスンを受けています。|1
letter|名|手紙；文字|I wrote a {letter} to my grandmother.|祖母に手紙を書きました。|1
library|名|図書館|I often study in the {library}.|私はよく図書館で勉強します。|1
life|名|生活；人生；命|{Life} in the city is very busy.|都会の生活はとても忙しいです。|1|複数形 lives
magazine|名|雑誌|She is reading a fashion {magazine}.|彼女はファッション雑誌を読んでいます。|2
map|名|地図|Let's look at the {map}.|地図を見てみよう。|1
meal|名|食事|We have three {meals} a day.|私たちは1日に3回食事をします。|2
meeting|名|会議；集まり|The {meeting} will start at ten.|会議は10時に始まります。|1
member|名|一員；メンバー|He is a {member} of the soccer team.|彼はサッカーチームの一員です。|1
menu|名|メニュー|Can I see the {menu}, please?|メニューを見せてもらえますか。|2
message|名|伝言；メッセージ|Can I leave a {message}?|伝言をお願いできますか。|1
money|名|お金|I'm saving {money} for a new bike.|新しい自転車のためにお金をためています。|1
museum|名|博物館；美術館|We went to the art {museum} yesterday.|昨日美術館に行きました。|1
nature|名|自然|I love {nature}, so I often go hiking.|自然が大好きなので、よくハイキングに行きます。|1
neighbor|名|隣人；近所の人|Our {neighbor} has a big dog.|うちの近所の人は大きな犬を飼っています。|2
news|名|ニュース；知らせ|I have good {news} for you.|あなたによい知らせがあります。|1
newspaper|名|新聞|My father reads the {newspaper} every morning.|父は毎朝新聞を読みます。|1
nurse|名|看護師|My aunt is a {nurse}.|おばは看護師です。|2
office|名|事務所；会社|My mother goes to the {office} by train.|母は電車で会社に行きます。|1
parent|名|親|My {parents} are from Kyoto.|私の両親は京都出身です。|1
part|名|部分；役|This is the best {part} of the movie.|ここが映画のいちばんいいところです。|2
party|名|パーティー|Let's have a birthday {party} for Yuki.|ユキの誕生日パーティーを開こう。|1
passport|名|パスポート|Don't forget your {passport}.|パスポートを忘れないでね。|3
pet|名|ペット|Do you have any {pets}?|何かペットを飼っていますか。|1
photo|名|写真|Can I take a {photo} here?|ここで写真を撮ってもいいですか。|1
picnic|名|ピクニック|Let's go on a {picnic} this Sunday.|今度の日曜日にピクニックに行こう。|2
pilot|名|パイロット|He wants to be a {pilot}.|彼はパイロットになりたがっています。|3
place|名|場所|This park is my favorite {place}.|この公園は私のお気に入りの場所です。|1
plan|名/動|計画；計画する|What are your {plans} for the summer?|夏の予定は何ですか。|1
player|名|選手；演奏者|He is a famous baseball {player}.|彼は有名な野球選手です。|1
pocket|名|ポケット|I put the key in my {pocket}.|私はかぎをポケットに入れました。|3
police|名|警察|Call the {police}!|警察を呼んで！|2
post office|名|郵便局|Where is the {post office}?|郵便局はどこですか。|2
poster|名|ポスター|We made a {poster} for the festival.|お祭りのためにポスターを作りました。|2
practice|名/動|練習；練習する|We have soccer {practice} after school.|放課後にサッカーの練習があります。|1
present|名|贈り物；現在|I got a {present} from my aunt.|おばからプレゼントをもらいました。|1
price|名|値段|The {price} of this bag is 3,000 yen.|このかばんの値段は3,000円です。|2
prize|名|賞；賞品|She won first {prize} in the contest.|彼女はコンテストで1等賞を取りました。|2
problem|名|問題|No {problem}.|問題ないよ（いいよ）。|1
program|名|番組；計画|I watched an interesting TV {program}.|おもしろいテレビ番組を見ました。|1
project|名|計画；課題|We worked on a science {project} together.|私たちはいっしょに理科の課題に取り組みました。|2
rain|名/動|雨；雨が降る|It will {rain} tomorrow.|明日は雨が降るでしょう。|1
reason|名|理由|Tell me the {reason}.|理由を教えて。|1
report|名/動|報告書；レポート|I have to write a {report} about recycling.|リサイクルについてレポートを書かなければなりません。|2
restaurant|名|レストラン|Let's eat at an Italian {restaurant}.|イタリアンレストランで食べよう。|1
rule|名|規則；ルール|We must follow the school {rules}.|学校の規則に従わなければなりません。|2
sale|名|販売；特売|These shoes are on {sale}.|この靴はセール中です。|2
sandwich|名|サンドイッチ|I made a {sandwich} for lunch.|昼食にサンドイッチを作りました。|2
science|名|理科；科学|{Science} is my favorite subject.|理科は私の好きな教科です。|1
sea|名|海|We swam in the {sea}.|私たちは海で泳ぎました。|1
season|名|季節|Which {season} do you like the best?|どの季節がいちばん好きですか。|1
seat|名|座席|Is this {seat} free?|この席は空いていますか。|2
shop|名/動|店；買い物をする|There is a flower {shop} near my house.|家の近くに花屋があります。|1
shopping|名|買い物|Let's go {shopping} together.|いっしょに買い物に行こう。|1
sign|名|標識；合図|The {sign} says "No Parking."|標識には「駐車禁止」と書いてあります。|3
singer|名|歌手|She is my favorite {singer}.|彼女は私の大好きな歌手です。|1
size|名|大きさ；サイズ|Do you have this in a smaller {size}?|これのもっと小さいサイズはありますか。|2
sky|名|空|The {sky} is blue today.|今日は空が青いです。|1
snack|名|軽食；おやつ|I usually eat a {snack} after school.|放課後はたいていおやつを食べます。|2
snow|名/動|雪；雪が降る|We had a lot of {snow} last winter.|去年の冬は雪がたくさん降りました。|1
speech|名|スピーチ；演説|I made a {speech} in English.|英語でスピーチをしました。|1
stadium|名|スタジアム；競技場|The {stadium} was full of fans.|スタジアムはファンでいっぱいでした。|2
station|名|駅|How can I get to the {station}?|駅へはどう行けばいいですか。|1
story|名|物語；話|My grandmother told me an interesting {story}.|祖母がおもしろい話をしてくれました。|1
student|名|生徒；学生|There are 30 {students} in my class.|私のクラスには生徒が30人います。|1
subject|名|教科；話題|What {subject} do you like?|どの教科が好きですか。|1
supermarket|名|スーパーマーケット|My mother went to the {supermarket}.|母はスーパーに行きました。|1
team|名|チーム|Our {team} won the game.|私たちのチームが試合に勝ちました。|1
temple|名|寺|We visited many {temples} in Kyoto.|京都でたくさんのお寺を訪れました。|2
test|名|テスト|I have a math {test} tomorrow.|明日は数学のテストがあります。|1
ticket|名|切符；チケット|I bought two {tickets} for the concert.|コンサートのチケットを2枚買いました。|1
tour|名|旅行；見学|We took a bus {tour} of the city.|私たちは市内のバスツアーに参加しました。|2
tourist|名|観光客|Many {tourists} visit Kyoto every year.|毎年多くの観光客が京都を訪れます。|2
town|名|町|I live in a small {town}.|私は小さな町に住んでいます。|1
toy|名|おもちゃ|My brother has a lot of {toys}.|弟はおもちゃをたくさん持っています。|2
traffic|名|交通|There is a lot of {traffic} today.|今日は交通量が多いです。|3
train|名|電車|I go to school by {train}.|私は電車で通学しています。|1
trip|名|旅行|How was your {trip} to Hawaii?|ハワイ旅行はどうでしたか。|1
uniform|名|制服；ユニフォーム|We wear school {uniforms}.|私たちは学校の制服を着ます。|2
vacation|名|休暇；休み|We went to Okinawa during summer {vacation}.|夏休みに沖縄へ行きました。|1
vegetable|名|野菜|You should eat more {vegetables}.|もっと野菜を食べたほうがいいよ。|1
video|名|動画；ビデオ|I watched a funny {video} on the Internet.|インターネットでおもしろい動画を見ました。|1
view|名|眺め；意見|The {view} from the mountain was beautiful.|山からの眺めは美しかった。|2
village|名|村|My grandparents live in a small {village}.|祖父母は小さな村に住んでいます。|2
volunteer|名/動|ボランティア|I worked as a {volunteer} at the hospital.|病院でボランティアとして働きました。|1
weather|名|天気|How is the {weather} in Tokyo?|東京の天気はどうですか。|1
weekend|名|週末|What did you do last {weekend}?|先週末は何をしましたか。|1
world|名|世界|I want to travel around the {world}.|世界中を旅行したいです。|1
writer|名|作家|She is a famous {writer}.|彼女は有名な作家です。|1
zoo|名|動物園|We saw pandas at the {zoo}.|動物園でパンダを見ました。|1
airport|名|空港|I'll meet you at the {airport}.|空港で会いましょう。|1
aquarium|名|水族館|We saw dolphins at the {aquarium}.|水族館でイルカを見ました。|2
bus stop|名|バス停|I waited at the {bus stop} for ten minutes.|バス停で10分待ちました。|2
calendar|名|カレンダー|I wrote the date on the {calendar}.|カレンダーに日付を書きました。|3
cafeteria|名|カフェテリア；食堂|Let's have lunch in the {cafeteria}.|食堂でお昼を食べよう。|2
cold|名/形|かぜ；寒い|I have a {cold}.|かぜをひいています。|1
comic|名|まんが|I like reading {comics}.|まんがを読むのが好きです。|2
computer|名|コンピューター|I use a {computer} to do my homework.|宿題をするのにコンピューターを使います。|1
convenience store|名|コンビニ|I bought a drink at the {convenience store}.|コンビニで飲み物を買いました。|2
cookie|名|クッキー|My sister made some {cookies}.|姉がクッキーを作りました。|1
costume|名|衣装|She wore a beautiful {costume} for the play.|彼女は劇で美しい衣装を着ました。|3
dancer|名|ダンサー|He is a great {dancer}.|彼はすばらしいダンサーです。|2
date|名|日付|What's the {date} today?|今日は何月何日ですか。|2
dinosaur|名|恐竜|The boy likes {dinosaurs}.|その男の子は恐竜が好きです。|3
drama|名|劇；ドラマ|I'm in the {drama} club.|私は演劇部に入っています。|2
e-mail|名|Eメール|I got an {e-mail} from my friend in Canada.|カナダの友達からEメールが届きました。|1
engineer|名|技術者；エンジニア|My brother is an {engineer}.|兄は技術者です。|2
exam|名|試験|I studied hard for the {exam}.|試験のために一生懸命勉強しました。|2
fan|名|ファン；扇風機|I'm a big {fan} of that team.|私はそのチームの大ファンです。|2
fashion|名|流行；ファッション|She is interested in {fashion}.|彼女はファッションに興味があります。|3
fire|名|火；火事|Be careful with {fire}.|火に気をつけて。|2
fruit|名|果物|I like {fruit} very much.|果物が大好きです。|1
fun|名/形|楽しみ；楽しい|We had a lot of {fun} at the party.|パーティーはとても楽しかったです。|1
glass|名|コップ；ガラス|Can I have a {glass} of water?|水を1杯もらえますか。|2
grandparent|名|祖父母|I visit my {grandparents} every summer.|毎年夏に祖父母を訪ねます。|1
gym|名|体育館；ジム|The basketball team practices in the {gym}.|バスケ部は体育館で練習します。|2
homework|名|宿題|Did you finish your {homework}?|宿題は終わった？|1
hotel|名|ホテル|We stayed at a {hotel} near the sea.|海の近くのホテルに泊まりました。|1
house|名|家|Come to my {house} after school.|放課後うちに来てね。|1
Internet|名|インターネット|I found the information on the {Internet}.|インターネットでその情報を見つけました。|1
invitation|名|招待；招待状|Thank you for the {invitation}.|ご招待ありがとう。|3
jacket|名|上着|Take your {jacket}. It's cold outside.|上着を持って行って。外は寒いよ。|2
kitchen|名|台所|My father is cooking in the {kitchen}.|父は台所で料理をしています。|1
lake|名|湖|We went fishing at the {lake}.|湖に釣りに行きました。|2
lunch|名|昼食|What did you have for {lunch}?|お昼に何を食べましたか。|1
machine|名|機械|This {machine} is very useful.|この機械はとても便利です。|3
matter|名|事柄；問題|What's the {matter}?|どうしたの？|1
medicine|名|薬|Take this {medicine} after meals.|食後にこの薬を飲んでください。|2
minute|名|分；ちょっとの間|Wait a {minute}.|ちょっと待って。|1
mountain|名|山|We climbed a {mountain} last summer.|去年の夏に山に登りました。|1
movie|名|映画|Let's go to see a {movie}.|映画を見に行こう。|1
musician|名|音楽家；ミュージシャン|He wants to be a {musician}.|彼は音楽家になりたいと思っています。|2
noon|名|正午|Let's meet at {noon}.|正午に会おう。|2
ocean|名|大洋；海|The Pacific {Ocean} is very large.|太平洋はとても広いです。|2
painting|名|絵；絵をかくこと|This is a famous {painting}.|これは有名な絵です。|2
passenger|名|乗客|The bus had many {passengers}.|バスには乗客がたくさんいました。|3
pool|名|プール|Let's swim in the {pool}.|プールで泳ごう。|1
river|名|川|We swam in the {river}.|私たちは川で泳ぎました。|1
road|名|道路|Be careful when you cross the {road}.|道路を渡るときは気をつけて。|2
roof|名|屋根|There is a cat on the {roof}.|屋根の上にネコがいます。|3
room|名|部屋|Clean your {room}.|部屋をかたづけなさい。|1
schedule|名|予定；時間割|My {schedule} is full this week.|今週は予定がいっぱいです。|2
scientist|名|科学者|I want to be a {scientist}.|私は科学者になりたいです。|2
shoe|名|靴|I bought a new pair of {shoes}.|新しい靴を1足買いました。|1
sightseeing|名|観光|We went {sightseeing} in Nara.|奈良へ観光に行きました。|2
smartphone|名|スマートフォン|I use my {smartphone} to take pictures.|スマホで写真を撮ります。|2
souvenir|名|おみやげ|I bought some {souvenirs} for my friends.|友達におみやげを買いました。|2
space|名|宇宙；空間|I want to go to {space} someday.|いつか宇宙に行きたいです。|2
sport|名|スポーツ|What {sport} do you like?|何のスポーツが好きですか。|1
stage|名|舞台；ステージ|The band is on the {stage}.|バンドがステージにいます。|2
star|名|星；スター|We saw many {stars} last night.|昨夜はたくさんの星が見えました。|1
stomachache|名|腹痛|I have a {stomachache}.|おなかが痛いです。|2
store|名|店|The {store} opens at nine.|その店は9時に開きます。|1
street|名|通り|Walk along this {street}.|この通りに沿って歩いてください。|1
sweater|名|セーター|My grandmother made this {sweater} for me.|祖母がこのセーターを作ってくれました。|2
teacher|名|先生|Ms. Brown is our English {teacher}.|ブラウン先生は私たちの英語の先生です。|1
tennis|名|テニス|Let's play {tennis}.|テニスをしよう。|1
theater|名|劇場；映画館|We saw a play at the {theater}.|劇場で劇を見ました。|2
thing|名|もの；こと|I have many {things} to do today.|今日はやることがたくさんあります。|1
trash|名|ごみ|Please take out the {trash}.|ごみを出してください。|2
umbrella|名|かさ|Take an {umbrella} with you.|かさを持って行きなさい。|1
university|名|大学|My brother studies at a {university} in Kyoto.|兄は京都の大学で勉強しています。|2
wallet|名|財布|I lost my {wallet} yesterday.|昨日財布をなくしました。|2
war|名|戦争|We should never have a {war}.|戦争は決して起こしてはいけません。|3
website|名|ウェブサイト|You can buy tickets on the {website}.|ウェブサイトでチケットを買えます。|2
wind|名|風|The {wind} is strong today.|今日は風が強いです。|2
winner|名|勝者|The {winner} will get a prize.|勝者は賞品をもらえます。|2
visitor|名|訪問者；来客|The museum has many {visitors}.|その博物館には来館者が多いです。|2
activity|名|活動|Club {activities} are fun.|部活動は楽しいです。|2
adult|名|大人|The ticket is 1,000 yen for an {adult}.|チケットは大人1,000円です。|2
advice|名|助言；アドバイス|Thank you for your {advice}.|アドバイスをありがとう。|2
age|名|年齢|He started playing the piano at the {age} of five.|彼は5歳でピアノを始めました。|2
animal|名|動物|I like {animals}.|私は動物が好きです。|1
bath|名|入浴；ふろ|I take a {bath} every night.|毎晩おふろに入ります。|2
beginner|名|初心者|This class is for {beginners}.|このクラスは初心者向けです。|3
bicycle|名|自転車|I go to school by {bicycle}.|自転車で通学しています。|1
birthday|名|誕生日|Happy {birthday}!|誕生日おめでとう！|1
blanket|名|毛布|I need another {blanket}.|毛布がもう1枚必要です。|3
body|名|体|Exercise is good for your {body}.|運動は体によいです。|2
boss|名|上司|My father's {boss} is very kind.|父の上司はとても親切です。|3
brush|名/動|ブラシ；みがく|Don't forget to {brush} your teeth.|歯をみがくのを忘れないでね。|3
business|名|仕事；商売|My father went to Osaka on {business}.|父は仕事で大阪へ行きました。|3
cake|名|ケーキ|My mother made a birthday {cake}.|母が誕生日ケーキを作りました。|1
captain|名|キャプテン；船長|Ken is the {captain} of our team.|ケンは私たちのチームのキャプテンです。|2
card|名|カード|I sent a birthday {card} to my friend.|友達に誕生日カードを送りました。|1
center|名|中心；センター|The library is in the {center} of the town.|図書館は町の中心にあります。|2
ceremony|名|式；儀式|The graduation {ceremony} is next week.|卒業式は来週です。|3
clerk|名|店員|The {clerk} was very kind to me.|店員はとても親切にしてくれました。|3
clothes|名|衣服|I bought some new {clothes}.|新しい服を買いました。|1
cloud|名|雲|There are no {clouds} in the sky.|空には雲ひとつありません。|2
community|名|地域社会|Our {community} has a big festival every year.|私たちの地域では毎年大きなお祭りがあります。|3
contact|名/動|連絡；連絡する|Please {contact} me by e-mail.|Eメールで私に連絡してください。|3
cousin|名|いとこ|My {cousin} lives in Australia.|いとこはオーストラリアに住んでいます。|2
crowd|名|群衆；人ごみ|There was a big {crowd} at the station.|駅は大変な人ごみでした。|3
danger|名|危険|This animal is in {danger}.|この動物は危機にひんしています。|3
design|名/動|デザイン；設計する|I like the {design} of this T-shirt.|このTシャツのデザインが好きです。|2
difference|名|違い|What's the {difference} between these two?|この2つの違いは何ですか。|3
direction|名|方向|Which {direction} is the station?|駅はどちらの方向ですか。|3
earth|名|地球|We live on the {earth}.|私たちは地球に住んでいます。|2
energy|名|エネルギー|We should save {energy}.|エネルギーを節約すべきです。|3
entrance|名|入口|Let's meet at the {entrance} of the park.|公園の入口で会おう。|2
fact|名|事実|In {fact}, I've never been abroad.|実は、私は外国に行ったことがありません。|3
flight|名|飛行便；フライト|Our {flight} leaves at ten.|私たちの便は10時に出発します。|2
forest|名|森|Many animals live in the {forest}.|森にはたくさんの動物がすんでいます。|2
furniture|名|家具|We bought some new {furniture}.|新しい家具を買いました。|3
grass|名|草；芝生|The children are sitting on the {grass}.|子どもたちが芝生に座っています。|3
group|名|集団；グループ|We worked in a {group}.|私たちはグループで作業しました。|1
hair|名|髪|She has long {hair}.|彼女は髪が長いです。|1
headache|名|頭痛|I have a {headache}.|頭が痛いです。|2
hero|名|英雄；ヒーロー|He is a {hero} in our town.|彼は町のヒーローです。|3
island|名|島|Japan has many {islands}.|日本にはたくさんの島があります。|2
kid|名|子ども|The {kids} are playing in the park.|子どもたちが公園で遊んでいます。|2
leader|名|指導者；リーダー|She is the {leader} of our group.|彼女は私たちのグループのリーダーです。|2
list|名|一覧表；リスト|I made a shopping {list}.|買い物リストを作りました。|2
luck|名|運|Good {luck}!|幸運を祈るよ（がんばってね）！|2
math|名|数学|I'm not good at {math}.|私は数学が得意ではありません。|1
memory|名|思い出；記憶|I have a lot of good {memories} of the trip.|その旅行にはいい思い出がたくさんあります。|2
middle|名|真ん中|There is a table in the {middle} of the room.|部屋の真ん中にテーブルがあります。|2
moon|名|月|The {moon} is beautiful tonight.|今夜は月がきれいです。|2
nest|名|巣|There is a bird's {nest} in the tree.|木に鳥の巣があります。|3
noise|名|音；騒音|Don't make {noise} in the library.|図書館で音を立てないで。|2
order|名/動|注文；注文する|May I take your {order}?|ご注文をおうかがいします。|2
owner|名|持ち主|Who is the {owner} of this bag?|このかばんの持ち主はだれですか。|3
paper|名|紙|Write your name on this {paper}.|この紙に名前を書いてください。|1
pencil case|名|筆箱|I left my {pencil case} at school.|筆箱を学校に置いてきました。|2
plant|名/動|植物；植える|We {plant} flowers in spring.|私たちは春に花を植えます。|2
pie|名|パイ|My grandmother makes delicious apple {pie}.|祖母はおいしいアップルパイを作ります。|2
plastic|名/形|プラスチック|We should use less {plastic}.|プラスチックを使う量を減らすべきです。|3
pollution|名|汚染|Air {pollution} is a big problem.|大気汚染は大きな問題です。|3
population|名|人口|The {population} of this city is growing.|この市の人口は増えています。|3
presentation|名|発表|I made a {presentation} in English class.|英語の授業で発表をしました。|2
professional|名/形|プロ；プロの|He is a {professional} soccer player.|彼はプロのサッカー選手です。|2
question|名|質問|Do you have any {questions}?|何か質問はありますか。|1
race|名|競走；レース|I won the {race}.|私はレースに勝ちました。|2
recipe|名|作り方；レシピ|Can you tell me the {recipe} for this cake?|このケーキの作り方を教えてくれる？|2
salad|名|サラダ|I'll have a {salad}, please.|サラダをお願いします。|2
scarf|名|マフラー；スカーフ|My mother gave me a red {scarf}.|母が赤いマフラーをくれました。|3
shape|名|形|The cake is in the {shape} of a heart.|そのケーキはハートの形をしています。|3
ship|名|船|We went to the island by {ship}.|私たちは船で島へ行きました。|2
shrine|名|神社|We visited a {shrine} on New Year's Day.|元日に神社にお参りしました。|2
side|名|側；側面|There are shops on both {sides} of the street.|通りの両側に店があります。|2
skill|名|技術；技能|You need good {skills} to be a chef.|シェフになるにはよい技術が必要です。|3
smell|名/動|におい；においがする|This curry {smells} good.|このカレーはいいにおいがします。|2
sound|名/動|音；～に聞こえる|That {sounds} like fun.|それは楽しそうだね。|1
spring|名|春|Cherry blossoms bloom in {spring}.|春には桜が咲きます。|1
summer|名|夏|I'm going to go to Hawaii this {summer}.|この夏ハワイに行く予定です。|1
fall|名/動|秋；落ちる|Leaves turn red in {fall}.|秋には葉が赤くなります。|1|fell, fallen
winter|名|冬|I like skiing in {winter}.|冬にスキーをするのが好きです。|1
temperature|名|温度；気温|The {temperature} is high today.|今日は気温が高いです。|3
tooth|名|歯|I have a bad {tooth}.|虫歯があります。|2|複数形 teeth
top|名|頂上；上位|We reached the {top} of the mountain.|私たちは山頂に着きました。|2
tradition|名|伝統|This festival is a Japanese {tradition}.|このお祭りは日本の伝統です。|3
vegetarian|名|菜食主義者|My friend is a {vegetarian}.|私の友達は菜食主義者です。|3
voice|名|声|She has a beautiful {voice}.|彼女は美しい声をしています。|2
wedding|名|結婚式|My aunt's {wedding} is next month.|おばの結婚式は来月です。|3
wood|名|木材|This table is made of {wood}.|このテーブルは木でできています。|3
worker|名|働く人|The {workers} at the factory are very busy.|工場の人たちはとても忙しいです。|3
yard|名|庭|The children are playing in the {yard}.|子どもたちが庭で遊んでいます。|3
arrive|動|到着する|What time will the train {arrive}?|電車は何時に着きますか。|1
ask|動|たずねる；頼む|Can I {ask} you a question?|質問してもいいですか。|1
become|動|～になる|I want to {become} a nurse.|看護師になりたいです。|1|became, become
begin|動|始まる；始める|The movie will {begin} at seven.|映画は7時に始まります。|1|began, begun
believe|動|信じる|I can't {believe} it!|信じられない！|2
borrow|動|借りる|Can I {borrow} your pen?|ペンを借りてもいい？|1
break|動|こわす；折る|Be careful not to {break} the glass.|コップを割らないように気をつけて。|2|broke, broken
bring|動|持ってくる；連れてくる|Please {bring} your lunch tomorrow.|明日はお弁当を持ってきてください。|1|brought, brought
build|動|建てる|They are going to {build} a new school.|彼らは新しい学校を建てる予定です。|1|built, built
buy|動|買う|I want to {buy} a new bike.|新しい自転車を買いたいです。|1|bought, bought
call|動|電話する；呼ぶ|I'll {call} you later.|あとで電話するね。|1
carry|動|運ぶ|Can you help me {carry} this box?|この箱を運ぶのを手伝ってくれる？|1
catch|動|つかまえる；（乗り物に）間に合う|I have to {catch} the first train.|始発電車に乗らなければなりません。|1|caught, caught
change|動/名|変える；変わる；おつり|I want to {change} my hair style.|髪型を変えたいです。|1
check|動|調べる；確認する|Please {check} your answers.|答えを確認してください。|2
choose|動|選ぶ|You can {choose} any color you like.|好きな色を何でも選べます。|1|chose, chosen
clean|動/形|そうじする；きれいな|Let's {clean} the classroom.|教室をそうじしよう。|1
climb|動|登る|We are going to {climb} Mt. Fuji.|富士山に登る予定です。|1
close|動/形|閉める；近い（close to ～）|Please {close} the window.|窓を閉めてください。|1
collect|動|集める|My hobby is to {collect} stamps.|私の趣味は切手を集めることです。|2
continue|動|続ける|Let's {continue} our practice.|練習を続けよう。|2
cook|動/名|料理する；料理人|My father likes to {cook} on Sundays.|父は日曜日に料理をするのが好きです。|1
cost|動|（費用が）かかる|How much does it {cost}?|それはいくらかかりますか。|2|cost, cost
cry|動|泣く；さけぶ|The baby started to {cry}.|赤ちゃんが泣き出しました。|2
cut|動|切る|Please {cut} the cake into six pieces.|ケーキを6つに切ってください。|2|cut, cut
dance|動/名|踊る；ダンス|Let's {dance} together.|いっしょに踊ろう。|1
decide|動|決める|I can't {decide} what to eat.|何を食べるか決められません。|1
die|動|死ぬ；枯れる|The flowers will {die} without water.|水がないと花は枯れてしまいます。|2
draw|動|（線で）かく；引く|Can you {draw} a map for me?|地図をかいてくれる？|1|drew, drawn
drive|動|運転する|My mother can {drive} a car.|母は車を運転できます。|1|drove, driven
drop|動|落とす|Be careful not to {drop} the eggs.|卵を落とさないように気をつけて。|2
enjoy|動|楽しむ|I {enjoy} playing the guitar.|私はギターをひくのを楽しんでいます。|1
enter|動|入る|Please take off your shoes when you {enter} the room.|部屋に入るときは靴を脱いでください。|2
explain|動|説明する|Can you {explain} this word?|この単語を説明してくれますか。|1
feel|動|感じる|I {feel} sick.|気分が悪いです。|1|felt, felt
fight|動|戦う；けんかする|Don't {fight} with your brother.|弟とけんかしないで。|3|fought, fought
find|動|見つける|I can't {find} my key.|かぎが見つかりません。|1|found, found
finish|動|終える|I have to {finish} my homework first.|まず宿題を終わらせなければなりません。|1
fix|動|修理する|Can you {fix} my bike?|自転車を直してくれる？|2
fly|動|飛ぶ|Birds can {fly}.|鳥は飛べます。|2|flew, flown
follow|動|ついて行く；従う|Please {follow} me.|私について来てください。|2
forget|動|忘れる|Don't {forget} to call me.|電話するのを忘れないでね。|1|forgot, forgotten
get|動|手に入れる；着く|What time did you {get} home?|何時に家に着きましたか。|1|got, got / gotten
give|動|与える|I'll {give} you this book.|この本をあげるよ。|1|gave, given
grow|動|育てる；成長する|We {grow} rice in this area.|この地域では米を育てています。|1|grew, grown
guess|動|推測する|{Guess} what happened!|何があったか当ててみて！|2
happen|動|起こる|What {happened} to you?|どうしたの？|1
hear|動|聞こえる|Can you {hear} me?|私の声が聞こえますか。|1|heard, heard
help|動/名|手伝う；助け|Can you {help} me with my homework?|宿題を手伝ってくれる？|1
hide|動|かくす；かくれる|The cat likes to {hide} under the bed.|そのネコはベッドの下にかくれるのが好きです。|3|hid, hidden
hit|動|打つ；ぶつかる|He can {hit} the ball very far.|彼はボールをとても遠くまで打てます。|2|hit, hit
hold|動|持つ；開催する|The school will {hold} a festival next week.|学校は来週お祭りを開きます。|2|held, held
hope|動/名|望む；希望|I {hope} you like it.|気に入ってもらえるといいな。|1
hurry|動|急ぐ|{Hurry} up, or you'll be late.|急いで、そうしないと遅れるよ。|1
hurt|動|傷つける；痛む|My leg {hurts}.|足が痛いです。|2|hurt, hurt
introduce|動|紹介する|Let me {introduce} myself.|自己紹介させてください。|2
invite|動|招待する|I want to {invite} you to my party.|あなたをパーティーに招待したいです。|1
join|動|参加する；加わる|Why don't you {join} us?|私たちに加わりませんか。|1
keep|動|保つ；取っておく|You can {keep} the change.|おつりは取っておいてください。|1|kept, kept
kill|動|殺す|Don't {kill} the insects.|虫を殺さないで。|3
know|動|知っている|Do you {know} her name?|彼女の名前を知っていますか。|1|knew, known
laugh|動|笑う|His joke made everyone {laugh}.|彼の冗談でみんなが笑いました。|2
lead|動|導く|She will {lead} the team.|彼女がチームを率います。|3|led, led
learn|動|学ぶ；覚える|I want to {learn} Chinese.|中国語を学びたいです。|1
leave|動|出発する；置いていく|What time do you {leave} home?|何時に家を出ますか。|1|left, left
lend|動|貸す|Can you {lend} me your umbrella?|かさを貸してくれますか。|1|lent, lent
lie|動|横になる|I want to {lie} down on the bed.|ベッドに横になりたいです。|3|lay, lain
lose|動|なくす；負ける|Our team didn't want to {lose} the game.|私たちのチームは試合に負けたくありませんでした。|1|lost, lost
make|動|作る；～させる|Let's {make} a cake together.|いっしょにケーキを作ろう。|1|made, made
marry|動|結婚する|My sister will {marry} next year.|姉は来年結婚します。|3
mean|動|意味する|What does this word {mean}?|この単語はどういう意味ですか。|1|meant, meant
meet|動|会う|Nice to {meet} you.|はじめまして。|1|met, met
miss|動|乗り遅れる；さびしく思う|I don't want to {miss} the bus.|バスに乗り遅れたくありません。|1
move|動|動かす；引っ越す|My family will {move} to Osaka.|私の家族は大阪に引っ越します。|1
need|動|必要とする|I {need} your help.|あなたの助けが必要です。|1
open|動/形|開ける；開いている|Can you {open} the door?|ドアを開けてくれる？|1
paint|動|（絵の具で）かく；ぬる|I like to {paint} pictures.|絵をかくのが好きです。|2
pass|動|手渡す；合格する|Could you {pass} me the salt?|塩を取ってくれますか。|1
pay|動|支払う|I'll {pay} for lunch.|お昼代は私が払います。|2|paid, paid
pick|動|摘む；選ぶ|Let's {pick} some flowers.|花を摘もう。|2
protect|動|守る|We have to {protect} nature.|自然を守らなければなりません。|2
push|動|押す|{Push} the button.|ボタンを押してください。|3
put|動|置く|{Put} your bag on the chair.|かばんをいすの上に置いて。|1|put, put
reach|動|着く；届く|We will {reach} the hotel at five.|5時にホテルに着く予定です。|3
receive|動|受け取る|Did you {receive} my letter?|私の手紙を受け取りましたか。|2
recycle|動|リサイクルする|We should {recycle} paper and bottles.|紙やびんはリサイクルすべきです。|2
relax|動|くつろぐ|I like to {relax} at home on Sundays.|日曜日は家でくつろぐのが好きです。|2
remember|動|覚えている；思い出す|Do you {remember} his name?|彼の名前を覚えていますか。|1
repeat|動|くり返す|Please {repeat} after me.|私のあとについてくり返してください。|2
rest|動/名|休む；休息|You should {rest} today.|今日は休んだほうがいいよ。|2
return|動|帰る；返す|I have to {return} this book to the library.|この本を図書館に返さなければなりません。|1
ride|動|乗る|Can you {ride} a horse?|馬に乗れますか。|1|rode, ridden
ring|動|鳴る|The phone began to {ring}.|電話が鳴り始めました。|3|rang, rung
run|動|走る|I {run} in the park every morning.|毎朝公園で走っています。|1|ran, run
save|動|救う；ためる；節約する|I'm going to {save} money for the trip.|旅行のためにお金をためるつもりです。|1
say|動|言う|What did you {say}?|何と言いましたか。|1|said, said
sell|動|売る|They {sell} fresh fish at that store.|あの店では新鮮な魚を売っています。|1|sold, sold
send|動|送る|I'll {send} you a picture.|写真を送るね。|1|sent, sent
share|動|分け合う；共有する|Let's {share} this pizza.|このピザを分けよう。|1
shout|動|さけぶ|Don't {shout} in the classroom.|教室でさけばないで。|3
show|動|見せる；案内する|Please {show} me your notebook.|ノートを見せてください。|1|showed, shown
sing|動|歌う|Let's {sing} a song together.|いっしょに歌を歌おう。|1|sang, sung
sleep|動|眠る|I couldn't {sleep} well last night.|昨夜はよく眠れませんでした。|1|slept, slept
smile|動/名|ほほえむ；笑顔|She always has a nice {smile}.|彼女はいつもすてきな笑顔です。|2
speak|動|話す|Can you {speak} English?|英語を話せますか。|1|spoke, spoken
spend|動|（時間・お金を）使う；過ごす|I {spend} a lot of time reading.|私は読書に多くの時間を使います。|1|spent, spent
stand|動|立つ|Please {stand} up.|立ってください。|1|stood, stood
stay|動|滞在する；とどまる|I'm going to {stay} with my aunt in Kobe.|神戸のおばの家に泊まる予定です。|1
steal|動|盗む|Someone tried to {steal} my bike.|だれかが私の自転車を盗もうとしました。|3|stole, stolen
stop|動|止める；止まる|Please {stop} talking.|おしゃべりをやめてください。|1
study|動|勉強する|I {study} English every day.|私は毎日英語を勉強しています。|1
swim|動|泳ぐ|Can you {swim} fast?|速く泳げますか。|1|swam, swum
take|動|取る；持っていく；（時間が）かかる|It will {take} about ten minutes.|10分くらいかかるでしょう。|1|took, taken
talk|動|話す|Let's {talk} about our trip.|旅行について話そう。|1
taste|動/名|～な味がする；味|This soup {tastes} good.|このスープはおいしいです。|2
teach|動|教える|Can you {teach} me how to play chess?|チェスのやり方を教えてくれる？|1|taught, taught
tell|動|伝える；話す|Please {tell} me about your family.|あなたの家族について話してください。|1|told, told
think|動|思う；考える|I {think} so, too.|私もそう思います。|1|thought, thought
throw|動|投げる|Don't {throw} trash on the street.|通りにごみを捨てないで。|2|threw, thrown
touch|動|さわる|Please don't {touch} the paintings.|絵にさわらないでください。|2
travel|動/名|旅行する；旅行|I want to {travel} to Italy.|イタリアを旅行したいです。|1
try|動|やってみる；試す|Let's {try} again.|もう一度やってみよう。|1
turn|動|曲がる；回す|{Turn} left at the next corner.|次の角を左に曲がってください。|1
understand|動|理解する|I don't {understand} this question.|この問題がわかりません。|1|understood, understood
use|動|使う|May I {use} your phone?|電話を使ってもいいですか。|1
visit|動|訪れる|I want to {visit} London someday.|いつかロンドンを訪れたいです。|1
wait|動|待つ|Please {wait} here.|ここで待っていてください。|1
wake|動|目を覚ます|I {wake} up at six every morning.|毎朝6時に目を覚まします。|2|woke, woken
walk|動|歩く；散歩させる|I {walk} my dog every evening.|毎晩犬を散歩させます。|1
want|動|ほしい|What do you {want} for your birthday?|誕生日に何がほしい？|1
wash|動|洗う|Please {wash} your hands.|手を洗ってください。|1
watch|動/名|見る；腕時計|Let's {watch} a movie tonight.|今夜映画を見よう。|1
wear|動|着ている；身につけている|You should {wear} a coat today.|今日はコートを着たほうがいいよ。|1|wore, worn
win|動|勝つ；（賞を）取る|I hope our team will {win}.|私たちのチームが勝つといいな。|1|won, won
wish|動|願う|I {wish} you a happy new year.|よい新年をお迎えください。|2
worry|動|心配する|Don't {worry}.|心配しないで。|1
write|動|書く|Please {write} your name here.|ここに名前を書いてください。|1|wrote, written
agree|動|賛成する|I {agree} with you.|あなたに賛成です。|1
allow|動|許す|My parents don't {allow} me to play games at night.|両親は私が夜ゲームをするのを許してくれません。|3
appear|動|現れる|A rainbow will {appear} after the rain.|雨のあとに虹が出るでしょう。|3
bake|動|（パンなどを）焼く|Let's {bake} some cookies.|クッキーを焼こう。|2
belong|動|所属する|I {belong} to the art club.|私は美術部に所属しています。|3
boil|動|ゆでる；わかす|{Boil} the eggs for ten minutes.|卵を10分ゆでてください。|3
celebrate|動|祝う|We {celebrate} Christmas with our family.|私たちは家族でクリスマスを祝います。|2
cheer|動|応援する|Let's {cheer} for our team.|チームを応援しよう。|2
communicate|動|意思を伝え合う|We can {communicate} with people around the world.|世界中の人々と意思疎通できます。|3
compare|動|比べる|Let's {compare} the two pictures.|2枚の絵を比べよう。|3
create|動|作り出す|He wants to {create} video games.|彼はテレビゲームを作りたいと思っています。|3
deliver|動|配達する|They will {deliver} the pizza in 30 minutes.|30分でピザを配達してくれます。|3
discover|動|発見する|Who {discovered} the island?|だれがその島を発見しましたか。|3
disappear|動|消える|The sun will {disappear} behind the clouds.|太陽は雲の後ろにかくれるでしょう。|3
exercise|動/名|運動する；運動|You should {exercise} every day.|毎日運動したほうがいいよ。|2
fill|動|満たす|Please {fill} this bottle with water.|このボトルを水でいっぱいにしてください。|3
hang|動|掛ける|{Hang} your coat here.|コートをここに掛けて。|3|hung, hung
kick|動|ける|He can {kick} the ball hard.|彼はボールを強くけることができます。|3
knock|動|ノックする|Please {knock} on the door.|ドアをノックしてください。|3
land|動/名|着陸する；陸|The plane will {land} soon.|飛行機はまもなく着陸します。|3
lock|動|かぎをかける|Don't forget to {lock} the door.|ドアのかぎをかけるのを忘れないで。|3
mind|動|気にする；いやがる|Do you {mind} if I open the window?|窓を開けてもかまいませんか。|2
prepare|動|準備する|I have to {prepare} for the test.|テストの準備をしなければなりません。|2
print|動|印刷する|I'll {print} the map.|地図を印刷するね。|3
promise|動/名|約束する；約束|I {promise} I'll be there on time.|時間どおりに行くと約束するよ。|2
rent|動|賃借りする|We can {rent} bikes at the station.|駅で自転車を借りられます。|3
reserve|動|予約する|I'd like to {reserve} a table for four.|4人分の席を予約したいのですが。|3
serve|動|（食事を）出す|The restaurant {serves} good pizza.|そのレストランはおいしいピザを出します。|3
shake|動|振る|Let's {shake} hands.|握手しよう。|3|shook, shaken
shut|動|閉める|Please {shut} the door.|ドアを閉めてください。|3|shut, shut
solve|動|解く；解決する|Can you {solve} this problem?|この問題を解けますか。|2
spell|動|つづる|How do you {spell} your name?|あなたの名前はどうつづりますか。|2
surprise|動/名|驚かせる；驚き|Let's {surprise} Mom on her birthday.|母の誕生日に母を驚かせよう。|2
survive|動|生き残る|Plants cannot {survive} without water.|植物は水なしでは生き延びられません。|3
able|形|～できる|I was {able} to swim across the river.|私は川を泳いで渡ることができました。|1
afraid|形|こわがって；心配して|I'm {afraid} of dogs.|私は犬がこわいです。|1
alone|形/副|ひとりで|I don't like to eat {alone}.|ひとりで食べるのは好きではありません。|2
angry|形|怒った|Why is he {angry}?|彼はなぜ怒っているの？|1
another|形/代|もう1つの；別の|Can I have {another} cookie?|クッキーをもう1枚もらえる？|1
bad|形|悪い|I have {bad} news.|悪い知らせがあります。|1|worse, worst
beautiful|形|美しい|What a {beautiful} flower!|なんて美しい花でしょう！|1
best|形/副|最もよい；最もよく|She is my {best} friend.|彼女は私の親友です。|1
better|形/副|よりよい；よりよく|I feel {better} today.|今日は気分がよくなりました。|1
boring|形|退屈な|The movie was {boring}.|その映画は退屈でした。|2
bored|形|退屈した|I'm {bored}. Let's go out.|退屈だな。出かけよう。|3
brave|形|勇敢な|The firefighter was very {brave}.|その消防士はとても勇敢でした。|3
bright|形|明るい；輝いている|The room is {bright} and clean.|その部屋は明るくてきれいです。|3
busy|形|忙しい；にぎやかな|I'm {busy} this week.|今週は忙しいです。|1
careful|形|注意深い|Be {careful}!|気をつけて！|1
cheap|形|安い|This T-shirt is very {cheap}.|このTシャツはとても安いです。|1
clear|形|晴れた；はっきりした|The sky is {clear} today.|今日は空が晴れわたっています。|3
comfortable|形|心地よい|This sofa is very {comfortable}.|このソファはとても座り心地がいいです。|2
convenient|形|便利な|This store is {convenient} for me.|この店は私にとって便利です。|3
crowded|形|混雑した|The train was very {crowded}.|電車はとても混んでいました。|1
cute|形|かわいい|Your cat is so {cute}.|あなたのネコはとてもかわいいね。|1
dangerous|形|危険な|It's {dangerous} to swim here.|ここで泳ぐのは危険です。|1
dark|形|暗い|It's getting {dark}.|暗くなってきました。|1
dear|形|親愛なる|{Dear} Tom,|親愛なるトムへ|2
delicious|形|とてもおいしい|This pizza is {delicious}.|このピザはとてもおいしいです。|1
different|形|違った；いろいろな|My sister and I have {different} hobbies.|姉と私は趣味が違います。|1
difficult|形|難しい|This question is {difficult}.|この問題は難しいです。|1
dirty|形|汚い|My shoes are {dirty}.|靴が汚れています。|2
dry|形|乾いた|The towel is {dry} now.|タオルはもう乾いています。|3
early|形/副|早い；早く|I got up {early} this morning.|今朝は早く起きました。|1
easy|形|簡単な|The test was {easy}.|テストは簡単でした。|1
empty|形|空の|The bottle is {empty}.|びんは空っぽです。|3
enough|形|十分な|We have {enough} time.|時間は十分あります。|2
excited|形|わくわくした|I'm {excited} about the trip.|旅行が楽しみでわくわくしています。|1
exciting|形|わくわくさせる|The game was very {exciting}.|試合はとてもわくわくしました。|1
expensive|形|高価な|This watch is too {expensive}.|この腕時計は高すぎます。|1
famous|形|有名な|Kyoto is {famous} for its old temples.|京都は古い寺で有名です。|1
fast|形/副|速い；速く|He runs very {fast}.|彼はとても速く走ります。|1
favorite|形|お気に入りの|What's your {favorite} food?|好きな食べ物は何ですか。|1
foreign|形|外国の|I want to learn a {foreign} language.|外国語を学びたいです。|1
free|形|ひまな；無料の|Are you {free} this afternoon?|今日の午後はひまですか。|1
fresh|形|新鮮な|These vegetables are {fresh}.|これらの野菜は新鮮です。|2
friendly|形|親しみやすい|The people in this town are very {friendly}.|この町の人々はとても親しみやすいです。|1
full|形|いっぱいの；満腹の|I'm {full}. I can't eat any more.|おなかいっぱい。もう食べられない。|1
funny|形|おかしい；おもしろい|He told us a {funny} story.|彼はおかしな話をしてくれました。|1
glad|形|うれしい|I'm {glad} to hear that.|それを聞いてうれしいです。|1
great|形|すばらしい；大きな|That's a {great} idea!|それはすばらしい考えだね！|1
heavy|形|重い；（雨が）激しい|This box is too {heavy}.|この箱は重すぎます。|1
healthy|形|健康な；健康によい|Eating vegetables is {healthy}.|野菜を食べるのは健康によいです。|2
helpful|形|役に立つ|Your advice was very {helpful}.|あなたのアドバイスはとても役に立ちました。|2
hungry|形|空腹の|I'm {hungry}. Let's eat lunch.|おなかがすいた。お昼にしよう。|1
important|形|重要な|It's {important} to sleep well.|よく眠ることは大切です。|1
interesting|形|おもしろい；興味深い|This book is very {interesting}.|この本はとてもおもしろいです。|1
interested|形|興味がある|I'm {interested} in Japanese history.|私は日本の歴史に興味があります。|1
kind|形/名|親切な；種類|It's very {kind} of you.|ご親切にありがとう。|1
large|形|大きい；広い|This T-shirt is too {large} for me.|このTシャツは私には大きすぎます。|1
last|形|最後の；この前の|I saw him {last} Sunday.|この前の日曜日に彼に会いました。|1
late|形/副|遅い；遅れて|Don't be {late} for school.|学校に遅れないでね。|1
light|形|軽い；明るい|This bag is very {light}.|このかばんはとても軽いです。|2
local|形|地元の|We bought vegetables at a {local} market.|地元の市場で野菜を買いました。|3
lonely|形|さびしい|I felt {lonely} when my friend moved away.|友達が引っ越してさびしく思いました。|3
loud|形|（声・音が）大きい|The music is too {loud}.|音楽の音が大きすぎます。|2
lucky|形|幸運な|You're {lucky}!|運がいいね！|2
main|形|主な|What is the {main} reason?|主な理由は何ですか。|3
modern|形|現代的な|This is a {modern} building.|これは現代的な建物です。|3
natural|形|自然の|This juice is made from {natural} fruit.|このジュースは天然の果物から作られています。|3
nervous|形|緊張して|I was {nervous} before the speech.|スピーチの前は緊張しました。|2
new|形|新しい|I got a {new} bike.|新しい自転車を手に入れました。|1
next|形|次の|See you {next} week.|また来週ね。|1
nice|形|すてきな；親切な|Have a {nice} day.|よい一日を。|1
old|形|古い；年をとった|This temple is very {old}.|このお寺はとても古いです。|1
own|形|自分自身の|I want my {own} room.|自分の部屋がほしいです。|2
perfect|形|完ぺきな|Your English is {perfect}.|あなたの英語は完ぺきです。|2
polite|形|礼儀正しい|He is always {polite}.|彼はいつも礼儀正しいです。|3
poor|形|貧しい；かわいそうな|The {poor} dog is hungry.|かわいそうに、その犬はおなかをすかせています。|3
popular|形|人気のある|This song is {popular} among young people.|この歌は若い人たちの間で人気があります。|1
possible|形|可能な|Is it {possible} to get there by bus?|そこへバスで行くことはできますか。|3
proud|形|誇りに思って|I'm {proud} of you.|あなたを誇りに思います。|3
quiet|形|静かな|Please be {quiet} in the library.|図書館では静かにしてください。|1
ready|形|用意ができた|Are you {ready}?|準備はできた？|1
real|形|本当の；本物の|Is this a {real} diamond?|これは本物のダイヤモンドですか。|2
rich|形|金持ちの；豊かな|He became {rich} and famous.|彼はお金持ちになり、有名になりました。|3
right|形/副|正しい；右の|You're {right}.|あなたの言うとおりです。|1
sad|形|悲しい|I was {sad} to hear the news.|その知らせを聞いて悲しかったです。|1
safe|形|安全な|This town is very {safe}.|この町はとても安全です。|2
same|形|同じ|We are in the {same} class.|私たちは同じクラスです。|1
scared|形|こわがって|I was {scared} of the big dog.|その大きな犬がこわかったです。|3
serious|形|まじめな；深刻な|Is it a {serious} problem?|それは深刻な問題ですか。|3
sick|形|病気の|My brother is {sick} in bed.|弟は病気で寝ています。|1
simple|形|簡単な；質素な|The rules of the game are {simple}.|そのゲームのルールは簡単です。|2
sleepy|形|眠い|I'm very {sleepy}.|とても眠いです。|2
slow|形|遅い；ゆっくりした|This computer is very {slow}.|このコンピューターはとても遅いです。|2
soft|形|やわらかい|This bread is very {soft}.|このパンはとてもやわらかいです。|3
sorry|形|すまなく思って；残念で|I'm {sorry} I'm late.|遅れてすみません。|1
special|形|特別な|Today is a {special} day for me.|今日は私にとって特別な日です。|1
strange|形|奇妙な|I heard a {strange} sound.|奇妙な音が聞こえました。|2
strong|形|強い|The wind was {strong} yesterday.|昨日は風が強かった。|1
sure|形|確信して|Are you {sure}?|本当に？（確かですか）|1
surprised|形|驚いた|I was {surprised} at the news.|その知らせに驚きました。|1
terrible|形|ひどい|The weather was {terrible}.|天気はひどかった。|2
thirsty|形|のどがかわいた|I'm {thirsty}. Can I have some water?|のどがかわいた。水をもらえる？|2
tired|形|疲れた|I'm {tired} after practice.|練習のあとで疲れています。|1
traditional|形|伝統的な|Kimono is {traditional} Japanese clothing.|着物は伝統的な日本の衣服です。|2
true|形|本当の|Is that story {true}?|その話は本当ですか。|2
useful|形|役に立つ|This dictionary is very {useful}.|この辞書はとても役に立ちます。|1
warm|形|暖かい|It's {warm} today.|今日は暖かいです。|1
wet|形|ぬれた|My shoes got {wet} in the rain.|雨で靴がぬれました。|2
wild|形|野生の|There are many {wild} animals in Africa.|アフリカには野生動物がたくさんいます。|3
wonderful|形|すばらしい|We had a {wonderful} time.|すばらしい時間を過ごしました。|1
worried|形|心配して|I'm {worried} about the test.|テストが心配です。|2
wrong|形|まちがった；具合が悪い|What's {wrong}?|どうしたの？|1
young|形|若い|My aunt is very {young}.|おばはとても若いです。|1
abroad|副|外国へ；外国で|I want to study {abroad}.|留学したいです。|1
actually|副|実は；実際に|{Actually}, I've never seen snow.|実は、雪を見たことがないんです。|2
again|副|もう一度；また|Please say it {again}.|もう一度言ってください。|1
ago|副|～前に|I came here two years {ago}.|私は2年前にここに来ました。|1
almost|副|ほとんど|I'm {almost} ready.|ほとんど準備ができました。|1
already|副|もう；すでに|I have {already} finished my homework.|私はもう宿題を終えました。|1
also|副|～もまた|I {also} like soccer.|私はサッカーも好きです。|1
always|副|いつも|She is {always} kind to me.|彼女はいつも私に親切です。|1
anywhere|副|どこにでも；どこにも|You can sit {anywhere}.|どこに座ってもいいですよ。|3
around|副/前|まわりに；～のまわりに；およそ|Let's walk {around} the lake.|湖のまわりを歩こう。|1
away|副|離れて|The station is two kilometers {away}.|駅は2キロ離れています。|2
before|副/前/接|以前に；～の前に|Have you been here {before}?|以前ここに来たことがありますか。|1
carefully|副|注意深く|Please listen {carefully}.|注意して聞いてください。|2
certainly|副|確かに；（返事で）もちろん|{Certainly}. Here you are.|かしこまりました。はいどうぞ。|3
clearly|副|はっきりと|Please speak more {clearly}.|もっとはっきり話してください。|3
downstairs|副|階下へ|Dinner is ready. Come {downstairs}.|夕食ができたよ。下りてきて。|3
easily|副|簡単に|I can {easily} find the station.|簡単に駅を見つけられます。|2
else|副|そのほかに|Anything {else}?|ほかに何かありますか。|2
even|副|～でさえ|{Even} children can do it.|子どもでさえそれはできます。|2
ever|副|今までに|Have you {ever} been to Kyoto?|京都に行ったことがありますか。|1
everywhere|副|どこでも|I looked {everywhere} for my key.|かぎをあちこちさがしました。|2
exactly|副|正確に；（返事で）そのとおり|That's {exactly} right.|まさにそのとおりです。|3
far|副/形|遠くに；遠い|Is the museum {far} from here?|博物館はここから遠いですか。|1
finally|副|ついに；最後に|We {finally} reached the top of the mountain.|私たちはついに山頂に着きました。|1
first|副/形|最初に；最初の|{First}, wash your hands.|まず、手を洗いなさい。|1
forever|副|永遠に|I'll remember this day {forever}.|この日を永遠に忘れません。|3
however|副|しかしながら|{However}, it started to rain.|しかし、雨が降り始めました。|2
just|副|ちょうど；ただ～だけ|I have {just} finished lunch.|ちょうど昼食を終えたところです。|1
later|副|あとで|See you {later}.|またあとでね。|1
maybe|副|たぶん|{Maybe} he is sick.|たぶん彼は病気です。|1
never|副|一度も～ない|I have {never} seen a koala.|コアラを一度も見たことがありません。|1
once|副|1回；かつて|I have been to Hokkaido {once}.|北海道に1回行ったことがあります。|1
only|副/形|ただ～だけ；唯一の|I have {only} 100 yen.|100円しか持っていません。|1
outside|副|外で|Let's play {outside}.|外で遊ぼう。|1
perhaps|副|もしかすると|{Perhaps} she will come.|もしかすると彼女は来るかもしれません。|3
probably|副|たぶん|It will {probably} rain tomorrow.|明日はたぶん雨が降るでしょう。|1
quickly|副|速く；すぐに|Come here {quickly}!|すぐにここに来て！|2
really|副|本当に|I {really} like this song.|この歌が本当に好きです。|1
someday|副|いつか|I want to go to Paris {someday}.|いつかパリに行きたいです。|1
sometimes|副|ときどき|I {sometimes} cook dinner.|ときどき夕食を作ります。|1
soon|副|すぐに；まもなく|The bus will come {soon}.|バスはまもなく来ます。|1
still|副|まだ；今でも|It's {still} raining.|まだ雨が降っています。|1
suddenly|副|突然|{Suddenly}, it began to rain.|突然雨が降り出しました。|2
together|副|いっしょに|Let's go {together}.|いっしょに行こう。|1
tonight|副/名|今夜|What are you doing {tonight}?|今夜は何をするの？|1
twice|副|2回|I go swimming {twice} a week.|週に2回泳ぎに行きます。|1
upstairs|副|階上へ|My room is {upstairs}.|私の部屋は上の階です。|3
usually|副|ふつうは；たいてい|I {usually} get up at six.|たいてい6時に起きます。|1
well|副/形|上手に；元気な|She plays the piano very {well}.|彼女はピアノをとても上手にひきます。|1
yet|副|（否定文で）まだ；（疑問文で）もう|I haven't finished my homework {yet}.|まだ宿題を終えていません。|1
across|前|～を横切って；向こう側に|The bank is {across} the street.|銀行は通りの向こう側にあります。|2
after|前/接|～のあとに|Let's play tennis {after} school.|放課後テニスをしよう。|1
against|前|～に対抗して|We played {against} a strong team.|私たちは強いチームと対戦しました。|3
along|前|～に沿って|Walk {along} the river.|川に沿って歩いてください。|2
among|前|（3つ以上）の間で|This song is popular {among} students.|この歌は生徒の間で人気があります。|2
behind|前|～の後ろに|The cat is {behind} the sofa.|ネコはソファの後ろにいます。|2
between|前|（2つ）の間に|The bank is {between} the post office and the hospital.|銀行は郵便局と病院の間にあります。|1
during|前|～の間に|I went to Kyoto {during} the summer vacation.|夏休みの間に京都へ行きました。|1
near|前|～の近くに|I live {near} the station.|私は駅の近くに住んでいます。|1
through|前|～を通って|The train went {through} a long tunnel.|電車は長いトンネルを通りぬけました。|3
until|前/接|～までずっと|I'll wait {until} five.|5時まで待ちます。|1
without|前|～なしで|I can't live {without} music.|音楽なしでは生きられません。|2
because|接|なぜなら～だから|I stayed home {because} I was sick.|具合が悪かったので家にいました。|1
if|接|もし～なら|{If} it rains tomorrow, we will stay home.|明日雨が降ったら、家にいます。|1
since|接/前|～以来；～なので|I have lived here {since} 2020.|2020年からここに住んでいます。|2
though|接|～だけれども|{Though} it was cold, we went swimming.|寒かったけれど、私たちは泳ぎに行きました。|3
when|接|～するとき|I was watching TV {when} he called me.|彼が電話してきたとき、私はテレビを見ていました。|1
while|接|～する間に|Please wait here {while} I buy tickets.|私が切符を買う間、ここで待っていてください。|2
anyone|代|だれか；だれでも|Does {anyone} have a pen?|だれかペンを持っていますか。|2
everyone|代|みんな|{Everyone} likes him.|みんな彼のことが好きです。|1
nothing|代|何も～ない|There is {nothing} in the box.|箱の中には何もありません。|2
someone|代|だれか|{Someone} is at the door.|だれかが玄関に来ています。|2
something|代|何か|I want {something} cold to drink.|何か冷たい飲み物がほしいです。|1
`;

// 熟語（大問1で頻出）
export const IDIOMS_RAW = String.raw`
a lot of|熟|たくさんの|There are {a lot of} people in the park.|公園にはたくさんの人がいます。|1
a few|熟|少しの（数えられる）|I have {a few} friends in Canada.|カナダに友達が数人います。|1
a little|熟|少しの（数えられない）；少し|I can speak {a little} French.|フランス語を少し話せます。|1
a piece of|熟|1切れの；1枚の|Can I have {a piece of} cake?|ケーキを1切れもらえる？|1
a cup of|熟|カップ1杯の|I drink {a cup of} tea every morning.|毎朝紅茶を1杯飲みます。|1
a glass of|熟|コップ1杯の|Can I have {a glass of} water?|水を1杯もらえますか。|1
a pair of|熟|1組の|I bought {a pair of} shoes.|靴を1足買いました。|2
at first|熟|最初は|{At first}, I didn't like natto.|最初は納豆が好きではありませんでした。|1
at last|熟|ついに|{At last}, we found the hotel.|ついにホテルを見つけました。|1
at home|熟|家で；くつろいで|Please make yourself {at home}.|どうぞくつろいでください。|1
at once|熟|すぐに|Come here {at once}.|すぐにここへ来なさい。|2
at the end of|熟|～の終わりに|We have a test {at the end of} this month.|今月の終わりにテストがあります。|1
at that time|熟|そのとき；当時|I was ten years old {at that time}.|当時私は10歳でした。|2
be able to|熟|～することができる|I will {be able to} swim next year.|来年には泳げるようになるでしょう。|1
be afraid of|熟|～をこわがる|My sister {is afraid of} spiders.|姉はクモをこわがっています。|1
be born|熟|生まれる|I {was born} in Osaka.|私は大阪で生まれました。|1
be different from|熟|～と違う|My idea {is different from} yours.|私の考えはあなたのと違います。|1
be famous for|熟|～で有名である|This town {is famous for} its hot springs.|この町は温泉で有名です。|1
be full of|熟|～でいっぱいである|The box {is full of} toys.|箱はおもちゃでいっぱいです。|1
be glad to|熟|～してうれしい|I'm {glad to} see you.|会えてうれしいです。|1
be going to|熟|～するつもりだ|I'm {going to} visit my uncle tomorrow.|明日おじを訪ねるつもりです。|1
be good at|熟|～が得意である|She {is good at} playing the piano.|彼女はピアノをひくのが得意です。|1
be interested in|熟|～に興味がある|I'm {interested in} space.|私は宇宙に興味があります。|1
be late for|熟|～に遅れる|Don't {be late for} school.|学校に遅れないように。|1
be made of|熟|～でできている（材料）|This desk {is made of} wood.|この机は木でできています。|2
be made from|熟|～から作られる（原料）|Cheese {is made from} milk.|チーズは牛乳から作られます。|2
be proud of|熟|～を誇りに思う|I'm {proud of} my team.|チームを誇りに思います。|2
be ready for|熟|～の準備ができている|Are you {ready for} the trip?|旅行の準備はできた？|1
be sure to|熟|必ず～する|{Be sure to} lock the door.|必ずドアにかぎをかけてね。|2
be surprised at|熟|～に驚く|I {was surprised at} the price.|その値段に驚きました。|1
be tired of|熟|～にうんざりする|I'm {tired of} this rainy weather.|この雨の天気にはうんざりです。|2
be worried about|熟|～を心配している|My mother {is worried about} me.|母は私のことを心配しています。|2
because of|熟|～のために（原因）|The game was stopped {because of} the rain.|雨のため試合は中止されました。|1
both A and B|熟|AもBも両方とも|{Both} Tom {and} Ken like soccer.|トムもケンもサッカーが好きです。|1
by oneself|熟|ひとりで；自力で|I made this cake {by myself}.|このケーキを自分で作りました。|2
by the way|熟|ところで|{By the way}, where is Mike?|ところで、マイクはどこ？|1
come back|熟|戻る|Please {come back} by six.|6時までに戻ってきてください。|1
come true|熟|（夢などが）実現する|I hope your dream will {come true}.|あなたの夢がかなうといいですね。|1
each other|熟|おたがい|We help {each other}.|私たちはおたがいに助け合います。|1
either A or B|熟|AかBのどちらか|You can have {either} tea {or} coffee.|紅茶かコーヒーのどちらかをどうぞ。|2
far from|熟|～から遠い|My house is {far from} the station.|私の家は駅から遠いです。|1
find out|熟|～を見つけ出す；知る|Let's {find out} the answer.|答えを見つけ出そう。|2
for a long time|熟|長い間|I waited {for a long time}.|長い間待ちました。|1
for example|熟|たとえば|I like fruit, {for example}, apples and bananas.|果物が好きです、たとえばリンゴやバナナです。|1
for the first time|熟|初めて|I saw snow {for the first time}.|初めて雪を見ました。|1
from A to B|熟|AからBまで|The shop is open {from} ten {to} eight.|その店は10時から8時まで開いています。|1
get off|熟|（乗り物から）降りる|{Get off} the bus at the next stop.|次のバス停でバスを降りてください。|1
get on|熟|（乗り物に）乗る|Let's {get on} the train.|電車に乗ろう。|1
get up|熟|起きる|I {get up} at six every day.|毎日6時に起きます。|1
get to|熟|～に着く|How can I {get to} the station?|駅へはどうやって行けますか。|1
get well|熟|（病気が）よくなる|I hope you'll {get well} soon.|早くよくなるといいですね。|2
give up|熟|あきらめる|Don't {give up}.|あきらめないで。|1
go out|熟|外出する|Let's {go out} for dinner.|夕食を食べに出かけよう。|1
go on a trip|熟|旅行に行く|We will {go on a trip} to Hokkaido.|私たちは北海道へ旅行に行きます。|1
grow up|熟|成長する；大人になる|I want to be a teacher when I {grow up}.|大人になったら先生になりたいです。|1
have a cold|熟|かぜをひいている|I {have a cold}, so I'll stay home.|かぜをひいているので家にいます。|1
have a good time|熟|楽しく過ごす|We {had a good time} at the party.|パーティーで楽しく過ごしました。|1
have to|熟|～しなければならない|I {have to} clean my room.|部屋をそうじしなければなりません。|1
hear from|熟|～から便りがある|I'm happy to {hear from} you.|あなたから便りがあってうれしいです。|2
hear about|熟|～について聞く|Did you {hear about} the new teacher?|新しい先生のことを聞いた？|2
help A with B|熟|AのBを手伝う|Can you {help} me {with} my homework?|宿題を手伝ってくれる？|1
How about ～?|熟|～はどうですか|{How about} going to the movies?|映画に行くのはどう？|1
in front of|熟|～の前に|Let's meet {in front of} the station.|駅の前で会おう。|1
in the future|熟|将来|I want to be a pilot {in the future}.|将来パイロットになりたいです。|1
in time|熟|間に合って|We got to the station {in time}.|駅に間に合いました。|2
instead of|熟|～の代わりに|I drank tea {instead of} coffee.|コーヒーの代わりに紅茶を飲みました。|2
keep ～ing|熟|～し続ける|He {kept} running for an hour.|彼は1時間走り続けました。|2
look after|熟|～の世話をする|I {look after} my little sister.|私は妹の世話をします。|1
look for|熟|～をさがす|I'm {looking for} my glasses.|めがねをさがしています。|1
look forward to|熟|～を楽しみに待つ|I'm {looking forward to} seeing you.|あなたに会えるのを楽しみにしています。|1
look like|熟|～のように見える；～に似ている|You {look like} your mother.|あなたはお母さんに似ていますね。|1
make a mistake|熟|まちがえる|Don't be afraid to {make a mistake}.|まちがえることをおそれないで。|2
make friends with|熟|～と友達になる|I {made friends with} a boy from Canada.|カナダから来た男の子と友達になりました。|1
more and more|熟|ますます|{More and more} people are using smartphones.|ますます多くの人がスマホを使っています。|2
most of|熟|～の大部分|{Most of} the students walk to school.|生徒のほとんどは歩いて通学しています。|2
not ～ at all|熟|まったく～ない|I'm {not} tired {at all}.|まったく疲れていません。|2
not only A but also B|熟|AだけでなくBも|He speaks {not only} English {but also} French.|彼は英語だけでなくフランス語も話します。|3
of course|熟|もちろん|"Can you help me?" "{Of course}."|「手伝ってくれる？」「もちろん。」|1
on foot|熟|歩いて|I go to school {on foot}.|歩いて通学しています。|1
on one's way to|熟|～へ行く途中で|I met Ken {on my way to} school.|学校へ行く途中でケンに会いました。|1
on time|熟|時間どおりに|The train arrived {on time}.|電車は時間どおりに着きました。|1
one day|熟|（過去の）ある日|{One day}, I met a strange man.|ある日、私は奇妙な男の人に会いました。|1
one of|熟|～のうちの1つ（1人）|He is {one of} my best friends.|彼は私の親友の1人です。|1
over there|熟|向こうに|Look at the bird {over there}.|向こうにいる鳥を見て。|1
pick up|熟|拾う；車で迎えに行く|I'll {pick} you {up} at the station.|駅に車で迎えに行くよ。|1
put on|熟|～を着る；身につける|{Put on} your coat.|コートを着なさい。|1
right now|熟|今すぐ；ちょうど今|I'm busy {right now}.|今ちょうど忙しいです。|1
run away|熟|逃げる|The cat {ran away}.|ネコは逃げました。|2
say hello to|熟|～によろしく伝える|Please {say hello to} your family.|ご家族によろしく伝えてください。|2
show A around B|熟|AにBを案内する|I'll {show} you {around} my town.|私の町を案内しますね。|2
slow down|熟|速度を落とす|Please {slow down}.|スピードを落としてください。|3
some day|熟|いつか|I want to visit Canada {some day}.|いつかカナダを訪れたいです。|2
stay up late|熟|夜ふかしする|Don't {stay up late}.|夜ふかししないようにね。|2
such as|熟|たとえば～のような|I like sports {such as} tennis and soccer.|テニスやサッカーのようなスポーツが好きです。|1
take a bath|熟|おふろに入る|I {take a bath} before dinner.|夕食の前におふろに入ります。|1
take a picture|熟|写真を撮る|Can you {take a picture} of us?|私たちの写真を撮ってくれますか。|1
take a walk|熟|散歩する|Let's {take a walk} in the park.|公園を散歩しよう。|1
take care of|熟|～の世話をする|I {take care of} my dog every day.|毎日犬の世話をしています。|1
take off|熟|脱ぐ；離陸する|Please {take off} your shoes here.|ここで靴を脱いでください。|1
take part in|熟|～に参加する|I will {take part in} the speech contest.|スピーチコンテストに参加します。|1
talk to|熟|～と話す|Can I {talk to} you for a minute?|ちょっと話してもいい？|1
thank you for|熟|～をありがとう|{Thank you for} your help.|手伝ってくれてありがとう。|1
these days|熟|このごろ|{These days}, I often read books.|このごろ、よく本を読みます。|2
think about|熟|～について考える|I'm {thinking about} my future.|自分の将来について考えています。|1
throw away|熟|捨てる|Don't {throw away} old clothes.|古い服を捨てないで。|2
too ～ to …|熟|～すぎて…できない|I was {too} tired {to} walk.|疲れすぎて歩けませんでした。|2
try on|熟|試着する|Can I {try on} this jacket?|この上着を試着してもいいですか。|1
turn off|熟|（電気などを）消す|{Turn off} the light, please.|電気を消してください。|1
turn on|熟|（電気などを）つける|Can you {turn on} the TV?|テレビをつけてくれる？|1
wait for|熟|～を待つ|I'm {waiting for} a bus.|バスを待っています。|1
wake up|熟|目を覚ます|I {woke up} at five this morning.|今朝は5時に目を覚ましました。|1
worry about|熟|～を心配する|Don't {worry about} it.|それについては心配しないで。|1
write back|熟|返事を書く|Please {write back} soon.|すぐに返事を書いてね。|2
all over the world|熟|世界中で|The song is popular {all over the world}.|その歌は世界中で人気があります。|1
all day|熟|一日中|It rained {all day}.|一日中雨が降りました。|1
after school|熟|放課後|Let's play soccer {after school}.|放課後サッカーをしよう。|1
as soon as|熟|～するとすぐに|Call me {as soon as} you get home.|家に着いたらすぐに電話してね。|2
as ～ as …|熟|…と同じくらい～|Ken is {as} tall {as} his father.|ケンはお父さんと同じくらいの背の高さです。|1
be over|熟|終わる|Summer vacation {is over}.|夏休みが終わりました。|2
be in trouble|熟|困っている|Help! I'm {in trouble}.|助けて！困っているんです。|3
belong to|熟|～に所属している|I {belong to} the brass band.|私は吹奏楽部に所属しています。|2
between A and B|熟|AとBの間に|The bank is {between} the park {and} the school.|銀行は公園と学校の間にあります。|1
call back|熟|折り返し電話する|Can you {call} me {back} later?|あとで折り返し電話してくれますか。|1
catch a cold|熟|かぜをひく|Be careful not to {catch a cold}.|かぜをひかないように気をつけて。|1
change trains|熟|電車を乗りかえる|You have to {change trains} at Shinjuku.|新宿で電車を乗りかえなければなりません。|2
clean up|熟|きれいにかたづける|Let's {clean up} the room.|部屋をかたづけよう。|1
do one's best|熟|全力をつくす|I'll {do my best}.|全力をつくします。|1
do one's homework|熟|宿題をする|I {do my homework} after dinner.|夕食のあとに宿題をします。|1
each of|熟|～のそれぞれ|{Each of} the students has a computer.|生徒それぞれがコンピューターを持っています。|2
fall down|熟|転ぶ|Be careful not to {fall down}.|転ばないように気をつけて。|2
feel better|熟|気分がよくなる|I {feel better} now.|今は気分がよくなりました。|1
get angry|熟|怒る|My mother {got angry} with me.|母は私に腹を立てました。|2
get married|熟|結婚する|They {got married} last year.|彼らは去年結婚しました。|2
go shopping|熟|買い物に行く|Let's {go shopping} this weekend.|今週末、買い物に行こう。|1
have a fever|熟|熱がある|I {have a fever}.|熱があります。|2
have been to|熟|～に行ったことがある|I {have been to} Australia twice.|オーストラリアに2回行ったことがあります。|1
hundreds of|熟|何百もの|{Hundreds of} people came to the festival.|何百人もの人がお祭りに来ました。|2
in the middle of|熟|～の真ん中に|There is a pond {in the middle of} the park.|公園の真ん中に池があります。|2
in those days|熟|その当時は|{In those days}, there were no cars.|その当時は車がありませんでした。|3
laugh at|熟|～を笑う|Don't {laugh at} me.|私を笑わないで。|2
listen to|熟|～を聞く|I like to {listen to} music.|音楽を聞くのが好きです。|1
look around|熟|見回す|We {looked around} the old town.|私たちは古い町を見て回りました。|2
look up|熟|（辞書などで）調べる|{Look up} the word in your dictionary.|その単語を辞書で調べなさい。|2
move to|熟|～へ引っ越す|We {moved to} Nagoya last year.|去年名古屋に引っ越しました。|1
next to|熟|～のとなりに|The bank is {next to} the park.|銀行は公園のとなりにあります。|1
no longer|熟|もはや～ない|He {no longer} lives here.|彼はもうここに住んでいません。|3
plenty of|熟|たくさんの|We have {plenty of} time.|時間はたっぷりあります。|3
say goodbye to|熟|～にさよならを言う|I {said goodbye to} my friends.|友達にさよならを言いました。|2
so ～ that …|熟|とても～なので…|I was {so} tired {that} I went to bed early.|とても疲れていたので早く寝ました。|2
speak to|熟|～に話しかける|A tourist {spoke to} me at the station.|駅で観光客が私に話しかけてきました。|1
stay at|熟|～に泊まる|We {stayed at} a hotel near the sea.|私たちは海の近くのホテルに泊まりました。|1
take a trip|熟|旅行する|Let's {take a trip} to Nara.|奈良に旅行しよう。|1
thanks to|熟|～のおかげで|{Thanks to} you, I passed the test.|あなたのおかげでテストに合格しました。|2
the other day|熟|先日|I saw your brother {the other day}.|先日あなたのお兄さんに会いました。|2
up to|熟|～まで|{Up to} five people can join the tour.|最大5人までツアーに参加できます。|3
used to|熟|以前はよく～した|I {used to} live in Kobe.|以前は神戸に住んでいました。|3
walk to|熟|～まで歩いて行く|I {walk to} school every day.|毎日歩いて学校に行きます。|1
want to be|熟|～になりたい|I {want to be} a vet.|獣医になりたいです。|1
What's wrong?|熟|どうしたの？|You look sad. {What's wrong?}|悲しそうだね。どうしたの？|1
`;

// 会話表現（大問2・リスニング第1部で頻出）
export const PHRASES_RAW = String.raw`
That's a good idea.|会|それはいい考えだね。|A: Let's go to the beach. B: {That's a good idea.}|A: 海に行こう。B: それはいい考えだね。|1
That's too bad.|会|それはお気の毒に；残念だね。|A: I have a cold. B: {That's too bad.}|A: かぜをひいているの。B: それはお気の毒に。|1
Sounds good.|会|いいね。|A: How about pizza for lunch? B: {Sounds good.}|A: お昼はピザはどう？ B: いいね。|1
Sounds like fun.|会|楽しそうだね。|A: We're going camping this weekend. B: {Sounds like fun.}|A: 今週末キャンプに行くんだ。B: 楽しそうだね。|1
You're welcome.|会|どういたしまして。|A: Thank you for your help. B: {You're welcome.}|A: 手伝ってくれてありがとう。B: どういたしまして。|1
No problem.|会|いいよ；どういたしまして。|A: Can you close the door? B: {No problem.}|A: ドアを閉めてくれる？ B: いいよ。|1
Here you are.|会|はい、どうぞ。|A: Can I see your ticket? B: {Here you are.}|A: チケットを見せていただけますか。B: はい、どうぞ。|1
Here it is.|会|はい、ここにあります。|A: Where is my pen? B: {Here it is.}|A: ぼくのペンはどこ？ B: ここにあるよ。|2
I'd love to.|会|ぜひそうしたい。|A: Do you want to come with us? B: {I'd love to.}|A: いっしょに来ない？ B: ぜひ行きたい。|1
I'm afraid I can't.|会|残念ながらできません。|A: Can you come to my party? B: {I'm afraid I can't.}|A: パーティーに来られる？ B: 残念だけど行けないんだ。|1
Maybe next time.|会|また今度ね。|A: Do you want to go shopping? B: I'm busy today. {Maybe next time.}|A: 買い物に行かない？ B: 今日は忙しいの。また今度ね。|1
Why not?|会|もちろん；いいとも。|A: Shall we play tennis? B: {Why not?}|A: テニスをしようか。B: いいとも。|2
Of course.|会|もちろん。|A: Can I use your phone? B: {Of course.}|A: 電話を使ってもいい？ B: もちろん。|1
Sure.|会|いいよ；もちろん。|A: Can you help me? B: {Sure.}|A: 手伝ってくれる？ B: いいよ。|1
Just a minute.|会|ちょっと待って。|A: Are you ready? B: {Just a minute.}|A: 準備できた？ B: ちょっと待って。|1
Take care.|会|気をつけてね；お大事に。|A: See you tomorrow. B: {Take care.}|A: また明日。B: 気をつけてね。|2
Have a nice trip.|会|よい旅を。|A: I'm going to Canada tomorrow. B: {Have a nice trip.}|A: 明日カナダに行くんだ。B: よい旅を。|1
Have a nice weekend.|会|よい週末を。|A: See you on Monday. B: {Have a nice weekend.}|A: また月曜日にね。B: よい週末を。|2
Good luck.|会|がんばってね；幸運を祈るよ。|A: I have a big game tomorrow. B: {Good luck.}|A: 明日大事な試合があるんだ。B: がんばってね。|1
Congratulations!|会|おめでとう！|A: I passed the test! B: {Congratulations!}|A: テストに合格したよ！ B: おめでとう！|1
I'm sorry to hear that.|会|それはお気の毒に。|A: My grandfather is in the hospital. B: {I'm sorry to hear that.}|A: 祖父が入院しているの。B: それはお気の毒に。|1
I'm glad to hear that.|会|それを聞いてうれしいよ。|A: I feel much better now. B: {I'm glad to hear that.}|A: もうずっとよくなったよ。B: それを聞いてうれしいよ。|1
What's the matter?|会|どうしたの？|A: {What's the matter?} B: I have a headache.|A: どうしたの？ B: 頭が痛いんだ。|1
How about you?|会|あなたはどう？|A: I like summer. {How about you?} B: I like winter.|A: 私は夏が好き。あなたは？ B: ぼくは冬が好き。|1
Me, too.|会|私も。|A: I'm hungry. B: {Me, too.}|A: おなかすいた。B: 私も。|1
Me, neither.|会|私も～ない。|A: I don't like horror movies. B: {Me, neither.}|A: ホラー映画は好きじゃない。B: ぼくも。|3
I think so, too.|会|私もそう思う。|A: This book is interesting. B: {I think so, too.}|A: この本はおもしろいね。B: 私もそう思う。|1
I don't think so.|会|そうは思わない。|A: Will it rain today? B: {I don't think so.}|A: 今日は雨が降るかな。B: 降らないと思うよ。|1
I hope so.|会|そうだといいね。|A: Will we win the game? B: {I hope so.}|A: 試合に勝てるかな。B: そうだといいね。|1
I see.|会|なるほど；わかりました。|A: The shop is closed on Mondays. B: {I see.}|A: その店は月曜日が休みなんだ。B: なるほど。|1
Excuse me.|会|すみません。|{Excuse me.} Where is the station?|すみません。駅はどこですか。|1
Pardon?|会|もう一度言ってくれますか？|A: What's your favorite color? B: {Pardon?}|A: 好きな色は何？ B: もう一度言ってくれる？|2
Can I help you?|会|何かお困りですか；いらっしゃいませ。|A: {Can I help you?} B: Yes, I'm looking for a T-shirt.|A: いらっしゃいませ。B: はい、Tシャツをさがしています。|1
May I help you?|会|いらっしゃいませ；お手伝いしましょうか。|A: {May I help you?} B: No, thank you. I'm just looking.|A: いらっしゃいませ。B: いいえ、見ているだけです。|1
I'm just looking.|会|見ているだけです。|A: May I help you? B: No, thanks. {I'm just looking.}|A: いらっしゃいませ。B: いいえ、見ているだけです。|2
How much is it?|会|いくらですか。|A: I like this bag. {How much is it?} B: It's 2,000 yen.|A: このかばんが気に入った。いくらですか。B: 2,000円です。|1
I'll take it.|会|それをください（買います）。|A: This one is 1,500 yen. B: OK. {I'll take it.}|A: こちらは1,500円です。B: では、それをください。|1
Would you like some more?|会|もう少しいかがですか。|A: {Would you like some more?} B: No, thank you. I'm full.|A: もう少しいかが？ B: いいえ、けっこうです。おなかいっぱいです。|2
No, thank you.|会|いいえ、けっこうです。|A: Would you like some tea? B: {No, thank you.}|A: 紅茶はいかがですか。B: いいえ、けっこうです。|1
Help yourself.|会|ご自由にどうぞ。|A: Can I have a cookie? B: Sure. {Help yourself.}|A: クッキーをもらってもいい？ B: どうぞ、ご自由に。|2
Hold on, please.|会|（電話で）少々お待ちください。|A: Can I speak to Mike? B: {Hold on, please.}|A: マイクをお願いします。B: 少々お待ちください。|2
Speaking.|会|（電話で）私です。|A: Hello. Is this Yuki? B: Yes, {speaking.}|A: もしもし、ユキさんですか。B: はい、私です。|3
You have the wrong number.|会|番号がちがいますよ。|A: Hello, is this Mr. Smith? B: No. I think {you have the wrong number.}|A: もしもし、スミスさんですか。B: いいえ。番号がちがうと思います。|3
Can I take a message?|会|伝言を承りましょうか。|A: Is Ken there? B: He's out now. {Can I take a message?}|A: ケンはいますか。B: 今出かけています。伝言を承りましょうか。|2
Nice to meet you.|会|はじめまして。|A: I'm Emily. B: I'm Taro. {Nice to meet you.}|A: エミリーです。B: 太郎です。はじめまして。|1
Long time no see.|会|久しぶり。|A: Hi, Jack! {Long time no see.} B: Hi, Mika!|A: やあ、ジャック！久しぶり。B: やあ、ミカ！|2
See you later.|会|またあとで。|A: I have to go now. B: OK. {See you later.}|A: もう行かなきゃ。B: わかった。またあとでね。|1
Let me see.|会|ええと。|A: How many people are coming? B: {Let me see.} Maybe ten.|A: 何人来るの？ B: ええと。たぶん10人かな。|1
It's my turn.|会|私の番だ。|A: Who's next? B: {It's my turn.}|A: 次はだれ？ B: 私の番だよ。|2
That's right.|会|そのとおり。|A: Is your birthday in May? B: {That's right.}|A: 誕生日は5月？ B: そのとおり。|1
Not yet.|会|まだです。|A: Have you finished your homework? B: {Not yet.}|A: 宿題は終わった？ B: まだだよ。|1
Not at all.|会|どういたしまして；まったく～ない。|A: Thank you very much. B: {Not at all.}|A: どうもありがとう。B: どういたしまして。|2
How was it?|会|どうだった？|A: I went to the new restaurant. B: {How was it?}|A: 新しいレストランに行ったよ。B: どうだった？|1
What happened?|会|何があったの？|A: I'm sorry I'm late. B: {What happened?}|A: 遅れてごめん。B: 何があったの？|1
I have no idea.|会|わからないな。|A: Where is Tom? B: {I have no idea.}|A: トムはどこ？ B: わからないな。|2
Don't worry.|会|心配しないで。|A: I lost my pen. B: {Don't worry.} You can use mine.|A: ペンをなくしちゃった。B: 心配しないで。ぼくのを使っていいよ。|1
Is that so?|会|そうなの？|A: Mr. Sato is going to leave our school. B: {Is that so?}|A: 佐藤先生が学校をやめるんだって。B: そうなの？|3
What do you think?|会|どう思う？|A: This dress is nice. {What do you think?} B: It looks good on you.|A: このドレスすてき。どう思う？ B: 似合ってるよ。|1
It looks good on you.|会|似合っているよ。|A: How is my new jacket? B: {It looks good on you.}|A: 新しい上着どう？ B: 似合っているよ。|2
Why don't we ～?|会|（いっしょに）～しませんか。|{Why don't we} go to the park?|公園に行かない？|1
Shall I ～?|会|（私が）～しましょうか。|{Shall I} open the window?|窓を開けましょうか。|1
Could you ～?|会|～していただけますか。|{Could you} tell me the way to the station?|駅への道を教えていただけますか。|1
Would you like ～?|会|～はいかがですか。|{Would you like} something to drink?|何か飲み物はいかがですか。|1
I'd like ～.|会|～がほしいのですが。|{I'd like} a hamburger and a cola, please.|ハンバーガーとコーラをください。|1
`;
