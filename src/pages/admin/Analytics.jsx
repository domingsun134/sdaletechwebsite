import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AnalyticsSummary from '../../components/admin/AnalyticsSummary';

const Analytics = () => {
    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
                <p className="text-slate-500 mt-1">Website traffic and engagement statistics</p>
            </div>
            <AnalyticsSummary />
        </AdminLayout>
    );
};

export default Analytics;
