import fs from 'fs';

const filePath = 'src/pages/investor/Financials.jsx';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');

const startIndex = lines.findIndex(line => line.includes('<h3 className="text-xl font-bold text-gray-900 mt-8 mb-4 uppercase">Consolidated Balance Sheet</h3>'));
const endIndex = lines.findIndex((line, index) => index > startIndex && line.includes('</div>          <p>The Group\'s PPE amounted to $170.7 million as at 31 December 2020 as compared to $171.7 million'));

if (startIndex === -1 || endIndex === -1) {
    console.error(`Could not find table bounds: startIndex ${startIndex}, endIndex ${endIndex}`);
    process.exit(1);
}

// Ensure the endIndex captures the </div> but keeps the <p> exactly where it is by splitting the line or matching the ending </div> 
// Wait, looking at the file:
// 465:           </div>          <p>The Group's PPE amounted to...
// Ah! They are on the same line because of my previous multi_replace call where I didn't include a newline between </div> and <p>.

// So the table ends at the </div> part of line 465. Let's fix this properly.
// First, insert a newline before <p> if they are on the same line to separate them.
const rawContent = fs.readFileSync(filePath, 'utf8');
const fixedContent = rawContent.replace('</div>          <p>The Group\'s PPE amounted to $170.7 million', '</div>\n          <p>The Group\'s PPE amounted to $170.7 million');
const linesFixed = fixedContent.split('\n');

const finalStartIndex = linesFixed.findIndex(line => line.includes('<h3 className="text-xl font-bold text-gray-900 mt-8 mb-4 uppercase">Consolidated Balance Sheet</h3>'));
const finalEndIndex = linesFixed.findIndex((line, index) => index > finalStartIndex && line.includes('</div>') && linesFixed[index+1] && linesFixed[index+1].includes('The Group\'s PPE amounted to $170.7 million'));

if (finalStartIndex === -1 || finalEndIndex === -1) {
     console.error(`Could not find fixed bounds: finalStartIndex ${finalStartIndex}, finalEndIndex ${finalEndIndex}`);
     process.exit(1);
}

// Extract the balance sheet table block
const balanceSheetLines = linesFixed.slice(finalStartIndex, finalEndIndex + 1);

// Remove the extracted lines from the original position
linesFixed.splice(finalStartIndex, balanceSheetLines.length);

// Find the target insertion point (immediately after the Comprehensive Income table's </div>)
// "Consolidated Statement of Comprehensive Income" starts at 209
const compIncomeStart = linesFixed.findIndex(line => line.includes('Consolidated Statement of Comprehensive Income'));
const compIncomeEnd = linesFixed.findIndex((line, index) => index > compIncomeStart && line.includes('</div>') && linesFixed[index+1].includes('July - December 2020 ("2H20")'));

if (compIncomeEnd === -1) {
     console.error(`Could not find insertion point`);
     process.exit(1);
}

// Insert the balance sheet block right after the Comprehensive Income table's </div>
linesFixed.splice(compIncomeEnd + 1, 0, ...balanceSheetLines);

fs.writeFileSync(filePath, linesFixed.join('\n'));
console.log('Successfully moved the Balance Sheet table.');
