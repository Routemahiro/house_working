// doPost関数を用意。まずは、Excelに書き込むだけの動作をテスト
const SPREAD_SHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREAD_SHEET_ID');

function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById(SPREAD_SHEET_ID);
    var sheet = ss.getSheetByName('LINEメッセージ');

    if (!sheet) {
      sheet = ss.insertSheet('LINEメッセージ');
      sheet.appendRow(['日付', 'ユーザーID', 'メッセージ']);
    }

    var contents = JSON.parse(e.postData.contents);
    var events = contents.events;

    events.forEach(function(event) {
      if (event.type === 'message') {
        var userId = event.source.userId;
        var message = event.message.text;
        var timestamp = new Date(event.timestamp);
        sheet.appendRow([timestamp, userId, message]);
      }
    });

    sendLineMessage(GROUP_ID, { type: 'text', text: '処理が成功しました。' });
  } catch (error) {
    // エラーメッセージをLINEに通知
    sendLineMessage(GROUP_ID, { type: 'text', text: `エラーが発生しました: ${error.message}` });
    // エラーをログに記録
    console.error(`エラーが発生しました: ${error.stack}`);
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}