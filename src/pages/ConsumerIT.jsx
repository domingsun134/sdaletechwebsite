import React from 'react';
import HeroSection from '../components/HeroSection';
import consumerImg from '../assets/consumer.jpg';

const ConsumerIT = () => {
    const products = [
        "Office Automation",
        "Ink cartridges & computer peripherals",
        "Lifestyle products",
        "Home appliances",
        "Packaging",
        "SIM cards",
        "Industrial products",
        "Personal well being",
        "Electronics",
        "Telecommunication & Point-of-sales",
        "Electronic Musical Instruments",
        "Audio and Visual Products",
        "Gaming"
    ];

    return (
        <div className="flex flex-col">
            <HeroSection
                title="Consumer / IT"
                backgroundImage={consumerImg}
                height="h-[50vh]"
            />

            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-slate-900">Consumer & IT Solutions</h2>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            Coupled with our manufacturing capabilities, Sunningdale Tech is well-positioned to tap on the growth opportunities in this fast-paced and high-volume industry.
                        </p>
                        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                            Our focus is to provide innovative solution in developing niche components for the mid to high end market, by offering superior surface finishing as well as rapid tooling to reduce product cost & time to market.
                        </p>

                        <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
                            <h3 className="text-xl font-bold mb-6 text-slate-900">Product Portfolio</h3>
                            <p className="text-slate-600 mb-4">Sunningdale Tech manufactures plastic parts for many consumer products, including but not limited to:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                {products.map((item, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="mt-2 mr-3 min-w-[6px] h-1.5 rounded-full bg-primary"></div>
                                        <span className="text-slate-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ConsumerIT;
