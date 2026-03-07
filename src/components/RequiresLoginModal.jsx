import React from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function RequiresLoginModal({ isOpen, onClose }) {
    const { openLogin } = useAuth();

    if (!isOpen) return null;

    const handleLoginClick = () => {
        onClose();
        openLogin();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-sm p-8 bg-[#0a1a2f] border border-cyan-500/30 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden text-center">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
                >
                    <FiX size={24} />
                </button>

                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                    <FiAlertCircle size={32} className="text-cyan-400" />
                </div>

                <h2 className="text-xl font-bold mb-2 text-white">Login Required</h2>

                <p className="text-slate-400 text-sm mb-8">
                    You must be logged in to save your circuit progress. Create an account or log in to sync your work to the cloud.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleLoginClick}
                        className="w-full py-2.5 rounded-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                    >
                        Log In / Sign Up
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    );
}
