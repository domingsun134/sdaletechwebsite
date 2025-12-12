import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Youtube } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <img src={logo} alt="Sunningdale Tech Logo" className="h-8 w-auto" />
                            <span className="text-lg font-bold tracking-tight text-white">Sunningdale Tech</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
                            A leading manufacturer of precision plastic components and mould making, delivering excellence across the globe.
                        </p>
                        <div className="flex gap-5">
                            <a href="https://www.linkedin.com/company/sunningdaletech/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors transform hover:scale-110"><Linkedin size={22} /></a>
                            <a href="https://www.youtube.com/@sunningdaletechltd7321" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors transform hover:scale-110"><Youtube size={22} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-8 text-white tracking-wide">Quick Links</h3>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link to="/about/vision" className="hover:text-primary hover:pl-1 transition-all duration-300">About Us</Link></li>
                            <li><Link to="/business" className="hover:text-primary hover:pl-1 transition-all duration-300">Our Business</Link></li>
                            <li><Link to="/capabilities" className="hover:text-primary hover:pl-1 transition-all duration-300">Capabilities</Link></li>
                            <li><Link to="/careers" className="hover:text-primary hover:pl-1 transition-all duration-300">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-8 text-white tracking-wide">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex items-start gap-3">
                                <span className="block">51 Joo Koon Circle<br />Singapore 629069</span>
                            </li>
                            <li className="pt-2 flex items-center gap-3">
                                <span className="font-semibold text-slate-300">Tel:</span> +65 6861 1161
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="font-semibold text-slate-300">Email:</span> sales@sdaletech.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; {new Date().getFullYear()} Sunningdale Tech Ltd. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
