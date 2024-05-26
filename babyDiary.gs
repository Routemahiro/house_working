

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
        var onedaySummary = requestGpt4Completion("あなたは以下に送付するログを元に、朝/昼/夜の枠組みごとにおおまかに何があったかわかるように端的に要約してください。返答内容は要約した文章のみとしてください\n\n" + babyLog);
        var diary = requestGpt4Completion("以下の要約文と各種データを利用して、140文字前後の日記を文字装飾タグは利用せずに作成してください。\n\n" + onedaySummary + 
        "【各種データ】" + "今日の日付：" + babyToday + "\n" + "赤ちゃんの誕生日：" + babyBirthDay + "\n" + "産まれてからの日数：" + babyDaysSinceBirth + "\n" + "赤ちゃんの名前：" + babyName + "\n" + "母の名前：" + babyMotherName + "\n" + "父の名前：" + babyFatherName);
        sendLineMessage(babyGroupId, {
            type: 'text',
            text: babyName + "の日記：\n" + diary,
        });
        diaryToSheet(babyToday,diary)

        return babyToday,diary
    }
}

// 3日以上前のログは削除。毎日一度実行
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

function createBabyDiaryWithImage() {
    var babyToday,diary = createBabyDiary(); //この段階で日記のテキスト送信される

    var imageUrl = requestImageGeneration(diary);
    const originalImageName = babyToday + "_original.png";
    const resizedImageName = babyToday + "_resized.png";

    var sendUrl = saveImageToGoogleDrive(imageUrl,originalImageName);
    var previewImageUrl = saveImageToGoogleDrive(imageUrl,resizedImageName);


    sendImageMessage(getBabyGroupId(), sendUrl, previewImageUrl);
}

// 生成された日記は専用のシートに書き込み OK

// 「日記から画像生成+画像の保存」
// createBabyDiaryで、今日の日と日記を返す
// 当日の天気と季節の作成
// diary変数と、当日の天気。季節。これらを利用して、requestImageGenerationにわたすプロンプトをAIに作成させる
// requestImageGenerationで画像の生成
// 生成された画像のりサイズ240*240し、Googleドライブに保存
// 日記をLINEに送信
// 保存した元画像とリサイズ画像のURLを利用して、LINEに画像送信
