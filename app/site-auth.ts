import {headers} from 'next/headers';
import {userFromCookie,type SiteUser} from '@/lib/google-auth';

export async function getSiteUser():Promise<SiteUser|null>{
  const requestHeaders=await headers();
  return userFromCookie(requestHeaders.get('cookie'));
}
