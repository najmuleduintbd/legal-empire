const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'SD-1_Package', '05_Supporting_Documents');
const pdfDir = path.join(srcDir, 'pdf');
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

const files = [
  { file: 'Bengal_Regulations_Subordinate_Legislation_1790-1858.txt', title: 'SUBORDINATE LEGISLATION UNDER BENGAL REGULATIONS (1790-1858)' },
  { file: 'Subordinate_Legislation_British_India_Acts_Bengal_Bangladesh.txt', title: 'SUBORDINATE LEGISLATION UNDER BRITISH INDIA ACTS (1858-1900)' },
  { file: 'Subordinate_Legislation_28_Parent_Acts_1900_1947.txt', title: 'SUBORDINATE LEGISLATION UNDER BRITISH INDIA ACTS (1900-1947)' },
  { file: 'Comprehensive_Subordinate_Legislation_East_Pakistan_1947_1970.txt', title: 'SUBORDINATE LEGISLATION — EAST PAKISTAN (1947-1970)' },
];

function generatePDF(txtPath) {
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
      if (doc.y > doc.page.height - 70) doc.addPage();

      // Double line (===)
      if (/^={5,}$/.test(t)) {
        doc.moveTo(55, doc.y).lineTo(55 + pw, doc.y).lineWidth(1.5).stroke('#1a3a5c');
        doc.moveDown(0.3);
        continue;
      }
      // Single line (---)
      if (/^-{5,}$/.test(t)) {
        doc.moveTo(55, doc.y).lineTo(55 + pw, doc.y).lineWidth(0.5).stroke('#888');
        doc.moveDown(0.3);
        continue;
      }

      const lead = line.length - line.trimStart().length;
      const centered = lead > 15 && t.length > 0;

      // Section headers (all caps, 6+ chars)
      const isSection = /^(SECTION |PART |ABBREVI|\d+\.\s+[A-Z][A-Z\s\/()&,:-]{5,}$)/.test(t) ||
                        (/^[A-Z][A-Z\s\/()&,:-]{8,}$/.test(t) && !t.includes('['));
      // Sub-headers
      const isSub = /^(Phase |FINDING |RECOMMENDATION |Chapter |Volume |Rule |Section |NOTE |STATUS )/.test(t) ||
                    /^[A-Z]\.\d+\s/.test(t) || /^\d+\.\d+\s/.test(t);
      // Field labels
      const isField = /^\s+(Title|Year|Authority|Description|Status|Parent|Gazette|Short Title|Structure|Full Title|Current Status)[\s:]/i.test(t);
      // Numbered items
      const isNum = /^\s*\d+\.\s+Title:/.test(t);

      if (t === '') {
        doc.moveDown(0.35);
      } else if (isSection) {
        doc.moveDown(0.25);
        doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#1a3a5c').text(t);
        doc.moveDown(0.15);
      } else if (isNum) {
        doc.moveDown(0.15);
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#333').text(t);
        doc.moveDown(0.05);
      } else if (isSub) {
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#333').text(t);
        doc.moveDown(0.1);
      } else if (isField) {
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#444').text(t);
        doc.moveDown(0.04);
      } else if (centered) {
        doc.font('Helvetica').fontSize(9.5).fillColor('#333').text(t, { align: 'center' });
        doc.moveDown(0.1);
      } else if (t.includes('|')) {
        doc.font('Courier').fontSize(7).fillColor('#333').text(t);
        doc.moveDown(0.02);
      } else {
        doc.font('Helvetica').fontSize(9).fillColor('#333').text(t, { lineGap: 1.2 });
        doc.moveDown(0.06);
      }
    }
    doc.end();
  });
}

async function main() {
  console.log('Generating Subordinate Legislation PDFs...\n');

  for (const f of files) {
    const fp = path.join(srcDir, f.file);
    if (!fs.existsSync(fp)) { console.log(`  SKIP: ${f.file} not found`); continue; }
    const buf = await generatePDF(fp);
    const name = path.basename(f.file, '.txt') + '.pdf';
    fs.writeFileSync(path.join(pdfDir, name), buf);
    console.log(`  + ${name} (${(buf.length / 1024).toFixed(0)} KB, ${Math.ceil(buf.length / 2000)} est. pages)`);
  }

  console.log('\nDone!');
}

main().catch(console.error);
