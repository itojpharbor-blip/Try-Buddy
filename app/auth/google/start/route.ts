import {database} from '@/lib/database';
import {config,randomToken,safeReturnTo,stateCookieHeader,tokenHash} from '@/lib/google-auth';

export const dynamic='force-dynamic';
export async function GET(request:Request){
  const settings=config();
  if(!settings)return new Response('Google ログインは準備中です。',{status:503,headers:{'Cache-Control':'no-store'}});
  if(new URL(request.url).origin!==settings.origin)return new Response('Invalid origin',{status:400});
  const state=randomToken(),verifier=randomToken(),nonce=randomToken();
  const stateHash=await tokenHash(state);
  const challenge=await tokenHash(verifier);
  const legacyId=request.headers.get('oai-authenticated-user-id');
  const legacyEmail=request.headers.get('oai-authenticated-user-email');
  const oldOwnerId=legacyId&&legacyEmail?legacyId:null;
  const returnTo=safeReturnTo(new URL(request.url).searchParams.get('return_to'));
  await database().prepare('DELETE FROM auth_flows WHERE expires_at<=?').bind(Math.floor(Date.now()/1000)).run();
  await database().prepare('INSERT INTO auth_flows(state_hash,code_verifier,nonce,return_to,old_owner_id,expires_at) VALUES(?,?,?,?,?,?)').bind(stateHash,verifier,nonce,returnTo,oldOwnerId,Math.floor(Date.now()/1000)+600).run();
  const url=new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id',settings.clientId);
  url.searchParams.set('redirect_uri',`${settings.origin}/auth/google/callback`);
  url.searchParams.set('response_type','code');
  url.searchParams.set('scope','openid email profile');
  url.searchParams.set('state',state);
  url.searchParams.set('nonce',nonce);
  url.searchParams.set('code_challenge',challenge);
  url.searchParams.set('code_challenge_method','S256');
  return new Response(null,{status:302,headers:{Location:url.toString(),'Set-Cookie':stateCookieHeader(state),'Cache-Control':'no-store'}});
}
