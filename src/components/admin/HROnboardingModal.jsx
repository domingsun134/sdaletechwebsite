import React, { useState, useEffect } from 'react';
import { X, Save, User, Building2, MapPin, Briefcase, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const HROnboardingModal = ({ isOpen, onClose, candidate, onSuccess }) => {
    const { users } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Dropdown data states
    const [regions, setRegions] = useState([]);
    const [locations, setLocations] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [jobTitles, setJobTitles] = useState([]);

    const [formData, setFormData] = useState({
        employee_code: '',
        region: '',
        location: '',
        company: '',
        department: '',
        job_title: '',
        manager: '',
        manager_email: '',
        initial_join_date: '',
        probation_period: ''
    });

    const [managerResults, setManagerResults] = useState([]);
    const [isSearchingManager, setIsSearchingManager] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);

    // Fetch dropdown data on mount
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [
                    { data: regionsData },
                    { data: locationsData },
                    { data: companiesData },
                    { data: departmentsData },
                    { data: jobTitlesData }
                ] = await Promise.all([
                    supabase.from('regions').select('item, item_full_name').order('item'),
                    supabase.from('locations').select('item, item_full_name').order('item'),
                    supabase.from('companies').select('item, item_full_name').order('item'),
                    supabase.from('departments').select('item, item_full_name').order('item'),
                    supabase.from('job_titles').select('item, item_full_name').order('item')
                ]);

                if (regionsData) setRegions(regionsData);
                if (locationsData) setLocations(locationsData);
                if (companiesData) setCompanies(companiesData);
                if (departmentsData) setDepartments(departmentsData);
                if (jobTitlesData) setJobTitles(jobTitlesData);

            } catch (err) {
                console.error('Error fetching dropdown data:', err);
            }
        };

        if (isOpen) {
            fetchDropdownData();
        }
    }, [isOpen]);

    const searchManagers = async (query) => {
        if (!query) return;
        setIsSearchingManager(true);
        try {
            const response = await fetch('/api/entra-users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ search: query })
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setManagerResults(data);
            } else {
                setManagerResults([]);
            }
        } catch (err) {
            console.error('Failed to search managers:', err);
        } finally {
            setIsSearchingManager(false);
        }
    };

    useEffect(() => {
        if (candidate) {
            setFormData(prev => ({
                ...prev,
                job_title: candidate.jobTitle || '',
                // Try to pre-fill other fields if available in candidate data, though likely not
            }));
        }
    }, [candidate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const payload = {
                application_id: candidate.id,
                ...formData,
                probation_period: parseInt(formData.probation_period) || 0
            };

            const { error: insertError } = await supabase
                .from('hr_onboarding_details')
                .insert([payload]);

            if (insertError) throw insertError;

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error submitting HR onboarding:', err);
            setError(err.message || 'Failed to submit onboarding details');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">HR Onboarding</h2>
                        <p className="text-slate-500 text-sm mt-1">Enter employment details for <span className="font-medium text-primary">{candidate?.name}</span></p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Employee Code */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <User size={16} className="text-slate-400" /> Employee Code
                            </label>
                            <input
                                type="text"
                                name="employee_code"
                                value={formData.employee_code}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="e.g. SGXXXXXXX"
                            />
                        </div>

                        {/* Job Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Briefcase size={16} className="text-slate-400" /> Job Title
                            </label>
                            <select
                                name="job_title"
                                value={formData.job_title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                            >
                                <option value="">Select Job Title</option>
                                {jobTitles.map((title) => (
                                    <option key={title.item} value={title.item}>{title.item}</option>
                                ))}
                            </select>
                        </div>

                        {/* Company */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Building2 size={16} className="text-slate-400" /> Company
                            </label>
                            <select
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                            >
                                <option value="">Select Company</option>
                                {companies.map((comp) => (
                                    <option key={comp.item} value={comp.item}>{comp.item}</option>
                                ))}
                            </select>
                        </div>

                        {/* Department */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Building2 size={16} className="text-slate-400" /> Department
                            </label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.item} value={dept.item}>{dept.item}</option>
                                ))}
                            </select>
                        </div>

                        {/* Region */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <MapPin size={16} className="text-slate-400" /> Region
                            </label>
                            <select
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                            >
                                <option value="">Select Region</option>
                                {regions.map((reg) => (
                                    <option key={reg.item} value={reg.item}>{reg.item}</option>
                                ))}
                            </select>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <MapPin size={16} className="text-slate-400" /> Location
                            </label>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                            >
                                <option value="">Select Location</option>
                                {locations.map((loc) => (
                                    <option key={loc.item} value={loc.item}>{loc.item}</option>
                                ))}
                            </select>
                        </div>

                        {/* Manager */}
                        <div className="space-y-2 relative">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <User size={16} className="text-slate-400" /> Manager
                            </label>
                            <input
                                type="text"
                                name="manager"
                                value={formData.manager}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setFormData(prev => ({ ...prev, manager: val }));
                                    // Debounce search
                                    if (searchTimeout) clearTimeout(searchTimeout);
                                    if (val.length >= 2) {
                                        setSearchTimeout(setTimeout(() => searchManagers(val), 500));
                                    } else {
                                        setManagerResults([]);
                                    }
                                }}
                                onFocus={() => formData.manager.length >= 2 && searchManagers(formData.manager)}
                                required
                                autoComplete="off"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="Search Manager (Entra ID)"
                            />
                            {isSearchingManager && (
                                <div className="absolute right-3 top-9">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                </div>
                            )}
                            {managerResults.length > 0 && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                    {managerResults.map(user => (
                                        <button
                                            key={user.id}
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    manager: user.displayName,
                                                    manager_email: user.mail || user.userPrincipalName || ''
                                                }));
                                                setManagerResults([]);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex flex-col"
                                        >
                                            <span className="font-medium text-slate-800">{user.displayName}</span>
                                            <span className="text-xs text-slate-500">{user.mail || user.jobTitle}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Initial Join Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Calendar size={16} className="text-slate-400" /> Initial Join Date
                            </label>
                            <input
                                type="date"
                                name="initial_join_date"
                                value={formData.initial_join_date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>

                        {/* Probation Period */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Clock size={16} className="text-slate-400" /> Probation Period (Months)
                            </label>
                            <input
                                type="number"
                                name="probation_period"
                                value={formData.probation_period}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="e.g. 3"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                'Saving...'
                            ) : (
                                <>
                                    <Save size={18} /> Save Details
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HROnboardingModal;
