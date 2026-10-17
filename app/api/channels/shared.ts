import {database} from '@/lib/database';
import {InputError} from '@/lib/api';

export type RoomRow={id:string;owner_id:string;access_type:string;category:string;profile_visible:number};

export async function visibleRoom(id:string):Promise<RoomRow>{
  const room=await database().prepare('SELECT t.id,t.owner_id,t.access_type,t.category,p.profile_visible FROM channel_topics t JOIN profiles p ON p.owner_id=t.owner_id WHERE t.id=?').bind(id).first<RoomRow>();
  if(!room||!room.profile_visible)throw new InputError('トークルームが見つかりません。',404);
  return room;
}

export async function requireRoomMember(room:RoomRow,userId:string){
  if(room.owner_id===userId)return;
  const member=await database().prepare('SELECT 1 AS joined FROM channel_members WHERE topic_id=? AND owner_id=?').bind(room.id,userId).first();
  if(!member)throw new InputError('この部屋に入ると会話を見られます。',403);
}
