import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import { MapPin, Award, CheckCircle } from 'lucide-react';
import CorporateStructure from '../components/CorporateStructure';

const GlobalPresence = () => {
    // Map locations with coordinates (adjusted to match actual geographic positions)
    const mapLocations = [
        { id: 'singapore', name: 'Singapore', x: 72.3, y: 48, region: 'Asia Pacific' },
        { id: 'tianjin', name: 'Tianjin, China', x: 75, y: 39, region: 'Asia Pacific' },
        { id: 'changzhou', name: 'Changzhou, China', x: 75.6, y: 40, region: 'Asia Pacific' },
        { id: 'chuzhou', name: 'Chuzhou, China', x: 74.5, y: 41, region: 'Asia Pacific' },
        { id: 'suzhou', name: 'Suzhou, China', x: 74.5, y: 40, region: 'Asia Pacific' },
        { id: 'shanghai', name: 'Shanghai, China', x: 76, y: 41, region: 'Asia Pacific' },
        { id: 'guangzhou', name: 'Guangzhou, China', x: 74.5, y: 42, region: 'Asia Pacific' },
        { id: 'zhongshan', name: 'Zhongshan, China', x: 74.5, y: 43, region: 'Asia Pacific' },
        { id: 'hongkong', name: 'Hong Kong, China', x: 75, y: 43, region: 'Asia Pacific' },
        { id: 'penang', name: 'Penang, Malaysia', x: 71.5, y: 47, region: 'Asia Pacific' },
        { id: 'johor', name: 'Johor, Malaysia', x: 71.8, y: 48, region: 'Asia Pacific' },
        { id: 'chennai', name: 'Chennai, India', x: 66, y: 45, region: 'Asia Pacific' },
        { id: 'rayong', name: 'Rayong, Thailand', x: 71.5, y: 45, region: 'Asia Pacific' },
        { id: 'batam', name: 'Batam, Indonesia', x: 72.5, y: 49, region: 'Asia Pacific' },
        { id: 'jakarta', name: 'Jakarta, Indonesia', x: 71, y: 48.5, region: 'Asia Pacific' },
        { id: 'michigan', name: 'Michigan, USA', x: 27, y: 37, region: 'Americas' },
        { id: 'arizona', name: 'Arizona, USA', x: 19, y: 40, region: 'Americas' },
        { id: 'guadalajara', name: 'Guadalajara, Mexico', x: 21, y: 42, region: 'Americas' },
        { id: 'riga', name: 'Riga, Latvia', x: 54, y: 31, region: 'Europe' }
    ];

    const locations = {
        asia: [
            {
                country: "Singapore",
                facilities: [
                    {
                        company: [
                            "Sunningdale Tech Ltd (HQ)",
                            "Sunningdale Precision Industries Ltd",
                            "Omni Mold Ltd",
                            "First Engineering Limited"
                        ],
                        address: "51 Joo Koon Circle Singapore 629069",
                        phone: "+65 6861 1161",
                        fax: "+65 6861 6186",
                        email: "sales@sdaletech.com"
                    },
                    {
                        company: "UFE (A division of Omni Mold Ltd)",
                        address: "18 Joo Koon Crescent Singapore 629019"
                    },
                    {
                        company: "Sanwa Plastic Industry Pte Ltd",
                        address: "28 Woodlands Loop, Singapore 738308",
                        phone: "+65 6755 1123",
                        fax: "+65 6754 8911"
                    }
                ]
            },
            {
                country: "China",
                facilities: [
                    {
                        city: "Guangzhou",
                        company: "First Engineering (Guangzhou) Co., Ltd",
                        address: "No.701 Kai Chuang Road, GETDD, Guangdong, P.R. China",
                        phone: "+86 (20) 8226 4470",
                        fax: "+86 (20) 8226 4217"
                    },
                    {
                        city: "Changzhou",
                        company: "Sanwa-Intec (Changzhou) Co Ltd",
                        address: "16 Chuangye Road, Xinbei District, Changzhou GDH Industrial Park, Unit 12-A, China 213033",
                        phone: "+86 (519) 8586 0708",
                        fax: "+86 (519) 8586 0809"
                    },
                    {
                        city: "Chuzhou",
                        company: "Sunningdale Precision Tech (Chuzhou) Co Ltd",
                        address: "No.18 Lanzhou Road, Suzhou-Chuzhou Modern Industrial Park, Chuzhou City, Anhui Province, P.R.China 239000"
                    },
                    {
                        city: "Suzhou",
                        company: "Omni Tech (Suzhou) Co., Ltd",
                        address: "428 Xinglong Street, Unit 7A Suchun Factory, Suzhou Industrial Park 215024, P.R China",
                        phone: "+86 (512) 6283 3860",
                        fax: "+86 (512) 6283 3861"
                    },
                    {
                        city: "Zhongshan",
                        company: "Zhongshan Zhihe Electrical Equipment Co., Ltd",
                        address: "Qian Jin Er Lu, Xin Qian Jin Cun, Tanzhou Town, Zhongshan Guangdong, China",
                        phone: "+86 (760) 86983333",
                        fax: "+86 (760) 86655786"
                    },
                    {
                        city: "Tianjin",
                        company: "Sunningdale Innovative Technology (Tianjin) Co Ltd",
                        address: "No. 66, Avenue 9, Factory A, FengHua Industrial Park, TEDA, Tianjin 300457, PRC",
                        phone: "+86 (022) 2532 8690",
                        fax: "+86 (022) 2532 8691"
                    },
                    {
                        company: "Sanwa-Intec (Tianjin) Co Ltd",
                        address: "66 Ninth Ave, TEDA, Tianjin, China 300457",
                        phone: "+86 (022) 6629 9798",
                        fax: "+86 (022) 2532 2948"
                    },
                    {
                        city: "Shanghai",
                        company: "First Engineering (Shanghai) Co., Ltd",
                        address: "Block 51, No.199 North Riying RD, Waigaoqiao Free Trade Zone, Pudong, Shanghai 200131 P.R. China",
                        phone: "+86 (21) 5046 0300",
                        fax: "+86 (21) 5046 0330"
                    },
                    {
                        city: "Hong Kong",
                        company: "Chi Wo Plastic Moulds Fty Ltd",
                        address: "Room 2808, 28/F, Wu Chung House, 213 Queen's Road East, Wan Chai, Hong Kong",
                        phone: "+86 (760) 86983333",
                        fax: "+86 (760) 86655786"
                    }
                ]
            },
            {
                country: "Malaysia",
                facilities: [
                    {
                        city: "Johor",
                        company: "SDP Manufacturing SDN BHD",
                        address: "34 Jalan Masyhur Satu, Taman Perindustrian Cemerlang 81800 Ulu Tiram, Johor, Malaysia",
                        phone: "+60 (07) 861 8000",
                        fax: "+60 (07) 861 6800"

                    },
                    {
                        company: "Sunningdale Tech Malaysia Sdn Bhd",
                        address: "Lot PTD 1260 & 1262, Jalan Tun Mutahir, Kawasan Perindustrian Bandar Tenggara, 81440 Bandar Tenggara, Johor, Malaysia",
                        phone: "+60 (07) 896 1482",
                        fax: "+60 (07) 896 1486"
                    },
                    {
                        company: "First Engineering Plastics (Malaysia) Sdn. Bhd",
                        address: "No 23 Jalan Persiaran Teknologi Taman Teknologi Johor, 81400 Senai, Johor, Malaysia",
                        phone: "+60 (07) 597 8555",
                        fax: "+60 (07) 599 0202"
                    },
                    {
                        city: "Penang",
                        company: "Sunningdale Tech Penang Sdn Bhd",
                        address: "PMT 748, Lingkaran Cassia Selantan, Taman Perindustrian Batu Kawan, 14110 Bandar Cassia, Penang"
                    }
                ]
            },
            {
                country: "India",
                facilities: [
                    {
                        city: "Chennai",
                        company: "First Engineering Plastics India Pvt. Ltd.",
                        address: "Plot B72 Sipcot Industrial Park, Irrungattukottai, Sriperumbudur, Kancheepuram District, Chennai 602105, Tamil Nadu, India",
                        phone: "+91 (44) 4711 2000",
                        fax: "+91 (44) 4711 2001"
                    },
                    {
                        company: "Sanwa Synergy Holdings India Pvt. Ltd.",
                        address: "Plot No 39/1, Mahindra World City Post,Chengalpattu Taluk, Kanchipuram Dist.,Pin 603004, Tamilnadu, India",
                        phone: "+91 (44) 4968 2100",
                        fax: "+91 (44) 4968 2101"
                    }
                ]
            },
            {
                country: "Indonesia",
                facilities: [
                    {
                        city: "Batam",
                        company: "PT. Sunningdale Tech Batam",
                        address: "Panbil Industrial Estate, Factory B2 Lot 8-9 Jl. Ahmad Yani, Muka Kuning Batam 29433, Indonesia",
                        phone: "+62 (778) 807 1001",
                        fax: "+62 (778) 807 1000"
                    },
                    {
                        company: "PT. Sanwa Engineering Batam",
                        address: "Blok 215A/B, Jalan Beringin, Batamindo Industrial Park, Mukakuning, Batam 29433, Indonesia",
                        phone: "+62 (770) 611 688",
                        fax: "+62 (770) 611 430"
                    },
                    {
                        city: "Jakarta",
                        company: "PT. Sanwa Engineering Indonesia",
                        address: "Delta Silicon Industrial Park, Jl. Kruing Blok L5 No. 3A, Lemahabang, Bekasi 17550, Indonesia",
                        phone: "+62 (21) 8990 6789",
                        fax: "+62 (21) 8990 6801"
                    }
                ]
            },
            {
                country: "Thailand",
                facilities: [
                    {
                        city: "Rayong",
                        company: "Sunningdale Tech (Thailand) Company Limited",
                        address: "7/452-453 Moo 6 Amata City Industrial Estate, T. Mabyangporn, A. Pluakdaneg, Rayong 21140, Thailand"
                    }
                ]
            }
        ],
        americas: [
            {
                country: "USA",
                facilities: [
                    {
                        city: "Michigan",
                        company: "Sunningdale Tech Inc.",
                        address: "100 West Big Beaver, Suite 200, Troy, MI 48084, USA",
                        phone: "+1 248 526 0517"
                    },
                    {
                        city: "Arizona",
                        company: "Moldworx, LLC",
                        address: "145 W Chilton Dr. Chandler, AZ 85225, USA",
                        phone: "+1 480 668 8400",
                        fax: "+1 480 668 9119"
                    }
                ]
            },
            {
                country: "Mexico",
                facilities: [
                    {
                        city: "Guadalajara",
                        company: "Sunningdale Technologies S.A de C.V",
                        address: "Camino al Iteso No. 8900-2C, Parque Industrial Tecnológico, Tlaquepaque Jalisco Mexico C.P. 45609",
                        phone: "+52 (33) 3134 4090",
                        fax: "+52 (33) 3134 4099"
                    }
                ]
            }
        ],
        europe: [
            {
                country: "Latvia",
                facilities: [
                    {
                        city: "Riga",
                        company: "SIA Sunningdale Tech (Riga)",
                        address: "2 Sampėtera Street, Riga, LV-1046, Latvia",
                        phone: "+371 6780 4590",
                        fax: "+371 6780 4591"
                    },
                    {
                        company: "SIA Skan-Tooling",
                        address: "Kruzes Street 2c Rīga, LV-1046, Latvia",
                        phone: "+371 6780 7794",
                        fax: "+371 6780 7791"
                    }
                ]
            }
        ]
    };

    const certifications = [
        { name: "ISO 9001", image: "https://placehold.co/300x150/ffffff/E31E24?text=ISO+9001" },
        { name: "ISO 13485", image: "https://placehold.co/300x150/ffffff/E31E24?text=ISO+13485" },
        { name: "IATF 16949", image: "https://placehold.co/300x150/ffffff/E31E24?text=IATF+16949" },
        { name: "ISO 14001", image: "https://placehold.co/300x150/ffffff/E31E24?text=ISO+14001" },
        { name: "ISO 45001", image: "https://placehold.co/300x150/ffffff/E31E24?text=ISO+45001" },
        { name: "ISO 27001", image: "https://placehold.co/300x150/ffffff/E31E24?text=ISO+27001" },
        { name: "FDA Registered", image: "https://placehold.co/300x150/ffffff/E31E24?text=FDA+Registered" },
        { name: "SMETA", image: "https://placehold.co/300x150/ffffff/E31E24?text=SMETA" }
    ];

    const renderLocationCard = (location, index) => (
        <motion.div
            key={`${location.country}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100"
        >
            <div className="flex items-start gap-3 mb-4">
                <MapPin className="text-primary mt-1 flex-shrink-0" size={24} />
                <h3 className="text-xl font-bold text-slate-900">{location.country}</h3>
            </div>
            <div className="space-y-4">
                {location.facilities.map((facility, idx) => (
                    <div key={idx} className="text-sm text-slate-600 pl-9 border-l-2 border-slate-200 pl-4">
                        {facility.city && <div className="font-bold text-slate-800 mb-1">{facility.city}</div>}
                        {facility.company && (
                            Array.isArray(facility.company) ? (
                                <div className="font-semibold text-primary mb-1">
                                    {facility.company.map((companyName, companyIdx) => (
                                        <div key={companyIdx}>{companyName}</div>
                                    ))}
                                </div>
                            ) : (
                                <div className="font-semibold text-primary mb-1">{facility.company}</div>
                            )
                        )}
                        <div className="mb-1">{facility.address}</div>
                        {facility.phone && <div>Tel: {facility.phone}</div>}
                        {facility.fax && <div>Fax: {facility.fax}</div>}
                        {facility.email && <div>Email: {facility.email}</div>}
                    </div>
                ))}
            </div>
        </motion.div>
    );

    return (
        <div className="flex flex-col">
            <HeroSection
                title="Global Presence"
                subtitle="Headquartered in Singapore, Sunningdale Tech has multiple production facilities worldwide. More than twenty years of experience and continual investment in training, information technology and advanced manufacturing machinery have won us global recognition in the plastics industry."
                backgroundImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072"
            />

            {/* Interactive World Map */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="container-custom">
                    <div className="relative max-w-6xl mx-auto">
                        <div className="relative bg-slate-800 rounded-2xl p-8 border border-slate-700 overflow-hidden">
                            {/* World Map Background Image */}
                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                <img
                                    src="/world-map.png"
                                    alt="World Map"
                                    className="w-full h-full object-contain opacity-50 brightness-0 invert"
                                />
                            </div>

                            {/* SVG Overlay for Markers */}
                            <svg viewBox="0 0 100 80" className="w-full h-auto relative z-10">
                                {/* Location Markers with Labels */}
                                {mapLocations.map((location, index) => {
                                    // Calculate label position (offset from marker)
                                    // Flip label to left side for specific cities to reduce overlap
                                    const labelOffset = 2;
                                    const flipLeft = ['chuzhou', 'suzhou', 'guangzhou', 'zhongshan', 'chennai', 'arizona', 'jakarta', 'rayong'].includes(location.id);
                                    const labelX = flipLeft ? location.x - labelOffset : location.x + labelOffset;
                                    // Make Singapore, Batam, Jakarta, and Chennai's line horizontal (same Y as marker)
                                    const labelY = ['singapore', 'batam', 'jakarta', 'chennai'].includes(location.id) ? location.y : location.y - labelOffset;

                                    return (
                                        <g key={location.id}>
                                            {/* Connecting line from marker to label */}
                                            <motion.line
                                                x1={location.x}
                                                y1={location.y}
                                                x2={labelX}
                                                y2={labelY}
                                                stroke="white"
                                                strokeWidth="0.08"
                                                opacity="0.4"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.4 }}
                                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                            />

                                            {/* Location marker */}
                                            <motion.circle
                                                cx={location.x}
                                                cy={location.y}
                                                r="0.4"
                                                fill="#E31E24"
                                                stroke="white"
                                                strokeWidth="0.2"
                                                whileHover={{ scale: 2 }}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                            />

                                            {/* Pulsing effect */}
                                            <motion.circle
                                                cx={location.x}
                                                cy={location.y}
                                                r="1.5"
                                                fill="#E31E24"
                                                className="pointer-events-none"
                                                animate={{
                                                    scale: [1, 1.5, 1],
                                                    opacity: [0.3, 0, 0.3]
                                                }}
                                                transition={{
                                                    duration: 2.5,
                                                    repeat: Infinity,
                                                    delay: index * 0.2
                                                }}
                                            />

                                            {/* Text label */}
                                            <motion.text
                                                x={labelX}
                                                y={labelY}
                                                fill="white"
                                                fontSize="1.1"
                                                fontWeight="500"
                                                textAnchor={flipLeft ? "end" : "start"}
                                                className="pointer-events-none select-none"
                                                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.4, delay: index * 0.05 + 0.2 }}
                                            >
                                                {location.name}
                                            </motion.text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Asia Locations */}
            <section className="py-20 bg-slate-50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-slate-900">Asia Pacific</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {locations.asia.map((location, index) => renderLocationCard(location, index))}
                    </div>
                </div>
            </section>

            {/* Americas Locations */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-slate-900">Americas</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {locations.americas.map((location, index) => renderLocationCard(location, index))}
                    </div>
                </div>
            </section>

            {/* Europe Locations */}
            <section className="py-20 bg-slate-50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-slate-900">Europe</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
                        {locations.europe.map((location, index) => renderLocationCard(location, index))}
                    </div>
                </div>
            </section>

            {/* Corporate Structure */}
            <CorporateStructure />

            {/* Quality Certifications */}
            <section className="py-20 bg-primary text-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Award className="mx-auto mb-4 text-white" size={48} />
                            <h2 className="text-3xl font-bold mb-4 text-white">Quality Certification</h2>
                            <p className="text-blue-100 max-w-3xl mx-auto text-lg">
                                At Sunningdale Tech, we are committed to delivering products and services of the highest quality. From quality assurance at our facilities till the final delivery of products to our clients, we have surpassed the most stringent industry standards and clients' highest expectations.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {certifications.map((cert, index) => (
                            <motion.div
                                key={cert.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="bg-white p-4 rounded-xl flex items-center justify-center hover:shadow-2xl transition-all cursor-pointer h-32"
                            >
                                <img
                                    src={cert.image}
                                    alt={cert.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GlobalPresence;
