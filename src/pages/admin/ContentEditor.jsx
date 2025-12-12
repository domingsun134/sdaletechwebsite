import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Save, Layout, Globe, Info, CheckCircle2, ChevronRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const ContentEditor = () => {
    const { content, updateNestedContent } = useContent();
    const [activeTab, setActiveTab] = useState('hero');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const tabs = [
        { id: 'hero', label: 'Hero Section', icon: <Layout size={20} />, description: 'Main landing area content' },
        { id: 'about', label: 'About Us', icon: <Info size={20} />, description: 'Company overview details' },
        { id: 'global', label: 'Global Footprint', icon: <Globe size={20} />, description: 'Locations and statistics' },
    ];

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Content Editor</h1>
                    <p className="text-slate-500 mt-1">Manage your website's main content and text</p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-primary-dark transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                    <Save size={20} />
                    <span className="font-medium">Save Changes</span>
                </button>
            </div>

            {showSuccess && (
                <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm">
                    <CheckCircle2 size={20} className="text-green-600" />
                    <span className="font-medium">Changes saved successfully!</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Tabs */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-200 border ${activeTab === tab.id
                                ? 'bg-white border-primary/20 shadow-md shadow-primary/5 ring-1 ring-primary/20'
                                : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                                    {tab.icon}
                                </div>
                                <div>
                                    <div className={`font-semibold ${activeTab === tab.id ? 'text-slate-800' : 'text-slate-600'}`}>
                                        {tab.label}
                                    </div>
                                    <div className="text-xs text-slate-400 font-medium">
                                        {tab.description}
                                    </div>
                                </div>
                            </div>
                            {activeTab === tab.id && <ChevronRight size={16} className="text-primary" />}
                        </button>
                    ))}
                </div>

                {/* Editor Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                        <div className="mb-8 pb-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                Edit the content for this section below
                            </p>
                        </div>

                        {/* Hero Section Editor */}
                        {activeTab === 'hero' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Hero Title</label>
                                    <input
                                        type="text"
                                        value={content.home.hero.title}
                                        onChange={(e) => updateNestedContent('home', 'hero', 'title', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Enter the main headline..."
                                    />
                                    <p className="text-xs text-slate-400">This is the main heading displayed on the home page.</p>
                                </div>
                            </div>
                        )}

                        {/* About Section Editor */}
                        {activeTab === 'about' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Section Title</label>
                                    <input
                                        type="text"
                                        value={content.home.about.title}
                                        onChange={(e) => updateNestedContent('home', 'about', 'title', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Description</label>
                                    <textarea
                                        rows={6}
                                        value={content.home.about.description}
                                        onChange={(e) => updateNestedContent('home', 'about', 'description', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Global Footprint Editor */}
                        {activeTab === 'global' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">Section Title</label>
                                        <input
                                            type="text"
                                            value={content.home.globalFootprint.title}
                                            onChange={(e) => updateNestedContent('home', 'globalFootprint', 'title', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">Description</label>
                                        <textarea
                                            rows={3}
                                            value={content.home.globalFootprint.description}
                                            onChange={(e) => updateNestedContent('home', 'globalFootprint', 'description', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">Statistics</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {content.home.globalFootprint.stats.map((stat, index) => (
                                            <div key={index} className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                                                <div className="mb-4">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Label</label>
                                                    <input
                                                        type="text"
                                                        value={stat.label}
                                                        onChange={(e) => {
                                                            const newStats = [...content.home.globalFootprint.stats];
                                                            newStats[index].label = e.target.value;
                                                            updateNestedContent('home', 'globalFootprint', 'stats', newStats);
                                                        }}
                                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Value</label>
                                                    <input
                                                        type="text"
                                                        value={stat.value}
                                                        onChange={(e) => {
                                                            const newStats = [...content.home.globalFootprint.stats];
                                                            newStats[index].value = e.target.value;
                                                            updateNestedContent('home', 'globalFootprint', 'stats', newStats);
                                                        }}
                                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ContentEditor;
