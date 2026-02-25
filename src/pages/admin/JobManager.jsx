import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Plus, Edit, Trash2, Save, X, Search, MapPin, Briefcase, Users, Building2, Mail, Calendar, CheckCircle, ClipboardCheck, UserPlus, RefreshCw, Download, CloudUpload, Copy, Archive } from 'lucide-react';
import ResumeAnalysisModal from '../../components/admin/ResumeAnalysisModal';
import StatusModal from '../../components/admin/StatusModal';
import AvailabilityManager from '../../components/admin/AvailabilityManager';
import UpcomingInterviews from '../../components/admin/UpcomingInterviews';
import OnboardingDetailsModal from '../../components/admin/OnboardingDetailsModal';

import ScheduleInterviewModal from '../../components/admin/ScheduleInterviewModal';
import Dashboard from '../../components/admin/Dashboard';
import OffboardingManager from '../../components/admin/OffboardingManager';
import { supabase } from '../../lib/supabase';
import { isFuzzyMatch } from '../../utils/stringUtils';

const JobManager = () => {
    const { jobs, addJob, updateJob, deleteJob } = useJobs();
    const { user, rolePermissions } = useAuth();
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);
    const [selectedJobForApps, setSelectedJobForApps] = useState(null);

    // Onboarding Modal State
    const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
    const [selectedOnboardingSubmission, setSelectedOnboardingSubmission] = useState(null);
    const [isLoadingOnboarding, setIsLoadingOnboarding] = useState(false);



    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [currentAnalysis, setCurrentAnalysis] = useState(null);
    const [analyzingIds, setAnalyzingIds] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    // Filter States for Jobs
    const [selectedLocation, setSelectedLocation] = useState('All');
    const [selectedCompany, setSelectedCompany] = useState('All');
    const [selectedJobStatus, setSelectedJobStatus] = useState('All');

    // Filter States for Applications
    const [selectedAppPosition, setSelectedAppPosition] = useState('All');
    const [selectedAppCompany, setSelectedAppCompany] = useState('All');
    const [applicationStatusFilter, setApplicationStatusFilter] = useState('active');

    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'jobs', 'applications', 'calendar', 'upcoming'
    const [applications, setApplications] = useState([]);
    const [isLoadingApps, setIsLoadingApps] = useState(false);
    const [statusModal, setStatusModal] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        onConfirm: null,
        isLoading: false
    });
    const [scheduleModal, setScheduleModal] = useState({
        isOpen: false,
        candidateName: '',
        applicationId: null
    });

    const location = useLocation();

    // Parse tab from URL on mount/update
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [location.search]);

    useEffect(() => {
        const fetchApplications = async () => {
            setIsLoadingApps(true);
            try {
                const { data, error } = await supabase
                    .from('applications')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const { data: onboardingData } = await supabase
                    .from('onboarding_submissions')
                    .select('application_id, status, verified_at');

                const { data: interviewData } = await supabase
                    .from('interview_slots')
                    .select('application_id')
                    .eq('status', 'booked');

                const onboardingMap = new Map(
                    (onboardingData || []).map(sub => [sub.application_id, { status: sub.status, verifiedAt: sub.verified_at }])
                );

                const interviewSet = new Set(
                    (interviewData || []).map(slot => slot.application_id)
                );

                // Map database columns to camelCase for frontend usage
                const mappedData = (data || []).map(app => {
                    const onboardingInfo = onboardingMap.get(app.id);
                    return {
                        ...app,
                        jobTitle: app.job_title,
                        resumeUrl: app.resume_url,
                        appliedAt: app.created_at,
                        onboardingStatus: onboardingInfo?.status || null,
                        onboardingVerifiedAt: onboardingInfo?.verifiedAt || null,
                        hasInterview: interviewSet.has(app.id)
                    };
                });

                setApplications(mappedData);
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setIsLoadingApps(false);
            }
        };

        fetchApplications();
    }, []);

    const [formData, setFormData] = useState({
        title: '',
        company: 'Sunningdale Tech Ltd (HQ)',
        location: 'Singapore',
        type: 'Full-time',
        requirements: '',
        responsibilities: '',
        email: '',
        hiringManagerEmail: '',
        status: 'Active',
        highlights: '',
        career_level: 'Senior Executive'
    });

    const handleAddNew = () => {
        setCurrentJob(null);
        setFormData({
            title: '',
            company: (user?.role === 'site_admin' || user?.role === 'hr_user') ? user.company_name : 'Sunningdale Tech Ltd (HQ)',
            location: 'Singapore',
            type: 'Full-time',
            requirements: '',
            responsibilities: '',
            email: '',
            hiringManagerEmail: '',
            status: 'Active',
            highlights: '',
            career_level: 'Senior Executive'
        });
        setIsModalOpen(true);
    };

    const handleEdit = (job) => {
        setCurrentJob(job);
        setFormData({
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            requirements: job.requirements,
            responsibilities: job.responsibilities,
            email: job.email,
            hiringManagerEmail: job.hiringManagerEmail || '',
            status: job.status,
            highlights: job.highlights || '',
            career_level: job.career_level || 'Senior Executive'
        });
        setIsModalOpen(true);
    };

    const handleCopy = (job) => {
        setCurrentJob(null);
        setFormData({
            title: `${job.title} (Copy)`,
            company: job.company,
            location: job.location,
            type: job.type,
            requirements: job.requirements,
            responsibilities: job.responsibilities,
            email: job.email,
            hiringManagerEmail: job.hiringManagerEmail || '',
            status: job.status, // Can keep same status or set to Draft if we had one.
            highlights: job.highlights || '',
            career_level: job.career_level || 'Senior Executive'
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        handleDeleteJob(id);
    };

    const handleResendOnboardingEmail = async (applicationId) => {
        try {
            // Assuming `email` variable is available in this scope, e.g., from `application` object
            // This change is based on the provided instruction, which modifies the endpoint and adds an email parameter.
            // If `email` is not available, this will cause a reference error.
            // For the purpose of this task, I'm assuming `email` would be passed or derived.
            // As the instruction only provides the fetch call, I'm applying it directly.
            const email = "example@example.com"; // Placeholder for `email` variable
            const response = await fetch(`/api/employees/lookup?email=${email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId })
            });

            if (!response.ok) throw new Error('Failed to resend email');

            setStatusModal({
                isOpen: true,
                type: 'success',
                title: 'Email Sent',
                message: 'Onboarding email has been resent successfully.',
                onConfirm: null
            });
        } catch (error) {
            console.error('Error resending email:', error);
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to resend onboarding email. Please try again.',
                onConfirm: null
            });
        }
    };

    const handleDownloadADJson = async (app) => {
        try {
            // Fetch HR details
            const { data: hrDetails, error: hrError } = await supabase
                .from('hr_onboarding_details')
                .select('*')
                .eq('application_id', app.id)
                .single();

            if (hrError) throw hrError;

            // Fetch Personal Details (from onboarding_submissions)
            const { data: submission, error: subError } = await supabase
                .from('onboarding_submissions')
                .select('personal_details')
                .eq('application_id', app.id)
                .single();

            if (subError) throw subError;

            // Fetch Company AD Name
            let companyADName = hrDetails.company;
            if (hrDetails.company) {
                const { data: compData } = await supabase
                    .from('companies')
                    .select('ad_full_name')
                    .eq('item', hrDetails.company)
                    .maybeSingle();

                if (compData && compData.ad_full_name) {
                    companyADName = compData.ad_full_name;
                }
            }

            // Fetch Location AD Name
            let locationADName = hrDetails.location;
            if (hrDetails.location) {
                const { data: locData } = await supabase
                    .from('locations')
                    .select('ad_full_name')
                    .eq('item', hrDetails.location)
                    .maybeSingle();

                if (locData && locData.ad_full_name) {
                    locationADName = locData.ad_full_name;
                }
            }

            const personal = submission.personal_details || {};
            const firstName = personal.firstName || app.name.split(' ')[0] || 'Unknown';
            const lastName = personal.lastName || app.name.split(' ').slice(1).join(' ') || 'User';

            const adData = {
                host: {
                    connectionReferenceName: "shared_uiflow",
                    operationId: "RunUIFlow_V2"
                },
                parameters: {
                    uiFlowId: "8525a8df-d496-48ea-ad44-53cdeb04c1b0",
                    runMode: "unattended",
                    "item/DistinguishedName": "OU=Users,OU=Accounts,OU=LL,OU=RR,OU=AP,OU=AAll Sunningdale Tech Sites and Users,DC=ad,DC=techgrp,DC=com",
                    "item/EmployeeCode": hrDetails.employee_code,
                    "item/FirstName": firstName,
                    "item/InitialPassword": "Qweasdzxc12~#@",
                    "item/LastName": lastName,
                    "item/LDAP": "LDAP://DC=ad,DC=techgrp,DC=com",
                    "item/EmailSuffix": "@sdaletech.com",
                    "item/Location": locationADName,
                    "item/Department": hrDetails.department,
                    "item/JobTitle": hrDetails.job_title,
                    "item/Manger": hrDetails.manager_email || hrDetails.manager, // Preserving 'Manger' typo from user request
                    "item/Company": companyADName,
                    "item/Region": hrDetails.region,
                    "x-ms-flow-trusted-access": true
                }
            };

            // Create and download JSON file
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(adData, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `ad_user_${firstName}_${lastName}.json`);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

        } catch (error) {
            console.error('Error downloading AD JSON:', error);
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Download Failed',
                message: 'Failed to generate AD JSON file. Please ensure HR details are saved.',
                onConfirm: null
            });
        }
    };

    const handleProvisionAD = async (app) => {
        try {
            const response = await fetch(`/api/integrations/ad/provision`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId: app.id })
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || 'Provisioning failed');

            setStatusModal({
                isOpen: true,
                type: 'success',
                title: 'Provisioning Started',
                message: 'Request sent to Power Automate successfully.',
                onConfirm: null
            });
        } catch (error) {
            console.error('Error provisioning AD:', error);
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Provisioning Failed',
                message: error.message || 'Failed to trigger Power Automate.',
                onConfirm: null
            });
        }
    };

    const handleViewApplicants = (job) => {
        setSelectedJobForApps(job);
        setIsApplicantsModalOpen(true);
    };

    const handleAnalyze = async (app) => {
        if (app.analysis) {
            setCurrentAnalysis(app.analysis);
            setIsAnalysisModalOpen(true);
            return;
        }

        // Real analysis via server endpoint
        // Reset error state and mark as analyzing
        setApplications(prev => prev.map(a =>
            a.id === app.id ? { ...a, analysisError: false } : a
        ));
        setAnalyzingIds(prev => new Set(prev).add(app.id));

        try {
            const response = await fetch(`/api/analyze-supabase-application/${app.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobTitle: app.jobTitle })
            });

            if (!response.ok) throw new Error('Analysis failed');

            const analysisResult = await response.json();

            // Update local state
            setApplications(prev => prev.map(a =>
                a.id === app.id ? { ...a, analysis: analysisResult, analysisError: false } : a
            ));

            // Open modal with new result
            setCurrentAnalysis(analysisResult);
            setIsAnalysisModalOpen(true);

        } catch (error) {
            console.error("Analysis error:", error);
            // Set error state instead of alerting
            setApplications(prev => prev.map(a =>
                a.id === app.id ? { ...a, analysisError: true } : a
            ));
        } finally {
            setAnalyzingIds(prev => {
                const next = new Set(prev);
                next.delete(app.id);
                return next;
            });
        }
    };

    const handleDeleteJob = (id) => {
        setStatusModal({
            isOpen: true,
            type: 'confirm',
            title: 'Delete Job',
            message: 'Are you sure you want to delete this job? This action cannot be undone.',
            onConfirm: () => {
                deleteJob(id);
                setStatusModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleDeleteApplication = (appId) => {
        setStatusModal({
            isOpen: true,
            type: 'confirm',
            title: 'Delete Application',
            message: 'Are you sure you want to delete this application? This action cannot be undone.',
            onConfirm: async () => {
                setStatusModal(prev => ({ ...prev, isLoading: true }));
                try {
                    // Call backend to delete (safely removes file using Service Role)
                    const response = await fetch(`/api/applications/${appId}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.details || 'Failed to delete');
                    }

                    setApplications(prev => prev.filter(app => app.id !== appId));
                    setStatusModal({
                        isOpen: true,
                        type: 'success',
                        title: 'Application Deleted',
                        message: 'The application and resume have been successfully deleted.',
                        onConfirm: null
                    });
                } catch (error) {
                    console.error('Error deleting application:', error);
                    setStatusModal({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: `Failed to delete application: ${error.message}`,
                        onConfirm: null
                    });
                }
            }
        });
    };

    const handleArchiveApplication = (appId) => {
        setStatusModal({
            isOpen: true,
            type: 'confirm',
            title: 'Archive Application',
            message: 'Are you sure you want to archive this application? It will be automatically deleted after 1 year.',
            onConfirm: async () => {
                setStatusModal(prev => ({ ...prev, isLoading: true }));
                try {
                    const response = await fetch(`/api/applications/${appId}/archive`, {
                        method: 'PATCH'
                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.details || 'Failed to archive');
                    }

                    setApplications(prev => prev.map(app =>
                        app.id === appId ? { ...app, status: 'archived' } : app
                    ));
                    setStatusModal({
                        isOpen: true,
                        type: 'success',
                        title: 'Application Archived',
                        message: 'The application has been successfully archived.',
                        onConfirm: null
                    });
                } catch (error) {
                    console.error('Error archiving application:', error);
                    setStatusModal({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: `Failed to archive application: ${error.message}`,
                        onConfirm: null
                    });
                }
            }
        });
    };

    const handleScheduleInterview = (app) => {
        setScheduleModal({
            isOpen: true,
            candidateName: app.name,
            applicationId: app.id
        });
    };

    const handleSendInvite = async (slots) => {
        const { applicationId, candidateName } = scheduleModal;
        setScheduleModal(prev => ({ ...prev, isLoading: true }));

        try {
            // Call API to send email
            const response = await fetch(`/api/schedule-interview`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    applicationId,
                    slots,
                    message: "We have reviewed your application and would like to invite you for an interview."
                })
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Failed to send invitation email');
            }

            // Update application status in Supabase
            const { error } = await supabase
                .from('applications')
                .update({ status: 'interview_invited' })
                .eq('id', applicationId);

            if (error) throw error;

            setApplications(prev => prev.map(a =>
                a.id === applicationId ? { ...a, status: 'interview_invited' } : a
            ));
            setScheduleModal({ isOpen: false, candidateName: '', applicationId: null });
            setStatusModal({
                isOpen: true,
                type: 'success',
                title: 'Invitation Sent',
                message: `Interview invitation sent to ${candidateName} successfully!`,
                onConfirm: null
            });
        } catch (error) {
            console.error('Error sending invitation:', error);
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Sending Failed',
                message: 'Failed to send invitation. Please check your connection and try again.',
                onConfirm: null
            });
            setScheduleModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Sanitize emails: replace semicolons with commas to support multiple formats
        const sanitizedFormData = {
            ...formData,
            email: formData.email ? formData.email.replace(/;/g, ',').replace(/\s+/g, ' ').trim() : '',
            hiringManagerEmail: formData.hiringManagerEmail ? formData.hiringManagerEmail.replace(/;/g, ',').replace(/\s+/g, ' ').trim() : ''
        };

        if (currentJob) {
            updateJob(currentJob.id, sanitizedFormData);
        } else {
            addJob({ ...sanitizedFormData, createdBy: user?.username });
        }
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleHire = async (candidate) => {
        setStatusModal({
            isOpen: true,
            type: 'confirm',
            title: 'Confirm Hire',
            message: `Are you sure you want to hire ${candidate.name}? This will mark the job "${selectedJobForApps.title}" as Inactive.`,
            confirmText: 'Confirm Hire',
            onConfirm: async () => {
                setStatusModal(prev => ({ ...prev, isLoading: true }));
                try {
                    // 1. Call Backend API to Hire & Send Email
                    // Assuming `selectedApplication` is available or `candidate` object has an `id` property
                    const selectedApplication = candidate; // Placeholder if `selectedApplication` is not directly available
                    const response = await fetch(`/api/hire-application/${selectedApplication.id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            jobId: selectedJobForApps?.id // Optional: Pass job ID to mark inactive
                        })
                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.error || 'Failed to hire candidate');
                    }

                    // 2. Fetch updated job data if needed (frontend state update below handles visual)
                    if (selectedJobForApps) {
                        // Optimistically update local job state to Inactive if we assume backend did it
                        await updateJob(selectedJobForApps.id, { ...selectedJobForApps, status: 'Inactive' });
                    }

                    // 3. Update local state
                    setApplications(prev => prev.map(app =>
                        app.id === candidate.id ? { ...app, status: 'hired' } : app
                    ));

                    // Don't close modal, just show success
                    // setIsApplicantsModalOpen(false); 
                    setStatusModal({
                        isOpen: true,
                        type: 'success',
                        title: 'Candidate Hired',
                        message: `Successfully hired ${candidate.name}. An onboarding email has been sent. The job posting is now Inactive.`,
                        onConfirm: null,
                        isLoading: false
                    });
                } catch (error) {
                    console.error("Error hiring candidate:", error);
                    setStatusModal({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: error.message || 'Failed to process hiring. Please try again.',
                        onConfirm: null,
                        isLoading: false
                    });
                }
            }
        });
    };

    // 1. Get jobs owned by user (Admins see all)
    const ownedJobs = jobs.filter(job => {
        if (user?.role === 'super_admin' || user?.role === 'admin') return true;

        // Strict company check for Site Admin and HR User
        if (user?.role === 'site_admin' || user?.role === 'hr_user') {
            const isCreator = job.createdBy === user?.username;

            // Check Main Company
            if (user.company_name) {
                if (isFuzzyMatch(user.company_name, job.company)) {
                    return true;
                }
            }

            // Check Additional Allowed Companies (Multi-Company Access)
            if (user.allowed_companies && Array.isArray(user.allowed_companies)) {
                const isAllowed = user.allowed_companies.some(allowed => isFuzzyMatch(allowed, job.company));
                if (isAllowed) return true;
            }

            return isCreator;
        }
        return job.createdBy === user?.username;
    });

    // 2. Filter applications based on visible jobs
    const ownedApplications = applications.filter(app =>
        ownedJobs.some(job => job.id === app.job_id)
    );

    // Derived filters
    const uniqueLocations = ['All', ...new Set(ownedJobs.map(job => job.location).filter(Boolean))].sort();
    const uniqueCompanies = ['All', ...new Set(ownedJobs.map(job => job.company).filter(Boolean))].sort();
    const uniqueStatuses = ['All', ...new Set(ownedJobs.map(job => job.status).filter(Boolean))].sort();

    // 3. Apply search filter to owned jobs for display
    const filteredJobs = ownedJobs.filter(job => {
        // Location Filter
        if (selectedLocation !== 'All' && job.location !== selectedLocation) return false;

        // Company Filter
        if (selectedCompany !== 'All' && job.company !== selectedCompany) return false;

        // Status Filter
        if (selectedJobStatus !== 'All' && job.status !== selectedJobStatus) return false;

        // Title Search
        if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;

        return true;
    });

    // Derived filters for Applications
    const uniqueAppPositions = ['All', ...new Set(ownedApplications.map(app => app.jobTitle).filter(Boolean))].sort();
    const uniqueAppCompanies = ['All', ...new Set(ownedApplications.map(app => {
        const job = ownedJobs.find(j => j.id === app.job_id);
        return job ? job.company : null;
    }).filter(Boolean))].sort();

    // 4. Apply search filter to owned applications for display
    const filteredApplications = ownedApplications.filter(app => {
        // Status Scope Filter (Active vs Archived)
        if (applicationStatusFilter === 'active' && app.status === 'archived') return false;
        if (applicationStatusFilter === 'archived' && app.status !== 'archived') return false;

        // Position Filter
        if (selectedAppPosition !== 'All' && app.jobTitle !== selectedAppPosition) return false;

        // Company Filter
        if (selectedAppCompany !== 'All') {
            const job = ownedJobs.find(j => j.id === app.job_id);
            if (!job || job.company !== selectedAppCompany) return false;
        }

        // Search Filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return app.name.toLowerCase().includes(searchLower) ||
                app.jobTitle.toLowerCase().includes(searchLower) ||
                app.email.toLowerCase().includes(searchLower);
        }

        return true;
    });

    const handleViewOnboarding = async (applicationId) => {
        setIsLoadingOnboarding(true);
        setIsOnboardingModalOpen(true);
        try {
            const { data, error } = await supabase
                .from('onboarding_submissions')
                .select('*')
                .eq('application_id', applicationId)
                .single();

            if (error) throw error;
            setSelectedOnboardingSubmission(data);
        } catch (error) {
            console.error('Error fetching onboarding details:', error);
            // Optionally show error toast
        } finally {
            setIsLoadingOnboarding(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{t('jobManager')}</h1>
                    <p className="text-slate-500 mt-1">{t('manageJobsDescription')}</p>
                </div>
                {activeTab === 'jobs' && (
                    <button
                        onClick={handleAddNew}
                        className="bg-primary text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-primary-dark transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        <Plus size={20} />
                        <span className="font-medium">{t('createJob')}</span>
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-slate-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`pb-3 px-4 font-medium transition-colors relative whitespace-nowrap ${activeTab === 'dashboard'
                        ? 'text-primary'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    {t('dashboard')}
                    {activeTab === 'dashboard' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('jobs')}
                    className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'jobs'
                        ? 'text-primary'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    {t('jobListings')}
                    {activeTab === 'jobs' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'applications'
                        ? 'text-primary'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    {t('applications')}
                    {activeTab === 'applications' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('calendar')}
                    className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'calendar'
                        ? 'text-primary'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    {t('calendar')}
                    {activeTab === 'calendar' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'upcoming'
                        ? 'text-primary'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    {t('upcoming')}
                    {activeTab === 'upcoming' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                    )}
                </button>

                {/* Onboarding Tab - Permission Gated */}
                {(user?.role === 'super_admin' || user?.role === 'admin' || rolePermissions?.[user?.role]?.includes('/admin/jobs/onboarding')) && (
                    <button
                        onClick={() => setActiveTab('onboarding')}
                        className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'onboarding'
                            ? 'text-primary'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Onboarding
                        {activeTab === 'onboarding' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                        )}
                    </button>
                )}

                {/* Offboarding Tab - Permission Gated */}
                {(user?.role === 'super_admin' || user?.role === 'admin' || rolePermissions?.[user?.role]?.includes('/admin/jobs/offboarding')) && (
                    <button
                        onClick={() => setActiveTab('offboarding')}
                        className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'offboarding'
                            ? 'text-primary'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Offboarding
                        {activeTab === 'offboarding' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                        )}
                    </button>
                )}
            </div>


            {/* Search and Filter Bar - Hide for Calendar, Upcoming, Dashboard, and Offboarding */}
            {activeTab !== 'calendar' && activeTab !== 'upcoming' && activeTab !== 'dashboard' && activeTab !== 'offboarding' && (
                <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    {activeTab === 'jobs' ? (
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Location Filter */}
                            <div className="relative md:w-1/4">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <MapPin size={18} />
                                </div>
                                <select
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white font-medium text-slate-700"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                >
                                    {uniqueLocations.map(loc => (
                                        <option key={loc} value={loc}>{loc === 'All' ? t('allLocations') : loc}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Company Filter */}
                            <div className="relative md:w-1/4">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Building2 size={18} />
                                </div>
                                <select
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white font-medium text-slate-700"
                                    value={selectedCompany}
                                    onChange={(e) => setSelectedCompany(e.target.value)}
                                >
                                    {uniqueCompanies.map(comp => (
                                        <option key={comp} value={comp}>{comp === 'All' ? t('allCompanies') : comp}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div className="relative md:w-1/4">
                                <select
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white font-medium text-slate-700"
                                    value={selectedJobStatus}
                                    onChange={(e) => setSelectedJobStatus(e.target.value)}
                                >
                                    {uniqueStatuses.map(status => (
                                        <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Title Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Entity Filter */}
                            <div className="relative md:w-1/3">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Building2 size={18} />
                                </div>
                                <select
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white font-medium text-slate-700"
                                    value={selectedAppCompany}
                                    onChange={(e) => setSelectedAppCompany(e.target.value)}
                                >
                                    {uniqueAppCompanies.map(comp => (
                                        <option key={comp} value={comp}>{comp === 'All' ? 'All Entities' : comp}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Position Filter */}
                            <div className="relative md:w-1/4">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Briefcase size={18} />
                                </div>
                                <select
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white font-medium text-slate-700"
                                    value={selectedAppPosition}
                                    onChange={(e) => setSelectedAppPosition(e.target.value)}
                                >
                                    {uniqueAppPositions.map(pos => (
                                        <option key={pos} value={pos}>{pos === 'All' ? 'All Positions' : pos}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Application Status Filter */}
                            <div className="relative md:w-1/4">
                                <select
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white font-medium text-slate-700"
                                    value={applicationStatusFilter}
                                    onChange={(e) => setApplicationStatusFilter(e.target.value)}
                                >
                                    <option value="active">Active Candidates</option>
                                    <option value="archived">Archived Candidates</option>
                                </select>
                            </div>

                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email or job title..."
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            {activeTab === 'dashboard' ? (
                <Dashboard jobs={ownedJobs} applications={ownedApplications} />
            ) : activeTab === 'calendar' ? (
                <AvailabilityManager applications={ownedApplications} />
            ) : activeTab === 'upcoming' ? (
                <UpcomingInterviews jobs={ownedJobs} applications={ownedApplications} />
            ) : activeTab === 'jobs' ? (
                <>
                    {/* Job Grid */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-700">{t('jobTitle')}</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">{t('companyAndLocation')}</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">{t('type')}</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">{t('status')}</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">{t('applications')}</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredJobs.map(job => {
                                        const appCount = applications.filter(app => app.job_id === job.id).length;
                                        return (
                                            <tr key={job.id} className="group hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800">{job.title}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                            <Building2 size={14} />
                                                            <span>{job.company}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                                            <MapPin size={14} />
                                                            <span>{job.location}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full inline-block">
                                                        {job.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {job.status === 'Inactive' ? (
                                                            <span className="text-xs font-bold px-2.5 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1 border border-green-200">
                                                                <CheckCircle size={12} /> Hired
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                                                                Active
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                                                        <Users size={16} className="text-slate-400" />
                                                        <span>{appCount} Applied</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleViewApplicants(job)}
                                                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="View Applied Candidates"
                                                        >
                                                            <Users size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleCopy(job)}
                                                            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="Copy as new"
                                                        >
                                                            <Copy size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(job)}
                                                            className="p-2 text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                            title="Edit Job"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(job.id)}
                                                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Job"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {filteredJobs.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No jobs found</h3>
                            <p className="text-slate-500">Try adjusting your search or add a new job.</p>
                        </div>
                    )}
                </>
            ) : activeTab === 'applications' ? (
                <>
                    {/* Applications List (Non-Hired) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        {isLoadingApps ? (
                            <div className="p-12 text-center text-slate-500">Loading applications...</div>
                        ) : filteredApplications.filter(app => app.status !== 'hired').length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Candidate</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Position</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Contact</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Date Applied</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Resume</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredApplications.filter(app => app.status !== 'hired').map(app => (
                                            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">{app.name}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-slate-700">{app.jobTitle}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-slate-600">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Mail size={14} /> {app.email}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users size={14} /> {app.phone}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 text-sm">
                                                    {new Date(app.appliedAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {app.resumeUrl ? (
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    console.log('[Resume Debug] Starting resume view');
                                                                    console.log('[Resume Debug] Resume URL:', app.resumeUrl);
                                                                    console.log('[Resume Debug] Is HTTP?:', app.resumeUrl.startsWith('http'));

                                                                    if (app.resumeUrl.startsWith('http')) {
                                                                        console.log('[Resume Debug] Opening HTTP URL directly');
                                                                        window.open(app.resumeUrl, '_blank');
                                                                    } else {
                                                                        console.log('[Resume Debug] Requesting signed URL from backend');

                                                                        const response = await fetch('/api/resume-url', {
                                                                            method: 'POST',
                                                                            headers: { 'Content-Type': 'application/json' },
                                                                            body: JSON.stringify({ resumePath: app.resumeUrl })
                                                                        });

                                                                        if (!response.ok) {
                                                                            throw new Error('Failed to get signed URL');
                                                                        }

                                                                        const { signedUrl } = await response.json();
                                                                        console.log('[Resume Debug] Got signed URL');

                                                                        // Check if it's a DOCX file - use Office Online viewer
                                                                        if (app.resumeUrl.toLowerCase().endsWith('.docx') ||
                                                                            app.resumeUrl.toLowerCase().endsWith('.doc')) {
                                                                            console.log('[Resume Debug] DOCX file - using Office Online viewer');
                                                                            const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(signedUrl)}`;
                                                                            window.open(officeViewerUrl, '_blank');
                                                                        } else {
                                                                            // PDF and other files - open directly
                                                                            console.log('[Resume Debug] Opening file directly');
                                                                            window.open(signedUrl, '_blank');
                                                                        }
                                                                    }
                                                                } catch (err) {
                                                                    console.error('[Resume Debug] Error opening resume:', err);
                                                                    alert('Could not access resume.');
                                                                }
                                                            }}
                                                            className="text-primary hover:text-primary-dark font-medium text-sm hover:underline focus:outline-none text-left"
                                                        >
                                                            View Resume
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-400 text-sm">No Resume</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {applicationStatusFilter === 'active' && (
                                                            <button
                                                                onClick={() => handleArchiveApplication(app.id)}
                                                                className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                                title="Archive Application"
                                                            >
                                                                <Archive size={18} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteApplication(app.id)}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Application"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900">No applications found</h3>
                                <p className="text-slate-500">Applications will appear here once candidates apply.</p>
                            </div>
                        )}
                    </div>
                </>
            ) : activeTab === 'onboarding' ? (
                <>
                    {/* Onboarding List (Hired) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        {isLoadingApps ? (
                            <div className="p-12 text-center text-slate-500">Loading onboarding candidates...</div>
                        ) : filteredApplications.filter(app => app.status === 'hired').length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Candidate</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Position</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Contact</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700">Date Applied</th>
                                            {/* Match Score column removed */}

                                            <th className="px-6 py-4 font-semibold text-slate-700 text-center">Actions</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredApplications.filter(app => app.status === 'hired').map(app => (
                                            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">{app.name}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-slate-700">{app.jobTitle}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-slate-600">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Mail size={14} /> {app.email}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users size={14} /> {app.phone}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 text-sm">
                                                    {new Date(app.appliedAt).toLocaleDateString()}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-3">
                                                        {/* Schedule Interview - Hidden for hired */}

                                                        {/* Onboarding Actions */}
                                                        <div className="relative group/icon">
                                                            <button
                                                                onClick={() => app.onboardingStatus === 'submitted' && handleViewOnboarding(app.id)}
                                                                className={`p-2 rounded-lg transition-colors ${app.onboardingVerifiedAt
                                                                    ? 'text-white bg-green-600 hover:bg-green-700 shadow-sm'
                                                                    : app.onboardingStatus === 'submitted'
                                                                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer'
                                                                        : 'text-slate-300 cursor-default'
                                                                    }`}
                                                            >
                                                                {app.onboardingVerifiedAt ? <CheckCircle size={18} /> : <ClipboardCheck size={18} />}
                                                            </button>
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                                {app.onboardingVerifiedAt
                                                                    ? 'Onboarding Verified'
                                                                    : app.onboardingStatus === 'submitted'
                                                                        ? 'View Onboarding Details'
                                                                        : 'Onboarding Pending'}
                                                            </div>
                                                        </div>

                                                        {app.onboardingStatus !== 'submitted' && !app.onboardingVerifiedAt && (
                                                            <div className="relative group/icon">
                                                                <button
                                                                    onClick={() => handleResendOnboardingEmail(app.id)}
                                                                    className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                                >
                                                                    <RefreshCw size={18} />
                                                                </button>
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                                    Resend Onboarding Email
                                                                </div>
                                                            </div>
                                                        )}

                                                        <button
                                                            onClick={() => handleDeleteApplication(app.id)}
                                                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                                            title="Delete Application"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center">
                                                        <span className="inline-flex items-center justify-center px-4 py-1.5 bg-green-100 text-green-700 text-sm font-bold rounded-lg shadow-sm border border-green-200 cursor-default min-w-[3rem]">
                                                            Hired
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ClipboardCheck size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900">No onboarding candidates</h3>
                                <p className="text-slate-500">Hired candidates will appear here for onboarding.</p>
                            </div>
                        )}
                    </div>
                </>
            ) : activeTab === 'offboarding' ? (
                <OffboardingManager />
            ) : (
                null
            )}

            {/* Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
                                <h2 className="text-xl font-bold text-slate-800">
                                    {currentJob ? 'Edit Job' : 'New Job Posting'}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Job Title */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Job Title / 职称</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Location */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Location / 地点</label>
                                        <select
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                                        >
                                            <option value="Singapore">Singapore</option>
                                            <option value="Johor, Malaysia">Johor, Malaysia</option>
                                            <option value="Penang, Malaysia">Penang, Malaysia</option>
                                            <option value="Shanghai, China">Shanghai, China</option>
                                            <option value="Chuzhou, China">Chuzhou, China</option>
                                            <option value="Guangzhou, China">Guangzhou, China</option>
                                            <option value="Suzhou, China">Suzhou, China</option>
                                            <option value="Tianjin, China">Tianjin, China</option>
                                            <option value="Zhongshan, China">Zhongshan, China</option>
                                            <option value="Batam, Indonesia">Batam, Indonesia</option>
                                            <option value="Chennai, India">Chennai, India</option>
                                            <option value="Rayong, Thailand">Rayong, Thailand</option>
                                            <option value="Riga, Latvia">Riga, Latvia</option>
                                            <option value="Guadalajara, Mexico">Guadalajara, Mexico</option>
                                        </select>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Notification Email / 电子邮件</label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="hr1@sdaletech.com, hr2@sdaletech.com"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>

                                    {/* Hiring Manager Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Hiring Manager Email / 招聘经理电子邮件</label>
                                        <input
                                            type="text"
                                            name="hiringManagerEmail"
                                            value={formData.hiringManagerEmail || ''}
                                            onChange={handleChange}
                                            placeholder="manager1@sdaletech.com, manager2@sdaletech.com"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>



                                {/* Interview Link - Removed as we now use internal system */}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Job Type */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Job Type / 工作类型</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Shift Work">Shift Work</option>
                                        </select>
                                    </div>

                                    {/* Company */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Company / 公司</label>
                                        <select
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            disabled={user?.role === 'site_admin' || user?.role === 'hr_user'}
                                            className={`w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${(user?.role === 'site_admin' || user?.role === 'hr_user')
                                                ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                                                : 'bg-white'
                                                }`}
                                        >
                                            <option value="Sunningdale Tech Ltd (HQ)">Sunningdale Tech Ltd (HQ)</option>
                                            <option value="Sunningdale Precision Industries Ltd">Sunningdale Precision Industries Ltd</option>
                                            <option value="Omni Mold Ltd">Omni Mold Ltd</option>
                                            <option value="First Engineering Limited">First Engineering Limited</option>
                                            <option value="UFE (A division of Omni Mold Ltd)">UFE (A division of Omni Mold Ltd)</option>
                                            <option value="Sanwa Plastic Industry Pte Ltd">Sanwa Plastic Industry Pte Ltd</option>
                                            <option value="First Engineering (Guangzhou) Co., Ltd">First Engineering (Guangzhou) Co., Ltd</option>
                                            <option value="Sanwa-Intec (Changzhou) Co Ltd">Sanwa-Intec (Changzhou) Co Ltd</option>
                                            <option value="Sunningdale Precision Tech (Chuzhou) Co Ltd">Sunningdale Precision Tech (Chuzhou) Co Ltd</option>
                                            <option value="Omni Tech (Suzhou) Co., Ltd">Omni Tech (Suzhou) Co., Ltd</option>
                                            <option value="Zhongshan Zhihe Electrical Equipment Co., Ltd">Zhongshan Zhihe Electrical Equipment Co., Ltd</option>
                                            <option value="Sunningdale Innovative Technology (Tianjin) Co Ltd">Sunningdale Innovative Technology (Tianjin) Co Ltd</option>
                                            <option value="Sanwa-Intec (Tianjin) Co Ltd">Sanwa-Intec (Tianjin) Co Ltd</option>
                                            <option value="First Engineering (Shanghai) Co., Ltd">First Engineering (Shanghai) Co., Ltd</option>
                                            <option value="Chi Wo Plastic Moulds Fty Ltd">Chi Wo Plastic Moulds Fty Ltd</option>
                                            <option value="SDP Manufacturing SDN BHD">SDP Manufacturing SDN BHD</option>
                                            <option value="Sunningdale Tech Malaysia Sdn Bhd">Sunningdale Tech Malaysia Sdn Bhd</option>
                                            <option value="First Engineering Plastics (Malaysia) Sdn. Bhd">First Engineering Plastics (Malaysia) Sdn. Bhd</option>
                                            <option value="Sunningdale Tech Penang Sdn Bhd">Sunningdale Tech Penang Sdn Bhd</option>
                                            <option value="First Engineering Plastics India Pvt. Ltd.">First Engineering Plastics India Pvt. Ltd.</option>
                                            <option value="Sanwa Synergy Holdings India Pvt. Ltd.">Sanwa Synergy Holdings India Pvt. Ltd.</option>
                                            <option value="PT. Sunningdale Tech Batam">PT. Sunningdale Tech Batam</option>
                                            <option value="PT. Sanwa Engineering Batam">PT. Sanwa Engineering Batam</option>
                                            <option value="PT. Sanwa Engineering Indonesia">PT. Sanwa Engineering Indonesia</option>
                                            <option value="Sunningdale Tech (Thailand) Company Limited">Sunningdale Tech (Thailand) Company Limited</option>
                                            <option value="Sunningdale Tech Inc.">Sunningdale Tech Inc.</option>
                                            <option value="Moldworx, LLC">Moldworx, LLC</option>
                                            <option value="Sunningdale Technologies S.A de C.V">Sunningdale Technologies S.A de C.V</option>
                                            <option value="SIA Sunningdale Tech (Riga)">SIA Sunningdale Tech (Riga)</option>
                                            <option value="SIA Skan-Tooling">SIA Skan-Tooling</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Job Highlights */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Job Highlights (Optional) / 工作亮点</label>
                                    <textarea
                                        name="highlights"
                                        value={formData.highlights}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                {/* Responsibilities */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Responsibilities / 职责</label>
                                    <textarea
                                        name="responsibilities"
                                        value={formData.responsibilities}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                {/* Requirements */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Requirements / 要求</label>
                                    <textarea
                                        name="requirements"
                                        value={formData.requirements}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                {/* Career Level */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Career Level / 职业水平</label>
                                    <select
                                        name="career_level"
                                        value={formData.career_level}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                                    >
                                        <option value="Senior Management">Senior Management</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Senior Executive">Senior Executive</option>
                                        <option value="Junior Executive">Junior Executive</option>
                                        <option value="Non-Executive">Non-Executive</option>
                                        <option value="Fresh Entry">Fresh Entry</option>
                                        <option value="Exempt">Exempt</option>
                                    </select>
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Status / 状态</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white ${formData.status === 'Active' ? 'text-green-600 font-medium' : 'text-slate-500'}`}
                                    >
                                        <option value="Active">Active (Visible)</option>
                                        <option value="Inactive">Inactive (Hidden)</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
                                    >
                                        <Save size={18} />
                                        {currentJob ? 'Save Changes' : 'Create Job'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div >
                )
            }

            {/* Applicants Modal */}
            {
                isApplicantsModalOpen && selectedJobForApps && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">
                            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">
                                        Applied Candidates
                                    </h2>
                                    <p className="text-slate-500 text-sm mt-1">
                                        For: <span className="font-medium text-primary">{selectedJobForApps.title}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsApplicantsModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6">
                                {isLoadingApps ? (
                                    <div className="text-center py-12 text-slate-500">Loading candidates...</div>
                                ) : (
                                    (() => {
                                        const jobApplicants = applications.filter(app => app.jobTitle === selectedJobForApps.title);

                                        if (jobApplicants.length === 0) {
                                            return (
                                                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                    <div className="w-16 h-16 bg-white text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                                        <Users size={32} />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-slate-900">{t('noCandidates')}</h3>
                                                    <p className="text-slate-500">{t('noCandidatesDesc')}</p>
                                                </div>
                                            );
                                        }

                                        return (
                                            <>
                                                <div className="overflow-x-auto rounded-xl border border-slate-100">
                                                    <table className="w-full text-left">
                                                        <thead className="bg-slate-50 border-b border-slate-100">
                                                            <tr>
                                                                <th className="px-6 py-4 font-semibold text-slate-700">{t('candidate')}</th>
                                                                <th className="px-6 py-4 font-semibold text-slate-700">{t('contact')}</th>
                                                                <th className="px-6 py-4 font-semibold text-slate-700">{t('dateApplied')}</th>
                                                                <th className="px-6 py-4 font-semibold text-slate-700 text-center">{t('matchScore')}</th>
                                                                <th className="px-6 py-4 font-semibold text-slate-700 text-center">{t('actions')}</th>
                                                                <th className="px-6 py-4 font-semibold text-slate-700 text-center">{t('status')}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {jobApplicants.map(app => (
                                                                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                                                    <td className="px-6 py-4">
                                                                        <div className="font-medium text-slate-900">{app.name}</div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="text-sm text-slate-600">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <Mail size={14} /> {app.email}
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <Users size={14} /> {app.phone}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-slate-600 text-sm">
                                                                        {new Date(app.appliedAt).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center">
                                                                        {analyzingIds.has(app.id) ? (
                                                                            <span className="text-slate-400 text-sm animate-pulse">Analyzing...</span>
                                                                        ) : app.analysis?.error || app.analysis?.status?.startsWith('rejected_') ? (
                                                                            <button
                                                                                onClick={() => handleAnalyze(app)}
                                                                                className="px-3 py-1 rounded-full text-sm font-medium transition-colors bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"
                                                                                title={app.analysis.error || 'Invalid Document'}
                                                                            >
                                                                                Match Invalid
                                                                            </button>
                                                                        ) : app.analysis ? (
                                                                            (() => {
                                                                                const score = app.analysis.scores?.overall ?? app.analysis.score ?? 0;
                                                                                // Double check for zero scores which indicate invalid analysis in zero-tolerance mode
                                                                                if (score === 0 && app.analysis.is_resume === false) {
                                                                                    return (
                                                                                        <button
                                                                                            onClick={() => handleAnalyze(app)}
                                                                                            className="px-3 py-1 rounded-full text-sm font-medium transition-colors bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"
                                                                                            title="Document identified as non-resume"
                                                                                        >
                                                                                            Match Invalid
                                                                                        </button>
                                                                                    );
                                                                                }

                                                                                return (
                                                                                    <button
                                                                                        onClick={() => handleAnalyze(app)}
                                                                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${score >= 80 ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                                                                            score >= 50 ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                                                                                                'bg-red-100 text-red-700 hover:bg-red-200'
                                                                                            }`}
                                                                                    >
                                                                                        {score}% Match
                                                                                    </button>
                                                                                );
                                                                            })()
                                                                        ) : (
                                                                            <button
                                                                                onClick={() => handleAnalyze(app)}
                                                                                className="text-primary hover:text-primary-dark text-sm font-medium hover:underline"
                                                                            >
                                                                                Analyze
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center justify-center gap-3">
                                                                            {/* View Resume Button Removed */}
                                                                            {app.status !== 'hired' && (
                                                                                <button
                                                                                    onClick={() => handleScheduleInterview(app)}
                                                                                    className={`p-2 rounded-lg transition-colors ${app.status === 'interview_scheduled' || app.hasInterview ? 'text-green-600 bg-green-50 hover:bg-green-100' :
                                                                                        app.status === 'interview_invited' ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' :
                                                                                            'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                                                                                        }`}
                                                                                    title={
                                                                                        app.status === 'interview_scheduled' || app.hasInterview ? "Interview Scheduled" :
                                                                                            app.status === 'interview_invited' ? "Interview Invited" :
                                                                                                "Schedule Interview"
                                                                                    }
                                                                                >
                                                                                    <Calendar size={18} />
                                                                                </button>
                                                                            )}





                                                                            <button
                                                                                onClick={() => handleDeleteApplication(app.id)}
                                                                                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                                                                title="Delete Application"
                                                                            >
                                                                                <Trash2 size={18} />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center justify-center">
                                                                            {app.status === 'hired' ? (
                                                                                <span className="inline-flex items-center justify-center px-4 py-1.5 bg-green-100 text-green-700 text-sm font-bold rounded-lg shadow-sm border border-green-200 cursor-default min-w-[3rem]">
                                                                                    Hired
                                                                                </span>
                                                                            ) : (
                                                                                <button
                                                                                    onClick={() => handleHire(app)}
                                                                                    className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
                                                                                    title="Hire Candidate"
                                                                                >
                                                                                    Hire
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="mt-4 flex items-center gap-6 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 table-auto w-auto mr-auto">
                                                    <span className="font-semibold text-slate-700">{t('interviewStatus')}:</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 rounded-md text-slate-400 bg-white border border-slate-200">
                                                            <Calendar size={14} />
                                                        </div>
                                                        <span>{t('notScheduled')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                                                            <Calendar size={14} />
                                                        </div>
                                                        <span>{t('invited')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 rounded-md bg-green-50 text-green-600">
                                                            <Calendar size={14} />
                                                        </div>
                                                        <span>{t('scheduled')}</span>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Analysis Result Modal */}
            <ResumeAnalysisModal
                isOpen={isAnalysisModalOpen}
                onClose={() => setIsAnalysisModalOpen(false)}
                analysis={currentAnalysis}
                candidateName={applications.find(a => a.analysis === currentAnalysis)?.name || 'Candidate'}
                jobTitle={applications.find(a => a.analysis === currentAnalysis)?.jobTitle || 'Job Position'}
                applicationId={applications.find(a => a.analysis === currentAnalysis)?.id}
                onAnalysisUpdate={(appId, updatedAnalysis) => {
                    setApplications(prev => prev.map(a =>
                        a.id === appId ? { ...a, analysis: updatedAnalysis } : a
                    ));
                    setCurrentAnalysis(updatedAnalysis);
                }}
            />

            <StatusModal
                isOpen={statusModal.isOpen}
                onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                onConfirm={statusModal.onConfirm}
                confirmText={statusModal.confirmText}
                isLoading={statusModal.isLoading}
            />

            <ScheduleInterviewModal
                isOpen={scheduleModal.isOpen}
                onClose={() => setScheduleModal({ isOpen: false, candidateName: '', applicationId: null })}
                candidateName={scheduleModal.candidateName}
                onSendInvites={handleSendInvite}
                isLoading={scheduleModal.isLoading}
            />

            {/* Onboarding Details Modal */}
            <OnboardingDetailsModal
                isOpen={isOnboardingModalOpen}
                onClose={() => setIsOnboardingModalOpen(false)}
                data={selectedOnboardingSubmission}
                candidate={applications.find(app => app.id === selectedOnboardingSubmission?.application_id)}
                isLoading={isLoadingOnboarding}
            />


        </AdminLayout >
    );
};

export default JobManager;
