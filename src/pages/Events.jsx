import React from 'react';
import { useEvents } from '../context/EventContext';
import HeroSection from '../components/HeroSection';
import { Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Events = () => {
    const { events } = useEvents();

    // Sort events by date (newest first)
    const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <HeroSection
                title="Events & Happenings"
                subtitle="Stay updated with Sunningdale Tech's latest events and community activities."
                backgroundImage="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
            />

            <div className="container-custom py-16">
                <div className="max-w-6xl mx-auto">
                    {sortedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {sortedEvents.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all group"
                                >
                                    <div className="h-64 overflow-hidden relative bg-white flex items-center justify-center">
                                        <img
                                            src={event.image || 'https://via.placeholder.com/800x400?text=Event+Image'}
                                            alt={event.title}
                                            className="w-[90%] h-[90%] object-contain transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                                            <span className="font-bold text-slate-800 block text-center leading-tight">
                                                {new Date(event.date).getDate()}
                                            </span>
                                            <span className="text-xs font-medium text-primary uppercase tracking-wider block text-center">
                                                {new Date(event.date).toLocaleString('default', { month: 'short' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={16} className="text-primary" />
                                                {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin size={16} className="text-primary" />
                                                {event.location}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                                            {event.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            {event.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                            <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No Upcoming Events</h3>
                            <p className="text-slate-500">Check back later for updates on our latest activities.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Events;
