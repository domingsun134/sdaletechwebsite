import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';
import { newsArticles } from '../../data/newsArticles';

const Newsroom = () => {
  
  const [searchTerm, setSearchTerm] = useState('');

    const filteredNews = newsArticles
    .filter(article => {
      return searchTerm.length < 4 || article.title.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search News
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search news (minimum 4 characters)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            
          </div>
        </div>

        {/* News Articles */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredNews.length > 0 ? (
              filteredNews.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                  id={article.id}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-2">{article.date}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      <Link
                        to={`/investor-relations/news/${article.id}`}
                        className="text-red-600 hover:text-red-700 font-medium text-sm inline-flex items-center gap-1"
                      >
                        Read More
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg">No news articles found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Newsroom;
