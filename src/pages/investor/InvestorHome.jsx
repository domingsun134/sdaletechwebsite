import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, ExternalLink } from 'lucide-react';

const InvestorHome = () => {
  const latestNews = [
    {
      date: '16 April 2021',
      title: 'Payment Of The Scheme Consideration And Delisting Of The Company',
      id: '2328977'
    },
    {
      date: '15 April 2021',
      title: 'Delisting Of Security',
      id: '2328798'
    },
    {
      date: '08 April 2021',
      title: 'Effective Date Of The Scheme',
      id: '2328046'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Company Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-lg shadow-md p-8"
      >
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Sunningdale Tech Ltd is a leading manufacturer of precision plastic components. The Group provides one-stop,
          turnkey plastic solutions, with capabilities ranging from product & mould designs, mould fabrication, injection
          moulding, complementary finishings, through to the precision assembly of complete products.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Boasting a total factory space of more than 3 million sq. feet, with more than 1000 injection moulding machines and a
          tooling capacity of 2,000 moulds per year, Sunningdale Tech is focusing on serving four key business segments –
          automotive, consumer/IT/environment, healthcare and tooling.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          With manufacturing facilities across Singapore, Malaysia (Johor, Penang), China (Tianjin, Shanghai, Suzhou,
          Zhongshan, Guangzhou, and Chuzhou), Latvia (Riga), Mexico (Guadalajara), India (Chennai), Thailand (Rayong), and
          Indonesia (Batam), Sunningdale Tech is strategically positioned to target and capture opportunities in diverse business
          sectors globally.
        </p>
      </motion.section>

      {/* Annual Reports Featured Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Annual Reports</h2>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0">
            <img
              src="/investor-relations/images/ar2019-cover.jpg"
              alt="Annual Report 2019"
              className="w-48 h-auto shadow-lg rounded"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Sunningdale Tech Ltd Annual Report 2019
            </h3>

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

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            to="/investor-relations/annual-reports"
            className="text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-2"
          >
            View all annual reports
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>

      {/* Latest News Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-lg shadow-md p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
          {import.meta.env.DEV && (
          <Link
            to="/investor-relations/newsroom"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            See all news
          </Link>
        )}
        </div>

        <div className="space-y-6">
          {latestNews.map((news, index) => (
            <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
              <div className="flex items-start gap-4">
                <div className="text-sm text-gray-500 whitespace-nowrap pt-1">
                  {news.date}
                </div>
                <div className="flex-1">
                  <Link
                    to={`/investor-relations/news/${news.id}`}
                    className="text-lg font-medium text-gray-900 hover:text-red-600 transition-colors"
                  >
                    {news.title}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default InvestorHome;
