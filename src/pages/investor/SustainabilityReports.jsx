import { motion } from 'framer-motion';
import { FileText, Leaf, Users, Zap } from 'lucide-react';

const SustainabilityReports = () => {
  const reports = [
    { year: '2020', size: '7.21 MB', cover: 'sr2020-cover.jpg' },
    { year: '2019', size: '2.50 MB', cover: null },
    { year: '2018', size: '1.41 MB', cover: null },
    { year: '2017', size: '1.02 MB', cover: null }
  ];

  const sustainabilityPillars = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Environment',
      description: 'Committed to reducing our environmental footprint through energy efficiency, waste reduction, and sustainable manufacturing practices.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Social',
      description: 'Fostering a safe, inclusive workplace and supporting the communities where we operate through various CSR initiatives.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Governance',
      description: 'Maintaining the highest standards of corporate governance, ethics, and transparency in all our business operations.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Introduction */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Sustainability Commitment</h2>
          <p className="text-lg text-gray-700 mb-6">
            At Sunningdale Tech, we are committed to conducting our business in a responsible and sustainable manner.
            Our sustainability reports provide transparency on our environmental, social, and governance (ESG) performance
            and initiatives.
          </p>
        </div>

        {/* Sustainability Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {sustainabilityPillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="text-green-600 mb-4">{pillar.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{pillar.title}</h3>
              <p className="text-gray-600">{pillar.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Featured Report */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Latest Sustainability Report</h2>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <img
                src="/investor-relations/images/sr2020-cover.jpg"
                alt="Sustainability Report 2020"
                className="w-64 h-auto shadow-lg rounded"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Sunningdale Tech Sustainability Report 2020
              </h3>
              <p className="text-gray-600 mb-6">
                Our 2020 sustainability report highlights our progress in environmental stewardship, social responsibility,
                and corporate governance. The report covers our response to COVID-19, climate action initiatives, employee
                welfare programs, and community engagement efforts.
              </p>

              <a
                href="/investor-relations/sustainability-reports/sr2020.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileText className="w-5 h-5" />
                View PDF (7.21mb)
              </a>
            </div>
          </div>
        </div>

        {/* All Reports */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Previous Sustainability Reports</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Year</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Download</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map((report, index) => (
                  <motion.tr
                    key={report.year}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {report.year}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <a
                        href={`/investor-relations/sustainability-reports/sr${report.year}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        Download PDF
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {report.size}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Initiatives */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Sustainability Initiatives</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Environmental</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Energy efficiency improvements across facilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Waste reduction and recycling programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Water conservation measures</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Carbon footprint monitoring and reduction</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Social & Governance</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Workplace health and safety programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Employee training and development</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Community engagement and support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Ethical business practices and compliance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SustainabilityReports;
