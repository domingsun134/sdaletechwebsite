import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import { MapPin, Phone, Mail, Printer, Send, CheckCircle } from 'lucide-react';
import contactBanner from '../assets/contact_us_banner.png';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'Sales',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormData({
                    name: '',
                    email: '',
                    subject: 'Sales',
                    message: ''
                });
                setSubmitStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
            } else {
                const data = await response.json();
                setSubmitStatus({ type: 'error', message: data.error || "Failed to send message. Please try again." });
            }
        } catch (error) {
            console.error('Error:', error);
            setSubmitStatus({ type: 'error', message: "An error occurred. Please try again later." });
        } finally {
            setSubmitted(false);
        }
    };

    return (
        <div className="flex flex-col">
            <HeroSection
                title="Contact Us"
                subtitle="Get in touch with our global team."
                backgroundImage={contactBanner}
            />

            <div className="container-custom py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Main Address */}
                        <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <MapPin className="text-primary" /> Head Office
                            </h2>
                            <p className="text-lg text-slate-600">
                                51 Joo Koon Circle, Singapore 629069
                            </p>
                            <div className="mt-6 w-full h-64 rounded-lg overflow-hidden shadow-sm border border-slate-200">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.775876366624!2d103.6735833153316!3d1.314766362068694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da0f7a5a5a5a5b%3A0x5a5a5a5a5a5a5a5a!2s51%20Joo%20Koon%20Cir%2C%20Singapore%20629069!5e0!3m2!1sen!2ssg!4v1620000000000!5m2!1sen!2ssg"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Sunningdale Tech Head Office Map"
                                ></iframe>
                            </div>
                        </div>

                        {/* Sales Enquiries */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Sales Enquiries</h3>
                            <div className="space-y-4 text-slate-600">
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-medium block text-slate-900">Tel:</span>
                                        <a href="tel:+6568611161" className="hover:text-primary transition-colors">(65) 6861 1161</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Printer className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-medium block text-slate-900">Fax:</span>
                                        <a href="tel:+6568616186" className="hover:text-primary transition-colors">(65) 6861 6186</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-medium block text-slate-900">Email:</span>
                                        <a href="mailto:sales@sdaletech.com" className="hover:text-primary transition-colors">sales@sdaletech.com</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* IR Contact */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">IR Contact</h3>
                            <div className="space-y-4 text-slate-600">
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-medium block text-slate-900">Tel:</span>
                                        <a href="tel:+6568611161" className="hover:text-primary transition-colors">(65) 6861 1161</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Printer className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-medium block text-slate-900">Fax:</span>
                                        <a href="tel:+6568634173" className="hover:text-primary transition-colors">(65) 6863 4173</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-medium block text-slate-900">Email:</span>
                                        <a href="mailto:ir@sdaletech.com" className="hover:text-primary transition-colors">ir@sdaletech.com</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Career Opportunities */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Career Opportunities</h3>
                            <div className="space-y-4 text-slate-600">
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-medium block text-slate-900">Tel:</span>
                                        <a href="tel:+6568611161" className="hover:text-primary transition-colors">(65) 6861 1161</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Printer className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-medium block text-slate-900">Fax:</span>
                                        <a href="tel:+6568610119" className="hover:text-primary transition-colors">(65) 6861 0119</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-medium block text-slate-900">Email:</span>
                                        <a href="mailto:sgp.hr@sdaletech.com" className="hover:text-primary transition-colors">sgp.hr@sdaletech.com</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Other Enquiries */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Other Enquiries</h3>
                            <div className="space-y-6 text-slate-600">
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-2">Issues regarding Personal Data Protection Act</h4>
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-primary mt-1" />
                                        <div>
                                            <span className="font-medium block text-slate-900">Email:</span>
                                            <a href="mailto:stl-pdp@sdaletech.com" className="hover:text-primary transition-colors">stl-pdp@sdaletech.com</a>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-2">Issues regarding Corporate Social Responsibility and Sustainability</h4>
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-primary mt-1" />
                                        <div>
                                            <span className="font-medium block text-slate-900">Email:</span>
                                            <a href="mailto:csrs@sdaletech.com" className="hover:text-primary transition-colors">csrs@sdaletech.com</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-slate-100 mt-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    >
                                        <option value="Sales">Sales</option>
                                        <option value="Career Opportunities">Career Opportunities</option>
                                        <option value="Investor Relation">Investor Relation</option>
                                        <option value="Personal Data Protection Act">Personal Data Protection Act</option>
                                        <option value="Corporate Social Responsibility and Sustainability">Corporate Social Responsibility and Sustainability</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button
                                        type="submit"
                                        disabled={submitted}
                                        className="w-full md:w-auto px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {submitted ? (
                                            <>
                                                <CheckCircle size={20} /> Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={20} /> Send Message
                                            </>
                                        )}
                                    </button>

                                    {submitStatus && (
                                        <div className={`p-4 rounded-lg text-sm ${submitStatus.type === 'success'
                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                            : 'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                            {submitStatus.message}
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
