import {database} from '@/lib/database';

export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store'};

export async function GET() {
  const checkedAt=new Date().toISOString();
  try {
    const result=await database().prepare('SELECT 1 AS ok').first<{ok:number}>();
    if(result?.ok!==1) throw new Error('database readiness check failed');
    return Response.json({status:'ok',checkedAt},{headers});
  } catch(error) {
    const errorId=crypto.randomUUID();
    console.error('Try Buddy health check failed',{errorId,message:error instanceof Error?error.message:'unknown error'});
    return Response.json({status:'unavailable',checkedAt,errorId},{status:503,headers});
  }
}
