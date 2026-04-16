import { motion } from 'framer-motion';
import { FileText, ExternalLink } from 'lucide-react';

const Financials = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Financial Statement Announcement for the Year Ended 31 December 2020
          </h2>

          <div className="flex flex-wrap gap-4 mt-6">
            <a
              href="/investor-relations/Sunningdale_Financial_Statement_FY2020.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Financial Statement (352 KB)
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-8 prose prose-lg max-w-none text-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-6">Review of Performance</h2>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4 uppercase">Consolidated Income Statement</h3>
          <div className="overflow-x-auto my-8">
            <h3 className="text-2xl font-bold text-red-600 mb-4">Profit & Loss</h3>
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="border-b font-semibold text-gray-800">
                  <th className="text-left py-2 font-normal text-gray-600">(In Singapore dollars)</th>
                  <th className="py-2 px-2">Jul - Dec<br />2020<br />$'000</th>
                  <th className="py-2 px-2">Jul - Dec<br />2019<br />$'000</th>
                  <th className="py-2 px-2">+/(-)<br />%</th>
                  <th className="py-2 px-2">Jan - Dec<br />2020<br />$'000</th>
                  <th className="py-2 px-2">Jan - Dec<br />2019<br />$'000</th>
                  <th className="py-2 px-2">+/(-)<br />%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-left py-1 font-semibold">Revenue</td>
                  <td className="py-1 px-2 font-semibold">378,393</td>
                  <td className="py-1 px-2 font-semibold">351,152</td>
                  <td className="py-1 px-2">7.8</td>
                  <td className="py-1 px-2 font-semibold">653,492</td>
                  <td className="py-1 px-2 font-semibold">673,791</td>
                  <td className="py-1 px-2">(3.0)</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Cost of sales</td>
                  <td className="py-1 px-2">(321,961)</td>
                  <td className="py-1 px-2">(309,668)</td>
                  <td className="py-1 px-2">4.0</td>
                  <td className="py-1 px-2">(563,520)</td>
                  <td className="py-1 px-2">(599,470)</td>
                  <td className="py-1 px-2">(6.0)</td>
                </tr>
                <tr className="border-b border-t font-semibold">
                  <td className="text-left py-2">Gross profit</td>
                  <td className="py-2 px-2">56,432</td>
                  <td className="py-2 px-2">41,484</td>
                  <td className="py-2 px-2">36.0</td>
                  <td className="py-2 px-2">89,972</td>
                  <td className="py-2 px-2">74,321</td>
                  <td className="py-2 px-2">21.1</td>
                </tr>
                <tr><td colSpan="7" className="py-2"></td></tr>
                <tr><td colSpan="7" className="text-left font-semibold py-1">Other items of income</td></tr>
                <tr>
                  <td className="text-left py-1">Interest income</td>
                  <td className="py-1 px-2">227</td>
                  <td className="py-1 px-2">311</td>
                  <td className="py-1 px-2">(27.0)</td>
                  <td className="py-1 px-2">502</td>
                  <td className="py-1 px-2">541</td>
                  <td className="py-1 px-2">(7.2)</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Other income</td>
                  <td className="py-1 px-2">6,539</td>
                  <td className="py-1 px-2">3,476</td>
                  <td className="py-1 px-2">88.1</td>
                  <td className="py-1 px-2">12,596</td>
                  <td className="py-1 px-2">6,237</td>
                  <td className="py-1 px-2">101.9</td>
                </tr>
                <tr><td colSpan="7" className="py-2"></td></tr>
                <tr><td colSpan="7" className="text-left font-semibold py-1">Other items of expense</td></tr>
                <tr>
                  <td className="text-left py-1">Marketing and distribution</td>
                  <td className="py-1 px-2">(6,136)</td>
                  <td className="py-1 px-2">(7,095)</td>
                  <td className="py-1 px-2">(13.5)</td>
                  <td className="py-1 px-2">(12,121)</td>
                  <td className="py-1 px-2">(14,098)</td>
                  <td className="py-1 px-2">(14.0)</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Administrative expenses</td>
                  <td className="py-1 px-2">(22,555)</td>
                  <td className="py-1 px-2">(20,827)</td>
                  <td className="py-1 px-2">8.3</td>
                  <td className="py-1 px-2">(41,485)</td>
                  <td className="py-1 px-2">(41,091)</td>
                  <td className="py-1 px-2">1.0</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Other operating expenses</td>
                  <td className="py-1 px-2">(4,229)</td>
                  <td className="py-1 px-2">(4,707)</td>
                  <td className="py-1 px-2">(10.2)</td>
                  <td className="py-1 px-2">(4,470)</td>
                  <td className="py-1 px-2">(8,338)</td>
                  <td className="py-1 px-2">(46.4)</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Allowance of impairment loss on financial assets</td>
                  <td className="py-1 px-2">(493)</td>
                  <td className="py-1 px-2">(178)</td>
                  <td className="py-1 px-2">177.0</td>
                  <td className="py-1 px-2">(410)</td>
                  <td className="py-1 px-2">(178)</td>
                  <td className="py-1 px-2">n.m.</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Finance costs</td>
                  <td className="py-1 px-2">(1,734)</td>
                  <td className="py-1 px-2">(2,619)</td>
                  <td className="py-1 px-2">(33.8)</td>
                  <td className="py-1 px-2">(3,940)</td>
                  <td className="py-1 px-2">(5,203)</td>
                  <td className="py-1 px-2">(24.3)</td>
                </tr>
                <tr>
                  <td className="text-left py-1 font-semibold">Share of results of joint venture</td>
                  <td className="py-1 px-2">1,699</td>
                  <td className="py-1 px-2">938</td>
                  <td className="py-1 px-2">81.1</td>
                  <td className="py-1 px-2">2,042</td>
                  <td className="py-1 px-2">1,351</td>
                  <td className="py-1 px-2">51.1</td>
                </tr>
                <tr className="border-t border-b font-semibold">
                  <td className="text-left py-2">Profit before tax</td>
                  <td className="py-2 px-2">29,750</td>
                  <td className="py-2 px-2">10,783</td>
                  <td className="py-2 px-2">175.9</td>
                  <td className="py-2 px-2">42,686</td>
                  <td className="py-2 px-2">13,542</td>
                  <td className="py-2 px-2">215.2</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Income tax expense</td>
                  <td className="py-1 px-2">(6,516)</td>
                  <td className="py-1 px-2">(2,503)</td>
                  <td className="py-1 px-2">160.3</td>
                  <td className="py-1 px-2">(11,199)</td>
                  <td className="py-1 px-2">(5,554)</td>
                  <td className="py-1 px-2">101.6</td>
                </tr>
                <tr className="border-b-2 border-t font-semibold">
                  <td className="text-left py-2">Profit for the period</td>
                  <td className="py-2 px-2">23,234</td>
                  <td className="py-2 px-2">8,280</td>
                  <td className="py-2 px-2">180.6</td>
                  <td className="py-2 px-2">31,487</td>
                  <td className="py-2 px-2">7,988</td>
                  <td className="py-2 px-2">n.m.</td>
                </tr>
                <tr><td colSpan="7" className="py-3"></td></tr>
                <tr>
                  <td className="text-left py-1 font-semibold">Profit attributable to:</td>
                  <td colSpan="6"></td>
                </tr>
                <tr className="border-b-2 border-gray-400 font-semibold">
                  <td className="text-left py-2">Owners of the Company</td>
                  <td className="py-2 px-2">23,234</td>
                  <td className="py-2 px-2">8,280</td>
                  <td className="py-2 px-2">180.6</td>
                  <td className="py-2 px-2">31,487</td>
                  <td className="py-2 px-2">7,988</td>
                  <td className="py-2 px-2">n.m.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto my-8">
            <h3 className="text-2xl font-bold text-red-600 mb-4">Consolidated Statement of Comprehensive Income</h3>
            <table className="w-full text-sm text-right">
              <tbody>
                <tr className="font-semibold">
                  <td className="text-left py-2 w-1/3">Profit for the period</td>
                  <td className="py-2 px-2">23,234</td>
                  <td className="py-2 px-2">8,280</td>
                  <td className="py-2 px-2">180.6</td>
                  <td className="py-2 px-2">31,487</td>
                  <td className="py-2 px-2">7,988</td>
                  <td className="py-2 px-2">n.m.</td>
                </tr>
                <tr><td colSpan="7" className="text-left py-1">Other comprehensive income</td></tr>
                <tr>
                  <td className="text-left py-1">Foreign currency translation</td>
                  <td className="py-1 px-2">1,297</td>
                  <td className="py-1 px-2">(2,849)</td>
                  <td className="py-1 px-2">n.m.</td>
                  <td className="py-1 px-2">6,664</td>
                  <td className="py-1 px-2">(5,534)</td>
                  <td className="py-1 px-2">(220.4)</td>
                </tr>
                <tr>
                  <td className="text-left py-1 border-b">Share of foreign currency translation of joint venture</td>
                  <td className="py-1 px-2 border-b">134</td>
                  <td className="py-1 px-2 border-b">(72)</td>
                  <td className="py-1 px-2 border-b">n.m.</td>
                  <td className="py-1 px-2 border-b">208</td>
                  <td className="py-1 px-2 border-b">(105)</td>
                  <td className="py-1 px-2 border-b">(298.1)</td>
                </tr>
                <tr className="font-semibold">
                  <td className="text-left py-2 border-b">Other comprehensive income for the period, net of tax</td>
                  <td className="py-2 px-2 border-b">1,431</td>
                  <td className="py-2 px-2 border-b">(2,921)</td>
                  <td className="py-2 px-2 border-b">n.m.</td>
                  <td className="py-2 px-2 border-b">6,872</td>
                  <td className="py-2 px-2 border-b">(5,639)</td>
                  <td className="py-2 px-2 border-b">(221.9)</td>
                </tr>
                <tr className="font-bold border-b-2">
                  <td className="text-left py-3">Total comprehensive income for the period</td>
                  <td className="py-3 px-2">24,665</td>
                  <td className="py-3 px-2">5,359</td>
                  <td className="py-3 px-2">360.3</td>
                  <td className="py-3 px-2">38,359</td>
                  <td className="py-3 px-2">2,349</td>
                  <td className="py-3 px-2">n.m.</td>
                </tr>
                <tr><td colSpan="7" className="py-2"></td></tr>
                <tr>
                  <td className="text-left py-1 font-semibold">Attributable to:</td>
                  <td colSpan="6"></td>
                </tr>
                <tr className="font-semibold border-b-2">
                  <td className="text-left py-2">Owners of the Company</td>
                  <td className="py-2 px-2">24,665</td>
                  <td className="py-2 px-2">5,359</td>
                  <td className="py-2 px-2">360.3</td>
                  <td className="py-2 px-2">38,359</td>
                  <td className="py-2 px-2">2,349</td>
                  <td className="py-2 px-2">n.m.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto my-8">
            <h3 className="text-2xl font-bold text-red-600 mb-4">Balance Sheet</h3>
            <table className="w-full text-sm text-right lg:w-3/4">
              <thead>
                <tr>
                  <th className="text-left font-normal text-gray-600 pb-2">(In Singapore dollars)</th>
                  <th colSpan="3" className="border-b border-t py-1">Group</th>
                </tr>
                <tr className="font-semibold text-gray-800">
                  <th className="text-left py-2">As at</th>
                  <th className="py-2 px-2">31.12.2020<br />$'000</th>
                  <th className="py-2 px-2">31.12.2019<br />$'000</th>
                  <th className="py-2 px-2">+/(-)<br />%</th>
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan="4" className="text-left py-2 font-bold underline">Non-current assets</td></tr>
                <tr><td className="text-left py-1">Property, plant and equipment</td><td className="py-1 px-2">170,717</td><td className="py-1 px-2">171,663</td><td className="py-1 px-2">(0.6)</td></tr>
                <tr><td className="text-left py-1">Right-of-use assets</td><td className="py-1 px-2">36,505</td><td className="py-1 px-2">41,550</td><td className="py-1 px-2">(12.1)</td></tr>
                <tr><td className="text-left py-1">Intangible assets</td><td className="py-1 px-2">17,373</td><td className="py-1 px-2">12,682</td><td className="py-1 px-2">37.0</td></tr>
                <tr><td className="text-left py-1">Other investments</td><td className="py-1 px-2">1,536</td><td className="py-1 px-2">1,539</td><td className="py-1 px-2">(0.2)</td></tr>
                <tr><td className="text-left py-1">Investment in subsidiaries</td><td className="py-1 px-2">-</td><td className="py-1 px-2">-</td><td className="py-1 px-2">n.m.</td></tr>
                <tr><td className="text-left py-1">Investment in joint venture</td><td className="py-1 px-2">9,308</td><td className="py-1 px-2">7,083</td><td className="py-1 px-2">31.4</td></tr>
                <tr><td className="text-left py-1">Prepayments</td><td className="py-1 px-2">-</td><td className="py-1 px-2">55</td><td className="py-1 px-2">(100.0)</td></tr>
                <tr><td className="text-left py-1">Other receivables</td><td className="py-1 px-2">-</td><td className="py-1 px-2">-</td><td className="py-1 px-2">n.m.</td></tr>
                <tr className="border-b"><td className="text-left py-1">Deferred tax assets</td><td className="py-1 px-2">3,955</td><td className="py-1 px-2">3,652</td><td className="py-1 px-2">8.3</td></tr>
                <tr className="border-b"><td className="text-left py-2"></td><td className="py-2 px-2">239,394</td><td className="py-2 px-2">238,224</td><td className="py-2 px-2">0.5</td></tr>

                <tr><td colSpan="4" className="text-left py-2 font-bold underline">Current assets</td></tr>
                <tr><td className="text-left py-1">Inventories</td><td className="py-1 px-2">91,258</td><td className="py-1 px-2">111,019</td><td className="py-1 px-2">(17.8)</td></tr>
                <tr><td className="text-left py-1">Contract assets</td><td className="py-1 px-2">47,907</td><td className="py-1 px-2">34,850</td><td className="py-1 px-2">37.5</td></tr>
                <tr><td className="text-left py-1">Prepayments</td><td className="py-1 px-2">4,442</td><td className="py-1 px-2">2,885</td><td className="py-1 px-2">54.0</td></tr>
                <tr><td className="text-left py-1">Trade and other receivables</td><td className="py-1 px-2">216,825</td><td className="py-1 px-2">218,554</td><td className="py-1 px-2">(0.8)</td></tr>
                <tr className="border-b"><td className="text-left py-1">Cash and short term deposits</td><td className="py-1 px-2">126,282</td><td className="py-1 px-2">103,366</td><td className="py-1 px-2">22.2</td></tr>
                <tr className="border-b"><td className="text-left py-2"></td><td className="py-2 px-2">486,714</td><td className="py-2 px-2">470,674</td><td className="py-2 px-2">3.4</td></tr>

                <tr><td colSpan="4" className="text-left py-2 font-bold underline">Less: Current liabilities</td></tr>
                <tr><td className="text-left py-1">Trade and other payables</td><td className="py-1 px-2">175,819</td><td className="py-1 px-2">169,638</td><td className="py-1 px-2">3.6</td></tr>
                <tr><td className="text-left py-1">Contract liabilities</td><td className="py-1 px-2">24,396</td><td className="py-1 px-2">29,677</td><td className="py-1 px-2">(17.8)</td></tr>
                <tr><td className="text-left py-1">Loans and borrowings</td><td className="py-1 px-2">61,723</td><td className="py-1 px-2">63,698</td><td className="py-1 px-2">(3.1)</td></tr>
                <tr><td className="text-left py-1">Lease liabilities</td><td className="py-1 px-2">7,194</td><td className="py-1 px-2">7,449</td><td className="py-1 px-2">(3.4)</td></tr>
                <tr className="border-b"><td className="text-left py-1">Tax payable</td><td className="py-1 px-2">6,495</td><td className="py-1 px-2">2,509</td><td className="py-1 px-2">158.9</td></tr>
                <tr className="border-b"><td className="text-left py-2"></td><td className="py-2 px-2">275,627</td><td className="py-2 px-2">272,971</td><td className="py-2 px-2">1.0</td></tr>

                <tr><td className="text-left py-2">Net current assets / (liabilities)</td><td className="py-2 px-2">211,087</td><td className="py-2 px-2">197,703</td><td className="py-2 px-2">6.8</td></tr>

                <tr><td colSpan="4" className="text-left py-2 font-bold underline">Less: Non-current liabilities</td></tr>
                <tr><td className="text-left py-1">Other liabilities</td><td className="py-1 px-2">1,656</td><td className="py-1 px-2">1,724</td><td className="py-1 px-2">(3.9)</td></tr>
                <tr><td className="text-left py-1">Loans and borrowings</td><td className="py-1 px-2">33,536</td><td className="py-1 px-2">40,670</td><td className="py-1 px-2">(17.5)</td></tr>
                <tr><td className="text-left py-1">Lease liabilities</td><td className="py-1 px-2">11,562</td><td className="py-1 px-2">15,383</td><td className="py-1 px-2">(24.8)</td></tr>
                <tr className="border-b"><td className="text-left py-1">Deferred tax liabilities</td><td className="py-1 px-2">8,044</td><td className="py-1 px-2">8,608</td><td className="py-1 px-2">(6.6)</td></tr>
                <tr className="border-b"><td className="text-left py-2"></td><td className="py-2 px-2">54,798</td><td className="py-2 px-2">66,385</td><td className="py-2 px-2">(17.5)</td></tr>

                <tr className="border-b-2 font-bold"><td className="text-left py-3">Net assets</td><td className="py-3 px-2">395,683</td><td className="py-3 px-2">369,542</td><td className="py-3 px-2">7.1</td></tr>

                <tr><td colSpan="4" className="text-left pt-6 pb-2 font-bold underline">Equity attributable to owners of the Company</td></tr>
                <tr><td className="text-left py-1">Share capital</td><td className="py-1 px-2">304,498</td><td className="py-1 px-2">303,313</td><td className="py-1 px-2">0.4</td></tr>
                <tr className="border-b"><td className="text-left py-1">Reserves</td><td className="py-1 px-2">91,185</td><td className="py-1 px-2">66,229</td><td className="py-1 px-2">37.7</td></tr>
                <tr className="border-b-2 font-bold"><td className="text-left py-3">Total equity</td><td className="py-3 px-2">395,683</td><td className="py-3 px-2">369,542</td><td className="py-3 px-2">7.1</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="text-2xl font-bold text-red-600 mb-4">Review of Performance</h3>
          <h4 className="font-semibold text-gray-800 text-lg mt-8 mb-4">CONSOLIDATED INCOME STATEMENT</h4><br></br>
          <h4 className="font-semibold text-gray-800 text-lg mt-8 mb-4">July - December 2020 ("2H20")</h4>
          <p className="mb-4 leading-relaxed text-gray-700">The Group's revenue increased 7.8% year-on-year ("yoy") from $351.2 million for 2H19 to $378.4 million for 2H20. The increase in revenue was attributed to all business segments.</p>
          <p className="mb-4 leading-relaxed text-gray-700">Revenue from the Group's Automotive segment increased 1.2% yoy to $127.4 million. This was mainly due to (i) fulfilment of the backlog caused by mandatory government closures or shut down in both the Group's and customer's manufacturing facilities in 1H2020, and (ii) sudden surge in orders due to increased demand in China and (iii) stocking up by customers, partially offset by end of life for certain projects.</p>
          <p className="mb-4 leading-relaxed text-gray-700">Revenue from the Group's Consumer/IT segment increased by 10.6% yoy to $147.1 million. This was due to (i) a regulatory requirement in southern China to convert the solvent based painting line to water-based painting line, which resulted in customers building up and pulling their products earlier before the painting line is converted; (ii) customers maximising their orders to compensate for the loss of capacity in 1H20; and (iii) improved sales of certain customer's products are selling well with people staying at home.</p>
          <p className="mb-4 leading-relaxed text-gray-700">Revenue from the Group's Healthcare segment increased by 11.3% yoy to $31.2 million. This was mainly driven by the increase in orders secured and the launching of new projects.</p>
          <p className="mb-4 leading-relaxed text-gray-700">Revenue from the Mould Fabrication segment increased by 13.1% yoy to $72.7million. This was mainly driven by demand from the Group's Healthcare segment especially from COVID-19 related projects.</p>
          <div className="overflow-x-auto my-6">
            <table className="text-sm text-right w-full sm:w-auto ml-auto">
              <thead>
                <tr className="text-gray-600">
                  <th className="text-left w-64"></th>
                  <th className="px-3 pb-2 text-center">Jul - Dec<br />2020<br />$'000</th>
                  <th className="px-3 pb-2 text-center">Jul - Dec<br />2019<br />$'000</th>
                  <th className="px-3 pb-2 text-center">Inc/(Dec)<br />%</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="text-left py-1 max-w-[150px]">Automotive</td><td className="px-3 py-1">127,364</td><td className="px-3 py-1">125,850</td><td className="px-3 py-1">1.2</td></tr>
                <tr><td className="text-left py-1">Consumer/IT</td><td className="px-3 py-1">147,103</td><td className="px-3 py-1">132,985</td><td className="px-3 py-1">10.6</td></tr>
                <tr><td className="text-left py-1">Healthcare</td><td className="px-3 py-1">31,202</td><td className="px-3 py-1">28,030</td><td className="px-3 py-1">11.3</td></tr>
                <tr className="border-b border-black"><td className="text-left py-1">Mould Fabrication</td><td className="px-3 py-1">72,724</td><td className="px-3 py-1">64,287</td><td className="px-3 py-1">13.1</td></tr>
                <tr className="border-b border-black font-semibold"><td className="text-left py-2"></td><td className="px-3 py-2">378,393</td><td className="px-3 py-2">351,152</td><td className="px-3 py-2">7.8</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 leading-relaxed text-gray-700">The Group's gross profit increased 36.0% yoy from $41.5 million for 2H19 to $56.4 million for 2H20. Gross profit margin improved from 11.8% for 2H19 to 14.9% for 2H20. This was mainly due to (i) tightening of costs, and the implementation of shorter work weeks in plants where orders were low; (ii) concession on social security contributions by the Human Resource and Social Security Bureau in China and (iii) improvement in operational efficiency.</p>
          <p className="mb-4 leading-relaxed text-gray-700">The increase in other income was mainly attributable to various government grants received by the Group due to COVID-19 of $2.8 million in 2H20.</p>
          <p className="mb-4 leading-relaxed text-gray-700">The decrease in marketing and distribution and administrative expenses was due to the lower travelling costs, tightening of costs and the implementation of shorter work weeks in plants where orders are low, partially offset by one-time non-recurring professional fee of $1.8 million for the acquisition of Moldworx LLC and the scheme of arrangement.</p>
          <p className="mb-4 leading-relaxed text-gray-700">The decrease in other expenses was mainly due to the non-occurrence during the period of onerous rental, and penalty on early termination of rental contract as well as lower allowance for impairment on property, plant and equipment ("PPE") and net retrenchment costs and completion of the amortisation of customer relationship intangible assets in 2H19.</p>
          <p className="mb-4 leading-relaxed text-gray-700">The Group reported a net profit of $23.2 million for 2H20 compared to $8.3 million for 2H19. Excluding the impact from net foreign exchange loss, net retrenchment costs, onerous rent, penalty on early termination of rental contract, net allowance for the impairment on PPE, net gain on the disposal of PPE, non-recurring professional fee, onerous rent, penalty on early termination of rental contract, amortisation of customer relationship intangible assets, government grants due to COVID-19 and concession on social security contribution and foreign worker levy, core net profit would have been $21.0 million for 2H20 as compared to $11.2 million for 2H19, representing a 86.3% yoy increase.</p>
          <div className="overflow-x-auto my-6">
            <table className="text-sm text-right w-full">
              <thead>
                <tr className="text-gray-600 text-center">
                  <th className="text-left font-normal py-2"></th>
                  <th className="px-2">Jul - Dec<br />2020<br />$'000</th>
                  <th className="px-2">Jul - Dec<br />2019<br />$'000</th>
                  <th className="px-2">+/ (-)<br />%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-left py-1 w-2/3">Net profit for the period reported</td>
                  <td className="px-2 py-1">23,234</td>
                  <td className="px-2 py-1">8,280</td>
                  <td className="px-2 py-1">180.60</td>
                </tr>
                <tr><td colSpan="4" className="text-left py-1">Adjustments:</td></tr>
                <tr>
                  <td className="text-left py-1">Net foreign exchange loss</td>
                  <td className="px-2 py-1">3,360</td>
                  <td className="px-2 py-1">604</td>
                  <td className="px-2 py-1">456.29</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Net retrenchment costs</td>
                  <td className="px-2 py-1">62</td>
                  <td className="px-2 py-1">850</td>
                  <td className="px-2 py-1">(92.71)</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Net allowance for impairment on PPE</td>
                  <td className="px-2 py-1">3</td>
                  <td className="px-2 py-1">218</td>
                  <td className="px-2 py-1">(98.62)</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Net gain on disposal of PPE</td>
                  <td className="px-2 py-1">(639)</td>
                  <td className="px-2 py-1">(5)</td>
                  <td className="px-2 py-1">n.m.</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Non-recurring professional fee</td>
                  <td className="px-2 py-1">1,822</td>
                  <td className="px-2 py-1">-</td>
                  <td className="px-2 py-1">n.m.</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Onerous rent*</td>
                  <td className="px-2 py-1">-</td>
                  <td className="px-2 py-1">310</td>
                  <td className="px-2 py-1">(100.00)</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Penalty on early termination of rental contract</td>
                  <td className="px-2 py-1">-</td>
                  <td className="px-2 py-1">354</td>
                  <td className="px-2 py-1">(100.00)</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Amortisation of customers relationship intangible assets</td>
                  <td className="px-2 py-1">-</td>
                  <td className="px-2 py-1">637</td>
                  <td className="px-2 py-1">(100.00)</td>
                </tr>
                <tr>
                  <td className="text-left py-1">Government grants due to COVID-19</td>
                  <td className="px-2 py-1">(2,841)</td>
                  <td className="px-2 py-1">-</td>
                  <td className="px-2 py-1">n.m.</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="text-left py-1">Concession on social security contribution and foreign worker levy</td>
                  <td className="px-2 py-1">(4,046)</td>
                  <td className="px-2 py-1">-</td>
                  <td className="px-2 py-1">n.m.</td>
                </tr>
                <tr className="border-b-2 font-semibold">
                  <td className="text-left py-2">Core net profit</td>
                  <td className="px-2 py-2">20,955</td>
                  <td className="px-2 py-2">11,248</td>
                  <td className="px-2 py-2">86.30</td>
                </tr>
              </tbody>
            </table>
          </div>          <p className="text-sm italic mb-4">*Onerous rent refers to rent paid at the Group's operations in Shanghai and Thailand despite the shifting of operations from these locations. The Group was required to pay rent at these vacant premises during 2Q19 as the rental agreements will expire at a later date.</p>

          <h4 className="font-semibold text-gray-800 text-lg mt-8 mb-4">January - December 2020 ("FY20")</h4>
          <p className="mb-4 leading-relaxed text-gray-700">The Group's revenue decreased 3.0% year-on-year but net profit increased from $8.0 million for FY2019 to $31.5 million for FY2020 due to a series of one-time non-recurring items. Payroll was reduced by $12.0 million due to headcount reduction, temporary salary reduction, concessions on social security contribution in China and foreign worker levy in Singapore. Travel expenses were reduced by $2.2 million due to COVID-19 travel restrictions. In addition, grants were received from various governments, including JSS in Singapore, to help businesses deal with the impact of Covid-19 - these added $6.2 million to the bottom line.</p>
          <p className="mb-4 leading-relaxed text-gray-700">Revenue from the Group's Automotive segment decreased 13.7% yoy to $211.5 million. This was caused by mandatory government closures in 1H20 of the Group's manufacturing facilities, except for those involved in certain essential goods and services, due to COVID-19 in countries like China, India, Malaysia and Mexico where our manufacturing facilities are located. This was partially offset by increased orders in 2H20.</p>
          <p className="mb-4 leading-relaxed text-gray-700">Revenue from the Group's Healthcare segment increased by 14.7% yoy to $65.7 million. This was due mainly driven by the increase in orders secured and the launching of new projects.</p>
          <p className="mb-4 leading-relaxed text-gray-700">Revenue from the Mould Fabrication segment increased by 4.4% yoy to $123.5million. This was mainly driven by demand from the Group's Healthcare segment especially from COVID-19 related projects.</p>

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
          </div>
          <p className="mb-4 leading-relaxed text-gray-700">The Group's gross profit increased 21.1% yoy from $74.3 million for FY19 to $90.0 million for FY20. Gross profit margin improved from 11.0% for FY19 to 13.8% for FY20. This was mainly due to (i) tightening of costs, and the implementation of shorter work weeks in plants where orders were low; (ii) concession on social security contributions by the Human Resource and Social Security Bureau in China and (iii) improvement in operational efficiency.</p>
          <p className="mb-4 leading-relaxed text-gray-700">The increase in other income was mainly attributable to various government grants received by the Group due to COVID-19 of $6.2 million in FY20.</p>
          <p className="mb-4 leading-relaxed text-gray-700">The decrease in marketing and distribution and administrative expenses was due to the lower travelling costs, tightening of costs, and the implementation of shorter work weeks in plants where orders are low, partially offset by one-time non-recurring professional fee of $1.8 million for the acquisition of Moldworx LLC and the scheme of arrangement.</p>
          <p className="mb-4 leading-relaxed text-gray-700">The decrease in other expenses was mainly due to the non-occurrence during the period of onerous rental, and penalty on early termination of rental contract as well as lower allowance for impairment on property, plant and equipment ("PPE") and net retrenchment costs.</p>
          <p className="mb-4 leading-relaxed text-gray-700">The Group reported a net profit of $31.5 million for FY20 compared to $8.0 million for FY19. Excluding the impact from net foreign exchange loss, net retrenchment costs, onerous rent, penalty on early termination of rental contract, net allowance for the impairment on PPE, net gain on the disposal of PPE, non-recurring professional fee, onerous rent, penalty on early termination of rental contract, amortization of customer relationship intangible contract, government grants due to COVID-19 and concession on social security contribution and foreign worker levy, core net profit would have been $22.9 million for FY20 as compared to $13.3 million for FY19, representing a 72.5% yoy increase.</p>

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
          </div>

          <p className="mb-4 leading-relaxed text-gray-700">The Group's PPE amounted to $170.7 million as at 31 December 2020 as compared to $171.7 million as at 31 December 2019. PPE was stated net of depreciation charges of $27.5 million (FY19: $27.3 million), partially offset by currency realignment and additions of $25.7 million (FY19: $32.8 million).</p>
          <p className="mb-4 leading-relaxed text-gray-700">The decrease in inventories was due to (i) higher revenue recognised in 2H20; (ii) higher net allowance for inventories obsolescence due to end-of-life projects; and (iii) challenges in procuring raw materials purchased due to strong demand and limited supply from manufacturers of raw materials. Towards the end of the year, the raw materials were issued on allocation basis by the manufacturers who also faced logistic issues due to trade imbalance.</p>
          <p className="mb-4 leading-relaxed text-gray-700">The increase in contract assets was due to higher unbilled (uninvoiced) amounts.</p>
          <p className="mb-4 leading-relaxed text-gray-700">The increase in prepayments was due to higher prepaid expenses in respect of insurance and maintenance contracts.</p>
          <p className="mb-4 leading-relaxed text-gray-700">The decrease in contract liabilities was due to less considerations received or due from customers where the related revenue has not been recognised.</p>
          <p className="mb-4 leading-relaxed text-gray-700">The increase in tax payable is in line with the increase in profit.</p>
          <p className="mb-4 leading-relaxed text-gray-700">The Group maintained a cash balance of $126.3 million as at 31 December 2020 (31 December 2019: $103.4 million). This resulted in a net cash position of $31.0 million (31 December 2019: net debt position of $1.0 million) after accounting for loans and borrowings (excluding lease liabilities) amounting to $95.3 million (31 December 2019: $104.4 million).</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4 uppercase">Consolidated Cashflow Statement</h3>
          <h4 className="font-semibold text-gray-800 text-lg mt-8 mb-4">January - December 2020 ("FY20")</h4>
          <p className="mb-4 leading-relaxed text-gray-700">Net cash flows from operating activities amounted to $75.9 million for FY20 as compared to $47.4 million for FY19. Net cash flows used in investing activities amounted to $25.0 million for FY20 as compared $4.9 million for FY19. This was due to higher net proceeds received from the disposal of PPE for FY19 as compared to FY20 which was partially offset by net of cash acquisition of subsidiary for $5.4 million.</p>
          <p className="mb-4 leading-relaxed text-gray-700">Net cash flows used in financing activities amounted to $28.4 million for FY20 as compared to $26.1 million for FY19.</p>

          <h2 className="text-2xl font-bold text-gray-900 border-b pb-4 mt-12 mb-6">Commentary On Current Year Prospects</h2>
          <p className="mb-4 leading-relaxed text-gray-700">After an eventful and challenging 2020 amid COVID-19, the Group continues to face headwinds in the form of a weakening US Dollar, rising crude oil price (which affects resin prices, our principal raw material), material shortages, raw materials and logistics costs increase as well as continuous price pressure from customers. In addition, uncertainties surrounding the US-China trade war remains despite the change in US administration.</p>
          <p className="mb-4 leading-relaxed text-gray-700">Recurring waves of COVID-19 infection have also impacted the Group's operations. Recently, three of the Group's Johor plants have had to shut down for a short period of time due to confirmed COVID-19 cases. We have now conducted and will continue to conduct 100% testing of employees. Similarly, in Mexico, operational efficiency has been affected as some workers continue to be placed under quarantine due to confirmed and suspected cases. These have disrupted the Group's production efficiency and also incurred additional costs. The Group continues to monitor the situation closely.</p>
          <p className="mb-4 leading-relaxed text-gray-700">In spite of the challenging market landscape, the Group's Healthcare, Consumer/IT and Automotive segments have recovered in 2H2020. Part of this is due to the bullwhip effect in the supply chain. Because of the shut downs in the first and second quarters, the second half was a period of catching up and restocking. Furthermore, because of the disruptions to transport and logistics mentioned above, customers have also increased the stocking levels above what is normal in more sanguine times.</p>
          <p className="mb-4 leading-relaxed text-gray-700">The Healthcare segment continues to garner momentum and its growth trajectory remains aligned with the Group's expectations.</p>
          <p className="mb-4 leading-relaxed text-gray-700">The Group's Consumer/IT segment remains relatively stable due to some product demand driven by the work-from-home trend and replenishment of inventories in the supply chain. While the Automotive segment has gradually recovered as well, uncertainties remain as many automotive OEMs are temporarily shutting down plants due to the global shortage of materials and delays in new projects due to the shift to the Electrical Vehicle (EV) trend.</p>
          <p className="mb-4 leading-relaxed text-gray-700">Looking ahead, the Group expects the business environment to remain challenging amid COVID-19. Operations are likely to remain disrupted until widespread inoculation takes effect. Furthermore, the supply chain bullwhip effect will continue to cause volatility in demand forecasts in the near-term.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Financials;
