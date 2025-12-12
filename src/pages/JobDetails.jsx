import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import HeroSection from '../components/HeroSection';
import jobBanner from '../assets/career_banner.png';
import { MapPin, Briefcase, Clock, Building2, ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import JobApplicationModal from '../components/JobApplicationModal';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { jobs } = useJobs();
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

    // Find the job by ID - matching string UUIDs
    const job = jobs.find(j => j.id === id);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!job) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <HeroSection
                    title="Job Not Found"
                    subtitle="The position you are looking for might have been removed or is no longer available."
                    backgroundImage={jobBanner}
                />
                <div className="container-custom py-20 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Position Not Found</h2>
                    <p className="text-slate-600 mb-8">We couldn't find the job listing you were looking for.</p>
                    <Link
                        to="/careers/job-opportunities"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Opportunities
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <HeroSection
                title={job.title}
                subtitle={`${job.company} • ${job.location}`}
                backgroundImage={jobBanner}
            />

            <div className="container-custom py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Back Link */}
                    <Link
                        to="/careers/job-opportunities"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Job Listings
                    </Link>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        {/* Header */}
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 mb-4">{job.title}</h1>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                        <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                                            <Building2 size={18} className="text-primary" /> {job.company}
                                        </span>
                                        <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                                            <MapPin size={18} className="text-primary" /> {job.location}
                                        </span>
                                        <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                                            <Clock size={18} className="text-primary" /> {job.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex gap-3">
                                    <button
                                        onClick={() => setIsApplicationModalOpen(true)}
                                        className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-10">
                            {job.highlights && (
                                <section>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-primary rounded-full"></div>
                                        Job Highlights
                                    </h3>
                                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">{job.highlights}</p>
                                    </div>
                                </section>
                            )}

                            {job.responsibilities && (
                                <section>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-primary rounded-full"></div>
                                        Responsibilities
                                    </h3>
                                    <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-relaxed">
                                        {job.responsibilities.split('\n').filter(item => item.trim()).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {job.requirements && (
                                <section>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-primary rounded-full"></div>
                                        Requirements
                                    </h3>
                                    <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-relaxed">
                                        {job.requirements.split('\n').filter(item => item.trim()).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {job.career_level && (
                                <section className="pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <span className="font-semibold text-slate-900">Career Level:</span>
                                        <span className="px-3 py-1 bg-slate-100 rounded-full text-sm">{job.career_level}</span>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col items-center">
                            <div className="max-w-3xl text-center text-sm text-slate-500 space-y-4 mb-8 italic">
                                <p>
                                    The above statements reflect the general tasks, duties, activities and/or responsibilities necessary to describe this position and is not intended to set forth all of the specific requirements of the job. These job duties/responsibilities may change or vary in response to business needs.
                                </p>
                                <p>
                                    Only shortlisted candidates will be notified
                                </p>
                                <p>
                                    Sunningdale Tech is an equal opportunity employer – we believe that a diverse and inclusive workforce will cultivate a vibrant, productive and innovative workplace where all employees are truly respected and valued.
                                </p>
                                <p>
                                    All qualified applicants shall be considered for employment regardless of age, race, gender, gender identity, religion, marital status, medical condition, mental or physical disability, national origin, political and/or third party affiliation or veteran status. All offers of employment shall be conditioned upon successful completion of background checks, valid work passes and medical screenings, as applicable and/or mandated by law, and subject to the applicable local laws and regulations.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsApplicationModalOpen(true)}
                                className="w-full sm:w-auto text-center px-12 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Apply for this Position
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <JobApplicationModal
                isOpen={isApplicationModalOpen}
                onClose={() => setIsApplicationModalOpen(false)}
                jobTitle={job.title}
                jobEmail={job.email || 'hr@sdaletech.com'}
            />
        </div>
    );
};

export default JobDetails;
