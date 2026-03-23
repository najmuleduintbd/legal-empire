const PDFDocument = require('pdfkit');
const { PDFDocument: PDFLib } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT_DIR = path.join(ROOT, 'documents', 'pdf');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── Color scheme ──────────────────────────────────────────────────────────────
const NAVY = '#1a3a5c';
const RED = '#c0392b';
const DARK = '#333';
const MID = '#555';
const LIGHT = '#888';

// ─── CV files organized by package ────────────────────────────────────────────
const cvsDir = path.join(ROOT, 'cvs');
const cvsPdfDir = path.join(ROOT, 'cvs', 'pdf');

// SD-1 Team CVs (in display order matching team roles)
const SD1_CVS = [
  // 1. Team Leader: Dr. Zahangir Alam Khan
  path.join(cvsPdfDir, 'CV_Dr_Zahangir_Alam_Khan.pdf'),
  // 2. Senior Legal Researcher: Md. Saiful Alam
  path.join(cvsPdfDir, 'CV_Md_Saiful_Alam.pdf'),
  // 3. Legislative Drafting Specialist: Sultana Nasira Khan
  path.join(cvsPdfDir, 'CV_Sultana_Nasira_Khan.pdf'),
  // 4. Legal Analyst / Codification Expert: Shuvra Chowdhury
  path.join(cvsPdfDir, 'CV_Shuvra_Chowdhury.pdf'),
  // 6. Research Associate: Ayesha Saleh
  path.join(cvsPdfDir, 'CV_Ayesha_Saleh.pdf'),
  // 7. Quality Assurance: Md. Golam Mostofa Hasan
  path.join(cvsPdfDir, 'CV_Md_Golam_Mostofa_Hasan.pdf'),
];

// SD-5 Team CVs (in display order matching team roles)
const SD5_CVS = [
  // 1. Team Leader: Nasreen Begum
  path.join(cvsDir, 'CV_Nasreen Begum_Updated 2026 (06.02.26).pdf'),
  // 2. Senior Legal Researcher: A. M. Md. Sayeed
  path.join(cvsDir, 'CV of A M Md Sayeed  March  2026  PDF .pdf'),
  // 3. Legislative Drafting Specialist: Humayun Farhad
  path.join(cvsPdfDir, 'CV_Humayun_Farhad.pdf'),
  // 4. Legal Analyst / Codification Expert: Malik Abdullah Al Amin
  path.join(cvsDir, 'Malik Abdullah Al Amin CV.pdf'),
  // 6. Research Associate: Ahmed Ehsanul Kabir
  path.join(cvsDir, 'Form-5A8-Curriculum-Vitae-AEK.pdf'),
  // 7. Quality Assurance: Dr. Md. Shahidul Islam
  path.join(cvsPdfDir, 'CV_for_World_Bank.pdf'),
];

// ─── Text document paths ──────────────────────────────────────────────────────
const DOCS = {
  profile: path.join(ROOT, 'documents', '02_Company_Profile.txt'),
  cvTemplate: path.join(ROOT, 'documents', '03_CV_Template_Key_Professionals.txt'),
  workplan: path.join(ROOT, 'documents', '04_Work_Plan_Methodology.txt'),
  checklist: path.join(ROOT, 'documents', '06_EOI_Submission_Checklist.txt'),
  // Package-specific documents
  sd1Cover: path.join(ROOT, 'documents', 'SD1_Cover_Letter.txt'),
  sd1Eoi: path.join(ROOT, 'documents', 'SD1_Expression_of_Interest.txt'),
  sd1Team: path.join(ROOT, 'documents', 'SD1_Team_Composition.txt'),
  sd5Cover: path.join(ROOT, 'documents', 'SD5_Cover_Letter.txt'),
  sd5Eoi: path.join(ROOT, 'documents', 'SD5_Expression_of_Interest.txt'),
  sd5Team: path.join(ROOT, 'documents', 'SD5_Team_Composition.txt'),
};

// ─── SD-1 specific content ────────────────────────────────────────────────────
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

// ─── Helper: generate PDF from text file ──────────────────────────────────────
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
      const isMainTitle = centered && (t.includes('THE LEGAL EMPIRE') || t.includes('CODE OF DELEGATED') || t.includes('EXPRESSION OF INTEREST'));
      const isSection = /^(\d+\.\s+)?[A-Z][A-Z\s\/()&,:-]{5,}$/.test(t) && !t.includes('[');
      const isSub = /^(Phase |FINDING |RECOMMENDATION |Part |Chapter |Volume |Rule |Section |PHASE |CRITERION|PROFESSIONAL|CV No\.)/.test(t);
      const isRef = /^(Ref No\.|Title|Date|Type|Subject|Authority|Parent Act|Scope|Status|Notes|Gazette|Firm Name|Website|Trade License|TIN|BIN|Registration|Established|Registered Address|Telephone|Email|Authorized)/.test(t);

      if (t === '') { doc.moveDown(0.35); }
      else if (isMainTitle) {
        doc.font('Helvetica-Bold').fontSize(t.includes('THE LEGAL EMPIRE') ? 14 : 11)
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

// ─── Title page generator ─────────────────────────────────────────────────────
function generateCoverPage(packageId, period, subtitle) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 60, right: 60 } });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    const pw = doc.page.width - 120;

    // Top border
    doc.moveDown(2);
    doc.moveTo(60, doc.y).lineTo(60 + pw, doc.y).lineWidth(3).stroke(NAVY);
    doc.moveDown(0.2);
    doc.moveTo(60, doc.y).lineTo(60 + pw, doc.y).lineWidth(1).stroke(NAVY);
    doc.moveDown(1.5);

    // Government header
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

    // Main title
    doc.font('Helvetica-Bold').fontSize(16).fillColor(NAVY)
       .text('EXPRESSION OF INTEREST', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(10).fillColor(DARK)
       .text('for Selection of Consulting Firm (National) for', { align: 'center' });
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(13).fillColor(NAVY)
       .text('Preparation of Code of Delegated/', { align: 'center' });
    doc.text('Subordinate Legislation of Bangladesh', { align: 'center' });
    doc.moveDown(1.2);

    // Package badge
    const bx = 100, by = doc.y, bw = pw - 80, bh = 75;
    doc.roundedRect(bx, by, bw, bh, 6).lineWidth(2).stroke(RED);
    doc.font('Helvetica-Bold').fontSize(18).fillColor(RED)
       .text(`PACKAGE ${packageId}`, bx + 20, by + 12, { width: bw - 40, align: 'center' });
    doc.font('Helvetica-Bold').fontSize(13).fillColor(DARK)
       .text(`Period: ${period}`, bx + 20, by + 38, { width: bw - 40, align: 'center' });
    doc.y = by + bh + 15;

    // Subtitle
    if (subtitle) {
      doc.moveDown(0.5);
      doc.font('Helvetica').fontSize(9).fillColor(MID).text(subtitle, { align: 'center' });
    }

    doc.moveDown(1.5);

    // Reference info box
    const rx = 80, ry = doc.y, rw = pw - 40, rh = 55;
    doc.roundedRect(rx, ry, rw, rh, 4).fill('#f0f4f8');
    doc.font('Helvetica-Bold').fontSize(9).fillColor(NAVY)
       .text('EOI Reference No.  :  55.00.0000.120.14.065.24.1493', rx + 15, ry + 10, { width: rw - 30 });
    doc.text('Project Code       :  224359600', { width: rw - 30 });
    doc.text('Closing Date       :  30 March 2026, 12:00 PM (Noon)', { width: rw - 30 });
    doc.y = ry + rh + 20;

    doc.moveDown(1);
    doc.moveTo(60 + 80, doc.y).lineTo(60 + pw - 80, doc.y).lineWidth(0.5).stroke(LIGHT);
    doc.moveDown(1);

    // Firm branding
    doc.font('Helvetica-Bold').fontSize(10).fillColor(NAVY)
       .text('Submitted by:', { align: 'center' });
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(20).fillColor(NAVY)
       .text('THE LEGAL EMPIRE', { align: 'center' });
    doc.font('Helvetica').fontSize(9.5).fillColor(MID)
       .text('www.thelegalempire.org', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(9).fillColor(DARK)
       .text('Date of Submission: March 2026', { align: 'center' });

    doc.moveDown(2);
    doc.moveTo(60, doc.y).lineTo(60 + pw, doc.y).lineWidth(1).stroke(NAVY);
    doc.moveDown(0.2);
    doc.moveTo(60, doc.y).lineTo(60 + pw, doc.y).lineWidth(3).stroke(NAVY);

    doc.end();
  });
}

// ─── Table of Contents page ──────────────────────────────────────────────────
function generateTOC(packageId, sectionList) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 55, bottom: 55, left: 60, right: 60 } });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    const pw = doc.page.width - 120;

    doc.moveDown(2);
    doc.font('Helvetica-Bold').fontSize(16).fillColor(NAVY)
       .text(`TABLE OF CONTENTS`, { align: 'center' });
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(10).fillColor(MID)
       .text(`EOI Submission Booklet — Package ${packageId}`, { align: 'center' });
    doc.moveDown(1);
    doc.moveTo(60, doc.y).lineTo(60 + pw, doc.y).lineWidth(1.5).stroke(NAVY);
    doc.moveDown(1);

    sectionList.forEach((s, i) => {
      const num = String(i + 1).padStart(2, '0');
      const prefix = s.isAnnexure ? `Annexure ${s.annexureLabel}` : `Section ${num}`;
      doc.font('Helvetica-Bold').fontSize(9.5).fillColor(NAVY)
         .text(`${prefix}`, 60, doc.y, { continued: true });
      doc.font('Helvetica').fontSize(9.5).fillColor(DARK)
         .text(`   ${s.title}`);
      doc.moveDown(0.3);
      if (doc.y > doc.page.height - 80) doc.addPage();
    });

    doc.moveDown(1);
    doc.moveTo(60, doc.y).lineTo(60 + pw, doc.y).lineWidth(1).stroke(NAVY);
    doc.end();
  });
}

// ─── Section divider page ─────────────────────────────────────────────────────
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

    // Circle with label
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

// ─── Merge PDFs together ──────────────────────────────────────────────────────
async function mergePDFs(buffers) {
  const merged = await PDFLib.create();
  for (const buf of buffers) {
    try {
      const src = await PDFLib.load(buf, { ignoreEncryption: true });
      const pages = await merged.copyPages(src, src.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    } catch (e) {
      console.warn(`  [WARN] Skipping a PDF that could not be loaded: ${e.message}`);
    }
  }
  return Buffer.from(await merged.save());
}

// ─── Build EOI Booklet for SD-1 ──────────────────────────────────────────────
async function buildSD1Booklet() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  Building EOI Booklet: PACKAGE SD-1 (1799-1970)');
  console.log('═══════════════════════════════════════════════════\n');

  const parts = [];

  // 1. Cover page
  console.log('  [1/8] Cover page...');
  parts.push(await generateCoverPage('SD-1', '1799 — 1970',
    'East India Company Period | British Crown Rule | Pakistan Period'));

  // 2. Table of contents
  const tocItems = [
    { title: 'Cover Letter' },
    { title: 'Expression of Interest (Main EOI Document)' },
    { title: 'Company Profile (Annexure-H)' },
    { title: 'Work Plan and Methodology' },
    { title: 'Team Composition and Organizational Structure' },
    { title: 'CVs of Key Professionals (Annexure-F)', isAnnexure: true, annexureLabel: 'F' },
    { title: 'EOI Submission Checklist' },
    { title: 'SD-1 Inception Report', isAnnexure: true, annexureLabel: 'I-1' },
    { title: 'SD-1 Master Inventory — Era 1 (1799-1858)', isAnnexure: true, annexureLabel: 'I-2' },
    { title: 'SD-1 Master Inventory — Era 2 (1858-1947)', isAnnexure: true, annexureLabel: 'I-3' },
    { title: 'SD-1 Master Inventory — Era 3 (1947-1970)', isAnnexure: true, annexureLabel: 'I-4' },
    { title: 'SD-1 Analysis and Classification Report', isAnnexure: true, annexureLabel: 'I-5' },
    { title: 'SD-1 Code — Volume I (1799-1858)', isAnnexure: true, annexureLabel: 'I-6' },
    { title: 'SD-1 Code — Volume II (1858-1947)', isAnnexure: true, annexureLabel: 'I-7' },
    { title: 'SD-1 Code — Volume III (1947-1970)', isAnnexure: true, annexureLabel: 'I-8' },
    { title: 'SD-1 Summary of Findings and Recommendations', isAnnexure: true, annexureLabel: 'I-9' },
    { title: 'SD-1 Comprehensive Index', isAnnexure: true, annexureLabel: 'I-10' },
  ];
  console.log('  [2/8] Table of contents...');
  parts.push(await generateTOC('SD-1', tocItems));

  // 3. EOI core documents (package-specific)
  const coreDocs = [
    { path: DOCS.sd1Cover, label: '1', title: 'COVER LETTER' },
    { path: DOCS.sd1Eoi, label: '2', title: 'EXPRESSION OF INTEREST' },
    { path: DOCS.profile, label: '3', title: 'COMPANY PROFILE (ANNEXURE-H)' },
    { path: DOCS.workplan, label: '4', title: 'WORK PLAN AND METHODOLOGY' },
    { path: DOCS.sd1Team, label: '5', title: 'TEAM COMPOSITION' },
  ];

  console.log('  [3/8] EOI core documents...');
  for (const d of coreDocs) {
    parts.push(await generateDivider(d.label, d.title));
    parts.push(await textToPDF(d.path));
    console.log(`         + ${path.basename(d.path)}`);
  }

  // 4. CVs section — SD-1 team CVs only
  console.log('  [4/8] CVs of Key Professionals (SD-1 Team)...');
  parts.push(await generateDivider('F', 'ANNEXURE-F: CVs OF KEY PROFESSIONALS', RED));

  for (const cvPath of SD1_CVS) {
    if (!fs.existsSync(cvPath)) {
      console.warn(`         [SKIP] Not found: ${path.basename(cvPath)}`);
      continue;
    }
    try {
      const buf = fs.readFileSync(cvPath);
      parts.push(buf);
      console.log(`         + ${path.basename(cvPath)}`);
    } catch (e) {
      console.warn(`         [SKIP] ${path.basename(cvPath)}: ${e.message}`);
    }
  }

  // 5. Checklist
  console.log('  [5/8] Submission checklist...');
  parts.push(await generateDivider('6', 'EOI SUBMISSION CHECKLIST'));
  parts.push(await textToPDF(DOCS.checklist));

  // 6. SD-1 Package content
  console.log('  [6/8] SD-1 package deliverables...');
  for (let i = 0; i < SD1_SECTIONS.length; i++) {
    const s = SD1_SECTIONS[i];
    const filePath = path.join(ROOT, s.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`         [SKIP] ${s.file} not found`);
      continue;
    }
    parts.push(await generateDivider(`I-${i + 1}`, `SD-1: ${s.title}`, '#2c3e50'));
    parts.push(await textToPDF(filePath));
    console.log(`         + ${path.basename(s.file)}`);
  }

  // 7. Merge everything
  console.log('  [7/8] Merging all sections...');
  const finalBuf = await mergePDFs(parts);

  // 8. Write output
  const outPath = path.join(OUT_DIR, 'EOI_Booklet_SD-1_The_Legal_Empire.pdf');
  fs.writeFileSync(outPath, finalBuf);
  const finalDoc = await PDFLib.load(finalBuf);
  console.log(`  [8/8] Done!\n`);
  console.log(`  OUTPUT: ${outPath}`);
  console.log(`  Pages : ${finalDoc.getPageCount()}`);
  console.log(`  Size  : ${(finalBuf.length / 1024).toFixed(1)} KB\n`);
  return outPath;
}

// ─── Build EOI Booklet for SD-5 ──────────────────────────────────────────────
async function buildSD5Booklet() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  Building EOI Booklet: PACKAGE SD-5 (2011-till date)');
  console.log('═══════════════════════════════════════════════════\n');

  const parts = [];

  // 1. Cover page
  console.log('  [1/6] Cover page...');
  parts.push(await generateCoverPage('SD-5', '2011 — till date',
    'Contemporary Subordinate Legislation of Bangladesh'));

  // 2. Table of contents
  const tocItems = [
    { title: 'Cover Letter' },
    { title: 'Expression of Interest (Main EOI Document)' },
    { title: 'Company Profile (Annexure-H)' },
    { title: 'Work Plan and Methodology' },
    { title: 'Team Composition and Organizational Structure' },
    { title: 'CVs of Key Professionals (Annexure-F)', isAnnexure: true, annexureLabel: 'F' },
    { title: 'EOI Submission Checklist' },
  ];
  console.log('  [2/6] Table of contents...');
  parts.push(await generateTOC('SD-5', tocItems));

  // 3. EOI core documents (package-specific for SD-5)
  const coreDocs = [
    { path: DOCS.sd5Cover, label: '1', title: 'COVER LETTER' },
    { path: DOCS.sd5Eoi, label: '2', title: 'EXPRESSION OF INTEREST' },
    { path: DOCS.profile, label: '3', title: 'COMPANY PROFILE (ANNEXURE-H)' },
    { path: DOCS.workplan, label: '4', title: 'WORK PLAN AND METHODOLOGY' },
    { path: DOCS.sd5Team, label: '5', title: 'TEAM COMPOSITION' },
  ];

  console.log('  [3/6] EOI core documents...');
  for (const d of coreDocs) {
    parts.push(await generateDivider(d.label, d.title));
    parts.push(await textToPDF(d.path));
    console.log(`         + ${path.basename(d.path)}`);
  }

  // 4. CVs section — SD-5 team CVs only
  console.log('  [4/6] CVs of Key Professionals (SD-5 Team)...');
  parts.push(await generateDivider('F', 'ANNEXURE-F: CVs OF KEY PROFESSIONALS', RED));

  for (const cvPath of SD5_CVS) {
    if (!fs.existsSync(cvPath)) {
      console.warn(`         [SKIP] Not found: ${path.basename(cvPath)}`);
      continue;
    }
    try {
      const buf = fs.readFileSync(cvPath);
      parts.push(buf);
      console.log(`         + ${path.basename(cvPath)}`);
    } catch (e) {
      console.warn(`         [SKIP] ${path.basename(cvPath)}: ${e.message}`);
    }
  }

  // 5. Checklist
  console.log('  [5/6] Submission checklist...');
  parts.push(await generateDivider('6', 'EOI SUBMISSION CHECKLIST'));
  parts.push(await textToPDF(DOCS.checklist));

  // 6. Merge and write
  console.log('  [6/6] Merging all sections...');
  const finalBuf = await mergePDFs(parts);

  const outPath = path.join(OUT_DIR, 'EOI_Booklet_SD-5_The_Legal_Empire.pdf');
  fs.writeFileSync(outPath, finalBuf);
  const finalDoc = await PDFLib.load(finalBuf);
  console.log(`  Done!\n`);
  console.log(`  OUTPUT: ${outPath}`);
  console.log(`  Pages : ${finalDoc.getPageCount()}`);
  console.log(`  Size  : ${(finalBuf.length / 1024).toFixed(1)} KB\n`);
  return outPath;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║   THE LEGAL EMPIRE — EOI BOOKLET GENERATOR              ║');
  console.log('║   Generating Separate PDFs for SD-1 and SD-5            ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const sd1Path = await buildSD1Booklet();
  const sd5Path = await buildSD5Booklet();

  console.log('══════════════════════════════════════════════════════');
  console.log('  GENERATION COMPLETE');
  console.log('══════════════════════════════════════════════════════');
  console.log(`  SD-1 Booklet: ${sd1Path}`);
  console.log(`  SD-5 Booklet: ${sd5Path}`);
  console.log('══════════════════════════════════════════════════════\n');
}

main().catch(console.error);
