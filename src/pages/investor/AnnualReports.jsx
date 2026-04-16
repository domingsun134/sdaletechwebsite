import { motion } from 'framer-motion';
import { FileText, ExternalLink } from 'lucide-react';

const AnnualReports = () => {
  const reports = [
    { year: '2019', size: '2.95 MB' },
    { year: '2018', size: '2.51 MB' },
    { year: '2017', size: '1.87 MB' },
    { year: '2016', size: '8.99 MB' },
    { year: '2015', size: '2.36 MB' },
    { year: '2014', size: '6.74 MB' },
    { year: '2013', size: '1.09 MB' },
    { year: '2012', size: '1.65 MB' },
    { year: '2011', size: '1.77 MB' },
    { year: '2010', size: '1.90 MB' },
    { year: '2009', size: '2.09 MB' },
    { year: '2008', size: '5.17 MB' },
    { year: '2007', size: '2.94 MB' },
    { year: '2006', size: '11.49 MB' },
    { year: '2005', size: '1.92 MB' },
    { year: '2004', size: '1.61 MB' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Featured Report */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Annual Report</h2>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <img
                src="/investor-relations/images/ar2019-cover.jpg"
                alt="Annual Report 2019"
                className="w-64 h-auto shadow-lg rounded"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Sunningdale Tech Ltd Annual Report 2019
              </h3>
              <p className="text-gray-600 mb-6">
                Our comprehensive annual report for fiscal year 2019 provides detailed insights into our financial
                performance, strategic initiatives, corporate governance, and sustainability efforts.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="/investor-relations/annual-reports/ar2019.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  View PDF (2.95mb)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* All Reports */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Previous Annual Reports</h2>

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
                        href={`/investor-relations/annual-reports/ar${report.year}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
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

        {/* Note */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> All annual reports are provided in PDF format. For assistance accessing these documents, please contact our investor relations team.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AnnualReports;
