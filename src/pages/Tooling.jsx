import React from 'react';
import HeroSection from '../components/HeroSection';
import toolingImg from '../assets/tooling.jpg';
import { Link } from 'react-router-dom';

const Tooling = () => {
    const expertise = [
        "10 Full Fledged Tooling Operations located in Asia and Europe",
        "More than 100 designers and 25,000 sqm of mould manufacturing area",
        "Annual tooling capacity of up to 2,000 moulds",
        "Precision thermoplastics mold manufacturing (10Ton to 1800Ton)",
        "Liquid silicone mould (Flashless moulding)",
        "Multi shots / Components mould",
        "Full suite of precision design, mold making and qualifications capabilities for Automotive, Aerospace, Consumer/IT and Healthcare industries."
    ];

    return (
        <div className="flex flex-col">
            <HeroSection
                title="Tooling"
                backgroundImage={toolingImg}
                height="h-[50vh]"
            />

            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-slate-900">Precision Tooling</h2>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            Sunningdale Tech has 10 full fledge tooling operations located across Asia & Europe with more than 100 designers and 25,000 sqm of mould manufacturing area equipped with advanced toolroom machinery capable of fabricating up to 2,000 moulds annually.
                        </p>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            Our highly experienced engineers are capable of transforming complex product designs to precision plastics using advanced computer aided design software, and our sophisticated mould designs are capable of producing plastics products that meet the requirements of the most stringent customers in the global arena.
                        </p>
                        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                            Sunningdale Tech‘s manufacturing facilities are well equipped with advanced tool room machinery and together with proven track records, system and highly trained staff, we manufacture high precision moulds that will provide trouble-free, high-volume production for the life of the product.
                        </p>

                        <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
                            <h3 className="text-xl font-bold mb-6 text-slate-900">Tooling Expertise and Capabilities</h3>
                            <ul className="space-y-4 mb-8">
                                {expertise.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="mt-2 mr-3 min-w-[8px] h-2 rounded-full bg-primary"></div>
                                        <span className="text-slate-700 leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link to="/capabilities/manufacturing" className="btn btn-primary">
                                See more tooling capabilities
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Tooling;
