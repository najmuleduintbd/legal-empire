const PDFDocument = require('pdfkit');
const { PDFDocument: PDFLib } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const MNP_DIR = path.join(ROOT, 'New_Plan_With_MNP');
const OUT_DIR = path.join(MNP_DIR, 'output');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const NAVY = '#1a3a5c';
const GOLD = '#b8860b';
const RED = '#c0392b';
const DARK = '#333';
const MID = '#555';
const LIGHT = '#888';

// ─── CV PDFs (from cvs/pdf converted folder + originals) ─────────────────────
const cvsPdfDir = path.join(ROOT, 'cvs', 'pdf');
const cvsOrigDir = path.join(MNP_DIR, 'CV');

// All available CVs — will be included in both booklets since
// the new team members don't have separate CV files yet
const ALL_CV_PDFS = [];

// Original PDFs from CV folder
['CV of A M Md Sayeed  March  2026  PDF .pdf',
 'CV_Nasreen Begum_Updated 2026 (06.02.26).pdf',
 'Form-5A8-Curriculum-Vitae-AEK.pdf',
 'Malik Abdullah Al Amin CV.pdf'
].forEach(f => {
  const p = path.join(cvsOrigDir, f);
  if (fs.existsSync(p)) ALL_CV_PDFS.push(p);
});

// Converted PDFs
if (fs.existsSync(cvsPdfDir)) {
  fs.readdirSync(cvsPdfDir)
    .filter(f => f.endsWith('.pdf'))
    .forEach(f => ALL_CV_PDFS.push(path.join(cvsPdfDir, f)));
}

// ─── Text documents ──────────────────────────────────────────────────────────
const DOCS = {
  sd1Eoi: path.join(MNP_DIR, 'SD1_EOI_MNP_Legal.txt'),
  sd5Eoi: path.join(MNP_DIR, 'SD5_EOI_MNP_Legal.txt'),
  sd1Team: path.join(MNP_DIR, 'SD1_Team_Composition_MNP.txt'),
  sd5Team: path.join(MNP_DIR, 'SD5_Team_Composition_MNP.txt'),
  firmProfile: path.join(MNP_DIR, 'MNP_Firm_Profile.txt'),
  // Reuse shared docs from the main project
  workplan: path.join(ROOT, 'documents', '04_Work_Plan_Methodology.txt'),
  checklist: path.join(ROOT, 'documents', '06_EOI_Submission_Checklist.txt'),
};

// ─── SD-1 package content ────────────────────────────────────────────────────
const SD1_SECTIONS = [
  { file: 'SD-1_Package/01_Inception_Report/SD1_Inception_Report.txt', title: 'INCEPTION REPORT' },
  { file: 'SD-1_Package/02_Master_Inventory/SD1_Master_Inventory_Era1_1799-1858.txt', title: 'MASTER INVENTORY — ERA 1 (1799-1858)' },
  { file: 'SD-1_Package/02_Master_Inventory/SD1_Master_Inventory_Era2_1858-1947.txt', title: 'MASTER INVENTORY — ERA 2 (1858-1947)' },
  { file: 'SD-1_Package/02_Master_Inventory/SD1_Master_Inventory_Era3_1947-1970.txt', title: 'MASTER INVENTORY — ERA 3 (1947-1970)' },
  { file: 'SD-1_Package/03_Analysis_Classification/SD1_Classification_Analysis_Report.txt', title: 'ANALYSIS AND CLASSIFICATION REPORT' },
  { file: 'SD-1_Package/04_Code_of_Subordinate_Legislation/SD1_Code_Volume_I_1799-1858.txt', title: 'CODE — VOLUME I (1799-1858)' },
  { file: 'SD-1_Package/04_Code_of_Subordinate_Legislation/SD1_Code_Volume_II_1858-1947.txt', title: 'CODE — VOLUME II (1858-1947)' },
  { file: 'SD-1_Package/04_Code_of_Subordinate_Legislation/SD1_Code_Volume_III_1947-1970.txt', title: 'CODE — VOLUME III (1947-1970)' },
  { file: 'SD-1_Package/05_Supporting_Documents/SD1_Summary_Findings_Recommendations.txt', title: 'SUMMARY OF FINDINGS AND RECOMMENDATIONS' },
  { file: 'SD-1_Package/05_Supporting_Documents/SD1_Comprehensive_Index.txt', title: 'COMPREHENSIVE INDEX' },
];

// ─── Text to PDF converter ──────────────────────────────────────────────────
function textToPDF(txtPath) {
  return new Promise((resolve, reject) => {
    const content = fs.readFileSync(txtPath, 'utf-8');
    const doc = new PDFDocument({ size: 'A4', margins: { top: 55, bottom: 55, left: 55, right: 55 } });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    const pw = doc.page.width - 110;

    for (const line of content.split('\n')) {
      const t = line.trimEnd();
      if (doc.y > doc.page.height - 75) doc.addPage();
      if (/^={5,}$/.test(t)) { doc.moveTo(55, doc.y).lineTo(55 + pw, doc.y).lineWidth(1.5).stroke(NAVY); doc.moveDown(0.3); continue; }
      if (/^-{5,}$/.test(t)) { doc.moveTo(55, doc.y).lineTo(55 + pw, doc.y).lineWidth(0.5).stroke(LIGHT); doc.moveDown(0.3); continue; }
      if (/^#{3,}$/.test(t)) { doc.moveTo(55, doc.y).lineTo(55 + pw, doc.y).lineWidth(2).stroke(NAVY); doc.moveDown(0.4); continue; }

      const lead = line.length - line.trimStart().length;
      const centered = lead > 15 && t.length > 0;
      const isMainTitle = centered && (t.includes('MNP LEGAL') || t.includes('EXPRESSION OF INTEREST') || t.includes('One Stop'));
      const isSection = /^(\d+\.\s+)?[A-Z][A-Z\s\/()&,:-]{5,}$/.test(t) && !t.includes('[');
      const isSub = /^(Phase |FINDING |RECOMMENDATION |Part |Chapter |Volume |PROFESSIONAL|CRITERION)/.test(t);
      const isRef = /^(Firm Name|Website|Trade License|TIN|BIN|Registration|Established|Address|Telephone|Email|Managing|Type of|Years in|Sub-Office|Date|EOI|Project|Package|Subject|Contact|Head Office|Baridhara)/.test(t);

      if (t === '') { doc.moveDown(0.35); }
      else if (isMainTitle) {
        doc.font('Helvetica-Bold').fontSize(t.includes('MNP LEGAL') ? 14 : 11)
           .fillColor(NAVY).text(t, { align: 'center' }); doc.moveDown(0.2);
      } else if (isSection) {
        doc.moveDown(0.2);
        doc.font('Helvetica-Bold').fontSize(10).fillColor(NAVY).text(t);
        doc.moveDown(0.15);
      } else if (isSub) {
        doc.font('Helvetica-Bold').fontSize(9).fillColor(DARK).text(t);
        doc.moveDown(0.08);
      } else if (isRef) {
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#444').text(t);
        doc.moveDown(0.05);
      } else if (centered) {
        doc.font('Helvetica').fontSize(9).fillColor(DARK).text(t, { align: 'center' });
        doc.moveDown(0.08);
      } else if (t.includes('|')) {
        doc.font('Courier').fontSize(7).fillColor(DARK).text(t);
        doc.moveDown(0.02);
      } else {
        doc.font('Helvetica').fontSize(9).fillColor(DARK).text(t, { lineGap: 1.2 });
        doc.moveDown(0.06);
      }
    }
    doc.end();
  });
}

// ─── Cover page ─────────────────────────────────────────────────────────────
function generateCover(packageId, period, subtitle) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 60, right: 60 } });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    const pw = doc.page.width - 120;

    doc.moveDown(2);
    doc.moveTo(60, doc.y).lineTo(60 + pw, doc.y).lineWidth(3).stroke(NAVY);
    doc.moveDown(0.2);
    doc.moveTo(60, doc.y).lineTo(60 + pw, doc.y).lineWidth(1).stroke(GOLD);
    doc.moveDown(1.5);

    doc.font('Helvetica-Bold').fontSize(12).fillColor(NAVY)
       .text('GOVERNMENT OF THE PEOPLE\'S REPUBLIC OF BANGLADESH', { align: 'center' });
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(9.5).fillColor(MID)
       .text('Ministry of Law, Justice and Parliamentary Affairs', { align: 'center' });
    doc.text('Legislative and Parliamentary Affairs Division', { align: 'center' });
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(8.5).fillColor(MID)
       .text('Strengthening Legislative Capacity and Legal Awareness Building Project', { align: 'center' });
    doc.moveDown(1.5);

    doc.font('Helvetica-Bold').fontSize(16).fillColor(NAVY)
       .text('EXPRESSION OF INTEREST', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(10).fillColor(DARK)
       .text('for Preparation of Code of Delegated/', { align: 'center' });
    doc.text('Subordinate Legislation of Bangladesh', { align: 'center' });
    doc.moveDown(1.2);

    // Package badge
    const bx = 100, by = doc.y, bw = pw - 80, bh = 75;
    doc.roundedRect(bx, by, bw, bh, 6).lineWidth(2).stroke(GOLD);
    doc.font('Helvetica-Bold').fontSize(18).fillColor(GOLD)
       .text(`PACKAGE ${packageId}`, bx + 20, by + 12, { width: bw - 40, align: 'center' });
    doc.font('Helvetica-Bold').fontSize(13).fillColor(DARK)
       .text(`Period: ${period}`, bx + 20, by + 38, { width: bw - 40, align: 'center' });
    doc.y = by + bh + 15;

    if (subtitle) {
      doc.moveDown(0.5);
      doc.font('Helvetica').fontSize(9).fillColor(MID).text(subtitle, { align: 'center' });
    }

    doc.moveDown(1.5);

    // Ref info
    const rx = 80, ry = doc.y, rw = pw - 40, rh = 55;
    doc.roundedRect(rx, ry, rw, rh, 4).fill('#f5f0e6');
    doc.font('Helvetica-Bold').fontSize(9).fillColor(NAVY)
       .text('EOI Reference No.  :  55.00.0000.120.14.065.24.1493', rx + 15, ry + 10, { width: rw - 30 });
    doc.text('Project Code       :  224359600', { width: rw - 30 });
    doc.text('Closing Date       :  30 March 2026, 12:00 PM (Noon)', { width: rw - 30 });
    doc.y = ry + rh + 20;

    doc.moveDown(1);
    doc.moveTo(60 + 80, doc.y).lineTo(60 + pw - 80, doc.y).lineWidth(0.5).stroke(GOLD);
    doc.moveDown(1);

    doc.font('Helvetica-Bold').fontSize(10).fillColor(NAVY)
       .text('Submitted by:', { align: 'center' });
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(20).fillColor(NAVY)
       .text('MNP LEGAL', { align: 'center' });
    doc.font('Helvetica').fontSize(9).fillColor(GOLD)
       .text('Barristers, Advocates & Legal Consultants', { align: 'center' });
    doc.font('Helvetica').fontSize(8.5).fillColor(MID)
       .text('\'One Stop Legal & Corporate Solutions\'', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(8.5).fillColor(MID)
       .text('Paramount Heights, Suite C-2 (15th Floor), Purana Paltan, Dhaka-1000', { align: 'center' });
    doc.text('info@mnplegal.org | +880 1711 677 630', { align: 'center' });

    doc.moveDown(2);
    doc.moveTo(60, doc.y).lineTo(60 + pw, doc.y).lineWidth(1).stroke(GOLD);
    doc.moveDown(0.2);
    doc.moveTo(60, doc.y).lineTo(60 + pw, doc.y).lineWidth(3).stroke(NAVY);

    doc.end();
  });
}

// ─── Section divider ────────────────────────────────────────────────────────
function generateDivider(label, title, color) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 55, bottom: 55, left: 60, right: 60 } });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    const pw = doc.page.width - 120;

    doc.moveDown(10);
    const cx = doc.page.width / 2, cy = doc.y + 20;
    doc.circle(cx, cy, 35).fill(color || NAVY);
    doc.font('Helvetica-Bold').fontSize(18).fillColor('#fff')
       .text(label, 60, cy - 9, { width: pw, align: 'center' });
    doc.y = cy + 50;
    doc.moveDown(1.2);
    doc.moveTo(60 + 80, doc.y).lineTo(60 + pw - 80, doc.y).lineWidth(1.5).stroke(color || NAVY);
    doc.moveDown(0.8);
    doc.font('Helvetica-Bold').fontSize(13).fillColor(color || NAVY)
       .text(title, { align: 'center' });
    doc.moveDown(0.8);
    doc.moveTo(60 + 80, doc.y).lineTo(60 + pw - 80, doc.y).lineWidth(1.5).stroke(color || NAVY);
    doc.end();
  });
}

// ─── TOC ────────────────────────────────────────────────────────────────────
function generateTOC(packageId, items) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 55, bottom: 55, left: 60, right: 60 } });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    const pw = doc.page.width - 120;

    doc.moveDown(2);
    doc.font('Helvetica-Bold').fontSize(16).fillColor(NAVY)
       .text('TABLE OF CONTENTS', { align: 'center' });
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(10).fillColor(MID)
       .text(`EOI Submission — Package ${packageId} | MNP Legal`, { align: 'center' });
    doc.moveDown(1);
    doc.moveTo(60, doc.y).lineTo(60 + pw, doc.y).lineWidth(1.5).stroke(NAVY);
    doc.moveDown(1);

    items.forEach((s, i) => {
      const num = String(i + 1).padStart(2, '0');
      doc.font('Helvetica-Bold').fontSize(9.5).fillColor(NAVY)
         .text(`${num}`, 60, doc.y, { continued: true });
      doc.font('Helvetica').fontSize(9.5).fillColor(DARK)
         .text(`   ${s}`);
      doc.moveDown(0.3);
      if (doc.y > doc.page.height - 80) doc.addPage();
    });

    doc.moveDown(1);
    doc.moveTo(60, doc.y).lineTo(60 + pw, doc.y).lineWidth(1).stroke(NAVY);
    doc.end();
  });
}

// ─── Merge PDFs ─────────────────────────────────────────────────────────────
async function mergePDFs(buffers) {
  const merged = await PDFLib.create();
  for (const buf of buffers) {
    try {
      const src = await PDFLib.load(buf, { ignoreEncryption: true });
      const pages = await merged.copyPages(src, src.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    } catch (e) {
      console.warn(`  [WARN] Skipping unreadable PDF: ${e.message.substring(0, 60)}`);
    }
  }
  return Buffer.from(await merged.save());
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD SD-1 BOOKLET
// ═══════════════════════════════════════════════════════════════════════════
async function buildSD1() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  MNP Legal — EOI Booklet: PACKAGE SD-1 (1799-1970)');
  console.log('═══════════════════════════════════════════════════\n');

  const parts = [];

  // Cover
  console.log('  [1] Cover page...');
  parts.push(await generateCover('SD-1', '1799 — 1970',
    'East India Company | British Crown | Pakistan Period'));

  // TOC
  console.log('  [2] Table of contents...');
  parts.push(await generateTOC('SD-1', [
    'Expression of Interest (Main EOI)',
    'Firm Profile (Annexure-H)',
    'Team Composition — SD-1',
    'CVs of Key Professionals (Annexure-F)',
    'SD-1 Inception Report',
    'SD-1 Master Inventories (Era 1, 2, 3)',
    'SD-1 Analysis & Classification Report',
    'SD-1 Code Volumes I, II, III',
    'SD-1 Summary of Findings & Recommendations',
    'SD-1 Comprehensive Index',
  ]));

  // Core docs
  const coreDocs = [
    { path: DOCS.sd1Eoi, label: '1', title: 'EXPRESSION OF INTEREST' },
    { path: DOCS.firmProfile, label: '2', title: 'FIRM PROFILE (ANNEXURE-H)' },
    { path: DOCS.sd1Team, label: '3', title: 'TEAM COMPOSITION — SD-1' },
  ];

  console.log('  [3] Core documents...');
  for (const d of coreDocs) {
    parts.push(await generateDivider(d.label, d.title));
    parts.push(await textToPDF(d.path));
    console.log(`       + ${path.basename(d.path)}`);
  }

  // CVs
  console.log('  [4] CVs...');
  parts.push(await generateDivider('F', 'ANNEXURE-F: CVs OF KEY PROFESSIONALS', GOLD));
  for (const cvPath of ALL_CV_PDFS) {
    try {
      parts.push(fs.readFileSync(cvPath));
      console.log(`       + ${path.basename(cvPath)}`);
    } catch (e) {
      console.warn(`       [SKIP] ${path.basename(cvPath)}`);
    }
  }

  // SD-1 deliverables
  console.log('  [5] SD-1 package content...');
  for (let i = 0; i < SD1_SECTIONS.length; i++) {
    const s = SD1_SECTIONS[i];
    const fp = path.join(ROOT, s.file);
    if (!fs.existsSync(fp)) { console.warn(`       [SKIP] ${s.file}`); continue; }
    parts.push(await generateDivider(String(i + 1), `SD-1: ${s.title}`, '#2c3e50'));
    parts.push(await textToPDF(fp));
    console.log(`       + ${path.basename(s.file)}`);
  }

  // Merge
  console.log('  [6] Merging...');
  const final = await mergePDFs(parts);
  const outPath = path.join(OUT_DIR, 'EOI_Booklet_SD-1_MNP_Legal.pdf');
  fs.writeFileSync(outPath, final);
  const doc = await PDFLib.load(final);
  console.log(`\n  OUTPUT: ${outPath}`);
  console.log(`  Pages : ${doc.getPageCount()} | Size: ${(final.length / 1024).toFixed(1)} KB\n`);
  return outPath;
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD SD-5 BOOKLET
// ═══════════════════════════════════════════════════════════════════════════
async function buildSD5() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  MNP Legal — EOI Booklet: PACKAGE SD-5 (2011-till date)');
  console.log('═══════════════════════════════════════════════════\n');

  const parts = [];

  console.log('  [1] Cover page...');
  parts.push(await generateCover('SD-5', '2011 — till date',
    'Contemporary Subordinate Legislation of Bangladesh'));

  console.log('  [2] Table of contents...');
  parts.push(await generateTOC('SD-5', [
    'Expression of Interest (Main EOI)',
    'Firm Profile (Annexure-H)',
    'Team Composition — SD-5',
    'CVs of Key Professionals (Annexure-F)',
  ]));

  const coreDocs = [
    { path: DOCS.sd5Eoi, label: '1', title: 'EXPRESSION OF INTEREST' },
    { path: DOCS.firmProfile, label: '2', title: 'FIRM PROFILE (ANNEXURE-H)' },
    { path: DOCS.sd5Team, label: '3', title: 'TEAM COMPOSITION — SD-5' },
  ];

  console.log('  [3] Core documents...');
  for (const d of coreDocs) {
    parts.push(await generateDivider(d.label, d.title));
    parts.push(await textToPDF(d.path));
    console.log(`       + ${path.basename(d.path)}`);
  }

  console.log('  [4] CVs...');
  parts.push(await generateDivider('F', 'ANNEXURE-F: CVs OF KEY PROFESSIONALS', GOLD));
  for (const cvPath of ALL_CV_PDFS) {
    try {
      parts.push(fs.readFileSync(cvPath));
      console.log(`       + ${path.basename(cvPath)}`);
    } catch (e) {
      console.warn(`       [SKIP] ${path.basename(cvPath)}`);
    }
  }

  console.log('  [5] Merging...');
  const final = await mergePDFs(parts);
  const outPath = path.join(OUT_DIR, 'EOI_Booklet_SD-5_MNP_Legal.pdf');
  fs.writeFileSync(outPath, final);
  const doc = await PDFLib.load(final);
  console.log(`\n  OUTPUT: ${outPath}`);
  console.log(`  Pages : ${doc.getPageCount()} | Size: ${(final.length / 1024).toFixed(1)} KB\n`);
  return outPath;
}

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║   MNP LEGAL — EOI BOOKLET GENERATOR                     ║');
  console.log('║   Generating Separate PDFs for SD-1 and SD-5            ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const sd1 = await buildSD1();
  const sd5 = await buildSD5();

  console.log('══════════════════════════════════════════════════════');
  console.log('  GENERATION COMPLETE — MNP LEGAL');
  console.log('══════════════════════════════════════════════════════');
  console.log(`  SD-1: ${sd1}`);
  console.log(`  SD-5: ${sd5}`);
  console.log('══════════════════════════════════════════════════════\n');
}

main().catch(console.error);
