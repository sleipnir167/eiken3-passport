# AI 中継サーバー（Cloudflare Worker）

アプリの「アプリ内蔵AI」は、この Worker を通して Modellix の LLM を呼びます。

- Modellix の API はブラウザから直接呼べない（CORS 非対応）ため、この Worker が中継して CORS をつけます
- **API キーは Cloudflare の Secret にだけ保存**し、アプリのコードや GitHub には入れません
- 使いすぎ・悪用の対策
  - 許可したサイト（`ALLOWED_ORIGINS`）からの呼び出しだけを受け付ける
  - モデルを `ALLOWED_MODELS` に固定し、出力トークン数を `MAX_TOKENS` までに制限する
  - 1回に送れる文字数を制限する
  - IP ごとに1分あたり12回までに制限する

## 公開のしかた（最初の1回）

```bash
cd proxy
npx wrangler@latest login
npx wrangler@latest deploy
npx wrangler@latest secret put MODELLIX_API_KEY --name eiken3-ai
```

1. `login`：ブラウザが開くので Cloudflare にログインして許可する
2. `deploy`：最後に `https://eiken3-ai.＜あなたのサブドメイン＞.workers.dev` が表示される。初めてのときは workers.dev のサブドメイン名を決める質問が出る
3. `secret put`：Modellix の API キーを貼りつけて Enter（画面には表示されない）

表示された URL の末尾に `/v1` をつけて、`js/config.js` の `baseUrl` に書きます。

## 設定を変えるとき

`wrangler.toml` の `[vars]` を書き換えて `npx wrangler@latest deploy` を実行します。

| 項目 | 内容 |
|---|---|
| `ALLOWED_ORIGINS` | 受け付けるサイト（カンマ区切り） |
| `ALLOWED_MODELS` | 使ってよいモデル（カンマ区切り・先頭から順に試す）。いまは無料の `modellix-ai/free-llm`。使えるモデル名は `https://eiken3-ai.sleipnir167.workers.dev/v1/models?all=1`（アプリのサイトから）で確認できる |
| `RETRIES` | 失敗・中身のない返答のとき、同じモデルでやり直す回数 |
| `MAX_TOKENS` | 1回の出力トークンの上限 |

キーを変えるときは `npx wrangler@latest secret put MODELLIX_API_KEY --name eiken3-ai` をもう一度実行します（キーの入力を求められるので、ターミナル画面に直接入力する）。
回数制限（`[[ratelimits]]`）で deploy がエラーになる場合は、`wrangler.toml` のその部分を削除してください（Worker は制限なしでも動きます）。
