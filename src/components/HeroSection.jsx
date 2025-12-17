import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero-illustration.png";

export default function HeroSection() {
  return (
    <section className="pt-24 pb-24">
      <div className="container mx-auto px-2 container-max">
        <div className="relative hero-bg rounded-2xl overflow-hidden glass pt-6 pb-4 px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Content */}
          <div className="space-y-6 max-w-xl">
            <div className="badge-glow">
              <span className="text-xs font-medium">Virtual Electronics Platform</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-100">
              <span className="neon-text">Circuit Lab:</span>
              <br />
              <span className="text-slate-200">
                Your Virtual <span className="neon-text">Electronics Workbench</span>
              </span>
            </h1>

            <p className="text-slate-300 leading-relaxed">
              Circuit Lab is the ultimate virtual trainer kit for engineering students, hobbyists, and electronics enthusiasts.
              Seamlessly design, build, and experiment with digital and analog circuits without the cost or risk of hardware failure.
              Drag-and-drop components, connect switches and bulbs, and instantly observe circuit behavior.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 items-center mt-2">
              
              {/* Start Building Circuit Button - Updated to Link */}
              <Link
                to="/build"
                className="btn-neon text-white px-5 py-3 rounded-lg font-medium shadow-lg hover:scale-[1.02] transition transform"
              >
                Start Building Circuit →
              </Link>

              <button className="btn-outline glass text-slate-200 px-4 py-3 rounded-lg flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-90">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M7 9h10" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                Circuit Guides
              </button>
            </div>

            <div className="text-xs text-slate-400 mt-4">
              Free to use • No installs • Works in-browser
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex justify-end">
            <div className="w-[360px] md:w-[460px] lg:w-[520px] pointer-events-none">
              <img
                src={heroImg}
                alt="Circuit Lab illustration"
                className="hero-illustration drop-shadow-2xl"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>

          {/* Top Center Badge */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6">
            <div className="w-14 h-6 rounded-full flex items-center justify-center glass text-xs text-slate-200">
              New
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
