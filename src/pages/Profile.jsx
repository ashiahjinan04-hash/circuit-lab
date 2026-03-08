import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    // Initialize state when user loads
    React.useEffect(() => {
        if (user) setNewName(user.name || "");
    }, [user]);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError("");
            await updateProfile(newName);
            setIsEditing(false);
        } catch (err) {
            setError(err.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#031327] text-white flex flex-col pt-20">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
                        <button onClick={() => navigate("/")} className="text-cyan-400 hover:underline">Return Home</button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#031327] text-white flex flex-col pt-20">
            <Navbar />

            <div className="flex-1 container mx-auto max-w-4xl px-6 py-12">
                <div className="mb-6 flex items-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/30 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-cyan-500/30"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Go Back to Projects Dashboard
                    </button>
                </div>

                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
                    Your Profile
                </h1>

                <div className="bg-[#0a1a2f] border border-cyan-500/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative">
                    {/* Error Message */}
                    {error && (
                        <div className="absolute top-4 right-4 bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
                        <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-cyan-500/50 flex items-center justify-center text-4xl font-bold text-cyan-200">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-white">{user.name || "User"}</h2>
                            <p className="text-slate-400">{user.email || ""}</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-medium text-cyan-200">Account Details</h3>
                        </div>
                        <div className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={isEditing ? newName : (user.name || "")}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className={`w-full bg-[#031327]/50 border rounded-lg px-4 py-2 text-white outline-none transition-all ${
                                        isEditing 
                                        ? "border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.15)] focus:ring-1 focus:ring-cyan-500" 
                                        : "border-slate-700 opacity-80 cursor-default"
                                    }`}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Email <span className="text-xs text-slate-500 font-normal">(cannot be changed)</span></label>
                                <input
                                    type="email"
                                    defaultValue={user.email || ""}
                                    className="w-full bg-[#031327]/50 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none cursor-not-allowed opacity-60"
                                    disabled
                                />
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving || !newName.trim()}
                                            className="px-6 py-2 rounded-lg font-medium bg-cyan-600 hover:bg-cyan-500 text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isSaving && (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            )}
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setNewName(user.name || "");
                                                setError("");
                                            }}
                                            disabled={isSaving}
                                            className="px-6 py-2 rounded-lg font-medium border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2 rounded-lg font-medium border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
