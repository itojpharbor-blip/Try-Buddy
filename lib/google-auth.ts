import {env} from 'cloudflare:workers';
import {database} from '@/lib/database';

const sessionCookie='__Host-trybuddy_session';
const stateCookie='__Host-trybuddy_oauth';
const maxSessionAge=60*60*24*30;
const maxFlowAge=60*10;
const encoder=new TextEncoder();

export type SiteUser={userId:string;displayName:string;email:string;fullName:string|null};
type GoogleConfig={clientId:string;clientSecret:string;origin:string};

export function config():GoogleConfig|null {
  const values=env as unknown as Record<string,string|undefined>;
  const clientId=values.GOOGLE_CLIENT_ID?.trim();
  const clientSecret=values.GOOGLE_CLIENT_SECRET?.trim();
  const origin=values.AUTH_ORIGIN?.trim();
  if(!clientId||!clientSecret||!origin)return null;
  try {const url=new URL(origin);if(url.protocol!=='https:'||url.pathname!=='/'||url.search||url.hash)return null;}
  catch{return null;}
  return {clientId,clientSecret,origin:origin.replace(/\/$/,'')};
}

export function randomToken(){const bytes=crypto.getRandomValues(new Uint8Array(32));return base64url(bytes);}
export async function tokenHash(value:string){return base64url(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value))));}
export function base64url(bytes:Uint8Array){return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function fromBase64url(value:string){const binary=atob(value.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(value.length/4)*4,'='));return Uint8Array.from(binary,c=>c.charCodeAt(0));}
export function cookieValue(cookieHeader:string|null,name:string){return cookieHeader?.split(';').map(v=>v.trim()).find(v=>v.startsWith(name+'='))?.slice(name.length+1)??null;}
export function sessionCookieHeader(token:string){return `${sessionCookie}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxSessionAge}`;}
export function clearSessionCookieHeader(){return `${sessionCookie}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;}
export function stateCookieHeader(token:string){return `${stateCookie}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxFlowAge}`;}
export function clearStateCookieHeader(){return `${stateCookie}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;}
export function getStateCookie(request:Request){return cookieValue(request.headers.get('cookie'),stateCookie);}
export function safeReturnTo(input:string|null){
  if(!input||!input.startsWith('/')||input.startsWith('//')||input.includes('\\'))return '/';
  try {const url=new URL(input,'https://app.local');if(url.origin!=='https://app.local'||url.pathname.startsWith('/auth/'))return '/';return url.pathname+url.search+url.hash;}
  catch{return '/';}
}

export async function userFromCookie(cookieHeader:string|null):Promise<SiteUser|null>{
  const token=cookieValue(cookieHeader,sessionCookie);
  if(!token||!/^[A-Za-z0-9_-]{43}$/.test(token))return null;
  const hash=await tokenHash(token);
  const row=await database().prepare('SELECT owner_id,email,full_name FROM auth_sessions WHERE token_hash=? AND expires_at>?').bind(hash,Math.floor(Date.now()/1000)).first<{owner_id:string;email:string;full_name:string|null}>();
  return row?{userId:row.owner_id,email:row.email,fullName:row.full_name,displayName:row.full_name||row.email}:null;
}

type GoogleClaims={sub:string;email:string;email_verified:boolean;name?:string;iss:string;aud:string;exp:number;iat:number;nonce:string};
export async function verifyGoogleIdToken(token:string,expectedClientId:string,expectedNonce:string):Promise<GoogleClaims>{
  const parts=token.split('.');if(parts.length!==3)throw Error('Invalid ID token');
  const header=JSON.parse(new TextDecoder().decode(fromBase64url(parts[0]))) as {alg?:string;kid?:string};
  if(header.alg!=='RS256'||!header.kid)throw Error('Unsupported ID token');
  const response=await fetch('https://www.googleapis.com/oauth2/v3/certs',{headers:{Accept:'application/json'}});
  if(!response.ok)throw Error('Google keys unavailable');
  const keys=await response.json() as {keys:Array<JsonWebKey&{kid?:string}>};
  const keyData=keys.keys.find(key=>key.kid===header.kid&&key.kty==='RSA'&&key.alg==='RS256'&&key.use==='sig');
  if(!keyData)throw Error('Unknown Google signing key');
  const key=await crypto.subtle.importKey('jwk',keyData,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  const valid=await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,fromBase64url(parts[2]),encoder.encode(parts[0]+'.'+parts[1]));
  if(!valid)throw Error('Invalid ID token signature');
  const claims=JSON.parse(new TextDecoder().decode(fromBase64url(parts[1]))) as GoogleClaims;
  const now=Math.floor(Date.now()/1000);
  if(!claims.sub||!claims.email||claims.email_verified!==true||!['https://accounts.google.com','accounts.google.com'].includes(claims.iss)||claims.aud!==expectedClientId||claims.nonce!==expectedNonce||!Number.isFinite(claims.exp)||claims.exp<=now||!Number.isFinite(claims.iat)||claims.iat>now+60)throw Error('Invalid ID token claims');
  return claims;
}
