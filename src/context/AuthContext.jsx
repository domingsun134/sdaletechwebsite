import React, { createContext, useState, useContext, useEffect } from 'react';
import bcrypt from 'bcryptjs';

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

    // Fetch users from backend on mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users');
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

    // Validate session on mount or when users change
    useEffect(() => {
        if (user && !loading) {
            const userExists = users.find(u => u.username === user.username);
            if (!userExists) {
                // User no longer exists in the database, force logout
                logout();
            }
        }
    }, [users, user, loading]);

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
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
    };

    // User Management Functions
    const addUser = async (newUser) => {
        try {
            // Hash the password before sending to API (or API could do it, but let's keep it here for now as per previous logic)
            // Actually, usually backend hashes it. But to minimize backend logic change, we'll hash here.
            // Wait, if we send hashed password, backend just stores it.
            const hashedPassword = bcrypt.hashSync(newUser.password, 10);
            const userToSend = { ...newUser, password: hashedPassword };

            const response = await fetch('http://localhost:3000/api/users', {
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
            const response = await fetch(`http://localhost:3000/api/users/${id}`, {
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
            const response = await fetch(`http://localhost:3000/api/users/${id}`, {
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
