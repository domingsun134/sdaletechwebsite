import fs from 'fs';

const filePath = 'src/pages/investor/Financials.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix duplicate classNames
// For example: <h4 className="font-semibold text-gray-800 text-lg mt-8 mb-4" className="font-semibold text-gray-800 mt-6">
// we will just keep the first one
content = content.replace(/className="[^"]*"\s+className="([^"]*)"/g, (match, p1) => {
    // just return the first one safely by using a regex replace logic
    return match.split(' className=')[0];
});

// Since the regex above might be brittle, let's do exact replacements for what we saw:
content = content.replace(/<h4 className="font-semibold text-gray-800 text-lg mt-8 mb-4" className="font-semibold text-gray-800">/g, '<h4 className="font-semibold text-gray-800 text-lg mt-8 mb-4">');
content = content.replace(/<h4 className="font-semibold text-gray-800 text-lg mt-8 mb-4" className="font-semibold text-gray-800 mt-6">/g, '<h4 className="font-semibold text-gray-800 text-lg mt-8 mb-4">');

// 2. Insert the table
const targetText = `<p className="mb-4 leading-relaxed text-gray-700">Revenue from the Mould Fabrication segment increased by 4.4% yoy to $123.5million. This was mainly driven by demand from the Group's Healthcare segment especially from COVID-19 related projects.</p>`;

const tableHtm = `
          <div className="overflow-x-auto my-6">
            <table className="text-sm text-right w-full sm:w-auto ml-auto">
              <thead>
                <tr className="text-gray-600">
                  <th className="text-left w-64"></th>
                  <th className="px-3 pb-2 text-center">FY2020<br/>$'000</th>
                  <th className="px-3 pb-2 text-center">FY2019<br/>$'000</th>
                  <th className="px-3 pb-2 text-center">Inc/(Dec)<br/>%</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="text-left py-1 max-w-[150px]">Automotive</td><td className="px-3 py-1">211,537</td><td className="px-3 py-1">245,142</td><td className="px-3 py-1">(13.7)</td></tr>
                <tr><td className="text-left py-1">Consumer/IT</td><td className="px-3 py-1">252,742</td><td className="px-3 py-1">253,035</td><td className="px-3 py-1">(0.1)</td></tr>
                <tr><td className="text-left py-1">Healthcare</td><td className="px-3 py-1">65,740</td><td className="px-3 py-1">57,317</td><td className="px-3 py-1">14.7</td></tr>
                <tr className="border-b border-black"><td className="text-left py-1">Mould Fabrication</td><td className="px-3 py-1">123,473</td><td className="px-3 py-1">118,297</td><td className="px-3 py-1">4.4</td></tr>
                <tr className="border-b border-black font-semibold"><td className="text-left py-2"></td><td className="px-3 py-2">653,492</td><td className="px-3 py-2">673,791</td><td className="px-3 py-2">(3.0)</td></tr>
              </tbody>
            </table>
          </div>`;

if (content.includes(targetText) && !content.includes('>211,537</td>')) {
    content = content.replace(targetText, targetText + tableHtm);
    console.log("Successfully appended the table.");
} else if (content.includes('>211,537</td>')) {
    console.log("Table seems to already be inserted.");
} else {
    console.log("Could not find the target text to insert after.");
}

fs.writeFileSync(filePath, content);
console.log('Done processing.');
