import type {Metadata} from 'next';
import Link from 'next/link';

export const metadata:Metadata={title:'プライバシーポリシー | Try Buddy',robots:{index:true,follow:true}};

export default function PrivacyPage(){
  return <main style={{maxWidth:760,margin:'0 auto',padding:'48px 24px 80px',lineHeight:1.85}}>
    <p><Link href="/">← Try Buddy に戻る</Link></p>
    <h1 style={{fontSize:32,margin:'28px 0'}}>プライバシーポリシー</h1>
    <p>Try Buddy は、募集の発見、保存、挑戦記録、プロフィール、利用者同士の交流を提供します。このページでは、これらの機能で扱う情報を説明します。</p>
    <h2 style={{marginTop:32}}>取得・保存する情報</h2>
    <p>Google ログイン時に、Google アカウントの識別子、メールアドレス、表示名を受け取ります。パスワードは受け取りません。サイト内では、利用者が入力したニックネーム、自己紹介、夢、学年、地域、興味分野、保存した募集、挑戦・参加記録、投稿、返信、リアクション、フォロー、メッセージなどを保存します。ログイン状態を維持するため、ブラウザーにセッション Cookie を設定します。</p>
    <h2 style={{marginTop:32}}>利用目的と公開範囲</h2>
    <p>情報は、ログイン状態の維持、記録の保存、条件に合う募集の表示、サイト内での交流、安全な運営に使用します。プロフィールの公開範囲は設定画面で選べます。夢・学年・地域も個別に公開と非公開を選択できます。公開を選んだ情報、共有された挑戦、投稿、返信などは他の利用者に表示されます。自分用のメモは公開されません。</p>
    <h2 style={{marginTop:32}}>外部サービス</h2>
    <p>ログインには Google の認証サービスを使用します。募集や記事の外部リンクを開いた後は、移動先のサービスが独自に情報を扱います。</p>
    <h2 style={{marginTop:32}}>削除とお問い合わせ</h2>
    <p>サイト内のプロフィール・設定から、Try Buddy に登録したプロフィールと記録を削除できます。Google アカウント自体は削除されません。情報の取扱いについては <a href="mailto:itojp.harbor@gmail.com">itojp.harbor@gmail.com</a> にお問い合わせください。</p>
    <p style={{marginTop:32,color:'#687060'}}>2026年10月11日制定</p>
  </main>;
}
