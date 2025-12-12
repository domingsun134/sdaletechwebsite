import React from 'react';
import HeroSection from '../components/HeroSection';
import ppeImg from '../assets/sdalemask.jpg';
import { FileText } from 'lucide-react';

const PPE = () => {
    return (
        <div className="flex flex-col">
            <HeroSection
                title="Personal Protective Equipment"
                backgroundImage={ppeImg}
                height="h-[50vh]"
            />

            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8 aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/M3SExienqW0"
                                title="Sunningdale Tech PPE Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <h2 className="text-3xl font-bold mb-8 text-slate-900">Protective Equipment Solutions</h2>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            Produced and packed in ISO13485 certified environment and with HSA registration, the mask automation line in Sunningdale Tech is one of the first locally produced masks facility in Singapore, set up since early 2020. With production capacity of &gt;4 m masks monthly, our proficient Engineering team and dedicated Quality and Operations teams are able to ensure high quality 3-ply masks produced within quick turnaround time frame.
                        </p>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            With CE compliance and FDA registration, Sunningdale Tech surgical mask has high filtration capacity and fulfils EN14683 and ASTM F2100 requirements. Designed to provide maximum protection for the users, the outer hydrophobic layer repels liquid substances; whereas the middle filter layer is designed to provide protection against most airborne particles; and lastly, an inner hydrophilic layer that provides comfort and absorbs water, sweat etc.
                        </p>


                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            With BFE and PFE &gt;95%, our surgical masks can be used up to 2 years from production date.
                        </p>

                        <div className="mb-12 text-center">
                            <a
                                href="/assets/Mask-Test-Report-TUV-170720.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
                            >
                                <FileText size={20} />
                                Download Our Mask Test Report
                            </a>
                        </div>

                        <div className="mb-8 aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/m-gBLM5TI6I?start=82"
                                title="Sunningdale Tech PPE Video 2"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PPE;
