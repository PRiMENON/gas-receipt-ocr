const LINE_ACCESS_TOKEN  = PropertiesService.getScriptProperties().getProperty('LINE_ACCESS_TOKEN');
const LINE_ENDPOINT      = PropertiesService.getScriptProperties().getProperty('LINE_ENDPOINT');
const LINE_DATA_ENDPOINT = PropertiesService.getScriptProperties().getProperty('LINE_DATA_ENDPOINT');
const SHEET_ID           = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
const FOLDER_ID          = PropertiesService.getScriptProperties().getProperty('FOLDER_ID');
const SHEET_NAME         = PropertiesService.getScriptProperties().getProperty('SHEET_NAME');

function doPost(e) {
  let json = JSON.parse(e.postData.contents);

  let img_url = LINE_DATA_ENDPOINT + json.events[0].message.id + "/content";
  let img_options = { "headers" : { 'Authorization': 'Bearer ' + LINE_ACCESS_TOKEN } };
  const blob = UrlFetchApp.fetch(img_url, img_options).getBlob();

  let driveOptions = {
      "title": "test.jpg",
      "parents": [{id: FOLDER_ID}] 
     };
  const image = Drive.Files.insert(driveOptions, blob, { "ocr": true, "ocrLanguage": "ja" });
  let ocrText = DocumentApp.openById(image.id).getBody().getText();
  let date = new Date();
      date = Utilities.formatDate(date, 'JST', 'yyyy-MM-dd HH:mm:ss');

  let sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  let lastRow = sheet.getLastRow();
  SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME).getRange(lastRow + 1, 1, 1, 2).setValues([[date,ocrText]]);

  let folder = DriveApp.getFolderById(FOLDER_ID);
  let files = folder.getFiles();
  while(files.hasNext()){
    let file = files.next();
    file.setTrashed(true);
  }
  let message = {"replyToken":json.events[0].replyToken,"messages":[{"type": "text","text" : "書き込み完了"}]};
  let options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json; charset=UTF-8",
      "Authorization" : "Bearer " + LINE_ACCESS_TOKEN
    },
    "payload" : JSON.stringify(message)
  };
  UrlFetchApp.fetch(LINE_ENDPOINT, options);
}
