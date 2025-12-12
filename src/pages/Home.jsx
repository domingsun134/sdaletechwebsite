import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import heroBg from '../assets/hero-bg.png';
import automotiveImg from '../assets/auto-banner.jpg';
import consumerImg from '../assets/consumer.jpg';
import healthcareImg from '../assets/health.jpg';
import toolingImg from '../assets/tooling.jpg';
import ppeImg from '../assets/sdalemask.jpg';

const Home = () => {
    const { content } = useContent();
    const { hero, about, globalFootprint } = content.home;

    const businessSegments = [
        {
            title: "Automotive / Aerospace",
            image: automotiveImg,
            description: "Precision components for the automotive industry, ensuring safety and performance.",
            color: "bg-blue-50",
            link: "/business/automotive"
        },
        {
            title: "Consumer / IT",
            image: consumerImg,
            description: "High-quality plastic solutions for consumer electronics and IT peripherals.",
            color: "bg-gray-50",
            link: "/business/consumer-it"
        },
        {
            title: "Healthcare",
            image: healthcareImg,
            description: "Medical-grade manufacturing for healthcare devices and consumables.",
            color: "bg-blue-50",
            link: "/business/healthcare"
        },
        {
            title: "Tooling",
            image: toolingImg,
            description: "World-class tooling capabilities to support complex manufacturing needs.",
            color: "bg-gray-50",
            link: "/business/tooling"
        },
        {
            title: "Personal Protective Equipment",
            image: ppeImg,
            description: "ISO13485 certified surgical masks with high filtration capacity, meeting EN14683 and ASTM F2100 standards.",
            color: "bg-blue-50",
            link: "/business/ppe"
        }
    ];

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <HeroSection
                title={hero.title}
                backgroundImage={heroBg}
                height="h-[60vh]"
                backgroundPosition="center 30%"
                boldTitle={false}
            />

            {/* Introduction */}
            <section className="py-24 bg-white">
                <div className="container-custom text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl mx-auto"
                    >
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">About Us</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900 leading-tight">
                            {about.title.split('Plastic Engineering Company')[0]}
                            <br />
                            <span className="text-primary">Plastic Engineering Company</span>
                        </h2>
                        <p className="text-xl text-slate-600 leading-relaxed mb-10 font-light">
                            {about.description}
                        </p>
                        <Link to="/about" className="btn btn-primary">
                            Discover More
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Business Segments */}
            <section className="py-24 bg-slate-50 relative">
                <div className="container-custom relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">Our Expertise</span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Business Segments</h2>
                        <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                        {businessSegments.map((segment, index) => (
                            <motion.div
                                key={segment.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-soft hover:shadow-card transition-all duration-300 group border border-slate-100 hover:border-primary/20 overflow-hidden flex flex-col"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={segment.image}
                                        alt={segment.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors">{segment.title}</h3>
                                    <p className="text-slate-600 mb-6 leading-relaxed text-sm flex-grow">{segment.description}</p>
                                    <Link to={segment.link} className="inline-flex items-center text-primary font-semibold text-sm hover:gap-2 transition-all group-hover:translate-x-1 mt-auto">
                                        Learn more <ArrowRight size={16} className="ml-1" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global Presence Banner */}
            <section className="py-32 bg-primary text-white relative overflow-hidden">
                {/* Abstract Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light opacity-90"></div>

                <div className="container-custom relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">{globalFootprint.title}</h2>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-16 font-light">
                        {globalFootprint.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-12 max-w-3xl mx-auto text-center">
                        {globalFootprint.stats.map((stat, i) => (
                            <div key={i} className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="text-4xl md:text-5xl font-extrabold mb-2 text-white">{stat.value}</div>
                                <div className="text-blue-200 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
