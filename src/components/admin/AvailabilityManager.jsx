import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, Clock, Plus, Trash2, User, CheckCircle } from 'lucide-react';
import StatusModal from './StatusModal';

const AvailabilityManager = ({ applications = [] }) => {
    const [slots, setSlots] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newSlot, setNewSlot] = useState({
        date: '',
        startTime: '',
        endTime: ''
    });
    const [statusModal, setStatusModal] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        onConfirm: null,
        isLoading: false
    });

    useEffect(() => {
        fetchSlots();
    }, [applications]); // Re-run if applications change

    const fetchSlots = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('interview_slots')
                .select('*')
                .order('start_time', { ascending: true });

            if (data) {
                // Map snake_case DB columns to camelCase for component
                const mappedData = data.map(slot => ({
                    ...slot,
                    startTime: slot.start_time,
                    endTime: slot.end_time,
                    bookedBy: slot.booked_by,
                    applicationId: slot.application_id
                }));

                // Filter slots based on ownership AND date (today onwards)
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const filteredData = mappedData.filter(slot => {
                    // Filter out past slots
                    if (new Date(slot.startTime) < today) return false;

                    if (slot.status === 'open') return true;

                    // Check if linked application is in our owned list
                    const appId = slot.bookedBy?.applicationId || slot.applicationId;
                    return applications.some(app => app.id === appId);
                });

                setSlots(filteredData);
            }
        } catch (error) {
            console.error('Failed to fetch slots:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();
        if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) return;

        const startDateTime = new Date(`${newSlot.date}T${newSlot.startTime}`);
        const endDateTime = new Date(`${newSlot.date}T${newSlot.endTime}`);

        try {
            const { data, error } = await supabase
                .from('interview_slots')
                .insert([{
                    start_time: startDateTime.toISOString(),
                    end_time: endDateTime.toISOString(),
                    status: 'open'
                }])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                // Map snake_case to camelCase
                const addedSlot = {
                    ...data,
                    startTime: data.start_time,
                    endTime: data.end_time,
                    bookedBy: data.booked_by,
                    applicationId: data.application_id
                };

                setSlots(prev => [...prev, addedSlot].sort((a, b) => new Date(a.startTime) - new Date(b.startTime)));
                setNewSlot({ date: '', startTime: '', endTime: '' }); // Reset form
                setStatusModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Slot Added',
                    message: 'Interview slot has been added successfully.',
                    onConfirm: null
                });
            }
        } catch (error) {
            console.error('Error adding slot:', error);
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to add slot. Please try again.',
                onConfirm: null
            });
        }
    };

    const handleDeleteSlot = (id) => {
        setStatusModal({
            isOpen: true,
            type: 'confirm',
            title: 'Delete Slot',
            message: 'Are you sure you want to delete this availability slot?',
            onConfirm: async () => {
                setStatusModal(prev => ({ ...prev, isLoading: true }));
                try {
                    const { error } = await supabase
                        .from('interview_slots')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;

                    setSlots(prev => prev.filter(s => s.id !== id));
                    setStatusModal({
                        isOpen: true,
                        type: 'success',
                        title: 'Slot Deleted',
                        message: 'Availability slot deleted successfully.',
                        onConfirm: null
                    });
                } catch (error) {
                    setStatusModal({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to delete slot.',
                        onConfirm: null
                    });
                }
            }
        });
    };

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString('en-SG', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString('en-SG', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Add Slot Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Plus size={20} className="text-primary" />
                    Add Availability
                </h3>
                <form onSubmit={handleAddSlot} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                        <input
                            type="date"
                            required
                            value={newSlot.date}
                            onChange={e => setNewSlot({ ...newSlot, date: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                        <input
                            type="time"
                            required
                            value={newSlot.startTime}
                            onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                        <input
                            type="time"
                            required
                            value={newSlot.endTime}
                            onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 h-[42px]"
                    >
                        <Plus size={18} />
                        Add Slot
                    </button>
                </form>
            </div>

            {/* Slots List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Interview Slots</h3>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-slate-500">Loading slots...</div>
                ) : slots.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No availability slots added yet.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {slots.map(slot => (
                            <div key={slot.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-3 w-48">
                                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{formatDate(slot.startTime)}</div>
                                            <div className="text-sm text-slate-500">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</div>
                                        </div>
                                    </div>

                                    {slot.status === 'booked' ? (
                                        <div className="flex items-center gap-3 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-100">
                                            <CheckCircle size={18} />
                                            <div>
                                                <div className="font-medium text-sm">Booked by {slot.bookedBy?.name}</div>
                                                <div className="text-xs opacity-80">{slot.bookedBy?.email}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
                                            Available
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleDeleteSlot(slot.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Slot"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <StatusModal
                isOpen={statusModal.isOpen}
                onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                onConfirm={statusModal.onConfirm}
                isLoading={statusModal.isLoading}
            />
        </div>
    );
};

export default AvailabilityManager;
