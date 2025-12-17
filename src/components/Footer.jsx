import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 py-8">
      <div className="container mx-auto px-6 text-slate-400 container-max">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm">© {new Date().getFullYear()} Circuit Lab · Made for learners</div>
          <div className="flex gap-4 mt-3 md:mt-0 text-sm">
            <a className="hover:underline cursor-pointer">Privacy</a>
            <a className="hover:underline cursor-pointer">Terms</a>
            <a className="hover:underline cursor-pointer">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
