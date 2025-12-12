import React, { useState, useEffect } from 'react';
import {
    UserMinus, Plus, X, Search, User, Building2, MapPin, Mail, Briefcase, Calendar,
    FileText, Edit2, Ban, Filter, BarChart3, Clock, CheckCircle2, AlertCircle, Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const RESIGNATION_CODES = [
    { code: 'AWOL', label: 'AWOL - Absent Without Official Leave' },
    { code: 'DC', label: 'DC - Deceased' },
    { code: 'DM', label: 'DM - Dismissed' },
    { code: 'EC', label: 'EC - End of Contract' },
    { code: 'ECR', label: 'ECR - End of Contract with Remarks' },
    { code: 'ECT', label: 'ECT - Earlier Contract Termination' },
    { code: 'EOI', label: 'EOI - End of Attachment - Internship' },
    { code: 'MD', label: 'MD - Medically Board Out' },
    { code: 'PSN', label: 'PSN - Personal' },
    { code: 'PSNP', label: 'PSNP - Personal (P)' },
    { code: 'RE', label: 'RE - Retired' },
    { code: 'RS', label: 'RS - Resigned' },
    { code: 'RT', label: 'RT - Retrenched' },
    { code: 'SC', label: 'SC - On Service Contract' },
    { code: 'TN', label: 'TN - Terminated' },
    { code: 'WPE', label: 'WPE - Work Permit Expires' }
];

const OffboardingManager = () => {
    const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
    const [employeeId, setEmployeeId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [foundUser, setFoundUser] = useState(null);
    const [error, setError] = useState(null);

    // New Fields State
    const [isManualEntry, setIsManualEntry] = useState(false);
    const [resignationDate, setResignationDate] = useState('');
    const [resignationCode, setResignationCode] = useState('');

    // Withdraw Modal State
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [requestToWithdraw, setRequestToWithdraw] = useState(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState(null);

    // Editing State
    const [editingRequest, setEditingRequest] = useState(null);
    const [editName, setEditName] = useState('');

    // List state & Filters
    const [requests, setRequests] = useState([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchRequests();

        // Auto-refresh every 10 seconds to catch Power Automate updates
        const interval = setInterval(() => {
            fetchRequests(true); // Silent refresh
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const fetchRequests = async (isBackground = false) => {
        if (!isBackground) setIsLoadingRequests(true);
        try {
            const { data, error } = await supabase
                .from('offboarding_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (err) {
            console.error('Error fetching offboarding requests:', err);
        } finally {
            if (!isBackground) setIsLoadingRequests(false);
        }
    };

    // Filter Logic
    const filteredRequests = requests.filter(req => {
        const matchesSearch =
            req.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'All' || req.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Stats Logic
    const stats = {
        total: requests.length,
        initiated: requests.filter(r => r.status === 'Initiated').length,
        withdrawn: requests.filter(r => r.status === 'Withdrawn').length,
        completed: requests.filter(r => r.status === 'Completed').length
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setFoundUser(null);
        setIsManualEntry(false);

        try {
            const response = await fetch('/api/entra-user-by-id', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId })
            });

            if (response.status === 404) {
                // User not found in Entra - Switch to Manual Entry
                setIsManualEntry(true);
            } else if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Search failed');
            } else {
                const data = await response.json();
                setFoundUser(data);
            }
        } catch (err) {
            console.error('Search error:', err);
            setError(err.message || 'Failed to search');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditRequest = (req) => {
        setEditingRequest(req);
        setEmployeeId(req.employee_id);
        setEditName(req.employee_name);
        setResignationDate(req.resignation_date || '');
        setResignationCode(req.resignation_code || '');
        setIsNewRequestModalOpen(true);
    };

    const handleWithdrawRequest = (req) => {
        setRequestToWithdraw(req);
        setIsWithdrawModalOpen(true);
    };

    const handleDeleteRequest = (req) => {
        setRequestToDelete(req);
        setIsDeleteModalOpen(true);
    };

    const confirmWithdraw = async () => {
        if (!requestToWithdraw) return;

        setIsLoadingRequests(true);
        try {
            const { error } = await supabase
                .from('offboarding_requests')
                .update({ status: 'Withdrawn' })
                .eq('id', requestToWithdraw.id);

            if (error) throw error;
            await fetchRequests();
            setIsWithdrawModalOpen(false);
            setRequestToWithdraw(null);
        } catch (err) {
            console.error('Error withdrawing request:', err);
            alert('Failed to withdraw request');
        } finally {
            setIsLoadingRequests(false);
        }
    };

    const confirmDelete = async () => {
        if (!requestToDelete) return;

        setIsLoadingRequests(true);
        try {
            const { error } = await supabase
                .from('offboarding_requests')
                .delete()
                .eq('id', requestToDelete.id);

            if (error) throw error;
            await fetchRequests();
            setIsDeleteModalOpen(false);
            setRequestToDelete(null);
        } catch (err) {
            console.error('Error deleting request:', err);
            alert('Failed to delete request');
        } finally {
            setIsLoadingRequests(false);
        }
    };

    const handleConfirmRequest = async () => {
        if (!editingRequest && !foundUser && !isManualEntry) return;
        setIsLoading(true);

        try {
            if (editingRequest) {
                // Update existing request
                const { error } = await supabase
                    .from('offboarding_requests')
                    .update({
                        employee_name: editName,
                        resignation_date: resignationDate,
                        resignation_code: resignationCode
                    })
                    .eq('id', editingRequest.id);

                if (error) throw error;

            } else {
                // Create new request
                const newRequest = {
                    employee_id: foundUser?.employeeId || employeeId,
                    employee_name: foundUser?.displayName || 'N/A',
                    employee_email: foundUser?.mail || 'N/A',
                    job_title: foundUser?.jobTitle || 'N/A',
                    department: foundUser?.department || 'N/A',
                    location: foundUser?.officeLocation || 'N/A',
                    manager_name: foundUser?.managerName || 'N/A',
                    manager_email: foundUser?.managerEmail || 'N/A',
                    status: 'Initiated',
                    resignation_date: resignationDate || null,
                    resignation_code: resignationCode || null
                };

                const { error } = await supabase
                    .from('offboarding_requests')
                    .insert([newRequest]);


                if (error) throw error;
            }

            // Trigger Power Automate Workflow
            try {
                // Adjust payload source based on context (new vs edit)
                const payloadBase = editingRequest ? {
                    employee_id: editingRequest.employee_id,
                    employee_name: editName,
                    resignation_date: resignationDate,
                    resignation_code: resignationCode
                } : {
                    employee_id: foundUser?.employeeId || employeeId,
                    employee_name: foundUser?.displayName || 'N/A',
                    resignation_date: resignationDate,
                    resignation_code: resignationCode
                };

                // Add email if available
                const email = editingRequest ? editingRequest.employee_email : (foundUser?.mail || 'N/A');
                const finalPayload = { ...payloadBase };

                if (email && email !== 'N/A') {
                    finalPayload.email = email;
                }

                await fetch('/api/trigger-offboarding-workflow', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(finalPayload)
                });
            } catch (wfError) {
                console.error('Failed to trigger workflow:', wfError);
                // Don't block the UI flow if workflow fails, just log it
            }

            // Success: refresh list and close modal
            await fetchRequests();
            handleCloseModal();

        } catch (err) {
            console.error('Error saving request:', err);
            setError(err.message || 'Failed to save offboarding request');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsNewRequestModalOpen(false);
        setEmployeeId('');
        setFoundUser(null);
        setIsManualEntry(false);
        setEditingRequest(null);
        setEditName('');
        setResignationDate('');
        setResignationCode('');
        setError(null);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Withdrawn':
                return 'bg-slate-100 text-slate-500 border-slate-200';
            case 'Completed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Initiated':
            default:
                return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <div className="space-y-4">
            {/* Unified Header & Stats */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Offboarding</h2>
                </div>

                {/* Compact Stats */}
                <div className="flex flex-wrap items-center justify-center gap-6 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <BarChart3 size={16} className="text-blue-500" />
                        <span>Total: <span className="font-bold text-slate-900">{stats.total}</span></span>
                    </div>
                    <div className="w-px h-4 bg-slate-200 hidden md:block"></div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock size={16} className="text-amber-500" />
                        <span>Pending: <span className="font-bold text-slate-900">{stats.initiated}</span></span>
                    </div>
                    <div className="w-px h-4 bg-slate-200 hidden md:block"></div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Ban size={16} className="text-red-500" />
                        <span>Withdrawn: <span className="font-bold text-slate-900">{stats.withdrawn}</span></span>
                    </div>
                    <div className="w-px h-4 bg-slate-200 hidden md:block"></div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span>Completed: <span className="font-bold text-slate-900">{stats.completed}</span></span>
                    </div>
                </div>

                <button
                    onClick={() => setIsNewRequestModalOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-all shadow-sm hover:shadow-md active:scale-95 text-sm"
                >
                    <Plus size={18} />
                    <span className="font-medium">New Request</span>
                </button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Employee Name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-slate-700"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                    <div className="flex p-1 bg-slate-50 rounded-lg border border-slate-100">
                        {['All', 'Initiated', 'Withdrawn'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filterStatus === status
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Requests List */}
            {isLoadingRequests ? (
                <div className="text-center py-20">
                    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading requests...</p>
                </div>
            ) : filteredRequests.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-400 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Employee</th>
                                    <th className="px-6 py-4">Role & Department</th>
                                    <th className="px-6 py-4">Resignation Details</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredRequests.map(req => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                                    {getInitials(req.employee_name)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{req.employee_name}</div>
                                                    <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                                                        <span className="bg-slate-100 px-1.5 rounded">{req.employee_id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-700 text-sm font-medium">{req.job_title}</div>
                                            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                <Building2 size={10} />
                                                {req.department}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                                                    <Calendar size={14} />
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {req.resignation_date ? new Date(req.resignation_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-0.5">
                                                        Code: <span className="font-mono text-slate-600">{req.resignation_code || '-'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(req.status)}`}>
                                                {req.status}
                                            </span>
                                            <div className="text-[10px] text-slate-400 mt-1 pl-1">
                                                Req: {new Date(req.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => handleEditRequest(req)}
                                                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                                    title="Edit Request"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                {req.status !== 'Withdrawn' && (
                                                    <button
                                                        onClick={() => handleWithdrawRequest(req)}
                                                        className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                                                        title="Withdraw Resignation"
                                                    >
                                                        <Ban size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteRequest(req)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Request"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No requests found</h3>
                    <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setFilterStatus('All'); }}
                        className="mt-4 text-primary hover:text-primary-dark font-medium text-sm"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Withdraw Confirmation Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                                <Ban size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Withdraw Resignation?</h3>
                            <p className="text-slate-600 mb-6">
                                Are you sure you want to withdraw the resignation request for Employee ID: <span className="font-semibold">{requestToWithdraw?.employee_id}</span>? This status will be updated to "Withdrawn".
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setIsWithdrawModalOpen(false);
                                        setRequestToWithdraw(null);
                                    }}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmWithdraw}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                                >
                                    Confirm Withdraw
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Request?</h3>
                            <p className="text-slate-600 mb-6">
                                Are you sure you want to permanently delete the offboarding request for <span className="font-semibold">{requestToDelete?.employee_name}</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setRequestToDelete(null);
                                    }}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                                >
                                    Delete Permanently
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New/Edit Request Modal */}
            {isNewRequestModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingRequest ? 'Edit Offboarding Request' : 'New Offboarding Request'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {!editingRequest && !foundUser && !isManualEntry ? (
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Enter Employee ID</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={employeeId}
                                                onChange={(e) => setEmployeeId(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                placeholder="e.g. 12345"
                                                autoFocus
                                                required
                                            />
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading || !employeeId.trim()}
                                        className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Searching...</span>
                                            </>
                                        ) : (
                                            'Find Employee'
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    {foundUser || editingRequest ? (
                                        <div className="bg-slate-50 rounded-xl p-4 max-h-[300px] overflow-y-auto">
                                            {/* Found User / Edit Details */}
                                            {editingRequest ? (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-500 uppercase">Employee ID</label>
                                                        <div className="font-mono text-slate-900">{employeeId}</div>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Employee Name</label>
                                                        <input
                                                            type="text"
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                                                            placeholder="Enter name"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <table className="w-full text-left border-collapse">
                                                    <tbody>
                                                        {Object.entries(foundUser).map(([key, value]) => (
                                                            <tr key={key} className="border-b border-slate-200 last:border-0">
                                                                <td className="py-2 pr-4 font-semibold text-slate-500 text-sm capitalize w-1/3">
                                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                                </td>
                                                                <td className="py-2 text-slate-800 text-sm font-mono break-all">
                                                                    {value !== null && value !== undefined && typeof value === 'object'
                                                                        ? JSON.stringify(value)
                                                                        : String(value)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                                    <UserMinus size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-amber-900">User Not Found in Entra</h3>
                                                    <p className="text-amber-700 text-sm mt-1">
                                                        Employee ID <strong>{employeeId}</strong> was not found. Details will be set to 'N/A'.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Resignation Fields - Common for all flows */}
                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        <h3 className="font-medium text-slate-900 flex items-center gap-2">
                                            <FileText size={18} className="text-slate-400" />
                                            Resignation Details
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Resignation Date *</label>
                                                <input
                                                    type="date"
                                                    value={resignationDate}
                                                    onChange={(e) => setResignationDate(e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Resignation Code *</label>
                                                <select
                                                    value={resignationCode}
                                                    onChange={(e) => setResignationCode(e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                                                    required
                                                >
                                                    <option value="">Select a reason...</option>
                                                    {RESIGNATION_CODES.map(code => (
                                                        <option key={code.code} value={code.code}>
                                                            {code.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={handleCloseModal}
                                            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmRequest}
                                            disabled={isLoading || !resignationDate || !resignationCode}
                                            className="flex-1 px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                        >
                                            {isLoading ? 'Saving...' : (editingRequest ? 'Update Request' : 'Confirm & Create')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OffboardingManager;
