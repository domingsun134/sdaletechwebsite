import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Layout, Briefcase, LogOut, Menu, X, Users, FileEdit, BarChart2, Calendar } from 'lucide-react';
import logo from '../../assets/logo.png';

const AdminLayout = ({ children }) => {
    const { logout, user, rolePermissions } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    // Define navigation items
    const allNavItems = [
        {
            path: '/admin/dashboard',
            label: 'Dashboard',
            icon: <Layout size={20} />
        },
        {
            path: '/admin/content',
            label: 'Content Editor',
            icon: <FileEdit size={20} />
        },
        {
            path: '/admin/analytics',
            label: 'Analytics',
            icon: <BarChart2 size={20} />
        },
        {
            path: '/admin/jobs',
            label: 'Job Manager',
            icon: <Briefcase size={20} />
        },
        {
            path: '/admin/users',
            label: 'User Management',
            icon: <Users size={20} />
        },
        {
            path: '/admin/events',
            label: 'Event Manager',
            icon: <Calendar size={20} />
        },
    ];

    // Filter items based on user's role permissions
    // If no permissions defined for role, default to empty array
    const allowedPaths = rolePermissions?.[user?.role] || [];
    const navItems = allNavItems.filter(item => allowedPaths.includes(item.path));

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Sunningdale Tech" className="h-8" />
                    <span className="font-bold text-slate-800">Admin Portal</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-slate-100 hidden md:flex items-center gap-3">
                        <img src={logo} alt="Sunningdale Tech" className="h-8" />
                        <div>
                            <h1 className="font-bold text-slate-800 text-lg leading-tight">Admin Portal</h1>
                            <p className="text-xs text-slate-500">Management Console</p>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
                            Main Menu
                        </div>
                        {navItems.map(item => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                        ${isActive
                                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }
                                    `}
                                >
                                    <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary transition-colors'}>
                                        {item.icon}
                                    </span>
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors group"
                        >
                            <LogOut size={20} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
                <div className="container mx-auto p-4 md:p-8 max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
