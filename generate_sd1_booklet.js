const PDFDocument = require('pdfkit');
const { PDFDocument: PDFLib } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const sd1Dir = path.join(__dirname, 'SD-1_Package');
const pdfDir = path.join(sd1Dir, 'pdf');

if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

// All files in order
const sections = [
  { file: '01_Inception_Report/SD1_Inception_Report.txt', title: 'INCEPTION REPORT' },
  { file: '02_Master_Inventory/SD1_Master_Inventory_Era1_1799-1858.txt', title: 'MASTER INVENTORY — ERA 1 (1799-1858)' },
  { file: '02_Master_Inventory/SD1_Master_Inventory_Era2_1858-1947.txt', title: 'MASTER INVENTORY — ERA 2 (1858-1947)' },
  { file: '02_Master_Inventory/SD1_Master_Inventory_Era3_1947-1970.txt', title: 'MASTER INVENTORY — ERA 3 (1947-1970)' },
  { file: '03_Analysis_Classification/SD1_Classification_Analysis_Report.txt', title: 'ANALYSIS AND CLASSIFICATION REPORT' },
  { file: '04_Code_of_Subordinate_Legislation/SD1_Code_Volume_I_1799-1858.txt', title: 'CODE — VOLUME I (1799-1858)' },
  { file: '04_Code_of_Subordinate_Legislation/SD1_Code_Volume_II_1858-1947.txt', title: 'CODE — VOLUME II (1858-1947)' },
  { file: '04_Code_of_Subordinate_Legislation/SD1_Code_Volume_III_1947-1970.txt', title: 'CODE — VOLUME III (1947-1970)' },
  { file: '05_Supporting_Documents/SD1_Summary_Findings_Recommendations.txt', title: 'SUMMARY OF FINDINGS AND RECOMMENDATIONS' },
  { file: '05_Supporting_Documents/SD1_Comprehensive_Index.txt', title: 'COMPREHENSIVE INDEX' },
];

function generateSectionPDF(txtPath) {
  return new Promise((resolve, reject) => {
    const content = fs.readFileSync(txtPath, 'utf-8');
    const doc = new PDFDocument({ size: 'A4', margins: { top: 60, bottom: 60, left: 60, right: 60 } });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageW = doc.page.width - 120;
    const lines = content.split('\n');

    for (const line of lines) {
      const t = line.trimEnd();
      if (doc.y > doc.page.height - 80) doc.addPage();

      if (/^={5,}$/.test(t)) {
        doc.moveTo(60, doc.y).lineTo(60 + pageW, doc.y).lineWidth(1.5).stroke('#1a3a5c');
        doc.moveDown(0.3); continue;
      }
      if (/^-{5,}$/.test(t)) {
        doc.moveTo(60, doc.y).lineTo(60 + pageW, doc.y).lineWidth(0.5).stroke('#888');
        doc.moveDown(0.3); continue;
      }

      const lead = line.length - line.trimStart().length;
      const centered = lead > 15 && t.length > 0;
      const isMainTitle = centered && (t.includes('THE LEGAL EMPIRE') || t.includes('CODE OF DELEGATED'));
      const isSection = /^(\d+\.\s+)?[A-Z][A-Z\s\/()&,:-]{5,}$/.test(t) && !t.includes('[');
      const isSub = /^(Phase |FINDING |RECOMMENDATION |Part |Chapter |Volume |Rule |Section )/.test(t);
      const isRef = /^Ref No\.|^Title|^Date|^Type|^Subject|^Authority|^Parent Act|^Scope|^Status|^Notes|^Gazette/.test(t);

      if (t === '') { doc.moveDown(0.4); }
      else if (isMainTitle) {
        doc.font('Helvetica-Bold').fontSize(t.includes('THE LEGAL EMPIRE') ? 15 : 12)
           .fillColor('#1a3a5c').text(t, { align: 'center' }); doc.moveDown(0.2);
      } else if (isSection) {
        doc.moveDown(0.2);
        doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#1a3a5c').text(t);
        doc.moveDown(0.15);
      } else if (isSub) {
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#333').text(t);
        doc.moveDown(0.1);
      } else if (isRef) {
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#444').text(t);
        doc.moveDown(0.05);
      } else if (centered) {
        doc.font('Helvetica').fontSize(9.5).fillColor('#333').text(t, { align: 'center' });
        doc.moveDown(0.1);
      } else if (t.includes('|')) {
        doc.font('Courier').fontSize(7.5).fillColor('#333').text(t);
        doc.moveDown(0.03);
      } else {
        doc.font('Helvetica').fontSize(9.5).fillColor('#333').text(t, { lineGap: 1.5 });
        doc.moveDown(0.08);
      }
    }
    doc.end();
  });
}

function generateTitlePage() {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 60, bottom: 60, left: 65, right: 65 } });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    const pw = doc.page.width - 130;

    doc.moveDown(3);
    doc.moveTo(65, doc.y).lineTo(65 + pw, doc.y).lineWidth(3).stroke('#1a3a5c');
    doc.moveDown(0.3);
    doc.moveTo(65, doc.y).lineTo(65 + pw, doc.y).lineWidth(1).stroke('#1a3a5c');
    doc.moveDown(2);

    doc.font('Helvetica-Bold').fontSize(14).fillColor('#1a3a5c')
       .text('GOVERNMENT OF THE PEOPLE\'S REPUBLIC OF BANGLADESH', { align: 'center' });
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(10).fillColor('#555')
       .text('Ministry of Law, Justice and Parliamentary Affairs', { align: 'center' });
    doc.text('Legislative and Parliamentary Affairs Division', { align: 'center' });
    doc.moveDown(2);

    doc.font('Helvetica-Bold').fontSize(22).fillColor('#1a3a5c')
       .text('CODE OF DELEGATED/', { align: 'center' });
    doc.text('SUBORDINATE LEGISLATION', { align: 'center' });
    doc.text('OF BANGLADESH', { align: 'center' });
    doc.moveDown(1);

    doc.font('Helvetica-Bold').fontSize(16).fillColor('#c0392b')
       .text('PACKAGE SD-1', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#333')
       .text('Period: 1799 — 1970', { align: 'center' });
    doc.moveDown(1.5);

    const bx = 90, by = doc.y, bw = pw - 50;
    doc.roundedRect(bx, by, bw, 80, 5).lineWidth(1).stroke('#1a3a5c');
    doc.font('Helvetica').fontSize(10).fillColor('#333')
       .text('Volume I  :  Era 1 — East India Company Period (1799-1858)', bx + 20, by + 12, { width: bw - 40 });
    doc.text('Volume II :  Era 2 — British Crown Rule (1858-1947)', { width: bw - 40 });
    doc.text('Volume III:  Era 3 — Pakistan Period (1947-1970)', { width: bw - 40 });
    doc.y = by + 95;

    doc.moveDown(1.5);
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#555')
       .text('EOI Ref No.  :  55.00.0000.120.14.065.24.1493', { align: 'center' });
    doc.text('Project Code :  224359600', { align: 'center' });
    doc.moveDown(2);

    doc.moveTo(65 + 100, doc.y).lineTo(65 + pw - 100, doc.y).lineWidth(0.5).stroke('#999');
    doc.moveDown(1);

    doc.font('Helvetica-Bold').fontSize(11).fillColor('#1a3a5c')
       .text('Prepared by:', { align: 'center' });
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(18).fillColor('#1a3a5c')
       .text('THE LEGAL EMPIRE', { align: 'center' });
    doc.font('Helvetica').fontSize(10).fillColor('#555')
       .text('www.thelegalempire.org', { align: 'center' });

    doc.moveDown(3);
    doc.moveTo(65, doc.y).lineTo(65 + pw, doc.y).lineWidth(1).stroke('#1a3a5c');
    doc.moveDown(0.3);
    doc.moveTo(65, doc.y).lineTo(65 + pw, doc.y).lineWidth(3).stroke('#1a3a5c');

    doc.end();
  });
}

function generateDivider(num, title) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 60, bottom: 60, left: 65, right: 65 } });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    const pw = doc.page.width - 130;

    doc.moveDown(10);
    const cx = doc.page.width / 2, cy = doc.y + 25;
    doc.circle(cx, cy, 30).fill('#1a3a5c');
    doc.font('Helvetica-Bold').fontSize(24).fillColor('#fff')
       .text(String(num), 65, cy - 12, { width: pw, align: 'center' });
    doc.y = cy + 40;
    doc.moveDown(1.5);
    doc.moveTo(65 + 100, doc.y).lineTo(65 + pw - 100, doc.y).lineWidth(1.5).stroke('#1a3a5c');
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#1a3a5c')
       .text(title, { align: 'center' });
    doc.moveDown(1);
    doc.moveTo(65 + 100, doc.y).lineTo(65 + pw - 100, doc.y).lineWidth(1.5).stroke('#1a3a5c');
    doc.end();
  });
}

async function main() {
  console.log('Generating SD-1 Complete Booklet...\n');

  // Individual PDFs
  for (const s of sections) {
    const buf = await generateSectionPDF(path.join(sd1Dir, s.file));
    const name = path.basename(s.file, '.txt') + '.pdf';
    fs.writeFileSync(path.join(pdfDir, name), buf);
    console.log(`  + ${name}`);
  }

  // Merge into complete booklet
  console.log('\n  Merging into complete booklet...');
  const merged = await PDFLib.create();

  const titleBuf = await generateTitlePage();
  const titleDoc = await PDFLib.load(titleBuf);
  (await merged.copyPages(titleDoc, titleDoc.getPageIndices())).forEach(p => merged.addPage(p));

  for (let i = 0; i < sections.length; i++) {
    const divBuf = await generateDivider(i + 1, sections[i].title);
    const divDoc = await PDFLib.load(divBuf);
    (await merged.copyPages(divDoc, divDoc.getPageIndices())).forEach(p => merged.addPage(p));

    const secBuf = fs.readFileSync(path.join(pdfDir, path.basename(sections[i].file, '.txt') + '.pdf'));
    const secDoc = await PDFLib.load(secBuf);
    (await merged.copyPages(secDoc, secDoc.getPageIndices())).forEach(p => merged.addPage(p));
  }

  const bytes = await merged.save();
  const outPath = path.join(pdfDir, 'SD1_Complete_Code_Package_1799-1970.pdf');
  fs.writeFileSync(outPath, bytes);

  console.log(`\n  COMPLETE BOOKLET: ${outPath}`);
  console.log(`  Total pages: ${merged.getPageCount()} | Size: ${(bytes.length / 1024).toFixed(1)} KB`);
  console.log('\nDone!');
}

main().catch(console.error);
