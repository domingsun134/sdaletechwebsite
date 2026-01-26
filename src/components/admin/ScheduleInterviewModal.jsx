import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Clock, Loader2, MapPin, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScheduleInterviewModal = ({ isOpen, onClose, candidateName, onSendInvites, isLoading }) => {
    const [slots, setSlots] = useState([{ date: '', startTime: '', endTime: '', type: 'online', room: null, availableRooms: null, isChecking: false }]);
    const [rooms, setRooms] = useState([]); // Fallback full list optionally

    const checkAvailability = async (index) => {
        const slot = slots[index];
        if (!slot.date || !slot.startTime || !slot.endTime) return;

        const newSlots = [...slots];
        newSlots[index].isChecking = true;
        setSlots(newSlots);

        try {
            const startISO = new Date(`${slot.date}T${slot.startTime}`).toISOString();
            const endISO = new Date(`${slot.date}T${slot.endTime}`).toISOString();

            const res = await fetch('/api/integrations/rooms/find-available', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ startTime: startISO, endTime: endISO })
            });

            if (res.ok) {
                const available = await res.json();
                setSlots(prev => {
                    const updated = [...prev];
                    updated[index].availableRooms = available;
                    updated[index].isChecking = false;
                    // Reset room if not in available list? Optional, let's keep it but maybe warn
                    if (updated[index].room && !available.find(r => r.id === updated[index].room.id)) {
                        updated[index].room = null;
                    }
                    return updated;
                });
            } else {
                throw new Error("Failed");
            }
        } catch (e) {
            console.error(e);
            setSlots(prev => {
                const updated = [...prev];
                updated[index].isChecking = false;
                alert("Failed to check availability. Please try again.");
                return updated;
            });
        }
    };

    if (!isOpen) return null;

    const handleAddSlot = () => {
        setSlots([...slots, { date: '', startTime: '', endTime: '', type: 'online', room: null, availableRooms: null, isChecking: false }]);
    };

    const handleRemoveSlot = (index) => {
        const newSlots = slots.filter((_, i) => i !== index);
        setSlots(newSlots.length ? newSlots : [{ date: '', startTime: '', endTime: '', type: 'online', room: null, availableRooms: null, isChecking: false }]);
    };

    const handleSlotChange = (index, field, value) => {
        const newSlots = [...slots];
        newSlots[index][field] = value;
        setSlots(newSlots);

        // If time changed and onsite + room selected, re-check availability? 
        // For MVP, maybe just check on render or let user verify.
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Filter out incomplete slots
        const validSlots = slots.filter(s => s.date && s.startTime && s.endTime);
        if (validSlots.length === 0) return;

        // Convert to ISO strings
        const formattedSlots = validSlots.map(s => ({
            startTime: new Date(`${s.date}T${s.startTime}`).toISOString(),
            endTime: new Date(`${s.date}T${s.endTime}`).toISOString(),
            type: s.type,
            room: s.room
        }));

        onSendInvites(formattedSlots);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Schedule Interview</h2>
                        <p className="text-slate-500 text-sm">Propose times for <span className="font-medium text-primary">{candidateName}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <p className="text-sm text-slate-600 mb-4">
                            Add one or more time slots. The candidate will be able to choose one of these times.
                        </p>

                        {slots.map((slot, index) => (
                            <div key={index} className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1 grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">Date</label>
                                            <input
                                                type="date"
                                                required
                                                value={slot.date}
                                                onChange={e => handleSlotChange(index, 'date', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">Start</label>
                                            <input
                                                type="time"
                                                required
                                                value={slot.startTime}
                                                onChange={e => handleSlotChange(index, 'startTime', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">End</label>
                                            <input
                                                type="time"
                                                required
                                                value={slot.endTime}
                                                onChange={e => handleSlotChange(index, 'endTime', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSlot(index)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-6"
                                        title="Remove slot"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Location Selection */}
                                <div className="flex gap-4 items-start border-t border-slate-200 pt-3 mt-1">
                                    <div className="w-40 shrink-0">
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Meeting Type</label>
                                        <div className="flex rounded-lg border border-slate-200 p-0.5 bg-white">
                                            <button
                                                type="button"
                                                onClick={() => handleSlotChange(index, 'type', 'online')}
                                                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-md transition-all ${slot.type === 'online'
                                                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                                                    : 'text-slate-500 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <Video size={14} />
                                                Online
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleSlotChange(index, 'type', 'onsite')}
                                                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-md transition-all ${slot.type === 'onsite'
                                                    ? 'bg-purple-50 text-purple-600 shadow-sm'
                                                    : 'text-slate-500 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <MapPin size={14} />
                                                Onsite
                                            </button>
                                        </div>
                                    </div>

                                    {slot.type === 'onsite' && (
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">
                                                Select Room
                                                {slot.isChecking && <span className="ml-2 font-normal text-xs text-slate-400 animate-pulse">(Checking...)</span>}
                                            </label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={slot.room ? JSON.stringify(slot.room) : ''}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        handleSlotChange(index, 'room', val ? JSON.parse(val) : null);
                                                    }}
                                                    className="flex-1 min-w-0 px-3 h-10 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white font-sans disabled:bg-slate-50"
                                                    disabled={slot.isChecking || (!slot.availableRooms && !rooms.length)}
                                                >
                                                    <option value="">
                                                        {slot.availableRooms
                                                            ? (slot.availableRooms.length > 0 ? '-- Choose Available Room --' : '-- No rooms available --')
                                                            : '-- Click Check Room --'}
                                                    </option>
                                                    {(slot.availableRooms || rooms).map(room => (
                                                        <option key={room.id} value={JSON.stringify(room)}>
                                                            {room.name} {room.capacity ? `(${room.capacity} pax)` : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => checkAvailability(index)}
                                                    disabled={!slot.date || !slot.startTime || !slot.endTime || slot.isChecking}
                                                    className="px-4 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap border border-slate-200"
                                                >
                                                    Check Room
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={handleAddSlot}
                            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            Add Another Slot
                        </button>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Send Invitation
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ScheduleInterviewModal;
