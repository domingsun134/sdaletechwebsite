import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, ChevronUp, Check } from 'lucide-react';

const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
    { code: 'lv', label: 'Latviešu (Latvian)', flag: '🇱🇻' },
    { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ms', label: 'Bahasa Melayu', flag: '🇲🇾' }
];

const LanguageSwitcher = ({ direction = 'down' }) => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLang = languages.find(l => l.code === language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Trigger Button - Styled like Sidebar Items / Logout Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isOpen
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <Globe
                        size={20}
                        className={`transition-colors ${isOpen
                                ? 'text-slate-900'
                                : 'text-slate-400 group-hover:text-primary'
                            }`}
                    />
                    <span className="font-medium text-sm">{currentLang.label}</span>
                </div>
                <ChevronUp
                    size={16}
                    className={`transition-transform duration-200 ${isOpen
                            ? (direction === 'up' ? 'text-slate-600 rotate-180' : 'text-slate-600')
                            : (direction === 'up' ? 'text-slate-400' : 'text-slate-400 rotate-180')
                        }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={`absolute left-0 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in duration-200 ${direction === 'up'
                        ? 'bottom-full mb-2 slide-in-from-bottom-2'
                        : 'top-full mt-2 slide-in-from-top-2'
                    }`}>
                    <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-50 mb-1">
                        Select Language
                    </div>
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors hover:bg-slate-50 ${language === lang.code ? 'text-primary font-medium bg-primary/5' : 'text-slate-600'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg leading-none">{lang.flag}</span>
                                <span>{lang.label}</span>
                            </div>
                            {language === lang.code && <Check size={14} className="text-primary" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
