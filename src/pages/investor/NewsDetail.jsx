import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { newsArticles } from '../../data/newsArticles';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const article = newsArticles.find(news => news.id === id);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The news article you're looking for could not be found.</p>
          <Link
            to="/investor-relations/newsroom"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Newsroom
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/investor-relations/newsroom')}
          className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Newsroom
        </button>

        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">{article.date}</span>
            </div>
            {article.category && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                <Tag className="w-4 h-4" />
                {article.category}
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {article.title}
          </h1>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-table:text-gray-700"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Related Articles */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related News</h3>
          <div className="space-y-3">
            {newsArticles
              .filter(news => news.id !== id && news.category === article.category)
              .slice(0, 3)
              .map(relatedNews => (
                <Link
                  key={relatedNews.id}
                  to={`/investor-relations/news/${relatedNews.id}`}
                  className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="text-sm text-gray-500 mb-1">{relatedNews.date}</div>
                  <div className="font-medium text-gray-900 hover:text-red-600 transition-colors">
                    {relatedNews.title}
                  </div>
                </Link>
              ))}
            {newsArticles.filter(news => news.id !== id && news.category === article.category).length === 0 && (
              <p className="text-gray-500 text-sm">No related articles found.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NewsDetail;
