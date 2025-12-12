import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Settings, TrendingUp, ShieldCheck, Globe, Building, Factory, Network } from 'lucide-react';

const CorporateStructure = () => {
    // Add Tools icon if not available in lucide-react
    const Tools = ({ size = 24, ...props }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 1v3m0 0v3m0-3h3m-3 0H9m8 0h2m-2 0v2m0-2v-2m0 16v-2m0 2h-2m2 0h2m-2 0v-2m0 2v2m0-16v2m0-2h2m-2 0H9" />
            <rect x="5" y="5" width="14" height="14" rx="2" />
        </svg>
    );

    const structure = {
        role: "Sunningdale Tech Ltd\n(Singapore)",
        icon: <Building size={24} />,
        children: [
            {
                role: "Omni Mold Ltd\n(Singapore)",
                icon: <Factory size={20} />,
                children: [
                    {
                        role: "SIA Skan-Tooling\n(Europe, Latvia)",
                        icon: <Tools size={16} />
                    },
                    {
                        role: "Omni Mold Investment Holding Pte Ltd\n(Singapore)",
                        icon: <Tools size={16} />,
                        children: [
                            {
                                role: "Omni Tech (Suzhou) Co., Ltd\n(PRC, Suzhou)",
                                icon: <Factory size={16} />
                            }
                        ]
                    }
                ]
            },
            {
                role: "Plasolux Pte Ltd\n(Singapore)",
                icon: <Factory size={20} />,
            },
            {
                role: "Sunningdale Tech Investment Holding Pte Ltd\n(Singapore)",
                icon: <Network size={20} />,
                children: [
                    {
                        role: "SIA Sunningdale Tech Riga\n(Europe, Latvia)",
                        icon: <Factory size={16} />
                    }
                ]
            },
            {
                role: "Sunningdale Tech (Malaysia) Sdn Bhd\n(Malaysia)",
                icon: <Factory size={20} />,
                children: [
                    {
                        role: "Guinea Manufacturing (M) Sdn Bhd\n(Malaysia, Johor)",
                        icon: <Factory size={16} />
                    },
                    {
                        role: "Seiwa-Podoyo (M) Sdn Bhd\n(Malaysia, Johor)",
                        icon: <Factory size={16} />,
                        children: [
                            {
                                role: "Sheng Ya (M) Sdn Bhd\n(Malaysia, Johor)",
                                icon: <Factory size={16} />
                            }
                        ]
                    }
                ]
            },
            {
                role: "Chi Wo Plastic Moulds Fty Ltd\n(Hong Kong)",
                icon: <Factory size={20} />,
                children: [
                    {
                        role: "Zhongshan Zhihe Electrical Equipment Co., Ltd\n(PRC, Zhongshan)",
                        icon: <Factory size={16} />
                    }
                ]
            },
            {
                role: "Sunningdale Precision Industries Ltd\n(Singapore)",
                icon: <Factory size={20} />,
                children: [
                    {
                        role: "Sunningdale Innovative Technology (Tianjin) Co., Ltd\n(PRC, Tianjin)",
                        icon: <Factory size={16} />
                    },
                    {
                        role: "Sunningdale Precision Tech (Chouzhou) Co., Ltd\n(PRC, Chuzhou)",
                        icon: <Factory size={16} />
                    },
                    {
                        role: "SDP Manufacturing Sdn Bhd\n(Malaysia, Johor)",
                        icon: <Factory size={16} />
                    },
                    {
                        role: "Sunningdale Plastics Sdn Bhd\n(Malaysia)",
                        icon: <Factory size={16} />
                    },
                    {
                        role: "Sunningdale Technologies SA de CV\n(Mexico, Guadalajara)",
                        icon: <Factory size={16} />
                    }
                ]
            },
            {
                role: "First Engineering Limited\n(Singapore)",
                icon: <Factory size={20} />,
                children: [
                    {
                        role: "First Engineering-Erwin Quarder Pte Ltd\n(Joint Venture Company)",
                        icon: <Network size={16} />,
                        children: [
                            {
                                role: "FEQ Automotive Systems (Shanghai) Co., Ltd\n(China, Shanghai)",
                                icon: <Factory size={16} />
                            }
                        ]
                    },
                    {
                        role: "First Engineering Plastics Malaysia Sdn Bhd\n(Malaysia, Johor)",
                        icon: <Factory size={16} />
                    },
                    {
                        role: "First Engineering (Guangzhou) Co Ltd\n(PRC, Guangzhou)",
                        icon: <Factory size={16} />
                    },
                    {
                        role: "First Engineering (Shanghai) Co Ltd\n(PRC, Shanghai)",
                        icon: <Factory size={16} />
                    },
                    {
                        role: "First Engineering Plastics India Private Limited\n(India, Chennai)",
                        icon: <Factory size={16} />
                    }
                ]
            },
            {
                role: "PT Sunningdale Tech Batam\n(Indonesia, Batam)",
                icon: <Factory size={20} />
            },
            {
                role: "Sunningdale Tech (Thailand) Co., Ltd\n(Thailand, Rayong)",
                icon: <Factory size={20} />
            },
            {
                role: "Sunningdale Tech Penang Sdn Bhd\n(Malaysia, Penang)",
                icon: <Factory size={20} />
            },
            {
                role: "Sunningdale Tech Inc.\n(USA, Michigan)",
                icon: <Factory size={20} />,
                children: [
                    {
                        role: "Moldworx LLC\n(USA, Arizona)",
                        icon: <Factory size={16} />
                    }
                ]
            },
            {
                role: "Sanwa Plastic Industry Pte Ltd\n(Singapore)",
                icon: <Factory size={20} />,
                children: [
                    {
                        role: "Sanwa Bioplastic Pte Ltd\n(Singapore)",
                        icon: <Factory size={16} />
                    },
                    {
                        role: "Singapore Synergy Holdings Pte Ltd\n(Singapore)",
                        icon: <Network size={16} />,
                        children: [
                            {
                                role: "Sanwa Synergy Holdings India Private Limited\n(India, Chennai)",
                                icon: <Network size={16} />
                            }
                        ]
                    },
                    {
                        role: "Unitech Holding Pte Ltd\n(Singapore)",
                        icon: <Factory size={16} />,
                        children: [
                            {
                                role: "PT Sanwa Engineering Batam\n(Indonesia, Batam)",
                                icon: <Network size={16} />
                            }
                        ]
                    },
                    {
                        role: "Sanwa-Intec (Asia) Pte Ltd\n(Singapore)",
                        icon: <Factory size={16} />,
                        children: [
                            {
                                role: "Sanwa-Intec (Changzhou)\n(China, Changzhou)",
                                icon: <Factory size={16} />
                            },
                            {
                                role: "Sanwa-Intec (Tianjin)\n(China, Tianjin)",
                                icon: <Factory size={16} />
                            }
                        ]
                    },
                    {
                        role: "PT Sanwa Engineering Indonesia\n(Indonesia, Jakarta)",
                        icon: <Factory size={20} />
                    }
                ]
            }
        ]
    };

    const TreeNode = ({ node, level = 0, isLast = true }) => {
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div className="relative">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                    className={`
                        flex items-center gap-4 p-3 rounded-lg border mb-3 transition-all hover:shadow-md
                        ${level === 0 ? 'bg-slate-900 border-slate-800 text-white shadow-lg' : ''}
                        ${level === 1 ? 'bg-white border-slate-200 text-slate-800 shadow-sm' : ''}
                        ${level > 1 ? 'bg-slate-50 border-slate-100 text-slate-600' : ''}
                    `}
                >
                    <div className={`
                        p-2 rounded-lg flex-shrink-0
                        ${level === 0 ? 'bg-white/10 text-white' : ''}
                        ${level === 1 ? 'bg-primary/10 text-primary' : ''}
                        ${level > 1 ? 'bg-slate-200 text-slate-500' : ''}
                    `}>
                        {React.cloneElement(node.icon, { size: level === 0 ? 24 : 20 })}
                    </div>

                    <div className="flex-grow">
                        <h3 className={`font-bold whitespace-pre-line ${level === 0 ? 'text-lg text-white' : 'text-sm'}`}>
                            {node.role}
                        </h3>
                    </div>
                </motion.div>

                {hasChildren && (
                    <div className="pl-8 relative">
                        {/* Vertical line connecting children */}
                        <div className="absolute left-[15px] top-0 bottom-4 w-px bg-slate-300"></div>

                        {node.children.map((child, index) => (
                            <div key={index} className="relative">
                                {/* Horizontal line to child */}
                                <div className="absolute left-[-17px] top-[24px] w-[17px] h-px bg-slate-300"></div>

                                <TreeNode
                                    node={child}
                                    level={level + 1}
                                    isLast={index === node.children.length - 1}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <section className="py-20 bg-slate-50">
            <div className="container-custom max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-slate-900">Corporate Structure</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                    <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                        Our global organizational structure reflects our international presence and operational footprint.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <TreeNode node={structure} />
                </div>
            </div>
        </section>
    );
};

export default CorporateStructure;