// claspコマンド
// clasp deploy --deploymentId AKfycbwUXlMSrMh8JbJEDbwOnJGYLrz6AbiHp9iRt1-PIqae4_IHlx_8i-3-C8Sn2gPpzw3D9Q
// clasp push
// clasp pull

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var events = contents.events;
    var spreadSheetName = '';
    var userId, message, groupId, timestamp, messageType;
    var house_group_id = getHouseGroupId();
    var baby_group_id = getBabyGroupId();
    

    // eventから変数に各種データを代入
    events.forEach(function(event) {
      if (event.type === 'message') {
        userId = event.source.userId;
        message = event.message.text;
        groupId = event.source.groupId || house_group_id; // groupIdがundefinedの場合のデフォルト値を設定
        timestamp = new Date(event.timestamp);
        messageType = event.message.type;
      }
    });

    if (groupId === house_group_id) {
      spreadSheetName = 'お家ルーム';
      sendLineMessage(groupId, {
        // 家事ルーム
        type: 'text',
        text: "るーむ：お家ルーム",
      });

    } else if (groupId === baby_group_id) {
      // Babyルーム
      spreadSheetName = getBabyLogSheetName();

      logMessageToSheet(spreadSheetName, timestamp, userId, groupId, messageType, message);
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