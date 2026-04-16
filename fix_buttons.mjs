import fs from 'fs';

const filePath = 'src/pages/investor/Financials.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace external PDF link with local link
content = content.replace(
  /href="https:\/\/investor\.sdaletech\.com\/newsroom\/20210226_185425_BHQ_MH5I9ENKZA968VFA\.1\.pdf"/g,
  'href="/investor-relations/Sunningdale_Financial_Statement_FY2020.pdf"\n              download="Sunningdale_Financial_Statement_FY2020.pdf"'
);

// We want to completely remove the second button (Financials Archive)
// It looks like:
//             <a
//               href="https://investor.sdaletech.com/financials_archive.html"
//               target="_blank"
//               ...
//               Financials Archive
//             </a>
// We can use a regex to replace everything from the start of the <a to the </a>
content = content.replace(
  /\s*<a\s*href="https:\/\/investor\.sdaletech\.com\/financials_archive\.html"[\s\S]*?Financials Archive[\s\S]*?<\/a>/,
  ''
);

// One tiny UI cleanup: the original external link had target="_blank" and rel="noopener noreferrer". We don't need those for a local download link.
content = content.replace(
  /download="Sunningdale_Financial_Statement_FY2020\.pdf"\s*target="_blank"\s*rel="noopener noreferrer"/,
  'download="Sunningdale_Financial_Statement_FY2020.pdf"'
);

fs.writeFileSync(filePath, content);
console.log('Successfully updated the buttons.');
