# Google ログインの設定

Google Cloud でこのサイト用の OAuth 同意画面と「ウェブ アプリケーション」の OAuth クライアントを作成する。承認済みのリダイレクト URI には、次を正確に登録する。

`https://challngehub.jp/auth/google/callback`

サイトの Sites 実行環境に以下を設定し、サイトの新しい版をデプロイする。クライアントシークレットは Secret として保存し、Git や `.openai/hosting.json` に入れない。

| 変数 | 値 |
| --- | --- |
| `GOOGLE_CLIENT_ID` | 作成した OAuth クライアント ID |
| `GOOGLE_CLIENT_SECRET` | 作成した OAuth クライアントシークレット（Secret） |
| `AUTH_ORIGIN` | `https://challngehub.jp` |

認証情報が未設定のとき `/auth/google/start` は 503 を返す。公開サイトを切り替える前に、Google でログイン、プロフィール作成、再訪、ログアウト、再ログインを確認する。OAuth 同意画面がテスト状態なら、一般ユーザーがログインできる公開状態への変更も必要。

旧 ChatGPT ログイン中のブラウザーで初めて Google ログインを開始した場合は、従来の記録の利用者 ID に Google アカウントを紐付ける。ログイン状態が確認できない旧記録は自動でメール照合せず、DB に残す。照合が必要な場合は本人確認を伴う個別の移行手順を用意する。
