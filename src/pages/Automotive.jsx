import React from 'react';
import HeroSection from '../components/HeroSection';
import automotiveImg from '../assets/auto-banner.jpg';
import { CheckCircle } from 'lucide-react';

const Automotive = () => {
    const capabilities = [
        "PCB Holder, Trimplates, Bezels, Navigation System, Climate Control, Cluster",
        "Air register, Switches, Window Lifter Mechanism, Gears, Gear Box, Gear Shift",
        "EHU, HMI Housing, HUD, Motor Holders, Device Dock, PCB Holder, Suspension cylinder housing, Engine Solenoid Bobbin, Windshield, Inverter",
        "Car Keys, Door Lock Mechanism, Bumpers, Antenna Housing, Lighting System, Sunroof systems",
        "Multi-shot molding; 2 & 3 shots",
        "FIM – Film Insert Moulding incorporate capacitive touch",
        "RHCM",
        "Mucell Technology",
        "Capacitive touch"
    ];

    const certifications = [
        "IATF 16949-certified",
        "ISO 9001:2015"
    ];

    return (
        <div className="flex flex-col">
            <HeroSection
                title="Automotive / Aerospace"
                backgroundImage={automotiveImg}
                height="h-[50vh]"
            />

            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-slate-900">Automotive Solutions</h2>
                        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                            Sunningdale Tech designs and manufactures decorative plastic parts & functional parts for tier one system manufacturers in the automotive industry. With rising demand for custom-made plastic injection parts and sophisticated finishing, our production technologies ensure that we are well equipped to meet the industry’s stringent requirements.
                        </p>

                        <h3 className="text-2xl font-bold mb-6 text-slate-900">Our Expertise and Capabilities</h3>

                        <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 mb-12">
                            <ul className="space-y-4">
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

export default Automotive;
