const PDFDocument = require('pdfkit');
const { PDFDocument: PDFLib } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, 'SD-1_Package', 'Legislation_Database');
const pdfDir = path.join(dbDir, 'pdf');
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

const sections = [
  { file: '01_Legislation_1790-1834.txt', title: 'LEGISLATION 1790-1834: BENGAL REGULATIONS & CHARTER ACTS' },
  { file: '02_Legislation_1834-1880.txt', title: 'LEGISLATION 1834-1880: EARLY BRITISH ACTS' },
  { file: '03_Legislation_1880-1920.txt', title: 'LEGISLATION 1880-1920: MAJOR CODIFYING STATUTES' },
  { file: '04_Legislation_1920-1947.txt', title: 'LEGISLATION 1920-1947: PROVINCIAL AUTONOMY ERA' },
  { file: '05_Legislation_1947-1970.txt', title: 'LEGISLATION 1947-1970: PAKISTAN / EAST PAKISTAN' },
  { file: 'Complete_Legislation_1947_1970_East_Pakistan.txt', title: 'SUPPLEMENTARY: COMPLETE 1947-1970 COMPILATION' },
  { file: '03B_Supplementary_1880-1920.txt', title: 'SUPPLEMENTARY: 1880-1920 DETAILED RESEARCH' },
];

function genPDF(txtPath) {
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
      if (/^={5,}$/.test(t)) { doc.moveTo(55,doc.y).lineTo(55+pw,doc.y).lineWidth(1.5).stroke('#1a3a5c'); doc.moveDown(0.3); continue; }
      if (/^-{5,}$/.test(t)) { doc.moveTo(55,doc.y).lineTo(55+pw,doc.y).lineWidth(0.5).stroke('#888'); doc.moveDown(0.3); continue; }
      const lead = line.length - line.trimStart().length;
      const cen = lead > 15 && t.length > 0;
      const sec = /^(\d+\.\s+)?[A-Z][A-Z\s\/()&,:-]{5,}$/.test(t) && !t.includes('[');
      const hdr = /^(Part |Section |PART |SECTION |##|YEAR |S\/N)/.test(t);
      if (t === '') doc.moveDown(0.35);
      else if (sec) { doc.moveDown(0.2); doc.font('Helvetica-Bold').fontSize(10).fillColor('#1a3a5c').text(t); doc.moveDown(0.15); }
      else if (hdr) { doc.font('Helvetica-Bold').fontSize(9).fillColor('#333').text(t); doc.moveDown(0.08); }
      else if (cen) { doc.font('Helvetica').fontSize(9).fillColor('#333').text(t, { align: 'center' }); doc.moveDown(0.08); }
      else if (t.includes('|')) { doc.font('Courier').fontSize(7).fillColor('#333').text(t); doc.moveDown(0.02); }
      else { doc.font('Helvetica').fontSize(9).fillColor('#333').text(t, { lineGap: 1 }); doc.moveDown(0.06); }
    }
    doc.end();
  });
}

function genTitle() {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 60, bottom: 60, left: 65, right: 65 } });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    const pw = doc.page.width - 130;
    doc.moveDown(4);
    doc.moveTo(65,doc.y).lineTo(65+pw,doc.y).lineWidth(3).stroke('#1a3a5c');
    doc.moveDown(0.3); doc.moveTo(65,doc.y).lineTo(65+pw,doc.y).lineWidth(1).stroke('#1a3a5c');
    doc.moveDown(2.5);
    doc.font('Helvetica-Bold').fontSize(24).fillColor('#1a3a5c').text('COMPLETE DATABASE OF', { align: 'center' });
    doc.text('GOVERNMENT LEGISLATION', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(18).fillColor('#c0392b').text('1790 — 1970', { align: 'center' });
    doc.moveDown(1);
    doc.font('Helvetica').fontSize(12).fillColor('#333')
       .text('Applicable to the Territory of Present-Day Bangladesh', { align: 'center' });
    doc.moveDown(1.5);
    const bx = 90, by = doc.y, bw = pw - 50;
    doc.roundedRect(bx, by, bw, 110, 5).lineWidth(1).stroke('#1a3a5c');
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#1a3a5c')
       .text('Coverage:', bx + 20, by + 12, { width: bw - 40 });
    doc.font('Helvetica').fontSize(9.5).fillColor('#333');
    doc.text('Period I   :  Bengal Regulations & Charter Acts (1790-1834)', { width: bw - 40 });
    doc.text('Period II  :  Early British India Acts (1834-1880)', { width: bw - 40 });
    doc.text('Period III :  Major Codifying Statutes (1880-1920)', { width: bw - 40 });
    doc.text('Period IV  :  Provincial Autonomy Era (1920-1947)', { width: bw - 40 });
    doc.text('Period V   :  Pakistan / East Pakistan (1947-1970)', { width: bw - 40 });
    doc.y = by + 125;
    doc.moveDown(1.5);
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#555')
       .text('Total Legislation Entries: ~1,900+', { align: 'center' });
    doc.moveDown(2);
    doc.moveTo(65+100,doc.y).lineTo(65+pw-100,doc.y).lineWidth(0.5).stroke('#999');
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(16).fillColor('#1a3a5c').text('THE LEGAL EMPIRE', { align: 'center' });
    doc.font('Helvetica').fontSize(10).fillColor('#555').text('www.thelegalempire.org', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(9).fillColor('#888')
       .text('Package SD-1 | EOI Ref: 55.00.0000.120.14.065.24.1493', { align: 'center' });
    doc.moveDown(3);
    doc.moveTo(65,doc.y).lineTo(65+pw,doc.y).lineWidth(1).stroke('#1a3a5c');
    doc.moveDown(0.3); doc.moveTo(65,doc.y).lineTo(65+pw,doc.y).lineWidth(3).stroke('#1a3a5c');
    doc.end();
  });
}

function genDivider(num, title) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 60, bottom: 60, left: 65, right: 65 } });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    const pw = doc.page.width - 130;
    doc.moveDown(10);
    const cx = doc.page.width / 2, cy = doc.y + 25;
    doc.circle(cx, cy, 28).fill('#1a3a5c');
    doc.font('Helvetica-Bold').fontSize(22).fillColor('#fff').text(String(num), 65, cy - 11, { width: pw, align: 'center' });
    doc.y = cy + 38; doc.moveDown(1.5);
    doc.moveTo(65+100,doc.y).lineTo(65+pw-100,doc.y).lineWidth(1.5).stroke('#1a3a5c');
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#1a3a5c').text(title, { align: 'center' });
    doc.moveDown(1);
    doc.moveTo(65+100,doc.y).lineTo(65+pw-100,doc.y).lineWidth(1.5).stroke('#1a3a5c');
    doc.end();
  });
}

async function main() {
  console.log('Generating Legislation Database PDFs...\n');

  // Individual PDFs
  for (const s of sections) {
    const fp = path.join(dbDir, s.file);
    if (!fs.existsSync(fp)) { console.log(`  SKIP: ${s.file} not found`); continue; }
    const buf = await genPDF(fp);
    const name = path.basename(s.file, '.txt') + '.pdf';
    fs.writeFileSync(path.join(pdfDir, name), buf);
    console.log(`  + ${name} (${(buf.length/1024).toFixed(0)} KB)`);
  }

  // Merge booklet
  console.log('\n  Merging complete booklet...');
  const merged = await PDFLib.create();

  const tb = await genTitle();
  const td = await PDFLib.load(tb);
  (await merged.copyPages(td, td.getPageIndices())).forEach(p => merged.addPage(p));

  for (let i = 0; i < sections.length; i++) {
    const fp = path.join(pdfDir, path.basename(sections[i].file, '.txt') + '.pdf');
    if (!fs.existsSync(fp)) continue;

    const db = await genDivider(i + 1, sections[i].title);
    const dd = await PDFLib.load(db);
    (await merged.copyPages(dd, dd.getPageIndices())).forEach(p => merged.addPage(p));

    const sb = fs.readFileSync(fp);
    const sd = await PDFLib.load(sb);
    (await merged.copyPages(sd, sd.getPageIndices())).forEach(p => merged.addPage(p));
  }

  const bytes = await merged.save();
  const out = path.join(pdfDir, 'Complete_Legislation_Database_1790-1970.pdf');
  fs.writeFileSync(out, bytes);
  console.log(`\n  COMPLETE BOOKLET: ${out}`);
  console.log(`  Total pages: ${merged.getPageCount()} | Size: ${(bytes.length/1024).toFixed(0)} KB`);
}

main().catch(console.error);
