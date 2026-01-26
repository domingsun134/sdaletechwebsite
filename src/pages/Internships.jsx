import React from 'react';
import HeroSection from '../components/HeroSection';
import careerBanner from '../assets/career_banner.png';
import { Mail } from 'lucide-react';

const Internships = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection
                title="Internships"
                subtitle="Nurturing the next generation of innovators."
                backgroundImage={careerBanner}
            />

            <div className="container-custom py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-primary mb-8">Internships</h2>

                    <div className="prose prose-slate max-w-none text-slate-600 text-lg leading-relaxed mb-12">
                        <p className="mb-6">
                            Sunningdale Tech internship programme is an opportunity for students to be exposed to a dynamic working environment where you will gain valuable experience in the industry. Internship offers you a chance to experience the company's culture and how the business is conducted daily. We aim to give young talents a platform to scale new heights in the early stage of their professional development. Upon graduation, you may be given an opportunity to consider employment with Sunningdale Tech.
                        </p>
                        <p className="font-semibold text-slate-900 italic">
                            We believe in nurturing your growth.
                        </p>
                    </div>

                    <div className="bg-slate-50 p-10 rounded-2xl border border-slate-100 inline-block w-full">
                        <p className="text-slate-700 mb-4 text-xl">
                            Interested applicants, please send your resume to email:
                            <a href="mailto:sgp.hr@sdaletech.com" className="text-primary font-bold hover:underline ml-2">
                                sgp.hr@sdaletech.com
                            </a>
                        </p>
                        <p className="text-primary font-semibold text-lg">
                            In the email subject, please state "Internship"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Internships;
