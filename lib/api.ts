export class InputError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
const MAX_INPUT_BYTES = 8000;
export const privateHeaders = {'Cache-Control':'private, no-store', 'Vary':'Cookie'};
export function response(value: unknown, status = 200) { return Response.json(value,{status,headers:privateHeaders}); }
export async function readInput(request: Request): Promise<Record<string, unknown>> {
  if (request.headers.get('origin') !== new URL(request.url).origin) throw new InputError('このサイトの画面からもう一度お試しください。',403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new InputError('入力形式を確認してください。');
  const declaredLength=Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_INPUT_BYTES) throw new InputError('入力が長すぎます。',413);
  const reader=request.body?.getReader();
  const chunks:Uint8Array[]=[];
  let total=0;
  if(reader) {
    while(true) {
      const {done,value}=await reader.read();
      if(done) break;
      total+=value.byteLength;
      if(total>MAX_INPUT_BYTES) {
        await reader.cancel();
        throw new InputError('入力が長すぎます。',413);
      }
      chunks.push(value);
    }
  }
  const body=new Uint8Array(total);
  let offset=0;
  for(const chunk of chunks) { body.set(chunk,offset); offset+=chunk.byteLength; }
  const raw=new TextDecoder().decode(body);
  let value; try { value=JSON.parse(raw); } catch { throw new InputError('入力形式を確認してください。'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new InputError('入力を確認してください。');
  return value;
}
export function textInput(value: unknown, max: number, optional = false) {
  if (optional && (value === undefined || value === null)) return '';
  if (typeof value !== 'string' || value.trim().length > max || (!optional && !value.trim())) throw new InputError('入力内容と文字数を確認してください。');
  return value.trim();
}
export function apiError(error: unknown) {
  if (error instanceof InputError) return response({error:error.message},error.status);
  const errorId=crypto.randomUUID();
  console.error('Try Buddy storage request failed',{errorId,message:error instanceof Error ? error.message : 'unknown error'});
  return response({error:'保存先に接続できませんでした。入力はそのままで、時間をおいて再度お試しください。',errorId},503);
}
