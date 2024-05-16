// claspコマンド
// clasp deploy --deploymentId AKfycbwUXlMSrMh8JbJEDbwOnJGYLrz6AbiHp9iRt1-PIqae4_IHlx_8i-3-C8Sn2gPpzw3D9Q
// clasp push
// clasp pull

// 定数
const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';
const LINE_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');
var ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');
const SPREAD_SHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREAD_SHEET_ID');
const GROUP_ID = PropertiesService.getScriptProperties().getProperty('GROUP_ID');
const OPENAI_API_TOKEN = PropertiesService.getScriptProperties().getProperty('OPENAI_API');

function doPost(e) {
  // リクエストの内容をJSONオブジェクトにパース
  var json = JSON.parse(e.postData.contents);
  // スプレッドシートにログを記録する関数を呼び出す
  sendLineMessage(GROUP_ID, {
  type: 'text',
  text: "オウム返し：" + json.events[0].message.text,
});

  var text = requestGpt4Completion(json.events[0].message.text);
  sendLineMessage(GROUP_ID, {
  type: 'text',
  text: text,
});

}



function logMessageToSheet(json) {
  var ss = SpreadsheetApp.openById(SPREAD_SHEET_ID);
  var sheet = ss.getSheetByName('Messages'); // 'Messages'という名前のシートを使用
  if (!sheet) {
    sheet = ss.insertSheet('Messages');
    sheet.appendRow(['Date', 'GroupId', 'UserId', 'MessageType', 'Message']); // 列名を設定
  }
  var messages = json.events[0].message.text;
  var groupId = json.events[0].source.groupId;
  var userId = json.events[0].source.userId;
  var messageType = json.events[0].message.type;
  var date = new Date(json.events[0].timestamp);
  // メッセージ情報をシートに追加
  sheet.appendRow([date, groupId, userId, messageType, messages]);
}
