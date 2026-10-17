# Try Buddy / Challenge Hub

募集の発見、挑戦記録、公開プロフィール、利用者間の交流を提供する Sites アプリです。Next.js/Vinext、Cloudflare Workers、D1 を使います。

## 開発

- Node.js 22.13 以上
- `npm run dev` でローカルプレビュー（通常は `http://127.0.0.1:5173`）
- `npm run build` で Worker をビルド
- `npm run db:generate` で D1 マイグレーションを生成

ローカルと本番の D1 は別です。新しいマイグレーションはローカルで順番に適用し、Sites への公開時に本番へ適用します。

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0014_optimal_mach_iv.sql
```

Google ログインの準備と既存アカウントの扱いは [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) を参照してください。認証情報は Sites の実行環境に保存し、リポジトリには入れません。
