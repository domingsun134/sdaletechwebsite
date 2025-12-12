import React from 'react';
import HeroSection from '../components/HeroSection';
import kohBoonHwee from '../assets/board/koh-boon-hwee.jpg';
import khooBooHor from '../assets/board/khoo-boo-hor.jpg';
import lokeWaiSan from '../assets/board/loke-wai-san.jpg';
import boardBanner from '../assets/board/board-banner.jpg';

const BoardOfDirectors = () => {
    return (
        <div>
            <HeroSection
                title="Board Of Directors"
                subtitle="To sustain future growth, the Group is continually strengthening our technical capabilities, investing in infrastructure, broadening our product support portfolio, and to further strengthen our global business development effort. We intend to continue to focus on operational excellence, on cash flow management and to build capabilities for competitive advantage."
                backgroundImage={boardBanner}
            />
            <div className="container-custom py-20">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Mr Koh Boon Hwee */}
                    <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full md:w-2/5">
                            <img src={kohBoonHwee} alt="Mr Koh Boon Hwee" className="w-full rounded-lg shadow-md" />
                        </div>
                        <div className="w-full md:w-3/5">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Mr Koh Boon Hwee</h3>
                            <p className="text-blue-600 font-medium mb-4">Non-Executive Chairman and Non-Executive Director</p>
                            <div className="text-gray-600 space-y-4 leading-relaxed">
                                <p>
                                    Mr Koh Boon Hwee is the Non-Executive Chairman and Non-Executive Director of Sunningdale Tech Ltd. He is Chairman (executive) of Credence Partners Pte Ltd. He is also currently the Non-Executive Chairman of public-listed Yeo Hiap Seng Limited, Far East Orchard Ltd, AAC Technologies Holdings Ltd and Agilent Technologies, Inc. He is also the Non-Executive Chairman of FEO Hospitality Asset Management Pte Ltd and FEO Hospitality Trust Management Pte Ltd which manage listed Far East Hospitality Trust.
                                </p>
                                <p>
                                    Mr Koh serves as a director on the board of Bank Pictet & Cie (Asia) Ltd, and is also the Chairman of the Nanyang Technological University Board of Trustees and Chairman of Rippledot Capital Advisers Pte Ltd. Mr Koh was previously Chairman of DBS Group Holdings Ltd and DBS Bank Ltd (2005-2010), Singapore Airlines Ltd (2001-2005), SIA Engineering Company Ltd (2003-2005), Singapore Telecommunications Ltd (1986-2001), Omni Industries Ltd (1996-2001), Executive Chairman of the Wuthelam Group of Companies (1991-2000) and, before that, Managing Director of Hewlett-Packard Singapore (1985–1990), where he started his career in 1977.
                                </p>
                                <p>
                                    He holds a Bachelor of Science (Mechanical Engineering) First Class Honours Degree from Imperial College, University of London, and a Master of Business Administration (with Distinction) from Harvard Business School.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mr Khoo Boo Hor */}
                    <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full md:w-2/5">
                            <img src={khooBooHor} alt="Mr Khoo Boo Hor" className="w-full rounded-lg shadow-md" />
                        </div>
                        <div className="w-full md:w-3/5">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Mr Khoo Boo Hor</h3>
                            <p className="text-blue-600 font-medium mb-4">CEO and Executive Director</p>
                            <div className="text-gray-600 space-y-4 leading-relaxed">
                                <p>
                                    Mr Khoo Boo Hor is the CEO and Executive Director of Sunningdale Tech Ltd. Prior to this appointment, he was the Group Operations Director and was responsible for the Group’s manufacturing operations. Mr Khoo played a significant role in integrating the operations of Sunningdale Precision Industries Ltd and Tech Group Asia Ltd following the merger of the two companies in July 2005.
                                </p>
                                <p>
                                    Mr Khoo was previously the Director of Operations for Hewlett-Packard (“HP”) Singapore, where he was responsible for HP’s Enterprise Storage and Server manufacturing operations. He worked in HP in various capacities for over 16 years. Mr Khoo holds a Bachelor of Science and a Bachelor of Engineering (Honours) from Monash University, as well as a Master of Business Administration from the University of Louisville, Kentucky.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mr Loke Wai San */}
                    <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full md:w-2/5">
                            <img src={lokeWaiSan} alt="Mr Loke Wai San" className="w-full rounded-lg shadow-md" />
                        </div>
                        <div className="w-full md:w-3/5">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Mr Loke Wai San</h3>
                            <p className="text-blue-600 font-medium mb-4">Non-Executive and Non-Independent Director</p>
                            <div className="text-gray-600 space-y-4 leading-relaxed">
                                <p>
                                    Mr Loke Wai San is an Non-Executive and Non-Independent Director of Sunningdale Tech Ltd. He is the Executive Chairman and Director of AEM Holdings Ltd, a company listed on the main board of the Singapore Stock Exchange. He is also a founder and Managing Director of a private equity fund adviser Novo Tellus Capital Partners. His expertise is in cross-border private equity investments in various sectors including semiconductors, IT, enterprise software, medical equipment, and manufacturing.
                                </p>
                                <p>
                                    From 2000 to 2010, he was with Baring Private Equity Asia, where he was a Managing Director and head of Baring Asia’s US office and subsequently co-head for Southeast Asia. Prior to joining Baring Asia, Mr Loke was a Vice President at venture capital fund H&Q Asia Pacific from 1999 to 2000, a Senior Manager at management consulting firm AT Kearney from 1995 to 1999, and an R&D engineer with Motorola from 1991 to 1993. Mr Loke was a former Chairman and President of Singapore American Business Association in San Francisco.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoardOfDirectors;
