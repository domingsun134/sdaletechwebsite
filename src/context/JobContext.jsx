import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const JobContext = createContext();

export const useJobs = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch jobs from backend on mount
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map snake_case to camelCase for app usage
            const mappedData = (data || []).map(job => ({
                ...job,
                hiringManagerEmail: job.hiring_manager_email,
                createdBy: job.created_by
            }));

            setJobs(mappedData);
        } catch (err) {
            console.error('Error loading jobs:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addJob = async (job) => {
        try {
            // Remove id if present to let DB generate it
            const { id, ...jobData } = job;

            // Map camelCase to snake_case for DB
            const dbPayload = {
                ...jobData,
                created_by: jobData.createdBy,
                hiring_manager_email: jobData.hiringManagerEmail
            };

            // Remove camelCase keys to avoid errors
            delete dbPayload.createdBy;
            delete dbPayload.hiringManagerEmail;

            const { data, error } = await supabase
                .from('jobs')
                .insert([dbPayload])
                .select()
                .single();

            if (error) throw error;

            const mappedData = {
                ...data,
                hiringManagerEmail: data.hiring_manager_email,
                createdBy: data.created_by
            };

            setJobs(prev => [mappedData, ...prev]);
            return mappedData;
        } catch (err) {
            console.error('Error adding job:', err);
            throw err;
        }
    };

    const updateJob = async (id, updatedJob) => {
        try {
            // Map camelCase to snake_case for DB
            const dbPayload = {
                ...updatedJob,
                created_by: updatedJob.createdBy, // If present
                hiring_manager_email: updatedJob.hiringManagerEmail
            };

            // Remove camelCase keys
            delete dbPayload.createdBy;
            delete dbPayload.hiringManagerEmail;

            // Also ensure we don't send 'id' or 'created_at' if they are in updatedJob/formData and not meant to be changed manually? 
            // supabase .update() ignores ID in body usually if relying on .eq(), but safer to sanitize?
            // actually 'id' is fine, but read-only columns might error.

            const { data, error } = await supabase
                .from('jobs')
                .update(dbPayload)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            const mappedData = {
                ...data,
                hiringManagerEmail: data.hiring_manager_email,
                createdBy: data.created_by
            };

            setJobs(prev => prev.map(job => job.id === id ? mappedData : job));
            return mappedData;
        } catch (err) {
            console.error('Error updating job:', err);
            throw err;
        }
    };

    const deleteJob = async (id) => {
        try {
            const { error } = await supabase
                .from('jobs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setJobs(prev => prev.filter(job => job.id !== id));
        } catch (err) {
            console.error('Error deleting job:', err);
            throw err;
        }
    };

    return (
        <JobContext.Provider value={{ jobs, loading, error, addJob, updateJob, deleteJob }}>
            {children}
        </JobContext.Provider>
    );
};
