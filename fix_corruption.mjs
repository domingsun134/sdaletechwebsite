import fs from 'fs';

const filePath = 'src/pages/investor/Financials.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetText = `<p className="mb-4 leading-relaxed text-gray-700">Revenue from the Mould Fabrication segment increased by 4.4% yoy to $123.5million. This was mainly driven by demand from the Group's Healthcare segment especially from COVID-19 related projects.</p>`;

const nextText = `          <p className="mb-4 leading-relaxed text-gray-700">The Group's gross profit increased 21.1% yoy from $74.3 million for FY19 to $90.0 million for FY20`;

// Find everything before the targetText
const targetIndex = content.indexOf(targetText);
const prefix = content.substring(0, targetIndex + targetText.length);

// Find the LAST occurrence of nextText, which is the original uncorrupted rest of the file
const nextIndex = content.lastIndexOf(nextText);
// The suffix will be everything from the last occurrence of nextText to the end
const suffix = "\n" + content.substring(nextIndex);

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

// Combine them safely without using .replace() string patterns
const newContent = prefix + "\n" + tableHtm + suffix;

fs.writeFileSync(filePath, newContent);
console.log('Successfully fixed the corruption and inserted table safely.');
