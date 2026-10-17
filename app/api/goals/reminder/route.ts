import {database} from '@/lib/database';
import {getSiteUser} from '@/app/site-auth';
import {apiError,InputError,readInput,response,textInput} from '@/lib/api';

export const dynamic='force-dynamic';

export async function PATCH(request:Request) {
  try {
    const body=await readInput(request),user=await getSiteUser();
    if(!user) throw new InputError('サインインしてください。',401);
    const id=textInput(body.id,100);
    if(typeof body.hidden!=='boolean') throw new InputError('締切のお知らせ設定を選んでください。');
    const result=await database().prepare('UPDATE goals SET reminder_hidden=? WHERE id=? AND owner_id=? AND opportunity_id IS NOT NULL').bind(body.hidden?1:0,id,user.userId).run();
    if(!result.meta.changes) throw new InputError('保存した募集が見つかりません。',404);
    return response({ok:true});
  } catch(e) { return apiError(e); }
}
