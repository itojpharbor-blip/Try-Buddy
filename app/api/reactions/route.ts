import {getSiteUser} from '@/app/site-auth';
import {database} from '@/lib/database';
import {apiError,InputError,readInput,response,textInput} from '@/lib/api';

export const dynamic='force-dynamic';

export async function POST(request:Request){
  try{
    const input=await readInput(request),user=await getSiteUser();
    if(!user)throw new InputError('応援するにはサインインしてください。',401);
    const id=textInput(input.id,100),db=database();
    const target=await db.prepare("SELECT g.id FROM goals g WHERE g.id=? AND g.owner_id<>? AND g.public_activity=1 AND g.status IN ('挑戦中','挑戦済') AND NOT EXISTS (SELECT 1 FROM user_blocks b WHERE (b.owner_id=? AND b.target_id=g.owner_id) OR (b.owner_id=g.owner_id AND b.target_id=?))").bind(id,user.userId,user.userId,user.userId).first();
    if(!target)throw new InputError('公開された挑戦が見つかりません。',404);
    await db.prepare('INSERT OR IGNORE INTO reactions(owner_id,goal_id,created_at) VALUES(?,?,?)').bind(user.userId,id,new Date().toISOString()).run();
    return response({reacted:true});
  }catch(error){return apiError(error);}
}

export async function DELETE(request:Request){
  try{
    const input=await readInput(request),user=await getSiteUser();
    if(!user)throw new InputError('サインインしてください。',401);
    await database().prepare('DELETE FROM reactions WHERE owner_id=? AND goal_id=?').bind(user.userId,textInput(input.id,100)).run();
    return response({reacted:false});
  }catch(error){return apiError(error);}
}
