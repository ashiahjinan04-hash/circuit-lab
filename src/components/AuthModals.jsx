import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiX } from 'react-icons/fi';

export default function AuthModals() {
    const { isLoginModalOpen, isSignupModalOpen, closeModals, openLogin, openSignup, login, signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isLoginModalOpen && !isSignupModalOpen) return null;

    const isLogin = isLoginModalOpen;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(name, email, password);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setError('');
        if (isLogin) {
            openSignup();
        } else {
            openLogin();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md p-8 bg-[#0a1a2f] border border-cyan-500/30 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden">

                {/* Glow Effects */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

                <button
                    onClick={closeModals}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
                >
                    <FiX size={24} />
                </button>

                <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                {error && (
                    <div className="mb-6 p-3 rounded bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-cyan-200/70 mb-1 ml-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                                className="w-full bg-[#031327]/50 border border-slate-700 focus:border-cyan-500 rounded-lg px-4 py-2.5 text-white outline-none transition-all placeholder-slate-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-cyan-200/70 mb-1 ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-[#031327]/50 border border-slate-700 focus:border-cyan-500 rounded-lg px-4 py-2.5 text-white outline-none transition-all placeholder-slate-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-cyan-200/70 mb-1 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-[#031327]/50 border border-slate-700 focus:border-cyan-500 rounded-lg px-4 py-2.5 text-white outline-none transition-all placeholder-slate-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-400 text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={toggleMode}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium transition-colors ml-1"
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
    );
}
