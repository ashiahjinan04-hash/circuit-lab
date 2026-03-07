import React, { useState } from 'react';
import { FiX, FiSave } from 'react-icons/fi';

export default function SaveProjectModal({ isOpen, onClose, onSave, isLoading, defaultName = "" }) {
    const [projectName, setProjectName] = useState(defaultName);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!projectName.trim()) return;
        onSave(projectName.trim());
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-md p-8 bg-[#0a1a2f] border border-cyan-500/30 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
                >
                    <FiX size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                    <FiSave className="text-cyan-400" /> Save Circuit
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Project Name</label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                            autoFocus
                            maxLength={50}
                            className="w-full bg-[#031327]/50 border border-slate-700 focus:border-cyan-500 rounded-lg px-4 py-2.5 text-white outline-none transition-all placeholder-slate-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                            placeholder="e.g. 4-bit Adder"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !projectName.trim()}
                            className="px-6 py-2.5 rounded-lg font-medium bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : "Save Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
