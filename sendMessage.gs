// sendLineMessage関数
function sendLineMessage(targetId, message) {
  // パラメータバリデーション
  if (!targetId) throw new Error('Target ID is required');
  if (typeof message !== 'object' || message === null) {
    throw new Error('Message must be an object');
  }

  // メッセージのオブジェクトに基づいて送信する
  const options = {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${getLineToken()}`,
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify({
      to: targetId,
      messages: [message], // 配列にすることで様々なメッセージタイプに対応
    }),
  };
  var lineApiUrl = getLineApiUrl();
  const response = UrlFetchApp.fetch(lineApiUrl, options);

  // エラーハンドリング
  if (response.getResponseCode() !== 200) {
    throw new Error(`Error sending message: ${response.getContentText()}`);
  }
}

function sendImageMessage(targetId, originalImageUrl, previewImageUrl) {
  // 画像サイズはoriginalが1024*1024 10MB previewが240*240 1MB
  // パラメータバリデーション
  if (!targetId) throw new Error('Target ID is required');
  if (!originalImageUrl) throw new Error('Original image URL is required');
  if (!previewImageUrl) throw new Error('Preview image URL is required');

  // 画像メッセージオブジェクトの作成
  const imageMessage = {
    type: 'image',
    originalContentUrl: originalImageUrl,
    previewImageUrl: previewImageUrl
  };

  // 画像メッセージを送信する
  sendLineMessage(targetId, imageMessage);
}

function sendImageTest(){
  requestImageGeneration("electric cat")
  const targetId = getHouseGroupId();
  const imageUrl = 'https://drive.google.com/file/d/15AVefdwAWKdoUHmJmRQDX7OqSKrHkuDh/view?usp=sharing';
  // const previewImageUrl = 'https://drive.google.com/file/d/15AVefdwAWKdoUHmJmRQDX7OqSKrHkuDh/view?usp=sharing';
  const previewImageUrl = 'https://raw.githubusercontent.com/Routemahiro/house_working/main/12271810528_resized_240_0.png';
  sendImageMessage(targetId, imageUrl, previewImageUrl);
}
// 使用例
// sendImageMessage(getHouseGroupId(), 'https://raw.githubusercontent.com/Routemahiro/house_working/main/12271810528_resized_1024_0.png',
//  'https://raw.githubusercontent.com/Routemahiro/house_working/main/12271810528_resized_240_0.png');
