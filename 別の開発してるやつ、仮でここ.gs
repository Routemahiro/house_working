var scriptProperties = PropertiesService.getScriptProperties();
function sendLineNotify(message, gemType) {
    var emojiMap = {
        'Efficiency': '🟡',
        'Luck': '🔵',
        'Comfort': '🔴',
        'Resilience': '🟣'
    };
    var emoji = emojiMap[gemType] || ''; // ジェムの種類に対応する絵文字を取得、対応するものがなければ空文字

    // メッセージの先頭に絵文字を追加
    message = `\n${emoji} ${message}`;

    var token = PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');
    var options = {
      method: "post",
      headers: {
        "Authorization" : "Bearer " + token
      },
      payload: {
        "message" : message
      }
    };

    var counter = parseInt(scriptProperties.getProperty('counter')) || 0;
    var startTime = parseInt(scriptProperties.getProperty('startTime')) || 0;
    var now = new Date().getTime();
    
    if (now - startTime > 30000) {
      startTime = now;
      counter = 0;
      scriptProperties.setProperty('startTime', startTime.toString());
      scriptProperties.setProperty('counter', '0');
    }
  
    if (counter < 4) {
      UrlFetchApp.fetch('https://notify-api.line.me/api/notify', options);
      scriptProperties.setProperty('counter', (counter+1).toString());
    } else {
      Utilities.sleep(30000);
      scriptProperties.setProperty('counter', '0');
      scriptProperties.setProperty('startTime', '');
    }
}

function main() {
    var spreadsheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    var ss = SpreadsheetApp.openById(spreadsheetId);
    var gemPriceSheet = ss.getSheetByName('ジェム価格通知');

    for (var row = 3; row <= 5; row++) {
        var gmt = gemPriceSheet.getRange('F' + row).getValue();
        var kindsGem = gemPriceSheet.getRange('D' + row).getValue();
        var lv = gemPriceSheet.getRange('E' + row).getValue();
        if (isNaN(gmt)) {
            continue;
        }
        var url = gemPriceSheet.getRange('I' + row).getValue();
        if (url) {
            var response = UrlFetchApp.fetch(url);
            var data = JSON.parse(response.getContentText()).data;
            var minSellPrice = data.reduce((min, item) => Math.min(min, item.sellPrice / 100), Infinity);

            if (minSellPrice < gmt) {
                sendLineNotify(`${kindsGem}ジェム${lv}の最安価格: ${minSellPrice} GMT\n希望価格：${gmt} GMT`, kindsGem);
            }
        }
        Utilities.sleep(3000); // 0.3秒待機
    }
}