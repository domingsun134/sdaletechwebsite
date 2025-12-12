import React from 'react';
import HeroSection from '../components/HeroSection';
import healthcareImg from '../assets/healthcareBanner.jpg';
import { CheckCircle } from 'lucide-react';

const Healthcare = () => {
    const capabilities = [
        "Medical Disposables (bloodline, drug delivery, critical care, caps & closures)",
        "Airway Management Devices & Components",
        "Hearing Aid Components",
        "Orthopedic Components",
        "Permanent Implant Medical Devices",
        "Optometric Devices & Surgical Components",
        "Box-Build Medical Devices",
        "Nutrition Packaging Components",
        "10k & 100k Cleanroom Molding & Automated Assembly"
    ];

    const certifications = [
        "ISO 13485 certified production sites positioned globally",
        "GMP 21 CFR-Part 820 certified"
    ];

    return (
        <div className="flex flex-col">
            <HeroSection
                title="Healthcare"
                backgroundImage={healthcareImg}
                height="h-[50vh]"
            />

            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-slate-900">Healthcare Solutions</h2>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            With extensive knowledge and experience in manufacturing class 1, 2, and 3 medical device components, Sunningdale is well positioned to service the healthcare industry.
                        </p>
                        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                            We take pride in our people and professionalism to attain highest quality standard, regulatory compliance, and premium customer service that encompasses a systematic program management from concept validation through to product end-of-life.
                        </p>

                        <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 mb-10">
                            <h3 className="text-xl font-bold mb-6 text-slate-900">Experience and Capabilities</h3>
                            <ul className="space-y-3">
                                {capabilities.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="mt-2 mr-3 min-w-[8px] h-2 rounded-full bg-primary"></div>
                                        <span className="text-slate-700 leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {certifications.map((cert, index) => (
                                <div key={index} className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-900 font-semibold">
                                    <CheckCircle className="mr-3 text-primary" size={24} />
                                    {cert}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Healthcare;
