import { Outlet, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';

const InvestorLayout = () => {
  const navItems = [
    { path: '/investor-relations', label: 'Overview', exact: true },
    ...(import.meta.env.DEV ? [{ path: '/investor-relations/newsroom', label: 'Latest News' }] : []),
    { path: '/investor-relations/financials', label: 'Financial Statements' },
    { path: '/investor-relations/annual-reports', label: 'Annual Reports' },
    ...(import.meta.env.DEV ? [{ path: '/investor-relations/sustainability-reports', label: 'Sustainability Reports' }] : [])
  ];

  // Force scroll event to make header visible
  useEffect(() => {
    // Trigger a scroll event to activate the header's scrolled state
    window.scrollTo(0, 1);
    // Scroll back to top immediately
    setTimeout(() => window.scrollTo(0, 0), 10);
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner - Extended to cover header area */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-800 overflow-hidden pt-24 pb-12">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="container mx-auto px-4 h-64 flex items-center relative z-10">
            <motion.h1
              className="text-5xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Investor Relations
            </motion.h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-1 overflow-x-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      isActive
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="container mx-auto px-4 py-12">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InvestorLayout;
