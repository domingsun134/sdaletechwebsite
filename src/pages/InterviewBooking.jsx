import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';
import { supabase } from '../lib/supabase';

const InterviewBooking = () => {
    const { applicationId } = useParams();
    const [step, setStep] = useState('loading'); // loading, select, confirming, success, error
    const [candidateName, setCandidateName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchData();
    }, [applicationId]);

    const fetchData = async () => {
        try {
            console.log(`[Interview Booking] Application ID from URL: ${applicationId}`);

            // Fetch Slots for this specific application
            // Show slots where:
            // 1. application_id matches this candidate (candidate-specific slots)
            // 2. application_id is NULL (public slots, backward compatibility)
            const filterQuery = `application_id.eq.${applicationId},application_id.is.null`;
            console.log(`[Interview Booking] Filter query: ${filterQuery}`);

            const { data, error } = await supabase
                .from('interview_slots')
                .select('*')
                .eq('status', 'open')
                .or(filterQuery)
                .order('start_time', { ascending: true });

            if (error) {
                console.error('[Interview Booking] Query error:', error);
                throw error;
            }

            console.log(`[Interview Booking] Found ${data.length} slots for application ${applicationId}`);
            console.log('[Interview Booking] Slot details:', data.map(s => ({
                id: s.id,
                start: s.start_time,
                application_id: s.application_id
            })));

            const slotsData = data.map(slot => ({
                ...slot,
                startTime: slot.start_time,
                endTime: slot.end_time
            }));

            // Sort slots
            slotsData.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
            setSlots(slotsData);

            setStep('select');
        } catch (error) {
            console.error('Error fetching data:', error);
            setStep('error');
            setErrorMsg('Failed to load interview slots. Please try again later.');
        }
    };

    const handleBook = async () => {
        if (!selectedSlot) return;
        setStep('confirming');

        try {
            const response = await fetch('/api/book-interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slotId: selectedSlot.id,
                    applicationId: applicationId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to book interview');
            }

            setStep('success');
        } catch (error) {
            console.error('Booking error:', error);
            setStep('error');
            setErrorMsg(error.message || 'Failed to book interview. The slot might have been taken.');
        }
    };

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString('en-SG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString('en-SG', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (step === 'loading') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={40} className="text-primary animate-spin" />
                    <p className="text-slate-500">Loading available slots...</p>
                </div>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Interview Confirmed!</h1>
                    <p className="text-slate-600 mb-6">
                        Your interview has been successfully scheduled. A confirmation email has been sent to you.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                        <div className="flex items-center gap-3 text-slate-700 mb-2">
                            <Calendar size={18} className="text-primary" />
                            <span className="font-medium">{formatDate(selectedSlot.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                            <Clock size={18} className="text-primary" />
                            <span className="font-medium">
                                {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                            </span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-400">You can close this window now.</p>
                </div>
            </div>
        );
    }

    if (step === 'error') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl text-center">
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={40} />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h1>
                    <p className="text-slate-600 mb-6">{errorMsg}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <img src={logo} alt="Sunningdale Tech" className="h-12 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Schedule Your Interview</h1>
                    <p className="text-slate-600">Please select a time slot that works best for you.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                            <Calendar size={20} className="text-primary" />
                            Available Time Slots
                        </h2>
                    </div>

                    <div className="p-6">
                        {slots.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                No interview slots are currently available. Please contact HR directly.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {slots.map(slot => (
                                    <button
                                        key={slot.id}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all relative ${selectedSlot?.id === slot.id
                                            ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                                            : 'border-slate-100 hover:border-primary/50 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="font-bold text-slate-900 mb-1">
                                            {formatDate(slot.startTime)}
                                        </div>
                                        <div className="text-slate-600 flex items-center gap-2 text-sm">
                                            <Clock size={16} />
                                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                        </div>

                                        {selectedSlot?.id === slot.id && (
                                            <div className="absolute top-4 right-4 text-primary">
                                                <CheckCircle size={20} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                        <button
                            onClick={handleBook}
                            disabled={!selectedSlot || step === 'confirming'}
                            className={`px-8 py-3 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${!selectedSlot
                                ? 'bg-slate-300 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl active:scale-95'
                                }`}
                        >
                            {step === 'confirming' ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Confirming...
                                </>
                            ) : (
                                'Confirm Booking'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewBooking;
