import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Briefcase, Mail, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const UpcomingInterviews = ({ jobs = [], applications = [] }) => {
    const [interviews, setInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchInterviews();
    }, [jobs, applications]);

    const fetchInterviews = async () => {
        try {
            // Fetch all availability slots
            const { data, error } = await supabase
                .from('interview_slots')
                .select('*')
                .eq('status', 'booked');

            if (error) throw error;

            // Map and filter
            const mappedData = data.map(slot => ({
                ...slot,
                startTime: slot.start_time,
                endTime: slot.end_time,
                bookedBy: slot.booked_by,
                applicationId: slot.application_id,
                meetingType: slot.meeting_type,
                roomDetails: slot.room_details
            }));

            // Filter for future booked slots that belong to owned applications
            const now = new Date();
            const upcoming = mappedData.filter(slot => {
                const slotTime = new Date(slot.startTime);
                const appId = slot.bookedBy?.applicationId;
                const isOwnedApp = applications.some(app => app.id === appId);

                return slot.status === 'booked' && slotTime > now && isOwnedApp;
            });

            // Sort by date (nearest first)
            upcoming.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

            // Enrich with Hiring Manager info
            const enriched = upcoming.map(interview => {
                const appId = interview.bookedBy?.applicationId;
                const app = applications.find(a => a.id === appId);

                let hiringManagerEmail = null;

                if (app) {
                    const job = jobs.find(j => j.title === app.jobTitle);
                    if (job) {
                        hiringManagerEmail = job.hiringManagerEmail;
                    }
                }

                return { ...interview, hiringManagerEmail };
            });

            setInterviews(enriched);
        } catch (error) {
            console.error('Error fetching interviews:', error);
        } finally {
            setIsLoading(false);
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Upcoming Interviews</h2>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    {interviews.length} Scheduled
                </span>
            </div>

            {interviews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No upcoming interviews</h3>
                    <p className="text-slate-500">Scheduled interviews will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {interviews.map((interview) => (
                        <div key={interview.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-center min-w-[80px]">
                                    <span className="block text-xs font-bold uppercase tracking-wider">
                                        {new Date(interview.startTime).toLocaleDateString('en-US', { month: 'short' })}
                                    </span>
                                    <span className="block text-2xl font-bold">
                                        {new Date(interview.startTime).getDate()}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <User size={18} className="text-slate-400" />
                                        {interview.bookedBy?.name || 'Unknown Candidate'}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Mail size={14} />
                                        {interview.bookedBy?.email}
                                    </div>
                                    {interview.hiringManagerEmail && (
                                        <div className="flex items-center gap-2 text-sm text-indigo-600 mt-1 bg-indigo-50 px-2 py-0.5 rounded w-fit">
                                            <Briefcase size={14} />
                                            Manager: {interview.hiringManagerEmail}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                                        {formatTime(interview.startTime)} - {formatTime(interview.endTime)}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${interview.meetingType === 'onsite' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                            {interview.meetingType === 'onsite' ? 'Onsite' : 'Online'}
                                        </span>
                                        {interview.meetingType === 'onsite' && interview.roomDetails && (
                                            <span className="text-xs text-slate-500">
                                                {interview.roomDetails.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium border border-green-100">
                                    Confirmed
                                </span>
                                {/* We could add a 'View Application' button here if we had the ID easily accessible and a route for it */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpcomingInterviews;
