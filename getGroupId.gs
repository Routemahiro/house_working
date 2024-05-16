

// function doPost(e) {
//   // ----- 送られてきた値をパース -----
//   var event = JSON.parse(e.postData.contents).events[0];

//   // 応答用Token
//   var replyToken = event.replyToken;

//   // typeを取得 
//   var type = event.source.type;

//   // typeを判定して、idを取得
//   if (type == 'user') {
//     var id = event.source.userId;
//   } else if (type == 'group') {
//     var id = event.source.groupId;
//   } else if (type == 'room') {
//     var id = event.source.roomId;
//   }

//   // ----- メッセージ送信用パラメータ設定 -----
//   var url = 'https://api.line.me/v2/bot/message/reply';

//   var payload = {
//     'replyToken': replyToken,
//     'messages': [
//       {
//         'type': 'text',
//         'text': type + '_id = '+ id
//       }
//     ]
//   };

//   var options = {
//     'method': 'post',
//     'headers': {
//       'Content-Type': 'application/json; charset=UTF-8',
//       'Authorization': 'Bearer ' + ACCESS_TOKEN,
//     },
//     'payload' : JSON.stringify(payload)
//   };

//   // ----- lineメッセージ送信 -----
//   UrlFetchApp.fetch(url, options)
// }
