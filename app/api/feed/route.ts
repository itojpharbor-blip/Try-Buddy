import {getSiteUser} from '@/app/site-auth';
import {database} from '@/lib/database';
import {opportunities} from '@/lib/opportunities';
import {apiError,InputError,response} from '@/lib/api';

export const dynamic='force-dynamic';
type GoalRow={id:string;title:string;status:string;public_text:string;activity_period:string;opportunity_id:string|null;updated_at:string;created_at:string;public_id:string;nickname:string;profile_visible:number;reaction_count:number;reacted:number;is_following:number};
type PostRow={id:string;body:string;created_at:string;public_id:string;nickname:string;profile_visible:number;reaction_count:number;reply_count:number;reacted:number;is_following:number};

export async function GET(request:Request){
  try{
    const user=await getSiteUser();
    if(!user)throw new InputError('タイムラインを見るにはサインインしてください。',401);
    const scope=new URL(request.url).searchParams.get('scope')??'all';
    if(scope!=='following'&&scope!=='all')throw new InputError('表示範囲を選び直してください。');
    const db=database(),followClause=scope==='following'?'AND EXISTS (SELECT 1 FROM follows f WHERE f.follower_id=? AND f.target_id=p.owner_id)':'';
    const blockClause='AND NOT EXISTS (SELECT 1 FROM user_blocks b WHERE (b.owner_id=? AND b.target_id=p.owner_id) OR (b.owner_id=p.owner_id AND b.target_id=?))';
    const params=scope==='following'?[user.userId,user.userId,user.userId,user.userId,user.userId]:[user.userId,user.userId,user.userId,user.userId];
    const [goals,posts]=await Promise.all([
      db.prepare(`SELECT g.id,g.title,g.status,g.public_text,g.activity_period,g.opportunity_id,g.updated_at,g.created_at,p.public_id,p.nickname,p.profile_visible,(SELECT COUNT(*) FROM reactions r WHERE r.goal_id=g.id) AS reaction_count,EXISTS(SELECT 1 FROM reactions mine WHERE mine.goal_id=g.id AND mine.owner_id=?) AS reacted,EXISTS(SELECT 1 FROM follows link WHERE link.follower_id=? AND link.target_id=p.owner_id) AS is_following FROM goals g JOIN profiles p ON p.owner_id=g.owner_id WHERE p.public_id IS NOT NULL AND g.public_activity=1 AND g.status IN ('挑戦中','挑戦済') ${followClause} ${blockClause} ORDER BY COALESCE(NULLIF(g.updated_at,''),g.created_at) DESC LIMIT 100`).bind(...params).all<GoalRow>(),
      db.prepare(`SELECT t.id,t.body,t.created_at,p.public_id,p.nickname,p.profile_visible,(SELECT COUNT(*) FROM timeline_reactions r WHERE r.post_id=t.id) AS reaction_count,(SELECT COUNT(*) FROM timeline_replies r WHERE r.post_id=t.id) AS reply_count,EXISTS(SELECT 1 FROM timeline_reactions mine WHERE mine.post_id=t.id AND mine.owner_id=?) AS reacted,EXISTS(SELECT 1 FROM follows link WHERE link.follower_id=? AND link.target_id=p.owner_id) AS is_following FROM timeline_posts t JOIN profiles p ON p.owner_id=t.owner_id WHERE p.public_id IS NOT NULL ${followClause} ${blockClause} ORDER BY t.created_at DESC LIMIT 100`).bind(...params).all<PostRow>(),
    ]);
    const categories=new Map(opportunities.map(item=>[item.id,item.category]));
    const items=[
      ...goals.results.map(row=>({kind:'goal' as const,id:row.id,profileId:row.public_id,profileVisible:!!row.profile_visible,isFollowing:!!row.is_following,nickname:row.nickname,title:row.title,status:row.status,publicText:row.public_text,activityPeriod:row.activity_period,category:row.opportunity_id?categories.get(row.opportunity_id)??null:null,updatedAt:row.updated_at||row.created_at,reactionCount:row.reaction_count,replyCount:0,reacted:!!row.reacted})),
      ...posts.results.map(row=>({kind:'post' as const,id:row.id,profileId:row.public_id,profileVisible:!!row.profile_visible,isFollowing:!!row.is_following,nickname:row.nickname,title:'',status:'',publicText:row.body,activityPeriod:'',category:null,updatedAt:row.created_at,reactionCount:row.reaction_count,replyCount:row.reply_count,reacted:!!row.reacted})),
    ].sort((a,b)=>Date.parse(b.updatedAt)-Date.parse(a.updatedAt)).slice(0,100);
    return response({items});
  }catch(error){return apiError(error);}
}
