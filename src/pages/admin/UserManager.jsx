import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Trash2, Plus, Shield, Save, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const UserManager = () => {
    const { users, addUser, deleteUser, rolePermissions, updateRolePermissions } = useAuth();
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'roles'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState('local'); // 'local' or 'entra'

    // Entra ID Search State
    const [entraSearchQuery, setEntraSearchQuery] = useState('');
    const [entraResults, setEntraResults] = useState([]);
    const [isLoadingEntra, setIsLoadingEntra] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        role: 'hr'
    });

    // Available menu items for permissions
    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/content', label: 'Content Editor' },
        { path: '/admin/analytics', label: 'Analytics' },
        { path: '/admin/jobs', label: 'Job Manager' },
        { path: '/admin/events', label: 'Event Manager' },
        { path: '/admin/users', label: 'User Management' },
    ];

    const roles = ['admin', 'marketing', 'hr'];

    const handleSubmit = (e) => {
        e.preventDefault();
        addUser(formData);
        setIsModalOpen(false);
        setFormData({ username: '', password: '', name: '', role: 'hr' });
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
            role: formData.role, // Use the role selected in the form state (even if hidden in this tab, we should expose it)
            email: entraUser.mail,
            azure_oid: entraUser.id,
            company_name: entraUser.companyName
        };

        try {
            addUser(newUser);
            setIsModalOpen(false);
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
                            onClick={() => setIsModalOpen(true)}
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
                </div>

                {activeTab === 'users' ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-700">User</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Username</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map(user => (
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
                                                ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    user.role === 'marketing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        'bg-green-50 text-green-700 border-green-100'
                                                }
                                            `}>
                                                <Shield size={12} />
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{user.username}</td>
                                        <td className="px-6 py-4 text-right">
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {roles.map(role => (
                            <div key={role} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                                    <Shield size={18} className="text-slate-500" />
                                    <h3 className="font-bold text-slate-800 capitalize">{role}</h3>
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
                                                    disabled={role === 'admin' && item.path === '/admin/users'} // Prevent admin from locking themselves out
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
                )}

                {/* Add User Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-900">Add New User</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>
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

                            {modalTab === 'local' ? (
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
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                        <select
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="hr">HR Manager</option>
                                            <option value="marketing">Marketing Director</option>
                                            <option value="admin">Administrator</option>
                                        </select>
                                    </div>
                                    <div className="pt-4 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
                                        >
                                            Create User
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Role for New User</label>
                                        <select
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="hr">HR Manager</option>
                                            <option value="marketing">Marketing Director</option>
                                            <option value="admin">Administrator</option>
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
