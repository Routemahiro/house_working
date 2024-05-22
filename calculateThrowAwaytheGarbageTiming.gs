// この関数は、与えられた日付に基づいて、その日がどの種類のゴミの収集日であるかを判断します。
// - 燃焼ゴミは毎週月曜日と木曜日に収集されます。
// - 有害危険ゴミと小型複雑ゴミは毎月第1金曜日に収集されます。
// - 資源ごみは毎月第2金曜日と第4金曜日に収集されます。
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
                return '資源ごみ';
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

    if (garbageType !== '今日はゴミ捨て日ではありません') {
        sendLineMessage(HOUSE_GROUP_ID, {
            type: 'text',
            text: `${garbageType}の前日です。ゴミ捨て準備を行いましょう。`
        });
    }
}
