import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import { Target, Lightbulb, Users, Award, ShieldCheck, Zap, TrendingUp, Heart } from 'lucide-react';
import valuesBg from '../assets/values-section.jpg';
import visionHeroImg from '../assets/vision-hero.jpg';

const OurVision = () => {
    const values = [
        {
            title: "Be Experts",
            icon: <Award size={32} />,
            description: "With an extensive global footprint, financial stability, and years of technical experience, we channel our expertise and know-how to deliver reliable solutions in all things related to plastics."
        },
        {
            title: "Be Problem-Solvers",
            icon: <Lightbulb size={32} />,
            description: "As an engineering company, problem solving is our forte, and we’re geared to solving challenging projects or exploring different ways to optimise our processes in order to better meet your needs."
        },
        {
            title: "Be Progressive",
            icon: <TrendingUp size={32} />,
            description: "We continually look to create better solutions, and explore, evaluate & apply new ideas & possibilities that are relevant to you."
        }
    ];

    const pillars = [
        "Quality", "Delivery", "Productivity", "Continuous Improvement", "Teamwork"
    ];

    return (
        <div className="flex flex-col">
            <HeroSection
                title="A one-stop precision plastic engineering company"
                backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069"
            />

            {/* Intro Section */}
            <section className="py-20 bg-white">
                <div className="container-custom text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Sunningdale Tech Ltd is a leading manufacturer of precision plastic components. The Group provides one-stop, turnkey plastic solutions, with capabilities ranging from product & mould designs, mould fabrication, injection moulding, complementary ﬁnishings, through to the precision assembly of complete products.
                        </p>

                        <p className="text-gray-600 leading-relaxed mb-6">
                            Boasting a total factory space of more than 4 million sq feet, with more than 1,000 injection moulding machines and a tooling capacity of 2,000 moulds per year, Sunningdale Tech is focusing on serving four key business segments – Automotive/Aerospace, Consumer/IT, Healthcare and Tooling.
                        </p>

                        <p className="text-gray-600 leading-relaxed mb-6">
                            With manufacturing facilities across Singapore, Malaysia (Johor, Penang), China (Tianjin, Shanghai, Suzhou, Zhongshan, Guangzhou, and Chuzhou), Latvia (Riga), Mexico (Guadalajara), North America (Phoenix), India (Chennai), Thailand (Rayong), and Indonesia (Batam), Sunningdale Tech is strategically positioned to target and capture opportunities in diverse business sectors globally.
                        </p>

                        <p className="text-gray-600 leading-relaxed">
                            As an industry leader with deep engineering expertise and experience, Sunningdale Tech is driven to solve your challenges by applying our advanced capabilities & leading technology in ways that beneﬁt you. We're ready to provide solutions at every step of the process to reduce lead time and add value for customers, while maintaining our excellent quality. Beyond that, we build on our strong foundations to think out of the box and apply relevant new possibilities for your complex engineering problems. Customers can trust us to constantly solve challenges to meet their needs, and apply new ideas for better outcomes.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="mb-10 border-b border-slate-100 pb-6">
                                <h2 className="text-5xl font-bold text-primary mb-2">Our Vision</h2>
                            </div>
                            <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed">
                                World leading precision plastic solution-provider recognized for our extensive engineering expertise and experience.
                            </p>
                        </motion.div>

                        {/* Right Column - Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg"
                        >
                            <img
                                src={visionHeroImg}
                                alt="Our Vision"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>


            {/* Values Section */}
            <section className="py-20 bg-white border-b border-slate-100">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Content */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-10 border-b border-slate-100 pb-6">
                                <h2 className="text-5xl font-bold text-primary mb-2">Values</h2>
                            </div>

                            <div className="space-y-8">
                                {values.map((value, index) => (
                                    <div key={value.title}>
                                        <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
                                            <span className="mr-2">•</span> {value.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed pl-5">
                                            {value.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Image */}
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={valuesBg}
                                alt="Our Values"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 5 Pillars Section */}
            <section className="py-20 bg-primary text-white">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-white">5 Pillars of Operational Excellence</h2>
                        <p className="text-blue-100 max-w-2xl mx-auto">The foundation of our operational success and quality commitment.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {pillars.map((pillar, index) => (
                            <motion.div
                                key={pillar}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                whileHover={{
                                    scale: 1.05,
                                    y: -8,
                                    transition: { duration: 0.3, ease: "easeOut" }
                                }}
                                whileTap={{ scale: 0.95 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.15,
                                    ease: "easeOut"
                                }}
                                className="bg-white border border-white/20 p-6 rounded-lg text-center hover:shadow-2xl transition-all text-primary cursor-pointer group"
                            >
                                <div className="font-bold text-lg group-hover:scale-110 transition-transform duration-300">{pillar}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Policies Section */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-4 mb-4">
                                <ShieldCheck className="text-primary" size={32} />
                                <h3 className="text-2xl font-bold text-slate-900">QEEHS Policy</h3>
                            </div>
                            <p className="text-slate-600 mb-6">
                                In pursuit of our business excellence, we commit to Surpass Customer Expectations, and Continual Improvement of our Quality, Environment, Energy, Health and Safety (QEEHS) management system performance.
                            </p>
                            <a href="/QEEHS_Policy_-_English_28Y24101829.pdf" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">View QEEHS Policy &rarr;</a>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-4 mb-4">
                                <Users className="text-primary" size={32} />
                                <h3 className="text-2xl font-bold text-slate-900">Data Privacy Policy</h3>
                            </div>
                            <p className="text-slate-600 mb-6">
                                The Data Privacy Policy sets out how Sunningdale Tech Ltd and its related corporations diligently manage your personal data with care and sensitively.
                            </p>
                            <a href="/Sunningdale_Data_Privacy_Policy_ Aug2020_for_website.pdf" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">View Data Privacy Policy &rarr;</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OurVision;
