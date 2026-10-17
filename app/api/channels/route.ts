import {getSiteUser} from '@/app/site-auth';
import {cleanTag,curatedTags} from '@/lib/interest-tags';
import {database} from '@/lib/database';
import {opportunities} from '@/lib/opportunities';
import {apiError,InputError,readInput,response,textInput} from '@/lib/api';

export const dynamic='force-dynamic';

type TopicRow={id:string;title:string;body:string;category:string;opportunity_id:string|null;access_type:string;created_at:string;owner_id:string;public_id:string;nickname:string;message_count:number;member_count:number;last_activity:string;joined:number;pending:number};

async function categoryInput(value:unknown){
  const tag=cleanTag(value);
  if(!tag)throw new InputError('ジャンルを選び直してください。');
  if(!curatedTags.includes(tag)){
    const found=await database().prepare('SELECT name FROM interest_tags WHERE name=?').bind(tag).first();
    if(!found)throw new InputError('ジャンルを選び直してください。');
  }
  return tag;
}

export async function GET(request:Request){
  try{
    const user=await getSiteUser();
    if(!user)throw new InputError('交流の場を見るにはサインインしてください。',401);
    const params=new URL(request.url).searchParams;
    const category=params.get('category')?await categoryInput(params.get('category')):null;
    const id=params.get('id');
    const opportunityId=params.get('opportunityId');
    const opportunity=opportunityId?opportunities.find(item=>item.id===opportunityId):null;
    if(opportunityId&&!opportunity)throw new InputError('募集を選び直してください。');
    const db=database();
    const filter=[category?'AND t.category=?':'',opportunityId?'AND t.opportunity_id=?':'',id?'AND t.id=?':''].join(' ');
    const {results}=await db.prepare(`SELECT t.id,t.title,
      CASE WHEN t.access_type='approval' AND t.owner_id<>? AND NOT EXISTS(SELECT 1 FROM channel_members m WHERE m.topic_id=t.id AND m.owner_id=?) THEN '' ELSE t.body END AS body,
      t.category,t.opportunity_id,t.access_type,t.created_at,t.owner_id,p.public_id,p.nickname,
      (SELECT COUNT(*) FROM channel_replies r JOIN profiles rp ON rp.owner_id=r.owner_id WHERE r.topic_id=t.id AND rp.profile_visible=1) AS message_count,
      (SELECT COUNT(*) FROM channel_members m WHERE m.topic_id=t.id)+1 AS member_count,
      COALESCE((SELECT MAX(r.created_at) FROM channel_replies r WHERE r.topic_id=t.id),t.created_at) AS last_activity,
      EXISTS(SELECT 1 FROM channel_members m WHERE m.topic_id=t.id AND m.owner_id=?) AS joined,
      EXISTS(SELECT 1 FROM channel_requests q WHERE q.topic_id=t.id AND q.owner_id=?) AS pending
      FROM channel_topics t JOIN profiles p ON p.owner_id=t.owner_id
      WHERE p.profile_visible=1 ${filter}
      ORDER BY last_activity DESC LIMIT 60`).bind(user.userId,user.userId,user.userId,user.userId,...(category?[category]:[]),...(opportunityId?[opportunityId]:[]),...(id?[id]:[])).all<TopicRow>();
    return response({topics:results.map(row=>({id:row.id,title:row.title,body:row.body,category:row.category,opportunityId:row.opportunity_id,accessType:row.access_type,createdAt:row.created_at,lastActivity:row.last_activity,profileId:row.public_id,nickname:row.nickname,isOwn:row.owner_id===user.userId,membership:row.owner_id===user.userId||row.joined?'joined':row.pending?'pending':'none',messageCount:row.message_count,memberCount:row.member_count}))});
  }catch(error){return apiError(error);}
}

export async function POST(request:Request){
  try{
    const user=await getSiteUser();
    if(!user)throw new InputError('話題を書くにはサインインしてください。',401);
    const input=await readInput(request);
    const category=await categoryInput(input.category),title=textInput(input.title,80),body=textInput(input.body,600,true);
    const accessType=input.accessType;
    if(accessType!=='open'&&accessType!=='approval')throw new InputError('参加方法を選び直してください。');
    const opportunityId=textInput(input.opportunityId,120,true)||null;
    if(opportunityId&&!opportunities.some(item=>item.id===opportunityId))throw new InputError('募集を選び直してください。');
    const db=database();
    const profile=await db.prepare('SELECT 1 AS visible FROM profiles WHERE owner_id=? AND profile_visible=1').bind(user.userId).first();
    if(!profile)throw new InputError('公開プロフィールを有効にすると話題を書けます。',403);
    const today=new Date().toISOString().slice(0,10);
    const count=await db.prepare('SELECT COUNT(*) AS total FROM channel_topics WHERE owner_id=? AND created_at>=?').bind(user.userId,today).first<{total:number}>();
    if((count?.total??0)>=5)throw new InputError('話題の作成は1日5件までです。',429);
    const id=crypto.randomUUID(),createdAt=new Date().toISOString();
    await db.prepare('INSERT INTO channel_topics(id,owner_id,category,opportunity_id,title,body,access_type,created_at) VALUES(?,?,?,?,?,?,?,?)')
      .bind(id,user.userId,category,opportunityId,title,body,accessType,createdAt).run();
    return response({id},201);
  }catch(error){return apiError(error);}
}

export async function DELETE(request:Request){
  try{
    const user=await getSiteUser();
    if(!user)throw new InputError('サインインしてください。',401);
    const input=await readInput(request),id=textInput(input.id,64),db=database();
    const topic=await db.prepare('SELECT owner_id FROM channel_topics WHERE id=?').bind(id).first<{owner_id:string}>();
    if(!topic||topic.owner_id!==user.userId)throw new InputError('この話題は削除できません。',404);
    await db.batch([
      db.prepare('DELETE FROM channel_replies WHERE topic_id=?').bind(id),
      db.prepare('DELETE FROM channel_members WHERE topic_id=?').bind(id),
      db.prepare('DELETE FROM channel_requests WHERE topic_id=?').bind(id),
      db.prepare('DELETE FROM channel_topics WHERE id=? AND owner_id=?').bind(id,user.userId),
    ]);
    return response({ok:true});
  }catch(error){return apiError(error);}
}
