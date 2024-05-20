// claspコマンド
// clasp deploy --deploymentId AKfycbwUXlMSrMh8JbJEDbwOnJGYLrz6AbiHp9iRt1-PIqae4_IHlx_8i-3-C8Sn2gPpzw3D9Q
// clasp push
// clasp pull

// 定数
const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';
const LINE_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');
var ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');
const SPREAD_SHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREAD_SHEET_ID');
const HOUSE_GROUP_ID = PropertiesService.getScriptProperties().getProperty('HOUSE_GROUP_ID');
// テスト用グループID
// const HOUSE_GROUP_ID = PropertiesService.getScriptProperties().getProperty('HOUSE_GROUP_ID_TEST');

const BABY_GROUP_ID = PropertiesService.getScriptProperties().getProperty('BABY_GROUP_ID');

const OPENAI_API_TOKEN = PropertiesService.getScriptProperties().getProperty('OPENAI_API');

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var events = contents.events;

    var userId, message, groupId, timestamp, messageType;
    events.forEach(function(event) {
      if (event.type === 'message') {
        userId = event.source.userId;
        message = event.message.text;
        groupId = event.source.groupId || HOUSE_GROUP_ID; // groupIdがundefinedの場合のデフォルト値を設定
        timestamp = new Date(event.timestamp);
        messageType = event.message.type;
      }
    });

    if (groupId === HOUSE_GROUP_ID) {
      sendLineMessage(groupId, {
        // 家事ルーム
        type: 'text',
        text: "るーむ：お家ルーム",
      });
    } else if (groupId === BABY_GROUP_ID) {
      // Babyルーム
      sendLineMessage(groupId, {
        type: 'text',
        text: "るーむ：ベビールーム",
      });
    } else {
      sendLineMessage(groupId, {
        type: 'text',
        text: "エラーです。Apps ScriptにグループIDの設定を忘れていませんか？",
      });
    }  
  }
  catch (error) {
    console.error(error);
  }
}

// function doPost(e) {
  
//   try {
//     var contents = JSON.parse(e.postData.contents);
//     var events = contents.events;

//     var userId, message, HOUSE_GROUP_ID, timestamp, messageType;


    
//     events.forEach(function(event) {
//       if (event.type === 'message') {
//         userId = event.source.userId;
//         message = event.message.text;
//         HOUSE_GROUP_ID = event.source.groupId;  
//         timestamp = new Date(event.timestamp);
//         messageType = event.message.type;
//       }
//     });

//     logMessageToSheet(timestamp,userId, HOUSE_GROUP_ID, messageType, message);
//     // リクエストの内容をJSONオブジェクトにパース
//     // スプレッドシートにログを記録する関数を呼び出す
//     sendLineMessage(HOUSE_GROUP_ID, {
//       type: 'text',
//       text: "メッセージタイプ：" + messageType,
//     });

//     var toAi = "以下の「」内のメッセージに対する返答を行ってください。返答の際には、語尾ににゃーと付けてください\n「" + message + "」";
//     var text = requestGpt4Completion(toAi);
//     sendLineMessage(HOUSE_GROUP_ID, {
//       type: 'text',
//       text: text,
//     });
//   } catch (error) {
//     // エラー内容をLINEで送信し、コンソールにもログを出力
//     const errorMessage = "エラーが発生しました: " + error.message;
//     console.error(errorMessage);
//     sendLineMessage(HOUSE_GROUP_ID, {
//       type: 'text',
//       text: errorMessage,
//     });    
//   }
// }

// function logMessageToSheet(timestamp, userId, groupId, messageType, message) {
//   var ss = SpreadsheetApp.openById(SPREAD_SHEET_ID);
//   var sheet = ss.getSheetByName('Messages'); // 'Messages'という名前のシートを使用
//   if (!sheet) {
//     sheet = ss.insertSheet('Messages');
//     sheet.appendRow(['Date', 'GroupId', 'UserId', 'MessageType', 'Message']); // 列名を設定
//   }
  
//   if (messageType === 'text') {
//     sheet.appendRow([timestamp, groupId, userId, messageType, message]);
//   }
// }



//＝＝＝＝＝ 以下、参考のために置いておくコード。少なくともこのときは、ログをシートに反映ということが出来ていたので＝＝＝＝＝＝＝＝＝＝＝＝
// function doPost(e) {
//   try {
//     var ss = SpreadsheetApp.openById(SPREAD_SHEET_ID);
//     var sheet = ss.getSheetByName('LINEメッセージ');

//     if (!sheet) {
//       sheet = ss.insertSheet('LINEメッセージ');
//       sheet.appendRow(['日付', 'ユーザーID', 'グループID', 'メッセージ']);
//     }

//     var contents = JSON.parse(e.postData.contents);
//     var events = contents.events;

//     events.forEach(function(event) {
//       if (event.type === 'message') {
//         var userId = event.source.userId;
//         var message = event.message.text;
//         var HOUSE_GROUP_ID = event.source.groupId;  
//         var timestamp = new Date(event.timestamp);
//         sheet.appendRow([timestamp, userId, HOUSE_GROUP_ID, message]);
//       }
//     });

//     sendLineMessage(HOUSE_GROUP_ID, { type: 'text', text: '処理が成功しました。' });
//   } catch (error) {
//     // エラーメッセージをLINEに通知
//     sendLineMessage(HOUSE_GROUP_ID, { type: 'text', text: `エラーが発生しました: ${error.message}` });
//     // エラーをログに記録
//     console.error(`エラーが発生しました: ${error.stack}`);
//     return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.message })).setMimeType(ContentService.MimeType.JSON);
//   }
// }