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
const BABY_GROUP_ID = PropertiesService.getScriptProperties().getProperty('BABY_GROUP_ID');
// テスト用グループID
// const HOUSE_GROUP_ID = PropertiesService.getScriptProperties().getProperty('HOUSE_GROUP_ID_TEST');


const OPENAI_API_TOKEN = PropertiesService.getScriptProperties().getProperty('OPENAI_API');


function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var events = contents.events;
    var spreadSheetName = '';
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
      spreadSheetName = 'お家ルーム';
      sendLineMessage(groupId, {
        // 家事ルーム
        type: 'text',
        text: "るーむ：お家ルーム",
      });

    } else if (groupId === BABY_GROUP_ID) {
      // Babyルーム
      spreadSheetName = 'ベビールーム';
      babyData = loadBabyData(); // babyData.name babyData.birthDay mother_name father_name daysSinceBirth today でデータの呼び出し可能

      // spreadSheetNameからログを呼び出す
      var babyLog = loadBabyLog(spreadSheetName);
      var babyName = babyData.name;
      var babyBirthDay = babyData.birthDay
      var babyMotherName = babyData.mother_name;
      var babyFatherName = babyData.father_name;
      var babyDaysSinceBirth = babyData.daysSinceBirth;
      var babyToday = babyData.today;

      var onedaySummary = requestGpt4Completion("あなたは以下に送付するログを元に、朝/昼/夜の枠組みごとに何があったかわかるように端的に要約してください。返答内容は要約した文章のみとしてください\n\n" + babyLog);
      var diary = requestGpt4Completion("以下の要約文を利用して、300文字前後の日記を作成してください。この日記は父母が見ます。赤ちゃんの成長を観察するのに適した内容にするとともに、父母が見て気持ちが明るくなるようにしてください。また、要約文から授乳/排泄/睡眠に難がある可能性が見受けられた場合は、その旨の注釈を日記の最後に入れてください\n\n" + onedaySummary);
      sendLineMessage(groupId, {
        type: 'text',
        // text: "赤ちゃんの名前:" + babyName + "\n" + "赤ちゃんの誕生日:" + babyBirthDay + "\n" + "赤ちゃんの母:" + babyMotherName + "\n" + "赤ちゃんの父:" + babyFatherName + "\n" + "本日の日付:" + babyToday + "\n" + "赤ちゃんの誕生日:" + babyDaysSinceBirth,
        text: "要約を基にした日記：" + diary,
      });
      // logMessageToSheet(spreadSheetName, timestamp, userId, groupId, messageType, message);
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