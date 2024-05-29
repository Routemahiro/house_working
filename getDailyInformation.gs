function sendWeatherInformation() {

    var spreadsheetId = getSpreadsheetId();
    var ss = SpreadsheetApp.openById(spreadsheetId);
    var sheet = ss.getSheetByName('babyData');
    var latitude = sheet.getRange('B5').getValue();
    var longitude = sheet.getRange('B6').getValue();
    const houseGroupId = getHouseGroupId();
    // latitudeとlongitudeの両方に整数が入っている場合、次に進む。そうでない場合、関数を終了
    if (isNaN(latitude) || isNaN(longitude)) {
        return;
    }

    const forecast = weatherData(latitude,longitude,0);

    sendLineMessage(houseGroupId, {
        type: 'text',
        text: `${forecast}`
    });
}

// function weatherData(latitude, longitude, dayOffset) {
//     const baseUrl = 'https://api.open-meteo.com/v1/forecast';
//     const params = {
//         latitude: latitude,
//         longitude: longitude,
//         daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_hours,precipitation_probability_max,wind_speed_10m_max',
//         timezone: 'Asia/Tokyo'
//     };
//     const url = `${baseUrl}?latitude=${params.latitude}&longitude=${params.longitude}&daily=${params.daily}&timezone=${params.timezone}`;

//     const response = UrlFetchApp.fetch(url);
//     const data = JSON.parse(response.getContentText());

//     const dailyData = data.daily;
//     const index = dayOffset; // dayOffsetを使用して特定の日のデータを取得

//     // 天気コードを日本語の天気に変換するマッピング
//     const weatherCodeMap = {
//         0: "快晴",
//         1: "主に晴れ",
//         2: "一部曇り",
//         3: "曇り",
//         45: "霧",
//         48: "霧氷",
//         51: "霧雨（弱い）",
//         53: "霧雨（中程度）",
//         55: "霧雨（強い）",
//         56: "氷雨（弱い）",
//         57: "氷雨（強い）",
//         61: "雨（弱い）",
//         63: "雨（中程度）",
//         65: "雨（強い）",
//         66: "氷雨（弱い）",
//         67: "氷雨（強い）",
//         71: "降雪（弱い）",
//         73: "降雪（中程度）",
//         75: "降雪（強い）",
//         77: "氷の粒",
//         80: "にわか雨（弱い）",
//         81: "にわか雨（中程度）",
//         82: "にわか雨（激しい）",
//         85: "にわか雪（弱い）",
//         86: "にわか雪（強い）",
//         95: "雷雨（弱い）",
//         96: "雷雨（ひょうを伴う、弱い）",
//         99: "雷雨（ひょうを伴う、強い）"
//     };

//     // ISO 8601形式の文字列から時間部分を抽出する関数
//     function extractTime(isoString) {
//         return isoString.split('T')[1];
//     }

//     // 天気コードを日本語の天気に変換
//     const weatherDescription = weatherCodeMap[dailyData.weather_code[index]] || "不明";

//     const forecastText = `
// 天気コード: ${weatherDescription}
// 最高気温: ${dailyData.temperature_2m_max[index]}°C
// 最低気温: ${dailyData.temperature_2m_min[index]}°C
// 日の出: ${extractTime(dailyData.sunrise[index])}
// 日の入り: ${extractTime(dailyData.sunset[index])}
// 最大UV指数: ${dailyData.uv_index_max[index]}
// 最大UV指数（晴天時）: ${dailyData.uv_index_clear_sky_max[index]}
// 降水時間: ${dailyData.precipitation_hours[index]}時間
// 最大降水確率: ${dailyData.precipitation_probability_max[index]}%
// 最大風速: ${dailyData.wind_speed_10m_max[index]} km/h
//     `;

//     return forecastText.trim();
// }

function weatherData(latitude, longitude, dayOffset) {
    const baseUrl = 'https://api.open-meteo.com/v1/forecast';
    const params = {
        latitude: latitude,
        longitude: longitude,
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_hours,precipitation_probability_max,wind_speed_10m_max',
        timezone: 'Asia/Tokyo'
    };
    const url = `${baseUrl}?latitude=${params.latitude}&longitude=${params.longitude}&daily=${params.daily}&timezone=${params.timezone}`;

    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());

    const dailyData = data.daily;
    const index = dayOffset; // dayOffsetを使用して特定の日のデータを取得

    // 天気コードを日本語の天気に変換するマッピング
    const weatherCodeMap = {
        0: "快晴",
        1: "主に晴れ",
        2: "一部曇り",
        3: "曇り",
        45: "霧",
        48: "霧氷",
        51: "霧雨（弱い）",
        53: "霧雨（中程度）",
        55: "霧雨（強い）",
        56: "氷雨（弱い）",
        57: "氷雨（強い）",
        61: "雨（弱い）",
        63: "雨（中程度）",
        65: "雨（強い）",
        66: "氷雨（弱い）",
        67: "氷雨（強い）",
        71: "降雪（弱い）",
        73: "降雪（中程度）",
        75: "降雪（強い）",
        77: "氷の粒",
        80: "にわか雨（弱い）",
        81: "にわか雨（中程度）",
        82: "にわか雨（激しい）",
        85: "にわか雪（弱い）",
        86: "にわか雪（強い）",
        95: "雷雨（弱い）",
        96: "雷雨（ひょうを伴う、弱い）",
        99: "雷雨（ひょうを伴う、強い）"
    };

    // ISO 8601形式の文字列から時間部分を抽出する関数
    function extractTime(isoString) {
        return isoString.split('T')[1];
    }

    // UV指数に基づいてメッセージを返す関数
    function getUvIndexMessage(uvIndex) {
        if (uvIndex >= 11) {
            return "【極端に強い】\n恐れ入りますが、暑さで地球は滅亡します";
        } else if (uvIndex >= 8) {
            return "【非常に強い】\n日中の外出は出来るだけ控えよう\n外に出るときは日焼け止め塗ろうね";
        } else if (uvIndex >= 6) {
            return "【強い】\n日中は出来るだけ日陰を利用しよう\n日焼け止め塗ろうね";
        } else if (uvIndex >= 3) {
            return "【中程度】\n日中は出来るだけ日陰を利用しよう";
        } else {
            return "【弱い】\n余裕。安心して外で過ごせます";
        }
    }

    // 天気コードを日本語の天気に変換
    const weatherDescription = weatherCodeMap[dailyData.weather_code[index]] || "不明";

    // UV指数メッセージを取得
    const uvIndexMessage = getUvIndexMessage(dailyData.uv_index_max[index]);

    // 日付をフォーマットする関数
    function formatDate(isoString) {
        const date = new Date(isoString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}月${day}日`;
    }

    // 日付を取得
    const date = formatDate(dailyData.time[index]);

// 
    const forecastText = `
【${date}】
天気コード: ${weatherDescription}
最高気温: ${dailyData.temperature_2m_max[index]}°C
最低気温: ${dailyData.temperature_2m_min[index]}°C
最大UV指数: ${uvIndexMessage}
最大降水確率: ${dailyData.precipitation_probability_max[index]}%
    `;

    return forecastText.trim();
}

function testWeatherData() {
    const testLatitude = 34.75789393;
    const testLongitude = 135.52940582;
    const testDayOffset = 0; // 今日の天気をテスト

    const forecast = weatherData(testLatitude, testLongitude, testDayOffset);
    Logger.log(forecast);
}

// const forecastText = `
// // 【${date}】
// // 天気コード: ${weatherDescription}
// // 最高気温: ${dailyData.temperature_2m_max[index]}°C
// // 最低気温: ${dailyData.temperature_2m_min[index]}°C
// // 日の出: ${extractTime(dailyData.sunrise[index])}
// // 日の入り: ${extractTime(dailyData.sunset[index])}
// // 最大UV指数: ${uvIndexMessage}
// // 降水時間: ${dailyData.precipitation_hours[index]}時間
// // 最大降水確率: ${dailyData.precipitation_probability_max[index]}%
// // 最大風速: ${dailyData.wind_speed_10m_max[index]} km/h
// //     `;

// https://api.open-meteo.com/v1/forecast?latitude=34.75789393&longitude=135.52940582&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max&timezone=Asia%2FTokyo
// 上記のURLを利用すると、「weather_code」「temperature_2m_max」「temperature_2m_min」「uv_index_max」「precipitation_probability_max」が取得できる
// latitudeとlongitudeを取得し、置き換える感じ

// function buildForecastUrl(areaCode) {
//   return `https://www.jma.go.jp/bosai/forecast/data/forecast/${areaCode}.json`;
// }

// function fetchWeatherForecast(areaCode) {
//   const url = buildForecastUrl(areaCode);
//   const response = UrlFetchApp.fetch(url);
//   const json = JSON.parse(response.getContentText());
//   return json;
// }

// function generateForecastText(weatherData) {
//     let forecastText = '';
//     const areaName = weatherData[0].timeSeries[0].areas[0].area.name;
//     forecastText += `地域: ${areaName}\n\n`;
  
//     const timeSeries = weatherData[0].timeSeries;
//     const dates = timeSeries[0].timeDefines.slice(1, 4);  // 明日から3日後までの日付を取得
//     const weathers = timeSeries[0].areas[0].weathers.slice(1, 4);  // 明日から3日後までの天気を取得
  
//     dates.forEach((date, index) => {
//       const formattedDate = formatDate(date);
//       forecastText += `${formattedDate}:\n`;
//       forecastText += `天気:\n ${weathers[index]}\n`;

//       forecastText += '\n';
//     });
  
//     return forecastText;
// }
  
// function formatDate(isoString) {
//     const date = new Date(isoString);
//     return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
// }



// function weatherTest() {
//     const areaCode = '270000';
//     const forecast = weatherData(areaCode);  // 変数名を 'forecast' に変更
//     Logger.log(forecast);
// }

// function sendWeatherInformation() {

//     var spreadsheetId = getSpreadsheetId();
//     var ss = SpreadsheetApp.openById(spreadsheetId);
//     var sheet = ss.getSheetByName('babyData');
//     var areaCode = sheet.getRange('B5').getValue();
//     const forecast = weatherData(areaCode);  // 変数名を 'forecast' に変更
//     const houseGroupId = getHouseGroupId();
//     sendLineMessage(houseGroupId, {
//         type: 'text',
//         text: `${forecast}`
//     });
// }







// 取得できる情報多めだけど、精度に危うさ感じた。とりあえずメモくらいの気持ち
// function generateForecastText(weatherData) {
//     let forecastText = '';
//     const areaName = weatherData[0].timeSeries[0].areas[0].area.name;
//     forecastText += `地域: ${areaName}\n\n`;
  
//     const timeSeries = weatherData[0].timeSeries;
//     const dates = timeSeries[0].timeDefines.slice(0, 3);
//     const weathers = timeSeries[0].areas[0].weathers.slice(0, 3);
//     const winds = timeSeries[0].areas[0].winds.slice(0, 3);
//     const pops = timeSeries[1].areas[0].pops.slice(0, 3);
  
//     const tempsMin = timeSeries[1].areas[0].tempsMin ? timeSeries[1].areas[0].tempsMin.slice(1, 4) : [];
//     const tempsMax = timeSeries[1].areas[0].tempsMax ? timeSeries[1].areas[0].tempsMax.slice(1, 4) : [];
  
//     dates.forEach((date, index) => {
//       const formattedDate = formatDate(date);
//       forecastText += `${formattedDate}:\n`;
//       forecastText += `- 天気: ${weathers[index]}\n`;
//       forecastText += `- 風: ${winds[index]}\n`;
//       forecastText += `- 降水確率: ${pops[index]}%\n`;
//       if (tempsMin.length > index) {
//         forecastText += `- 最低気温: ${tempsMin[index]}°C\n`;
//       }
//       if (tempsMax.length > index) {
//         forecastText += `- 最高気温: ${tempsMax[index]}°C\n`;
//       }
//       forecastText += '\n';
//     });
  
//     return forecastText;
// }
  
//   function formatDate(isoString) {
//     const date = new Date(isoString);
//     return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
// }
