import React, { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const JobApplicationModal = ({ isOpen, onClose, jobTitle, jobEmail }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        resume: null,
        coverLetter: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, resume: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            let resumeUrl = null;

            // Upload Resume to Supabase Storage if it exists
            if (formData.resume) {
                const fileExt = formData.resume.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
                // Upload to Supabase Storage
                // Use 'applications' folder for organization
                const { data, error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(`applications/${fileName}`, formData.resume);

                if (uploadError) throw uploadError;

                // Store file path directly for Private Buckets
                resumeUrl = data.path;
            }

            // Insert Application into Supabase Database
            const { data: appData, error: insertError } = await supabase
                .from('applications')
                .insert([{
                    job_title: jobTitle,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    resume_url: resumeUrl || null,
                    status: 'applied',

                }])
                .select(); // Fetch returned data to get ID

            if (insertError) throw insertError;

            // Trigger Auto-Analysis (Fire and Forget)
            if (appData && appData[0]) {
                fetch(`http://localhost:3000/api/analyze-supabase-application/${appData[0].id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                }).catch(err => console.error('Error triggering analysis:', err));
            }

            if (insertError) throw insertError;

            setStatus('success');

            // Close modal after success message
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    resume: null,
                    coverLetter: ''
                });
            }, 3000);

        } catch (error) {
            console.error('Error submitting application:', error);
            setStatus('error');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Apply for Position</h2>
                            <p className="text-sm text-slate-500">{jobTitle}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {status === 'success' ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Application Sent!</h3>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                            placeholder="+65 1234 5678"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Resume / CV *</label>
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            required
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                            <Upload size={24} />
                                            {formData.resume ? (
                                                <span className="font-medium text-primary">{formData.resume.name}</span>
                                            ) : (
                                                <>
                                                    <span className="font-medium">Click to upload or drag and drop</span>
                                                    <span className="text-xs">PDF, DOC, DOCX (Max 5MB)</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Cover Letter (Optional)</label>
                                    <textarea
                                        name="coverLetter"
                                        rows="4"
                                        value={formData.coverLetter}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                                        placeholder="Tell us why you're a great fit..."
                                    ></textarea>
                                </div>

                                {status === 'error' && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                                        <AlertCircle size={16} />
                                        Failed to send application. Please try again.
                                    </div>
                                )}

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                        disabled={status === 'submitting'}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="flex-1 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                                    >
                                        {status === 'submitting' ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            'Submit Application'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default JobApplicationModal;
