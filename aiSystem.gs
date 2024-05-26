

function requestGpt4Completion(inputText) {
  const timeoutMs = 60000;  // 例: 60秒
  // スクリプトプロパティに設定したOpenAIのAPIキーを取得
    
  // GPT-4のAPIのエンドポイントを設定
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  // GPT-4に投げるメッセージを定義（ユーザーロールの投稿文のみ）
  const messages = [{'role': 'user', 'content': inputText}];  
  
  // OpenAIのAPIリクエストに必要なヘッダー情報を設定
  const headers = {
    'Authorization':'Bearer ' + getOpenAiApiToken(),
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



function requestImageGeneration(prompt, model = 'dall-e-3', imageSize = '1024x1024') {
  //   prompt (必須): 画像を生成するためのテキストプロンプト。この説明は画像の内容を決定します。
  // model (optional): 使用する画像生成モデル。デフォルトは 'dall-e-3' ですが、'dall-e-2' など他のモデルを指定することも可能です。
  // imageSize (optional): 生成する画像のサイズ。デフォルトは '1024x1024' ですが、'256x256', '512x512', '1792x1024', '1024x1792' など他のサイズを指定することもできます。
  // 戻り値
  // 成功時: 生成された画像のURLを返します。
  // 失敗時: null を返し、エラーメッセージがコンソールに出力されます。
  const apiUrl = 'https://api.openai.com/v1/images/generations';
  const headers = {
    'Authorization': 'Bearer ' + getOpenAiApiToken(),
    'Content-Type': 'application/json'
  };

  const payload = {
    'prompt': prompt,
    'n': 1,
    'size': imageSize,
    'model': model,
    'response_format': 'url',
    'quality': 'standard',
    'style': 'vivid'
  };

  const options = {
    'method': 'POST',
    'headers': headers,
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  try {
    const response = UrlFetchApp.fetch(apiUrl, options);
    const jsonResponse = JSON.parse(response.getContentText());
    
    if (jsonResponse.error) {
      console.error('Error generating image:', jsonResponse.error);
      return null;
    }
    Logger.log(jsonResponse.data[0].revised_prompt);
    return jsonResponse.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

function saveImageToGoogleDrive(imageUrl, fileName) {
  try {
    // 画像のURLからバイトデータを取得
    const response = UrlFetchApp.fetch(imageUrl);
    const blob = response.getBlob();

    // Googleドライブにファイルとして保存
    const folderId = getImageSaveFolderId();
    const folder = DriveApp.getFolderById(folderId);
    const createdFile = folder.createFile(blob.setName(fileName));

    // ファイルを公開してリンクを取得
    const publicUrl = makeFilePublic(createdFile.getId());

    return publicUrl; // 公開したファイルのURLを返す
  } catch (error) {
    console.error('Error saving image to Google Drive:', error);
    return null;
  }
}

function makeFilePublic(fileId) {
  try {
    var file = DriveApp.getFileById(fileId);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  } catch (error) {
    console.error('Error making file public:', error);
    return null;
  }
}

