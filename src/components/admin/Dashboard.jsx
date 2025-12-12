import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Briefcase, Users, Calendar, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = ({ jobs = [], applications = [] }) => {
    const [stats, setStats] = useState({
        activeJobs: 0,
        inactiveJobs: 0,
        totalApplications: 0,
        interviewsScheduled: 0
    });
    const [chartData, setChartData] = useState({
        jobsByStatus: [],
        applicationsByJob: [],
        applicationsTrend: []
    });

    useEffect(() => {
        calculateStats();
    }, [jobs, applications]);

    const calculateStats = async () => {
        // 1. Job Stats
        const activeJobs = jobs.filter(j => j.status !== 'closed').length; // Assuming 'closed' or similar status, or just all jobs if no status field
        // Wait, Job object structure in JobManager doesn't seem to have a 'status' field explicitly shown in previous views, 
        // but let's assume 'Active' if not specified or check if there's a status field. 
        // Looking at JobManager default formData: type, career_level, etc. No explicit 'status'.
        // Let's assume all are active for now, or maybe check if they have a 'status' property.
        // Actually, let's just count total for now and maybe add a dummy status distribution if needed.
        // Or better, let's look at 'type' (Full-time, Contract, etc.)

        const totalApps = applications.length;

        // 2. Interviews Scheduled
        // We need to fetch this or pass it. Since we don't have it passed, let's fetch it.
        let interviewCount = 0;
        try {
            const { data, error } = await supabase
                .from('interview_slots')
                .select('*')
                .eq('status', 'booked');

            if (data) {
                const mappedData = data.map(slot => ({
                    bookedBy: slot.booked_by
                }));
                // Filter by owned applications
                const ownedInterviews = mappedData.filter(slot => {
                    const appId = slot.bookedBy?.applicationId;
                    return applications.some(app => app.id === appId);
                });
                interviewCount = ownedInterviews.length;
            }
        } catch (error) {
            console.error('Error fetching interview stats:', error);
        }

        setStats({
            activeJobs: jobs.length, // Treating all as active for now
            inactiveJobs: 0,
            totalApplications: totalApps,
            interviewsScheduled: interviewCount
        });

        // 3. Charts Data

        // Pie Chart: Job Types
        const jobTypes = {};
        jobs.forEach(job => {
            const type = job.type || 'Unknown';
            jobTypes[type] = (jobTypes[type] || 0) + 1;
        });
        const jobsByStatusData = Object.keys(jobTypes).map(type => ({
            name: type,
            value: jobTypes[type]
        }));

        // Bar Chart: Applications per Job (Top 5)
        const appsPerJob = {};
        applications.forEach(app => {
            appsPerJob[app.jobTitle] = (appsPerJob[app.jobTitle] || 0) + 1;
        });
        const applicationsByJobData = Object.keys(appsPerJob)
            .map(title => ({
                name: title.length > 20 ? title.substring(0, 20) + '...' : title,
                fullTitle: title,
                applicants: appsPerJob[title]
            }))
            .sort((a, b) => b.applicants - a.applicants)
            .slice(0, 5);

        // Area Chart: Applications Trend (Last 7 days)
        // Mocking trend data if no dates available, but applications usually have 'appliedAt' or similar?
        // Let's check JobManager... yes, 'appliedAt'.
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        const trendData = last7Days.map(date => {
            const count = applications.filter(app => {
                if (!app.appliedAt) return false;
                return app.appliedAt.startsWith(date);
            }).length;
            return {
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                count: count
            };
        });

        setChartData({
            jobsByStatus: jobsByStatusData,
            applicationsByJob: applicationsByJobData,
            applicationsTrend: trendData
        });
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Jobs</p>
                        <h3 className="text-2xl font-bold text-slate-800">{stats.activeJobs}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Applicants</p>
                        <h3 className="text-2xl font-bold text-slate-800">{stats.totalApplications}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Interviews Scheduled</p>
                        <h3 className="text-2xl font-bold text-slate-800">{stats.interviewsScheduled}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Avg. Apps/Job</p>
                        <h3 className="text-2xl font-bold text-slate-800">
                            {stats.activeJobs > 0 ? (stats.totalApplications / stats.activeJobs).toFixed(1) : 0}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Applications per Job */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Top Jobs by Applicants</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.applicationsByJob} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="applicants" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Job Types Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Job Types Distribution</h3>
                    <div className="h-[300px] w-full flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData.jobsByStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.jobsByStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Applications Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Application Trend (Last 7 Days)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.applicationsTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <RechartsTooltip />
                                <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorApps)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
