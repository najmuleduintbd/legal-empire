const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const MNP_DIR = path.join(ROOT, 'New_Plan_With_MNP');
const OUT_DIR = path.join(MNP_DIR, 'output');
const CV_BASE = path.join(ROOT, 'cvs', 'CV_FORMAT');

// Convert a text file into an array of Paragraphs (monospace, 9pt)
function textToParas(filePath) {
  const text = fs.readFileSync(filePath, 'utf-8');
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  return lines.map(line => new Paragraph({
    children: [new TextRun({ text: line || ' ', font: 'Courier New', size: 18 })], // 18 half-pts = 9pt
  }));
}

// Create a section heading with a page break before it
function createSectionHeading(title) {
  return new Paragraph({
    children: [new TextRun({ text: title, bold: true, font: 'Arial', size: 28 })],
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
  });
}

// Build cover page paragraphs
function buildCoverPage(pkg, dateRange) {
  const spacer = (count = 1) => {
    const spacers = [];
    for (let i = 0; i < count; i++) {
      spacers.push(new Paragraph({ children: [new TextRun({ text: ' ', font: 'Arial', size: 24 })] }));
    }
    return spacers;
  };

  return [
    ...spacer(6),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'EXPRESSION OF INTEREST', bold: true, font: 'Arial', size: 52 })],
    }),
    ...spacer(2),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `Package ${pkg}: ${dateRange}`, bold: true, font: 'Arial', size: 32 })],
    }),
    ...spacer(2),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Compilation, Updating and Digitization of Subordinate Legislation of Bangladesh', font: 'Arial', size: 24 })],
    }),
    ...spacer(2),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'EOI Reference No.: 55.00.0000.120.14.065.24.1493', font: 'Arial', size: 22 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Project Code: 224359600', font: 'Arial', size: 22 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Closing Date: 30 March 2026, 12:00 PM', font: 'Arial', size: 22 })],
    }),
    ...spacer(4),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Submitted by:', font: 'Arial', size: 22 })],
    }),
    ...spacer(1),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'MNP LEGAL', bold: true, font: 'Arial', size: 36 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Barristers, Advocates & Legal Consultants', font: 'Arial', size: 22 })],
    }),
  ];
}

async function buildPackage(pkg, dateRange, eoiFile, teamFile, cvDir) {
  // Gather CV files in order
  const allCvFiles = fs.readdirSync(cvDir)
    .filter(f => f.startsWith('CV_') && f.endsWith('.txt'))
    .sort();

  const children = [];

  // 1. Cover page
  children.push(...buildCoverPage(pkg, dateRange));

  // 2. EOI Letter
  children.push(createSectionHeading('EOI Letter'));
  children.push(...textToParas(eoiFile));

  // 3. Firm Profile
  children.push(createSectionHeading('Firm Profile'));
  children.push(...textToParas(path.join(MNP_DIR, 'MNP_Firm_Profile.txt')));

  // 4. Team Composition
  children.push(createSectionHeading('Team Composition'));
  children.push(...textToParas(teamFile));

  // 5. CVs (Annexure-F)
  for (const cvFile of allCvFiles) {
    // Extract a readable name from the filename
    // e.g. CV_01_Christine_Richardson_Team_Leader.txt -> Christine Richardson - Team Leader
    const base = cvFile.replace('.txt', '');
    const parts = base.split('_');
    // Remove CV and number prefix (first 2 parts)
    const nameParts = parts.slice(2);
    const label = nameParts.join(' ').replace(/ (?=Team Leader|Senior|Legislative|Legal Analyst|Research Associate|QA Specialist|Data Management)/, ' - ');

    children.push(createSectionHeading(`Annexure-F: CV - ${label}`));
    children.push(...textToParas(path.join(cvDir, cvFile)));
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(OUT_DIR, `EOI_${pkg}_MNP_Legal.docx`);
  fs.writeFileSync(outPath, buffer);
  console.log(`Generated: ${outPath}`);
}

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  // Build SD-1 package
  await buildPackage(
    'SD-1',
    '1799-1970',
    path.join(MNP_DIR, 'SD1_EOI_MNP_Legal.txt'),
    path.join(MNP_DIR, 'SD1_Team_Composition_MNP.txt'),
    path.join(CV_BASE, 'SD1')
  );

  // Build SD-5 package
  await buildPackage(
    'SD-5',
    '2011-till date',
    path.join(MNP_DIR, 'SD5_EOI_MNP_Legal.txt'),
    path.join(MNP_DIR, 'SD5_Team_Composition_MNP.txt'),
    path.join(CV_BASE, 'SD5')
  );

  console.log('Done! Both Word documents generated.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
