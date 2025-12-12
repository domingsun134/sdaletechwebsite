import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import { FileText, Users, Shield, Zap, Award, Globe, Lock, TrendingUp, Smile, Leaf, Scale, Megaphone, Handshake, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';

const SustainabilitySection = ({ icon: Icon, title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-6 text-left group focus:outline-none"
            >
                <div className="flex items-center gap-3">
                    <Icon className="text-primary" size={24} />
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
                </div>
                {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
            </button>
            {isOpen && <div className="pb-8 animate-in fade-in slide-in-from-top-2 duration-200">{children}</div>}
        </div>
    );
};

const Sustainability = () => {
    return (
        <div>
            <HeroSection
                title="Sustainability & CSR"
                subtitle="Committed to corporate social responsibility and sustainable long-term growth."
                backgroundImage="/assets/sustainability-banner.png"
            />

            <div className="container-custom py-20 space-y-20">
                {/* Sustainability Commitment */}
                <section className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Sustainability Commitment</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                        Sunningdale Tech is committed to corporate social responsibility and sustainable long-term growth through the following:
                    </p>
                    <ul className="text-left space-y-4 text-slate-600 max-w-3xl mx-auto list-disc pl-6">
                        <li>Seeking new technologies & methods to conserve energy, minimise resource consumption and reduce waste generation to maintain environmentally friendly manufacturing and supply chain processes.</li>
                        <li>Endorsing an integrated human capital strategy which promotes fair employment practices and a safe working environment while fostering strong teamwork and employee development.</li>
                        <li>Upholding the highest standards of corporate governance and transparency with an effective risk management system to safeguard our stakeholders’ interests.</li>
                        <li>Supporting local communities by making meaningful contributions through either active participation or sponsorship.</li>
                    </ul>
                    <p className="mt-8 text-slate-600">
                        Our financial and operational objectives are aligned towards constantly improving upon our sustainability performance through regular monitoring and effective reporting channels. This policy will be communicated to our stakeholders, i.e. shareholders, business partners, suppliers, customers and our employees. It will also be made available to the public.
                    </p>
                </section>

                {/* Unified CSR Section */}
                <section>
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <Shield className="w-8 h-8 text-primary" />
                        <h2 className="text-3xl font-bold text-slate-900">Corporate Social Responsibility</h2>
                    </div>

                    <div className="bg-white px-8 py-4 rounded-xl shadow-sm border border-slate-100">
                        {/* Code of Business Ethics */}
                        <SustainabilitySection icon={Scale} title="Code of Business Ethics and Conduct" defaultOpen={true}>
                            <p className="text-slate-600 mb-4">
                                Sunningdale has in place a Code of Business Ethics and Conduct which provides guidelines to manage business ethics and prevent conflict of interests. This provides assurance that our business is conducted in a legal, ethical and fair manner and to maintain confidence from the public in the integrity of the Group and its staff. The Code is publicised in the shared folders within the Group for employees’ reference and compliance. All new employees are required to complete a declaration of interests form upon joining the Group and annual declarations are also conducted to reinforce the Code and provide an avenue for the updating of any relationships that could potentially develop in a conflict of interests.
                            </p>
                            <div className="flex flex-col gap-2 mt-6 mb-8">
                                <a href="/assets/STL-Code-of-Business-Ethics-and-Conduct.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium flex items-center gap-2">
                                    <FileText size={16} /> Corporate Code of Business Ethics & Conduct
                                </a>
                                <a href="/assets/Supplier-Business-Code-of-Ethics-Statement.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium flex items-center gap-2">
                                    <FileText size={16} /> Suppliers Business Code of Ethics Statement
                                </a>
                            </div>
                        </SustainabilitySection>

                        {/* Whistle Blowing Policy */}
                        <SustainabilitySection icon={Megaphone} title="Whistle Blowing Policy">
                            <p className="text-slate-600 mb-4">
                                The Group’s Whistle Blowing Policy provides an avenue to employees to raise concerns and offer reassurances that they are protected from reprisals or victimization for whistle-blowing in good faith.
                            </p>
                            <p className="text-slate-600">
                                To ensure the programme is administered impartially, a Whistle-Blowing Committee (WBC) has been formed under the oversight of the Board. The WBC consists of the CEO, CFO, CHRO and the Head of Group Internal Audit & Risk Management and is empowered to look into all issues / concerns relating to the Group. The Board looks into reports and recommendations from the WBC, as well as issues/ concerns relating specifically to or concerning any member of the WBC.
                            </p>
                        </SustainabilitySection>

                        {/* Group Labor Policy */}
                        <SustainabilitySection icon={Users} title="Group Labor Policy">
                            <p className="text-slate-600 mb-4">
                                Sunningdale Tech is committed to respect the human rights of workers, and to treat them with dignity. This applies to direct and indirect suppliers, as well as all workers including temporary, migrant, student, contract, direct employees, and any other type of workers.
                            </p>
                            <a href="/assets/STL-Group-Labor-Policy.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium flex items-center gap-2">
                                <FileText size={16} /> Group Labor Policy
                            </a>
                        </SustainabilitySection>

                        {/* Team Work */}
                        <SustainabilitySection icon={Handshake} title="Team Work">
                            <p className="text-slate-600">
                                As one of the pillars for excellence, Sunningdale fosters strong teamwork and co-operation spirit among workers and departments in the organisation. It is with this strong belief that actions and decisions are often carried out cooperatively and collectively. Staff work well together and are supportive of one another. This has resulted in encouraging more effective solutions and achieving better results in many areas which contribute to the growth of the organisation in terms of business opportunities and maximizing our capabilities.
                            </p>
                        </SustainabilitySection>

                        {/* Learning and Development */}
                        <SustainabilitySection icon={GraduationCap} title="Learning and Development">
                            <div className="space-y-4">
                                <p className="text-slate-600">
                                    Sunningdale is committed to developing and providing employees with equal opportunities for training in a variety of ways based on their strengths and needs. On-the-job trainings are provided to allow employees to learn and improve their knowledge and skills and gain experience to handle their daily tasks more effectively. The line managers and supervisors are responsible for the development of their team members through on-the-job training. This, as well as, job rotations, is also provided to fresh graduates from polytechnics and universities. Coached and mentored under the guidance of the experienced employees in the same department, these fresh graduates acquire both general skills and the specific skills that are unique to their jobs in a more systematic manner, thus giving them the benefits of experience required for the job.
                                </p>
                                <p className="text-slate-600">
                                    External courses are arranged for employees to further enhance their knowledge in their respective functions. To tap on the grants offered by the government, the Group has sponsored Toolroom machinists to attend the Diploma in Precision Engineering Course jointly organized by the Polytechnics and EDB, SPRING Singapore and WDA to further upgrade their knowledge and skills. All these support the Group's drives towards higher productivity and technical capabilities.
                                </p>
                                <p className="text-slate-600">
                                    The Group also offers a variety of other training courses for management and professional development. Development opportunities include professional courses and certification courses that help the management and professional to stay relevant in their respective fields / functions.
                                </p>
                                <p className="text-slate-600">
                                    Overseas attachment programmes develop the employees' leadership capabilities and build a global mindset with the capacity to appreciate and leverage the trend and business practices in different parts of the globe. Employees' career aspirations are met which enable us to retain talents who have the necessary skills and capabilities to propel the Group forward.
                                </p>
                            </div>
                        </SustainabilitySection>

                        {/* Performance Management */}
                        <SustainabilitySection icon={TrendingUp} title="Performance Management">
                            <p className="text-slate-600">
                                Compensations and benefits and all aspects of employment are administered in a fair and objective manner based on employees' abilities, performance and contributions. Adopting a performance-based compensation scheme, employees are appraised annually on a number of competencies. This performance-based system rewards individuals according to their performance and contribution which contribute to the effective management of the individuals and the teams, thus helping the Group towards achieving its goals. Promotion is also linked to the results of the performance appraisal that opens career advancement opportunities to staff as a form of motivation and talent retention.
                            </p>
                        </SustainabilitySection>

                        {/* Recreational Activities */}
                        <SustainabilitySection icon={Smile} title="Recreational Activities">
                            <p className="text-slate-600">
                                Quarterly parties such as the Durian Party, Food Fair and festive celebrations are organised every year. These activities are held in the premises of the Group so that all employees from all departments could take part in. Well-received by employees, these activities promote greater interaction amongst employees and better understanding of one another. These occasions go a long way to boost the morale of the staff. They help create a healthy and harmonious work environment.
                            </p>
                        </SustainabilitySection>

                        {/* Environment, Health & Safety */}
                        <SustainabilitySection icon={Leaf} title="Environment, Health & Safety">
                            <p className="text-slate-600 mb-6">
                                Sunningdale is committed to surpass Customer and relevant stakeholders' expectation towards Environment, Health & Safety (EHS) through an integrated Quality, Environmental, Health and Safety management systems.
                            </p>
                            <p className="text-slate-600 mb-6">
                                The group currently has a variety of programs to improve EHS awareness on preventing pollution and mitigating occupational risks through:-
                            </p>
                            <h4 className="font-bold text-slate-900 mb-4">Key Programs:</h4>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-8">
                                <li>Maintaining an ISO14001 certification in all the operating sites.</li>
                                <li>Establishing measurement & monitoring list to track emission & discharge limit,
                                    working environment condition and permit/license validity to ensure compliance to legal requirement.</li>
                                <li>Promoting EHS awareness to our employees through induction training for new employees and regular EHS promotional programs.</li>
                                <li>Creating EHS awareness with our suppliers. A Vendor survey form which require Supplier to acknowledge their compliance to EHS regulatory requirement and declaration of restricted substances and areas of non-compliance.</li>
                            </ul>

                            <h4 className="font-bold text-slate-900 mb-4">Objectives & Targets</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="p-4 font-semibold text-slate-900">Objectives</th>
                                            <th className="p-4 font-semibold text-slate-900">Targets</th>
                                            <th className="p-4 font-semibold text-slate-900">Program</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-600 text-sm">
                                        <tr className="border-b border-slate-100">
                                            <td className="p-4 align-top">Accidents & Incident Rate, near-miss & non-compliances</td>
                                            <td className="p-4 align-top">Reduction by 50% from previous year</td>
                                            <td className="p-4 align-top">
                                                <ul className="list-disc pl-4 space-y-1">
                                                    <li>EHS orientation conducted to all newly joined employees</li>
                                                    <li>Monthly trendchart review</li>
                                                    <li>Yearly EHS training and promotion</li>
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-slate-100">
                                            <td className="p-4 align-top">Energy conservation program</td>
                                            <td className="p-4 align-top">Reduce consumption through improving operating efficiency</td>
                                            <td className="p-4 align-top">
                                                <ul className="list-disc pl-4 space-y-1">
                                                    <li>Introduce energy saving initiatives such as LED light replacements and regulating compressed air supply</li>
                                                    <li>Installation of light switch sensors at lift lobby, toilets & canteen</li>
                                                    <li>Monitoring of energy usages</li>
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-slate-100">
                                            <td className="p-4 align-top">Waste management program</td>
                                            <td className="p-4 align-top">
                                                <ul className="list-disc pl-4 space-y-1">
                                                    <li>Eliminate improper segregation & disposal</li>
                                                    <li>Reduce waste by reducing scrap, reuse & recycling program</li>
                                                </ul>
                                            </td>
                                            <td className="p-4 align-top">
                                                <ul className="list-disc pl-4 space-y-1">
                                                    <li>Fix designated location for proper segregation of all kind of wastes with signage</li>
                                                    <li>Monthly inspection of proper waste segregation</li>
                                                    <li>Introduce recycling program where applicable</li>
                                                    <li>Implement waste disposal reduction with waste treatment initiatives</li>
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 align-top">Chemical management program</td>
                                            <td className="p-4 align-top">Eliminate chemical spillage resulting in pollution</td>
                                            <td className="p-4 align-top">
                                                <ul className="list-disc pl-4 space-y-1">
                                                    <li>Provide proper secondary containment tray at handling of chemical / oil station</li>
                                                    <li>Adequate training provided for all spill kit handler</li>
                                                    <li>Proper storage of chemical</li>
                                                </ul>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </SustainabilitySection>

                        {/* Technology and Innovation */}
                        <SustainabilitySection icon={Zap} title="Technology and Innovation">
                            <p className="text-slate-600 mb-4">
                                To ensure the Group continues to be relevant as a partner to our customers, management deploys significant resources to engage customers, suppliers and research institutions to develop technology roadmaps to meet future requirements. These include early supplier involvement with customers where our engineers are deployed at customers design centers to help in the design of their products with consideration of manufacturability.
                            </p>
                            <p className="text-slate-600 mb-4">
                                Sunningdale also work closely with suppliers to modify their products or machines to be able to achieve customer expectations. Sunningdale is closely involved with SimTech (Singapore Institute of Manufacturing Technology), on development of new technology such as new polymer material, inspection methods and printing technologies. Our technical teams are also involved in consortiums organized by SimTech which has participation from industry players including customers and suppliers.
                            </p>
                            <p className="text-slate-600">
                                Sunningdale is also present in most of the important plastic trade shows to ensure customers are aware of our presence, capabilities and to understand and keep up to date on latest technology updates. Representatives at these shows include the business directors, key technical staff and GMs.
                            </p>
                        </SustainabilitySection>

                        {/* Competitiveness */}
                        <SustainabilitySection icon={Award} title="Competitiveness">
                            <p className="text-slate-600 mb-4">
                                To ensure the long term interest of the Group, management's key priority is to always remain profitable and competitive. Top management conducts monthly business and operation reviews. Support organizations are structured to ensure information is fed to GMs early to help GMs address potential problematic areas.
                            </p>
                            <p className="text-slate-600 mb-4">
                                The Group is also committed to meet all quality standards and are certified in ISO9001:2000 in all the plants. Where automotive and healthcare products are produced, they are all certified with TS 16949 and ISO13485 respectively.
                            </p>
                            <p className="text-slate-600">
                                The Group has implemented a document security and sharing system called sharepoint. This will ensure all control documents are kept under secure access and version controls. It is scalable to expand to all sites ensuring consistency in execution of procedures. There are also standards that are in place to ensure consistency in operational activities such as Workmanship Standards (WMS) and Lesson Learnt Processes (LLP) by business segments.
                            </p>
                        </SustainabilitySection>

                        {/* Responsible Minerals Sourcing Policy */}
                        <SustainabilitySection icon={Globe} title="Responsible Minerals Sourcing Policy">
                            <p className="text-slate-600 mb-4">
                                Sunningdale Tech Limited (“Sunningdale Tech” or “the Group”) is a precision plastic components manufacturer servicing the Automotive, Consumer/IT and Healthcare industries. The Group’s raw material supply chain consists primarily of suppliers of engineering plastics, paint, packaging materials such as carton boxes, polyethylene bags, steel, copper, and graphite, as well as other engineering parts and components. The Group sources these raw materials locally in Singapore and globally in countries and regions such as Malaysia, China, North America, and Europe.
                            </p>
                            <p className="text-slate-600 mb-4">
                                The Group is committed to socially responsible sourcing related to Conflict Mineral declarations and Extended Minerals which are regulated by legislators in various regions, including the United States of America and the European Union. As part of its Responsible Minerals Sourcing Policy, the Group requires suppliers to declare any raw materials or products supplied to Sunningdale Tech that are associated with conflict minerals such as tin, tantalum, tungsten, and gold ("3TG"), some of which are mined in conflict-ridden regions and used to finance armed conflict, as well as extended minerals such as cobalt and mica, in line with Extended Minerals reporting templates.
                            </p>
                            <p className="text-slate-600 mb-4">
                                In addition, Suppliers that are not direct producers of raw materials or not directly involved in the manufacturing of products supplied to Sunningdale Tech are required to conduct the necessary due diligence to ensure that their own suppliers adhere to socially responsible and conflict free sourcing principles. The Group's suppliers are required, upon request, to make available documentation and supporting evidence that demonstrates these due diligence measures.
                            </p>
                            <p className="text-slate-600 mb-4">
                                The Group will not knowingly source any metals from conflict-ridden regions and will continue to work with its suppliers to obtain the appropriate disclosures confirming that they do not procure metals from sources that fund conflict.
                            </p>
                            <a href="/assets/STL-Responsible-Minerals-Sourcing-Policy.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium flex items-center gap-2">
                                <FileText size={16} /> Responsible Minerals Sourcing Policy
                            </a>
                        </SustainabilitySection>

                        {/* Secure Trade Policy */}
                        <SustainabilitySection icon={Lock} title="Secure Trade Policy">
                            <p className="text-slate-600 mb-4">
                                Sunningdale Tech is committed to the highest standards of quality and integrity in our products and operations. We recognize the need to protect our product and resources from potential acts of terrorism or trafficking throughout our segment of the international supply chain. We strive to identify and prevent internal and external threats that could compromise the security and integrity of our employees, products, customers, suppliers and other supply chain partners. We commit to comply with secure trade requirements and focus on continuous improvement in accordance with standard legislations globally.
                            </p>
                            <p className="text-slate-600 mb-4">
                                We encourage all employees and supply chain partners to become familiar with our supply chain security practices and procedures and to remain alert to any anomalies in the international supply chain that could potentially jeopardize the security and integrity of our products and the welfare of employees. We reserve the right to modify processes and procedures as necessary to comply with applicable laws. Any security-related concerns shall be reported to whistle-blowing@sdaletech.com.
                            </p>
                            <a href="/assets/STL-Secure-Trade-Corporate-Policy.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium flex items-center gap-2">
                                <FileText size={16} /> STL Secure Trade Corporate Policy
                            </a>
                        </SustainabilitySection>

                        {/* RBA Memberships */}
                        <SustainabilitySection icon={Award} title="Responsible Business Alliance Certificates">
                            <div className="flex flex-col gap-8 items-center">
                                <img src="/assets/STL_RBA.png" alt="STL RBA" className="w-full max-w-3xl shadow-md rounded-lg" />
                                <img src="/assets/SDP_RBA.png" alt="SDP RBA" className="w-full max-w-3xl shadow-md rounded-lg" />
                                <img src="/assets/STB_RBA.png" alt="STB RBA" className="w-full max-w-3xl shadow-md rounded-lg" />
                                <img src="/assets/STM_RBA.png" alt="STM RBA" className="w-full max-w-3xl shadow-md rounded-lg" />
                                <img src="/assets/STP_RBA.png" alt="STP RBA" className="w-full max-w-3xl shadow-md rounded-lg" />
                                <img src="/assets/STT_RBA.png" alt="STT RBA" className="w-full max-w-3xl shadow-md rounded-lg" />
                                <img src="/assets/FEPM_RBA.png" alt="FEPM RBA" className="w-full max-w-3xl shadow-md rounded-lg" />
                            </div>
                        </SustainabilitySection>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Sustainability;
