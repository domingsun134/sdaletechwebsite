import fs from 'fs';

const filePath = 'src/pages/investor/Newsroom.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// The block to remove:
//         {/* Info Note */}
//         <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
//           <h3 className="text-lg font-semibold text-blue-900 mb-2">Company Status Update</h3>
//           <p className="text-blue-800">
//             Sunningdale Tech Ltd was acquired by Sunrise Technology Investment Holding Pte. Ltd. via a Scheme of
//             Arrangement and was delisted from the Singapore Exchange in April 2021.
//           </p>
//         </div>

content = content.replace(
  /\s*{\/\* Info Note \*\/}\s*<div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">[\s\S]*?<\/div>/,
  ''
);

fs.writeFileSync(filePath, content);
console.log('Successfully removed the company status update section.');
