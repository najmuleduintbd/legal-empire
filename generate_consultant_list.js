const { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun, WidthType, AlignmentType, BorderStyle, HeadingLevel } = require('docx');
const fs = require('fs');
const path = require('path');

const consultants = [
  { no: 1, name: 'Dr. Zahangir Alam Khan', sd1: 'Team Leader', sd5: '—' },
  { no: 2, name: 'Nasreen Begum', sd1: '—', sd5: 'Team Leader' },
  { no: 3, name: 'Md. Saiful Alam', sd1: 'Senior Legal Researcher', sd5: '—' },
  { no: 4, name: 'A. M. Md. Sayeed', sd1: '—', sd5: 'Senior Legal Researcher' },
  { no: 5, name: 'Sultana Nasira Khan', sd1: 'Legislative Drafting Specialist', sd5: '—' },
  { no: 6, name: 'Humayun Farhad', sd1: '—', sd5: 'Legislative Drafting Specialist' },
  { no: 7, name: 'Shuvra Chowdhury', sd1: 'Legal Analyst / Codification Expert', sd5: '—' },
  { no: 8, name: 'Malik Abdullah Al Amin', sd1: '—', sd5: 'Legal Analyst / Codification Expert' },
  { no: 9, name: 'Najmul Hoque', sd1: 'Data Management & IT Specialist', sd5: '—' },
  { no: 10, name: 'Mahbub Khan', sd1: '—', sd5: 'Data Management & IT Specialist' },
  { no: 11, name: 'Ayesha Saleh', sd1: 'Research Associate', sd5: '—' },
  { no: 12, name: 'Ahmed Ehsanul Kabir', sd1: '—', sd5: 'Research Associate' },
  { no: 13, name: 'Md. Golam Mostofa Hasan', sd1: 'QA / Review Specialist', sd5: '—' },
  { no: 14, name: 'Dr. Md. Shahidul Islam', sd1: '—', sd5: 'QA / Review Specialist' },
];

const borderStyle = { style: BorderStyle.SINGLE, size: 1, color: '999999' };
const borders = { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle };

function headerCell(text) {
  return new TableCell({
    borders,
    shading: { fill: '1a3a5c' },
    width: { size: text === '#' ? 5 : text === 'Consultant Name' ? 35 : 30, type: WidthType.PERCENTAGE },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 22, font: 'Calibri' })]
    })]
  });
}

function dataCell(text, bold) {
  return new TableCell({
    borders,
    children: [new Paragraph({
      spacing: { before: 50, after: 50 },
      indent: { left: 80 },
      children: [new TextRun({ text, bold: !!bold, size: 22, font: 'Calibri', color: text === '—' ? '999999' : '333333' })]
    })]
  });
}

const table = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({ children: [headerCell('#'), headerCell('Consultant Name'), headerCell('SD-1 Role'), headerCell('SD-5 Role')], tableHeader: true }),
    ...consultants.map(c => new TableRow({
      children: [
        dataCell(String(c.no)),
        dataCell(c.name, true),
        dataCell(c.sd1),
        dataCell(c.sd5),
      ]
    }))
  ]
});

const doc = new Document({
  sections: [{
    properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: 'THE LEGAL EMPIRE', bold: true, size: 32, font: 'Calibri', color: '1a3a5c' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: 'www.thelegalempire.org', size: 20, font: 'Calibri', color: '666666' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: 'List of Consultants — Package SD-1 & SD-5', bold: true, size: 26, font: 'Calibri', color: '333333' })]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: 'EOI Reference No.: 55.00.0000.120.14.065.24.1493', size: 20, font: 'Calibri', color: '555555' })]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: 'Total Consultants: 14 (7 per package)', size: 20, font: 'Calibri', color: '555555' })]
      }),
      table,
      new Paragraph({ spacing: { before: 300 }, children: [] }),
      new Paragraph({
        children: [new TextRun({ text: 'Note: ', bold: true, size: 20, font: 'Calibri' }), new TextRun({ text: 'CVs pending for Najmul Hoque (SD-1 IT) and Mahbub Khan (SD-5 IT).', size: 20, font: 'Calibri', color: 'c0392b' })]
      }),
    ]
  }]
});

(async () => {
  const buf = await Packer.toBuffer(doc);
  const outPath = path.join(__dirname, 'documents', 'pdf', 'Consultant_List_SD1_SD5.docx');
  fs.writeFileSync(outPath, buf);
  console.log(`Saved: ${outPath}`);
})();
