// アプリに組み込んだ AI（利用者は設定しなくても使える）
//  API キーはここには書かない。Cloudflare Worker（proxy/）が Modellix のキーを持って中継する
//  baseUrl：Worker を公開したときに表示される URL ＋ /v1（空のままなら内蔵AIは使われない）
export const BUILTIN_AI = {
  name: 'アプリ内蔵AI（Modellix）',
  baseUrl: '',
  model: 'deepseek/deepseek-v4-flash',
};
