const PDFDocument = require('pdfkit');
const { PDFDocument: PDFLib } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'documents');
const pdfDir = path.join(docsDir, 'pdf');
const outputPath = path.join(docsDir, 'pdf', 'EOI_Complete_Booklet_The_Legal_Empire.pdf');

const txtFiles = [
  '01_Cover_Letter.txt',
  '02_Company_Profile.txt',
  '03_CV_Template_Key_Professionals.txt',
  '04_Work_Plan_Methodology.txt',
  '05_Team_Composition.txt',
  '06_EOI_Submission_Checklist.txt'
];

const sectionTitles = [
  'COVER LETTER',
  'ANNEXURE-H: COMPANY PROFILE',
  'ANNEXURE-F: CURRICULUM VITAE OF KEY PROFESSIONALS',
  'WORK PLAN AND METHODOLOGY',
  'TEAM COMPOSITION AND STRUCTURE',
  'EOI SUBMISSION CHECKLIST'
];

// Generate a single section PDF and return its buffer
function generateSectionPDF(txtFile, sectionIndex) {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(docsDir, txtFile);
    const content = fs.readFileSync(inputPath, 'utf-8');

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 72, bottom: 72, left: 65, right: 65 }
    });

    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trimEnd();

      if (doc.y > doc.page.height - doc.page.margins.bottom - 30) {
        doc.addPage();
      }

      if (/^={5,}$/.test(trimmed)) {
        doc.moveTo(doc.page.margins.left, doc.y)
           .lineTo(doc.page.margins.left + pageWidth, doc.y)
           .lineWidth(1.5).stroke('#1a3a5c');
        doc.moveDown(0.4);
        continue;
      }

      if (/^-{5,}$/.test(trimmed)) {
        doc.moveTo(doc.page.margins.left, doc.y)
           .lineTo(doc.page.margins.left + pageWidth, doc.y)
           .lineWidth(0.5).stroke('#888888');
        doc.moveDown(0.4);
        continue;
      }

      const leadingSpaces = line.length - line.trimStart().length;
      const isCentered = leadingSpaces > 15 && trimmed.length > 0;
      const isTitle = isCentered && (
        trimmed.includes('THE LEGAL EMPIRE') ||
        trimmed.includes('www.thelegalempire.org') ||
        trimmed.includes('END OF') ||
        trimmed.includes('EXPRESSION OF INTEREST') ||
        trimmed.includes('AUTHORIZED SIGNATORY')
      );
      const isSectionHeader = /^(\d+\.\s+)?[A-Z][A-Z\s\/()&,:-]{5,}$/.test(trimmed) && !trimmed.includes('[');
      const isSubHeader = /^(Phase \d|ABOUT|STATEMENT|LIST OF|OTHER DETAIL|S\/N)/.test(trimmed);

      if (trimmed === '') {
        doc.moveDown(0.5);
      } else if (isTitle) {
        doc.font('Helvetica-Bold')
           .fontSize(trimmed.includes('THE LEGAL EMPIRE') ? 16 : 11)
           .fillColor('#1a3a5c')
           .text(trimmed, { align: 'center' });
        doc.moveDown(0.2);
      } else if (isSectionHeader) {
        doc.moveDown(0.3);
        doc.font('Helvetica-Bold').fontSize(11).fillColor('#1a3a5c')
           .text(trimmed);
        doc.moveDown(0.2);
      } else if (isSubHeader) {
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#333333')
           .text(trimmed);
        doc.moveDown(0.1);
      } else if (isCentered) {
        doc.font('Helvetica').fontSize(10).fillColor('#333333')
           .text(trimmed, { align: 'center' });
        doc.moveDown(0.1);
      } else if (trimmed.includes('|') && !trimmed.startsWith('|')) {
        doc.font('Courier').fontSize(8).fillColor('#333333')
           .text(trimmed);
        doc.moveDown(0.05);
      } else if (trimmed.startsWith('   ')) {
        doc.font('Helvetica').fontSize(10).fillColor('#333333')
           .text(trimmed);
        doc.moveDown(0.1);
      } else {
        doc.font('Helvetica').fontSize(10).fillColor('#333333')
           .text(trimmed, { lineGap: 2 });
        doc.moveDown(0.1);
      }
    }

    doc.end();
  });
}

// Generate title page PDF
function generateTitlePage() {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 60, bottom: 60, left: 65, right: 65 }
    });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const centerX = doc.page.margins.left;

    // Top decorative line
    doc.moveDown(4);
    doc.moveTo(doc.page.margins.left, doc.y)
       .lineTo(doc.page.margins.left + pageWidth, doc.y)
       .lineWidth(3).stroke('#1a3a5c');
    doc.moveDown(0.5);
    doc.moveTo(doc.page.margins.left, doc.y)
       .lineTo(doc.page.margins.left + pageWidth, doc.y)
       .lineWidth(1).stroke('#1a3a5c');

    doc.moveDown(3);

    // Firm name
    doc.font('Helvetica-Bold').fontSize(28).fillColor('#1a3a5c')
       .text('THE LEGAL EMPIRE', { align: 'center' });
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(12).fillColor('#555555')
       .text('www.thelegalempire.org', { align: 'center' });

    doc.moveDown(2);
    doc.moveTo(doc.page.margins.left + 100, doc.y)
       .lineTo(doc.page.margins.left + pageWidth - 100, doc.y)
       .lineWidth(0.5).stroke('#999999');
    doc.moveDown(2);

    // Document title
    doc.font('Helvetica-Bold').fontSize(18).fillColor('#1a3a5c')
       .text('EXPRESSION OF INTEREST', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#333333')
       .text('for', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#1a3a5c')
       .text('Selection of Consulting Firm (National)', { align: 'center' });
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(11).fillColor('#333333')
       .text('for Preparation of Code of Delegated/Subordinate', { align: 'center' });
    doc.text('Legislation of Bangladesh through Identifying and', { align: 'center' });
    doc.text('Consolidating All Existing Subordinate Legislations', { align: 'center' });
    doc.text('(Rules, Regulations, By-Laws, Orders, Notifications, etc.)', { align: 'center' });

    doc.moveDown(1.5);

    // Package info box
    const boxY = doc.y;
    const boxX = doc.page.margins.left + 50;
    const boxW = pageWidth - 100;
    doc.roundedRect(boxX, boxY, boxW, 70, 5)
       .lineWidth(1).stroke('#1a3a5c');
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#1a3a5c')
       .text('Package No. SD-1 (1799-1970)', boxX + 20, boxY + 15, { width: boxW - 40, align: 'center' });
    doc.text('Package No. SD-5 (2011-till date)', { width: boxW - 40, align: 'center' });
    doc.y = boxY + 80;

    doc.moveDown(1.5);

    // Details
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#555555')
       .text('EOI Reference No.', centerX, doc.y, { continued: true, width: 180, align: 'right' });
    doc.font('Helvetica').text('  :  55.00.0000.120.14.065.24.1493');
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#555555')
       .text('Project Code', centerX, doc.y, { continued: true, width: 180, align: 'right' });
    doc.font('Helvetica').text('  :  224359600');
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#555555')
       .text('Date', centerX, doc.y, { continued: true, width: 180, align: 'right' });
    doc.font('Helvetica').text('  :  11/03/2026');

    doc.moveDown(2.5);

    // Submitted to
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#1a3a5c')
       .text('Submitted to:', { align: 'center' });
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#333333')
       .text('G. M. Atiqur Rahman Zamaly', { align: 'center' });
    doc.font('Helvetica').fontSize(9).fillColor('#555555')
       .text('Project Director (Joint Secretary)', { align: 'center' });
    doc.text('Strengthening Legislative Capacity and Legal Awareness Building Project', { align: 'center' });
    doc.text('Legislative and Parliamentary Affairs Division', { align: 'center' });
    doc.text('Ministry of Law, Justice and Parliamentary Affairs', { align: 'center' });
    doc.text('Bangladesh Secretariat, Dhaka-1000', { align: 'center' });

    doc.moveDown(3);

    // Bottom lines
    doc.moveTo(doc.page.margins.left, doc.y)
       .lineTo(doc.page.margins.left + pageWidth, doc.y)
       .lineWidth(1).stroke('#1a3a5c');
    doc.moveDown(0.5);
    doc.moveTo(doc.page.margins.left, doc.y)
       .lineTo(doc.page.margins.left + pageWidth, doc.y)
       .lineWidth(3).stroke('#1a3a5c');

    doc.end();
  });
}

// Generate Table of Contents page
function generateTOC() {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 72, bottom: 72, left: 65, right: 65 }
    });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    doc.moveDown(2);
    doc.moveTo(doc.page.margins.left, doc.y)
       .lineTo(doc.page.margins.left + pageWidth, doc.y)
       .lineWidth(1.5).stroke('#1a3a5c');
    doc.moveDown(1);

    doc.font('Helvetica-Bold').fontSize(20).fillColor('#1a3a5c')
       .text('TABLE OF CONTENTS', { align: 'center' });

    doc.moveDown(0.5);
    doc.moveTo(doc.page.margins.left, doc.y)
       .lineTo(doc.page.margins.left + pageWidth, doc.y)
       .lineWidth(1.5).stroke('#1a3a5c');

    doc.moveDown(2);

    const tocItems = [
      { num: '1', title: 'Cover Letter / Submission Letter', section: 'Section 1' },
      { num: '2', title: 'Company Profile (Annexure-H)', section: 'Section 2' },
      { num: '3', title: 'Curriculum Vitae of Key Professionals (Annexure-F)', section: 'Section 3' },
      { num: '4', title: 'Work Plan and Methodology', section: 'Section 4' },
      { num: '5', title: 'Team Composition and Structure', section: 'Section 5' },
      { num: '6', title: 'EOI Submission Checklist', section: 'Section 6' },
    ];

    for (const item of tocItems) {
      const y = doc.y;

      // Section number circle
      doc.circle(doc.page.margins.left + 15, y + 6, 12)
         .fill('#1a3a5c');
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#ffffff')
         .text(item.num, doc.page.margins.left + 3, y + 1, { width: 25, align: 'center' });

      // Title
      doc.font('Helvetica-Bold').fontSize(12).fillColor('#333333')
         .text(item.title, doc.page.margins.left + 40, y);

      // Dotted line
      doc.moveDown(0.3);
      const lineY = doc.y;
      doc.moveTo(doc.page.margins.left + 40, lineY)
         .lineTo(doc.page.margins.left + pageWidth, lineY)
         .dash(2, { space: 3 })
         .lineWidth(0.5).stroke('#cccccc');
      doc.undash();

      doc.moveDown(1);
    }

    doc.moveDown(3);
    doc.moveTo(doc.page.margins.left, doc.y)
       .lineTo(doc.page.margins.left + pageWidth, doc.y)
       .lineWidth(1).stroke('#1a3a5c');

    doc.moveDown(1.5);
    doc.font('Helvetica').fontSize(9).fillColor('#888888')
       .text('This booklet contains all documents submitted as part of the Expression of Interest (EOI)', { align: 'center' });
    doc.text('by The Legal Empire for Package No. SD-1 (1799-1970) and SD-5 (2011-till date).', { align: 'center' });

    doc.end();
  });
}

// Generate section divider page
function generateDividerPage(sectionNum, sectionTitle) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 60, bottom: 60, left: 65, right: 65 }
    });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    doc.moveDown(10);

    // Section number
    const cx = doc.page.width / 2;
    const cy = doc.y + 30;
    doc.circle(cx, cy, 35).fill('#1a3a5c');
    doc.font('Helvetica-Bold').fontSize(30).fillColor('#ffffff')
       .text(String(sectionNum), doc.page.margins.left, cy - 15, { width: pageWidth, align: 'center' });

    doc.y = cy + 45;
    doc.moveDown(1.5);

    doc.moveTo(doc.page.margins.left + 120, doc.y)
       .lineTo(doc.page.margins.left + pageWidth - 120, doc.y)
       .lineWidth(1.5).stroke('#1a3a5c');

    doc.moveDown(1.5);

    doc.font('Helvetica-Bold').fontSize(18).fillColor('#1a3a5c')
       .text(sectionTitle, { align: 'center' });

    doc.moveDown(1.5);

    doc.moveTo(doc.page.margins.left + 120, doc.y)
       .lineTo(doc.page.margins.left + pageWidth - 120, doc.y)
       .lineWidth(1.5).stroke('#1a3a5c');

    doc.end();
  });
}

async function main() {
  console.log('Generating complete EOI booklet...\n');

  // Generate all parts
  const titleBuf = await generateTitlePage();
  console.log('  + Title page');

  const tocBuf = await generateTOC();
  console.log('  + Table of Contents');

  const sectionBuffers = [];
  for (let i = 0; i < txtFiles.length; i++) {
    const dividerBuf = await generateDividerPage(i + 1, sectionTitles[i]);
    const contentBuf = await generateSectionPDF(txtFiles[i], i);
    sectionBuffers.push({ divider: dividerBuf, content: contentBuf });
    console.log(`  + Section ${i + 1}: ${sectionTitles[i]}`);
  }

  // Merge all PDFs using pdf-lib
  const mergedPdf = await PDFLib.create();

  // Add title page
  const titleDoc = await PDFLib.load(titleBuf);
  const titlePages = await mergedPdf.copyPages(titleDoc, titleDoc.getPageIndices());
  titlePages.forEach(p => mergedPdf.addPage(p));

  // Add TOC
  const tocDoc = await PDFLib.load(tocBuf);
  const tocPages = await mergedPdf.copyPages(tocDoc, tocDoc.getPageIndices());
  tocPages.forEach(p => mergedPdf.addPage(p));

  // Add each section (divider + content)
  for (const section of sectionBuffers) {
    const divDoc = await PDFLib.load(section.divider);
    const divPages = await mergedPdf.copyPages(divDoc, divDoc.getPageIndices());
    divPages.forEach(p => mergedPdf.addPage(p));

    const conDoc = await PDFLib.load(section.content);
    const conPages = await mergedPdf.copyPages(conDoc, conDoc.getPageIndices());
    conPages.forEach(p => mergedPdf.addPage(p));
  }

  const mergedBytes = await mergedPdf.save();
  fs.writeFileSync(outputPath, mergedBytes);

  const sizeMB = (mergedBytes.length / 1024).toFixed(1);
  const totalPages = mergedPdf.getPageCount();
  console.log(`\nBooklet created: ${outputPath}`);
  console.log(`Total pages: ${totalPages} | Size: ${sizeMB} KB`);
}

main().catch(console.error);
