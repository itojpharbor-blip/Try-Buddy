import {database} from '@/lib/database';
import {clearSessionCookieHeader,cookieValue,tokenHash} from '@/lib/google-auth';

export async function POST(request:Request){
  if(request.headers.get('origin')!==new URL(request.url).origin)return new Response('Invalid origin',{status:403});
  const token=cookieValue(request.headers.get('cookie'),'__Host-trybuddy_session');
  if(token&&/^[A-Za-z0-9_-]{43}$/.test(token))await database().prepare('DELETE FROM auth_sessions WHERE token_hash=?').bind(await tokenHash(token)).run();
  const response=Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  response.headers.set('Set-Cookie',clearSessionCookieHeader());
  return response;
}
