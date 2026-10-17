import {getSiteUser} from '@/app/site-auth';
import {database} from '@/lib/database';
import {apiError,InputError,response} from '@/lib/api';

export const dynamic='force-dynamic';

type PublicProfileRow={
  owner_id:string;public_id:string;nickname:string;bio:string;dream:string;grade:string;region:string;
  dream_visible:number;grade_visible:number;region_visible:number;
};

function visibleProfile(row:PublicProfileRow){
  return {
    id:row.public_id,
    nickname:row.nickname,
    bio:row.bio,
    dream:row.dream_visible?row.dream:null,
    grade:row.grade_visible?row.grade:null,
    region:row.region_visible?row.region:null,
  };
}

export async function GET(request:Request){
  try{
    const user=await getSiteUser();
    if(!user) throw new InputError('プロフィールを見るにはサインインしてください。',401);
    const id=new URL(request.url).searchParams.get('id');
    const db=database();
    if(id!==null){
      if(id.length>64||!id) throw new InputError('プロフィールが見つかりません。',404);
      const row=await db.prepare('SELECT owner_id,public_id,nickname,bio,dream,grade,region,dream_visible,grade_visible,region_visible FROM profiles WHERE public_id=? AND profile_visible=1 AND NOT EXISTS (SELECT 1 FROM user_blocks b WHERE (b.owner_id=? AND b.target_id=profiles.owner_id) OR (b.owner_id=profiles.owner_id AND b.target_id=?))').bind(id,user.userId,user.userId).first<PublicProfileRow>();
      if(!row) throw new InputError('プロフィールが見つかりません。',404);
      const [activities,follow]=await Promise.all([
        db.prepare("SELECT title,status,public_text,activity_period FROM goals WHERE owner_id=? AND public_activity=1 AND status IN ('挑戦中','挑戦済') ORDER BY COALESCE(NULLIF(updated_at,''),created_at) DESC LIMIT 50").bind(row.owner_id).all(),
        db.prepare('SELECT 1 AS followed FROM follows WHERE follower_id=? AND target_id=?').bind(user.userId,row.owner_id).first(),
      ]);
      return response({profile:{...visibleProfile(row),isOwnProfile:row.owner_id===user.userId,following:!!follow,activities:activities.results.map(item=>({title:item.title,status:item.status,publicText:item.public_text,activityPeriod:item.activity_period}))}});
    }
    const {results}=await db.prepare('SELECT owner_id,public_id,nickname,bio,dream,grade,region,dream_visible,grade_visible,region_visible FROM profiles WHERE profile_visible=1 AND public_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM user_blocks b WHERE (b.owner_id=? AND b.target_id=profiles.owner_id) OR (b.owner_id=profiles.owner_id AND b.target_id=?)) ORDER BY updated_at DESC LIMIT 100').bind(user.userId,user.userId).all<PublicProfileRow>();
    return response({profiles:results.map(visibleProfile)});
  }catch(error){return apiError(error);}
}
