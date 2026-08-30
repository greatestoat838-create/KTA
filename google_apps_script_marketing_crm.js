function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Active Leads Pipeline") || ss.getSheetByName("KTA Active Leads & Pipeline") || ss.getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var lastRow = sheet.getLastRow();
    var leadNum = ("000" + (lastRow - 2)).slice(-3);
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

    // 1. DUPLICATE / REPEAT LEAD DETECTION
    var isRepeat = false;
    var repeatCount = 0;
    if (cleanPhone && cleanPhone.length >= 7 && lastRow >= 4) {
      var phoneColumnData = sheet.getRange(4, 6, lastRow - 3, 1).getValues();
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

    var rowValues = [
      leadId,
      timestamp,
      formName,
      name,
      company,
      phone,
      email,
      reqMessage,
      "Trade Desk Admin",
      leadStatus,
      managerNote, // Manager Call Notes
      "", // Client Feedback
      "", // Quoted Value INR
      ""  // Next Follow-Up Date
    ];

    // 2. INSERT ROW WITH BEAUTIFUL FORMATTING & TYPOGRAPHY
    var nextRow = sheet.getLastRow() + 1;
    var range = sheet.getRange(nextRow, 1, 1, rowValues.length);
    
    // Force plain text '@' on the whole row to completely prevent formula parse errors
    range.setNumberFormat('@');
    range.setValues([rowValues]);

    // Typography styling
    range.setFontFamily("Calibri");
    range.setFontSize(9.5);
    range.setVerticalAlignment("middle");

    // Alternating Row Background or Repeat Lead Highlight
    if (isRepeat) {
      range.setBackground("#FFF3E0"); // Soft Amber Alert for Repeat Leads!
      var statusCell = sheet.getRange(nextRow, 10);
      statusCell.setFontColor("#E65100");
      statusCell.setFontWeight("bold");
    } else {
      var bgRow = (nextRow % 2 === 0) ? "#F9FAF7" : "#FFFFFF";
      range.setBackground(bgRow);
      var statusCell = sheet.getRange(nextRow, 10);
      statusCell.setBackground("#FFF8E1"); // Soft Gold Badge for New Leads
      statusCell.setFontColor("#8C6B1C");
      statusCell.setFontWeight("bold");
    }

    // Alignments
    sheet.getRange(nextRow, 1).setHorizontalAlignment("center");
    sheet.getRange(nextRow, 2).setHorizontalAlignment("center");
    sheet.getRange(nextRow, 6).setHorizontalAlignment("center");
    sheet.getRange(nextRow, 10).setHorizontalAlignment("center");
    sheet.getRange(nextRow, 13).setNumberFormat("₹#,##0").setHorizontalAlignment("right");
    sheet.getRange(nextRow, 14).setHorizontalAlignment("center");

    // Thin soft borders
    range.setBorder(true, true, true, true, true, true, "#D5DDD0", SpreadsheetApp.BorderStyle.SOLID);

    // 3. EMAIL ROUTING LOGIC:
    // If Wholesale form -> wholesale@ktaspices.in | All other forms -> orders@ktaspices.in
    var isWholesale = formName.toLowerCase().indexOf("wholesale") !== -1;
    var primaryRecipient = isWholesale ? "wholesale@ktaspices.in" : "orders@ktaspices.in";
    var ccRecipient = isWholesale ? "orders@ktaspices.in, admin@ktaspices.in" : "wholesale@ktaspices.in, admin@ktaspices.in";

    // 4. SEND PROFESSIONAL HTML EMAIL TO ZOHO MAIL
    var emailSubject = (isRepeat ? "🚨 [REPEAT HIGH-INTENT LEAD]: " : (isWholesale ? "📦 [WHOLESALE RFQ]: " : "🔥 [NEW LEAD]: ")) + company + " (" + name + ") — " + formName;
    var headerColor = isRepeat ? "#E65100" : (isWholesale ? "#2B3917" : "#158697");
    
    var htmlBody = 
      '<div style="font-family: Arial, sans-serif; max-width: 620px; margin: auto; border: 1px solid #e2e2e2; border-radius: 8px; overflow: hidden; background: #ffffff;">' +
        '<div style="background-color: ' + headerColor + '; color: #ffffff; padding: 20px; text-align: center;">' +
          '<h2 style="margin: 0; font-size: 20px; letter-spacing: 1px;">KOTTAYAR TRADING AGENCY</h2>' +
          '<p style="margin: 6px 0 0; font-size: 12px; color: #f0f0f0; text-transform: uppercase; letter-spacing: 0.08em;">' + (isRepeat ? '⚠️ High-Intent Repeat Client Inquiry' : (isWholesale ? 'Wholesale Commercial Procurement Inquiry' : 'Chef Box / Kitchen Order Inquiry')) + '</p>' +
        '</div>' +
        '<div style="padding: 24px;">' +
          '<div style="background: ' + (isRepeat ? '#FFF3E0' : '#F8FAF5') + '; border-left: 4px solid ' + headerColor + '; padding: 10px 14px; margin-bottom: 18px; font-weight: bold; color: ' + headerColor + ';">' +
            'Lead ID: ' + leadId + ' · ' + (isRepeat ? '⚠️ REPEAT CLIENT (Submitted ' + (repeatCount + 1) + ' times)' : 'Logged to Live Master CRM Sheet') +
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
