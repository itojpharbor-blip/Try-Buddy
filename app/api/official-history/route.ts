import {database} from '@/lib/database';
import {getSiteUser} from '@/app/site-auth';
import {opportunities} from '@/lib/opportunities';
import {apiError,InputError,readInput,response,textInput} from '@/lib/api';

export const dynamic='force-dynamic';
const MAX_HISTORY=20;

export async function GET() {
  try {
    const user=await getSiteUser();
    if(!user) return response({items:[]});
    const {results}=await database().prepare('SELECT opportunity_id,visited_at FROM official_visits WHERE owner_id=? ORDER BY visited_at DESC LIMIT ?').bind(user.userId,MAX_HISTORY).all();
    return response({items:results.map(row=>({opportunityId:row.opportunity_id,visitedAt:row.visited_at}))});
  } catch(e) { return apiError(e); }
}

export async function POST(request:Request) {
  try {
    const body=await readInput(request),user=await getSiteUser();
    if(!user) throw new InputError('サインインしてください。',401);
    const opportunityId=textInput(body.opportunityId,100);
    if(!opportunities.some(item=>item.id===opportunityId)) throw new InputError('募集情報が見つかりません。',404);
    const visitedAt=new Date().toISOString(),db=database();
    await db.prepare('INSERT INTO official_visits(owner_id,opportunity_id,visited_at) VALUES(?,?,?) ON CONFLICT(owner_id,opportunity_id) DO UPDATE SET visited_at=excluded.visited_at').bind(user.userId,opportunityId,visitedAt).run();
    await db.prepare('DELETE FROM official_visits WHERE owner_id=? AND opportunity_id NOT IN (SELECT opportunity_id FROM official_visits WHERE owner_id=? ORDER BY visited_at DESC LIMIT ?)').bind(user.userId,user.userId,MAX_HISTORY).run();
    return response({opportunityId,visitedAt});
  } catch(e) { return apiError(e); }
}
