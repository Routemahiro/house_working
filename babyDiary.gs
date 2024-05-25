

// var babyLog = loadBabyLog("ベビールーム");　で呼び出されるログが空白の場合、『今日はログがありませんでした』とsendLineMessageで送信
function createBabyDiary() {
    var babyData = loadBabyData(); // babyData.name babyData.birthDay mother_name father_name daysSinceBirth today でデータの呼び出し可能

    // spreadSheetNameからログを呼び出す
    var babyLogSheetName = getBabyLogSheetName();
    var babyLog = loadBabyLog(babyLogSheetName);
    var babyName = babyData.name;
    var babyBirthDay = babyData.birthDay;
    var babyMotherName = babyData.mother_name;
    var babyFatherName = babyData.father_name;
    var babyDaysSinceBirth = babyData.daysSinceBirth;
    var babyToday = babyData.today;
    var babyGroupId = getBabyGroupId();

    if (babyLog.length === 0) {
        sendLineMessage(babyGroupId, {
            type: 'text',
            text: "今日はなにもない日でした",
        });
    } else {
        var onedaySummary = requestGpt4Completion("あなたは以下に送付するログを元に、朝/昼/夜の枠組みごとに何があったかわかるように端的に要約してください。返答内容は要約した文章のみとしてください\n\n" + babyLog);
        var diary = requestGpt4Completion("以下の要約文と各種データを利用して、300文字前後の日記を文字装飾タグは利用せずに作成してください。\n\n" + onedaySummary + 
        "【各種データ】" + "今日の日付：" + babyToday + "\n" + "赤ちゃんの誕生日：" + babyBirthDay + "\n" + "産まれてからの日数：" + babyDaysSinceBirth + "\n" + "赤ちゃんの名前：" + babyName + "\n" + "母の名前：" + babyMotherName + "\n" + "父の名前：" + babyFatherName);
        sendLineMessage(babyGroupId, {
            type: 'text',
            text: babyName + "の日記：" + diary,
        });
    }
}

// 3日以上前のログは削除
function batchUpdateEntries(sheetName) {
    var spreadsheetId = getSpreadsheetId();
    var ss = SpreadsheetApp.openById(spreadsheetId);
    var sheet = ss.getSheetByName(sheetName);
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var filteredValues = [];
  
    // ヘッダー行を追加
    filteredValues.push(values[0]);
  
    // 必要なデータのみをフィルタリング
    for (var i = 1; i < values.length; i++) {
      var rowDate = new Date(values[i][0]);
      rowDate.setHours(0, 0, 0, 0);
      var timeDiff = today - rowDate;
      var daysDiff = timeDiff / (1000 * 3600 * 24);
  
      if (daysDiff <= 3) {
        filteredValues.push(values[i]);
      }
    }
  
    // シートの内容をクリア
    sheet.clear();
  
    // データを一気に書き込む
    sheet.getRange(1, 1, filteredValues.length, filteredValues[0].length).setValues(filteredValues);
  }

// 生成された日記は専用のシートに書き込み
// 画像の保存
// 日記から画像生成
