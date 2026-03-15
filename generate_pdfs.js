const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'documents');
const pdfDir = path.join(__dirname, 'documents', 'pdf');

if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

const txtFiles = fs.readdirSync(docsDir).filter(f => f.endsWith('.txt'));

function createPDF(txtFile) {
  const inputPath = path.join(docsDir, txtFile);
  const baseName = path.basename(txtFile, '.txt');
  const outputPath = path.join(pdfDir, baseName + '.pdf');
  const content = fs.readFileSync(inputPath, 'utf-8');

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 60, bottom: 60, left: 65, right: 65 },
    bufferPages: true
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  const lines = content.split('\n');
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  for (const line of lines) {
    const trimmed = line.trimEnd();

    // Check if we need a new page (leave room for at least 2 lines)
    if (doc.y > doc.page.height - doc.page.margins.bottom - 30) {
      doc.addPage();
    }

    // Full-width separator lines
    if (/^={5,}$/.test(trimmed)) {
      doc.moveTo(doc.page.margins.left, doc.y)
         .lineTo(doc.page.margins.left + pageWidth, doc.y)
         .lineWidth(1.5)
         .stroke('#1a3a5c');
      doc.moveDown(0.4);
      continue;
    }

    if (/^-{5,}$/.test(trimmed)) {
      doc.moveTo(doc.page.margins.left, doc.y)
         .lineTo(doc.page.margins.left + pageWidth, doc.y)
         .lineWidth(0.5)
         .stroke('#666666');
      doc.moveDown(0.4);
      continue;
    }

    // Centered headers (lines that are mostly centered with spaces)
    const leadingSpaces = line.length - line.trimStart().length;
    const isCentered = leadingSpaces > 15 && trimmed.length > 0;
    const isTitle = isCentered && (
      trimmed.includes('THE LEGAL EMPIRE') ||
      trimmed.includes('www.thelegalempire.org') ||
      trimmed.includes('END OF') ||
      trimmed.includes('EXPRESSION OF INTEREST') ||
      trimmed.includes('AUTHORIZED SIGNATORY')
    );

    // Section headers (all caps lines or numbered sections)
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
      doc.font('Helvetica-Bold')
         .fontSize(11)
         .fillColor('#1a3a5c')
         .text(trimmed, { align: 'left' });
      doc.moveDown(0.2);
    } else if (isSubHeader) {
      doc.font('Helvetica-Bold')
         .fontSize(10)
         .fillColor('#333333')
         .text(trimmed, { align: 'left' });
      doc.moveDown(0.1);
    } else if (isCentered) {
      doc.font('Helvetica')
         .fontSize(10)
         .fillColor('#333333')
         .text(trimmed, { align: 'center' });
      doc.moveDown(0.1);
    } else {
      // Handle table-like rows (contain | character)
      if (trimmed.includes('|') && !trimmed.startsWith('|')) {
        doc.font('Courier')
           .fontSize(8)
           .fillColor('#333333')
           .text(trimmed, { align: 'left' });
        doc.moveDown(0.05);
      } else if (trimmed.startsWith('   ')) {
        // Indented content
        doc.font('Helvetica')
           .fontSize(10)
           .fillColor('#333333')
           .text(trimmed, { indent: 0 });
        doc.moveDown(0.1);
      } else {
        doc.font('Helvetica')
           .fontSize(10)
           .fillColor('#333333')
           .text(trimmed, { align: 'left', lineGap: 2 });
        doc.moveDown(0.1);
      }
    }
  }

  // Add page numbers
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.font('Helvetica')
       .fontSize(8)
       .fillColor('#999999')
       .text(
         `The Legal Empire | EOI Ref: 55.00.0000.120.14.065.24.1493 | Page ${i + 1} of ${pages.count}`,
         doc.page.margins.left,
         doc.page.height - 40,
         { align: 'center', width: pageWidth }
       );
  }

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      console.log(`Created: ${outputPath}`);
      resolve();
    });
    stream.on('error', reject);
  });
}

async function main() {
  console.log(`Found ${txtFiles.length} text files to convert.\n`);
  for (const file of txtFiles) {
    await createPDF(file);
  }
  console.log('\nAll PDFs generated successfully!');
}

main().catch(console.error);
