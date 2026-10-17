import {database} from '@/lib/database';
import {getSiteUser} from '@/app/site-auth';
import {opportunities, statuses} from '@/lib/opportunities';
import {apiError, InputError, readInput, response, textInput} from '@/lib/api';
export const dynamic='force-dynamic';
const MAX_GOALS_PER_USER=200;
const publicStatuses=['挑戦中','挑戦済'];

function parseUpdates(value:unknown) {
  if(typeof value!=='string') return [];
  try {
    const parsed=JSON.parse(value);
    return Array.isArray(parsed)?parsed:[];
  } catch { return []; }
}

export async function GET() {
  try {
    const user=await getSiteUser();
    if(!user) return response({signedIn:false,goals:[]});
    const {results}=await database().prepare('SELECT id,title,first_step,progress,updates,created_at,opportunity_id,status,memo,next_action,activity_period,reminder_hidden,public_activity,public_text FROM goals WHERE owner_id=? ORDER BY created_at DESC').bind(user.userId).all();
    return response({signedIn:true,goals:results.map(r=>({id:r.id,title:r.title,firstStep:r.first_step,progress:r.progress,updates:parseUpdates(r.updates),createdAt:r.created_at,opportunityId:r.opportunity_id,status:r.status,memo:r.memo,nextAction:r.next_action,activityPeriod:r.activity_period,reminderHidden:!!r.reminder_hidden,publicActivity:!!r.public_activity&&publicStatuses.includes(String(r.status)),publicText:r.public_text}))});
  } catch(e) { return apiError(e); }
}
export async function POST(request:Request) {
  try {
    const b=await readInput(request), user=await getSiteUser();
    if(!user) throw new InputError('保存するにはサインインしてください。',401);
    const db=database();
    const profile=await db.prepare('SELECT nickname FROM profiles WHERE owner_id=?').bind(user.userId).first<{nickname:string}>();
    if(!profile) throw new InputError('先にプロフィールを登録してください。',409);
    const opportunityId=textInput(b.opportunityId,100,true);
    const opportunity=opportunities.find(o=>o.id===opportunityId);
    if(opportunityId&&!opportunity) throw new InputError('募集情報が見つかりません。',404);
    if(opportunityId) {
      const existing=await db.prepare('SELECT id FROM goals WHERE owner_id=? AND opportunity_id=?').bind(user.userId,opportunityId).first();
      if(existing) return response({ok:true});
    }
    const title=opportunity?.name??textInput(b.title,150);
    const firstStep=opportunity?.firstStep??textInput(b.firstStep,300,true);
    const status=opportunity?'気になる':textInput(b.status,30);
    if(!statuses.some(s=>s===status)) throw new InputError('記録の状態を選択してください。');
    const memo=opportunity?'':textInput(b.memo,2000,true);
    const activityPeriod=opportunity?'':textInput(b.activityPeriod,50,true);
    if(!opportunity&&typeof b.publicActivity!=='boolean') throw new InputError('活動の公開設定を選んでください。');
    const publicActivity=!opportunity&&publicStatuses.includes(status)&&b.publicActivity===true;
    const publicText=publicActivity?textInput(b.publicText,400,true):'';
    const id=crypto.randomUUID();
    const timestamp=new Date().toISOString();
    const result=await db.prepare('INSERT INTO goals(id,owner_id,name,title,first_step,created_at,opportunity_id,status,memo,activity_period,public_activity,public_text,updated_at) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM goals WHERE owner_id=?) < ? ON CONFLICT(owner_id,opportunity_id) DO NOTHING')
      .bind(id,user.userId,profile.nickname,title,firstStep,timestamp,opportunityId||null,status,memo,activityPeriod,publicActivity?1:0,publicText,timestamp,user.userId,MAX_GOALS_PER_USER).run();
    if(!result.meta.changes) {
      if(opportunityId) {
        const existing=await db.prepare('SELECT id FROM goals WHERE owner_id=? AND opportunity_id=?').bind(user.userId,opportunityId).first();
        if(existing) return response({ok:true});
      }
      throw new InputError('保存できる挑戦記録は200件までです。不要な記録を削除してからお試しください。',409);
    }
    return response({ok:true},201);
  } catch(e) { return apiError(e); }
}
export async function PATCH(request:Request) {
  try {
    const b=await readInput(request), user=await getSiteUser();
    if(!user) throw new InputError('サインインしてください。',401);
    const id=textInput(b.id,100), memo=textInput(b.memo,2000,true),status=textInput(b.status,30),nextAction=textInput(b.nextAction,300,true),activityPeriod=textInput(b.activityPeriod,50,true);
    const title=b.title===undefined?null:textInput(b.title,150);
    if(!statuses.some(s=>s===status)) throw new InputError('記録の状態を選択してください。');
    if(typeof b.publicActivity!=='boolean') throw new InputError('活動の公開設定を選んでください。');
    if(typeof b.reminderHidden!=='boolean') throw new InputError('締切のお知らせ設定を選んでください。');
    const publicActivity=publicStatuses.includes(status)&&b.publicActivity;
    const publicText=publicActivity?textInput(b.publicText,400,true):'';
    const db=database();
    const result=await db.prepare('UPDATE goals SET title=CASE WHEN opportunity_id IS NULL AND ? IS NOT NULL THEN ? ELSE title END,status=?,memo=?,next_action=?,activity_period=?,reminder_hidden=?,public_activity=?,public_text=?,updated_at=? WHERE id=? AND owner_id=?').bind(title,title,status,memo,nextAction,activityPeriod,b.reminderHidden?1:0,publicActivity?1:0,publicText,new Date().toISOString(),id,user.userId).run();
    if(!result.meta.changes) throw new InputError('記録が見つかりません。',404);
    if(!publicActivity)await db.prepare('DELETE FROM reactions WHERE goal_id=?').bind(id).run();
    return response({ok:true});
  } catch(e) { return apiError(e); }
}
export async function DELETE(request:Request) {
  try {
    const b=await readInput(request),user=await getSiteUser();
    if(!user) throw new InputError('サインインしてください。',401);
    const db=database(),id=textInput(b.id,100);
    const result=await db.prepare('DELETE FROM goals WHERE id=? AND owner_id=?').bind(id,user.userId).run();
    if(!result.meta.changes) throw new InputError('記録が見つかりません。',404);
    await db.prepare('DELETE FROM reactions WHERE goal_id=?').bind(id).run();
    return response({ok:true});
  } catch(e) { return apiError(e); }
}
