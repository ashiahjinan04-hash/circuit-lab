import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="absolute top-4 left-6 flex items-center gap-2">
      <img src={logo} alt="Circuit Lab Logo" className="w-10 drop-shadow-lg" />
      <h1 className="text-lg font-semibold text-cyan-300">Circuit Lab</h1>
    </Link>
  );
}
