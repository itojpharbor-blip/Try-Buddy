import {ArrowLeft,ArrowUpRight,Sparkles} from 'lucide-react';
import {opportunities} from '@/lib/opportunities';
import {voiceCatalogCheckedAt,voiceRelationScopeFor,voiceResultsFor,voiceTermsFor} from '@/lib/voices';

const volunteerWordLayout=['子ども','行動','学び','関わり','きっかけ','挑戦','交流','出会い','不安','仲間','成長','地域','居場所','安心','勇気','準備','発見','一歩','工夫','自信'];
const wordLayouts:Record<string,readonly string[]>={
  'tobitate-highschool-12-2027':['英語','行動','学び','言葉','きっかけ','挑戦','交流','出会い','不安','仲間','成長','目標','友達','自信','勇気','ホームステイ','文化','準備','発見','一歩'],
  'jfie-exchange-2027':['英語','行動','学び','言葉','きっかけ','挑戦','交流','出会い','不安','仲間','成長','目標','友達','自信','勇気','ホームステイ','文化','準備','発見','一歩'],
  'eil-exchange-selection-2027':['英語','行動','学び','言葉','きっかけ','挑戦','交流','出会い','不安','仲間','成長','目標','友達','自信','勇気','ホームステイ','文化','準備','発見','一歩'],
  'ibaraki-volunteer-report-winter-2026':volunteerWordLayout,
  'second-harvest-volunteer':volunteerWordLayout,
  'tango-therapy-volunteer':volunteerWordLayout,
  'yururu-summer-volunteer-2027-watch':volunteerWordLayout,
  'aso-international-workcamp-2027-watch':volunteerWordLayout,
  'highschool-volunteer-award-2027-watch':volunteerWordLayout,
  'take-action-camp-winter-2026':volunteerWordLayout,
  'jrc-school-membership':volunteerWordLayout,
  'second-harvest-nagoya-student-day-2026':volunteerWordLayout,
  'iida-science-volunteer-2026':volunteerWordLayout,
  'tosacco-student-volunteer-2027-watch':volunteerWordLayout,
  'saitama-youth-international-volunteer':volunteerWordLayout,
};

export default async function VoicesPage({searchParams}:{searchParams:Promise<{challenge?:string;term?:string}>}) {
  const {challenge,term}=await searchParams;
  const opportunity=opportunities.find(item=>item.id===challenge);
  const words=opportunity?voiceTermsFor(opportunity.id):[];
  const wordLayout=opportunity?wordLayouts[opportunity.id]??[]:[];
  const cloudWords=[...words].sort((a,b)=>{
    const ai=wordLayout.indexOf(a.term),bi=wordLayout.indexOf(b.term);
    return (ai<0?Infinity:ai)-(bi<0?Infinity:bi);
  });
  const selected=words.some(item=>item.term===term)?term:null;
  const results=selected&&opportunity?voiceResultsFor(opportunity.id,selected):[];
  const cloudUrl=opportunity?`/voices?challenge=${encodeURIComponent(opportunity.id)}`:'/';
  const detailUrl=opportunity?`/?challenge=${encodeURIComponent(opportunity.id)}`:'/';
  const checkedAt=opportunity?voiceCatalogCheckedAt(opportunity.id):null;
  const checkedAtLabel=checkedAt?new Intl.DateTimeFormat('ja-JP',{dateStyle:'long',timeZone:'Asia/Tokyo'}).format(new Date(`${checkedAt}T00:00:00+09:00`)):null;
  const relationScope=opportunity?voiceRelationScopeFor(opportunity.id):null;
  const contextLabel=opportunity?(relationScope==='same-program'?`${opportunity.name} の体験談・活動記録から`:relationScope==='same-field'?`${opportunity.category}分野の体験談・活動記録から`:`${opportunity.name}と関連分野の体験談・活動記録から`):'';

  return <>
    <header className="header voices-header"><a className="brand" href="/" aria-label="Try Buddy ホーム"><span className="brandmark">tb<Sparkles aria-hidden="true"/></span>Try Buddy<span className="beta">BETA</span></a><span className="headernote">学生の、一歩目から。</span><a className="outline" href="/">募集を探す</a></header>
    <main className="voices-main">
      <nav className="voices-breadcrumb" aria-label="パンくずリスト"><a href="/">挑戦を見つける</a><span>/</span><a href={detailUrl}>募集の詳細</a><span>/</span><span>挑戦した人の声</span></nav>
      {!opportunity||words.length===0?<section className="voices-unavailable"><p className="eyebrow">VOICES</p><h1>記事を準備しています。</h1><p>この募集に関連する記事がそろい次第、挑戦した人の声を掲載します。</p><a className="outline" href={detailUrl}><ArrowLeft size={16}/>募集情報に戻る</a></section>:<>
        <p className="eyebrow">VOICES / {opportunity.category}</p>
        <h1 className="voices-title"><span>挑戦した人</span>の声</h1>
        <p className="voices-subtitle">{selected?`「${selected}」から、気になる体験を探そう。`:'気になる言葉をタップして記事を探す。'}</p>
        <p className="voices-context">{contextLabel}</p>
        {!selected?<>
          <div className={`voices-cloud voices-cloud-${cloudWords.length}`} aria-label={`関連記事を探す言葉、${cloudWords.length}語`}>
            {cloudWords.map(({term:word,count},index)=><a key={word} href={`${cloudUrl}&term=${encodeURIComponent(word)}`} className={`voices-word voices-word-${Math.min(4,Math.max(1,Math.ceil(count/3)))} voices-tone-${index%4} voices-word-position-${index+1}`} aria-label={`${word}に関する記事を3件見る`} title={`${word}に関する記事を3件見る`}>{word}</a>)}
          </div>
          <p className="voices-cloud-hint">言葉を選ぶと、関連する記事が3件表示されます。</p>
        </>:<>
          <a className="voices-back" href={cloudUrl}><ArrowLeft size={17}/>ほかの言葉を選ぶ</a>
          <h2 className="voices-results-title">「{selected}」に関する記事</h2>
          <div className="voices-results">{results.map(({article,relation},index)=><article className="voices-article" key={article.id}>
            <div className={`voices-article-accent voices-article-accent-${index%3}`} aria-hidden="true"/>
            <div className="voices-article-body"><div className="voices-article-meta"><span className="voices-relation">{relation==='same-program'?'同じプログラムの記事':'同じ分野の記事'}</span><span>{article.kind}</span></div>
              <p className="voices-publisher">{article.publisher}</p><h3>{article.title}</h3><p className="voices-description">{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="voices-article-link" aria-label={`${article.title}を外部サイトで読む`}>元記事を読む <ArrowUpRight size={17}/></a>
            </div>
          </article>)}</div>
        </>}
        <div className="voices-footer"><a href={detailUrl}><ArrowLeft size={17}/>募集情報に戻る</a><p>記事は外部サイトに掲載されています。Try Buddyは記事の内容を確認して独自に紹介しています。{checkedAtLabel&&` 最も古い記事リンク確認日：${checkedAtLabel}`}</p></div>
      </>}
    </main>
  </>;
}
