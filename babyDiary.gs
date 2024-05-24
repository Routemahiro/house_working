// spreadSheetName = 'ベビールーム';
// babyData = loadBabyData(); // babyData.name babyData.birthDay mother_name father_name daysSinceBirth today でデータの呼び出し可能

// // spreadSheetNameからログを呼び出す
// var babyLog = loadBabyLog(spreadSheetName);
// var babyName = babyData.name;
// var babyBirthDay = babyData.birthDay
// var babyMotherName = babyData.mother_name;
// var babyFatherName = babyData.father_name;
// var babyDaysSinceBirth = babyData.daysSinceBirth;
// var babyToday = babyData.today;

// var onedaySummary = requestGpt4Completion("あなたは以下に送付するログを元に、朝/昼/夜の枠組みごとに何があったかわかるように端的に要約してください。返答内容は要約した文章のみとしてください\n\n" + babyLog);
// var diary = requestGpt4Completion("以下の要約文と各種データを利用して、300文字前後の日記を文字装飾タグは利用せずに作成してください。\n\n" + onedaySummary + 
// "【各種データ】" + "今日の日付：" + babyToday + "\n" + "赤ちゃんの誕生日：" + babyBirthDay + "\n" + "産まれてからの日数：" + babyDaysSinceBirth + "\n" + "赤ちゃんの名前：" + babyName + "\n" + "母の名前：" + babyMotherName + "\n" + "父の名前：" + babyFatherName);
// sendLineMessage(groupId, {
//   type: 'text',
//   // text: "赤ちゃんの名前:" + babyName + "\n" + "赤ちゃんの誕生日:" + babyBirthDay + "\n" + "赤ちゃんの母:" + babyMotherName + "\n" + "赤ちゃんの父:" + babyFatherName + "\n" + "本日の日付:" + babyToday + "\n" + "赤ちゃんの誕生日:" + babyDaysSinceBirth,
//   text: "要約を基にした日記：" + diary,
// });

// var babyLog = loadBabyLog("ベビールーム");　で呼び出されるログが空白の場合、『今日はログがありませんでした』とsendLineMessageで送信
function createBabyDiary() {
    var babyData = loadBabyData(); // babyData.name babyData.birthDay mother_name father_name daysSinceBirth today でデータの呼び出し可能

    // spreadSheetNameからログを呼び出す
    var babyLog = loadBabyLog("ベビールーム");
    var babyName = babyData.name;
    var babyBirthDay = babyData.birthDay;
    var babyMotherName = babyData.mother_name;
    var babyFatherName = babyData.father_name;
    var babyDaysSinceBirth = babyData.daysSinceBirth;
    var babyToday = babyData.today;

    if (babyLog.length === 0) {
        sendLineMessage(BABY_GROUP_ID, {
            type: 'text',
            text: "今日はなにもない日でした",
        });
    } else {
        var onedaySummary = requestGpt4Completion("あなたは以下に送付するログを元に、朝/昼/夜の枠組みごとに何があったかわかるように端的に要約してください。返答内容は要約した文章のみとしてください\n\n" + babyLog);
        var diary = requestGpt4Completion("以下の要約文と各種データを利用して、300文字前後の日記を文字装飾タグは利用せずに作成してください。\n\n" + onedaySummary + 
        "【各種データ】" + "今日の日付：" + babyToday + "\n" + "赤ちゃんの誕生日：" + babyBirthDay + "\n" + "産まれてからの日数：" + babyDaysSinceBirth + "\n" + "赤ちゃんの名前：" + babyName + "\n" + "母の名前：" + babyMotherName + "\n" + "父の名前：" + babyFatherName);
        sendLineMessage(BABY_GROUP_ID, {
            type: 'text',
            text: babyName + "の日記：" + diary,
        });
    }
}

