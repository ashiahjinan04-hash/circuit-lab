import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { projectService } from "../services/projectService";
import { FiPlus, FiCpu, FiClock, FiTrash2 } from "react-icons/fi";

export default function ProjectsDashboard() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If user is logged in natively, fetch their projects
        if (user && token) {
            fetchProjects();
        } else if (user === null && token === null) {
            // Not logged in, stop loading
            setLoading(false);
        }
        // If token exists but user is null, AuthContext is still fetching profile, wait.
    }, [user, token]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await projectService.getProjects(token);
            setProjects(data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, projectId) => {
        e.stopPropagation(); // prevent navigation
        if (!window.confirm("Are you sure you want to delete this circuit?")) return;

        try {
            await projectService.deleteProject(token, projectId);
            setProjects(prev => prev.filter(p => p.id !== projectId));
        } catch (error) {
            console.error("Failed to delete project:", error);
            alert("Failed to delete project.");
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="min-h-screen bg-[#031327] text-white flex flex-col pt-16">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 py-12 max-w-6xl">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                    Circuit Dashboard
                </h1>
                <p className="text-slate-400 mb-10">Manage your digital logic circuits and projects.</p>

                {/* Start a New Circuit Section */}
                <section className="mb-14">
                    <h2 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-2">
                        Start a new circuit
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Blank Circuit Template card */}
                        <div
                            onClick={() => navigate('/build')}
                            className="bg-[#0a1a2f] border border-cyan-500/20 rounded-xl overflow-hidden hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all cursor-pointer group flex flex-col h-full"
                        >
                            <div className="h-32 bg-[#051a30] relative flex items-center justify-center overflow-hidden border-b border-cyan-500/20 group-hover:bg-[#082240] transition-colors">
                                {/* Circuit board pattern background purely stylistic */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>

                                <div className="w-12 h-12 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] z-10 transform group-hover:scale-110 transition-transform">
                                    <FiPlus size={24} />
                                </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-center">
                                <h3 className="font-semibold text-cyan-50 text-base mb-1">Create New Circuit</h3>
                                <p className="text-xs text-slate-400">Start with a blank simulator</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent Circuits Section */}
                <section>
                    <h2 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-2 flex items-center gap-2">
                        <FiClock className="text-cyan-400" /> Recent circuits
                    </h2>

                    {!user ? (
                        <div className="bg-[#0a1a2f] border border-white/5 rounded-xl p-12 text-center">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                <FiCpu size={28} className="text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-300 mb-2">Sign in to save circuits</h3>
                            <p className="text-slate-500 mb-6 max-w-md mx-auto">Create an account or log in to save your digital logic designs to the cloud and access them anywhere.</p>
                            {/* Optional: Add login trigger here if desired */}
                        </div>
                    ) : loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="w-8 h-8 border-t-2 border-cyan-400 border-solid rounded-full animate-spin"></div>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="bg-[#0a1a2f] border border-white/5 rounded-xl p-12 text-center">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                                <span className="text-2xl text-cyan-400">!</span>
                            </div>
                            <h3 className="text-lg font-medium text-slate-200 mb-2">No circuits yet</h3>
                            <p className="text-slate-500">Create your first circuit to get started.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    onClick={() => navigate('/build', { state: { projectData: project } })}
                                    className="bg-[#0a1a2f] border border-white/10 rounded-xl overflow-hidden hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all cursor-pointer group flex flex-col h-full relative"
                                >
                                    <div className="h-28 bg-[#051a30] relative flex items-center justify-center border-b border-white/5 group-hover:bg-[#082240] transition-colors overflow-hidden">
                                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(6,182,212,0.3) 1px, transparent 0)', backgroundSize: '12px 12px' }}></div>
                                        <FiCpu size={32} className="text-cyan-500/50 z-10" />
                                    </div>

                                    <div className="p-4 flex-1">
                                        <h3 className="font-semibold text-slate-200 text-sm mb-1 truncate group-hover:text-cyan-300 transition-colors" title={project.project_name}>
                                            {project.project_name}
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Edited {formatDate(project.updated_at)}
                                        </p>
                                    </div>

                                    <button
                                        onClick={(e) => handleDelete(e, project.id)}
                                        className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-sm rounded text-slate-400 hover:text-red-400 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-500/30"
                                        title="Delete Circuit"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
