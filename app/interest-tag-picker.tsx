"use client";

import {useEffect,useMemo,useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {tagGroups} from '@/lib/interest-tags';

type TagResponse={groups:Record<string,string[]>;custom:string[]};

export default function InterestTagPicker({value,onChange}:{value:string[];onChange:(tags:string[])=>void}){
  const [catalog,setCatalog]=useState<TagResponse>({groups:tagGroups as unknown as Record<string,string[]>,custom:[]});
  const [query,setQuery]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
  useEffect(()=>{let live=true;fetch('/api/tags',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('タグを読み込めませんでした。');return r.json() as Promise<TagResponse>;}).then(data=>{if(live&&data.groups&&data.custom)setCatalog(data);}).catch(()=>{});return()=>{live=false;};},[]);
  const all=useMemo(()=>[...new Set([...Object.values(catalog.groups).flat(),...catalog.custom,...value])],[catalog,value]);
  const matches=all.filter(tag=>tag.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const toggle=(tag:string)=>onChange(value.includes(tag)?value.filter(item=>item!==tag):value.length<20?[...value,tag]:value);
  const create=async()=>{
    setBusy(true);setError('');
    try{
      const result=await fetch('/api/tags',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:query})});
      const data=await result.json() as {name?:string;error?:string};
      if(!result.ok||!data.name)throw Error(data.error||'タグを作れませんでした。');
      setCatalog(current=>({...current,custom:[data.name!,...current.custom]}));
      if(!value.includes(data.name)&&value.length<20)onChange([...value,data.name]);
      setQuery('');
    }catch(cause){setError(cause instanceof Error?cause.message:'タグを作れませんでした。');}
    finally{setBusy(false);}
  };
  return <div className="interest-picker"><div className="interest-selected">{value.length?value.map(tag=><button type="button" key={tag} onClick={()=>toggle(tag)}>{tag} ×</button>):<span>選択したタグはありません</span>}</div><Input aria-label="興味のあるタグを検索・作成" value={query} onChange={event=>setQuery(event.target.value)} placeholder="タグを検索・新しく作る" maxLength={24}/><div className="interest-tag-results">{matches.map(tag=><button type="button" key={tag} aria-pressed={value.includes(tag)} disabled={!value.includes(tag)&&value.length>=20} onClick={()=>toggle(tag)}>{tag}</button>)}</div>{query.trim()&&!all.includes(query.trim())&&<Button type="button" variant="outline" disabled={busy||value.length>=20} onClick={()=>void create()}>「{query.trim()}」を新しいタグにする</Button>}<p className="interest-hint">最大20件。自作したタグはほかの人も選べます。選んだタグはプロフィールに公開されず、おすすめに使います。</p>{error&&<p role="alert" className="formerror">{error}</p>}</div>;
}
