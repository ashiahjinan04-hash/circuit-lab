import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiSettings } from 'react-icons/fi';

export default function ProfileDropdown() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    const handleProfileClick = () => {
        setIsOpen(false);
        navigate('/profile');
    };

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 border-2 border-cyan-500/50 hover:border-cyan-400 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)] overflow-hidden"
            >
                <span className="text-cyan-200 font-bold text-lg">
                    {user.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-xl bg-[#0a1a2f]/95 backdrop-blur-md border border-cyan-500/30 shadow-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                        <p className="text-sm text-cyan-200 font-medium truncate">{user.name || "User"}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{user.email || ""}</p>
                    </div>

                    <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 hover:text-cyan-300 transition-colors flex items-center gap-2"
                    >
                        <FiUser className="opacity-70" /> Profile
                    </button>

                    <button
                        onClick={() => { setIsOpen(false); navigate('/dashboard'); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 hover:text-cyan-300 transition-colors flex items-center gap-2"
                    >
                        <FiSettings className="opacity-70" /> My Projects
                    </button>

                    <div className="h-px bg-white/5 my-1" />

                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors flex items-center gap-2"
                    >
                        <FiLogOut className="opacity-70" /> Logout
                    </button>
                </div>
            )}
        </div>
    );
}
