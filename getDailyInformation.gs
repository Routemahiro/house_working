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

    const forecastText = `
天気コード: ${dailyData.weather_code[index]}
最高気温: ${dailyData.temperature_2m_max[index]}°C
最低気温: ${dailyData.temperature_2m_min[index]}°C
日の出: ${dailyData.sunrise[index]}
日の入り: ${dailyData.sunset[index]}
最大UV指数: ${dailyData.uv_index_max[index]}
最大UV指数（晴天時）: ${dailyData.uv_index_clear_sky_max[index]}
降水時間: ${dailyData.precipitation_hours[index]}時間
最大降水確率: ${dailyData.precipitation_probability_max[index]}%
最大風速: ${dailyData.wind_speed_10m_max[index]} km/h
    `;

    return forecastText.trim();
}
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
