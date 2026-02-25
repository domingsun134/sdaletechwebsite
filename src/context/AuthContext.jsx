import React, { createContext, useState, useContext, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { supabase } from '../lib/supabase'; // Import Supabase client

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Initialize user from localStorage if available
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // MSAL hooks
    const { instance, accounts } = useMsal();
    const isAuthenticatedMsal = useIsAuthenticated();



    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error('Error loading users:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };






    // Verify session on mount (Token based)
    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    // Fetch users if session is valid
                    fetchUsers();
                } else {
                    logout();
                }
            } catch (err) {
                console.error('Session check failed:', err);
                logout();
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    // Sync MSAL Auth (Entra ID)
    useEffect(() => {
        const handleMsalLogin = async () => {
            if (loading) return; // Wait for local session check
            if (user) return; // Already logged in

            if (isAuthenticatedMsal && accounts.length > 0) {
                const msalAccount = accounts[0];
                const email = msalAccount.username;
                const name = msalAccount.name;
                const oid = msalAccount.homeAccountId;

                try {
                    const response = await fetch('/api/auth/azure', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, name, oid })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem('token', data.accessToken);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        setUser(data.user);
                        setError(null);
                        fetchUsers(); // Load users after successful Entra login
                    } else {
                        const errData = await response.json();
                        console.warn('Entra login failed:', errData.error);
                        setError(errData.error || 'Unauthorized Entra login');
                        setUser(null);
                    }
                } catch (err) {
                    console.error('Entra login error:', err);
                    setError('Failed to authenticate with server');
                }
            }
        };

        handleMsalLogin();
    }, [isAuthenticatedMsal, accounts, loading, user]);

    // Fetch Users should ONLY happen if we are logged in (and likely Admin)
    // Moving fetchUsers out of mount effect.

    // Role Permissions Management
    const defaultPermissions = {
        super_admin: ['/admin/dashboard', '/admin/content', '/admin/analytics', '/admin/jobs', '/admin/users', '/admin/events'],
        site_admin: ['/admin/dashboard', '/admin/content', '/admin/analytics', '/admin/jobs', '/admin/users', '/admin/events'],
        hr_user: ['/admin/dashboard', '/admin/content', '/admin/jobs', '/admin/events'],
        admin: ['/admin/dashboard', '/admin/content', '/admin/analytics', '/admin/jobs', '/admin/users', '/admin/events'],
        marketing: ['/admin/dashboard', '/admin/content', '/admin/analytics', '/admin/events'],
        hr: ['/admin/dashboard', '/admin/content', '/admin/jobs', '/admin/events']
    };

    const [rolePermissions, setRolePermissions] = useState(defaultPermissions);

    // Load permissions from Supabase
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const { data, error } = await supabase
                    .from('role_permissions')
                    .select('*');

                if (error) {
                    console.error('Error fetching role permissions:', error);
                    return;
                }

                if (data && data.length > 0) {
                    const loadedPermissions = { ...defaultPermissions }; // Start with defaults to ensure all roles exist
                    data.forEach(row => {
                        loadedPermissions[row.role] = row.permissions;
                    });
                    setRolePermissions(loadedPermissions);
                } else {
                    setRolePermissions(defaultPermissions);
                }
            } catch (err) {
                console.error('Failed to load permissions:', err);
            }
        };
        fetchPermissions();
    }, []);

    const updateRolePermissions = async (role, newPermissions) => {
        // Optimistic update
        setRolePermissions(prev => ({
            ...prev,
            [role]: newPermissions
        }));

        try {
            const { error } = await supabase
                .from('role_permissions')
                .upsert({
                    role: role,
                    permissions: newPermissions,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'role' });

            if (error) {
                console.error('Failed to save role permissions to Supabase:', error);
                // Optionally revert local state here if needed, but keeping it simple for now
            }
        } catch (err) {
            console.error('Error updating role permissions:', err);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user)); // For fast load
            setUser(data.user);
            setError(null);

            // Allow fetchUsers to run now that we have a token
            fetchUsers();

            return true;
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setError(null);
        if (isAuthenticatedMsal) {
            instance.logoutRedirect();
        }
    };

    // User Management Functions - Secure
    const addUser = async (newUser) => {
        const token = localStorage.getItem('token');
        try {
            // ... same hash logic moved to server, so just send raw ...
            // Wait, server expects raw password now to hash it.

            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newUser)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add user');
            }

            const createdUser = await response.json();
            // setUsers(prev => [...prev, createdUser]); // Optimistic update
            return true;
        } catch (err) {
            console.error('Error adding user:', err);
            throw err;
        }
    };

    const updateUser = async (id, updatedData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error('Failed to update user');

            // const savedUser = await response.json();
            // setUsers(prev => prev.map(u => u.id === id ? savedUser : u));
        } catch (err) {
            console.error('Error updating user:', err);
            throw err;
        }
    };

    const deleteUser = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete user');

            // setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err) {
            console.error('Error deleting user:', err);
            throw err;
        }
    };


    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            loading,
            error, // Expose error state
            login,
            logout,
            users,
            addUser,
            updateUser,
            deleteUser,
            rolePermissions,
            updateRolePermissions
        }}>
            {children}
        </AuthContext.Provider>
    );
};
