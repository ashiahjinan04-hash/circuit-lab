import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, openLogin, openSignup } = useAuth();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${scrolled ? "nav-glass backdrop-blur-sm shadow-lg shadow-cyan-500/10" : "bg-transparent"} fixed top-0 left-0 right-0 z-40 transition-colors duration-300`}>
      <div className="container mx-auto px-6 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Circuit Lab" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
          <span className="text-sm font-semibold text-cyan-200">Circuit Lab</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-slate-200">
          <a className="hover:underline cursor-pointer">Circuit Guides</a>
          <Link to="/dashboard" className="hover:underline cursor-pointer">Build Circuit</Link>
          <a className="hover:underline cursor-pointer">About</a>
          <a className="hover:underline cursor-pointer">Contact</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <ProfileDropdown />
          ) : (
            <>
              <button onClick={openLogin} className="text-slate-200 hover:text-white hover:underline text-sm font-medium transition-colors">Login</button>
              <button onClick={openSignup} className="py-2 px-4 rounded-md btn-neon text-white text-sm font-medium whitespace-nowrap">Sign Up</button>
            </>
          )}
        </div>

        {/* mobile menu placeholder */}
        <div className="md:hidden">
          <button className="p-2 rounded-md border border-white/6">☰</button>
        </div>
      </div>
    </header>
  );
}
