import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import AnalyticsSummary from '../../components/admin/AnalyticsSummary';
import { BarChart2, Shield } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const canViewAnalytics = ['admin', 'marketing'].includes(user?.role);

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome back, {user?.name}</p>
            </div>

            {canViewAnalytics ? (
                <AnalyticsSummary />
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                        <Shield size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome to the Admin Portal</h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                        You have access to specific management tools. Please use the navigation menu to access your assigned modules.
                    </p>
                </div>
            )}
        </AdminLayout>
    );
};

export default Dashboard;
