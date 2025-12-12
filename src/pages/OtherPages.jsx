import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import automotiveImg from '../assets/auto-banner.jpg';
import consumerImg from '../assets/consumer.jpg';
import healthcareImg from '../assets/health.jpg';
import toolingImg from '../assets/tooling.jpg';
import ppeImg from '../assets/sdalemask.jpg';

export const About = () => (
    <div>
        <HeroSection
            title="Our Vision & Mission"
            subtitle="To be a world-class precision plastic engineering company."
            backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
        />
        <div className="container-custom py-20">
            <h2 className="text-3xl font-bold mb-6">About Sunningdale Tech</h2>
            <p className="text-gray-600 leading-relaxed">
                Sunningdale Tech Ltd is a leading manufacturer of precision plastic components and mould making.
                The Group provides one-stop, turnkey plastic solutions, with capabilities ranging from mould design and fabrication,
                injection moulding and decorative finishing, to precision assembly.
            </p>
            {/* Add more content here based on actual site */}
        </div>
    </div>
);

export const Business = () => {
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
        <div>
            <HeroSection
                title="Our Business"
                subtitle="Serving diverse industries with precision and excellence."
                backgroundImage="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2070"
            />
            <div className="container-custom py-20">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">Our Expertise</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Business Segments</h2>
                    <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
                    <p className="text-slate-600 mt-6 max-w-2xl mx-auto">
                        We provide comprehensive solutions across various high-growth industries, leveraging our global footprint and technical expertise.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {businessSegments.map((segment, index) => (
                        <motion.div
                            key={segment.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-soft hover:shadow-card transition-all duration-300 group border border-slate-100 hover:border-primary/20 overflow-hidden flex flex-col"
                        >
                            <div className="h-56 overflow-hidden relative">
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
        </div>
    );
};



export const Contact = () => (
    <div>
        <HeroSection
            title="Contact Us"
            subtitle="Get in touch with our global team."
            backgroundImage="https://images.unsplash.com/photo-1423666639041-f1400329f036?auto=format&fit=crop&q=80&w=2070"
        />
        <div className="container-custom py-20">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-gray-600">Contact form and details...</p>
        </div>
    </div>
);

export const Careers = () => (
    <div>
        <HeroSection
            title="Careers"
            subtitle="Join us in moulding the future."
            backgroundImage="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1974"
        />
        <div className="container-custom py-20">
            <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
            <p className="text-gray-600">Job listings and culture...</p>
        </div>
    </div>
);
