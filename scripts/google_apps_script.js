/**
 * GOOGLE APPS SCRIPT FOR AMMA'S BIRTHDAY WEBSITE ANSWERS
 * 
 * Instructions to connect to your Google Sheet (takes 30 seconds):
 * 1. Open Google Sheets (https://sheets.new) and name the spreadsheet "Amma's Birthday Answers".
 * 2. In the top menu, click Extensions > Apps Script.
 * 3. Delete any default code in Code.gs, paste this entire file, and click the Save icon (💾).
 * 4. Click the blue "Deploy" button at the top right > "New deployment".
 * 5. Under "Select type" (gear icon), choose "Web app".
 * 6. Set Description: "Amma Birthday Answers Webhook".
 * 7. Set "Execute as": "Me (your email)".
 * 8. Set "Who has access": "Anyone" (important so the website can post answers without login).
 * 9. Click "Deploy", Authorize access with your Google account.
 * 10. Copy the generated "Web App URL" (ends in /exec).
 * 11. Open js/config.js in this project and paste it into:
 *     sheetsWebhookUrl: "YOUR_COPIED_URL_HERE",
 * 
 * That's it! Every time Amma types or dictates an answer on the website,
 * it will instantly appear in real-time as a new row in your Google Sheet!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create header row if sheet is empty
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
