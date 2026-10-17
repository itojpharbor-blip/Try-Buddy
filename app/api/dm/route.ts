import {getSiteUser} from '@/app/site-auth';
import {database} from '@/lib/database';
import {apiError,InputError,readInput,response,textInput} from '@/lib/api';

export const dynamic='force-dynamic';
type ThreadRow={id:string;requester_id:string;recipient_id:string;accepted:number;updated_at:string;other_public_id:string;other_nickname:string;last_body:string|null};
type AccessRow={id:string;requester_id:string;recipient_id:string;accepted:number};
async function threadAccess(id:string,ownerId:string){
  const row=await database().prepare('SELECT id,requester_id,recipient_id,accepted FROM dm_threads WHERE id=? AND (requester_id=? OR recipient_id=?)').bind(id,ownerId,ownerId).first<AccessRow>();
  if(!row)throw new InputError('会話が見つかりません。',404);
  const other=row.requester_id===ownerId?row.recipient_id:row.requester_id;
  const blocked=await database().prepare('SELECT 1 FROM user_blocks WHERE (owner_id=? AND target_id=?) OR (owner_id=? AND target_id=?)').bind(ownerId,other,other,ownerId).first();
  if(blocked)throw new InputError('この相手との会話は利用できません。',403);
  return row;
}
export async function GET(request:Request){
  try{
    const user=await getSiteUser();if(!user)throw new InputError('サインインしてください。',401);
    const id=new URL(request.url).searchParams.get('thread'),db=database();
    if(id){
      if(id.length>100)throw new InputError('会話が見つかりません。',404);
      const thread=await threadAccess(id,user.userId);
      const {results}=await db.prepare('SELECT m.id,m.sender_id,m.body,m.created_at FROM dm_messages m WHERE m.thread_id=? ORDER BY m.created_at ASC LIMIT 200').bind(id).all<{id:string;sender_id:string;body:string;created_at:string}>();
      return response({thread:{id,accepted:!!thread.accepted,isRecipient:thread.recipient_id===user.userId},messages:results.map(m=>({id:m.id,body:m.body,createdAt:m.created_at,isOwn:m.sender_id===user.userId}))});
    }
    const {results}=await db.prepare(`SELECT d.id,d.requester_id,d.recipient_id,d.accepted,d.updated_at,p.public_id AS other_public_id,p.nickname AS other_nickname,(SELECT body FROM dm_messages m WHERE m.thread_id=d.id ORDER BY created_at DESC LIMIT 1) AS last_body FROM dm_threads d JOIN profiles p ON p.owner_id=CASE WHEN d.requester_id=? THEN d.recipient_id ELSE d.requester_id END WHERE (d.requester_id=? OR d.recipient_id=?) AND NOT EXISTS (SELECT 1 FROM user_blocks b WHERE (b.owner_id=d.requester_id AND b.target_id=d.recipient_id) OR (b.owner_id=d.recipient_id AND b.target_id=d.requester_id)) ORDER BY d.updated_at DESC LIMIT 100`).bind(user.userId,user.userId,user.userId).all<ThreadRow>();
    return response({threads:results.map(t=>({id:t.id,profileId:t.other_public_id,nickname:t.other_nickname,preview:t.last_body??'',updatedAt:t.updated_at,accepted:!!t.accepted,isRecipient:t.recipient_id===user.userId}))});
  }catch(error){return apiError(error);}
}
export async function POST(request:Request){
  try{
    const input=await readInput(request),user=await getSiteUser();if(!user)throw new InputError('サインインしてください。',401);
    const body=textInput(input.body,1000),db=database(),now=new Date().toISOString();
    let id:string;
    if(input.thread){
      id=textInput(input.thread,100);
      const thread=await threadAccess(id,user.userId);
      if(!thread.accepted)throw new InputError('相手がメッセージリクエストを承認するまで送れません。',409);
    }else{
      const profileId=textInput(input.profileId,64);
      const target=await db.prepare('SELECT owner_id FROM profiles WHERE public_id=? AND profile_visible=1').bind(profileId).first<{owner_id:string}>();
      if(!target||target.owner_id===user.userId)throw new InputError('相手が見つかりません。',404);
      const followed=await db.prepare('SELECT 1 FROM follows WHERE follower_id=? AND target_id=?').bind(user.userId,target.owner_id).first();
      if(!followed)throw new InputError('フォロー中の相手にだけメッセージを送れます。',403);
      const blocked=await db.prepare('SELECT 1 FROM user_blocks WHERE (owner_id=? AND target_id=?) OR (owner_id=? AND target_id=?)').bind(user.userId,target.owner_id,target.owner_id,user.userId).first();
      if(blocked)throw new InputError('この相手にはメッセージを送れません。',403);
      const existing=await db.prepare('SELECT id,accepted FROM dm_threads WHERE requester_id=? AND recipient_id=? ORDER BY created_at DESC LIMIT 1').bind(user.userId,target.owner_id).first<{id:string;accepted:number}>();
      if(existing){id=existing.id;if(!existing.accepted)throw new InputError('承認待ちのメッセージがあります。',409);}
      else{
        id=crypto.randomUUID();
        const result=await db.prepare('INSERT INTO dm_threads(id,requester_id,recipient_id,accepted,created_at,updated_at) SELECT ?,?,?,0,?,? WHERE (SELECT COUNT(*) FROM dm_threads WHERE requester_id=?) < 200').bind(id,user.userId,target.owner_id,now,now,user.userId).run();
        if(!result.meta.changes)throw new InputError('会話の上限に達しました。',409);
      }
    }
    await db.batch([
      db.prepare('INSERT INTO dm_messages(id,thread_id,sender_id,body,created_at) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),id,user.userId,body,now),
      db.prepare('UPDATE dm_threads SET updated_at=? WHERE id=?').bind(now,id),
    ]);
    return response({id},201);
  }catch(error){return apiError(error);}
}
export async function PATCH(request:Request){
  try{
    const input=await readInput(request),user=await getSiteUser();if(!user)throw new InputError('サインインしてください。',401);
    const id=textInput(input.id,100),thread=await threadAccess(id,user.userId);
    if(thread.recipient_id!==user.userId||thread.accepted)throw new InputError('この申請は操作できません。',403);
    const db=database();
    if(input.action==='accept')await db.prepare('UPDATE dm_threads SET accepted=1,updated_at=? WHERE id=? AND recipient_id=?').bind(new Date().toISOString(),id,user.userId).run();
    else if(input.action==='reject')await db.batch([db.prepare('DELETE FROM dm_messages WHERE thread_id=?').bind(id),db.prepare('DELETE FROM dm_threads WHERE id=? AND recipient_id=?').bind(id,user.userId)]);
    else throw new InputError('操作を選び直してください。');
    return response({ok:true});
  }catch(error){return apiError(error);}
}
