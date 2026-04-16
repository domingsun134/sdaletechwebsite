import fs from 'fs';

const filePath = 'src/pages/investor/Financials.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the download attribute with target="_blank" rel="noopener noreferrer"
content = content.replace(
  /href="\/investor-relations\/Sunningdale_Financial_Statement_FY2020\.pdf"\s*\n\s*download="Sunningdale_Financial_Statement_FY2020\.pdf"/g,
  'href="/investor-relations/Sunningdale_Financial_Statement_FY2020.pdf"\n              target="_blank"\n              rel="noopener noreferrer"'
);

// Fallback if the space/newline formatting was slightly different
if (!content.includes('target="_blank"')) {
    content = content.replace(
      /download="Sunningdale_Financial_Statement_FY2020\.pdf"/g,
      'target="_blank"\n              rel="noopener noreferrer"'
    );
}

fs.writeFileSync(filePath, content);
console.log('Successfully updated the button to open in a new tab.');
