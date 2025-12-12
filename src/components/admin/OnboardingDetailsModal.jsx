import React, { useState, useEffect } from 'react';
import { X, User, Users, MapPin, Phone, AlertCircle, CheckCircle, ShieldCheck, AlertTriangle, Edit2, Save, Building2, Briefcase, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const OnboardingDetailsModal = ({ isOpen, onClose, data, isLoading, onUpdate, candidate }) => {
    const { user } = useAuth();
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState(null);

    // HR Onboarding State
    const [isSubmittingHR, setIsSubmittingHR] = useState(false);
    const [hrError, setHrError] = useState(null);
    const [regions, setRegions] = useState([]);
    const [locations, setLocations] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [jobTitles, setJobTitles] = useState([]);
    const [hrFormData, setHrFormData] = useState({
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

    useEffect(() => {
        if (data) {
            setFormData(JSON.parse(JSON.stringify(data)));
        }
    }, [data]);

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
                    supabase.from('job_titles').select('item').order('item')
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

    useEffect(() => {
        const fetchHRDetails = async () => {
            if (data?.application_id) {
                try {
                    const { data: hrData, error } = await supabase
                        .from('hr_onboarding_details')
                        .select('*')
                        .eq('application_id', data.application_id)
                        .maybeSingle();

                    if (hrData) {
                        setHrFormData({
                            employee_code: hrData.employee_code || '',
                            region: hrData.region || '',
                            location: hrData.location || '',
                            company: hrData.company || '',
                            department: hrData.department || '',
                            job_title: hrData.job_title || candidate?.jobTitle || '',
                            manager: hrData.manager || '',
                            manager_email: hrData.manager_email || '',
                            initial_join_date: hrData.initial_join_date || '',
                            probation_period: hrData.probation_period || ''
                        });
                    } else if (candidate) {
                        // Pre-fill from candidate if no existing HR record
                        setHrFormData(prev => ({
                            ...prev,
                            job_title: candidate.jobTitle || '',
                        }));
                    }
                } catch (err) {
                    console.error('Error fetching HR details:', err);
                }
            }
        };

        if (isOpen && data) {
            fetchHRDetails();
        }
    }, [isOpen, data, candidate]);

    const searchManagers = async (query) => {
        if (!query) return;
        setIsSearchingManager(true);
        try {
            const response = await fetch('http://localhost:3000/api/entra-users', {
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

    const handleHRChange = (e) => {
        const { name, value } = e.target;
        setHrFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleHRSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingHR(true);
        setHrError(null);

        try {
            const payload = {
                application_id: data.application_id, // Use application_id from submission data
                ...hrFormData,
                probation_period: parseInt(hrFormData.probation_period) || 0
            };

            const { error: insertError } = await supabase
                .from('hr_onboarding_details')
                .insert([payload]);

            if (insertError) throw insertError;

            // Trigger AD Provisioning
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/integrations/ad/provision`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ applicationId: data.application_id })
                });

                if (!response.ok) {
                    console.warn('AD Provisioning trigger failed, but HR details saved.');
                }
            } catch (adError) {
                console.error('Error triggering AD provisioning:', adError);
            }

            setToast({ type: 'success', message: 'HR details saved & AD Provisioning started' });
            // Optional: Close modal or just show success
            setTimeout(() => setToast(null), 3000);
        } catch (err) {
            console.error('Error submitting HR onboarding:', err);
            setHrError(err.message || 'Failed to submit onboarding details');
        } finally {
            setIsSubmittingHR(false);
        }
    };

    if (!isOpen) return null;

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-600 font-medium">Loading details...</p>
                </div>
            </div>
        );
    }

    if (!data || !formData) return null;

    const { verified_by, verified_at } = data;
    const { personal_details, family_details, contact_details, emergency_contacts } = formData;

    const NATIONALITY_OPTIONS = [
        'Chinese / 中国', 'Filipino / 菲律宾', 'Indian / 印度', 'Malaysian / 马来西亚',
        'Singaporean / 新加坡', 'SPR Malaysian / 新加坡永久居民马来西亚',
        'SPR Chinese / 新加坡永久居民中国', 'Myanmar / 缅甸'
    ];

    const RACE_OPTIONS = [
        'Chinese / 华', 'Indian / 印度', 'Malay / 马来', 'Filipino / 菲律宾', 'Myanmar / 缅甸'
    ];

    const RELIGION_OPTIONS = [
        'Buddhism / 佛教', 'Catholic / 天主教', 'Christianity / 基督教', 'Hinduism / 印度教',
        'Islam / 伊斯兰教', 'Roman Catholic / 罗马天主教', 'Sikh / 锡克教', 'Taoism / 道教',
        'NIL / -', 'Others / 其他'
    ];

    const MARITAL_STATUS_OPTIONS = [
        'Single / 单身', 'Married / 已婚', 'Widowed / 寡', 'Divorced / 离婚', 'Separated / 分开'
    ];

    const ADDRESS_TYPE_OPTIONS = ['Local', 'Overseas', 'Mailing'];
    const GENDER_OPTIONS = ['Male', 'Female'];

    const handleEdit = () => {
        setFormData(JSON.parse(JSON.stringify(data))); // Reset to current data
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData(JSON.parse(JSON.stringify(data))); // Reset to original data
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('onboarding_submissions')
                .update({
                    personal_details: formData.personal_details,
                    family_details: formData.family_details,
                    contact_details: formData.contact_details,
                    emergency_contacts: formData.emergency_contacts
                })
                .eq('id', data.id);

            if (error) throw error;

            if (onUpdate) onUpdate();

            setToast({ type: 'success', message: 'Changes saved successfully' });
            setIsEditing(false);

            setTimeout(() => setToast(null), 3000);

        } catch (err) {
            console.error('Error saving data:', err);
            setToast({ type: 'error', message: 'Failed to save changes' });
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const updateArrayField = (section, index, field, value) => {
        setFormData(prev => {
            const newArray = [...prev[section]];
            newArray[index] = { ...newArray[index], [field]: value };
            return {
                ...prev,
                [section]: newArray
            };
        });
    };

    const updateFamilyChildren = (index, field, value) => {
        setFormData(prev => {
            const newChildren = [...prev.family_details.children];
            newChildren[index] = { ...newChildren[index], [field]: value };
            return {
                ...prev,
                family_details: {
                    ...prev.family_details,
                    children: newChildren
                }
            };
        });
    };

    const handleVerifyClick = () => {
        setShowConfirmDialog(true);
    };

    const confirmVerify = async () => {
        setShowConfirmDialog(false);
        setIsVerifying(true);
        try {
            const { error } = await supabase
                .from('onboarding_submissions')
                .update({
                    verified_by: user?.name || user?.username || 'HR Admin',
                    verified_at: new Date().toISOString()
                })
                .eq('id', data.id);

            if (error) throw error;

            if (onUpdate) onUpdate();

            setToast({ type: 'success', message: 'Onboarding data verified successfully' });

            // Close after a short delay to show success message
            setTimeout(() => {
                onClose();
                setToast(null);
            }, 1500);

        } catch (err) {
            console.error('Error verifying data:', err);
            setToast({ type: 'error', message: 'Failed to verify data. Please try again.' });
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] relative">

                {/* Toast Notification */}
                {toast && (
                    <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300 ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                        {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span className="font-medium">{toast.message}</span>
                    </div>
                )}

                {/* Confirmation Dialog Overlay */}
                {showConfirmDialog && (
                    <div className="absolute inset-0 z-40 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4 rounded-2xl animate-in fade-in duration-200">
                        <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Verify Onboarding Data?</h3>
                                    <p className="text-slate-500 mt-1 text-sm">
                                        This action will record you as the verifier for this candidate's onboarding information. This cannot be undone.
                                    </p>
                                </div>
                                <div className="flex gap-3 w-full pt-2">
                                    <button
                                        onClick={() => setShowConfirmDialog(false)}
                                        className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmVerify}
                                        className="flex-1 px-4 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                                    >
                                        Confirm Verify
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Onboarding Details</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-slate-500 text-sm">Submitted Information</p>
                            {verified_at && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium border border-green-200">
                                    <ShieldCheck size={12} /> Verified by {verified_by} on {new Date(verified_at).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isEditing && !verified_at && (
                            <button
                                onClick={handleEdit}
                                className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors flex items-center gap-2"
                                title="Edit Details"
                            >
                                <Edit2 size={20} />
                                <span className="text-sm font-medium">Edit</span>
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-700"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto space-y-8">
                    {/* HR Onboarding Form - Only visible when verified */}
                    {verified_at && (
                        <section className="mb-8 border-b border-slate-200 pb-8">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                                <Briefcase className="text-primary" size={20} />
                                HR Onboarding
                            </h3>

                            <form onSubmit={handleHRSubmit} className="space-y-6">
                                {hrError && (
                                    <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
                                        {hrError}
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
                                            value={hrFormData.employee_code}
                                            onChange={handleHRChange}
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
                                            value={hrFormData.job_title}
                                            onChange={handleHRChange}
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
                                            value={hrFormData.company}
                                            onChange={handleHRChange}
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
                                            value={hrFormData.department}
                                            onChange={handleHRChange}
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
                                            value={hrFormData.region}
                                            onChange={handleHRChange}
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
                                            value={hrFormData.location}
                                            onChange={handleHRChange}
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
                                            value={hrFormData.manager}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setHrFormData(prev => ({ ...prev, manager: val }));
                                                // Debounce search
                                                if (searchTimeout) clearTimeout(searchTimeout);
                                                if (val.length >= 2) {
                                                    setSearchTimeout(setTimeout(() => searchManagers(val), 500));
                                                } else {
                                                    setManagerResults([]);
                                                }
                                            }}
                                            onFocus={() => hrFormData.manager.length >= 2 && searchManagers(hrFormData.manager)}
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
                                                            setHrFormData(prev => ({
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
                                            value={hrFormData.initial_join_date}
                                            onChange={handleHRChange}
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
                                            value={hrFormData.probation_period}
                                            onChange={handleHRChange}
                                            required
                                            min="0"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="e.g. 3"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmittingHR}
                                        className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmittingHR ? (
                                            'Saving...'
                                        ) : (
                                            <>
                                                <Save size={18} /> Save HR Details
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}

                    {/* Personal Details */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                            <User className="text-primary" size={20} />
                            Personal Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DetailItem label="Full Name" value={`${personal_details?.lastName} ${personal_details?.firstName} ${personal_details?.middleName || ''}`}
                                isEditing={isEditing} onChange={(val) => { }}
                                customInput={isEditing && (
                                    <div className="grid grid-cols-3 gap-2">
                                        <input placeholder="Last Name" value={personal_details?.lastName || ''} onChange={e => updateField('personal_details', 'lastName', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                                        <input placeholder="First Name" value={personal_details?.firstName || ''} onChange={e => updateField('personal_details', 'firstName', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                                        <input placeholder="Middle Name" value={personal_details?.middleName || ''} onChange={e => updateField('personal_details', 'middleName', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                                    </div>
                                )}
                            />
                            <DetailItem label="Employee Name / 姓名" value={personal_details?.chineseName} isEditing={isEditing} onChange={v => updateField('personal_details', 'chineseName', v)} />
                            <DetailItem label="Gender" value={personal_details?.gender} isEditing={isEditing} onChange={v => updateField('personal_details', 'gender', v)} options={GENDER_OPTIONS} />
                            <DetailItem label="Nationality" value={personal_details?.nationality} isEditing={isEditing} onChange={v => updateField('personal_details', 'nationality', v)} options={NATIONALITY_OPTIONS} />
                            <DetailItem label="Identity No." value={personal_details?.identityNo} isEditing={isEditing} onChange={v => updateField('personal_details', 'identityNo', v)} />
                            <DetailItem label="Date of Birth" value={personal_details?.dob} isEditing={isEditing} onChange={v => updateField('personal_details', 'dob', v)} type="date" />
                            <DetailItem label="Birth Place" value={personal_details?.birthPlace} isEditing={isEditing} onChange={v => updateField('personal_details', 'birthPlace', v)} />
                            <DetailItem label="Race" value={personal_details?.race} isEditing={isEditing} onChange={v => updateField('personal_details', 'race', v)} options={RACE_OPTIONS} />
                            <DetailItem label="Religion" value={personal_details?.religion} isEditing={isEditing} onChange={v => updateField('personal_details', 'religion', v)} options={RELIGION_OPTIONS} />
                            <DetailItem label="Marital Status" value={personal_details?.maritalStatus} isEditing={isEditing} onChange={v => updateField('personal_details', 'maritalStatus', v)} options={MARITAL_STATUS_OPTIONS} />
                            {(personal_details?.maritalStatus?.includes('Married') || isEditing) && (
                                <DetailItem label="Marriage Date" value={personal_details?.marriageDate} isEditing={isEditing} onChange={v => updateField('personal_details', 'marriageDate', v)} type="date" />
                            )}
                        </div>
                    </section>

                    {/* Family Details */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                            <Users className="text-primary" size={20} />
                            Family Details
                        </h3>
                        {(personal_details?.maritalStatus?.includes('Married') || isEditing) && (
                            <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h4 className="font-semibold text-slate-700 mb-3">Spouse</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DetailItem label="Name" value={family_details?.spouse_name} isEditing={isEditing} onChange={v => updateField('family_details', 'spouse_name', v)} />
                                    <DetailItem label="Nationality" value={family_details?.spouse_nationality} isEditing={isEditing} onChange={v => updateField('family_details', 'spouse_nationality', v)} options={NATIONALITY_OPTIONS} />
                                </div>
                            </div>
                        )}

                        {(family_details?.children?.length > 0 || isEditing) && (
                            <div className="space-y-3">
                                <h4 className="font-semibold text-slate-700">Children</h4>
                                <div className="grid gap-4">
                                    {family_details?.children?.map((child, index) => (
                                        <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                                            <DetailItem label="Name" value={child.name} isEditing={isEditing} onChange={v => updateFamilyChildren(index, 'name', v)} />
                                            <DetailItem label="Nationality" value={child.nationality} isEditing={isEditing} onChange={v => updateFamilyChildren(index, 'nationality', v)} options={NATIONALITY_OPTIONS} />
                                            <DetailItem label="DOB" value={child.dob} isEditing={isEditing} onChange={v => updateFamilyChildren(index, 'dob', v)} type="date" />
                                            <DetailItem label="Gender" value={child.gender} isEditing={isEditing} onChange={v => updateFamilyChildren(index, 'gender', v)} options={GENDER_OPTIONS} />
                                        </div>
                                    ))}
                                    {isEditing && family_details?.children?.length === 0 && (
                                        <p className="text-slate-500 italic">No children listed. (Add button not implemented)</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Contact Details */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                            <MapPin className="text-primary" size={20} />
                            Contact Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <DetailItem label="Address Type" value={contact_details?.addressType} isEditing={isEditing} onChange={v => updateField('contact_details', 'addressType', v)} options={ADDRESS_TYPE_OPTIONS} />
                            <DetailItem label="Block No" value={contact_details?.blockNo} isEditing={isEditing} onChange={v => updateField('contact_details', 'blockNo', v)} />
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                            {isEditing ? (
                                <div className="grid gap-4">
                                    <input placeholder="Address 1" value={contact_details?.address1 || ''} onChange={e => updateField('contact_details', 'address1', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                                    <input placeholder="Address 2" value={contact_details?.address2 || ''} onChange={e => updateField('contact_details', 'address2', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                                    <input placeholder="Address 3" value={contact_details?.address3 || ''} onChange={e => updateField('contact_details', 'address3', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input placeholder="City" value={contact_details?.city || ''} onChange={e => updateField('contact_details', 'city', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                                        <input placeholder="Postal Code" value={contact_details?.postalCode || ''} onChange={e => updateField('contact_details', 'postalCode', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input placeholder="State" value={contact_details?.state || ''} onChange={e => updateField('contact_details', 'state', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                                        <input placeholder="Country" value={contact_details?.country || ''} onChange={e => updateField('contact_details', 'country', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-800">
                                    {contact_details?.address1}<br />
                                    {contact_details?.address2 && <>{contact_details.address2}<br /></>}
                                    {contact_details?.address3 && <>{contact_details.address3}<br /></>}
                                    {contact_details?.city} {contact_details?.postalCode}<br />
                                    {contact_details?.state ? `${contact_details.state}, ` : ''}{contact_details?.country}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailItem label="Mobile Phone" value={contact_details?.mobilePhone} isEditing={isEditing} onChange={v => updateField('contact_details', 'mobilePhone', v)} />
                            <DetailItem label="Home Phone" value={contact_details?.homePhone} isEditing={isEditing} onChange={v => updateField('contact_details', 'homePhone', v)} />
                        </div>
                    </section>

                    {/* Emergency Contacts */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                            <AlertCircle className="text-primary" size={20} />
                            Emergency Contacts
                        </h3>
                        <div className="grid gap-4">
                            {emergency_contacts?.map((contact, index) => (
                                <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <DetailItem label="Name" value={contact.name} isEditing={isEditing} onChange={v => updateArrayField('emergency_contacts', index, 'name', v)} />
                                    <DetailItem label="Relation" value={contact.relation} isEditing={isEditing} onChange={v => updateArrayField('emergency_contacts', index, 'relation', v)} />
                                    <DetailItem label="Contact No" value={contact.contactNo} isEditing={isEditing} onChange={v => updateArrayField('emergency_contacts', index, 'contactNo', v)} />
                                </div>
                            ))}
                        </div>
                    </section>




                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-between items-center">
                    <div className="text-sm text-slate-500">
                        {verified_at ? (
                            <span className="flex items-center gap-2 text-green-600 font-medium">
                                <CheckCircle size={16} /> Data Verified
                            </span>
                        ) : (
                            <span>Please review all details carefully before verifying.</span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-2"
                                >
                                    {isSaving ? 'Saving...' : (
                                        <>
                                            <Save size={18} /> Save Changes
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Close
                                </button>
                                {!verified_at && (
                                    <button
                                        onClick={handleVerifyClick}
                                        disabled={isVerifying}
                                        className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isVerifying ? 'Verifying...' : (
                                            <>
                                                <ShieldCheck size={18} /> Verify Data
                                            </>
                                        )}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div >
        </div >
    );
};

const DetailItem = ({ label, value, isEditing, onChange, type = 'text', customInput, options }) => {
    if (isEditing) {
        if (customInput) {
            return (
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                    {customInput}
                </div>
            );
        }

        if (options) {
            return (
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                    <select
                        value={value || ''}
                        onChange={e => onChange && onChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white"
                    >
                        <option value="">Select...</option>
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            );
        }

        return (
            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                <input
                    type={type}
                    value={value || ''}
                    onChange={e => onChange && onChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
            </div>
        );
    }
    return (
        <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</span>
            <span className="block text-slate-800 font-medium">{value || '-'}</span>
        </div>
    );
};

export default OnboardingDetailsModal;
