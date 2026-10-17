import {database} from '@/lib/database';
import {clearStateCookieHeader,config,getStateCookie,randomToken,sessionCookieHeader,tokenHash,verifyGoogleIdToken} from '@/lib/google-auth';

export const dynamic='force-dynamic';
export async function GET(request:Request){
  const settings=config();
  if(!settings)return new Response('Google ログインは準備中です。',{status:503,headers:{'Cache-Control':'no-store'}});
  if(new URL(request.url).origin!==settings.origin)return new Response('Invalid origin',{status:400});
  const params=new URL(request.url).searchParams;
  const state=params.get('state'),cookieState=getStateCookie(request),code=params.get('code');
  if(!state||!cookieState||state!==cookieState||!code||!/^[A-Za-z0-9_-]{43}$/.test(state))return new Response('ログインを最初からやり直してください。',{status:400,headers:{'Cache-Control':'no-store'}});
  const db=database(),now=Math.floor(Date.now()/1000),stateHash=await tokenHash(state);
  const flow=await db.prepare('SELECT code_verifier,nonce,return_to,old_owner_id FROM auth_flows WHERE state_hash=? AND expires_at>?').bind(stateHash,now).first<{code_verifier:string;nonce:string;return_to:string;old_owner_id:string|null}>();
  if(!flow)return new Response('ログインの有効期限が切れました。',{status:400,headers:{'Cache-Control':'no-store'}});
  await db.prepare('DELETE FROM auth_flows WHERE state_hash=?').bind(stateHash).run();
  try{
    const tokenResponse=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:settings.clientId,client_secret:settings.clientSecret,code,code_verifier:flow.code_verifier,grant_type:'authorization_code',redirect_uri:`${settings.origin}/auth/google/callback`})});
    if(!tokenResponse.ok)throw Error('Google token exchange failed');
    const tokens=await tokenResponse.json() as {id_token?:string};
    if(!tokens.id_token)throw Error('Missing Google ID token');
    const claims=await verifyGoogleIdToken(tokens.id_token,settings.clientId,flow.nonce);
    const existing=await db.prepare('SELECT owner_id FROM google_accounts WHERE google_sub=?').bind(claims.sub).first<{owner_id:string}>();
    const ownerId=existing?.owner_id??flow.old_owner_id??`google:${claims.sub}`;
    if(!existing)await db.prepare('INSERT INTO google_accounts(google_sub,owner_id,created_at) VALUES(?,?,?)').bind(claims.sub,ownerId,new Date().toISOString()).run();
    const session=randomToken(),sessionHash=await tokenHash(session);
    await db.prepare('DELETE FROM auth_sessions WHERE expires_at<=?').bind(now).run();
    await db.prepare('INSERT INTO auth_sessions(token_hash,owner_id,email,full_name,expires_at) VALUES(?,?,?,?,?)').bind(sessionHash,ownerId,claims.email,claims.name??null,now+60*60*24*30).run();
    const response=new Response(null,{status:302,headers:{Location:new URL(flow.return_to,settings.origin).toString(),'Cache-Control':'no-store'}});
    response.headers.append('Set-Cookie',clearStateCookieHeader());
    response.headers.append('Set-Cookie',sessionCookieHeader(session));
    return response;
  }catch(error){
    console.error('Google sign-in failed',{message:error instanceof Error?error.message:'unknown'});
    const response=new Response('Google ログインに失敗しました。もう一度お試しください。',{status:400,headers:{'Cache-Control':'no-store'}});
    response.headers.set('Set-Cookie',clearStateCookieHeader());
    return response;
  }
}
