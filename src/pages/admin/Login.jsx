import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { Lock } from 'lucide-react';
import logo from '../../assets/logo.png';
import { useEffect } from 'react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // const [error, setError] = useState(''); // Consolidate to use context error
    const { login, isAuthenticated, error } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { instance } = useMsal();

    useEffect(() => {
        if (isAuthenticated) {
            const origin = location.state?.from?.pathname || '/admin/dashboard';
            const search = location.state?.from?.search || '';
            navigate(origin + search);
        }
    }, [isAuthenticated, navigate, location]);

    const handleMicrosoftLogin = () => {
        instance.loginPopup(loginRequest)
            .catch(e => {
                console.error(e);
                // setError(e.message); // Should handle via context or local if interaction fails
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(username, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-alt">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-100">
                <div className="text-center mb-8">
                    <img src={logo} alt="Sunningdale Tech" className="h-16 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-slate-900">Portal Management</h2>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="Enter password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleMicrosoftLogin}
                            className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                        >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 21 21">
                                <path fill="#f35325" d="M1 1h9v9H1z" />
                                <path fill="#81bc06" d="M11 1h9v9h-9z" />
                                <path fill="#05a6f0" d="M1 11h9v9H1z" />
                                <path fill="#ffba08" d="M11 11h9v9h-9z" />
                            </svg>
                            Sign in with Microsoft Entra ID
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Login;
