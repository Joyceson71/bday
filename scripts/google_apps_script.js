function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Room", "Chapter / Section", "Question ID", "Question Text", "Amma's Answer"]);
      sheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#4A0E80").setFontColor("#FFD700");
      sheet.setFrozenRows(1);
    }
    
    var data = JSON.parse(e.postData.contents);
    var timestamp  = data.timestamp || new Date().toLocaleString();
    var room       = data.room || "Questions";
    var section    = data.section || "";
    var questionId = data.questionId || "";
    var question   = data.question || "";
    var answer     = data.answer || "";
    
    // Check if questionId already exists in sheet to update or append
    var existingRow = -1;
    var lastRow = sheet.getLastRow();
    if (lastRow > 1 && questionId) {
      var ids = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (ids[i][0] === questionId) {
          existingRow = i + 2;
          break;
        }
      }
    }
    
    if (existingRow > 0) {
      sheet.getRange(existingRow, 1, 1, 6).setValues([[timestamp, room, section, questionId, question, answer]]);
    } else {
      sheet.appendRow([timestamp, room, section, questionId, question, answer]);
    }
    
    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, 6);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Amma's Birthday Answers Webhook is Active! 💜");
}
