// この関数は、与えられた日付に基づいて、その日がどの種類のゴミの収集日であるかを判断します。
// - 燃焼ゴミは毎週月曜日と木曜日に収集されます。
// - 有害危険ゴミと小型複雑ゴミは毎月第1金曜日に収集されます。
// - 資源ゴミは毎月第2金曜日と第4金曜日に収集されます。
// - 大型複雑ゴミは毎月第3金曜日に収集されます。
// これらの条件に合致しない場合は、ゴミの収集がないことを示すメッセージを返します。

// // 使用例
// const today = new Date();
// console.log(calculateGarbageDay(today));
function calculateGarbageDay(date) {
    const dayOfWeek = date.getDay();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOffset = (5 - firstDayOfMonth.getDay() + 7) % 7;
    const firstFriday = 1 + dayOffset;
    const weekOfMonth = Math.ceil((date.getDate() - firstFriday + 1) / 7);

    switch (dayOfWeek) {
        case 1: // 月曜日
        case 4: // 木曜日
            return '燃えるゴミ';
        case 5: // 金曜日
            if (weekOfMonth === 1) {
                return '有害危険ゴミと小型複雑ゴミ';
            } else if (weekOfMonth === 2 || weekOfMonth === 4) {
                return '資源ゴミ';
            } else if (weekOfMonth === 3) {
                return '大型複雑ゴミ';
            }
            break;
    }
    return '今日はゴミ捨て日ではありません';
}

function checkAndNotifyGarbageDay() {
    const today = new Date();
    const garbageType = calculateGarbageDay(today);

    if (garbageType !== '今日はゴミ捨て日ではありません') {
        sendLineMessage(HOUSE_GROUP_ID, {
            type: 'text',
            text: `${garbageType}の日です。ゴミを出してください。`
        });
    }
}

function checkAndNotifyGarbageDayReminder() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // 明日の日付を取得
    const garbageType = calculateGarbageDay(tomorrow);

    let detail;
    switch (garbageType) {
        case '有害危険ゴミと小型複雑ゴミ':
            detail = '\n================\n【有害危険ゴミの概要】\n電池や蛍光灯、ガスボンベやライター。ハサミや包丁などが含まれるよ\n' + 
            "【小型複雑ゴミの概要】\n鍋ややかん、白熱電球。植木鉢やハンガー。電気製品などが含まれるよ";
            break;
        case '資源ゴミ':
            detail = '\n================\n【資源ゴミの概要】\n新聞や古布類。紙類、段ボール。カン・ビンが主だよ';
            break;
        case '大型複雑ゴミ':
            detail = '\n================\n【大型複雑ゴミの概要】\nタンスや布団。その他、1辺が60cmを超えるものが主になるよ。\n出すときは「不用品」という貼り紙をしましょうね';
            break;
    }

    if (garbageType !== '今日はゴミ捨て日ではありません') {
        sendLineMessage(HOUSE_GROUP_ID, {
            type: 'text',
            text: `${garbageType}の前日です。ゴミ捨て準備を行いましょう。${detail}`
        }
        );
        sendImageMessage(getHouseGroupId(), 'https://raw.githubusercontent.com/Routemahiro/house_working/main/12271810528_resized_1024_0.png',
 'https://raw.githubusercontent.com/Routemahiro/house_working/main/12271810528_resized_240_0.png');
    }
}
