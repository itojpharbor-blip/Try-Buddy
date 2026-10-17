import {getSiteUser} from '@/app/site-auth';
import {visibleRoom} from '@/app/api/channels/shared';
import {database} from '@/lib/database';
import {apiError,InputError,readInput,response,textInput} from '@/lib/api';

export const dynamic='force-dynamic';

type RequestRow={public_id:string;nickname:string;created_at:string};

export async function GET(request:Request){
  try{
    const user=await getSiteUser();
    if(!user)throw new InputError('サインインしてください。',401);
    const room=await visibleRoom(textInput(new URL(request.url).searchParams.get('topicId'),64));
    if(room.owner_id!==user.userId)throw new InputError('申請は部屋の作成者だけが確認できます。',403);
    const {results}=await database().prepare(`SELECT p.public_id,p.nickname,q.created_at FROM channel_requests q
      JOIN profiles p ON p.owner_id=q.owner_id WHERE q.topic_id=? AND p.profile_visible=1
      ORDER BY q.created_at ASC LIMIT 100`).bind(room.id).all<RequestRow>();
    return response({requests:results.map(row=>({profileId:row.public_id,nickname:row.nickname,createdAt:row.created_at}))});
  }catch(error){return apiError(error);}
}

export async function POST(request:Request){
  try{
    const user=await getSiteUser();
    if(!user)throw new InputError('サインインしてください。',401);
    const input=await readInput(request);
    const room=await visibleRoom(textInput(input.topicId,64));
    const action=textInput(input.action,16);
    const db=database();

    if(action==='join'||action==='request'){
      if(room.owner_id===user.userId)return response({membership:'joined'});
      const profile=await db.prepare('SELECT 1 AS visible FROM profiles WHERE owner_id=? AND profile_visible=1').bind(user.userId).first();
      if(!profile)throw new InputError('公開プロフィールを有効にすると参加できます。',403);
      const member=await db.prepare('SELECT 1 AS joined FROM channel_members WHERE topic_id=? AND owner_id=?').bind(room.id,user.userId).first();
      if(member)return response({membership:'joined'});
      if(action==='join'){
        if(room.access_type!=='open')throw new InputError('この部屋には参加申請が必要です。',403);
        await db.prepare('INSERT OR IGNORE INTO channel_members(topic_id,owner_id,joined_at) VALUES(?,?,?)').bind(room.id,user.userId,new Date().toISOString()).run();
        return response({membership:'joined'});
      }
      if(room.access_type!=='approval')throw new InputError('この部屋は自由に参加できます。');
      await db.prepare('INSERT OR IGNORE INTO channel_requests(topic_id,owner_id,created_at) VALUES(?,?,?)').bind(room.id,user.userId,new Date().toISOString()).run();
      return response({membership:'pending'});
    }

    if(action==='leave'||action==='cancel'){
      if(room.owner_id===user.userId)throw new InputError('作成者は部屋を退出できません。');
      if(action==='leave')await db.prepare('DELETE FROM channel_members WHERE topic_id=? AND owner_id=?').bind(room.id,user.userId).run();
      else await db.prepare('DELETE FROM channel_requests WHERE topic_id=? AND owner_id=?').bind(room.id,user.userId).run();
      return response({membership:'none'});
    }

    if(action==='approve'||action==='reject'){
      if(room.owner_id!==user.userId)throw new InputError('承認できるのは部屋の作成者だけです。',403);
      const profileId=textInput(input.profileId,64);
      const target=await db.prepare('SELECT p.owner_id FROM channel_requests q JOIN profiles p ON p.owner_id=q.owner_id WHERE q.topic_id=? AND p.public_id=? AND p.profile_visible=1').bind(room.id,profileId).first<{owner_id:string}>();
      if(!target)throw new InputError('申請が見つかりません。',404);
      if(action==='approve'){
        await db.batch([
          db.prepare('INSERT OR IGNORE INTO channel_members(topic_id,owner_id,joined_at) VALUES(?,?,?)').bind(room.id,target.owner_id,new Date().toISOString()),
          db.prepare('DELETE FROM channel_requests WHERE topic_id=? AND owner_id=?').bind(room.id,target.owner_id),
        ]);
      }else await db.prepare('DELETE FROM channel_requests WHERE topic_id=? AND owner_id=?').bind(room.id,target.owner_id).run();
      return response({ok:true});
    }
    throw new InputError('操作を選び直してください。');
  }catch(error){return apiError(error);}
}
