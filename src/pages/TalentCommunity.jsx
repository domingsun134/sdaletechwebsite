import React from 'react';
import HeroSection from '../components/HeroSection';
import careerBanner from '../assets/career_banner.png';

const TalentCommunity = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection
                title="Talent Community"
                subtitle="Stay connected with our global innovation network."
                backgroundImage={careerBanner}
            />

            <div className="container-custom py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-primary mb-8">Talent Community</h2>

                    <div className="prose prose-slate max-w-none text-slate-600 text-lg leading-relaxed mb-12">
                        <p className="mb-6">
                            Be part of our Talent Community! Stay connected with Sunningdale Tech and be kept informed of the career opportunities in your area of expertise.
                        </p>
                    </div>

                    <div className="bg-slate-50 p-10 rounded-2xl border border-slate-100 inline-block w-full">
                        <p className="text-slate-700 mb-4 text-xl">
                            Deposit your resume to:
                            <a href="mailto:sgp.hr@sdaletech.com" className="text-primary font-bold hover:underline ml-2">
                                sgp.hr@sdaletech.com
                            </a>
                        </p>
                        <p className="text-primary font-semibold text-lg">
                            In the email subject, please state "Talent Community"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TalentCommunity;
