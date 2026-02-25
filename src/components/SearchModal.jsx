import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchIndex } from '../data/searchIndex';

const SearchModal = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const inputRef = useRef(null);
    const modalRef = useRef(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 100);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
            setSearchQuery(''); // Reset search on close
            setResults([]);
        };
    }, [isOpen, onClose]);

    // Handle search logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filteredResults = searchIndex.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.keywords.toLowerCase().includes(query)
        );

        setResults(filteredResults);
    }, [searchQuery]);

    // Close on click outside
    const handleBackdropClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4"
                    onClick={handleBackdropClick}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Search Header */}
                        <div className="flex items-center p-4 border-b border-gray-100">
                            <Search className="text-gray-400 ml-2" size={24} />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search specifically for..."
                                className="flex-grow px-4 py-2 text-lg text-gray-800 focus:outline-none placeholder:text-gray-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search Results */}
                        <div className="max-h-[60vh] overflow-y-auto bg-gray-50/50">
                            {searchQuery.trim() === '' ? (
                                <div className="p-10 text-center text-gray-400">
                                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Type to search across our pages</p>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="py-2">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Results ({results.length})
                                    </div>
                                    {results.map((result, index) => (
                                        <Link
                                            key={index}
                                            to={result.path}
                                            onClick={onClose}
                                            className="block px-6 py-4 hover:bg-white hover:shadow-sm border-b border-transparent hover:border-gray-100 transition-all group"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary transition-colors">
                                                        {result.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                        {result.description}
                                                    </p>
                                                </div>
                                                <ArrowRight className="text-gray-300 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" size={20} />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center text-gray-500">
                                    <p>No results found for "{searchQuery}"</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                            <span>Press ESC to close</span>
                            <span>Sunningdale Tech Search</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;
