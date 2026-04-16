import React, { useState, useEffect, useCallback } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Eye, Users, Monitor, FileText, RefreshCw, TrendingUp } from 'lucide-react';

const DEVICE_COLORS = {
    Desktop: '#6366f1',
    Mobile:  '#06b6d4',
    Tablet:  '#f59e0b',
    Unknown: '#94a3b8',
};

const RANGES = [
    { label: '7 days',  value: 7 },
    { label: '30 days', value: 30 },
    { label: '90 days', value: 90 },
];

const fmtDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon size={20} className="text-white" />
        </div>
        <div>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
            {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
    </div>
);

const AnalyticsSummary = () => {
    const [days, setDays] = useState(30);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/analytics/page-views?days=${days}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (!res.ok) throw new Error(`Server error ${res.status}`);
            setData(await res.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [days]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const avgPerDay = data ? (data.totalViews / days).toFixed(1) : '—';
    const topDevice = data?.deviceBreakdown?.[0]?.device ?? '—';

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                    {RANGES.map(r => (
                        <button
                            key={r.value}
                            onClick={() => setDays(r.value)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                days === r.value
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Loading…' : 'Refresh'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm">{error}</div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Eye}       label="Total Page Views"  value={loading ? '…' : data?.totalViews.toLocaleString()}    sub={`Last ${days} days`}       color="bg-indigo-500" />
                <StatCard icon={Users}     label="Unique Sessions"   value={loading ? '…' : data?.uniqueSessions.toLocaleString()} sub="Anonymous sessions"        color="bg-cyan-500"   />
                <StatCard icon={TrendingUp} label="Avg Views / Day"  value={loading ? '…' : avgPerDay}                             sub="Over selected period"      color="bg-violet-500" />
                <StatCard icon={Monitor}   label="Top Device"        value={loading ? '…' : topDevice}                             sub="Most common device type"   color="bg-amber-500"  />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Views over time */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-indigo-500" />
                        Page Views Over Time
                    </h2>
                    {loading ? (
                        <div className="h-56 flex items-center justify-center text-slate-400 text-sm">Loading…</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={data?.viewsByDay} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={fmtDate}
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    interval={Math.floor((data?.viewsByDay?.length || 1) / 6)}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    labelFormatter={fmtDate}
                                    formatter={(v) => [v, 'Views']}
                                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                                />
                                <Bar dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Device breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Monitor size={16} className="text-cyan-500" />
                        Device Breakdown
                    </h2>
                    {loading ? (
                        <div className="h-56 flex items-center justify-center text-slate-400 text-sm">Loading…</div>
                    ) : !data?.deviceBreakdown?.length ? (
                        <div className="h-56 flex items-center justify-center text-slate-400 text-sm">No data</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={data.deviceBreakdown}
                                    dataKey="count"
                                    nameKey="device"
                                    cx="50%" cy="45%"
                                    outerRadius={75}
                                    label={({ device, percent }) => `${device} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {data.deviceBreakdown.map((entry) => (
                                        <Cell key={entry.device} fill={DEVICE_COLORS[entry.device] || '#94a3b8'} />
                                    ))}
                                </Pie>
                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                                <Tooltip formatter={(v, name) => [v, name]} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Top Pages */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                    <FileText size={16} className="text-violet-500" />
                    <h2 className="font-semibold text-slate-700">Top Pages</h2>
                    <span className="ml-auto text-xs text-slate-400">Last {days} days</span>
                </div>
                {loading ? (
                    <div className="p-6 text-center text-slate-400 text-sm">Loading…</div>
                ) : !data?.topPages?.length ? (
                    <div className="p-6 text-center text-slate-400 text-sm">No page view data recorded yet.</div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {data.topPages.map((row, i) => {
                            const maxViews = data.topPages[0].views;
                            const pct = Math.round((row.views / maxViews) * 100);
                            return (
                                <div key={row.path} className="px-6 py-3 flex items-center gap-4">
                                    <span className="text-xs text-slate-400 w-5 text-right shrink-0">{i + 1}</span>
                                    <span className="text-sm text-slate-700 font-mono truncate flex-1">{row.path}</span>
                                    <div className="w-32 bg-slate-100 rounded-full h-1.5 shrink-0">
                                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 w-12 text-right shrink-0">
                                        {row.views.toLocaleString()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsSummary;
