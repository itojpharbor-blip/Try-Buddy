import {getSiteUser} from '@/app/site-auth';
import {database} from '@/lib/database';
import {regions} from '@/lib/opportunities';
import {profileGrades,reminderOptions} from '@/lib/challenge-experience';
import {cleanTag,curatedTags} from '@/lib/interest-tags';
import {apiError,InputError,readInput,response,textInput} from '@/lib/api';
export const dynamic='force-dynamic';
export async function GET() {
  try {
    const user=await getSiteUser();
    if(!user) return response({signedIn:false,email:'',profile:null});
    const profile=await database().prepare('SELECT nickname,school,region,grade,interests,reminder_days,bio,dream,public_id,profile_visible,dream_visible,grade_visible,region_visible FROM profiles WHERE owner_id=?').bind(user.userId).first<{nickname:string;school:string;region:string;grade:string;interests:string;reminder_days:number;bio:string;dream:string;public_id:string|null;profile_visible:number;dream_visible:number;grade_visible:number;region_visible:number}>();
    let interests:string[]=[];
    if(profile){try{const parsed=JSON.parse(profile.interests);if(Array.isArray(parsed))interests=parsed.filter((x):x is string=>typeof x==='string'&&!!cleanTag(x)).slice(0,20);}catch{/* Keep malformed preferences empty. */}}
    return response({signedIn:true,email:user.email,profile:profile?{nickname:profile.nickname,school:profile.school,region:profile.region,grade:profile.grade,interests,reminderDays:profile.reminder_days,bio:profile.bio,dream:profile.dream,publicId:profile.public_id,profileVisible:!!profile.profile_visible,dreamVisible:!!profile.dream_visible,gradeVisible:!!profile.grade_visible,regionVisible:!!profile.region_visible}:null});
  } catch(e) { return apiError(e); }
}
export async function PUT(request:Request) {
  try {
    const b=await readInput(request),user=await getSiteUser();
    if(!user) throw new InputError('サインインしてください。',401);
    const nickname=textInput(b.nickname,30),school=textInput(b.school,100,true),region=textInput(b.region,20,true),grade=textInput(b.grade,20,true),bio=textInput(b.bio,500,true),dream=textInput(b.dream,160,true);
    if(region&&!regions.some(r=>r===region)) throw new InputError('居住地域を選択肢から選んでください。');
    if(grade&&!profileGrades.some(g=>g===grade)) throw new InputError('学年を選択肢から選んでください。');
    if(!Array.isArray(b.interests)||b.interests.length>20||!b.interests.every(x=>typeof x==='string'&&cleanTag(x)===x)||new Set(b.interests).size!==b.interests.length) throw new InputError('興味のあるタグを選び直してください（20件まで）。');
    const custom=b.interests.filter((tag:string)=>!curatedTags.includes(tag));
    if(custom.length){
      const placeholders=custom.map(()=>'?').join(',');
      const {results}=await database().prepare(`SELECT name FROM interest_tags WHERE name IN (${placeholders})`).bind(...custom).all<{name:string}>();
      if(results.length!==custom.length)throw new InputError('自作タグを先に登録してください。');
    }
    if(typeof b.reminderDays!=='number'||!reminderOptions.includes(b.reminderDays as typeof reminderOptions[number])) throw new InputError('締切のお知らせ設定を選んでください。');
    const visibility=[b.profileVisible,b.dreamVisible,b.gradeVisible,b.regionVisible];
    if(!visibility.every(value=>typeof value==='boolean')) throw new InputError('公開設定を選び直してください。');
    await database().prepare('INSERT INTO profiles(owner_id,nickname,school,region,grade,interests,reminder_days,bio,dream,public_id,profile_visible,dream_visible,grade_visible,region_visible,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(owner_id) DO UPDATE SET nickname=excluded.nickname,school=excluded.school,region=excluded.region,grade=excluded.grade,interests=excluded.interests,reminder_days=excluded.reminder_days,bio=excluded.bio,dream=excluded.dream,public_id=COALESCE(public_id,excluded.public_id),profile_visible=excluded.profile_visible,dream_visible=excluded.dream_visible,grade_visible=excluded.grade_visible,region_visible=excluded.region_visible,updated_at=excluded.updated_at')
      .bind(user.userId,nickname,school,region,grade,JSON.stringify(b.interests),b.reminderDays,bio,dream,crypto.randomUUID(),b.profileVisible?1:0,b.dreamVisible?1:0,b.gradeVisible?1:0,b.regionVisible?1:0,new Date().toISOString()).run();
    return response({ok:true});
  } catch(e) { return apiError(e); }
}
export async function DELETE(request:Request) {
  try {
    const b=await readInput(request),user=await getSiteUser();
    if(!user) throw new InputError('サインインしてください。',401);
    if(b.confirm!=='DELETE') throw new InputError('削除の確認が必要です。');
    const db=database();
    await db.batch([
      db.prepare('DELETE FROM channel_replies WHERE owner_id=? OR topic_id IN (SELECT id FROM channel_topics WHERE owner_id=?)').bind(user.userId,user.userId),
      db.prepare('DELETE FROM channel_members WHERE owner_id=? OR topic_id IN (SELECT id FROM channel_topics WHERE owner_id=?)').bind(user.userId,user.userId),
      db.prepare('DELETE FROM channel_requests WHERE owner_id=? OR topic_id IN (SELECT id FROM channel_topics WHERE owner_id=?)').bind(user.userId,user.userId),
      db.prepare('DELETE FROM channel_topics WHERE owner_id=?').bind(user.userId),
      db.prepare('DELETE FROM follows WHERE follower_id=? OR target_id=?').bind(user.userId,user.userId),
      db.prepare('DELETE FROM reactions WHERE owner_id=? OR goal_id IN (SELECT id FROM goals WHERE owner_id=?)').bind(user.userId,user.userId),
      db.prepare('DELETE FROM timeline_reactions WHERE owner_id=? OR post_id IN (SELECT id FROM timeline_posts WHERE owner_id=?)').bind(user.userId,user.userId),
      db.prepare('DELETE FROM timeline_replies WHERE owner_id=? OR post_id IN (SELECT id FROM timeline_posts WHERE owner_id=?)').bind(user.userId,user.userId),
      db.prepare('DELETE FROM timeline_posts WHERE owner_id=?').bind(user.userId),
      db.prepare('DELETE FROM dm_messages WHERE sender_id=? OR thread_id IN (SELECT id FROM dm_threads WHERE requester_id=? OR recipient_id=?)').bind(user.userId,user.userId,user.userId),
      db.prepare('DELETE FROM dm_threads WHERE requester_id=? OR recipient_id=?').bind(user.userId,user.userId),
      db.prepare('DELETE FROM user_blocks WHERE owner_id=? OR target_id=?').bind(user.userId,user.userId),
      db.prepare('DELETE FROM community_reports WHERE reporter_id=?').bind(user.userId),
      db.prepare('DELETE FROM goals WHERE owner_id=?').bind(user.userId),
      db.prepare('DELETE FROM official_visits WHERE owner_id=?').bind(user.userId),
      db.prepare('DELETE FROM auth_sessions WHERE owner_id=?').bind(user.userId),
      db.prepare('DELETE FROM google_accounts WHERE owner_id=?').bind(user.userId),
      db.prepare('DELETE FROM profiles WHERE owner_id=?').bind(user.userId),
    ]);
    return response({ok:true});
  } catch(e) { return apiError(e); }
}
