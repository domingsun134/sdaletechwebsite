import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScheduleInterviewModal = ({ isOpen, onClose, candidateName, onSendInvites, isLoading }) => {
    const [slots, setSlots] = useState([{ date: '', startTime: '', endTime: '' }]);

    if (!isOpen) return null;

    const handleAddSlot = () => {
        setSlots([...slots, { date: '', startTime: '', endTime: '' }]);
    };

    const handleRemoveSlot = (index) => {
        const newSlots = slots.filter((_, i) => i !== index);
        setSlots(newSlots.length ? newSlots : [{ date: '', startTime: '', endTime: '' }]);
    };

    const handleSlotChange = (index, field, value) => {
        const newSlots = [...slots];
        newSlots[index][field] = value;
        setSlots(newSlots);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Filter out incomplete slots
        const validSlots = slots.filter(s => s.date && s.startTime && s.endTime);
        if (validSlots.length === 0) return;

        // Convert to ISO strings
        const formattedSlots = validSlots.map(s => ({
            startTime: new Date(`${s.date}T${s.startTime}`).toISOString(),
            endTime: new Date(`${s.date}T${s.endTime}`).toISOString()
        }));

        onSendInvites(formattedSlots);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
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
                            <div key={index} className="flex items-end gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div className="flex-1 space-y-3">
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
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">Start</label>
                                            <input
                                                type="time"
                                                required
                                                value={slot.startTime}
                                                onChange={e => handleSlotChange(index, 'startTime', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            />
                                        </div>
                                        <div className="flex-1">
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
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSlot(index)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mb-0.5"
                                    title="Remove slot"
                                >
                                    <Trash2 size={18} />
                                </button>
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
