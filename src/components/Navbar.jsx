import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${scrolled ? "nav-glass backdrop-blur-sm" : "bg-transparent"} fixed top-0 left-0 right-0 z-40 transition-colors duration-300`}> 
      <div className="container mx-auto px-6 py-3 flex items-center justify-between container-max">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Circuit Lab" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          <span className="text-sm font-semibold text-cyan-200">Circuit Lab</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-slate-200">
          <a className="hover:underline cursor-pointer">Circuit Guides</a>
          <a className="hover:underline cursor-pointer">Build Circuit</a>
          <a className="hover:underline cursor-pointer">About</a>
        </nav>

        <div className="hidden md:flex gap-3">
          <button className="py-2 px-4 rounded-md btn-neon text-white text-sm">Get Connected</button>
        </div>

        {/* mobile menu placeholder */}
        <div className="md:hidden">
          <button className="p-2 rounded-md border border-white/6">☰</button>
        </div>
      </div>
    </header>
  );
}
