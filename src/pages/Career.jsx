import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import careerBanner from '../assets/career_banner.png';
import { ArrowRight, Briefcase, GraduationCap, Users } from 'lucide-react';

const Career = () => {
    return (
        <div className="flex flex-col">
            <HeroSection
                title="Careers"
                subtitle="Join our global team and shape the future of technology."
                backgroundImage={careerBanner}
            />

            <div className="container-custom py-20">
                <div className="max-w-4xl mx-auto">
                    {/* Introduction */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">At Sunningdale Tech, our talent is our future!</h2>
                        <div className="prose prose-slate max-w-none text-slate-600">
                            <p className="mb-4">
                                We are seeking driven individuals within the industry and related sectors to join us. We will support you to build your career by creating an environment where you are challenged and encouraged to succeed.
                            </p>
                            <p className="mb-4">
                                Sunningdale Tech offers exciting job opportunities in the areas of Engineering, Manufacturing, R&D, supply chain, finance, business development, IT and other key support functions across our operations globally.
                            </p>
                            <p>
                                If you desire to make a distinct difference in the world of technology, and embody the spirit of excellence, innovation and enterprise, we invite you to join us. The opportunity to prove yourself begins right here.
                            </p>
                        </div>
                    </div>

                    {/* Opportunities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Job Opportunities */}
                        <Link to="/careers/job-opportunities" className="group block h-full">
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 h-full hover:shadow-md transition-shadow flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                                    <Briefcase className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">Job Opportunities</h3>
                                <p className="text-slate-600 mb-6 flex-grow">
                                    Explore current openings across our global locations.
                                </p>
                                <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                                    View Openings <ArrowRight size={16} />
                                </span>
                            </div>
                        </Link>

                        {/* Internships */}
                        <Link to="/careers/internships" className="group block h-full">
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 h-full hover:shadow-md transition-shadow flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                                    <GraduationCap className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">Internships</h3>
                                <p className="text-slate-600 mb-6 flex-grow">
                                    Kickstart your career with our internship programs.
                                </p>
                                <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Learn More <ArrowRight size={16} />
                                </span>
                            </div>
                        </Link>

                        {/* Talent Community */}
                        <Link to="/careers/talent-community" className="group block h-full">
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 h-full hover:shadow-md transition-shadow flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                                    <Users className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">Talent Community</h3>
                                <p className="text-slate-600 mb-6 flex-grow">
                                    Join our network to stay updated on future opportunities.
                                </p>
                                <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Join Now <ArrowRight size={16} />
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Career;
