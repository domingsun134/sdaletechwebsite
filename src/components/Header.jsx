import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import logo from '../assets/logo.png';

import SearchModal from './SearchModal';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setIsSearchOpen(false);
    }, [location]);

    const [activeSubmenu, setActiveSubmenu] = useState(null);

    const navLinks = [
        {
            name: 'About Us',
            path: '/about/vision',
            submenu: [
                { name: 'Our Vision', path: '/about/vision' },
                { name: 'Global Presence, Corporate Structure & Quality Certification', path: '/about/global-presence' },
                { name: 'Board Of Directors', path: '/about/board-of-director' },
                { name: 'Sustainability & CSR', path: '/about/sustainability' },
                { name: 'Events', path: '/about/events' }
            ]
        },
        {
            name: 'Our Business',
            path: '/business',
            submenu: [
                { name: 'Automotive / Aerospace', path: '/business/automotive' },
                { name: 'Consumer / IT', path: '/business/consumer-it' },
                { name: 'Healthcare', path: '/business/healthcare' },
                { name: 'Tooling', path: '/business/tooling' },
                { name: 'Personal Protective Equipment', path: '/business/ppe' }
            ]
        },
        {
            name: 'Capabilities',
            path: '/capabilities',
            submenu: [
                { name: 'Overview', path: '/capabilities' },
                { name: 'Innovation', path: '/capabilities/innovation' },
                { name: 'Manufacturing', path: '/capabilities/manufacturing' }
            ]
        },
        { name: 'Investor Relations', path: '/investor-relations' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Careers', path: '/careers' },
    ];

    return (
        <>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <header
                className={clsx(
                    'fixed w-full z-50 transition-all duration-300',
                    scrolled || activeSubmenu ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
                )}
                onMouseLeave={() => setActiveSubmenu(null)}
            >
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <img src={logo} alt="SDALETECH" className="h-10" />
                        <span className={clsx(
                            "font-bold text-xl tracking-tight",
                            (scrolled || activeSubmenu) ? "text-gray-900" : "text-white"
                        )}>
                            Sunningdale Tech
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 h-full">
                        {navLinks.map((link) => (
                            <div
                                key={link.name}
                                className="relative h-full flex items-center"
                                onMouseEnter={() => setActiveSubmenu(link.submenu ? link.name : null)}
                                onMouseLeave={() => setActiveSubmenu(null)}
                            >
                                <Link
                                    to={link.path}
                                    className={clsx(
                                        'text-sm font-medium transition-colors hover:text-blue-600 py-2',
                                        (scrolled || activeSubmenu) ? 'text-gray-800' : 'text-white'
                                    )}
                                >
                                    {link.name}
                                </Link>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {activeSubmenu === link.name && link.submenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                                        >
                                            <div className="py-2">
                                                {link.submenu.map((subItem) => (
                                                    <Link
                                                        key={subItem.name}
                                                        to={subItem.path}
                                                        className="block px-6 py-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>

                    {/* Utility Icons */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={clsx(
                                'p-2 rounded-full transition-colors hover:bg-black/5',
                                (scrolled || activeSubmenu) ? 'text-gray-800' : 'text-white'
                            )}>
                            <Search size={20} />
                        </button>
                        <button className={clsx(
                            'p-2 rounded-full transition-colors hover:bg-black/5',
                            (scrolled || activeSubmenu) ? 'text-gray-800' : 'text-white'
                        )}>
                            <Globe size={20} />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-800"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu className={(scrolled || activeSubmenu) ? 'text-gray-800' : 'text-white'} />}
                    </button>
                </div>



                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden"
                        >
                            <div className="flex flex-col p-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className="py-3 text-gray-800 font-medium border-b border-gray-100 last:border-none"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
};

export default Header;
