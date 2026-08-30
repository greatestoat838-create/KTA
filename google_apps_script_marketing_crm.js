/**
 * KOTTAYAR TRADING AGENCY — MASTER GOOGLE APPS SCRIPT CRM BACKEND
 * Connects Website Forms Directly to Google Sheets with 2-Zone Layout & Dropdowns
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Active Leads Pipeline") || ss.getSheetByName("KTA Active Leads & Pipeline") || ss.getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var lastRow = sheet.getLastRow();
    var leadNum = ("000" + (lastRow - 1)).slice(-3);
    var leadId = "KTA-2026-" + leadNum;

    var timestamp = data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var formName = data.formName || "Website Lead";
    var name = (data.managerName || data.name || "Not Provided").toString().trim();
    var company = (data.hotelName || data.property || "Not Provided").toString().trim();
    var phone = (data.contactPhone || data.phone || "Not Provided").toString().trim();
    var email = (data.email || "Not Provided").toString().trim();
    var volume = (data.volume || "Not Provided").toString().trim();
    var message = (data.message || "None").toString().trim();
    
    // Clean phone number for matching and WhatsApp link
    var cleanPhone = phone.replace(/[^0-9]/g, '');
    var reqMessage = (volume !== "Not Provided" ? volume + " — " : "") + message;

    // 1. REPEAT CLIENT DETECTION (HIGH INTENT ALERT)
    var isRepeat = false;
    var repeatCount = 0;
    if (cleanPhone && cleanPhone.length >= 7 && lastRow >= 3) {
      var phoneColumnData = sheet.getRange(3, 6, lastRow - 2, 1).getValues();
      for (var i = 0; i < phoneColumnData.length; i++) {
        var existingPhone = phoneColumnData[i][0].toString().replace(/[^0-9]/g, '');
        if (existingPhone.indexOf(cleanPhone) !== -1 || cleanPhone.indexOf(existingPhone) !== -1) {
          isRepeat = true;
          repeatCount++;
        }
      }
    }

    var leadStatus = isRepeat ? "Repeat Lead (" + (repeatCount + 1) + "x)" : "New Lead";
    var managerNote = isRepeat ? "Repeat inquiry received from same client number. High intent — prioritize fast call." : "";

    // 2. ZONE 1 (COLS A-H) + ZONE 2 (COLS I-N)
    var rowValues = [
      leadId,             // Col A: Lead ID
      timestamp,          // Col B: Timestamp (IST)
      formName,           // Col C: Form Category
      name,               // Col D: Contact / Manager Name
      company,            // Col E: Hotel / Establishment Name
      phone,              // Col F: Phone / WhatsApp
      email,              // Col G: Email Address
      reqMessage,         // Col H: Requirement & Volume
      "Trade Desk Admin", // Col I: Assigned Manager (Dropdown)
      leadStatus,         // Col J: Follow-Up Status (Dropdown)
      managerNote,        // Col K: Manager Call Notes
      "",                 // Col L: Client Feedback / Demands
      "",                 // Col M: Quoted Value (INR)
      ""                  // Col N: Next Follow-Up Date
    ];

    var nextRow = sheet.getLastRow() + 1;
    var range = sheet.getRange(nextRow, 1, 1, rowValues.length);
    
    // Force plain text '@' on the whole row to completely prevent formula parse errors
    range.setNumberFormat('@');
    range.setValues([rowValues]);

    // Typography styling
    range.setFontFamily("Calibri");
    range.setFontSize(9.5);
    range.setVerticalAlignment("middle");

    // Apply Dropdown Validation Rule to the newly inserted cell J
    var statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "New Lead",
        "Followed Up / In Call",
        "Sample Dispatched",
        "Quotation Sent",
        "In Negotiation",
        "Closed Won (Converted)",
        "Closed Lost",
        "On Hold"
      ], true)
      .setAllowInvalid(true)
      .build();
    sheet.getRange(nextRow, 10).setDataValidation(statusRule);

    var managerRule = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Trade Desk Admin",
        "Nazeer Ahmed",
        "K. Sundar",
        "R. Balaji",
        "Sourcing Lead",
        "Senior Key Account Exec"
      ], true)
      .setAllowInvalid(true)
      .build();
    sheet.getRange(nextRow, 9).setDataValidation(managerRule);

    // Row Background
    if (isRepeat) {
      range.setBackground("#FFF3E0"); // Soft Amber Alert for Repeat Leads
    } else {
      var bgRow = (nextRow % 2 === 0) ? "#FAF9F6" : "#FFFFFF";
      range.setBackground(bgRow);
    }

    // Alignments
    sheet.getRange(nextRow, 1).setHorizontalAlignment("center");
    sheet.getRange(nextRow, 2).setHorizontalAlignment("center");
    sheet.getRange(nextRow, 6).setHorizontalAlignment("center");
    sheet.getRange(nextRow, 9).setHorizontalAlignment("center");
    sheet.getRange(nextRow, 10).setHorizontalAlignment("center");
    sheet.getRange(nextRow, 13).setNumberFormat("₹#,##0").setHorizontalAlignment("right");
    sheet.getRange(nextRow, 14).setHorizontalAlignment("center");

    range.setBorder(true, true, true, true, true, true, "#D1D5DB", SpreadsheetApp.BorderStyle.SOLID);

    // 3. EMAIL ROUTING LOGIC:
    var isWholesale = formName.toLowerCase().indexOf("wholesale") !== -1;
    var primaryRecipient = isWholesale ? "wholesale@ktaspices.in" : "orders@ktaspices.in";
    var ccRecipient = isWholesale ? "orders@ktaspices.in, admin@ktaspices.in" : "wholesale@ktaspices.in, admin@ktaspices.in";

    var emailSubject = (isRepeat ? "[REPEAT HIGH-INTENT LEAD]: " : (isWholesale ? "[WHOLESALE RFQ]: " : "[NEW INQUIRY]: ")) + company + " (" + name + ") — " + formName;
    var headerColor = isRepeat ? "#E65100" : (isWholesale ? "#2B3917" : "#3D4D24");
    
    var htmlBody = 
      '<div style="font-family: Arial, sans-serif; max-width: 620px; margin: auto; border: 1px solid #e2e2e2; border-radius: 8px; overflow: hidden; background: #ffffff;">' +
        '<div style="background-color: ' + headerColor + '; color: #ffffff; padding: 20px; text-align: center;">' +
          '<h2 style="margin: 0; font-size: 20px; letter-spacing: 1px;">KOTTAYAR TRADING AGENCY</h2>' +
          '<p style="margin: 6px 0 0; font-size: 12px; color: #f0f0f0; text-transform: uppercase; letter-spacing: 0.08em;">' + (isRepeat ? 'High-Intent Repeat Client Inquiry' : (isWholesale ? 'Wholesale Commercial Procurement Inquiry' : 'Chef Box / Kitchen Order Inquiry')) + '</p>' +
        '</div>' +
        '<div style="padding: 24px;">' +
          '<div style="background: ' + (isRepeat ? '#FFF3E0' : '#F8FAF5') + '; border-left: 4px solid ' + headerColor + '; padding: 10px 14px; margin-bottom: 18px; font-weight: bold; color: ' + headerColor + ';">' +
            'Lead ID: ' + leadId + ' · ' + (isRepeat ? 'REPEAT CLIENT (Submitted ' + (repeatCount + 1) + ' times)' : 'Logged to Live Master CRM Sheet') +
          '</div>' +
          '<table style="width: 100%; border-collapse: collapse; font-size: 14px;">' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #777; width: 35%;">Form Category</td><td style="padding: 10px 0; font-weight: bold; color: #2B3917;">' + formName + '</td></tr>' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #777;">Client / Manager</td><td style="padding: 10px 0; font-weight: bold;">' + name + '</td></tr>' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #777;">Hotel / Establishment</td><td style="padding: 10px 0; font-weight: bold;">' + company + '</td></tr>' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #777;">Phone / WhatsApp</td><td style="padding: 10px 0;"><a href="tel:' + phone + '" style="color: #2B3917; font-weight: bold; text-decoration: none;">' + phone + '</a> &nbsp;|&nbsp; <a href="https://wa.me/' + cleanPhone + '" style="color: #25d366; font-weight: bold; text-decoration: none;">Chat on WhatsApp</a></td></tr>' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #777;">Email Address</td><td style="padding: 10px 0;"><a href="mailto:' + email + '" style="color: #2B3917;">' + email + '</a></td></tr>' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #777;">Volume / Requirement</td><td style="padding: 10px 0; font-weight: bold;">' + volume + '</td></tr>' +
            '<tr><td style="padding: 10px 0; color: #777;" valign="top">Details / Message</td><td style="padding: 10px 0; line-height: 1.5;">' + message + '</td></tr>' +
          '</table>' +
        '</div>' +
        '<div style="background-color: #F4F7EF; padding: 12px 20px; font-size: 11px; color: #666666; text-align: center; border-top: 1px solid #e0e0e0;">' +
          'Submitted at ' + timestamp + ' · Logged in KTA Master CRM Tracker' +
        '</div>' +
      '</div>';

    MailApp.sendEmail({
      to: primaryRecipient,
      cc: ccRecipient,
      subject: emailSubject,
      htmlBody: htmlBody
    });

    return ContentService.createTextOutput(JSON.stringify({ status: "success", leadId: leadId, isRepeat: isRepeat }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * AUTOMATED SETUP FUNCTION TO INITIALIZE DROPDOWNS IN GOOGLE SHEETS
 * Run this function once from the Apps Script editor or from the custom menu!
 */
function setupMasterSheetDropdowns() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Active Leads Pipeline") || ss.getActiveSheet();
  
  // Apply Follow-up Status Dropdown Rule (Column J, Rows 3 to 1000)
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      "New Lead",
      "Followed Up / In Call",
      "Sample Dispatched",
      "Quotation Sent",
      "In Negotiation",
      "Closed Won (Converted)",
      "Closed Lost",
      "On Hold"
    ], true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange("J3:J1000").setDataValidation(statusRule);

  // Apply Assigned Manager Dropdown Rule (Column I, Rows 3 to 1000)
  var managerRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      "Trade Desk Admin",
      "Nazeer Ahmed",
      "K. Sundar",
      "R. Balaji",
      "Sourcing Lead",
      "Senior Key Account Exec"
    ], true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange("I3:I1000").setDataValidation(managerRule);

  SpreadsheetApp.getUi().alert("KTA CRM Master Dropdowns successfully applied to Columns I and J!");
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("KTA CRM Tools")
    .addItem("Setup Master Dropdowns on Pipeline Sheet", "setupMasterSheetDropdowns")
    .addToUi();
}
