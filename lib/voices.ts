export type VoiceArticle = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  kind: '体験談' | '活動レポート' | '始め方';
  description: string;
  status: 'published' | 'draft' | 'unavailable';
  // Manually confirmed editorial tags. These are not raw keyword occurrences.
  terms: readonly string[];
  checkedAt: string;
};

type ArticleLink = {
  opportunityId: string;
  articleId: string;
  relation: 'same-program' | 'same-field';
  status: 'published' | 'draft';
  evidence: string;
  verifiedAt: string;
};

// Titles and URLs are source metadata. Descriptions are independently written for Try Buddy.
// No source photographs, body excerpts, or page thumbnails are stored here.
export const voiceArticles: readonly VoiceArticle[] = [
  {id:'hayashi-3352',title:'林 心菜さんの海外留学体験記（留学先：アメリカ合衆国）',url:'https://tobitate-mext.jasso.go.jp/zukan/detail-3352',publisher:'トビタテ！留学JAPAN 留学大図鑑',kind:'体験談',description:'費用面の迷いを経てダンス留学へ。失敗への不安を抱えながら、自分から動く力を身につけた経験。',terms:['不安','挑戦','行動','自信','一歩','きっかけ','成長'],status:'published',checkedAt:'2026-10-08'},
  {id:'okajima-3291',title:'岡島 花蓮さんの海外留学体験記（留学先：ガーナ）',url:'https://tobitate-mext.jasso.go.jp/zukan/detail-3291',publisher:'トビタテ！留学JAPAN 留学大図鑑',kind:'体験談',description:'ガーナで法律と教育を探究し、現地の学校で英語絵本を使った授業に取り組んだ経験。',terms:['挑戦','行動','交流','学び','目標','仲間','発見'],status:'published',checkedAt:'2026-10-08'},
  {id:'rin-3536',title:'りんさんの海外留学体験記（留学先：アメリカ合衆国）',url:'https://tobitate-mext.jasso.go.jp/zukan/detail-3536',publisher:'トビタテ！留学JAPAN 留学大図鑑',kind:'体験談',description:'ダンスに挑戦するため渡米。言語や技術の壁を越え、自分らしく表現する自信を得た経験。',terms:['不安','挑戦','成長','自信','勇気','一歩','学び'],status:'published',checkedAt:'2026-10-08'},
  {id:'sara-3321',title:'さらさんの海外留学体験記（留学先：オーストラリア）',url:'https://tobitate-mext.jasso.go.jp/zukan/detail-3321',publisher:'トビタテ！留学JAPAN 留学大図鑑',kind:'体験談',description:'現地校で学び、日本語クラスの活動にも参加。友人やホストファミリーとの交流を振り返る。',terms:['交流','友達','英語','学び','ホームステイ','文化','出会い','言葉'],status:'published',checkedAt:'2026-10-08'},
  {id:'otaka-3136',title:'大高優花さんの海外留学体験記（留学先：カナダ）',url:'https://tobitate-mext.jasso.go.jp/zukan/detail-3136',publisher:'トビタテ！留学JAPAN 留学大図鑑',kind:'体験談',description:'カナダでの学びを通じ、実際に使う英語や人との伝え方について考えた記録。',terms:['交流','英語','学び','行動','目標','言葉','発見'],status:'published',checkedAt:'2026-10-08'},
  {id:'nishiyama-3073',title:'西山黎音さんの海外留学体験記（留学先：アメリカ合衆国）',url:'https://tobitate-mext.jasso.go.jp/zukan/detail-3073',publisher:'トビタテ！留学JAPAN 留学大図鑑',kind:'体験談',description:'ホームステイと現地校での生活、留学計画を考えた過程、英語学習の振り返りを紹介。',terms:['交流','友達','英語','勇気','準備','目標','ホームステイ','文化','出会い','言葉'],status:'published',checkedAt:'2026-10-08'},
  {id:'awata-2125',title:'淡田理恵さんの海外留学体験記（留学先：イギリス）',url:'https://tobitate-mext.jasso.go.jp/zukan/detail-2125',publisher:'トビタテ！留学JAPAN 留学大図鑑',kind:'体験談',description:'音楽を学ぶため初めての海外へ。不安やホームステイでの苦労も含めて振り返る。',terms:['不安','友達','英語','勇気','成長','ホームステイ','言葉','出会い'],status:'published',checkedAt:'2026-10-08'},
  {id:'hana-2193',title:'はなさんの海外留学体験記（留学先：イギリス）',url:'https://tobitate-mext.jasso.go.jp/zukan/detail-2193',publisher:'トビタテ！留学JAPAN 留学大図鑑',kind:'体験談',description:'応募から語学学校選びまで自分で進め、現地の友人との交流を通して得た自信を記す。',terms:['成長','自信','行動','友達','英語','学び','目標','きっかけ','挑戦'],status:'published',checkedAt:'2026-10-08'},
  {id:'natsumi-2223',title:'なつみさんの海外留学体験記（留学先：オーストラリア）',url:'https://tobitate-mext.jasso.go.jp/zukan/detail-2223',publisher:'トビタテ！留学JAPAN 留学大図鑑',kind:'体験談',description:'先輩の話をきっかけに応募。現地で自分から話しかける勇気と伝え方を学んだ経験。',terms:['勇気','行動','英語','友達','学び','自信','一歩','きっかけ','言葉'],status:'published',checkedAt:'2026-10-08'},
  {id:'shijimi-998',title:'しじみさんの海外留学体験記（留学先：アメリカ合衆国）',url:'https://tobitate-mext.jasso.go.jp/zukan/detail-998',publisher:'トビタテ！留学JAPAN 留学大図鑑',kind:'体験談',description:'短期留学で英語で話すことに挑み、将来の夢や全国・現地で出会った仲間を振り返る。',terms:['仲間','勇気','行動','挑戦','成長','英語','出会い','一歩','目標','言葉'],status:'published',checkedAt:'2026-10-08'},
  {id:'risa-1520',title:'Risaさんの海外留学体験記（留学先：アメリカ合衆国）',url:'https://tobitate-mext.jasso.go.jp/zukan/detail-1520',publisher:'トビタテ！留学JAPAN 留学大図鑑',kind:'体験談',description:'ITを学ぶ留学を実現し、現地の友人とのつながりや英語で聞き取るための準備を紹介。',terms:['行動','友達','英語','準備','目標','仲間','出会い','言葉','挑戦'],status:'published',checkedAt:'2026-10-08'},
  {id:'saaya-1004',title:'さあやさんの海外留学体験記（留学先：アメリカ合衆国）',url:'https://tobitate-mext.jasso.go.jp/zukan/detail-1004',publisher:'トビタテ！留学JAPAN 留学大図鑑',kind:'体験談',description:'自然環境を学ぶ留学で、ホームステイや語学学校を通して新しい価値観に触れた経験。',terms:['成長','自信','行動','英語','目標','ホームステイ','文化','発見','学び'],status:'published',checkedAt:'2026-10-08'},
  {id:'otoha-1436',title:'おとはさんの海外留学体験記（留学先：アメリカ合衆国）',url:'https://tobitate-mext.jasso.go.jp/zukan/detail-1436',publisher:'トビタテ！留学JAPAN 留学大図鑑',kind:'体験談',description:'海外での医療ボランティアを経験。受け入れ先探しや事前に調整すべきことも紹介。',terms:['準備','行動','交流','学び','英語','言葉','挑戦'],status:'published',checkedAt:'2026-10-08'},
  {id:'nonoka-894',title:'Nonokaさんの海外留学体験記（留学先：マルタ）',url:'https://tobitate-mext.jasso.go.jp/zukan/detail-894',publisher:'トビタテ！留学JAPAN 留学大図鑑',kind:'体験談',description:'観光を学ぶ留学で語学学校と現地企業を経験。ホストファミリーとの関わり方も記す。',terms:['行動','交流','友達','英語','学び','仲間','出会い','文化','ホームステイ','言葉','きっかけ'],status:'published',checkedAt:'2026-10-08'},
  {id:'ibaraki-shanti-2025',title:'ボランティア体験記『シャンティつくば』で学んだ、一人ひとりに寄り添うことの大切さ』',url:'https://note.com/challengeibaraki/n/na264965fb671',publisher:'チャレンジいばらき県民運動 公式note',kind:'体験談',description:'福祉の現場への不安を抱えながら参加し、相手の歩幅に合わせて見守ることと、学び続けられる場の役割を考えた高校生の体験。',terms:['不安','挑戦','自信','成長','学び','発見','勇気','安心','関わり'],status:'published',checkedAt:'2026-10-09'},
  {id:'ibaraki-christmas-cake-2025',title:'ボランティア体験記「子どもたちにクリスマスケーキを届ける活動に参加して」',url:'https://note.com/challengeibaraki/n/n51805c89e0e7',publisher:'チャレンジいばらき県民運動 公式note',kind:'体験談',description:'物品の仕分けと子ども向けゲームを担当。仲間と準備し、年齢に合わせて遊び方を変えた高校生の体験。',terms:['不安','行動','一歩','交流','学び','仲間','準備','子ども','工夫','地域','関わり'],status:'published',checkedAt:'2026-10-09'},
  {id:'ibaraki-ninja-play-2025',title:'ボランティア体験記「『忍者あそび』を通して心と体で表現する”自分らしさ”」',url:'https://note.com/challengeibaraki/n/n2189051b88e1',publisher:'チャレンジいばらき県民運動 公式note',kind:'体験談',description:'子どもたちの遊び体験を運営し、参加者同士が協力する姿や、緊張がほどけていく変化を見守った経験。',terms:['挑戦','成長','交流','学び','仲間','発見','準備','子ども','工夫','関わり'],status:'published',checkedAt:'2026-10-09'},
  {id:'ibaraki-cosmos-girls-2025',title:'ボランティア体験記「『居場所』を支えるボランティアに参加して」',url:'https://note.com/challengeibaraki/n/ndcbffdf08dc0',publisher:'チャレンジいばらき県民運動 公式note',kind:'体験談',description:'女性の居場所で受付や会話を担当。小さな関わりも場を支えると知り、最初の一歩への考えを深めた高校生の体験。',terms:['不安','挑戦','行動','自信','一歩','きっかけ','成長','交流','学び','発見','勇気','安心','居場所','地域','関わり'],status:'published',checkedAt:'2026-10-09'},
  {id:'ibaraki-machinoko-2025',title:'ボランティア体験記「子どもたちの自由な遊び場をつくる『まちのこ団』」',url:'https://note.com/challengeibaraki/n/n4868be926dff',publisher:'チャレンジいばらき県民運動 公式note',kind:'体験談',description:'移動式遊び場の設営と子どもへの声かけに挑戦。教わった遊びを自分が伝える側になるまでを振り返る高校生の体験。',terms:['挑戦','行動','自信','一歩','きっかけ','成長','交流','学び','仲間','発見','勇気','準備','子ども','居場所','工夫','地域','安心','関わり'],status:'published',checkedAt:'2026-10-09'},
  {id:'ibaraki-machinoizumi-2025',title:'ボランティア体験記「全ての人の憩いの場『マチノイズミ』」',url:'https://note.com/challengeibaraki/n/n8a0bd8117b2e',publisher:'チャレンジいばらき県民運動 公式note',kind:'体験談',description:'多世代の交流スペースで会話や料理を共にし、誰もが自然に受け入れられる居場所のつくり方を知った高校生の体験。',terms:['一歩','交流','学び','発見','出会い','居場所','地域','安心','関わり'],status:'published',checkedAt:'2026-10-09'},
  {id:'ibaraki-sports-tag-2025',title:'ボランティア体験記「『スポーツ鬼ごっこ』に参加して見えた運営の工夫」',url:'https://note.com/challengeibaraki/n/n1105a8b83dc9',publisher:'チャレンジいばらき県民運動 公式note',kind:'体験談',description:'受付や審判を担当し、事前の役割確認から当日の細かな気配りまで、イベントを支える裏方の工夫を学んだ高校生の体験。',terms:['行動','きっかけ','交流','学び','仲間','発見','準備','出会い','子ども','工夫','地域','安心','関わり'],status:'published',checkedAt:'2026-10-09'},
  {id:'ibaraki-playpark-2025',title:'ボランティア体験記「遊びがつくる関係性ー『プレイパーク』で学んだ関わり方」',url:'https://note.com/challengeibaraki/n/n28abdaf5654e',publisher:'チャレンジいばらき県民運動 公式note',kind:'体験談',description:'竹林の遊び場づくりや食事の準備に加わり、子どもの「やりたい」を尊重する関わり方を学んだ高校生二人の体験。',terms:['挑戦','交流','学び','仲間','発見','準備','出会い','子ども','工夫','地域','関わり'],status:'published',checkedAt:'2026-10-09'},
  {id:'ibaraki-field-trip-2025',title:'ボランティア体験記「『校外学習見守りボランティア 』で感じた、“学び”を見守る大切さ」',url:'https://note.com/challengeibaraki/n/n872a720610a8',publisher:'チャレンジいばらき県民運動 公式note',kind:'体験談',description:'小学生の校外学習に同行し、答えを先に教えず、子ども自身が考えて進めるよう支えた学生の体験。',terms:['不安','挑戦','きっかけ','成長','交流','学び','発見','出会い','子ども','地域','安心','関わり'],status:'published',checkedAt:'2026-10-09'},
  {id:'ibaraki-sacchanchi-2025',title:'ボランティア体験記「『さっちゃんち こども食堂』で学んだ“心の居場所”をつくる細やかな工夫」',url:'https://note.com/challengeibaraki/n/n4d6692d99c10',publisher:'チャレンジいばらき県民運動 公式note',kind:'体験談',description:'初めてのボランティアで配膳や会話を経験し、一人ひとりの好みやペースを尊重する距離の取り方を学んだ体験。',terms:['不安','行動','一歩','交流','学び','発見','準備','出会い','子ども','居場所','工夫','地域','安心','関わり'],status:'published',checkedAt:'2026-10-09'},
  {id:'ibaraki-child-watch-2025',title:'ボランティア体験記「『子どもの見守りボランティア』で感じた思いやりと工夫」',url:'https://note.com/challengeibaraki/n/n1450aaa4a68f',publisher:'チャレンジいばらき県民運動 公式note',kind:'体験談',description:'子育て支援施設で開所準備と見守りを担当し、衛生や誤飲防止など、安心を支える細かな工夫を知った高校生の体験。',terms:['不安','挑戦','行動','自信','一歩','成長','学び','発見','勇気','準備','子ども','居場所','工夫','地域','安心','関わり'],status:'published',checkedAt:'2026-10-09'},
  {id:'ibaraki-rural-kabuki-2025',title:'ボランティア体験記「農村歌舞伎『西塩子の回り舞台』で感じた地域のつながり」',url:'https://note.com/challengeibaraki/n/nb18de6405acf',publisher:'チャレンジいばらき県民運動 公式note',kind:'体験談',description:'農村歌舞伎の会場案内と準備を手伝い、地域文化が多くの人の作業と来場者への気配りで支えられることを実感した体験。',terms:['不安','交流','学び','仲間','発見','準備','出会い','工夫','地域','安心','関わり'],status:'published',checkedAt:'2026-10-09'},
  {id:'ibaraki-310-shokudo-2025',title:'ボランティア体験記「おなかも心も満たす地域の居場所『310食堂』」',url:'https://note.com/challengeibaraki/n/n47e1887bd51d',publisher:'チャレンジいばらき県民運動 公式note',kind:'体験談',description:'なかなか踏み出せなかったボランティアに参加し、地域食堂での調理を通じて多様な人とのつながりを感じた学生の体験。',terms:['不安','行動','一歩','きっかけ','交流','学び','発見','勇気','出会い','子ども','居場所','工夫','地域','安心','関わり'],status:'published',checkedAt:'2026-10-09'},
  {id:'2hj-kiriyama-2018',title:'自分の力ではなく一つ一つの思いや行動が食料支援に繋がっています！',url:'https://2hj.org/report/2721/',publisher:'セカンドハーベスト・ジャパン',kind:'体験談',description:'埼玉の食品受け渡しに参加した大学生が、利用者との会話、仲間との連携、食料支援で得た学びを紹介。',terms:['行動','学び','関わり','交流','仲間','地域','出会い','工夫','居場所','挑戦'],status:'published',checkedAt:'2026-10-10'},
  {id:'2hj-okada-2018',title:'ボランティアストーリ　＠埼玉パントリー',url:'https://2hj.org/report/2540/',publisher:'セカンドハーベスト・ジャパン',kind:'体験談',description:'埼玉拠点で活動するボランティアが、参加のきっかけと食品を受け取る人への接し方を振り返る。',terms:['きっかけ','行動','関わり','交流','地域','学び','準備','仲間','工夫'],status:'published',checkedAt:'2026-10-10'},
  {id:'2hj-shirai-2018',title:'埼玉拠点でのインターンストーリー',url:'https://2hj.org/report/2534/',publisher:'セカンドハーベスト・ジャパン',kind:'体験談',description:'埼玉拠点のインターンが、食品の受け渡しで利用者と話し、活動の意味を実感した経験を記す。',terms:['行動','交流','関わり','学び','発見','地域','出会い','居場所'],status:'published',checkedAt:'2026-10-10'},
  {id:'2hj-doi-2017',title:'2017夏のインターン生　インタビュー',url:'https://2hj.org/report/2393/',publisher:'セカンドハーベスト・ジャパン',kind:'体験談',description:'大学生インターンが、パントリーでの活動を通じて食品ロスと貧困問題のつながりを考えた記録。',terms:['きっかけ','挑戦','学び','発見','地域','行動','関わり','成長'],status:'published',checkedAt:'2026-10-10'},
  {id:'2hj-ishii-2013',title:'インターンシップを経験した石井彩夏さんのメッセージ',url:'https://2hj.org/report/904/',publisher:'セカンドハーベスト・ジャパン',kind:'体験談',description:'一年間のインターン経験から、食料支援の現場や運営を支える仕事を振り返る。',terms:['挑戦','学び','行動','成長','関わり','仲間','地域','発見'],status:'published',checkedAt:'2026-10-10'},
  {id:'tango-mizuno-2019',title:'6/22 活動報告@水野記念リハビリテーション病院(午前の部)',url:'https://tangotherapy.wixsite.com/japan/post/6-22-%E6%B4%BB%E5%8B%95%E5%A0%B1%E5%91%8A-%E6%B0%B4%E9%87%8E%E8%A8%98%E5%BF%B5%E3%83%AA%E3%83%8F%E3%83%93%E3%83%AA%E3%83%86%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E7%97%85%E9%99%A2-%E5%8D%88%E5%89%8D%E3%81%AE%E9%83%A8',publisher:'日本タンゴセラピー協会',kind:'活動レポート',description:'高校生も参加した病院での活動。利用者との会話や世代間交流の様子を協会が報告する。',terms:['交流','関わり','仲間','行動','地域','学び','出会い','挑戦'],status:'published',checkedAt:'2026-10-10'},
  {id:'tango-meguro-2020',title:'12/28(土) 活動報告＠SOMPOケア下目黒デイサービスセンター',url:'https://tangotherapy.wixsite.com/japan/post/12-28-%E5%9C%9F-%E6%B4%BB%E5%8B%95%E5%A0%B1%E5%91%8A-sompo%E3%82%B1%E3%82%A2%E4%B8%8B%E7%9B%AE%E9%BB%92%E3%83%87%E3%82%A4%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC',publisher:'日本タンゴセラピー協会',kind:'活動レポート',description:'高校生と小学生が加わった高齢者施設での活動を紹介。初参加者の緊張と交流の様子が分かる。',terms:['不安','一歩','挑戦','交流','関わり','仲間','安心','勇気','学び'],status:'published',checkedAt:'2026-10-10'},
  {id:'tango-vln-2023',title:'活動レポート：シニアサポート活動～タンゴセラピー～',url:'https://www.vln.metro.tokyo.lg.jp/join/report/group/725743',publisher:'東京ボランティアレガシーネットワーク／日本タンゴセラピー協会',kind:'活動レポート',description:'日本タンゴセラピー協会が投稿した高齢者施設での活動報告。高校生の参加にも触れる。',terms:['交流','関わり','地域','行動','学び','発見','安心','仲間'],status:'published',checkedAt:'2026-10-10'},
  {id:'yururu-mirai-2022',title:'〖夏ボラ体験談〗公益社団法人3.11みらいサポート',url:'https://www.yururu.com/?p=6329',publisher:'杜の伝言板ゆるる',kind:'体験談',description:'震災の記憶を伝える活動に参加した高校生の声。地域の人への聞き取りや展示解説を振り返る。',terms:['挑戦','行動','学び','地域','交流','出会い','関わり','準備','一歩','発見'],status:'published',checkedAt:'2026-10-10'},
  {id:'yururu-hattatsu-2022',title:'〖夏ボラ体験談〗認定NPO法人みやぎ発達障害サポートネット',url:'https://www.yururu.com/?p=6547',publisher:'杜の伝言板ゆるる',kind:'体験談',description:'子どもとの交流や教材づくりを経験した高校生が、相手に合わせた関わり方と初参加の不安を記す。',terms:['不安','一歩','挑戦','子ども','関わり','学び','工夫','交流','成長','発見'],status:'published',checkedAt:'2026-10-10'},
  {id:'yururu-yuwa-2022',title:'〖夏ボラ体験談〗NPO法人子育て応援団ゆうわ',url:'https://www.yururu.com/?p=6476',publisher:'杜の伝言板ゆるる',kind:'体験談',description:'児童センターに参加した複数の高校生が、子どもとの遊びや安全への配慮、最初の戸惑いを語る。',terms:['不安','挑戦','子ども','関わり','学び','工夫','交流','仲間','成長','居場所','一歩','安心'],status:'published',checkedAt:'2026-10-10'},
  {id:'yururu-nijiiro-2022',title:'〖夏ボラ体験談〗NPO法人にじいろクレヨン',url:'https://www.yururu.com/?p=6447',publisher:'杜の伝言板ゆるる',kind:'体験談',description:'子どもの制作活動を支えた高校生が、相手の表現を尊重する関わりと活動後の振り返りを紹介。',terms:['子ども','関わり','学び','工夫','交流','仲間','成長','発見','準備'],status:'published',checkedAt:'2026-10-10'},
  {id:'yururu-tsuyaku-2022',title:'〖夏ボラ体験談〗宮城善意通訳者の会',url:'https://www.yururu.com/?p=6567',publisher:'杜の伝言板ゆるる',kind:'体験談',description:'外国人観光客への声かけを体験した高校生の記録。言葉を使って地域で交流する様子が分かる。',terms:['不安','挑戦','行動','交流','地域','出会い','関わり','学び','勇気'],status:'published',checkedAt:'2026-10-10'},
  {id:'yururu-senior-2022',title:'〖夏ボラ体験談〗NPO法人シニアのための市民ネットワーク仙台',url:'https://www.yururu.com/?p=6395',publisher:'杜の伝言板ゆるる',kind:'体験談',description:'高齢者との会話や七夕飾りづくり、体操に加わった高校生の体験を紹介。',terms:['不安','交流','関わり','学び','発見','地域','出会い','安心','一歩'],status:'published',checkedAt:'2026-10-10'},
  {id:'aso-report-2025',title:'第20回国際ボランティアワークキャンプ in ASO （報告）',url:'https://www.kumamoto-if.or.jp/kiji0032751/index.html',publisher:'熊本市国際交流振興事業団',kind:'活動レポート',description:'2025年の開催概要と高校生による報告書を案内。国際交流や分科会での学びを追える。',terms:['挑戦','行動','学び','交流','仲間','地域','出会い','準備','発見','関わり'],status:'published',checkedAt:'2026-10-10'},
  {id:'aso-report-2024',title:'第19回国際ボランティアワークキャンプ in ASO（報告）',url:'https://www.kumamoto-if.or.jp/kiji0032400/index.html',publisher:'熊本市国際交流振興事業団',kind:'活動レポート',description:'2024年の参加者と実行委員の取り組み、報告書とアンケートを案内する公式記事。',terms:['挑戦','行動','学び','交流','仲間','地域','出会い','準備','発見','関わり'],status:'published',checkedAt:'2026-10-10'},
  {id:'aso-report-2023',title:'ボラキャン アーカイブズ(2) 第10回から19回までの報告書 ＋ 10周年記念誌',url:'https://www.kumamoto-if.or.jp/kiji0031418/index.html',publisher:'熊本市国際交流振興事業団',kind:'活動レポート',description:'過年度の高校生実行委員による報告書をまとめた公式アーカイブ。第18回などの経験を閲覧できる。',terms:['挑戦','行動','学び','交流','仲間','地域','出会い','準備','発見','関わり'],status:'published',checkedAt:'2026-10-10'},
  {id:'award-summary-2026',title:'大会サマリー2026',url:'https://lion.or.jp/va/about/summary_2026/index.html',publisher:'高校生ボランティア・アワード／風に立つライオン基金',kind:'活動レポート',description:'2026年大会の発表と交流を主催者が記録。高校生が活動を伝え、他校と学び合う様子を紹介。',terms:['挑戦','行動','学び','交流','仲間','地域','出会い','準備','発見','関わり','成長','工夫'],status:'published',checkedAt:'2026-10-10'},
  {id:'award-summary-2025',title:'大会サマリー2025',url:'https://lion.or.jp/va/about/summary_2025/index.html',publisher:'高校生ボランティア・アワード／風に立つライオン基金',kind:'活動レポート',description:'2025年大会のブース発表と参加団体の交流を主催者が報告。発表準備や活動内容を知る手がかりになる。',terms:['挑戦','行動','学び','交流','仲間','地域','出会い','準備','発見','関わり','成長','工夫'],status:'published',checkedAt:'2026-10-10'},
  {id:'award-summary-2024',title:'大会サマリー2024',url:'https://lion.or.jp/va/about/summary_2024/index.html',publisher:'高校生ボランティア・アワード／風に立つライオン基金',kind:'活動レポート',description:'2024年大会での高校生の発表や対話を振り返る公式記事。参加した学校の活動と会場の雰囲気を紹介。',terms:['挑戦','行動','学び','交流','仲間','地域','出会い','準備','発見','関わり','成長','工夫'],status:'published',checkedAt:'2026-10-10'},
  {id:'jfie-imuta-2017',title:'留学時代の仲間達',url:'https://www.jfie.gr.jp/report/2017/08/09/1178/',publisher:'日本国際交流振興会（JFIE）',kind:'体験談',description:'ニュージーランドへの交換留学生が、現地校での主体的な授業と友人との交流を振り返る。',terms:['英語','学び','交流','出会い','友達','文化','発見','仲間','行動'],status:'published',checkedAt:'2026-10-10'},
  {id:'jfie-thanks-2017',title:'感謝と思い出に溢れた私の留学',url:'https://www.jfie.gr.jp/report/2017/08/09/1209/',publisher:'日本国際交流振興会（JFIE）',kind:'体験談',description:'交換留学中の高校生が、学校やホストファミリーなど多くの人に支えられた暮らしを記す。',terms:['交流','出会い','友達','ホームステイ','文化','学び','成長','仲間','英語'],status:'published',checkedAt:'2026-10-10'},
  {id:'jfie-toyoda-2017',title:'日本では体験できないことばかりでした',url:'https://www.jfie.gr.jp/report/2017/07/27/971/',publisher:'日本国際交流振興会（JFIE）',kind:'体験談',description:'カナダへの交換留学生が、現地校の授業と地域イベントで得た発見を紹介。',terms:['学び','交流','出会い','友達','ホームステイ','文化','発見','英語','挑戦'],status:'published',checkedAt:'2026-10-10'},
  {id:'jfie-kuhara-2017',title:'私のニュージーランドでの留学生活',url:'https://www.jfie.gr.jp/report/2017/08/07/1121/',publisher:'日本国際交流振興会（JFIE）',kind:'体験談',description:'ニュージーランドへの交換留学生が、学校での生活や現地イベントへの参加を紹介。',terms:['英語','学び','交流','出会い','友達','文化','行動','発見','ホームステイ'],status:'published',checkedAt:'2026-10-10'},
  {id:'jfie-beloved-2017',title:'大好きなものや人を沢山見つけました',url:'https://www.jfie.gr.jp/report/2017/09/13/1373/',publisher:'日本国際交流振興会（JFIE）',kind:'体験談',description:'現地で人と話す中で、英語への自信と新しい友人とのつながりを得た交換留学の記録。',terms:['不安','一歩','勇気','自信','行動','英語','交流','友達','出会い','成長'],status:'published',checkedAt:'2026-10-10'},
  {id:'eil-si-2026',title:'〖高校生交換留学体験談〗S.I.さん（南アフリカ派遣）',url:'https://www.experimenters.eiljapan.org/post/20260702',publisher:'EIL 体験者ブログ',kind:'体験談',description:'南アフリカへ派遣された高校生が、留学中盤までの生活と自分の変化を記す。',terms:['不安','挑戦','行動','成長','学び','交流','発見','文化','英語'],status:'published',checkedAt:'2026-10-10'},
  {id:'eil-ht-2024',title:'〖高校生交換留学体験談〗H.T.さん（フランス派遣）',url:'https://www.experimenters.eiljapan.org/post/20241223',publisher:'EIL 体験者ブログ',kind:'体験談',description:'フランスの学校で授業が分からず戸惑いながらも、語学力と自分のペースを育てた経験。',terms:['不安','挑戦','学び','言葉','友達','英語','自信','成長','文化','一歩'],status:'published',checkedAt:'2026-10-10'},
  {id:'eil-at-2025',title:'〖高校生交換留学体験談〗Ａ.Ｔ.さん（アイルランド派遣）',url:'https://www.experimenters.eiljapan.org/post/20250812',publisher:'EIL 体験者ブログ',kind:'体験談',description:'アイルランドへの交換留学生が、自ら動く勇気と人とのつながり、異文化理解を振り返る。',terms:['挑戦','行動','一歩','勇気','成長','交流','出会い','文化','英語','学び'],status:'published',checkedAt:'2026-10-10'},
  {id:'eil-to-2025',title:'〖高校生交換留学体験談〗T.O. さん（アメリカ派遣）',url:'https://www.experimenters.eiljapan.org/post/20250214',publisher:'EIL 体験者ブログ',kind:'体験談',description:'アメリカでの一年間を、渡航準備からホストファミリーとの生活まで振り返る。',terms:['不安','挑戦','準備','ホームステイ','交流','学び','成長','英語','文化','出会い'],status:'published',checkedAt:'2026-10-10'},
  {id:'eil-yamaguchi-2022',title:'〖高校生交換留学体験談〗山口真依さん（デンマーク派遣）現地レポート',url:'https://www.experimenters.eiljapan.org/post/20220112',publisher:'EIL 体験者ブログ',kind:'体験談',description:'デンマークでの生活から、学校や日常における日本との違いを伝える高校生の現地報告。',terms:['学び','交流','文化','出会い','友達','ホームステイ','言葉','発見','成長'],status:'published',checkedAt:'2026-10-10'},
  {id:'ftcj-camp-summer-2025',title:'〖開催報告〗テイク・アクション・キャンプ・ジャパン2025夏',url:'https://ftcj.org/news/48962/',publisher:'フリー・ザ・チルドレン・ジャパン',kind:'活動レポート',description:'2025年夏の4日間を主催者が報告。参加者が社会課題を学び、自分の行動案を発表した過程と感想を紹介。',terms:['不安','挑戦','行動','一歩','成長','学び','交流','仲間','出会い','自信','勇気','発見'],status:'published',checkedAt:'2026-10-10'},
  {id:'ftcj-camp-winter-2025',title:'〖開催報告〗テイク・アクション・キャンプ・ジャパン・ミニ2025冬',url:'https://ftcj.org/news/50151/',publisher:'フリー・ザ・チルドレン・ジャパン',kind:'活動レポート',description:'2025年冬のキャンプで、少人数の対話や社会課題の学習から動画制作へ進む様子を紹介。',terms:['不安','挑戦','行動','一歩','成長','学び','交流','仲間','出会い','工夫','発見','安心'],status:'published',checkedAt:'2026-10-10'},
  {id:'ftcj-camp-summer-2024',title:'〖開催報告〗テイク・アクション・キャンプ・ジャパン2024夏',url:'https://ftcj.org/news/41747/',publisher:'フリー・ザ・チルドレン・ジャパン',kind:'活動レポート',description:'2024年夏のキャンプで、初対面の仲間との交流から社会課題の学習、行動計画の発表までをたどる。',terms:['不安','挑戦','行動','一歩','成長','学び','交流','仲間','出会い','自信','勇気','発見'],status:'published',checkedAt:'2026-10-10'},
  {id:'jrc-kagoshima-2025',title:'青少年赤十字高等学校交流・体験会を開催しました',url:'https://www.jrc.or.jp/chapter/kagoshima/about/topics/2025/1001_049242.html',publisher:'日本赤十字社 鹿児島県支部',kind:'活動レポート',description:'高校生が企画した防災の学習会。非常食の調理や救急法を他校の生徒と学んだ様子と感想を紹介。',terms:['行動','学び','交流','仲間','地域','出会い','工夫','準備','発見','挑戦'],status:'published',checkedAt:'2026-10-10'},
  {id:'jrc-gunma-2025',title:'「ワークショップ発表会」を開催！～活動報告と交流会でつながるボランティアの輪～',url:'https://www.jrc.or.jp/chapter/gunma/about/topics/2025/1206_050539.html',publisher:'日本赤十字社 群馬県支部',kind:'活動レポート',description:'県内の高校生による活動報告と交流会。点字、手話などを通じて相手の立場を考えた学びを紹介。',terms:['行動','学び','交流','仲間','地域','出会い','関わり','発見','挑戦','成長'],status:'published',checkedAt:'2026-10-10'},
  {id:'jrc-hokkaido-2025',title:'令和７年度青少年赤十字トレーニング・センター（道央会場）を開催しました！',url:'https://www.jrc.or.jp/chapter/hokkaido/about/topics/2025/0821_048570.html',publisher:'日本赤十字社 北海道支部',kind:'活動レポート',description:'高校生が救護技術や赤十字の活動を学び、実技と発表に取り組んだ研修会の記録。',terms:['行動','学び','交流','仲間','地域','出会い','準備','発見','挑戦','成長'],status:'published',checkedAt:'2026-10-10'},
  {id:'iida-volunteer-2026',title:'「私がボランティアを続ける理由」',url:'https://i-kagaku.com/archives/17370',publisher:'南信州飯田 おもしろ科学工房',kind:'体験談',description:'科学工房のボランティア参加者が、活動を続ける理由を振り返る。',terms:['きっかけ','挑戦','行動','学び','関わり','子ども','成長','地域','発見','一歩'],status:'published',checkedAt:'2026-10-10'},
  {id:'iida-staff-2024',title:'高校生4人がスタッフに',url:'https://i-kagaku.com/archives/14993',publisher:'南信州飯田 おもしろ科学工房',kind:'活動レポート',description:'理科実験ミュージアムで高校生4人がスタッフとして活動したことを伝える記事。',terms:['挑戦','行動','学び','交流','関わり','子ども','地域','発見','工夫','自信'],status:'published',checkedAt:'2026-10-10'},
  {id:'iida-science-2025',title:'浮沈子・スライム・くるくるアニメ・皿まわし・輪っかとり・空気砲・シャボン玉〖2025年おもしろ科学大実験〗',url:'https://i-kagaku.com/archives/15959',publisher:'南信州飯田 おもしろ科学工房',kind:'活動レポート',description:'高校生ボランティアが実験を練習し、来場者に教える側になった活動の記録。',terms:['準備','挑戦','行動','学び','交流','関わり','子ども','地域','発見','工夫','成長'],status:'published',checkedAt:'2026-10-10'},
  {id:'nagoya-boramimi-2011',title:'インターン・ボラみ隊 ボランティア体験記 ―― セカンドハーベスト名古屋',url:'https://www.boramimi.com/bn/taikenki/2011/second/',publisher:'ボラみみより情報局',kind:'体験談',description:'セカンドハーベスト名古屋を訪れ、食品の箱詰めと支援先への配送を体験した記録。',terms:['挑戦','行動','学び','関わり','地域','準備','発見','工夫','交流','一歩'],status:'published',checkedAt:'2026-10-10'},
  {id:'nagoya-readyfor-2018',title:'〖活躍するボランティアの声〗',url:'https://readyfor.jp/projects/2h-nagoya/announcements/74738',publisher:'セカンドハーベスト名古屋／READYFOR',kind:'活動レポート',description:'団体スタッフがボランティアの参加動機と、食料支援の現場で活動を続ける力について紹介。',terms:['きっかけ','行動','学び','関わり','地域','出会い','交流','仲間','居場所','発見'],status:'published',checkedAt:'2026-10-10'},
  {id:'saitama-iec-2024',title:'IEC News No.48 ユース国際ボランティア活動',url:'https://stib.jp/international/wp-content/uploads/IECNews_No48.pdf',publisher:'さいたま観光国際協会 国際交流センター',kind:'活動レポート',description:'ユースメンバーの大使館訪問と異文化を学ぶ活動を伝える公式ニュースレター。',terms:['挑戦','行動','学び','交流','仲間','出会い','文化','発見','言葉','地域'],status:'published',checkedAt:'2026-10-10'},
  {id:'saitama-iec-2025',title:'IEC News No.51 ユース国際ボランティア活動',url:'https://stib.jp/international/wp-content/uploads/IECNews_No51.pdf',publisher:'さいたま観光国際協会 国際交流センター',kind:'活動レポート',description:'ユースメンバーの高校生が企画運営に関わった国際交流の遊び場を紹介。',terms:['挑戦','行動','学び','交流','仲間','出会い','文化','発見','子ども','工夫','関わり'],status:'published',checkedAt:'2026-10-10'},
  {id:'saitama-iec-older',title:'IEC News ユース国際ボランティア特集',url:'https://stib.jp/international/wp-content/uploads/iec05.pdf',publisher:'さいたま観光国際協会 国際交流センター',kind:'活動レポート',description:'高校生と大学生のユースメンバーが留学生との交流や国際機関訪問に取り組む様子を特集。',terms:['きっかけ','挑戦','行動','学び','交流','仲間','出会い','文化','発見','友達'],status:'published',checkedAt:'2026-10-10'},
  {id:'tosacco-report-2024',title:'こどもが運営するまち「とさっ子タウン 2024」事業報告・御礼',url:'https://tosacco-town.com/wp-content/uploads/2024/12/d718e2003ef397dd89f53cab3953e3ae.pdf',publisher:'とさっ子タウン事務局',kind:'活動レポート',description:'2024年開催の事業報告。子ども主体のまちを学生や大人のボランティアが支えた活動を紹介。',terms:['挑戦','行動','学び','交流','仲間','出会い','子ども','地域','居場所','関わり','工夫'],status:'published',checkedAt:'2026-10-10'},
  {id:'ai-dcon-2026-final',title:'DCON2026 本選',url:'https://dcon.ai/final/',publisher:'DCON公式',kind:'活動レポート',description:'AIを使った社会課題解決作品を、高専生チームが本選でプレゼンテーションした記録。作品名と着眼点から発想の広がりを確認できる。',terms:['挑戦','作品','アイデア','AI','発表','チーム','工夫','学び','準備','改善','伝える','課題'],status:'published',checkedAt:'2026-10-10'},
  {id:'ai-dcon-2025-results',title:'DCON2025 最終審査結果発表',url:'https://dcon.ai/dcon2025/results2025/',publisher:'DCON公式',kind:'活動レポート',description:'介護、養殖、海難事故など身近な課題をAIで解決しようとした学生作品と、審査で評価された視点を紹介。',terms:['挑戦','作品','アイデア','AI','発表','チーム','工夫','学び','準備','改善','伝える','課題'],status:'published',checkedAt:'2026-10-10'},
  {id:'ai-dcon-2025-teams',title:'DCON2025 出場チーム一覧',url:'https://dcon.ai/dcon2025/pass2025/',publisher:'DCON公式',kind:'活動レポート',description:'多数の応募から審査を通過したAI作品を一覧化。身近な困りごとをどのような作品に変えたかを比べられる。',terms:['挑戦','作品','アイデア','AI','発表','チーム','工夫','学び','準備','改善','伝える','課題'],status:'published',checkedAt:'2026-10-10'},
  {id:'ai-dcon-nagara-2025',title:'DCON2025 豊田高専「NAGARA」が最優秀賞',url:'https://dcon.ai/news/20250510001/',publisher:'DCON公式',kind:'活動レポート',description:'介護現場の課題から生まれたAI作品が本選で評価された事例。利用者を意識した着眼点と伝え方を知る材料になる。',terms:['挑戦','作品','アイデア','AI','発表','チーム','工夫','学び','準備','改善','伝える','課題'],status:'published',checkedAt:'2026-10-10'},
  {id:'ai-presentation-koshien-interview-2021',title:'全国高校生プレゼン甲子園 最優秀賞チーム インタビュー',url:'https://presen.or.jp/2021/09/3587/',publisher:'一般社団法人プレゼンテーション協会',kind:'体験談',description:'高校生チームがテーマを掘り下げ、役割を分担しながら発表を仕上げた過程を振り返るインタビュー。',terms:['挑戦','作品','アイデア','AI','発表','チーム','工夫','学び','準備','改善','伝える','課題'],status:'published',checkedAt:'2026-10-10'},
  {id:'ai-presentation-koshien-2026',title:'第6回プレゼン甲子園 結果発表',url:'https://presen.or.jp/2026/08/8450/',publisher:'一般社団法人プレゼンテーション協会',kind:'活動レポート',description:'全国の高校生が社会課題への提案を発表した大会記録。決勝作品のテーマと、伝えるための構成例を確認できる。',terms:['挑戦','作品','アイデア','AI','発表','チーム','工夫','学び','準備','改善','伝える','課題'],status:'published',checkedAt:'2026-10-10'},
  {id:'speech-kinjo-2025',title:'第72回高校生の主張コンクール 出場者インタビュー',url:'https://www.hs.kinjo-u.ac.jp/news/2026/d713.html',publisher:'金城学院中学校・高等学校',kind:'体験談',description:'応募の動機、題材の決め方、中央大会で他の主張から受けた刺激を、出場した高校生本人が振り返る。',terms:['挑戦','主張','テーマ','原稿','練習','発表','緊張','学び','伝える','視野','調査','経験'],status:'published',checkedAt:'2026-10-10'},
  {id:'speech-okinawa-2026',title:'2026年度 高校生の主張コンクール沖縄県地方大会 結果報告',url:'https://kokusai.oihf.or.jp/report/1789438065/',publisher:'沖縄県国際交流・人材育成財団',kind:'活動レポート',description:'県内高校生が国際理解と協力について発表した地方大会の記録。中央大会へ進むまでの地域大会の雰囲気が分かる。',terms:['挑戦','主張','テーマ','原稿','練習','発表','緊張','学び','伝える','視野','調査','経験'],status:'published',checkedAt:'2026-10-10'},
  {id:'speech-yaeyama-2025',title:'世界へ届け、八重農生の主張',url:'https://note.com/genial_crab7745/n/n343e53e66cc1',publisher:'沖縄県立八重山農林高等学校',kind:'体験談',description:'大会で感じたプレッシャーと、大きな声で自分の考えを届けるために意識したことを紹介する学校公式記事。',terms:['挑戦','主張','テーマ','原稿','練習','発表','緊張','学び','伝える','視野','調査','経験'],status:'published',checkedAt:'2026-10-10'},
  {id:'speech-sendai-nika-2018',title:'高校生の主張コンクール 中央大会特賞・法務大臣賞受賞',url:'https://nika.myswan.ed.jp/bbses/bbs_articles/view/121/ecae6138fdafc77e6e26d773458be9cd?frame_id=161',publisher:'宮城県仙台二華中学校・高等学校',kind:'体験談',description:'原稿を納得できるまで直し、聞き手に伝わる抑揚を練習して本番の緊張に向き合った受賞者の振り返り。',terms:['挑戦','主張','テーマ','原稿','練習','発表','緊張','学び','伝える','視野','調査','経験'],status:'published',checkedAt:'2026-10-10'},
  {id:'speech-fujimigaoka-2024',title:'高校生の主張コンクール東京都大会で金賞獲得',url:'https://www.fujimigaoka.ac.jp/news/10700/',publisher:'富士見丘学園',kind:'活動レポート',description:'探究活動で調べた外国人児童の学習支援を、6分間のスピーチとしてまとめて発表した高校生の大会記録。',terms:['挑戦','主張','テーマ','原稿','練習','発表','緊張','学び','伝える','視野','調査','経験'],status:'published',checkedAt:'2026-10-10'},
  {id:'speech-tokyo-winners-2024',title:'第71回 高校生の主張コンクール東京都大会 入賞者',url:'https://tabunka.tokyo-tsunagari.or.jp/essay/high_result.html',publisher:'東京都つながり創生財団',kind:'活動レポート',description:'東京都大会で選ばれた主張と題材を掲載。身近な経験から国際社会の課題へつなげるテーマ設定の参考になる。',terms:['挑戦','主張','テーマ','原稿','練習','発表','緊張','学び','伝える','視野','調査','経験'],status:'published',checkedAt:'2026-10-10'},
  {id:'science-koshien-report-2026',title:'第15回 科学の甲子園全国大会 ダイジェスト・レポート',url:'https://koushien.jst.go.jp/koushien/report/2026/index.html',publisher:'科学技術振興機構（JST）',kind:'活動レポート',description:'全国の高校生チームが筆記・実技競技に挑み、役割分担や試行錯誤を重ねた第15回全国大会の公式記録。',terms:['挑戦','科学','チーム','役割分担','実験','課題','発想','準備','失敗','改善','交流','学び'],status:'published',checkedAt:'2026-10-10'},
  {id:'science-koshien-report-2025',title:'第14回 科学の甲子園全国大会 ダイジェスト・レポート',url:'https://koushien.jst.go.jp/koushien/report/2025/index.html',publisher:'科学技術振興機構（JST）',kind:'活動レポート',description:'実験、工作、計測にチームで取り組み、失敗を修正しながら答えを探した高校生たちの公式大会レポート。',terms:['挑戦','科学','チーム','役割分担','実験','課題','発想','準備','失敗','改善','交流','学び'],status:'published',checkedAt:'2026-10-10'},
  {id:'science-koshien-report-2024',title:'第13回 科学の甲子園全国大会 ダイジェスト・レポート',url:'https://koushien.jst.go.jp/koushien/report/2024/index.html',publisher:'科学技術振興機構（JST）',kind:'活動レポート',description:'分野を越えた問題を分担し、実験の順序を組み直しながら課題解決した第13回大会の様子を紹介。',terms:['挑戦','科学','チーム','役割分担','実験','課題','発想','準備','失敗','改善','交流','学び'],status:'published',checkedAt:'2026-10-10'},
  {id:'science-koshien-report-2023',title:'第12回 科学の甲子園全国大会 ダイジェスト・レポート',url:'https://koushien.jst.go.jp/koushien/report/2023/index.html',publisher:'科学技術振興機構（JST）',kind:'活動レポート',description:'全国大会で高校生が知識と発想を持ち寄り、相談しながら筆記・実技競技に臨んだ過程をまとめた公式記録。',terms:['挑戦','科学','チーム','役割分担','実験','課題','発想','準備','失敗','改善','交流','学び'],status:'published',checkedAt:'2026-10-10'},
  {id:'science-koshien-interview-2023',title:'科学の甲子園 県代表校オンラインインタビューレポート',url:'https://koushien.jst.go.jp/koushien/report/2023/special.html',publisher:'科学技術振興機構（JST）',kind:'体験談',description:'全国大会を目指す代表校の生徒が、チームづくりや準備、科学への関心について答えた公式インタビュー。',terms:['挑戦','科学','チーム','役割分担','実験','課題','発想','準備','失敗','改善','交流','学び'],status:'published',checkedAt:'2026-10-10'},
  {id:'science-koshien-five-years',title:'「科学の甲子園」挑戦の5年間',url:'https://scienceportal.jst.go.jp/stories/20160509_01/',publisher:'Science Portal（JST）',kind:'活動レポート',description:'大会の成り立ちと、分野の異なる高校生が協力して課題を解く意味、参加後の交流までを振り返る記事。',terms:['挑戦','科学','チーム','役割分担','実験','課題','発想','準備','失敗','改善','交流','学び'],status:'published',checkedAt:'2026-10-10'},
  {id:'ai-dcon-2024-final',title:'DCON2024 本選',url:'https://dcon.ai/dcon2024/final2024/',publisher:'DCON公式',kind:'活動レポート',description:'AI作品の実機説明、5分間のプレゼン、質疑応答まで、本選で学生が作品の価値を伝える流れを紹介。',terms:['AI','作品','発表','チーム','準備','伝える','課題'],status:'published',checkedAt:'2026-10-10'},
  {id:'ai-dcon-2024-results',title:'DCON2024 最終審査結果発表',url:'https://dcon.ai/dcon2024/results2024/',publisher:'DCON公式',kind:'活動レポート',description:'電話詐欺、養殖、睡眠などの課題から生まれたAI作品と、審査員が評価した着眼点をまとめた公式記録。',terms:['AI','作品','アイデア','工夫','改善','伝える','課題'],status:'published',checkedAt:'2026-10-10'},
  {id:'ai-dcon-2024-report',title:'DCON2024大会レポート',url:'https://dcon.ai/news/20240521001/',publisher:'DCON公式',kind:'活動レポート',description:'学生チームが地域の当事者に話を聞き、課題を捉え直してAIプロダクトへ育てた過程を紹介する大会レポート。',terms:['AI','作品','アイデア','チーム','学び','改善','伝える','課題'],status:'published',checkedAt:'2026-10-10'},
  {id:'ai-dcon-ob-talk-2024',title:'DCON経験者に聞く 説明会・相談会',url:'https://dcon.ai/news/20230806001/',publisher:'DCON公式',kind:'体験談',description:'過去の本選経験者が、コンテストで得たことや作品を次の活動につなげた経験を参加希望者へ伝える企画。',terms:['AI','アイデア','発表','チーム','学び','挑戦','準備','伝える'],status:'published',checkedAt:'2026-10-10'},
  {id:'speech-osaka-gakugei-2025',title:'第72回高校生の主張コンクール 大阪府大会最優秀賞',url:'https://www.osakagakugei.ac.jp/senior/news/24338',publisher:'大阪学芸高等学校',kind:'体験談',description:'差別をテーマに6分間のスピーチを届け、練習の成果を中央大会につなげた高校生の大会記録。',terms:['主張','テーマ','原稿','練習','発表','緊張','伝える','経験'],status:'published',checkedAt:'2026-10-10'},
  {id:'speech-clark-2025',title:'国連主催「高校生の主張コンクール」中央大会出場',url:'https://www.clark.ed.jp/pickup/229288/',publisher:'クラーク記念国際高等学校',kind:'体験談',description:'友人へのインタビューと教員の助言を取り入れ、実体験に基づく国際的な視点へ原稿を練り上げた過程。',terms:['主張','テーマ','原稿','練習','発表','調査','伝える','視野','経験'],status:'published',checkedAt:'2026-10-10'},
  {id:'speech-aichi-nakamura-2023',title:'第70回高校生の主張コンクール 特賞受賞',url:'https://nakamura-h.aichi-c.ed.jp/news/detail/190',publisher:'愛知県立中村高等学校',kind:'活動レポート',description:'県代表として中央大会に進み、国際的な課題について自分の主張を発表した高校生の受賞記録。',terms:['主張','テーマ','原稿','練習','発表','緊張','伝える','視野'],status:'published',checkedAt:'2026-10-10'},
  {id:'speech-osaka-gakugei-2022',title:'高校生の主張コンクール大阪府大会 受賞者の記録',url:'https://www.osakagakugei.ac.jp/uploads/senior/sites/3/2021/05/gakugeisinnbunn21.pdf',publisher:'大阪学芸高等学校',kind:'体験談',description:'国際課題を調べ、自分の意見を言葉にして、練習を重ねながら大会発表に臨んだ高校生の学校新聞記事。',terms:['主張','テーマ','原稿','練習','発表','調査','学び','伝える'],status:'published',checkedAt:'2026-10-10'},
  {id:'science-koshien-report-2022',title:'第11回 科学の甲子園全国大会 ダイジェスト・レポート',url:'https://koushien.jst.go.jp/koushien/report/2022/index.html',publisher:'科学技術振興機構（JST）',kind:'活動レポート',description:'全国の代表校が科学の筆記・実技課題を分担し、チームで解決策を組み立てた第11回大会の公式記録。',terms:['科学','チーム','役割分担','実験','課題','準備','交流','学び'],status:'published',checkedAt:'2026-10-10'},
  {id:'science-koshien-report-2021',title:'第10回 科学の甲子園全国大会 ダイジェスト・レポート',url:'https://koushien.jst.go.jp/koushien/report/2021/index.html',publisher:'科学技術振興機構（JST）',kind:'活動レポート',description:'限られた時間で科学課題に挑み、相談と試行錯誤を重ねた高校生チームの大会公式レポート。',terms:['科学','チーム','役割分担','実験','課題','失敗','改善','学び'],status:'published',checkedAt:'2026-10-10'},
  {id:'science-koshien-report-2019',title:'第8回 科学の甲子園全国大会 ダイジェスト・レポート',url:'https://koushien.jst.go.jp/koushien/report/2019/index.html',publisher:'科学技術振興機構（JST）',kind:'活動レポート',description:'各分野の得意を持ち寄り、実験やものづくりの課題へ協力して取り組んだ全国大会の記録。',terms:['科学','チーム','役割分担','実験','発想','失敗','改善','交流'],status:'published',checkedAt:'2026-10-10'},
  {id:'science-koshien-report-2018',title:'第7回 科学の甲子園全国大会 ダイジェスト・レポート',url:'https://koushien.jst.go.jp/koushien/report/2018/index.html',publisher:'科学技術振興機構（JST）',kind:'活動レポート',description:'科学好きの高校生が全国から集まり、役割を分担しながら筆記・実技競技に挑戦した大会レポート。',terms:['科学','チーム','役割分担','実験','発想','準備','交流','学び'],status:'published',checkedAt:'2026-10-10'},
  {id:'tosacco-report-2023',title:'とさっ子タウン2023 事業報告',url:'https://www.kfca.jp/kikaku/tosacco-town2023/',publisher:'高知市文化振興事業団',kind:'活動レポート',description:'子どもが運営するまちを、学生や地域のスタッフが支えた2023年開催の事業概要と活動記録。',terms:['挑戦','学び','交流','子ども','地域','関わり','工夫','準備'],status:'published',checkedAt:'2026-10-10'},
];

const tobitateArticleIds=['hayashi-3352','okajima-3291','rin-3536','sara-3321','otaka-3136','nishiyama-3073','awata-2125','hana-2193','natsumi-2223','shijimi-998','risa-1520','saaya-1004','otoha-1436','nonoka-894'] as const;
const ibarakiReportArticleIds=['ibaraki-shanti-2025','ibaraki-christmas-cake-2025','ibaraki-ninja-play-2025','ibaraki-cosmos-girls-2025','ibaraki-machinoko-2025','ibaraki-machinoizumi-2025','ibaraki-sports-tag-2025','ibaraki-playpark-2025','ibaraki-field-trip-2025','ibaraki-sacchanchi-2025','ibaraki-child-watch-2025','ibaraki-rural-kabuki-2025','ibaraki-310-shokudo-2025'] as const;
const secondHarvestArticleIds=['2hj-kiriyama-2018','2hj-okada-2018','2hj-shirai-2018','2hj-doi-2017','2hj-ishii-2013'] as const;
const tangoArticleIds=['tango-mizuno-2019','tango-meguro-2020','tango-vln-2023'] as const;
const yururuArticleIds=['yururu-mirai-2022','yururu-hattatsu-2022','yururu-yuwa-2022','yururu-nijiiro-2022','yururu-tsuyaku-2022','yururu-senior-2022'] as const;
const asoArticleIds=['aso-report-2025','aso-report-2024','aso-report-2023'] as const;
const awardArticleIds=['award-summary-2026','award-summary-2025','award-summary-2024'] as const;
const jfieArticleIds=['jfie-imuta-2017','jfie-thanks-2017','jfie-toyoda-2017','jfie-kuhara-2017','jfie-beloved-2017'] as const;
const eilArticleIds=['eil-si-2026','eil-ht-2024','eil-at-2025','eil-to-2025','eil-yamaguchi-2022'] as const;
const ftcjArticleIds=['ftcj-camp-summer-2025','ftcj-camp-winter-2025','ftcj-camp-summer-2024'] as const;
const jrcArticleIds=['jrc-kagoshima-2025','jrc-gunma-2025','jrc-hokkaido-2025'] as const;
const iidaArticleIds=['iida-volunteer-2026','iida-staff-2024','iida-science-2025'] as const;
const nagoyaArticleIds=['nagoya-boramimi-2011','nagoya-readyfor-2018'] as const;
const saitamaArticleIds=['saitama-iec-2024','saitama-iec-2025','saitama-iec-older'] as const;
const aiPresentationArticleIds=['ai-dcon-2026-final','ai-dcon-2025-results','ai-dcon-2025-teams','ai-dcon-nagara-2025','ai-presentation-koshien-interview-2021','ai-presentation-koshien-2026','ai-dcon-2024-final','ai-dcon-2024-results','ai-dcon-2024-report','ai-dcon-ob-talk-2024'] as const;
const highschoolSpeechArticleIds=['speech-kinjo-2025','speech-okinawa-2026','speech-yaeyama-2025','speech-sendai-nika-2018','speech-fujimigaoka-2024','speech-tokyo-winners-2024','speech-osaka-gakugei-2025','speech-clark-2025','speech-aichi-nakamura-2023','speech-osaka-gakugei-2022'] as const;
const scienceKoshienArticleIds=['science-koshien-report-2026','science-koshien-report-2025','science-koshien-report-2024','science-koshien-report-2023','science-koshien-interview-2023','science-koshien-five-years','science-koshien-report-2022','science-koshien-report-2021','science-koshien-report-2019','science-koshien-report-2018'] as const;

const articleLinksFor=(opportunityId:string,articleIds:readonly string[],evidence:string,verifiedAt:string,relation:ArticleLink['relation']='same-program'):ArticleLink[]=>articleIds.map(articleId=>({
  opportunityId,
  articleId,
  relation,
  status:'published',
  evidence,
  verifiedAt,
}));

export const voiceArticleLinks: readonly ArticleLink[] = [
  ...articleLinksFor('tobitate-highschool-12-2027',tobitateArticleIds,'トビタテ！留学JAPAN公式「留学大図鑑」の体験記事','2026-10-09'),
  ...articleLinksFor('ibaraki-volunteer-report-winter-2026',ibarakiReportArticleIds,'公式事業ページに掲載された「学生によるボランティア体験ルポ事業」の体験記','2026-10-09'),
  ...articleLinksFor('second-harvest-volunteer',ibarakiReportArticleIds,'学生によるボランティア体験記として、初参加・準備・関わり方の判断材料になる同分野の記事','2026-10-09','same-field'),
  ...articleLinksFor('tango-therapy-volunteer',ibarakiReportArticleIds,'学生によるボランティア体験記として、初参加・交流・相手との関わり方の判断材料になる同分野の記事','2026-10-09','same-field'),
  ...articleLinksFor('yururu-summer-volunteer-2027-watch',ibarakiReportArticleIds,'NPOで活動した学生の体験記として、活動先選びと初参加の判断材料になる同分野の記事','2026-10-09','same-field'),
  ...articleLinksFor('aso-international-workcamp-2027-watch',ibarakiReportArticleIds,'学生による地域・社会活動の体験記として、交流や共同作業の判断材料になる同分野の記事','2026-10-09','same-field'),
  ...articleLinksFor('highschool-volunteer-award-2027-watch',ibarakiReportArticleIds,'高校生を含む学生のボランティア体験記として、活動内容や学びを考える判断材料になる同分野の記事','2026-10-09','same-field'),
  ...articleLinksFor('second-harvest-volunteer',secondHarvestArticleIds,'セカンドハーベスト・ジャパンが公開した過年度のボランティア・インターン経験','2026-10-10'),
  ...articleLinksFor('tango-therapy-volunteer',tangoArticleIds,'日本タンゴセラピー協会が公開・投稿した過年度の活動記録','2026-10-10'),
  ...articleLinksFor('yururu-summer-volunteer-2027-watch',yururuArticleIds,'杜の伝言板ゆるるが公開した過年度の「NPOで高校生の夏ボラ体験」の記録','2026-10-10'),
  ...articleLinksFor('aso-international-workcamp-2027-watch',asoArticleIds,'熊本市国際交流振興事業団が公開した過年度の同プログラム報告','2026-10-10'),
  ...articleLinksFor('highschool-volunteer-award-2027-watch',awardArticleIds,'風に立つライオン基金が公開した過年度の高校生ボランティア・アワード大会報告','2026-10-10'),
  ...articleLinksFor('jfie-exchange-2027',jfieArticleIds,'JFIE公式サイトに掲載された過年度の高校生交換留学体験','2026-10-10'),
  ...articleLinksFor('eil-exchange-selection-2027',eilArticleIds,'EILが運営する体験者ブログに掲載された高校生交換留学体験','2026-10-10'),
  ...articleLinksFor('jfie-exchange-2027',tobitateArticleIds,'留学・国際交流の準備に役立つ他プログラムの高校生体験談','2026-10-10','same-field'),
  ...articleLinksFor('eil-exchange-selection-2027',tobitateArticleIds,'留学・国際交流の準備に役立つ他プログラムの高校生体験談','2026-10-10','same-field'),
  ...articleLinksFor('take-action-camp-winter-2026',ftcjArticleIds,'主催者が公開した過年度のテイク・アクション・キャンプ開催報告','2026-10-10'),
  ...articleLinksFor('take-action-camp-winter-2026',asoArticleIds,'高校生が共同生活・社会課題への活動を経験する同分野の報告','2026-10-10','same-field'),
  ...articleLinksFor('take-action-camp-winter-2026',tobitateArticleIds,'初参加の不安や行動への一歩を考える高校生の体験談','2026-10-10','same-field'),
  ...articleLinksFor('jrc-school-membership',jrcArticleIds,'日本赤十字社の各支部が公開した青少年赤十字の高校生活動報告','2026-10-10'),
  ...articleLinksFor('jrc-school-membership',awardArticleIds,'高校生による地域奉仕活動の発表例','2026-10-10','same-field'),
  ...articleLinksFor('jrc-school-membership',ibarakiReportArticleIds,'高校生の地域奉仕における参加経験','2026-10-10','same-field'),
  ...articleLinksFor('second-harvest-nagoya-student-day-2026',secondHarvestArticleIds,'別団体のフードバンクでの参加体験。名古屋の活動とは異なる','2026-10-10','same-field'),
  ...articleLinksFor('second-harvest-nagoya-student-day-2026',['ibaraki-sacchanchi-2025','ibaraki-310-shokudo-2025','ibaraki-christmas-cake-2025'],'食を通じた地域支援の高校生体験','2026-10-10','same-field'),
  ...articleLinksFor('second-harvest-nagoya-student-day-2026',nagoyaArticleIds,'セカンドハーベスト名古屋での過年度の体験記・活動レポート','2026-10-10'),
  ...articleLinksFor('iida-science-volunteer-2026',['ibaraki-ninja-play-2025','ibaraki-machinoko-2025','ibaraki-playpark-2025','ibaraki-field-trip-2025','ibaraki-child-watch-2025','yururu-mirai-2022','yururu-hattatsu-2022','yururu-yuwa-2022'],'子どもの学びや遊びを支える学生ボランティア体験。科学実験とは活動内容が異なる','2026-10-10','same-field'),
  ...articleLinksFor('iida-science-volunteer-2026',iidaArticleIds,'南信州飯田おもしろ科学工房が公開した高校生ボランティアの声と過年度の活動記録','2026-10-10'),
  ...articleLinksFor('tosacco-student-volunteer-2027-watch',['ibaraki-ninja-play-2025','ibaraki-machinoko-2025','ibaraki-playpark-2025','ibaraki-field-trip-2025','ibaraki-child-watch-2025','yururu-mirai-2022','yururu-yuwa-2022','yururu-nijiiro-2022'],'子どもが主体の活動を支える学生ボランティア体験。とさっ子タウン参加者本人の記事ではない','2026-10-10','same-field'),
  ...articleLinksFor('tosacco-student-volunteer-2027-watch',['tosacco-report-2024','tosacco-report-2023'],'とさっ子タウンの運営主体が公開した過年度の同プログラム事業報告','2026-10-10'),
  ...articleLinksFor('saitama-youth-international-volunteer',['yururu-tsuyaku-2022',...asoArticleIds,...jrcArticleIds,...tobitateArticleIds],'通訳・交流や高校生の国際的な活動に関する体験・報告。他団体の事例を含む','2026-10-10','same-field'),
  ...articleLinksFor('saitama-youth-international-volunteer',saitamaArticleIds,'さいたま観光国際協会が公開した同活動の公式ニュースレター','2026-10-10'),
  ...articleLinksFor('generative-ai-presentation-2026',aiPresentationArticleIds,'生成AI作品開発または高校生プレゼンテーションの近接事例。対象のコンテストは初回開催のため同一大会の体験記事ではない','2026-10-10','same-field'),
  ...articleLinksFor('highschool-speech-2027-watch',highschoolSpeechArticleIds,'同一の「国際理解・国際協力のための高校生の主張コンクール」に関する出場者の声・大会記録','2026-10-10'),
  ...articleLinksFor('science-koshien-2027-watch',scienceKoshienArticleIds,'科学技術振興機構が公開した同一大会の過年度レポート・インタビュー','2026-10-10'),
];

export const voiceEditorialPolicy = {
  minimumArticles: 10,
  maximumArticles: 18,
  minimumCloudTerms: 4,
  maximumCloudTerms: 6,
  maximumCrossOpportunityOverlap: 0.25,
} as const;

type VoiceCollectionConfig = {
  // An editor chooses four to six terms after reviewing the article pool.
  terms: readonly string[];
  // Older collections remain visible while their broad fallback links are replaced.
  quality: 'target' | 'legacy';
};

const voiceCollectionConfigs: Readonly<Record<string,VoiceCollectionConfig>> = {
  'tobitate-highschool-12-2027':{terms:['英語','行動','挑戦','ホームステイ','不安','成長'],quality:'legacy'},
  'ibaraki-volunteer-report-winter-2026':{terms:['関わり','地域','子ども','居場所','不安','工夫'],quality:'legacy'},
  'second-harvest-volunteer':{terms:['関わり','地域','行動','学び','安心'],quality:'legacy'},
  'tango-therapy-volunteer':{terms:['交流','関わり','安心','地域','学び'],quality:'legacy'},
  'yururu-summer-volunteer-2027-watch':{terms:['不安','一歩','子ども','居場所','関わり','工夫'],quality:'legacy'},
  'aso-international-workcamp-2027-watch':{terms:['交流','出会い','挑戦','準備','地域'],quality:'legacy'},
  'highschool-volunteer-award-2027-watch':{terms:['挑戦','発見','交流','地域','工夫'],quality:'legacy'},
  'jfie-exchange-2027':{terms:['英語','友達','ホームステイ','文化','挑戦','成長'],quality:'legacy'},
  'eil-exchange-selection-2027':{terms:['英語','言葉','文化','成長','挑戦','交流'],quality:'legacy'},
  'take-action-camp-winter-2026':{terms:['挑戦','行動','仲間','交流','発見'],quality:'legacy'},
  'jrc-school-membership':{terms:['地域','交流','行動','工夫','関わり'],quality:'legacy'},
  'second-harvest-nagoya-student-day-2026':{terms:['行動','地域','居場所','関わり'],quality:'legacy'},
  'iida-science-volunteer-2026':{terms:['子ども','挑戦','工夫','関わり','学び'],quality:'legacy'},
  'tosacco-student-volunteer-2027-watch':{terms:['子ども','地域','交流','準備','工夫'],quality:'legacy'},
  'saitama-youth-international-volunteer':{terms:['交流','言葉','仲間','出会い','挑戦'],quality:'legacy'},
  'generative-ai-presentation-2026':{terms:['AI','アイデア','作品','改善','伝える'],quality:'target'},
  'highschool-speech-2027-watch':{terms:['テーマ','原稿','練習','発表','伝える'],quality:'target'},
  'science-koshien-2027-watch':{terms:['科学','チーム','実験','役割分担','失敗','交流'],quality:'target'},
};

const articleById = new Map(voiceArticles.map(article => [article.id,article]));

export function voiceArticlesFor(opportunityId:string) {
  const linked=new Map<string,{article:VoiceArticle;relation:ArticleLink['relation']}>();
  for(const link of voiceArticleLinks){
    if(link.opportunityId!==opportunityId||link.status!=='published')continue;
    const article=articleById.get(link.articleId);
    if(!article||article.status!=='published')continue;
    const previous=linked.get(article.id);
    if(!previous||link.relation==='same-program')linked.set(article.id,{article,relation:link.relation});
  }
  return [...linked.values()]
    .sort((a,b)=>Number(b.relation==='same-program')-Number(a.relation==='same-program'))
    .slice(0,voiceEditorialPolicy.maximumArticles);
}

export function voiceTermsFor(opportunityId:string) {
  const counts=new Map<string,number>();
  for(const {article} of voiceArticlesFor(opportunityId))for(const term of new Set(article.terms))counts.set(term,(counts.get(term)??0)+1);
  const config=voiceCollectionConfigs[opportunityId];
  return config?config.terms.map(term=>({term,count:counts.get(term)??0})):[];
}

function stableSelectionRank(value:string) {
  let hash=2166136261;
  for(let index=0;index<value.length;index+=1){
    hash^=value.charCodeAt(index);
    hash=Math.imul(hash,16777619);
  }
  return hash>>>0;
}

export function voiceResultsFor(opportunityId:string,term:string) {
  if(!voiceTermsFor(opportunityId).some(item=>item.term===term))return [];
  return voiceArticlesFor(opportunityId)
    .filter(({article})=>article.terms.includes(term))
    .sort((a,b)=>{
      const relationOrder=Number(b.relation==='same-program')-Number(a.relation==='same-program');
      if(relationOrder!==0)return relationOrder;
      const aRank=stableSelectionRank(`${opportunityId}:${term}:${a.article.id}`);
      const bRank=stableSelectionRank(`${opportunityId}:${term}:${b.article.id}`);
      return aRank-bRank||a.article.id.localeCompare(b.article.id,'ja');
    })
    .slice(0,3);
}

export function voiceRelationScopeFor(opportunityId:string) {
  const relations=new Set(voiceArticlesFor(opportunityId).map(item=>item.relation));
  if(relations.size===0)return null;
  if(relations.size===1)return relations.has('same-program')?'same-program':'same-field';
  return 'mixed';
}

export function voiceCatalogCheckedAt(opportunityId:string) {
  const dates=voiceArticlesFor(opportunityId).map(({article})=>article.checkedAt).sort();
  return dates[0]??null;
}

export function voiceOverlapAudit() {
  const opportunityIds=Object.keys(voiceCollectionConfigs);
  const displayedArticles=new Map(opportunityIds.map(opportunityId=>[
    opportunityId,
    new Set(voiceTermsFor(opportunityId).flatMap(({term})=>voiceResultsFor(opportunityId,term).map(({article})=>article.id))),
  ]));
  const pairs:{leftId:string;rightId:string;shared:number;rate:number;meetsTarget:boolean}[]=[];
  for(let leftIndex=0;leftIndex<opportunityIds.length;leftIndex+=1){
    for(let rightIndex=leftIndex+1;rightIndex<opportunityIds.length;rightIndex+=1){
      const leftId=opportunityIds[leftIndex],rightId=opportunityIds[rightIndex];
      const left=displayedArticles.get(leftId)!,right=displayedArticles.get(rightId)!;
      const shared=[...left].filter(articleId=>right.has(articleId)).length;
      const denominator=Math.min(left.size,right.size);
      const rate=denominator===0?0:shared/denominator;
      pairs.push({leftId,rightId,shared,rate,meetsTarget:rate<=voiceEditorialPolicy.maximumCrossOpportunityOverlap});
    }
  }
  return pairs.sort((a,b)=>b.rate-a.rate||a.leftId.localeCompare(b.leftId,'ja'));
}

function validateVoiceCatalog() {
  const issues:string[]=[];
  const ids=new Set<string>();
  const urls=new Set<string>();
  for(const article of voiceArticles){
    if(ids.has(article.id))issues.push(`Duplicate article id: ${article.id}`);
    if(urls.has(article.url))issues.push(`Duplicate article URL: ${article.url}`);
    ids.add(article.id);
    urls.add(article.url);
    if(article.status==='published'&&(!article.title.trim()||!article.publisher.trim()||!article.description.trim()))issues.push(`Incomplete published article: ${article.id}`);
    if(article.status==='published'&&!article.url.startsWith('https://'))issues.push(`Published article must use HTTPS: ${article.id}`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(article.checkedAt))issues.push(`Invalid article check date: ${article.id}`);
  }

  const linkKeys=new Set<string>();
  const linkedArticleIds=new Set<string>();
  const opportunityIds=new Set<string>();
  for(const link of voiceArticleLinks){
    const key=`${link.opportunityId}:${link.articleId}`;
    if(linkKeys.has(key))issues.push(`Duplicate opportunity/article link: ${key}`);
    linkKeys.add(key);
    linkedArticleIds.add(link.articleId);
    if(!articleById.has(link.articleId))issues.push(`Unknown linked article: ${link.articleId}`);
    if(link.status==='published'&&!link.evidence.trim())issues.push(`Missing relationship evidence: ${key}`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(link.verifiedAt))issues.push(`Invalid relationship verification date: ${key}`);
    if(link.status==='published')opportunityIds.add(link.opportunityId);
  }

  for(const article of voiceArticles){
    if(article.status==='published'&&!linkedArticleIds.has(article.id))issues.push(`Published article has no opportunity link: ${article.id}`);
  }

  for(const opportunityId of opportunityIds){
    const config=voiceCollectionConfigs[opportunityId];
    if(!config){issues.push(`Published voice entry needs an editorial configuration: ${opportunityId}`);continue;}
    const articleCount=voiceArticlesFor(opportunityId).length;
    if(articleCount<voiceEditorialPolicy.minimumArticles||articleCount>voiceEditorialPolicy.maximumArticles)issues.push(`Published voice entry needs ${voiceEditorialPolicy.minimumArticles}-${voiceEditorialPolicy.maximumArticles} articles: ${opportunityId} (${articleCount})`);
    const eligibleTerms=voiceTermsFor(opportunityId);
    if(eligibleTerms.length<voiceEditorialPolicy.minimumCloudTerms||eligibleTerms.length>voiceEditorialPolicy.maximumCloudTerms)issues.push(`Published voice entry needs ${voiceEditorialPolicy.minimumCloudTerms}-${voiceEditorialPolicy.maximumCloudTerms} selected terms: ${opportunityId}`);
    for(const {term,count} of eligibleTerms){
      if(count<3)issues.push(`Selected term needs at least 3 linked articles: ${opportunityId}/${term} (${count})`);
      if(voiceResultsFor(opportunityId,term).length!==3)issues.push(`Eligible term must return exactly 3 articles: ${opportunityId}/${term}`);
    }
  }

  for(const pair of voiceOverlapAudit()){
    const leftQuality=voiceCollectionConfigs[pair.leftId].quality;
    const rightQuality=voiceCollectionConfigs[pair.rightId].quality;
    if(!pair.meetsTarget&&(leftQuality==='target'||rightQuality==='target'))issues.push(`Voice result overlap exceeds ${voiceEditorialPolicy.maximumCrossOpportunityOverlap*100}% target: ${pair.leftId}/${pair.rightId} (${Math.round(pair.rate*100)}%)`);
  }
  return issues;
}

const voiceCatalogIssues=validateVoiceCatalog();
if(voiceCatalogIssues.length>0)throw new Error(`Invalid voice catalog:\n${voiceCatalogIssues.join('\n')}`);
