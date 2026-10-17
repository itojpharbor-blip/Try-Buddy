import {getSiteUser} from '@/app/site-auth';
import {database} from '@/lib/database';
import {apiError,InputError,readInput,response,textInput} from '@/lib/api';

export const dynamic='force-dynamic';
export async function GET(request:Request){
  try{
    const user=await getSiteUser();if(!user)throw new InputError('サインインしてください。',401);
    const id=new URL(request.url).searchParams.get('id');if(!id||id.length>100)throw new InputError('投稿が見つかりません。',404);
    const db=database();
    const post=await db.prepare('SELECT 1 FROM timeline_posts t WHERE t.id=? AND NOT EXISTS (SELECT 1 FROM user_blocks b WHERE (b.owner_id=? AND b.target_id=t.owner_id) OR (b.owner_id=t.owner_id AND b.target_id=?))').bind(id,user.userId,user.userId).first();
    if(!post)throw new InputError('投稿が見つかりません。',404);
    const {results}=await db.prepare('SELECT r.id,r.body,r.created_at,p.nickname,p.public_id,r.owner_id FROM timeline_replies r JOIN profiles p ON p.owner_id=r.owner_id WHERE r.post_id=? AND NOT EXISTS (SELECT 1 FROM user_blocks b WHERE (b.owner_id=? AND b.target_id=r.owner_id) OR (b.owner_id=r.owner_id AND b.target_id=?)) ORDER BY r.created_at ASC LIMIT 100').bind(id,user.userId,user.userId).all<{id:string;body:string;created_at:string;nickname:string;public_id:string;owner_id:string}>();
    return response({replies:results.map(r=>({id:r.id,body:r.body,createdAt:r.created_at,nickname:r.nickname,profileId:r.public_id,isOwn:r.owner_id===user.userId}))});
  }catch(error){return apiError(error);}
}
export async function POST(request:Request){
  try{
    const input=await readInput(request),user=await getSiteUser();if(!user)throw new InputError('サインインしてください。',401);
    const id=textInput(input.id,100),body=textInput(input.body,400),db=database();
    const target=await db.prepare('SELECT 1 FROM timeline_posts t WHERE t.id=? AND NOT EXISTS (SELECT 1 FROM user_blocks b WHERE (b.owner_id=? AND b.target_id=t.owner_id) OR (b.owner_id=t.owner_id AND b.target_id=?))').bind(id,user.userId,user.userId).first();
    if(!target)throw new InputError('投稿が見つかりません。',404);
    const replyId=crypto.randomUUID();
    const result=await db.prepare('INSERT INTO timeline_replies(id,post_id,owner_id,body,created_at) SELECT ?,?,?,?,? WHERE (SELECT COUNT(*) FROM timeline_replies WHERE post_id=?) < 1000').bind(replyId,id,user.userId,body,new Date().toISOString(),id).run();
    if(!result.meta.changes)throw new InputError('返信の上限に達しました。',409);
    return response({id:replyId},201);
  }catch(error){return apiError(error);}
}
export async function DELETE(request:Request){
  try{
    const input=await readInput(request),user=await getSiteUser();if(!user)throw new InputError('サインインしてください。',401);
    const id=textInput(input.id,100);
    await database().prepare('DELETE FROM timeline_replies WHERE id=? AND owner_id=?').bind(id,user.userId).run();
    return response({ok:true});
  }catch(error){return apiError(error);}
}
