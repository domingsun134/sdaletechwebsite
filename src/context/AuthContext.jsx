import React, { createContext, useState, useContext, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";

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

    // Fetch users from backend on mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
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

    // Validate session on mount or when users change (Local Auth)
    useEffect(() => {
        if (user && !loading && !isAuthenticatedMsal) {
            // Only validate against local users if not logged in via MSAL
            const userExists = users.find(u => u.username === user.username);
            if (!userExists) {
                // User no longer exists in the database, force logout (only if distinct from MSAL user)
                // Note: MSAL user won't be in local DB likely, so we skip this check for them
                if (!user.homeAccountId) { // Simple check if it's an MSAL account object
                    logout();
                }
            }
        }
    }, [users, user, loading, isAuthenticatedMsal]);

    // Sync MSAL Auth
    useEffect(() => {
        // Wait for users to be loaded before checking auth
        if (loading) return;

        if (isAuthenticatedMsal && accounts.length > 0) {
            const msalAccount = accounts[0];
            const email = msalAccount.username;

            const dbUser = users.find(u =>
                u.azure_oid === msalAccount.homeAccountId ||
                u.username.toLowerCase() === email.toLowerCase() ||
                u.email?.toLowerCase() === email.toLowerCase()
            );

            if (dbUser) {
                setUser({
                    ...dbUser,
                    homeAccountId: msalAccount.homeAccountId
                });
                setError(null); // Clear any previous login error
            } else {
                // User not found in DB - Deny Access
                console.warn('Unauthorized Entra login attempt:', email);
                setUser(null); // Ensure user is null if not found in DB
                setError('You do not have permission to access the admin portal. Please contact an administrator.');

                // Optional: Logout of MSAL context to prevent auto-login loop on refresh?
                // If we don't logout, this effect runs again. 
                // But we set User(null), so app stays on Login.
                // However, isAuthenticatedMsal is still true.
                // So this effect will keep hitting "else" and setting error. That's acceptable.
            }
        }
    }, [isAuthenticatedMsal, accounts, users, loading]);

    // Role Permissions Management
    const defaultPermissions = {
        admin: ['/admin/dashboard', '/admin/content', '/admin/analytics', '/admin/jobs', '/admin/users', '/admin/events'],
        marketing: ['/admin/dashboard', '/admin/content', '/admin/analytics', '/admin/events'],
        hr: ['/admin/dashboard', '/admin/content', '/admin/jobs', '/admin/events']
    };

    const [rolePermissions, setRolePermissions] = useState(() => {
        const savedPermissions = localStorage.getItem('rolePermissions');
        return savedPermissions ? JSON.parse(savedPermissions) : defaultPermissions;
    });

    useEffect(() => {
        localStorage.setItem('rolePermissions', JSON.stringify(rolePermissions));
    }, [rolePermissions]);

    const updateRolePermissions = (role, permissions) => {
        setRolePermissions(prev => ({
            ...prev,
            [role]: permissions
        }));
    };

    const login = (username, password) => {
        const foundUser = users.find(u => u.username === username);
        if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
            // Don't store password in session
            const { password, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            localStorage.setItem('isAuthenticated', 'true'); // Keep for backward compatibility if needed
            setError(null); // Clear any previous login error
            return true;
        }
        setError('Invalid username or password.'); // Set error for local login failure
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        setError(null); // Clear error on logout
        if (isAuthenticatedMsal) {
            instance.logoutRedirect();
        }
    };

    // User Management Functions
    const addUser = async (newUser) => {
        try {
            // Hash the password only if it exists (local users)
            let userToSend = { ...newUser };
            if (newUser.password) {
                const hashedPassword = bcrypt.hashSync(newUser.password, 10);
                userToSend.password = hashedPassword;
            }

            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userToSend)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add user');
            }

            const createdUser = await response.json();
            setUsers(prev => [...prev, createdUser]);
            return true;
        } catch (err) {
            console.error('Error adding user:', err);
            throw err;
        }
    };

    const updateUser = async (id, updatedData) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error('Failed to update user');

            const savedUser = await response.json();
            setUsers(prev => prev.map(u => u.id === id ? savedUser : u));
        } catch (err) {
            console.error('Error updating user:', err);
            throw err;
        }
    };

    const deleteUser = async (id) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete user');

            setUsers(prev => prev.filter(u => u.id !== id));
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
