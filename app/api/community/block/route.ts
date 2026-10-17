import {getSiteUser} from '@/app/site-auth';
import {database} from '@/lib/database';
import {apiError,InputError,readInput,response,textInput} from '@/lib/api';
export const dynamic='force-dynamic';
export async function POST(request:Request){
  try{
    const input=await readInput(request),user=await getSiteUser();if(!user)throw new InputError('サインインしてください。',401);
    const id=textInput(input.profileId,64),db=database();
    const target=await db.prepare('SELECT owner_id FROM profiles WHERE public_id=?').bind(id).first<{owner_id:string}>();
    if(!target||target.owner_id===user.userId)throw new InputError('相手が見つかりません。',404);
    await db.batch([
      db.prepare('INSERT OR IGNORE INTO user_blocks(owner_id,target_id,created_at) VALUES(?,?,?)').bind(user.userId,target.owner_id,new Date().toISOString()),
      db.prepare('DELETE FROM follows WHERE (follower_id=? AND target_id=?) OR (follower_id=? AND target_id=?)').bind(user.userId,target.owner_id,target.owner_id,user.userId),
    ]);
    return response({ok:true});
  }catch(error){return apiError(error);}
}
