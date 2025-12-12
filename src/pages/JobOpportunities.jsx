import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { Link, useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import jobBanner from '../assets/career_banner.png';
import { Search, MapPin, Briefcase, Clock, Filter, X, Building2, ArrowRight } from 'lucide-react';

const JobOpportunities = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('All');
    const [selectedLocation, setSelectedLocation] = useState('All');
    const navigate = useNavigate();

    const { jobs } = useJobs();

    const companies = ['All', ...new Set(jobs.map(job => job.company))];
    const locations = ['All', ...new Set(jobs.map(job => job.location))];

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.highlights && job.highlights.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCompany = selectedCompany === 'All' || job.company === selectedCompany;
        const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;
        const isActive = job.status !== 'Inactive';

        return matchesSearch && matchesCompany && matchesLocation && isActive;
    });

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <HeroSection
                title="Job Opportunities"
                subtitle="Explore exciting career paths with Sunningdale Tech."
                backgroundImage={jobBanner}
            />

            <div className="container-custom py-12">
                <div className="max-w-6xl mx-auto">

                    {/* Search and Filter Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by job title or keyword..."
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <select
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none bg-white"
                                    value={selectedCompany}
                                    onChange={(e) => setSelectedCompany(e.target.value)}
                                >
                                    {companies.map(comp => (
                                        <option key={comp} value={comp}>{comp}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <Filter className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>

                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <select
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none bg-white"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                >
                                    {locations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <Filter className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Listings */}
                    <div className="space-y-6">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map(job => (
                                <div
                                    key={job.id}
                                    onClick={() => navigate(`/careers/job-opportunities/${job.id}`)}
                                    className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer group"
                                >
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                                            <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">
                                                <Building2 size={14} /> {job.company}
                                            </span>
                                            <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">
                                                <MapPin size={14} /> {job.location}
                                            </span>
                                            <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">
                                                <Clock size={14} /> {job.type}
                                            </span>
                                        </div>

                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className="inline-flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                                            View Details
                                            <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                                <p className="text-lg text-slate-500">No job openings found matching your criteria.</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedCompany('All'); setSelectedLocation('All'); }}
                                    className="mt-4 text-primary font-medium hover:underline"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default JobOpportunities;
