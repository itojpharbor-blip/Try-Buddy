import {getSiteUser} from '@/app/site-auth';
import {database} from '@/lib/database';
import {apiError,InputError,readInput,response,textInput} from '@/lib/api';

export const dynamic='force-dynamic';

export async function POST(request:Request){
  try{
    const input=await readInput(request),user=await getSiteUser();
    if(!user)throw new InputError('投稿するにはサインインしてください。',401);
    const body=textInput(input.body,500),db=database();
    const profile=await db.prepare('SELECT 1 FROM profiles WHERE owner_id=?').bind(user.userId).first();
    if(!profile)throw new InputError('先にプロフィールを登録してください。',409);
    const id=crypto.randomUUID(),now=new Date().toISOString();
    const result=await db.prepare('INSERT INTO timeline_posts(id,owner_id,body,created_at) SELECT ?,?,?,? WHERE (SELECT COUNT(*) FROM timeline_posts WHERE owner_id=?) < 500').bind(id,user.userId,body,now,user.userId).run();
    if(!result.meta.changes)throw new InputError('投稿の上限に達しました。',409);
    return response({id},201);
  }catch(error){return apiError(error);}
}

export async function DELETE(request:Request){
  try{
    const input=await readInput(request),user=await getSiteUser();
    if(!user)throw new InputError('サインインしてください。',401);
    const id=textInput(input.id,100),db=database();
    const own=await db.prepare('SELECT 1 FROM timeline_posts WHERE id=? AND owner_id=?').bind(id,user.userId).first();
    if(!own)throw new InputError('投稿が見つかりません。',404);
    await db.batch([
      db.prepare('DELETE FROM timeline_reactions WHERE post_id=?').bind(id),
      db.prepare('DELETE FROM timeline_replies WHERE post_id=?').bind(id),
      db.prepare('DELETE FROM timeline_posts WHERE id=? AND owner_id=?').bind(id,user.userId),
    ]);
    return response({ok:true});
  }catch(error){return apiError(error);}
}
