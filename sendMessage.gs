


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
      'Authorization': `Bearer ${LINE_TOKEN}`,
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

// 基本の送信の形式は以下のようになっている。
// sendLineMessage(GROUP_ID, {
//   type: 'text',
//   text: 'Hello, World!',
// });

