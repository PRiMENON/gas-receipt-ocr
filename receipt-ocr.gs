const LINE_ACCESS_TOKEN  = PropertiesService.getScriptProperties().getProperty('LINE_ACCESS_TOKEN');
const LINE_ENDPOINT      = PropertiesService.getScriptProperties().getProperty('LINE_ENDPOINT');
const LINE_DATA_ENDPOINT = PropertiesService.getScriptProperties().getProperty('LINE_DATA_ENDPOINT');
const SHEET_ID           = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
const FOLDER_ID          = PropertiesService.getScriptProperties().getProperty('FOLDER_ID');
const SHEET_NAME         = PropertiesService.getScriptProperties().getProperty('SHEET_NAME');

function doPost(e) {
  var json = JSON.parse(e.postData.contents);

  var img_url = LINE_DATA_ENDPOINT + json.events[0].message.id + "/content";
  var img_options = { "headers" : { 'Authorization': 'Bearer ' + LINE_ACCESS_TOKEN } };
  const blob = UrlFetchApp.fetch(img_url, img_options).getBlob();

  var driveOptions = {
      "title": "test.jpg",
      "parents": [{id: FOLDER_ID}] 
     };
  const image = Drive.Files.insert(driveOptions, blob, { "ocr": true, "ocrLanguage": "ja" });
  var ocrText = DocumentApp.openById(image.id).getBody().getText();

  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  var lastRow = sheet.getLastRow();
  SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME).getRange(lastRow + 1, 1).setValue(ocrText);

  var folder = DriveApp.getFolderById(FOLDER_ID);
  var files = folder.getFiles();
  while(files.hasNext()){
    var file = files.next();
    file.setTrashed(true);
  }
  var message = {"replyToken":json.events[0].replyToken,"messages":[{"type": "text","text" : "書き込み完了"}]};
  var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json; charset=UTF-8",
      "Authorization" : "Bearer " + LINE_ACCESS_TOKEN
    },
    "payload" : JSON.stringify(message)
  };
  UrlFetchApp.fetch(LINE_ENDPOINT, options);
}
