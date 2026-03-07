import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
    const { user } = useAuth();
    const navigate = useNavigate();

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
                        onClick={() => navigate('/build')}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/30 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-cyan-500/30"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Go Back to Circuit Builder
                    </button>
                </div>

                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
                    Your Profile
                </h1>

                <div className="bg-[#0a1a2f] border border-cyan-500/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
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
                        <h3 className="text-xl font-medium text-cyan-200 mb-4">Account Details</h3>
                        <div className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    defaultValue={user.name || ""}
                                    className="w-full bg-[#031327]/50 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.15)] transition-all"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    defaultValue={user.email || ""}
                                    className="w-full bg-[#031327]/50 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none cursor-not-allowed opacity-70"
                                    disabled
                                />
                            </div>
                            <button
                                className="mt-4 px-6 py-2 rounded-lg font-medium border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
