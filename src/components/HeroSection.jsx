import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const HeroSection = ({
    title,
    subtitle,
    backgroundImage,
    height = "h-[60vh]",
    overlay = true,
    backgroundPosition = "center",
    boldTitle = true
}) => {
    return (
        <div className={clsx("relative w-full flex items-center justify-center", height)}>
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-no-repeat z-0"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundPosition: backgroundPosition
                }}
            />

            {/* Overlay */}
            {overlay && <div className="absolute inset-0 bg-black/50 z-10" />}

            {/* Content */}
            <div className="container-custom relative z-20 text-center text-white">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={clsx(
                        "text-4xl md:text-6xl mb-4 tracking-tight text-white",
                        boldTitle ? "font-extrabold" : "font-normal"
                    )}
                >
                    {title}
                </motion.h1>

                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl font-light text-gray-200 max-w-3xl mx-auto"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
        </div>
    );
};

export default HeroSection;
