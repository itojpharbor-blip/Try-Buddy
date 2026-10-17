"use client";

import {useCallback,useEffect,useState} from 'react';
import {Bell,Bookmark,Check,Clock3,Compass,ExternalLink,Flag,LockKeyhole,MapPin,MessageCircle,Plus,Search,Settings2,Sparkles,Trash2,X} from 'lucide-react';
import {Tabs,TabsContent,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {Dialog,DialogContent,DialogDescription,DialogTitle} from '@/components/ui/dialog';
import {Field,FieldDescription,FieldGroup,FieldLabel} from '@/components/ui/field';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Alert,AlertDescription} from '@/components/ui/alert';
import {ToggleGroup,ToggleGroupItem} from '@/components/ui/toggle-group';
import {opportunities,regions,statuses,dateLabel,isClosed,nextDeadline,statusLabel,type Opportunity,type ChallengeStatus} from '@/lib/opportunities';
import {deadlineMessage,openDeadline,profileGrades,recommendedOpportunities,reminderFor,reminderOptions} from '@/lib/challenge-experience';
import {voiceRelationScopeFor,voiceTermsFor} from '@/lib/voices';
import CommunityTimeline from '@/app/community-timeline';
import InterestTagPicker from '@/app/interest-tag-picker';

type Profile={nickname:string;school:string;region:string;grade:string;interests:string[];reminderDays:number;bio:string;dream:string;publicId:string|null;profileVisible:boolean;dreamVisible:boolean;gradeVisible:boolean;regionVisible:boolean};
type Goal={id:string;title:string;firstStep:string;progress:number;updates:{text:string;progress:number;at:string}[];createdAt:string;opportunityId:string|null;status:ChallengeStatus;memo:string;nextAction:string;activityPeriod:string;reminderHidden:boolean;publicActivity:boolean;publicText:string};
type OfficialVisit={opportunityId:string;visitedAt:string};
type PublicProfile={id:string;nickname:string;bio:string;dream:string|null;grade:string|null;region:string|null};
type PublicProfileDetail=PublicProfile&{isOwnProfile:boolean;following:boolean;activities:{title:string;status:string;publicText:string;activityPeriod:string}[]};
type FeedItem={kind:'goal'|'post';id:string;profileId:string;profileVisible:boolean;isFollowing:boolean;nickname:string;title:string;status:string;publicText:string;activityPeriod:string;category:string|null;updatedAt:string;reactionCount:number;replyCount:number;reacted:boolean};
type ListingView='open'|'expected'|'recent';
const voiceEntryDescription=(opportunityId:string)=>voiceRelationScopeFor(opportunityId)==='same-program'?'同じプログラムに挑戦した人の記事を、気になる言葉から探せます。':voiceRelationScopeFor(opportunityId)==='same-field'?'同じ分野に挑戦した人の記事を、気になる言葉から探せます。':'同じプログラムや分野に挑戦した人の記事を、気になる言葉から探せます。';
const blankProfile:Profile={nickname:'',school:'',region:'',grade:'',interests:[],reminderDays:7,bio:'',dream:'',publicId:null,profileVisible:false,dreamVisible:false,gradeVisible:false,regionVisible:false};
const activityPeriodLabel=(status:string)=>status==='挑戦中'?'活動を始めた時期':'活動した時期';
const dismissedBannerStorageKey='try-buddy-dismissed-deadline-banners';
async function requestJson<T>(url:string,method='GET',body?:unknown):Promise<T>{
  const r=await fetch(url,{method,cache:'no-store',...(body===undefined?{}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})});
  const data=await r.json();if(!r.ok)throw Error((data as {error?:string}).error||'処理できませんでした。もう一度お試しください。');return data as T;
}
export default function Hub({initialNow}:{initialNow:number}){
  const [now,setNow]=useState(initialNow),[tab,setTab]=useState('discover');
  const [category,setCategory]=useState('すべて'),[query,setQuery]=useState(''),[grade,setGrade]=useState(''),[area,setArea]=useState(''),[fee,setFee]=useState(''),[listingView,setListingView]=useState<ListingView>('open');
  const [showFilters,setShowFilters]=useState(false);
  const [detail,setDetail]=useState<Opportunity|null>(null),[goals,setGoals]=useState<Goal[]>([]),[visits,setVisits]=useState<OfficialVisit[]>([]),[historyError,setHistoryError]=useState(''),[profile,setProfile]=useState<Profile|null>(null),[draft,setDraft]=useState<Profile>(blankProfile);
  const [signedIn,setSignedIn]=useState(false),[email,setEmail]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false);
  const [dismissedBannerTokens,setDismissedBannerTokens]=useState<string[]>([]);
  const [profileOpen,setProfileOpen]=useState(false),[pending,setPending]=useState<Opportunity|null>(null),[loginOpen,setLoginOpen]=useState(false),[compose,setCompose]=useState(false),[title,setTitle]=useState(''),[firstStep,setFirstStep]=useState('');
  const [editing,setEditing]=useState<Goal|null>(null),[status,setStatus]=useState<ChallengeStatus>('気になる'),[memo,setMemo]=useState(''),[nextAction,setNextAction]=useState(''),[activityPeriod,setActivityPeriod]=useState(''),[reminderHidden,setReminderHidden]=useState(false),[publicActivity,setPublicActivity]=useState(false),[publicText,setPublicText]=useState(''),[formError,setFormError]=useState(''),[deleteTarget,setDeleteTarget]=useState<Goal|'account'|null>(null);
  const [people,setPeople]=useState<PublicProfile[]>([]),[peopleLoading,setPeopleLoading]=useState(false),[peopleError,setPeopleError]=useState(''),[person,setPerson]=useState<PublicProfileDetail|null>(null);
  const [feed,setFeed]=useState<FeedItem[]>([]),[feedScope,setFeedScope]=useState<'following'|'all'>('all'),[feedLoading,setFeedLoading]=useState(false),[feedError,setFeedError]=useState('');
  const [reactionBusy,setReactionBusy]=useState<string|null>(null);
  const [channelTarget,setChannelTarget]=useState<Opportunity|null>(null);
  const load=useCallback(async()=>{
    setLoading(true);setError('');
    try{
      const [p,g,h]=await Promise.all([requestJson<{signedIn:boolean;email:string;profile:Profile|null}>('/api/profile'),requestJson<{goals:Goal[]}>('/api/goals'),requestJson<{items:OfficialVisit[]}>('/api/official-history')]);
      setSignedIn(p.signedIn);setEmail(p.email);setProfile(p.profile);setDraft(p.profile??blankProfile);setGoals(g.goals);setVisits(h.items);
    }catch(e){setError(e instanceof Error?e.message:'記録を読み込めませんでした。');}finally{setLoading(false);}
  },[]);
  const loadPeople=useCallback(async()=>{
    setPeopleLoading(true);setPeopleError('');
    try{const result=await requestJson<{profiles:PublicProfile[]}>('/api/community');setPeople(result.profiles);}
    catch(e){setPeopleError(e instanceof Error?e.message:'プロフィールを読み込めませんでした。');}
    finally{setPeopleLoading(false);}
  },[]);
  const loadFeed=useCallback(async(scope:'following'|'all')=>{
    setFeedLoading(true);setFeedError('');
    try{const result=await requestJson<{items:FeedItem[]}>(`/api/feed?scope=${scope}`);setFeed(result.items);}
    catch(e){setFeedError(e instanceof Error?e.message:'共有された挑戦を読み込めませんでした。');}
    finally{setFeedLoading(false);}
  },[]);
  const openPerson=async(id:string)=>{
    setPeopleError('');
    try{const result=await requestJson<{profile:PublicProfileDetail}>(`/api/community?id=${encodeURIComponent(id)}`);setPerson(result.profile);}
    catch(e){setPeopleError(e instanceof Error?e.message:'プロフィールを読み込めませんでした。');}
  };
  const toggleFollow=async()=>{
    if(!person||busy)return;
    setBusy(true);setPeopleError('');
    try{
      const result=await requestJson<{following:boolean}>('/api/community/follow',person.following?'DELETE':'POST',{id:person.id});
      setPerson({...person,following:result.following});
      setNotice(result.following?`${person.nickname}さんをフォローしました。`:`${person.nickname}さんのフォローを解除しました。`);
      await loadFeed(feedScope);
    }catch(e){setPeopleError(e instanceof Error?e.message:'フォローを変更できませんでした。');}
    finally{setBusy(false);}
  };
  const toggleReaction=async(item:FeedItem)=>{
    if(reactionBusy)return;
    setReactionBusy(item.id);setFeedError('');
    try{
      await requestJson(item.kind==='post'?'/api/posts/reactions':'/api/reactions',item.reacted?'DELETE':'POST',{id:item.id});
      setFeed(current=>current.map(entry=>entry.id===item.id?{...entry,reacted:!item.reacted,reactionCount:Math.max(0,entry.reactionCount+(item.reacted?-1:1))}:entry));
    }catch(e){setFeedError(e instanceof Error?e.message:'応援を変更できませんでした。');}
    finally{setReactionBusy(null);}
  };
  useEffect(()=>{let active=true;queueMicrotask(()=>{if(!active)return;try{const stored=JSON.parse(window.sessionStorage.getItem(dismissedBannerStorageKey)??'[]');if(Array.isArray(stored))setDismissedBannerTokens(stored.filter((token):token is string=>typeof token==='string'));}catch{/* Session storage can be unavailable or cleared. */}void load();const p=new URLSearchParams(window.location.search);const requestedTab=p.get('tab');if(['discover','mine','profile','people'].includes(requestedTab??'')){setTab(requestedTab==='profile'?'mine':requestedTab!);if(requestedTab==='people'){void loadPeople();void loadFeed('all');}}setDetail(opportunities.find(o=>o.id===p.get('challenge'))??null);});const timer=setInterval(()=>setNow(Date.now()),60000);return()=>{active=false;clearInterval(timer);};},[load,loadPeople,loadFeed]);
  useEffect(()=>{
    const ctx=(document as unknown as {modelContext?:{registerTool:(t:unknown,o:unknown)=>Promise<void>}}).modelContext;if(!ctx)return;
    const c=new AbortController();void Promise.resolve(ctx.registerTool({name:'search_challenges',description:'一次情報に基づく募集を検索して表示します。応募・記録の変更は行いません。',inputSchema:{type:'object',properties:{query:{type:'string'}},required:['query'],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:async(input:unknown)=>{const q=(input as {query?:unknown})?.query;if(typeof q!=='string'||q.length>100)throw Error('100文字以内で入力してください。');setTab('discover');setCategory('すべて');setGrade('');setArea('');setFee('');setListingView('open');setQuery(q);return{results:opportunities.filter(o=>!isClosed(o,Date.now())&&(o.name+o.summary+o.tags.join('')+(o.relatedTags??[]).join('')).toLowerCase().includes(q.toLowerCase())).map(o=>({id:o.id,title:o.name,source:o.source,checkedAt:o.checkedAt}))};}},{signal:c.signal})).catch(()=>{});return()=>c.abort();
  },[]);
  const isRecent=(o:Opportunity)=>isClosed(o,now)&&now-Date.parse(o.deadline)<=14*24*60*60*1000;
  const inView=(o:Opportunity)=>listingView==='open'?!isClosed(o,now):listingView==='recent'?isRecent(o):!!o.expectedNext&&isClosed(o,now)&&!isRecent(o);
  const viewCounts={open:opportunities.filter(o=>!isClosed(o,now)).length,recent:opportunities.filter(isRecent).length,expected:opportunities.filter(o=>o.expectedNext&&isClosed(o,now)&&!isRecent(o)).length};
  const viewStatus=(o:Opportunity)=>!isClosed(o,now)?'募集中':isRecent(o)?'受付終了（14日以内）':o.expectedNext?'次回開催見込み':'募集終了';
  const reset=()=>{setCategory('すべて');setQuery('');setGrade('');setArea('');setFee('');setListingView('open');};
  const filtered=opportunities.filter(o=>inView(o)&&(category==='すべて'||o.category===category||o.relatedTags?.includes(category))&&(!grade||o.grades.includes(grade))&&(!area||(area==='オンライン'?o.online:o.region==='全国'||o.region===area))&&(!fee||o.free)&&(o.name+o.summary+o.organizer+o.place+o.tags.join('')+(o.relatedTags??[]).join('')).toLowerCase().includes(query.trim().toLowerCase())).sort((a,b)=>listingView==='open'?Date.parse(nextDeadline(a,now))-Date.parse(nextDeadline(b,now)):Date.parse(b.deadline)-Date.parse(a.deadline));
  const recommendations=profile&&(profile.grade||profile.region||profile.interests.length)?recommendedOpportunities(opportunities,profile,goals,now):[];
  const reminders=profile?goals.flatMap(g=>{const o=opportunities.find(x=>x.id===g.opportunityId);if(!o||g.reminderHidden||g.status==='挑戦中'||g.status==='挑戦済')return [];const message=reminderFor(o,profile,now);return message?[{goal:g,opportunity:o,message,deadline:openDeadline(o,now)!}]:[];}).sort((a,b)=>a.deadline-b.deadline):[];
  const bannerToken=(goal:Goal,deadline:number)=>`${goal.id}:${deadline}`;
  const bannerReminders=reminders.filter(({goal,deadline})=>!dismissedBannerTokens.includes(bannerToken(goal,deadline)));
  const dismissReminderBanner=()=>{
    const tokens=[...new Set([...dismissedBannerTokens,...reminders.map(({goal,deadline})=>bannerToken(goal,deadline))])];
    setDismissedBannerTokens(tokens);
    try{window.sessionStorage.setItem(dismissedBannerStorageKey,JSON.stringify(tokens));}catch{/* The banner remains closed until this page is reloaded. */}
  };
  const activeGoals=goals.filter(g=>g.status==='気になる');
  const completedGoals=goals.filter(g=>g.status==='挑戦中'||g.status==='挑戦済');
  const showcasedActivities=goals.filter(g=>g.publicActivity&&(g.status==='挑戦中'||g.status==='挑戦済')).sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt));
  const goalDeadline=(g:Goal)=>{const o=opportunities.find(x=>x.id===g.opportunityId);return o?openDeadline(o,now):null;};
  const orderedGoals=[...goals].sort((a,b)=>{const aa=a.status==='気になる'?0:1,bb=b.status==='気になる'?0:1;if(aa!==bb)return aa-bb;return (goalDeadline(a)??Infinity)-(goalDeadline(b)??Infinity)||Date.parse(b.createdAt)-Date.parse(a.createdAt);});
  const recentVisits=visits.map(visit=>({visit,opportunity:opportunities.find(o=>o.id===visit.opportunityId)})).filter((entry):entry is {visit:OfficialVisit;opportunity:Opportunity}=>!!entry.opportunity);
  const openProfile=(o:Opportunity|null=null)=>{setPending(o);setDraft(profile??blankProfile);setFormError('');setDetail(null);setProfileOpen(true);};
  const saveOpportunity=async(o:Opportunity)=>{
    if(loading)return;
    if(error){setNotice('記録の読み込みに失敗しています。再読み込み後にお試しください。');return;}
    if(!signedIn){setPending(o);setDetail(null);setLoginOpen(true);return;}
    if(!profile){openProfile(o);return;}
    setBusy(true);setFormError('');
    try{await requestJson('/api/goals','POST',{opportunityId:o.id});await load();setDetail(null);setTab('mine');setNotice('マイチャレンジに保存しました。記録は本人だけに表示されます。');}
    catch(e){setFormError(e instanceof Error?e.message:'保存できませんでした。');}finally{setBusy(false);}
  };
  const recordOfficialVisit=async(opportunity:Opportunity)=>{
    if(!signedIn)return;
    setHistoryError('');
    try{
      const visit=await requestJson<OfficialVisit>('/api/official-history','POST',{opportunityId:opportunity.id});
      setVisits(current=>[visit,...current.filter(item=>item.opportunityId!==visit.opportunityId)].slice(0,20));
    }catch(e){setHistoryError(e instanceof Error?e.message:'閲覧履歴を記録できませんでした。');}
  };
  const saveProfile=async()=>{
    setBusy(true);setFormError('');
    try{await requestJson('/api/profile','PUT',draft);setProfile({...draft});
      if(pending){await requestJson('/api/goals','POST',{opportunityId:pending.id});setTab('mine');setPending(null);setNotice('プロフィールと挑戦を保存しました。');}else setNotice('プロフィールを保存しました。');
      setProfileOpen(false);await load();
    }catch(e){setFormError(e instanceof Error?e.message:'保存できませんでした。');}finally{setBusy(false);}
  };
  const newGoal=(initialStatus:ChallengeStatus='気になる')=>{setFormError('');if(!signedIn){setPending(null);setLoginOpen(true);}else if(!profile){openProfile();}else{setTitle('');setFirstStep('');setMemo('');setNextAction('');setActivityPeriod('');setPublicActivity(initialStatus!=='気になる');setPublicText('');setStatus(initialStatus);setCompose(true);}};
  const editGoal=(goal:Goal)=>{setEditing(goal);setTitle(goal.title);setStatus(goal.status);setMemo(goal.memo);setNextAction(goal.nextAction);setActivityPeriod(goal.activityPeriod);setReminderHidden(goal.reminderHidden);setPublicActivity(goal.publicActivity);setPublicText(goal.publicText);setFormError('');};
  const saveGoal=async()=>{
    setBusy(true);setFormError('');try{await requestJson('/api/goals',editing?'PATCH':'POST',editing?{id:editing.id,title,status,memo,nextAction,activityPeriod,reminderHidden,publicActivity,publicText}:{title,firstStep,status,memo,activityPeriod,publicActivity,publicText});setCompose(false);setEditing(null);setTab('mine');setNotice('挑戦の記録を保存しました。');await load();}catch(e){setFormError(e instanceof Error?e.message:'保存できませんでした。');}finally{setBusy(false);}
  };
  const hideReminder=async(goal:Goal)=>{
    if(busy)return;
    setBusy(true);
    try{await requestJson('/api/goals/reminder','PATCH',{id:goal.id,hidden:true});setGoals(current=>current.map(item=>item.id===goal.id?{...item,reminderHidden:true}:item));setNotice('この募集の締切のお知らせを表示しない設定にしました。記録の編集から戻せます。');}
    catch(e){setNotice(e instanceof Error?e.message:'お知らせ設定を変更できませんでした。');}
    finally{setBusy(false);}
  };
  const remove=async()=>{
    if(!deleteTarget)return;setBusy(true);setFormError('');
    try{await requestJson(deleteTarget==='account'?'/api/profile':'/api/goals','DELETE',deleteTarget==='account'?{confirm:'DELETE'}:{id:deleteTarget.id});setNotice(deleteTarget==='account'?'Try Buddyの登録情報と記録を削除しました。':'記録を削除しました。');setDeleteTarget(null);await load();}catch(e){setFormError(e instanceof Error?e.message:'削除できませんでした。');}finally{setBusy(false);}
  };
  const returnTo=pending?`/?challenge=${encodeURIComponent(pending.id)}`:'/?tab=mine';
  const signIn=(<a className="primary" href={`/auth/google/start?return_to=${encodeURIComponent(returnTo)}`} target="_top">Googleでログイン</a>);
  const signOut=async()=>{try{await requestJson('/auth/logout','POST');window.location.reload();}catch(e){setError(e instanceof Error?e.message:'ログアウトできませんでした。');}};
  const privateNotice=(<p className="privacyline"><LockKeyhole size={16}/>「挑戦中」「挑戦済」は初期状態でタイムラインに共有されます。自分用メモは表示されません。</p>);

  return <>
    <header className="header"><a href="/" className="brand" aria-label="Try Buddy ホーム"><span className="brandmark">tb<Sparkles aria-hidden="true"/></span>Try Buddy<span className="beta">BETA</span></a><span className="headernote">学生の、一歩目から。</span><Button variant="outline" onClick={()=>{setTab('mine');requestAnimationFrame(()=>document.getElementById('my-settings')?.scrollIntoView({behavior:'smooth'}));}}><Settings2 data-icon="inline-start"/>登録・設定</Button></header>
    <main>
      {tab==='discover'&&<section className="intro compactintro"><div><p className="eyebrow">FIND YOUR NEXT CHALLENGE</p><h1>その「やってみたい」に、<span>一歩目</span>を。</h1><p className="lead">自分に合う募集を見つけて、次の挑戦を始めよう。</p></div><div className="introdetail"><strong>{viewCounts.open}<span>件の募集中</span></strong><p>次回開催見込み {viewCounts.expected}件<br/>2026.10.07 確認</p></div></section>}
      <Tabs value={tab} onValueChange={value=>{setTab(value);if(value==='people'){setChannelTarget(null);void loadPeople();void loadFeed(feedScope);}}}>
        <div className="tabrow"><TabsList variant="line" className="mainnav"><TabsTrigger value="discover"><Compass/>挑戦を見つける</TabsTrigger><TabsTrigger value="mine"><Flag/>マイページ{goals.length>0?` (${goals.length})`:''}</TabsTrigger><TabsTrigger value="people">タイムライン</TabsTrigger></TabsList><a className="mainnav-dm" href="/messages"><MessageCircle size={18}/>DM</a></div>
        {notice&&<Alert className="feedback" role="status"><AlertDescription>{notice}</AlertDescription></Alert>}
        {error&&<Alert variant="destructive" className="feedback"><AlertDescription>{error}<Button variant="outline" onClick={()=>void load()}>再読み込み</Button></AlertDescription></Alert>}
        {bannerReminders.length>0&&<div className="reminderbar" role="status"><Bell size={18}/><span><strong>保存した募集の締切が近づいています</strong>　{bannerReminders[0].opportunity.name}：{bannerReminders[0].message}{bannerReminders.length>1?`　ほか${bannerReminders.length-1}件`:''}</span><Button variant="outline" onClick={()=>setTab('mine')}>確認する</Button><button type="button" className="reminderbar-close" aria-label="上部の締切のお知らせを閉じる" title="このタブでは再表示しません" onClick={dismissReminderBanner}><X size={16}/>閉じる</button></div>}
        <TabsContent value="discover">
          <div className="sectionhead"><h2>次は、何に挑戦する？</h2><label className="search"><Search size={20}/><input aria-label="挑戦を検索" placeholder="キーワードで探す" value={query} maxLength={100} onChange={e=>setQuery(e.target.value)}/></label></div>
          {recommendations.length>0&&<section className="recommendations" aria-labelledby="recommendations-heading"><div className="recommendations-head"><div><p className="eyebrow">FOR YOU</p><h3 id="recommendations-heading">あなたに合いそうな募集</h3></div><small>登録した興味・学年・地域との一致を表示。応募資格は公式情報で確認してください。</small></div><div className="recommendation-list">{recommendations.map(({opportunity:o,reasons})=><button key={o.id} onClick={()=>{setFormError('');setDetail(o);}}><span className="recommendation-category">{o.category}</span><strong>{o.name}</strong><span>{reasons.join(' · ')}</span><small>{o.ongoing?'随時募集':deadlineMessage(openDeadline(o,now)!,now)}</small></button>)}</div></section>}
          <ToggleGroup type="single" value={listingView} onValueChange={v=>v&&setListingView(v as ListingView)} spacing={2} variant="outline" className="statusfilters" aria-label="募集状況"><ToggleGroupItem value="open">募集中 <span>{viewCounts.open}</span></ToggleGroupItem><ToggleGroupItem value="expected">次回開催見込み <span>{viewCounts.expected}</span></ToggleGroupItem><ToggleGroupItem value="recent">受付終了・14日以内 <span>{viewCounts.recent}</span></ToggleGroupItem></ToggleGroup>
          {listingView==='expected'&&<p className="statusnote">毎年・複数回の開催実績や、主催者による次回予告を確認できた募集です。日程・条件は未確定のため、次回の公式発表後に応募してください。</p>}
          {listingView==='recent'&&<p className="statusnote recent">締切から14日以内の募集です。現在は応募できませんが、次回の準備や活動内容の確認に利用できます。</p>}
          <ToggleGroup type="single" value={category} onValueChange={v=>v&&setCategory(v)} spacing={2} variant="outline" className="categoryfilters" aria-label="募集カテゴリーと興味タグ">{['すべて','コンテスト','ボランティア','留学・国際交流'].map(c=><ToggleGroupItem key={c} value={c}>{c}</ToggleGroupItem>)}{profile?.interests.filter(tag=>!['コンテスト','ボランティア','留学・国際交流'].includes(tag)).map(tag=><ToggleGroupItem key={tag} value={tag}>#{tag}</ToggleGroupItem>)}</ToggleGroup>
          <Button variant="outline" className="filtertoggle" aria-expanded={showFilters} aria-controls="advanced-filters" onClick={()=>setShowFilters(!showFilters)}><Settings2 data-icon="inline-start"/>学年・地域・費用で絞り込む{grade||area||fee?'（設定中）':''}</Button>
          <div className="filterselects" id="advanced-filters" data-expanded={showFilters}><label>対象<select aria-label="対象学年" value={grade} onChange={e=>setGrade(e.target.value)}><option value="">すべての学年</option>{['中学生','高校1年','高校2年','高校3年','高専・その他'].map(x=><option key={x}>{x}</option>)}</select></label><label>地域・参加方法<select aria-label="地域・参加方法" value={area} onChange={e=>setArea(e.target.value)}><option value="">すべての地域</option><option>オンライン</option>{regions.map(x=><option key={x}>{x}</option>)}</select></label><label>費用<select aria-label="費用" value={fee} onChange={e=>setFee(e.target.value)}><option value="">すべて</option><option value="free">無料と確認できた募集</option></select></label></div>
          <div className="listmeta"><span>{filtered.length}件</span><span>{listingView==='open'?'締切が近い順 · 応募は公式サイトから':listingView==='expected'?'前回情報が新しい順 · 募集開始前':'終了日が新しい順 · 現在は応募不可'}</span></div>
          <div className="cards">{filtered.map(o=>{const saved=goals.some(g=>g.opportunityId===o.id);return <article className="opportunity" key={o.id}>
            <button className={`poster ${o.color} ${listingView!=='open'?'notopen':''}`} onClick={()=>{setFormError('');setDetail(o);}} aria-label={o.name+'の詳細'}><span className="postertype">{o.category}</span><strong>{o.headline}</strong><span className="posterno">TRY BUDDY / {o.tags[0]}</span>{isClosed(o,now)&&<span className={`endedbadge ${o.expectedNext&&!isRecent(o)?'expected':''}`}>{viewStatus(o)}</span>}</button>
            <div className="cardbody"><p className="org">{o.organizer}</p><h3><button onClick={()=>{setFormError('');setDetail(o);}}>{o.name}</button></h3><div className="tags">{o.tags.map(t=><Badge variant="secondary" key={t}>{t}</Badge>)}</div><div className="facts"><span><MapPin size={16}/>{o.id==='iida-science-volunteer-2026'?'長野県飯田市':o.online?'オンライン':o.region==='全国'?'全国の学生向け':o.region}</span><span className="deadline"><Clock3 size={16}/>{o.sessions?'次の締切 '+dateLabel(nextDeadline(o,now)):o.deadlineLabel}</span></div><div className="cardbuttons"><Button variant="outline" onClick={()=>{setFormError('');setDetail(o);}}>募集の詳細</Button><Button variant="ghost" disabled={busy||loading} aria-label={o.name+(saved?'を保存済み':'を保存')} onClick={()=>saved?setTab('mine'):void saveOpportunity(o)}>{saved?<Check data-icon="inline-start"/>:<Bookmark data-icon="inline-start"/>}{saved?'保存済み':'保存'}</Button></div><small className="checked">情報確認：{o.checkedAt.replaceAll('-','.')}</small></div>
          </article>;})}</div>
          {!filtered.length&&<div className="empty"><Search size={32}/><h3>{category==='留学・国際交流'?'留学・国際交流の募集は準備中です':'条件に合う募集はありません'}</h3><p>掲載できる公式情報を確認して、順次追加します。</p><Button variant="outline" onClick={reset}>すべての募集を見る</Button></div>}
          <p className="listingnote">募集内容や受付状況は変更される場合があります。応募前に公式ページで最新の条件をご確認ください。「次回開催見込み」は開催を保証する表示ではありません。</p>
        </TabsContent>
        <TabsContent value="mine">
        <section className="my-page-profile" id="my-settings"><div className="sectionhead"><div><p className="eyebrow">YOUR PROFILE</p><h2>プロフィール・設定</h2>{privateNotice}</div></div>{loading?<p className="state">登録情報を読み込んでいます…</p>:!signedIn?<div className="settingspanel"><h3>挑戦を保存する準備をしよう。</h3><p>Googleアカウントでログインした後、ニックネームを登録します。学校名・居住地域は任意です。</p>{signIn}</div>:<div className="settingspanel">
          <section className="profileidentity" aria-labelledby="profile-intro-heading">
            <p className="eyebrow">MY PROFILE</p><h3 id="profile-intro-heading">{profile?.nickname||'未登録'}</h3>
            <p className="profilebio">{profile?.bio||'自己紹介はまだありません。好きなことや大切にしていることを書いてみましょう。'}</p>
            {profile?.dream&&<p className="profiledream"><strong>夢</strong>{profile.dream}<small>{profile.dreamVisible&&profile.profileVisible?'公開中':'本人のみ'}</small></p>}
            <p className="profilevisibility">{profile?.profileVisible?'このプロフィールはサインインしたユーザーに公開中です。':'このプロフィールは現在、本人だけに表示されています。'}</p>
            <Button variant="outline" onClick={()=>openProfile()}>{profile?.bio?'プロフィールを編集':'自己紹介を書く'}</Button>
          </section>
          <section className="activityhistory" aria-labelledby="activity-history-heading"><div className="activityhistory-head"><div><p className="eyebrow">PUBLIC ACTIVITIES</p><h3 id="activity-history-heading">公開する活動</h3></div><Button variant="outline" onClick={()=>document.getElementById('my-challenges')?.scrollIntoView({behavior:'smooth'})}>マイチャレンジで管理</Button></div><p className="showcase-intro">マイチャレンジで共有を選んだ活動を表示します。習い事など、募集に載っていない経験も追加できます。</p>{showcasedActivities.length?<ul>{showcasedActivities.map(g=><li key={g.id}><div className="activitymeta"><Badge variant="secondary">{statusLabel(g.status)}</Badge><small>{profile?.profileVisible?'プロフィールで公開中':'プロフィール公開後に表示'}</small></div><strong>{g.title}</strong>{g.activityPeriod&&<span className="activityperiod">{activityPeriodLabel(g.status)}：{g.activityPeriod}</span>}{g.publicText&&<p>{g.publicText}</p>}</li>)}</ul>:<p className="activityempty">共有中の活動はまだありません。マイチャレンジの「記録を編集」から設定できます。</p>}</section>

          <section className="privacyoverview" aria-label="項目ごとの公開状態"><h3>項目ごとの公開状態</h3><p><span>夢：{profile?.profileVisible&&profile.dreamVisible?'公開':'非公開'}</span><span>学年：{profile?.profileVisible&&profile.gradeVisible?'公開':'非公開'}</span><span>地域：{profile?.profileVisible&&profile.regionVisible?'公開':'非公開'}</span></p></section>
          <details className="my-page-settings-detail"><summary>登録情報・おすすめ設定</summary><dl><dt>メールアドレス</dt><dd>{email||'認証元で管理されています'}</dd><dt>ニックネーム</dt><dd>{profile?.nickname||'未登録'}</dd><dt>学校名（任意）</dt><dd>{profile?.school||'未入力'}</dd><dt>学年（任意）</dt><dd>{profile?.grade||'未選択'}</dd><dt>居住地域（任意）</dt><dd>{profile?.region||'未選択'}</dd><dt>興味のある分野（任意）</dt><dd>{profile?.interests.length?profile.interests.join('・'):'未選択'}</dd><dt>締切のお知らせ</dt><dd>{profile?.reminderDays===0?'オフ':`締切の${profile?.reminderDays??7}日前からサイト内に表示`}</dd></dl><div className="recordactions"><Button onClick={()=>openProfile()}>{profile?'設定を編集':'プロフィールを登録'}</Button><Button variant="outline" onClick={()=>void signOut()}>ログアウト</Button></div><p className="subcopy">学年・地域・興味分野はおすすめの並び替えに使います。応募資格の確定判定ではありません。締切のお知らせはサイト内のみです。学校名を含め、任意項目は空欄に戻せます。</p>{(profile||goals.length>0)&&<div className="dangerzone"><h3>Try Buddyの登録を削除</h3><p>プロフィール、挑戦記録、公式ページの閲覧履歴を削除します。Googleアカウントは削除されません。</p><Button variant="destructive" onClick={()=>{setDeleteTarget('account');setFormError('');}}>登録情報と記録を削除</Button></div>}</details></div>}</section>
          <div className="sectionhead" id="my-challenges"><div><p className="eyebrow">MY CHALLENGE</p><h2>マイチャレンジ</h2>{privateNotice}</div><Button disabled={loading||!!error} onClick={()=>newGoal()}><Plus data-icon="inline-start"/>自分の挑戦を追加</Button></div>
          {signedIn&&goals.length>0&&<><div className="dashboardstats"><div><strong>{activeGoals.length}</strong><span>気になる</span></div><div><strong>{reminders.length}</strong><span>締切が近い募集</span></div><div><strong>{completedGoals.length}</strong><span>挑戦中・挑戦済</span></div></div>{reminders.length>0&&<section className="deadlinepanel"><h3><Bell size={18}/>締切のお知らせ</h3>{reminders.map(({goal,opportunity:o,message})=><div key={goal.id}><strong>{message}</strong><span>{o.name}</span><Button variant="outline" onClick={()=>{editGoal(goal);}}>記録を見る</Button><Button variant="ghost" disabled={busy} onClick={()=>void hideReminder(goal)}>表示しない</Button></div>)}<small>このお知らせはサイトを開いたときに表示されます。メール・プッシュ通知は送信されません。</small></section>}</>}
          {loading?<p className="state">記録を読み込んでいます…</p>:!signedIn?<div className="empty"><LockKeyhole size={30}/><h3>自分だけの挑戦ノート。</h3><p>気になる募集や、挑戦・参加の記録をまとめられます。</p>{signIn}</div>:!goals.length?<div className="empty"><Bookmark size={30}/><h3>「気になる」を保存しよう。</h3><p>募集の保存ボタンから、最初の挑戦を見つけてください。</p><Button onClick={()=>setTab('discover')}>募集を探す</Button></div>:<div className="goalgrid">{orderedGoals.map(g=>{const o=opportunities.find(x=>x.id===g.opportunityId),deadline=o?openDeadline(o,now):null;return <article className="goal" key={g.id}><div className="recordmeta"><Badge variant="secondary">{statusLabel(g.status)}</Badge><small>{dateLabel(g.createdAt)} 保存</small></div><h3>{g.title}</h3>{o&&<p className="recorddeadline">{deadline!==null?<><strong>{deadlineMessage(deadline,now)}</strong> · 応募締切：{o.sessions?dateLabel(nextDeadline(o,now)):o.deadlineLabel}</>:isClosed(o,now)?'募集終了：'+o.deadlineLabel:'日程を公式情報で確認'}</p>}{(g.nextAction||(!o&&g.firstStep))&&<details className="legacy"><summary>以前のメモ</summary>{g.nextAction&&<p>{g.nextAction}</p>}{!o&&g.firstStep&&<p>{g.firstStep}</p>}</details>}{g.activityPeriod&&<p className="activityperiod">{activityPeriodLabel(g.status)}：{g.activityPeriod}</p>}{g.memo&&<p className="recordmemo">{g.memo}</p>}{g.updates.length>0&&<details className="legacy"><summary>これまでの進捗（{g.updates.length}件）</summary>{g.updates.map((u,i)=><p key={i}>{dateLabel(u.at)} · {u.progress}%<br/>{u.text}</p>)}</details>}<div className="recordactions"><Button variant="outline" onClick={()=>{editGoal(g);}}>記録を編集</Button>{o&&<Button variant="ghost" onClick={()=>{setDetail(o);setFormError('');}}>募集の詳細</Button>}<Button variant="ghost" aria-label={g.title+'の記録を削除'} onClick={()=>{setDeleteTarget(g);setFormError('');}}><Trash2/></Button></div></article>;})}</div>}
          {signedIn&&!loading&&<section className="visit-history" aria-label="公式ページの閲覧履歴"><div className="visit-history-head"><h3>最近見た公式ページ</h3><span>最大20件・自分だけに表示</span></div>{historyError&&<p role="alert" className="formerror">{historyError}</p>}{recentVisits.length?<><ul>{recentVisits.slice(0,3).map(({visit,opportunity})=><li key={visit.opportunityId}><div><button type="button" onClick={()=>{setDetail(opportunity);setFormError('');}}>{opportunity.name}</button><small>{dateLabel(visit.visitedAt)} に閲覧</small></div>{goals.some(goal=>goal.opportunityId===opportunity.id)?<span className="visit-saved">保存済み</span>:<Button variant="ghost" disabled={busy} onClick={()=>void saveOpportunity(opportunity)}>保存</Button>}</li>)}</ul>{recentVisits.length>3&&<details><summary>ほかの履歴 {recentVisits.length-3}件</summary><ul>{recentVisits.slice(3).map(({visit,opportunity})=><li key={visit.opportunityId}><div><button type="button" onClick={()=>{setDetail(opportunity);setFormError('');}}>{opportunity.name}</button><small>{dateLabel(visit.visitedAt)} に閲覧</small></div>{goals.some(goal=>goal.opportunityId===opportunity.id)?<span className="visit-saved">保存済み</span>:<Button variant="ghost" disabled={busy} onClick={()=>void saveOpportunity(opportunity)}>保存</Button>}</li>)}</ul></details>}</>:<p className="visit-history-empty">公式ページを開くと、ここに履歴が残ります。募集は自動保存されません。</p>}</section>}

        </TabsContent>
        <TabsContent value="people">
          <div className="sectionhead"><div><p className="eyebrow">TIMELINE</p><h2>タイムライン</h2><p className="subcopy">近況や質問、挑戦、グループの動きを新しい順に。</p></div></div>
          {tab==='people'&&<CommunityTimeline signedIn={signedIn} canPost={!!profile?.profileVisible} canPublish={!!profile} focusOpportunity={channelTarget} feed={feed} feedScope={feedScope} setFeedScope={setFeedScope} feedLoading={feedLoading} feedError={feedError} loadFeed={loadFeed} reactionBusy={reactionBusy} profilePublicId={profile?.publicId} onOpenPerson={id=>void openPerson(id)} onOpenProfile={()=>openProfile()} onSignIn={()=>setLoginOpen(true)} onOpenOpportunity={opportunity=>{setDetail(opportunity);setFormError('');}} onReact={item=>void toggleReaction(item)}/>}
          <details className="timeline-people"><summary>プロフィールを探す</summary><p>公開を選んだ人の自己紹介と活動を見ることができます。</p>
          {loading||peopleLoading?<p className="state">プロフィールを読み込んでいます…</p>:!signedIn?<div className="empty"><LockKeyhole size={30}/><h3>ログインしてプロフィールを見る</h3><p>ほかのユーザーの公開プロフィールは、サインインした人に表示されます。</p>{signIn}</div>:peopleError?<div className="empty"><h3>読み込めませんでした</h3><p>{peopleError}</p><Button variant="outline" onClick={()=>void loadPeople()}>再読み込み</Button></div>:people.length?<div className="peoplegrid">{people.map(p=><button className="personcard" key={p.id} onClick={()=>void openPerson(p.id)}><span className="personavatar">{p.nickname.slice(0,1)}</span><strong>{p.nickname}</strong><span className="personbio">{p.bio||'自己紹介はまだありません。'}</span>{p.dream&&<span className="persondream">夢：{p.dream}</span>}<small>プロフィールを見る</small></button>)}</div>:<div className="empty"><h3>公開プロフィールはまだありません</h3><p>プロフィールの公開を選んだ人が、ここに表示されます。</p><Button variant="outline" onClick={()=>setTab('mine')}>自分の公開設定を見る</Button></div>}</details>
        </TabsContent>

      </Tabs>
    </main>
    <footer><a href="/" className="footerbrand">Try Buddy<Sparkles aria-hidden="true"/></a><span>小さな一歩を、自分のペースで。</span><a href="/privacy">プライバシーポリシー</a><small>© 2026 Try Buddy</small></footer>

    <Dialog open={!!person} onOpenChange={v=>!v&&setPerson(null)}><DialogContent className="modal personmodal">{person&&<><p className="eyebrow">PUBLIC PROFILE</p><DialogTitle>{person.nickname}</DialogTitle><DialogDescription>公開を選んだ内容だけを表示しています。</DialogDescription>{!person.isOwnProfile&&<div className="recordactions"><Button variant={person.following?'outline':'default'} disabled={busy} onClick={()=>void toggleFollow()}>{person.following?'フォロー中・解除する':'フォローする'}</Button>{person.following&&<a className="outline" href={`/messages?to=${encodeURIComponent(person.id)}`}>DMを送る</a>}</div>}{peopleError&&<p role="alert" className="formerror">{peopleError}</p>}<p className="person-intro">{person.bio||'自己紹介はまだありません。'}</p>{person.dream&&<p className="person-detail"><strong>夢</strong>{person.dream}</p>}{person.grade&&<p className="person-detail"><strong>学年</strong>{person.grade}</p>}{person.region&&<p className="person-detail"><strong>地域</strong>{person.region}</p>}<section className="person-activities"><h3>活動・経験</h3>{person.activities.length?<ul>{person.activities.map((activity,index)=><li key={`${activity.title}-${index}`}><Badge variant="secondary">{statusLabel(activity.status)}</Badge><strong>{activity.title}</strong>{activity.activityPeriod&&<small>{activity.activityPeriod}</small>}{activity.publicText&&<p>{activity.publicText}</p>}</li>)}</ul>:<p>公開している活動はまだありません。</p>}</section></>}</DialogContent></Dialog>
    <Dialog open={!!detail} onOpenChange={v=>!v&&setDetail(null)}><DialogContent className="modal detailmodal">{detail&&<><p className="eyebrow">{detail.category} · {viewStatus(detail)}</p><DialogTitle>{detail.name}</DialogTitle><DialogDescription>{detail.organizer}</DialogDescription><p>{detail.summary}</p>{detail.expectedNext&&<div className="expectationbox"><strong>次回開催見込み</strong><p>{detail.recurrenceEvidence}</p><span>{detail.nextWindow}</span></div>}<dl className="detailgrid"><dt>{isClosed(detail,now)?'前回の締切・終了':'応募締切'}</dt><dd>{detail.deadlineLabel}</dd><dt>対象</dt><dd>{detail.audience}</dd><dt>場所・方法</dt><dd>{detail.place}</dd><dt>日程</dt><dd>{detail.schedule}</dd><dt>費用</dt><dd>{detail.cost}</dd><dt>応募方法</dt><dd>{detail.application}</dd><dt>確認事項</dt><dd>{detail.notes}</dd></dl>{detail.sessions&&<div className="sessionlist"><strong>今から申し込める日程</strong>{detail.sessions.filter(s=>Date.parse(s.deadline)>=now).length?detail.sessions.filter(s=>Date.parse(s.deadline)>=now).map(s=><p key={s.date}>{dateLabel(s.date+'T00:00:00+09:00')} 開催 · {dateLabel(s.deadline)} までに申込</p>):<p>掲載した日程の受付期間は終了しました。</p>}</div>}<div className="opportunity-related-tags" aria-label="関連タグ">{detail.relatedTags?.map(tag=><span key={tag}>#{tag}</span>)}</div><p className="firststep"><strong>準備のヒント</strong><br/>{detail.firstStep}</p>{voiceTermsFor(detail.id).length>0&&<section className="voice-entry"><p className="eyebrow">VOICES / {detail.category}</p><h3>挑戦した人の声</h3><p>{voiceEntryDescription(detail.id)}</p><a className="outline" href={`/voices?challenge=${encodeURIComponent(detail.id)}`}>声を見てみる →</a></section>}<div className="detailactions"><Button variant="outline" onClick={()=>{if(detail){setChannelTarget(detail);setDetail(null);setTab('people');void loadPeople();void loadFeed(feedScope);}}}>この募集のトークを探す</Button><a className="primary" href={detail.source} target="_blank" rel="noopener noreferrer" onClick={()=>void recordOfficialVisit(detail)}>{isClosed(detail,now)?'前回・現在の公式情報を見る':'公式の募集情報を見る'}<ExternalLink size={16}/></a><Button variant="outline" disabled={busy||loading} onClick={()=>void saveOpportunity(detail)}><Bookmark data-icon="inline-start"/>{busy?'保存中…':goals.some(g=>g.opportunityId===detail.id)?'マイチャレンジに保存済み':detail.expectedNext?'次回に備えて保存':'気になる募集を保存'}</Button></div><p className="subcopy">公式ページを開いた履歴はマイチャレンジの下部で確認できます。保存は「気になる募集を保存」から選べます。</p>{formError&&<p role="alert" className="formerror">{formError}</p>}<div className="source"><p>出典：<a href={detail.source} target="_blank" rel="noopener noreferrer" onClick={()=>void recordOfficialVisit(detail)}>{detail.sourceName}</a>／確認日：{detail.checkedAt}</p><p>Try Buddyが募集条件を整理・編集しています。主催者による公認・提携を示すものではありません。</p></div></>}</DialogContent></Dialog>
    <Dialog open={loginOpen} onOpenChange={setLoginOpen}><DialogContent className="modal"><DialogTitle>自分だけの記録を始めよう。</DialogTitle><DialogDescription>Googleアカウントでログインした後、ニックネームを登録できます。</DialogDescription>{signIn}<p>学校名・居住地域は任意入力です。</p></DialogContent></Dialog>
    <Dialog open={profileOpen} onOpenChange={value=>{if(!busy)setProfileOpen(value);}}>
      <DialogContent className="modal">
        <DialogTitle>{profile?'プロフィール・公開設定を編集':'プロフィールを登録'}</DialogTitle>
        <DialogDescription>公開を有効にすると、ニックネームと自己紹介をサインインしたユーザーが見られます。夢・学年・地域は個別に選べます。</DialogDescription>
        <form onSubmit={event=>{event.preventDefault();void saveProfile();}}>
          <FieldGroup>
            <Field><FieldLabel htmlFor="profile-email">メールアドレス</FieldLabel><Input id="profile-email" value={email} readOnly type="email"/><FieldDescription>メールアドレスは公開されません。</FieldDescription></Field>
            <Field><FieldLabel htmlFor="nickname">ニックネーム（必須）</FieldLabel><Input id="nickname" required maxLength={30} autoComplete="nickname" value={draft.nickname} onChange={event=>setDraft({...draft,nickname:event.target.value})}/></Field>
            <Field><FieldLabel htmlFor="profile-visible">プロフィールの公開</FieldLabel><label className="visibilitychoice"><input id="profile-visible" type="checkbox" checked={draft.profileVisible} onChange={event=>setDraft({...draft,profileVisible:event.target.checked})}/>サインインしたユーザーに公開する</label><FieldDescription>プロフィールの詳細は初期設定で非公開です。タイムラインへの投稿と共有した挑戦には、ニックネームが表示されます。</FieldDescription></Field>
            <Field><FieldLabel htmlFor="profile-bio">自己紹介（任意）</FieldLabel><Textarea id="profile-bio" maxLength={500} value={draft.bio} onChange={event=>setDraft({...draft,bio:event.target.value})} placeholder="例：音楽とものづくりが好きです。最近はギターを練習しています。"/><FieldDescription>プロフィールを公開すると、ほかのユーザーに表示されます。</FieldDescription></Field>
            <Field><FieldLabel htmlFor="profile-dream">夢（任意）</FieldLabel><Input id="profile-dream" maxLength={160} value={draft.dream} onChange={event=>setDraft({...draft,dream:event.target.value})} placeholder="例：誰もが学びやすい道具を作る"/><label className="visibilitychoice"><input type="checkbox" checked={draft.dreamVisible} onChange={event=>setDraft({...draft,dreamVisible:event.target.checked})}/>夢を公開する</label></Field>
            <Field><FieldLabel htmlFor="grade">学年（任意）</FieldLabel><select id="grade" value={draft.grade} onChange={event=>setDraft({...draft,grade:event.target.value})}><option value="">選択しない</option>{profileGrades.map(value=><option key={value}>{value}</option>)}</select><label className="visibilitychoice"><input type="checkbox" checked={draft.gradeVisible} onChange={event=>setDraft({...draft,gradeVisible:event.target.checked})}/>学年を公開する</label></Field>
            <Field><FieldLabel htmlFor="region">居住地域（任意）</FieldLabel><select id="region" value={draft.region} onChange={event=>setDraft({...draft,region:event.target.value})}><option value="">選択しない</option>{regions.map(value=><option key={value}>{value}</option>)}</select><label className="visibilitychoice"><input type="checkbox" checked={draft.regionVisible} onChange={event=>setDraft({...draft,regionVisible:event.target.checked})}/>地域を公開する</label><FieldDescription>広域の地域だけを選びます。都道府県や住所は入力しません。</FieldDescription></Field>
            <Field><FieldLabel htmlFor="school">学校名（任意）</FieldLabel><Input id="school" maxLength={100} value={draft.school} onChange={event=>setDraft({...draft,school:event.target.value})} placeholder="入力しなくても利用できます"/><FieldDescription>学校名は公開されません。</FieldDescription></Field>
            <Field><FieldLabel>興味のあるタグ（任意・複数選択可）</FieldLabel><InterestTagPicker value={draft.interests} onChange={interests=>setDraft(current=>({...current,interests}))}/></Field>
            <Field><FieldLabel htmlFor="reminder-days">締切のお知らせ</FieldLabel><select id="reminder-days" value={draft.reminderDays} onChange={event=>setDraft({...draft,reminderDays:Number(event.target.value)})}>{reminderOptions.map(days=><option key={days} value={days}>{days===0?'オフ':'締切の'+days+'日前から表示'}</option>)}</select><FieldDescription>保存した募集中の募集について、サイトを開いたときに表示します。メール・プッシュ通知は送信されません。</FieldDescription></Field>
          </FieldGroup>
          {formError&&<p className="formerror" role="alert">{formError}</p>}
          <Button type="submit" disabled={busy}>{busy?'保存中…':'設定を保存'}</Button>
        </form>
      </DialogContent>
    </Dialog>
    <Dialog open={compose||!!editing} onOpenChange={value=>{if(!value&&!busy){setCompose(false);setEditing(null);}}}>
      <DialogContent className="modal">
        <DialogTitle>{editing?'挑戦の記録を編集':'自分の挑戦を追加'}</DialogTitle>
        <DialogDescription>挑戦や参加など、自分の経験を記録できます。「挑戦中」「挑戦済」は初期状態で全体に共有されます。</DialogDescription>
        <form onSubmit={event=>{event.preventDefault();void saveGoal();}}>
          <FieldGroup>
            {editing?<>
              {editing.opportunityId?<p className="editingtitle">{editing.title}</p>:<Field><FieldLabel htmlFor="goal-edit-title">活動・募集の名前</FieldLabel><Input id="goal-edit-title" required maxLength={150} value={title} onChange={event=>setTitle(event.target.value)}/></Field>}
              <Field><FieldLabel htmlFor="goal-status">今の状態</FieldLabel><select id="goal-status" value={status} onChange={event=>{const next=event.target.value as ChallengeStatus;setPublicActivity(next==='気になる'?false:status==='気になる'?true:publicActivity);setStatus(next);}}>{statuses.map(value=><option key={value} value={value}>{statusLabel(value)}</option>)}</select></Field>
              {status!=='気になる'&&<Field><FieldLabel htmlFor="goal-activity-period">{activityPeriodLabel(status)}（任意）</FieldLabel><Input id="goal-activity-period" maxLength={50} value={activityPeriod} onChange={event=>setActivityPeriod(event.target.value)} placeholder="例：2026年夏"/></Field>}
              {editing.opportunityId&&<Field><FieldLabel htmlFor="goal-reminder-hidden">締切のお知らせ</FieldLabel><label className="visibilitychoice"><input id="goal-reminder-hidden" type="checkbox" checked={reminderHidden} onChange={event=>setReminderHidden(event.target.checked)}/>この募集の締切のお知らせを表示しない</label><FieldDescription>後からここで表示を戻せます。</FieldDescription></Field>}

              <Field><FieldLabel htmlFor="goal-memo">メモ（任意）</FieldLabel><Textarea id="goal-memo" maxLength={2000} value={memo} onChange={event=>setMemo(event.target.value)} placeholder="準備したこと、参加して取り組んだことなど"/></Field>
            </>:<>
              <Field><FieldLabel htmlFor="goal-title">活動・募集の名前</FieldLabel><Input id="goal-title" required maxLength={150} value={title} onChange={event=>setTitle(event.target.value)} placeholder="例：ピアノ教室、地域の清掃ボランティア"/></Field>
              <Field><FieldLabel htmlFor="goal-create-status">今の状態</FieldLabel><select id="goal-create-status" value={status} onChange={event=>{const next=event.target.value as ChallengeStatus;setPublicActivity(next!=='気になる');setStatus(next);}}>{statuses.map(value=><option key={value} value={value}>{statusLabel(value)}</option>)}</select></Field>
              {status!=='気になる'&&<Field><FieldLabel htmlFor="goal-create-period">{activityPeriodLabel(status)}（任意）</FieldLabel><Input id="goal-create-period" maxLength={50} value={activityPeriod} onChange={event=>setActivityPeriod(event.target.value)} placeholder="例：2026年夏"/></Field>}
              <Field><FieldLabel htmlFor="goal-create-memo">メモ（任意）</FieldLabel><Textarea id="goal-create-memo" maxLength={2000} value={memo} onChange={event=>setMemo(event.target.value)} placeholder="参加して取り組んだことなど"/></Field>

            </>}
            {['挑戦中','挑戦済'].includes(status)&&<Field><FieldLabel htmlFor="public-activity">タイムラインへの共有</FieldLabel><label className="visibilitychoice"><input id="public-activity" type="checkbox" checked={!publicActivity} onChange={event=>setPublicActivity(!event.target.checked)}/>共有しない</label><FieldDescription>チェックしない場合、活動名・状態・時期と下のひとことがTry Buddyの利用者全体に表示されます。プロフィール詳細が非公開でも共有されます。自分用メモは公開されません。</FieldDescription></Field>}
            {['挑戦中','挑戦済'].includes(status)&&publicActivity&&<Field><FieldLabel htmlFor="goal-public-text">共有するひとこと（任意）</FieldLabel><Textarea id="goal-public-text" maxLength={400} value={publicText} onChange={event=>setPublicText(event.target.value)} placeholder="例：応募を終えて、次に取り組みたいことを書きました。"/><FieldDescription>他のユーザーに見せたい内容だけを書いてください。</FieldDescription></Field>}
          </FieldGroup>
          {formError&&<p className="formerror" role="alert">{formError}</p>}
          <Button type="submit" disabled={busy}>{busy?'保存中…':'記録を保存'}</Button>
        </form>
      </DialogContent>
    </Dialog>
    <Dialog open={!!deleteTarget} onOpenChange={v=>{if(!v&&!busy)setDeleteTarget(null);}}><DialogContent className="modal"><DialogTitle>{deleteTarget==='account'?'登録情報とすべての記録を削除しますか？':'この記録を削除しますか？'}</DialogTitle><DialogDescription>{deleteTarget==='account'?'学校名・地域を含むプロフィールと挑戦記録を削除します。Googleアカウントには影響しません。':'削除した記録は元に戻せません。募集情報そのものは削除されません。'}</DialogDescription>{formError&&<p role="alert" className="formerror">{formError}</p>}<div className="recordactions"><Button variant="outline" disabled={busy} onClick={()=>setDeleteTarget(null)}>キャンセル</Button><Button variant="destructive" disabled={busy} onClick={()=>void remove()}>{busy?'削除中…':'削除する'}</Button></div></DialogContent></Dialog>
  </>;
}
