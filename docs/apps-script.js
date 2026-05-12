/**
 * Google Apps Script — Pendaftaran JAGATRIP
 *
 * SETUP:
 * 1. Buka Google Sheets baru
 * 2. Extensions → Apps Script → paste seluruh code ini
 * 3. Jalankan fungsi setupSheet() SEKALI (Run → setupSheet)
 *    → otomatis buat header + styling + sheet summary
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy URL deployment → paste di src/lib/form-handler.ts
 */

// ═══════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════

var SHEET_NAME = 'Pendaftaran';
var HEADERS = [
  'No',
  'Timestamp',
  'Nama Lengkap',
  'Email',
  'WhatsApp',
  'Jabatan',
  'Sekolah / Instansi',
  'Kota Asal',
  'Kota Keberangkatan',
  'Program',
  'Jml Peserta',
  'Catatan',
  'Status',
  'Source',
];

var COL_WIDTHS = {
  1: 40,    // No
  2: 160,   // Timestamp
  3: 180,   // Nama
  4: 200,   // Email
  5: 140,   // WA
  6: 140,   // Jabatan
  7: 200,   // Sekolah
  8: 150,   // Kota Asal
  9: 160,   // Kota Berangkat
  10: 200,  // Program
  11: 100,  // Peserta
  12: 200,  // Catatan
  13: 100,  // Status
  14: 250,  // Source
};

// ═══════════════════════════════════════════════════════════════════════
// SETUP — Jalankan SEKALI untuk buat header & styling
// ═══════════════════════════════════════════════════════════════════════

function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Rename spreadsheet
  ss.rename('JAGATRIP — Data Pendaftaran');

  // Get or create sheet
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getActiveSheet();
    sheet.setName(SHEET_NAME);
  }

  // Clear existing content
  sheet.clear();

  // Set headers
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);

  // Style header row
  headerRange
    .setBackground('#1F2937')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setFontSize(10)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);

  // Set row height for header
  sheet.setRowHeight(1, 40);

  // Set column widths
  for (var col in COL_WIDTHS) {
    sheet.setColumnWidth(parseInt(col), COL_WIDTHS[col]);
  }

  // Freeze header row
  sheet.setFrozenRows(1);

  // Set default format for data area
  var dataRange = sheet.getRange(2, 1, 998, HEADERS.length);
  dataRange
    .setFontSize(10)
    .setVerticalAlignment('middle')
    .setWrap(true);

  // Alternate row colors (conditional formatting)
  var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=ISEVEN(ROW())')
    .setBackground('#F9FAFB')
    .setRanges([dataRange])
    .build();
  sheet.setConditionalFormatRules([rule]);

  // No column — auto number format
  sheet.getRange(2, 1, 998, 1)
    .setHorizontalAlignment('center')
    .setFontColor('#9CA3AF');

  // Timestamp column — date format
  sheet.getRange(2, 2, 998, 1)
    .setNumberFormat('dd/mm/yyyy hh:mm:ss')
    .setFontColor('#6B7280')
    .setFontSize(9);

  // Status column — center
  sheet.getRange(2, 13, 998, 1)
    .setHorizontalAlignment('center');

  // Status dropdown validation
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Baru', 'Dihubungi', 'Konfirmasi', 'DP', 'Lunas', 'Batal'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 13, 998, 1).setDataValidation(statusRule);

  // Create Summary sheet
  createSummarySheet(ss);

  // Add filter
  sheet.getRange(1, 1, 1, HEADERS.length).createFilter();

  SpreadsheetApp.flush();
  Logger.log('✅ Setup selesai! Sheet "' + SHEET_NAME + '" siap digunakan.');
}

function createSummarySheet(ss) {
  var summary = ss.getSheetByName('Summary');
  if (!summary) {
    summary = ss.insertSheet('Summary');
  }
  summary.clear();

  // Title
  summary.getRange('A1').setValue('JAGATRIP — Summary Pendaftaran')
    .setFontSize(14).setFontWeight('bold').setFontColor('#1F2937');

  summary.getRange('A2').setValue('Auto-update dari sheet Pendaftaran')
    .setFontSize(9).setFontColor('#9CA3AF');

  // Stats
  var stats = [
    ['Metrik', 'Jumlah'],
    ['Total Pendaftar', '=COUNTA(Pendaftaran!C2:C)'],
    ['Status: Baru', '=COUNTIF(Pendaftaran!M2:M,"Baru")'],
    ['Status: Dihubungi', '=COUNTIF(Pendaftaran!M2:M,"Dihubungi")'],
    ['Status: Konfirmasi', '=COUNTIF(Pendaftaran!M2:M,"Konfirmasi")'],
    ['Status: DP', '=COUNTIF(Pendaftaran!M2:M,"DP")'],
    ['Status: Lunas', '=COUNTIF(Pendaftaran!M2:M,"Lunas")'],
    ['Status: Batal', '=COUNTIF(Pendaftaran!M2:M,"Batal")'],
  ];

  summary.getRange(4, 1, stats.length, 2).setValues(stats);

  // Style stats header
  summary.getRange(4, 1, 1, 2)
    .setBackground('#1F2937').setFontColor('#FFFFFF').setFontWeight('bold');

  // Style stats
  summary.getRange(5, 2, stats.length - 1, 1)
    .setHorizontalAlignment('center').setFontWeight('bold').setFontSize(12);

  summary.setColumnWidth(1, 200);
  summary.setColumnWidth(2, 120);

  // Per program
  summary.getRange('A14').setValue('Pendaftar per Program')
    .setFontSize(11).setFontWeight('bold').setFontColor('#1F2937');

  var progStats = [
    ['Program', 'Jumlah'],
    ['Malaysia & Thailand', '=COUNTIF(Pendaftaran!J2:J,"*Malaysia*")'],
    ['Jepang', '=COUNTIF(Pendaftaran!J2:J,"*Jepang*")'],
    ['China', '=COUNTIF(Pendaftaran!J2:J,"*China*")'],
    ['Lainnya', '=COUNTA(Pendaftaran!J2:J)-COUNTIF(Pendaftaran!J2:J,"*Malaysia*")-COUNTIF(Pendaftaran!J2:J,"*Jepang*")-COUNTIF(Pendaftaran!J2:J,"*China*")'],
  ];

  summary.getRange(15, 1, progStats.length, 2).setValues(progStats);
  summary.getRange(15, 1, 1, 2)
    .setBackground('#E8611F').setFontColor('#FFFFFF').setFontWeight('bold');
  summary.getRange(16, 2, progStats.length - 1, 1)
    .setHorizontalAlignment('center').setFontWeight('bold');
}

// ═══════════════════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.getActiveSheet();

    var data = JSON.parse(e.postData.contents);

    // Auto-number
    var lastRow = sheet.getLastRow();
    var no = lastRow <= 1 ? 1 : lastRow;

    sheet.appendRow([
      no,
      data.timestamp ? new Date(data.timestamp) : new Date(),
      data.nama || '',
      data.email || '',
      data.wa || '',
      data.jabatan || '',
      data.sekolah || '',
      data.kota_asal || '',
      data.kota_berangkat || '',
      data.program || '',
      data.peserta || '',
      data.catatan || '',
      'Baru',
      data.source || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', row: no }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      service: 'JAGATRIP Registration API',
      sheet: SHEET_NAME,
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
