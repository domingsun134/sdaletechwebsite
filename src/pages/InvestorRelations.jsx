import React from 'react';
import HeroSection from '../components/HeroSection';
import { FileText, ExternalLink, Calendar } from 'lucide-react';

const InvestorRelations = () => {
    return (
        <div className="flex flex-col">
            <HeroSection
                title="Investor Relations"
                backgroundImage="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=2070"
            />

            <div className="container-custom py-20 space-y-20">
                {/* Company Overview */}
                <section className="max-w-4xl mx-auto">
                    <div className="prose prose-lg text-slate-600 max-w-none">
                        <p className="mb-6">
                            Sunningdale Tech Ltd is a leading manufacturer of precision plastic components. The Group provides one-stop, turnkey plastic solutions, with capabilities ranging from product & mould designs, mould fabrication, injection moulding, complementary finishings, through to the precision assembly of complete products.
                        </p>
                        <p className="mb-6">
                            Boasting a total factory space of more than 3 million sq. feet, with more than 1000 injection moulding machines and a tooling capacity of 2,000 moulds per year, Sunningdale Tech is focusing on serving four key business segments – automotive, consumer/IT/environment, healthcare and tooling.
                        </p>
                        <p>
                            With manufacturing facilities across Singapore, Malaysia (Johor, Penang), China (Tianjin, Shanghai, Suzhou, Zhongshan, Guangzhou, and Chuzhou), Latvia (Riga), Mexico (Guadalajara), India (Chennai), Thailand (Rayong), and Indonesia (Batam), Sunningdale Tech is strategically positioned to target and capture opportunities in diverse business sectors globally.
                        </p>
                    </div>
                </section>

                {/* Annual Reports */}
                <section className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Annual Reports</h2>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Sunningdale Tech Ltd Annual Report 2019</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="/assets/STL_AnnualReport2019.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
                            >
                                <FileText size={20} />
                                View PDF (2.95mb)
                            </a>
                            <a
                                href="https://ir.listedcompany.com/tracker.pl?type=5&id=130517&m=78be10e2046b4a0663cb897669d5098d691b7be21c0834d6ab4e07fba0ac515c&redirect=https%3A%2F%2Fsunningdale.listedcompany.com%2Fmisc%2Far2019%2F"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
                            >
                                <ExternalLink size={20} />
                                View in Flipbook Format
                            </a>
                        </div>
                    </div>
                </section>

                {/* Latest News */}
                <section className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">Latest News</h2>
                        <a href="https://investor.sdaletech.com/newsroom.html" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">See all news</a>
                    </div>

                    <div className="space-y-6">
                        {/* News Item 1 */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                <Calendar size={16} />
                                <span>16 April 2021</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">Payment Of The Scheme Consideration And Delisting Of The Company</h3>
                            <a
                                href="https://investor.sdaletech.com/news.html/id/2328977"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary font-medium hover:gap-2 inline-flex items-center transition-all"
                            >
                                Read More <ExternalLink size={14} className="ml-1" />
                            </a>
                        </div>

                        {/* News Item 2 */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                <Calendar size={16} />
                                <span>15 April 2021</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">Delisting Of Security</h3>
                            <a
                                href="https://investor.sdaletech.com/news.html/id/2328798"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary font-medium hover:gap-2 inline-flex items-center transition-all"
                            >
                                Read More <ExternalLink size={14} className="ml-1" />
                            </a>
                        </div>

                        {/* News Item 3 */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                <Calendar size={16} />
                                <span>08 April 2021</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">Effective Date Of The Scheme</h3>
                            <a
                                href="https://investor.sdaletech.com/news.html/id/2328046"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary font-medium hover:gap-2 inline-flex items-center transition-all"
                            >
                                Read More <ExternalLink size={14} className="ml-1" />
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default InvestorRelations;
