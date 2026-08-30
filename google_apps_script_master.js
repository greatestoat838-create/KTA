// ══════════════════════════════════════════════════════════════
// KTA SPICES — UNIVERSAL EXECUTIVE DASHBOARD & CRM ENGINE (V3)
// ══════════════════════════════════════════════════════════════

function onOpen() {
  updateDashboardLive();
}

function updateDashboardLive() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    
    var leadsSheet = null;
    var dashSheet = null;

    // 1. Identify Sheets
    for (var i = 0; i < sheets.length; i++) {
      var name = sheets[i].getName().toLowerCase();
      if (name.indexOf("dash") !== -1 || name.indexOf("market") !== -1 || name.indexOf("exec") !== -1 || name.indexOf("analytic") !== -1) {
        dashSheet = sheets[i];
      } else {
        if (!leadsSheet) leadsSheet = sheets[i];
      }
    }

    // Fallbacks if only 2 sheets exist
    if (!dashSheet && sheets.length > 1) dashSheet = sheets[0];
    if (!leadsSheet) leadsSheet = sheets.length > 1 ? sheets[1] : sheets[0];

    if (!leadsSheet || !dashSheet || leadsSheet === dashSheet) {
      Logger.log("Need two sheets: one for leads, one for dashboard.");
      return;
    }

    var lastRow = leadsSheet.getLastRow();
    var totalLeads = 0;
    var wholesaleCount = 0;
    var chefBoxCount = 0;
    var totalPipelineValue = 0;
    var closedWonCount = 0;

    if (lastRow >= 4) {
      var data = leadsSheet.getRange(4, 1, lastRow - 3, 14).getValues();
      totalLeads = data.length;

      for (var r = 0; r < data.length; r++) {
        var cat = data[r][2].toString().toLowerCase();     // Column C: Form Category
        var req = data[r][7].toString().toLowerCase();     // Column H: Requirement
        var status = data[r][9].toString().toLowerCase();  // Column J: Status
        var moneyVal = data[r][12];                        // Column M: Quoted Value

        if (cat.indexOf("wholesale") !== -1 || req.indexOf("wholesale") !== -1 || req.indexOf("ton") !== -1) {
          wholesaleCount++;
        }
        if (cat.indexOf("chef") !== -1 || req.indexOf("chef") !== -1 || req.indexOf("sample") !== -1) {
          chefBoxCount++;
        }
        if (status.indexOf("won") !== -1 || status.indexOf("closed won") !== -1 || status.indexOf("converted") !== -1) {
          closedWonCount++;
        }

        if (moneyVal) {
          var num = parseFloat(moneyVal.toString().replace(/[^0-9.]/g, ''));
          if (!isNaN(num)) totalPipelineValue += num;
        }
      }
    }

    // 2. Find KPI Row in Dashboard Sheet (Search Row 3, 4, 5)
    var valRow = 4; // Default to Row 4
    for (var rTest = 3; rTest <= 6; rTest++) {
      var testVal = dashSheet.getRange(rTest, 2).getValue().toString().toUpperCase();
      if (testVal.indexOf("TOTAL") !== -1 || testVal.indexOf("LEAD") !== -1) {
        valRow = rTest + 1; // Numbers are on the next row below the header
        break;
      }
    }

    // 3. Clear any broken formulas and set values directly into BOTH Row 4 and Row 5 to guarantee display!
    var targetRows = [valRow, 4, 5];
    for (var t = 0; t < targetRows.length; t++) {
      var row = targetRows[t];
      try {
        // Only write if cell does NOT contain static title text
        var cellB = dashSheet.getRange(row, 2);
        var curB = cellB.getValue().toString().toUpperCase();
        if (curB.indexOf("TOTAL LEADS") === -1 && curB.indexOf("INCOMING") === -1) {
          cellB.setValue(totalLeads);
          dashSheet.getRange(row, 4).setValue(wholesaleCount);
          dashSheet.getRange(row, 6).setValue(chefBoxCount);
          
          var pVal = dashSheet.getRange(row, 8);
          pVal.setValue(totalPipelineValue);
          pVal.setNumberFormat("₹#,##0");

          dashSheet.getRange(row, 10).setValue(closedWonCount);
        }
      } catch(e) {}
    }

    Logger.log("Dashboard Updated: Leads=" + totalLeads + " Wholesale=" + wholesaleCount + " Chef=" + chefBoxCount + " Value=" + totalPipelineValue);

  } catch(err) {
    Logger.log("Dashboard update error: " + err);
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    
    var leadsSheet = null;
    var dashSheet = null;

    for (var i = 0; i < sheets.length; i++) {
      var name = sheets[i].getName().toLowerCase();
      if (name.indexOf("dash") !== -1 || name.indexOf("market") !== -1 || name.indexOf("exec") !== -1 || name.indexOf("analytic") !== -1) {
        dashSheet = sheets[i];
      } else {
        if (!leadsSheet) leadsSheet = sheets[i];
      }
    }
    if (!leadsSheet) leadsSheet = ss.getActiveSheet();
    if (!dashSheet && sheets.length > 1) dashSheet = sheets[0];

    var data = JSON.parse(e.postData.contents);
    var lastRow = leadsSheet.getLastRow();
    var leadNum = ("000" + Math.max(1, lastRow - 2)).slice(-3);
    var leadId = "KTA-2026-" + leadNum;

    var timestamp = data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var formName = data.formName || "Website Lead";
    var name = (data.managerName || data.name || "Not Provided").toString().trim();
    var company = (data.hotelName || data.property || "Not Provided").toString().trim();
    var phone = (data.contactPhone || data.phone || "Not Provided").toString().trim();
    var email = (data.email || "Not Provided").toString().trim();
    var volume = (data.volume || "Not Provided").toString().trim();
    var message = (data.message || "None").toString().trim();
    
    var cleanPhone = phone.replace(/[^0-9]/g, '');
    var reqMessage = (volume !== "Not Provided" ? volume + " — " : "") + message;

    var isChefBox = formName.toLowerCase().indexOf("chef") !== -1 || volume.toLowerCase().indexOf("chef") !== -1;
    var isWholesale = formName.toLowerCase().indexOf("wholesale") !== -1;

    // REPEAT CLIENT DETECTION
    var isRepeat = false;
    var repeatCount = 0;
    if (cleanPhone && cleanPhone.length >= 7 && lastRow >= 4) {
      var phoneData = leadsSheet.getRange(4, 6, lastRow - 3, 1).getValues();
      for (var p = 0; p < phoneData.length; p++) {
        var existingPhone = phoneData[p][0].toString().replace(/[^0-9]/g, '');
        if (existingPhone && (existingPhone.indexOf(cleanPhone) !== -1 || cleanPhone.indexOf(existingPhone) !== -1)) {
          isRepeat = true;
          repeatCount++;
        }
      }
    }

    var leadStatus = isRepeat ? "REPEAT INQUIRY (" + (repeatCount + 1) + "x)" : (isChefBox ? "Sample Requested" : "New Lead");
    var managerNote = isRepeat ? "⚠️ Repeat client inquiry. High intent — prioritize fast call." : (isChefBox ? "Free Chef Discovery Box requested. Prepare sample dispatch." : "");

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
      managerNote,
      "", // Client Feedback
      "", // Quoted Value INR
      ""  // Next Follow-Up Date
    ];

    var nextRow = leadsSheet.getLastRow() + 1;
    var range = leadsSheet.getRange(nextRow, 1, 1, rowValues.length);
    
    range.setNumberFormat('@');
    range.setValues([rowValues]);
    range.setFontFamily("Segoe UI");
    range.setFontSize(9);
    range.setVerticalAlignment("middle");

    if (isRepeat) {
      range.setBackground("#FFF3E0");
      var statusCell = leadsSheet.getRange(nextRow, 10);
      statusCell.setFontColor("#E65100");
      statusCell.setFontWeight("bold");
    } else if (isChefBox) {
      range.setBackground((nextRow % 2 === 0) ? "#F8FAFC" : "#FFFFFF");
      var statusCell = leadsSheet.getRange(nextRow, 10);
      statusCell.setBackground("#F3E8FF");
      statusCell.setFontColor("#7E22CE");
      statusCell.setFontWeight("bold");
    } else {
      range.setBackground((nextRow % 2 === 0) ? "#F8FAFC" : "#FFFFFF");
      var statusCell = leadsSheet.getRange(nextRow, 10);
      statusCell.setBackground("#FEF3C7");
      statusCell.setFontColor("#B45309");
      statusCell.setFontWeight("bold");
    }

    leadsSheet.getRange(nextRow, 1).setHorizontalAlignment("center");
    leadsSheet.getRange(nextRow, 2).setHorizontalAlignment("center");
    leadsSheet.getRange(nextRow, 6).setHorizontalAlignment("center");
    leadsSheet.getRange(nextRow, 10).setHorizontalAlignment("center");
    leadsSheet.getRange(nextRow, 13).setNumberFormat("₹#,##0").setHorizontalAlignment("right");
    leadsSheet.getRange(nextRow, 14).setHorizontalAlignment("center");
    range.setBorder(true, true, true, true, true, true, "#CBD5E1", SpreadsheetApp.BorderStyle.SOLID);

    // AUTO-UPDATE DASHBOARD LIVE
    updateDashboardLive();

    // EMAIL NOTIFICATION
    var primaryRecipient = isWholesale ? "wholesale@ktaspices.in" : "orders@ktaspices.in";
    var ccRecipient = isWholesale ? "orders@ktaspices.in, admin@ktaspices.in" : "wholesale@ktaspices.in, admin@ktaspices.in";

    var badgeText = isRepeat ? "⚠️ High-Intent Repeat Client" : (isChefBox ? "👨‍🍳 Free Chef Discovery Box Request" : (isWholesale ? "📦 Wholesale Procurement RFQ" : "🔥 New Commercial Lead"));
    var headerColor = isRepeat ? "#C2410C" : (isChefBox ? "#7E22CE" : (isWholesale ? "#1E293B" : "#0D9488"));

    var emailSubject = (isRepeat ? "🚨 [REPEAT CLIENT]: " : (isChefBox ? "👨‍🍳 [CHEF BOX CLAIM]: " : (isWholesale ? "📦 [WHOLESALE RFQ]: " : "🔥 [NEW LEAD]: "))) + company + " (" + name + ")";
    
    var htmlBody = 
      '<div style="font-family: Segoe UI, Arial, sans-serif; max-width: 620px; margin: auto; border: 1px solid #CBD5E1; border-radius: 8px; overflow: hidden; background: #ffffff;">' +
        '<div style="background-color: ' + headerColor + '; color: #ffffff; padding: 22px; text-align: center;">' +
          '<h2 style="margin: 0; font-size: 20px; letter-spacing: 1px;">KOTTAYAR TRADING AGENCY</h2>' +
          '<p style="margin: 6px 0 0; font-size: 12px; color: #f0f0f0; text-transform: uppercase; letter-spacing: 0.08em;">' + badgeText + '</p>' +
        '</div>' +
        '<div style="padding: 24px;">' +
          '<div style="background: ' + (isRepeat ? '#FFF3E0' : '#F1F5F9') + '; border-left: 4px solid ' + headerColor + '; padding: 10px 14px; margin-bottom: 18px; font-weight: bold; color: ' + headerColor + ';">' +
            'Lead ID: ' + leadId + ' · ' + (isRepeat ? '⚠️ REPEAT INQUIRY (' + (repeatCount + 1) + 'x)' : 'Logged to Live Master CRM Sheet') +
          '</div>' +
          '<table style="width: 100%; border-collapse: collapse; font-size: 14px;">' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #64748B; width: 35%;">Form Category</td><td style="padding: 10px 0; font-weight: bold; color: #0F172A;">' + formName + '</td></tr>' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #64748B;">Client / Manager</td><td style="padding: 10px 0; font-weight: bold; color: #0F172A;">' + name + '</td></tr>' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #64748B;">Hotel / Establishment</td><td style="padding: 10px 0; font-weight: bold; color: #0F172A;">' + company + '</td></tr>' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #64748B;">Phone / WhatsApp</td><td style="padding: 10px 0;"><a href="tel:' + phone + '" style="color: #0F172A; font-weight: bold; text-decoration: none;">' + phone + '</a> &nbsp;|&nbsp; <a href="https://wa.me/' + cleanPhone + '" style="color: #25d366; font-weight: bold; text-decoration: none;">Chat on WhatsApp ↗</a></td></tr>' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #64748B;">Email Address</td><td style="padding: 10px 0;"><a href="mailto:' + email + '" style="color: #0F172A;">' + email + '</a></td></tr>' +
            '<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 10px 0; color: #64748B;">Volume / Requirement</td><td style="padding: 10px 0; font-weight: bold; color: #0F172A;">' + volume + '</td></tr>' +
            '<tr><td style="padding: 10px 0; color: #64748B;" valign="top">Details / Message</td><td style="padding: 10px 0; line-height: 1.5; color: #0F172A;">' + message + '</td></tr>' +
          '</table>' +
        '</div>' +
        '<div style="background-color: #F8FAFC; padding: 12px 20px; font-size: 11px; color: #64748B; text-align: center; border-top: 1px solid #E2E8F0;">' +
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
