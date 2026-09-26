// アプリに組み込んだ AI（利用者は設定しなくても使える）
//  API キーはここには書かない。Cloudflare Worker（proxy/）が Modellix のキーを持って中継する
//  baseUrl：Worker を公開したときに表示される URL ＋ /v1（空のままなら内蔵AIは使われない）
export const BUILTIN_AI = {
  name: 'アプリ内蔵AI（Modellix 無料）',
  baseUrl: 'https://eiken3-ai.sleipnir167.workers.dev/v1',
  model: 'modellix-ai/free-llm',
};
