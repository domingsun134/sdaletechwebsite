import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useEvents } from '../../context/EventContext';
import { Plus, Edit, Trash2, Save, X, Search, Calendar, MapPin, Image as ImageIcon } from 'lucide-react';

const EventManager = () => {
    const { events, addEvent, updateEvent, deleteEvent } = useEvents();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        endDate: '',
        location: '',
        description: '',
        image: ''
    });

    const handleEdit = (event) => {
        setCurrentEvent(event);
        setFormData({
            ...event,
            endDate: event.endDate || ''
        });
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setCurrentEvent(null);
        setFormData({
            title: '',
            date: '',
            endDate: '',
            location: '',
            description: '',
            image: ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            deleteEvent(id);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentEvent) {
            updateEvent(currentEvent.id, formData);
        } else {
            addEvent(formData);
        }
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Event Manager</h1>
                    <p className="text-slate-500 mt-1">Manage company events and happenings</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-primary text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-primary-dark transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                    <Plus size={20} />
                    <span className="font-medium">Add New Event</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search events by title or location..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Event Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                    <div key={event.id} className="group bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
                        <div className="h-48 overflow-hidden relative bg-white flex items-center justify-center">
                            {event.image ? (
                                <img src={event.image} alt={event.title} className="w-[90%] h-[90%] object-contain" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ImageIcon size={48} />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="p-2 bg-white/90 text-slate-600 hover:text-primary rounded-lg shadow-sm transition-colors"
                                    title="Edit Event"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="p-2 bg-white/90 text-slate-600 hover:text-red-600 rounded-lg shadow-sm transition-colors"
                                    title="Delete Event"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 flex-grow">
                            <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
                                <Calendar size={16} />
                                <span>
                                    {new Date(event.date).toLocaleDateString()}
                                    {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">
                                {event.title}
                            </h3>

                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                <MapPin size={16} />
                                <span className="line-clamp-1">{event.location}</span>
                            </div>

                            <p className="text-slate-600 text-sm line-clamp-3">
                                {event.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No events found</h3>
                    <p className="text-slate-500">Try adjusting your search or add a new event.</p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-slate-800">
                                {currentEvent ? 'Edit Event' : 'New Event'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Event Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Start Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">End Date (Optional)</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Image URL</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    {currentEvent ? 'Save Changes' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default EventManager;
