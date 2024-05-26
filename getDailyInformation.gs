function buildForecastUrl(areaCode) {
  return `https://www.jma.go.jp/bosai/forecast/data/forecast/${areaCode}.json`;
}

function fetchWeatherForecast(areaCode) {
  const url = buildForecastUrl(areaCode);
  const response = UrlFetchApp.fetch(url);
  const json = JSON.parse(response.getContentText());
  return json;
}

function generateForecastText(weatherData) {
  let forecastText = '';
  const reportDate = weatherData[0].reportDatetime;
  forecastText += `天気予報発表日時: ${reportDate}\n\n`;

  const timeSeries = weatherData[0].timeSeries[0];
  const dates = timeSeries.timeDefines.slice(0, 3); // 直近3日間の日付を取得
  const weathers = timeSeries.areas[0].weathers.slice(0, 3); // 直近3日間の天気を取得

  dates.forEach((date, index) => {
    forecastText += `${date}: ${weathers[index]}\n`;
  });

  return forecastText;
}

function weatherData(areaCode) {
  try {
    const weatherData = fetchWeatherForecast(areaCode);
    const forecastText = generateForecastText(weatherData);
    Logger.log(forecastText);
    return forecastText;
  } catch (error) {
    Logger.log('エラーが発生しました: ' + error.toString());
    return '天気情報の取得に失敗しました。';
  }
}

function weatherTest() {
  const areaCode = '270000';
  const weatherData = weatherData(areaCode);
  Logger.log(weatherData);
}

