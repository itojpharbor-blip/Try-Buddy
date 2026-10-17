import {getSiteUser} from '@/app/site-auth';
import {database} from '@/lib/database';
import {apiError,InputError,readInput,response,textInput} from '@/lib/api';

export const dynamic='force-dynamic';

async function targetFor(id:string){
  return database().prepare('SELECT owner_id FROM profiles WHERE public_id=? AND profile_visible=1').bind(id).first<{owner_id:string}>();
}

export async function POST(request:Request){
  try{
    const input=await readInput(request),user=await getSiteUser();
    if(!user)throw new InputError('フォローするにはサインインしてください。',401);
    const id=textInput(input.id,64),target=await targetFor(id);
    if(!target)throw new InputError('プロフィールが見つかりません。',404);
    if(target.owner_id===user.userId)throw new InputError('自分はフォローできません。');
    const db=database();
    const blocked=await db.prepare('SELECT 1 FROM user_blocks WHERE (owner_id=? AND target_id=?) OR (owner_id=? AND target_id=?)').bind(user.userId,target.owner_id,target.owner_id,user.userId).first();
    if(blocked)throw new InputError('この相手はフォローできません。',403);
    const result=await db.prepare('INSERT OR IGNORE INTO follows(follower_id,target_id,created_at) SELECT ?,?,? WHERE (SELECT COUNT(*) FROM follows WHERE follower_id=?) < 200')
      .bind(user.userId,target.owner_id,new Date().toISOString(),user.userId).run();
    if(!result.meta.changes){
      const existing=await db.prepare('SELECT 1 AS followed FROM follows WHERE follower_id=? AND target_id=?').bind(user.userId,target.owner_id).first();
      if(!existing)throw new InputError('フォローできる人数は200人までです。',409);
    }
    return response({following:true});
  }catch(error){return apiError(error);}
}

export async function DELETE(request:Request){
  try{
    const input=await readInput(request),user=await getSiteUser();
    if(!user)throw new InputError('サインインしてください。',401);
    const id=textInput(input.id,64);
    const target=await database().prepare('SELECT owner_id FROM profiles WHERE public_id=?').bind(id).first<{owner_id:string}>();
    if(target)await database().prepare('DELETE FROM follows WHERE follower_id=? AND target_id=?').bind(user.userId,target.owner_id).run();
    return response({following:false});
  }catch(error){return apiError(error);}
}
