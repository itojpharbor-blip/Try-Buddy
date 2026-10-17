import {getSiteUser} from '@/app/site-auth';
import {apiError,InputError,readInput,response} from '@/lib/api';
import {database} from '@/lib/database';
import {cleanTag,curatedTags,tagGroups} from '@/lib/interest-tags';

export const dynamic='force-dynamic';

export async function GET(){
  try{
    const {results}=await database().prepare('SELECT name FROM interest_tags ORDER BY created_at DESC LIMIT 200').all<{name:string}>();
    return response({groups:tagGroups,custom:results.map(row=>row.name)});
  }catch(error){return apiError(error);}
}

export async function POST(request:Request){
  try{
    const user=await getSiteUser();
    if(!user)throw new InputError('タグを作るにはサインインしてください。',401);
    const input=await readInput(request),name=cleanTag(input.name);
    if(!name)throw new InputError('タグは2〜24文字で入力してください。');
    if(curatedTags.includes(name))return response({name});
    const db=database();
    const existing=await db.prepare('SELECT name FROM interest_tags WHERE name=?').bind(name).first();
    if(existing)return response({name});
    const today=new Date().toISOString().slice(0,10);
    const count=await db.prepare('SELECT COUNT(*) AS total FROM interest_tags WHERE creator_id=? AND created_at>=?').bind(user.userId,today).first<{total:number}>();
    if((count?.total??0)>=10)throw new InputError('新しいタグの作成は1日10件までです。',429);
    await db.prepare('INSERT INTO interest_tags(name,creator_id,created_at) VALUES(?,?,?)').bind(name,user.userId,new Date().toISOString()).run();
    return response({name},201);
  }catch(error){return apiError(error);}
}
