// ドキュメント：https://platform.openai.com/docs/api-reference/introduction

function requestGpt4Completion(inputText) {
  const timeoutMs = 60000;  // 例: 60秒
  // スクリプトプロパティに設定したOpenAIのAPIキーを取得
    
  // GPT-4のAPIのエンドポイントを設定
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  // GPT-4に投げるメッセージを定義（ユーザーロールの投稿文のみ）
  const messages = [{'role': 'user', 'content': inputText}];  
  
  // OpenAIのAPIリクエストに必要なヘッダー情報を設定
  const headers = {
    'Authorization':'Bearer ' + OPENAI_API_TOKEN,
    'Content-type': 'application/json'
  };
  
  // GPT-4のモデルやトークン上限、プロンプトをオプションに設定
  const options = {
    'muteHttpExceptions': true,
    'headers': headers, 
    'method': 'POST',
    'payload': JSON.stringify({
      'model': 'gpt-4o',
      'max_tokens': 2048,
      'temperature': 0.9,
      'messages': messages
    }),
    'timeoutMs': timeoutMs
  };
  
  // OpenAIのGPT-4にAPIリクエストを送り、結果を変数に格納
  const response = JSON.parse(UrlFetchApp.fetch(apiUrl, options).getContentText());
  
  // 応答がエラーであれば例外を投げる
  if (response.error) {
    throw new Error(response.error.message);
  }
  
  // GPT-4のAPIレスポンスからメッセージを取得して返す
  return response.choices[0].message.content;
}