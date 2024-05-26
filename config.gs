function getLineApiUrl() {
    return 'https://api.line.me/v2/bot/message/push';
}
  
function getLineToken() {
    return PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');
}

function getSpreadsheetId() {
    return PropertiesService.getScriptProperties().getProperty('SPREAD_SHEET_ID');
}

function getHouseGroupId() {
    return PropertiesService.getScriptProperties().getProperty('HOUSE_GROUP_ID');
}

function getBabyGroupId() {
    return PropertiesService.getScriptProperties().getProperty('BABY_GROUP_ID');
}


function getOpenAiApiToken() {
    return PropertiesService.getScriptProperties().getProperty('OPENAI_API');
}

function getBabyLogSheetName() {
    return "ベビールーム"
}

function getHouseLogSheetName() {
    return "お家ルーム"
}

function getDiaryLogSheetName() {
    return "赤ちゃん日記"
}

function getImageSaveFolderId() {
    return PropertiesService.getScriptProperties().getProperty('IMAGE_SAVE_FOLDER_ID');
}

