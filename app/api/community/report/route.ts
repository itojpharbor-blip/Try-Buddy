import {getSiteUser} from '@/app/site-auth';
import {database} from '@/lib/database';
import {apiError,InputError,readInput,response,textInput} from '@/lib/api';
export const dynamic='force-dynamic';
export async function POST(request:Request){
  try{
    const input=await readInput(request),user=await getSiteUser();if(!user)throw new InputError('サインインしてください。',401);
    const kind=textInput(input.kind,20),targetId=textInput(input.targetId,100),reason=textInput(input.reason,500);
    const db=database();
    const queries:{[key:string]:string}={
      post:'SELECT 1 FROM timeline_posts WHERE id=?',
      reply:'SELECT 1 FROM timeline_replies WHERE id=?',
      message:'SELECT 1 FROM dm_messages m JOIN dm_threads d ON d.id=m.thread_id WHERE m.id=? AND (d.requester_id=? OR d.recipient_id=?)',
      profile:'SELECT 1 FROM profiles WHERE public_id=? AND profile_visible=1',
    };
    const query=queries[kind];if(!query)throw new InputError('通報対象を選び直してください。');
    const target=await db.prepare(query).bind(...(kind==='message'?[targetId,user.userId,user.userId]:[targetId])).first();
    if(!target)throw new InputError('通報対象が見つかりません。',404);
    await db.prepare('INSERT INTO community_reports(id,reporter_id,kind,target_id,reason,created_at) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),user.userId,kind,targetId,reason,new Date().toISOString()).run();
    return response({ok:true},201);
  }catch(error){return apiError(error);}
}
