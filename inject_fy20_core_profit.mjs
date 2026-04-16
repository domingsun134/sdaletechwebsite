import fs from 'fs';

const filePath = 'src/pages/investor/Financials.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetText = `<p className="mb-4 leading-relaxed text-gray-700">The Group reported a net profit of $31.5 million for FY20 compared to $8.0 million for FY19. Excluding the impact from net foreign exchange loss, net retrenchment costs, onerous rent, penalty on early termination of rental contract, net allowance for the impairment on PPE, net gain on the disposal of PPE, non-recurring professional fee, onerous rent, penalty on early termination of rental contract, amortization of customer relationship intangible contract, government grants due to COVID-19 and concession on social security contribution and foreign worker levy, core net profit would have been $22.9 million for FY20 as compared to $13.3 million for FY19, representing a 72.5% yoy increase.</p>`;

const tableHtm = `
          <div className="overflow-x-auto my-6">
            <table className="text-sm text-right w-full">
              <thead>
                <tr className="text-gray-600 text-center">
                  <th className="text-left font-normal py-2"></th>
                  <th className="px-2">FY2020<br/>$'000</th>
                  <th className="px-2">FY2019<br/>$'000</th>
                  <th className="px-2">+/ (-)<br/>%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-left py-1 w-2/3">Net profit for the period reported</td>
                  <td className="px-2 py-1">31,487</td>
                  <td className="px-2 py-1">7,988</td>
                  <td className="px-2 py-1">294.2</td>
                </tr>
                <tr><td colSpan="4" className="text-left py-1">Adjustments:</td></tr>
                <tr>
                  <td className="text-left py-1">Net foreign exchange loss</td>
                  <td className="px-2 py-1">2,626</td>
                  <td className="px-2 py-1">1,145</td>
                  <td className="px-2 py-1">129.3</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Net retrenchment costs</td>
                  <td className="px-2 py-1">256</td>
                  <td className="px-2 py-1">1,346</td>
                  <td className="px-2 py-1">(81.0)</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Allowance for impairment on PPE</td>
                  <td className="px-2 py-1">3</td>
                  <td className="px-2 py-1">709</td>
                  <td className="px-2 py-1">(99.6)</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Net gain on disposal of PPE</td>
                  <td className="px-2 py-1">(534)</td>
                  <td className="px-2 py-1">(172)</td>
                  <td className="px-2 py-1">210.5</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Onerous rent</td>
                  <td className="px-2 py-1">-</td>
                  <td className="px-2 py-1">483</td>
                  <td className="px-2 py-1">(100.0)</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Penalty on early termination of rental contract</td>
                  <td className="px-2 py-1">-</td>
                  <td className="px-2 py-1">354</td>
                  <td className="px-2 py-1">(100.0)</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Non-recurring professional fee</td>
                  <td className="px-2 py-1">1,822</td>
                  <td className="px-2 py-1">-</td>
                  <td className="px-2 py-1">n.m.</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Government grants due to COVID-19</td>
                  <td className="px-2 py-1">(6,185)</td>
                  <td className="px-2 py-1">-</td>
                  <td className="px-2 py-1">n.m.</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Amortisation of customer relationship intangible assets</td>
                  <td className="px-2 py-1">-</td>
                  <td className="px-2 py-1">1,401</td>
                  <td className="px-2 py-1">(100.0)</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="text-left py-1">Concession on social security contribution and foreign worker levy</td>
                  <td className="px-2 py-1">(6,606)</td>
                  <td className="px-2 py-1">-</td>
                  <td className="px-2 py-1">n.m.</td>
                </tr>
                <tr className="border-b-2 font-semibold">
                  <td className="text-left py-2">Core net profit</td>
                  <td className="px-2 py-2">22,869</td>
                  <td className="px-2 py-2">13,254</td>
                  <td className="px-2 py-2">72.5</td>
                </tr>
              </tbody>
            </table>
          </div>`;

// Safely insert avoiding .replace string pattern injection
const targetIndex = content.indexOf(targetText);

if (targetIndex !== -1 && !content.includes('>22,869</td>')) {
    const prefix = content.substring(0, targetIndex + targetText.length);
    const suffix = content.substring(targetIndex + targetText.length);
    const newContent = prefix + "\n" + tableHtm + suffix;

    fs.writeFileSync(filePath, newContent);
    console.log("Successfully appended the FY2020 Core Net Profit table.");
} else if (content.includes('>22,869</td>')) {
    console.log("Table seems to already be inserted.");
} else {
    console.log("Could not find the target text to insert after.");
}
