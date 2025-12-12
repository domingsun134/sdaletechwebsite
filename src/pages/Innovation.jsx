import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';

// Import images
import innovationBannerImg from '../assets/innovation-banner.jpg';
import industrialDesignImg from '../assets/industrial-design.jpg';
import mechanicalDesignImg from '../assets/mechanical-design.jpg';
import materialSelectionImg from '../assets/material-selection.jpg';
import prototypingImg from '../assets/prototyping.jpg';

const Innovation = () => {
    const [activeImage, setActiveImage] = useState(industrialDesignImg);
    const [activeTitle, setActiveTitle] = useState("Industrial Design");
    const [activeDescription, setActiveDescription] = useState("From the initial idea, we propose a few Conceptual Designs. Once a final concept is chosen, the design will be fine-tuned and a rendering will be provided.");

    const innovationCapabilities = [
        {
            title: "Industrial Design",
            description: "From the initial idea, we propose a few Conceptual Designs. Once a final concept is chosen, the design will be fine-tuned and a rendering will be provided.",
            image: industrialDesignImg
        },
        {
            title: "Mechanical Design",
            description: "We do detail engineering design, considering tolerancing, manufacturing feasibility and product functionability.",
            image: mechanicalDesignImg
        },
        {
            title: "Plastic Material Selection",
            description: "We mould a wide variety of different plastic for different needs, together with our network of resin suppliers we can assist to advice suitable material for your product application.",
            image: materialSelectionImg
        },
        {
            title: "Prototyping",
            description: "With in-house 3D printers and prototyping partners we can verify the concepts and the basic function of the design.",
            image: prototypingImg
        }
    ];

    const handleCapabilityClick = (item) => {
        setActiveImage(item.image);
        setActiveTitle(item.title);
        setActiveDescription(item.description);
    };

    return (
        <div className="flex flex-col">
            <HeroSection
                title="Innovation"
                subtitle="Bringing your ideas to life through R&D & Design."
                backgroundImage={innovationBannerImg}
                height="h-[50vh]"
            />

            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                            {/* Left Column - Content & List */}
                            <div className="lg:col-span-5">
                                <div className="mb-10">
                                    <h2 className="text-3xl font-bold mb-6 text-primary">R&D & Design</h2>
                                    <div className="space-y-4 text-slate-600 leading-relaxed">
                                        <p>
                                            As the centre of technology and innovation, we continue to develop competency in plastics manufacturing technology to keep us competitive.
                                        </p>
                                        <p>
                                            We collaborate with local technology providers to equip ourselves with the latest capabilities.
                                        </p>
                                        <p>
                                            With an in-house Industrial Designer and Mechanical Design team, we can ensure aesthetic design with manufacturing solution that are implemented at an early stage.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                                    <h3 className="text-xl font-bold mb-4 text-primary border-b border-slate-200 pb-3">Capabilities</h3>
                                    <div className="flex flex-col gap-1">
                                        {innovationCapabilities.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleCapabilityClick(item)}
                                                className={`flex items-start text-left p-2 rounded-lg transition-all duration-300 group ${activeTitle === item.title ? 'bg-white shadow-md ring-1 ring-primary' : 'hover:bg-white hover:shadow-sm'}`}
                                            >
                                                <div className={`mt-0.5 mr-2 flex-shrink-0 transition-colors ${activeTitle === item.title ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>
                                                    {activeTitle === item.title ? <Check size={16} /> : <ChevronRight size={16} />}
                                                </div>
                                                <span className={`leading-tight text-sm font-medium transition-colors ${activeTitle === item.title ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                                    {item.title}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Image Display */}
                            <div className="lg:col-span-7 sticky top-24">
                                <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-100">
                                    <div className="relative aspect-[4/3] bg-slate-100">
                                        <AnimatePresence mode='wait'>
                                            <motion.img
                                                key={activeImage}
                                                src={activeImage}
                                                alt={activeTitle}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-full h-full object-cover"
                                            />
                                        </AnimatePresence>
                                    </div>
                                    <div className="bg-primary p-8 text-white">
                                        <div className="flex gap-2 mb-6">
                                            {innovationCapabilities.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`h-2 w-2 border border-white/50 ${activeTitle === innovationCapabilities[idx].title ? 'bg-white' : 'bg-transparent'}`}
                                                />
                                            ))}
                                        </div>
                                        <h4 className="text-2xl font-bold mb-4">{activeTitle}</h4>
                                        <p className="text-white/90 leading-relaxed">
                                            {activeDescription}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Innovation;
