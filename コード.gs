// 定数
const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';
const LINE_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');
const GROUP_ID = PropertiesService.getScriptProperties().getProperty('GROUP_ID');

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

sendLineMessage(GROUP_ID, { type: 'text', text: 'Hello!' });

