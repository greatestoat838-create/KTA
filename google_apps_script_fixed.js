function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("KTA Active Leads & Pipeline") || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var lastRow = sheet.getLastRow();
    var leadNum = ("000" + (lastRow - 2)).slice(-3);
    var leadId = "KTA-2026-" + leadNum;

    var timestamp = data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var formName = data.formName || "Website Lead";
    var name = data.managerName || data.name || "Not Provided";
    var company = data.hotelName || data.property || "Not Provided";
    var phone = (data.contactPhone || data.phone || "Not Provided").toString().trim();
    var email = data.email || "Not Provided";
    var volume = data.volume || "Not Provided";
    var message = data.message || "None";
    
    // Clean phone number for WhatsApp link
    var cleanPhone = phone.replace(/[^0-9]/g, '');
    var reqMessage = (volume !== "Not Provided" ? volume + " — " : "") + message;

    var rowValues = [
      leadId,
      timestamp,
      formName,
      name,
      company,
      phone,
      email,
      reqMessage,
      "Admin / Lead Desk",
      "New Lead",
      "", // Manager Call Notes
      "", // Client Feedback
      "", // Quoted Value INR
      ""  // Next Follow-Up Date
    ];

    // FOOLPROOF FIX: Insert new row and set format to '@' (Plain Text) BEFORE inserting data
    var nextRow = sheet.getLastRow() + 1;
    var range = sheet.getRange(nextRow, 1, 1, rowValues.length);
    range.setNumberFormat('@'); // This guarantees Google Sheets will NEVER evaluate +91 as a formula!
    range.setValues([rowValues]);

    // Email Routing Logic:
    var isWholesale = formName.toLowerCase().indexOf("wholesale") !== -1;
    var primaryRecipient = isWholesale ? "wholesale@ktaspices.in" : "orders@ktaspices.in";
    var ccRecipient = isWholesale ? "orders@ktaspices.in, admin@ktaspices.in" : "wholesale@ktaspices.in, admin@ktaspices.in";

    // Send Professional HTML Email to Zoho Mail
    var emailSubject = (isWholesale ? "📦 [WHOLESALE RFQ]: " : "🔥 [NEW LEAD]: ") + company + " (" + name + ") — " + formName;
    var htmlBody = 
      '<div style="font-family: Arial, sans-serif; max-width: 620px; margin: auto; border: 1px solid #e2e2e2; border-radius: 8px; overflow: hidden; background: #ffffff;">' +
        '<div style="background-color: ' + (isWholesale ? '#2b3917' : '#158697') + '; color: #ffffff; padding: 20px; text-align: center;">' +
          '<h2 style="margin: 0; font-size: 20px; letter-spacing: 1px;">KOTTAYAR TRADING AGENCY</h2>' +
          '<p style="margin: 6px 0 0; font-size: 12px; color: #f0f0f0; text-transform: uppercase; letter-spacing: 0.08em;">' + (isWholesale ? 'Wholesale Commercial Procurement Inquiry' : 'Chef Box / Kitchen Order Inquiry') + '</p>' +
        '</div>' +
        '<div style="padding: 24px;">' +
          '<div style="background: #f8faf5; border-left: 4px solid #2b3917; padding: 10px 14px; margin-bottom: 18px; font-weight: bold; color: #2b3917;">' +
            'Lead ID: ' + leadId + ' · Status: Logged to Master CRM Sheet' +
          '</div>' +
          '<table style="width: 100%; border-collapse: collapse; font-size: 14px;">' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #777; width: 35%;">Form Category</td><td style="padding: 10px 0; font-weight: bold; color: #2b3917;">' + formName + '</td></tr>' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #777;">Client / Manager</td><td style="padding: 10px 0; font-weight: bold;">' + name + '</td></tr>' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #777;">Hotel / Establishment</td><td style="padding: 10px 0; font-weight: bold;">' + company + '</td></tr>' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #777;">Phone / WhatsApp</td><td style="padding: 10px 0;"><a href="tel:' + phone + '" style="color: #2b3917; font-weight: bold; text-decoration: none;">' + phone + '</a> &nbsp;|&nbsp; <a href="https://wa.me/' + cleanPhone + '" style="color: #25d366; font-weight: bold; text-decoration: none;">Chat on WhatsApp ↗</a></td></tr>' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #777;">Email Address</td><td style="padding: 10px 0;"><a href="mailto:' + email + '" style="color: #2b3917;">' + email + '</a></td></tr>' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #777;">Volume / Requirement</td><td style="padding: 10px 0; font-weight: bold;">' + volume + '</td></tr>' +
            '<tr><td style="padding: 10px 0; color: #777;" valign="top">Details / Message</td><td style="padding: 10px 0; line-height: 1.5;">' + message + '</td></tr>' +
          '</table>' +
        '</div>' +
        '<div style="background-color: #f4f7ef; padding: 12px 20px; font-size: 11px; color: #666666; text-align: center; border-top: 1px solid #e0e0e0;">' +
          'Submitted at ' + timestamp + ' · Logged in KTA Master Lead CRM Tracker' +
        '</div>' +
      '</div>';

    MailApp.sendEmail({
      to: primaryRecipient,
      cc: ccRecipient,
      subject: emailSubject,
      htmlBody: htmlBody
    });

    return ContentService.createTextOutput(JSON.stringify({ status: "success", leadId: leadId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
