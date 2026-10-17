import {getSiteUser} from '@/app/site-auth';
import {database} from '@/lib/database';
import {apiError,InputError,readInput,response,textInput} from '@/lib/api';
import {requireRoomMember,visibleRoom} from '@/app/api/channels/shared';

export const dynamic='force-dynamic';

type ReplyRow={id:string;body:string;created_at:string;owner_id:string;public_id:string;nickname:string};

export async function GET(request:Request){
  try{
    const user=await getSiteUser();
    if(!user)throw new InputError('会話を見るにはサインインしてください。',401);
    const id=textInput(new URL(request.url).searchParams.get('topicId'),64);
    await requireRoomMember(await visibleRoom(id),user.userId);
    const {results}=await database().prepare(`SELECT r.id,r.body,r.created_at,r.owner_id,p.public_id,p.nickname FROM channel_replies r
      JOIN profiles p ON p.owner_id=r.owner_id WHERE r.topic_id=? AND p.profile_visible=1
      ORDER BY r.created_at DESC LIMIT 100`).bind(id).all<ReplyRow>();
    results.reverse();
    return response({replies:results.map(row=>({id:row.id,body:row.body,createdAt:row.created_at,profileId:row.public_id,nickname:row.nickname,isOwn:row.owner_id===user.userId}))});
  }catch(error){return apiError(error);}
}

export async function POST(request:Request){
  try{
    const user=await getSiteUser();
    if(!user)throw new InputError('発言するにはサインインしてください。',401);
    const input=await readInput(request),topicId=textInput(input.topicId,64),body=textInput(input.body,400),db=database();
    await requireRoomMember(await visibleRoom(topicId),user.userId);
    const profile=await db.prepare('SELECT 1 AS visible FROM profiles WHERE owner_id=? AND profile_visible=1').bind(user.userId).first();
    if(!profile)throw new InputError('公開プロフィールを有効にすると返信できます。',403);
    const today=new Date().toISOString().slice(0,10);
    const daily=await db.prepare('SELECT COUNT(*) AS total FROM channel_replies WHERE owner_id=? AND created_at>=?').bind(user.userId,today).first<{total:number}>();
    if((daily?.total??0)>=200)throw new InputError('発言は1日200件までです。',429);
    const id=crypto.randomUUID();
    await db.prepare('INSERT INTO channel_replies(id,topic_id,owner_id,body,created_at) VALUES(?,?,?,?,?)').bind(id,topicId,user.userId,body,new Date().toISOString()).run();
    return response({id},201);
  }catch(error){return apiError(error);}
}

export async function DELETE(request:Request){
  try{
    const user=await getSiteUser();
    if(!user)throw new InputError('サインインしてください。',401);
    const input=await readInput(request),id=textInput(input.id,64),db=database();
    const result=await db.prepare('DELETE FROM channel_replies WHERE id=? AND owner_id=?').bind(id,user.userId).run();
    if(!result.meta.changes)throw new InputError('この返信は削除できません。',404);
    return response({ok:true});
  }catch(error){return apiError(error);}
}
