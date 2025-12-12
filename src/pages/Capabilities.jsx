import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import innovationBannerImg from '../assets/innovation-banner.jpg';
import toolingImg from '../assets/tooling.jpg';
import capabilitiesBannerImg from '../assets/capabilities-banner.jpg';

const Capabilities = () => {
    return (
        <div className="flex flex-col">
            <HeroSection
                title="Our Capabilities"
                subtitle="We know that your needs are unique, that’s why we provide tailored solutions that work specifically for you. We believe that there is always a better way, that’s why we are relentless in our search for innovative ways to meet your needs."
                backgroundImage={capabilitiesBannerImg}
                height="h-[50vh]"
            />

            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                        {/* Innovation Card */}
                        <Link to="/capabilities/innovation" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-[400px]">
                            <div className="absolute inset-0">
                                <img
                                    src={innovationBannerImg}
                                    alt="Innovation"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                                <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-primary-light transition-colors">Innovation</h3>
                                <span className="inline-flex items-center text-primary-light font-semibold group-hover:translate-x-2 transition-transform">
                                    Read more <ArrowRight className="ml-2" size={20} />
                                </span>
                            </div>
                        </Link>

                        {/* Manufacturing Card */}
                        <Link to="/capabilities/manufacturing" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-[400px]">
                            <div className="absolute inset-0">
                                <img
                                    src={toolingImg}
                                    alt="Manufacturing"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                                <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-primary-light transition-colors">Manufacturing</h3>
                                <span className="inline-flex items-center text-primary-light font-semibold group-hover:translate-x-2 transition-transform">
                                    Read more <ArrowRight className="ml-2" size={20} />
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Capabilities;
