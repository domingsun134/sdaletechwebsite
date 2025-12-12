import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';

// Import Tooling images
import productDesignImg from '../assets/product-design.jpg';
import designConsultancyImg from '../assets/design-consultancy.jpg';
import precisionMouldImg from '../assets/precision-mould.jpg';
import lsrMouldImg from '../assets/lsr-mould.jpg';
import microMouldImg from '../assets/micro-mould.jpg';
import medicalToolingImg from '../assets/medical-tooling.jpg';
import highCavitationImg from '../assets/high-cavitation.jpg';
import multiShotImg from '../assets/multi-shot.jpg';
import stackMouldImg from '../assets/stack-mould.jpg';
import complexMouldImg from '../assets/complex-mould.jpg';
import thinWallImg from '../assets/thin-wall.jpg';
import gasAssistedImg from '../assets/gas-assisted.jpg';
import insertMouldImg from '../assets/insert-mould.jpg';
import reelMouldImg from '../assets/reel-mould.jpg';
import toolingImg from '../assets/tooling.jpg';

// Import Moulding images
import highCavitationMouldingImg from '../assets/high-cavitation-moulding.jpg';
import thinWallMouldingImg from '../assets/thin-wall-moulding.jpg';
import autoInsertMouldingImg from '../assets/auto-insert-moulding.jpg';
import multiShotMouldingImg from '../assets/multi-shot-moulding.jpg';
import decorativeFilmMouldingImg from '../assets/decorative-film-moulding.jpg';
import isbmImg from '../assets/isbm.jpg';
import microMouldingImg from '../assets/micro-moulding.jpg';
import gasAssistedMouldingImg from '../assets/gas-assisted-moulding.jpg';
import rapidHeatCoolImg from '../assets/rapid-heat-cool.jpg';
import lsrPartsImg from '../assets/lsr-parts.jpg';
import cleanroomMouldingImg from '../assets/cleanroom-moulding.jpg';
import ebmImg from '../assets/ebm.jpg';

// Import Secondary Process images
import sprayPaintingImg from '../assets/spray-painting.jpg';
import laserEtchingImg from '../assets/laser-etching.jpg';
import silkscreenPrintingImg from '../assets/silkscreen-printing.jpg';
import hotStampingImg from '../assets/hot-stamping.jpg';
import ultrasonicWeldingImg from '../assets/ultrasonic-welding.jpg';
import cleanroomSecondaryImg from '../assets/cleanroom-secondary.jpg';
import automatedAssemblyImg from '../assets/automated-assembly.jpg';
import roboticAssemblyImg from '../assets/robotic-assembly.jpg';

const ToolingCapabilities = () => {
    // Tooling State
    const [activeToolingImage, setActiveToolingImage] = useState(productDesignImg);
    const [activeToolingTitle, setActiveToolingTitle] = useState("Product design capabilities");

    // Moulding State
    const [activeMouldingImage, setActiveMouldingImage] = useState(highCavitationMouldingImg);
    const [activeMouldingTitle, setActiveMouldingTitle] = useState("High cavitation, ultra precision injection moulding");

    // Secondary Processes State
    const [activeSecondaryImage, setActiveSecondaryImage] = useState(sprayPaintingImg);
    const [activeSecondaryTitle, setActiveSecondaryTitle] = useState("Automated spray painting");

    const toolingCapabilities = [
        { title: "Product design capabilities", image: productDesignImg },
        { title: "Design for manufacturing consultancy", image: designConsultancyImg },
        { title: "Precision thermoplastics mold manufacturing (10Ton to 1800Ton)", image: precisionMouldImg },
        { title: "Liquid silicone mould (Flashless moulding)", image: lsrMouldImg },
        { title: "Mould for Micro Moulding", image: microMouldImg },
        { title: "Medical device tooling with full validation", image: medicalToolingImg },
        { title: "High cavitation, fully interchangeable mould", image: highCavitationImg },
        { title: "Multi shots/components mould (Rotary platen, Automated parts transfer, Rotating stack, Indexing, 2K LSR; LSR + LSR, Thermoplastic + LSR)", image: multiShotImg },
        { title: "Multi layered stack mould", image: stackMouldImg },
        { title: "Complex technical component mould (ultra-performance engineering thermoplastics)", image: complexMouldImg },
        { title: "High speed thin wall moulds", image: thinWallImg },
        { title: "Gas assisted moulds", image: gasAssistedImg },
        { title: "In-mould insert moulds (With 3K moulding)", image: insertMouldImg },
        { title: "Reel to reel moulds", image: reelMouldImg }
    ];

    const mouldingCapabilities = [
        { title: "High cavitation, ultra precision injection moulding", image: highCavitationMouldingImg },
        { title: "Thin wall high speed moulding", image: thinWallMouldingImg },
        { title: "Auto insert moulding", image: autoInsertMouldingImg },
        { title: "Multi-shot moulding (Incorporating different materials and colors)", image: multiShotMouldingImg },
        { title: "Decorative film insert moulding (Ink transfer or formed hard films)", image: decorativeFilmMouldingImg },
        { title: "Injection stretch blow moulding", image: isbmImg },
        { title: "Micro moulding", image: microMouldingImg },
        { title: "Gas-assisted moulding", image: gasAssistedMouldingImg },
        { title: "Rapid heat cool moulding", image: rapidHeatCoolImg },
        { title: "Liquid silicone rubber (LSR)", image: lsrPartsImg },
        { title: "Cleanroom moulding environment", image: cleanroomMouldingImg },
        { title: "Extrusion blow moulding", image: ebmImg }
    ];

    const secondaryProcesses = [
        { title: "Automated spray painting", image: sprayPaintingImg },
        { title: "High precision laser etching machinery", image: laserEtchingImg },
        { title: "Advanced silkscreen and tampo printing machinery", image: silkscreenPrintingImg },
        { title: "Hot stamping", image: hotStampingImg },
        { title: "Ultrasonic and Laser welding", image: ultrasonicWeldingImg },
        { title: "Cleanroom environment (100k and 10k)", image: cleanroomSecondaryImg },
        { title: "Fully automated high precision assembly", image: automatedAssemblyImg },
        { title: "Development of robotic assembly processes", image: roboticAssemblyImg }
    ];

    return (
        <div className="flex flex-col">
            <HeroSection
                title="Manufacturing"
                subtitle="Whatever your requirements, our Tooling & Moulding capabilities together with our secondary processes and assembly means we’ve got you covered."
                backgroundImage={toolingImg}
                height="h-[50vh]"
            />

            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col gap-20">
                            {/* Tooling Section - Side by Side */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Left Column - List */}
                                <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-100">
                                    <h3 className="text-2xl font-bold mb-4 text-primary border-b border-slate-200 pb-3">Tooling</h3>
                                    <div className="flex flex-col gap-1">
                                        {toolingCapabilities.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => { setActiveToolingImage(item.image); setActiveToolingTitle(item.title); }}
                                                className={`flex items-start text-left p-2 rounded-lg transition-all duration-300 group ${activeToolingTitle === item.title ? 'bg-white shadow-md ring-1 ring-primary' : 'hover:bg-white hover:shadow-sm'}`}
                                            >
                                                <div className={`mt-0.5 mr-2 flex-shrink-0 transition-colors ${activeToolingTitle === item.title ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>
                                                    {activeToolingTitle === item.title ? <Check size={16} /> : <ChevronRight size={16} />}
                                                </div>
                                                <span className={`leading-tight text-sm font-medium transition-colors ${activeToolingTitle === item.title ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                                    {item.title}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Column - Image Display */}
                                <div className="lg:col-span-7 sticky top-24">
                                    <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-100">
                                        <div className="relative aspect-[4/3] bg-slate-100">
                                            <AnimatePresence mode='wait'>
                                                <motion.img
                                                    key={activeToolingImage}
                                                    src={activeToolingImage}
                                                    alt={activeToolingTitle}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="w-full h-full object-cover"
                                                />
                                            </AnimatePresence>
                                        </div>
                                        <div className="bg-primary p-6 text-white">
                                            <div className="flex gap-2 mb-4">
                                                {toolingCapabilities.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`h-2 w-2 border border-white/50 ${activeToolingTitle === toolingCapabilities[idx].title ? 'bg-white' : 'bg-transparent'}`}
                                                    />
                                                ))}
                                            </div>
                                            <h4 className="text-xl font-medium">{activeToolingTitle}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Moulding Section - Side by Side */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Left Column - List */}
                                <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-100">
                                    <h3 className="text-2xl font-bold mb-4 text-primary border-b border-slate-200 pb-3">Moulding</h3>
                                    <div className="flex flex-col gap-1">
                                        {mouldingCapabilities.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => { setActiveMouldingImage(item.image); setActiveMouldingTitle(item.title); }}
                                                className={`flex items-start text-left p-2 rounded-lg transition-all duration-300 group ${activeMouldingTitle === item.title ? 'bg-white shadow-md ring-1 ring-primary' : 'hover:bg-white hover:shadow-sm'}`}
                                            >
                                                <div className={`mt-0.5 mr-2 flex-shrink-0 transition-colors ${activeMouldingTitle === item.title ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>
                                                    {activeMouldingTitle === item.title ? <Check size={16} /> : <ChevronRight size={16} />}
                                                </div>
                                                <span className={`leading-tight text-sm font-medium transition-colors ${activeMouldingTitle === item.title ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                                    {item.title}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Column - Image Display */}
                                <div className="lg:col-span-7 sticky top-24">
                                    <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-100">
                                        <div className="relative aspect-[4/3] bg-slate-100">
                                            <AnimatePresence mode='wait'>
                                                <motion.img
                                                    key={activeMouldingImage}
                                                    src={activeMouldingImage}
                                                    alt={activeMouldingTitle}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="w-full h-full object-cover"
                                                />
                                            </AnimatePresence>
                                        </div>
                                        <div className="bg-primary p-6 text-white">
                                            <div className="flex gap-2 mb-4">
                                                {mouldingCapabilities.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`h-2 w-2 border border-white/50 ${activeMouldingTitle === mouldingCapabilities[idx].title ? 'bg-white' : 'bg-transparent'}`}
                                                    />
                                                ))}
                                            </div>
                                            <h4 className="text-xl font-medium">{activeMouldingTitle}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Processes Section - Side by Side */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Left Column - List */}
                                <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-100">
                                    <h3 className="text-2xl font-bold mb-4 text-primary border-b border-slate-200 pb-3">Secondary Processes</h3>
                                    <div className="flex flex-col gap-1">
                                        {secondaryProcesses.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => { setActiveSecondaryImage(item.image); setActiveSecondaryTitle(item.title); }}
                                                className={`flex items-start text-left p-2 rounded-lg transition-all duration-300 group ${activeSecondaryTitle === item.title ? 'bg-white shadow-md ring-1 ring-primary' : 'hover:bg-white hover:shadow-sm'}`}
                                            >
                                                <div className={`mt-0.5 mr-2 flex-shrink-0 transition-colors ${activeSecondaryTitle === item.title ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>
                                                    {activeSecondaryTitle === item.title ? <Check size={16} /> : <ChevronRight size={16} />}
                                                </div>
                                                <span className={`leading-tight text-sm font-medium transition-colors ${activeSecondaryTitle === item.title ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                                    {item.title}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Column - Image Display */}
                                <div className="lg:col-span-7 sticky top-24">
                                    <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-100">
                                        <div className="relative aspect-[4/3] bg-slate-100">
                                            <AnimatePresence mode='wait'>
                                                <motion.img
                                                    key={activeSecondaryImage}
                                                    src={activeSecondaryImage}
                                                    alt={activeSecondaryTitle}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="w-full h-full object-cover"
                                                />
                                            </AnimatePresence>
                                        </div>
                                        <div className="bg-primary p-6 text-white">
                                            <div className="flex gap-2 mb-4">
                                                {secondaryProcesses.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`h-2 w-2 border border-white/50 ${activeSecondaryTitle === secondaryProcesses[idx].title ? 'bg-white' : 'bg-transparent'}`}
                                                    />
                                                ))}
                                            </div>
                                            <h4 className="text-xl font-medium">{activeSecondaryTitle}</h4>
                                        </div>
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

export default ToolingCapabilities;
