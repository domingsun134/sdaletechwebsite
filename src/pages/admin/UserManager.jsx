
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Trash2, Plus, Shield, Save, X, Building2, Edit } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';

// Multi-Select Component
const CompanyMultiSelect = ({ selected = [], onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOption = (option) => {
        const newSelected = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected, option];
        onChange(newSelected);
    };

    return (
        <div className="relative">
            <div
                className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white cursor-pointer min-h-[42px] flex flex-wrap gap-1"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selected.length === 0 && <span className="text-slate-400">Select companies...</span>}
                {selected.map(item => (
                    <span key={item} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        {item}
                        <X size={12} className="cursor-pointer hover:text-primary-dark" onClick={(e) => {
                            e.stopPropagation();
                            toggleOption(item);
                        }} />
                    </span>
                ))}
            </div>
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {options.map(option => (
                        <div
                            key={option}
                            className={`px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2 ${selected.includes(option) ? 'bg-primary/5 text-primary font-medium' : ''}`}
                            onClick={() => toggleOption(option)}
                        >
                            <div className={`w-4 h-4 border rounded flex items-center justify-center ${selected.includes(option) ? 'bg-primary border-primary' : 'border-slate-300'}`}>
                                {selected.includes(option) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            {option}
                        </div>
                    ))}
                </div>
            )}
            {/* Overlay to close dropdown when clicking outside */}
            {isOpen && <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />}
        </div>
    );
};

const UserManager = () => {
    const { user: currentUser, users, addUser, updateUser, deleteUser, rolePermissions, updateRolePermissions } = useAuth();
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'roles'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState('local'); // 'local' or 'entra'
    const [isEditing, setIsEditing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    // Entra ID Search State
    const [entraSearchQuery, setEntraSearchQuery] = useState('');
    const [entraResults, setEntraResults] = useState([]);
    const [isLoadingEntra, setIsLoadingEntra] = useState(false);

    // Companies State
    const [companies, setCompanies] = useState([]);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        role: 'hr_user',
        company_name: '',
        allowed_companies: []
    });

    // Fetch companies on mount
    useEffect(() => {
        const fetchCompanies = async () => {
            const { data, error } = await supabase
                .from('companies')
                .select('item_full_name');
            if (data) {
                // Filter out nulls and duplicates just in case
                const uniqueCompanies = [...new Set(data.map(c => c.item_full_name).filter(Boolean))];
                setCompanies(uniqueCompanies.sort());
            }
        };
        fetchCompanies();
    }, []);

    // Initialize company name if site admin
    useEffect(() => {
        if (isModalOpen && !isEditing && currentUser?.role === 'site_admin') {
            setFormData(prev => ({ ...prev, company_name: currentUser.company_name }));
        }
    }, [isModalOpen, isEditing, currentUser]);

    // Available menu items for permissions
    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/content', label: 'Content Editor' },
        { path: '/admin/analytics', label: 'Analytics' },
        { path: '/admin/jobs', label: 'Job Manager' },
        { path: '/admin/jobs/onboarding', label: 'Onboarding (Job Manager)' },
        { path: '/admin/jobs/offboarding', label: 'Offboarding (Job Manager)' },
        { path: '/admin/events', label: 'Event Manager' },
        { path: '/admin/users', label: 'User Management' },
    ];

    const roles = ['super_admin', 'site_admin', 'hr_user', 'admin', 'marketing'];

    const roleLabels = {
        super_admin: 'Super HR Admin',
        site_admin: 'Site HR Admin',
        hr_user: 'HR User',
        // Legacy
        admin: 'Administrator',
        marketing: 'Marketing Director',
        hr: 'HR User' // Was 'HR Manager', aligned for UI consistency.
    };

    const resetForm = () => {
        setFormData({ username: '', password: '', name: '', role: 'hr_user', company_name: '', allowed_companies: [] });
        setIsEditing(false);
        setCurrentUserId(null);
        setModalTab('local');
    };

    const handleEdit = (user) => {
        // Map legacy role 'hr' to 'hr_user' for the form
        const normalizedRole = user.role === 'hr' ? 'hr_user' : user.role;

        setFormData({
            username: user.username,
            password: '', // Keep empty
            name: user.name,
            role: normalizedRole,
            company_name: user.company_name || '',
            allowed_companies: user.allowed_companies || []
        });
        setCurrentUserId(user.id);
        setIsEditing(true);
        setIsModalOpen(true);
        setModalTab(user.azure_oid ? 'entra' : 'local');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const updates = { ...formData };
                if (!updates.password) delete updates.password;
                // Site admin can only edit users within their company, and their company_name is fixed.
                // Super admin can edit company_name.
                if (currentUser?.role === 'site_admin') {
                    updates.company_name = currentUser.company_name;
                }
                await updateUser(currentUserId, updates);
            } else {
                await addUser(formData);
            }
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            alert('Failed to save user: ' + error.message);
        }
    };

    const handleEntraSearch = async (e) => {
        e.preventDefault();
        if (!entraSearchQuery.trim()) return;

        setIsLoadingEntra(true);
        try {
            const response = await fetch('/api/entra-users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ search: entraSearchQuery })
            });
            const data = await response.json();
            setEntraResults(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to search Entra users:', error);
            setEntraResults([]);
        } finally {
            setIsLoadingEntra(false);
        }
    };

    const handleAddEntraUser = (entraUser) => {
        // Create user object from Entra data
        const newUser = {
            username: entraUser.mail || entraUser.userPrincipalName, // Use email as username
            name: entraUser.displayName,
            role: formData.role,
            email: entraUser.mail,
            azure_oid: entraUser.id,
            company_name: entraUser.companyName || (currentUser?.role === 'site_admin' ? currentUser.company_name : formData.company_name)
        };

        try {
            addUser(newUser);
            setIsModalOpen(false);
            resetForm();
            setEntraResults([]);
            setEntraSearchQuery('');
        } catch (error) {
            alert('Failed to add user: ' + error.message);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(id);
        }
    };

    const handlePermissionChange = (role, path) => {
        const currentPermissions = rolePermissions[role] || [];
        let newPermissions;

        if (currentPermissions.includes(path)) {
            newPermissions = currentPermissions.filter(p => p !== path);
        } else {
            newPermissions = [...currentPermissions, path];
        }

        updateRolePermissions(role, newPermissions);
    };

    const canEditUser = (targetUser) => {
        if (currentUser?.role === 'super_admin' || currentUser?.role === 'admin') return true;
        if (currentUser?.role === 'site_admin') {
            return targetUser.role === 'hr_user' || targetUser.role === 'hr' || targetUser.id === currentUser.id;
        }
        return false;
    };

    const canDeleteUser = (targetUser) => {
        if (targetUser.role === 'super_admin') return false;
        if (currentUser?.role === 'super_admin' || currentUser?.role === 'admin') return true;
        if (currentUser?.role === 'site_admin') {
            return (targetUser.role === 'hr_user' || targetUser.role === 'hr') && targetUser.id !== currentUser.id;
        }
        return false;
    };

    // Filter users based on visibility rules
    const visibleUsers = users.filter(u => {
        // If the current user is an administrator, they can see everything
        if (currentUser?.role === 'admin') return true;

        // Otherwise, hide Administrator ('admin') and Marketing Director ('marketing') roles from the view entirely
        if (u.role === 'admin' || u.role === 'marketing') return false;

        if (currentUser?.role === 'super_admin') return true;
        if (currentUser?.role === 'site_admin') return u.company_name === currentUser.company_name;
        // HR User typically wouldn't access this page, but safe fallback:
        return u.company_name === currentUser?.company_name && u.id === currentUser?.id;
    });

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                        <p className="text-slate-500">Manage system access and roles</p>
                    </div>
                    {activeTab === 'users' && (
                        <button
                            onClick={() => {
                                resetForm();
                                setIsModalOpen(true);
                            }}
                            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            <Plus size={20} />
                            Add User
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'users'
                            ? 'text-primary'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Users
                        {activeTab === 'users' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                        )}
                    </button>
                    {currentUser?.role === 'admin' && (
                        <button
                            onClick={() => setActiveTab('roles')}
                            className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'roles'
                                ? 'text-primary'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Role Permissions
                            {activeTab === 'roles' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                            )}
                        </button>
                    )}
                </div>

                {activeTab === 'users' ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-700">User</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Company</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Username</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {visibleUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                                    <User size={20} />
                                                </div>
                                                <span className="font-medium text-slate-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                ${user.role === 'super_admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    user.role === 'site_admin' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        'bg-green-50 text-green-700 border-green-100'
                                                }
                                            `}>
                                                <Shield size={12} />
                                                {roleLabels[user.role] || user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <Building2 size={14} className="text-slate-400" />
                                                {user.company_name || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{user.username}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {canEditUser(user) && (
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit User"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                )}
                                                {canDeleteUser(user) && (
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    currentUser?.role === 'admin' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {roles.map(role => (
                                <div key={role} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                                        <Shield size={18} className="text-slate-500" />
                                        <h3 className="font-bold text-slate-800">{roleLabels[role]}</h3>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        {menuItems.map(item => {
                                            const hasAccess = rolePermissions[role]?.includes(item.path);
                                            return (
                                                <label key={item.path} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className={`
                                                    w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                    ${hasAccess
                                                            ? 'bg-primary border-primary text-white'
                                                            : 'border-slate-300 bg-white group-hover:border-primary'
                                                        }
                                                `}>
                                                        {hasAccess && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={hasAccess || false}
                                                        onChange={() => handlePermissionChange(role, item.path)}
                                                        disabled={role === 'super_admin' && item.path === '/admin/users'}
                                                    />
                                                    <span className={`text-sm ${hasAccess ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                                                        {item.label}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-500">
                            You do not have permission to view this section.
                        </div>
                    )
                )}

                {/* Add/Edit User Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-900">{isEditing ? 'Edit User' : 'Add New User'}</h2>
                                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>

                            {!isEditing && (
                                <div className="border-b border-slate-100 flex">
                                    <button
                                        className={`flex-1 py-3 text-sm font-medium transition-colors ${modalTab === 'local' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                        onClick={() => setModalTab('local')}
                                    >
                                        Local User
                                    </button>
                                    <button
                                        className={`flex-1 py-3 text-sm font-medium transition-colors ${modalTab === 'entra' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                        onClick={() => setModalTab('entra')}
                                    >
                                        Azure Entra ID
                                    </button>
                                </div>
                            )}

                            {modalTab === 'local' || isEditing ? (
                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.username}
                                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                                            disabled={isEditing} // Often good practice not to change username/ID
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            {isEditing ? 'New Password (leave blank to keep current)' : 'Password'}
                                        </label>
                                        <input
                                            type="password"
                                            required={!isEditing}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                        <select
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                            disabled={currentUser?.role === 'site_admin' || (isEditing && currentUserId === currentUser?.id)}
                                        >
                                            <option value="super_admin">Super HR Admin</option>
                                            <option value="site_admin">Site HR Admin</option>
                                            <option value="hr_user">HR User</option>
                                            <option value="admin">Administrator</option>
                                            <option value="marketing">Marketing Director</option>
                                        </select>
                                    </div>
                                    {/* Company Name Field - Show if needed */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                                        <input
                                            type="text"
                                            required={['site_admin', 'hr_user'].includes(formData.role)}
                                            disabled={currentUser?.role === 'site_admin'}
                                            placeholder={currentUser?.role === 'site_admin' ? "Auto-assigned" : "e.g. Sunningdale Tech Ltd (HQ)"}
                                            className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none ${currentUser?.role === 'site_admin' ? 'bg-slate-100 text-slate-500' : ''}`}
                                            value={formData.company_name}
                                            onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                        />
                                        {currentUser?.role === 'site_admin' && (
                                            <p className="text-xs text-slate-500 mt-1">Automatically assigned to your company</p>
                                        )}
                                    </div>

                                    {/* Allowed Companies (Multi-Company Access) */}
                                    <div className="pt-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Additional Allowed Companies (Optional)
                                        </label>
                                        <CompanyMultiSelect
                                            selected={formData.allowed_companies || []}
                                            options={companies}
                                            onChange={(newSelected) => setFormData({ ...formData, allowed_companies: newSelected })}
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Users can access jobs from their main company PLUS these companies.</p>
                                    </div>

                                    <div className="pt-4 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => { setIsModalOpen(false); resetForm(); }}
                                            className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
                                        >
                                            {isEditing ? 'Save Changes' : 'Create User'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Role for New User</label>
                                        <select
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                            disabled={currentUser?.role === 'site_admin' || (isEditing && currentUserId === currentUser?.id)}
                                        >
                                            <option value="super_admin">Super HR Admin</option>
                                            <option value="site_admin">Site HR Admin</option>
                                            <option value="hr_user">HR User</option>
                                            <option value="admin">Administrator</option>
                                            <option value="marketing">Marketing Director</option>
                                        </select>
                                    </div>
                                    <form onSubmit={handleEntraSearch} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Search by name..."
                                            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={entraSearchQuery}
                                            onChange={(e) => setEntraSearchQuery(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            disabled={isLoadingEntra}
                                            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
                                        >
                                            {isLoadingEntra ? '...' : 'Search'}
                                        </button>
                                    </form>

                                    <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
                                        {entraResults.length > 0 ? (
                                            entraResults.map((user) => (
                                                <div key={user.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                                                    <div>
                                                        <div className="font-medium text-slate-900">{user.displayName}</div>
                                                        <div className="text-sm text-slate-500">{user.mail || user.userPrincipalName}</div>
                                                        <div className="text-xs text-slate-400">
                                                            {user.jobTitle || 'No Title'}
                                                            {user.companyName && (
                                                                <span className="ml-2 pl-2 border-l border-slate-300">
                                                                    {user.companyName}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddEntraUser(user)}
                                                        className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"
                                                        title="Add User"
                                                    >
                                                        <Plus size={20} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-slate-400 py-4">
                                                {isLoadingEntra ? 'Searching...' : 'Search for users in Entra ID'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default UserManager;
