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

  const response = UrlFetchApp.fetch(LINE_API_URL, options);

  // エラーハンドリング
  if (response.getResponseCode() !== 200) {
    throw new Error(`Error sending message: ${response.getContentText()}`);
  }
}

function sendImageMessage(targetId, originalImageUrl, previewImageUrl) {
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

// 使用例
sendImageMessage(getLineGroupId(), 'https://riversun.github.io/img/riversun_256.png', 'https://riversun.github.io/img/riversun_144.png');

// 基本の送信の形式は以下のようになっている。
// sendLineMessage(GROUP_ID, {
//   type: 'text',
//   text: 'Hello, World!',
// });

