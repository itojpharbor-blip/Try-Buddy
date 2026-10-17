import {isClosed,nextDeadline,type Opportunity} from './opportunities';

export const interestCategories=['コンテスト','ボランティア','留学・国際交流'] as const;
export const profileGrades=['中学生','高校1年','高校2年','高校3年','高専・その他'] as const;
export const reminderOptions=[0,1,3,7,14] as const;

export type Preferences={grade:string;region:string;interests:string[];reminderDays:number};
export type SavedChallenge={opportunityId:string|null;status:string};

export function openDeadline(opportunity:Opportunity,now:number):number|null {
  if(opportunity.expectedNext||opportunity.ongoing||isClosed(opportunity,now)) return null;
  const deadline=Date.parse(nextDeadline(opportunity,now));
  return Number.isFinite(deadline)&&deadline>=now?deadline:null;
}

export function deadlineMessage(deadline:number,now:number):string {
  const hours=Math.ceil((deadline-now)/3_600_000);
  if(hours<=24) return '締切まで24時間以内';
  return `締切まであと${Math.ceil(hours/24)}日`;
}

export function reminderFor(opportunity:Opportunity,preferences:Preferences,now:number):string|null {
  if(preferences.reminderDays===0)return null;
  const deadline=openDeadline(opportunity,now);
  if(deadline===null||deadline-now>preferences.reminderDays*86_400_000)return null;
  return deadlineMessage(deadline,now);
}

export function recommendation(opportunity:Opportunity,preferences:Preferences,now:number):{score:number;reasons:string[]} {
  if(opportunity.expectedNext||isClosed(opportunity,now)||(preferences.grade&&!opportunity.grades.includes(preferences.grade)))return {score:0,reasons:[]};
  const reasons:string[]=[];
  let score=0;
  if(preferences.interests.includes(opportunity.category)){score+=4;reasons.push(`興味のある「${opportunity.category}」`);}
  const matchingTags=preferences.interests.filter(tag=>opportunity.relatedTags?.includes(tag)&&tag!==opportunity.category);
  if(matchingTags.length){score+=Math.min(6,matchingTags.length*3);reasons.push(`興味のある「${matchingTags.slice(0,2).join('・')}」`);}
  if(preferences.grade&&opportunity.grades.includes(preferences.grade)){score+=3;reasons.push('学年が募集の対象');}
  if(preferences.region&&opportunity.region===preferences.region){score+=2;reasons.push('選んだ地域の募集');}
  else if(preferences.region&&(opportunity.region==='全国'||opportunity.online)){score+=1;reasons.push(opportunity.online?'オンライン対応の記載あり':'全国向けの募集');}
  return {score,reasons};
}

export function recommendedOpportunities(items:Opportunity[],preferences:Preferences,goals:SavedChallenge[],now:number,limit=3){
  const saved=new Set(goals.map(goal=>goal.opportunityId));
  return items.map(opportunity=>({opportunity,...recommendation(opportunity,preferences,now)}))
    .filter(item=>item.score>0&&!saved.has(item.opportunity.id))
    .sort((a,b)=>b.score-a.score||(openDeadline(a.opportunity,now)??Infinity)-(openDeadline(b.opportunity,now)??Infinity))
    .slice(0,limit);
}
