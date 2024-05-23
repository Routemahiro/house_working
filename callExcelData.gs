function logMessageToSheet(sheetname,timestamp, userId, groupId, messageType, message) {
    var ss = SpreadsheetApp.openById(SPREAD_SHEET_ID);
    var sheet = ss.getSheetByName(sheetname); // 'Messages'という名前のシートを使用
    if (!sheet) {
      sheet = ss.insertSheet(sheetname);
      sheet.appendRow(['Date', 'GroupId', 'UserId', 'MessageType', 'Message']); // 列名を設定
    }
    
    if (messageType === 'text') {
      sheet.appendRow([timestamp, groupId, userId, messageType, message]);
    }
  }
  
  function loadBabyData() {
    var ss = SpreadsheetApp.openById(SPREAD_SHEET_ID);
    var sheet = ss.getSheetByName('babyData');
    var birthDay = sheet.getRange('B1').getValue();
    var birthdayJST = Utilities.formatDate(new Date(birthDay), 'JST', 'yyyy/MM/dd');
    var name = sheet.getRange('B2').getValue();
    var mother_name = sheet.getRange('B3').getValue();
    var father_name = sheet.getRange('B4').getValue();

    var today = sheet.getRange('E1').getValue();
    var todayJST = Utilities.formatDate(today, 'JST', 'yyyy/MM/dd');

    var daysSinceBirth = sheet.getRange('E2').getValue();

    return {birthDay: birthdayJST, name: name, mother_name: mother_name, father_name: father_name, today: todayJST, daysSinceBirth: daysSinceBirth};
  }
  
  function loadBabyLog(sheetname) {
    var ss = SpreadsheetApp.openById(SPREAD_SHEET_ID);
    var sheet = ss.getSheetByName(sheetname);
    var data = sheet.getDataRange().getValues();
    var filteredData = [];
    var today = Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd');

    for (var i = 1; i < data.length; i++) {
      var dataDate = Utilities.formatDate(new Date(data[i][0]), 'JST', 'yyyy/MM/dd');
      if (data[i][4] !== '' && dataDate === today) { // E列が空白でなく、かつ日付が今日の場合
        filteredData.push([Utilities.formatDate(new Date(data[i][0]), 'JST', 'yyyy/MM/dd HH:mm'), data[i][4]]); // A列、E列の値を取得
      };
    }
  
    return filteredData;
  }