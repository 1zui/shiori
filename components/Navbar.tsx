"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Kiri: Logo & Menu */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-black tracking-wider text-orange-600 dark:text-orange-500">
              SHIORI
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400">Browse</Link>
              <Link href="/profile" className="text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400">My Library</Link>
            </div>
          </div>

          {/* Kanan: Theme Toggle & Login */}
          <div className="hidden md:flex items-center gap-4">
            {/* Tombol Ganti Tema */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            
            <Link href="/login" className="text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-md transition-colors">
              Sign In
            </Link>
          </div>

          {/* Mobile Button Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 dark:text-slate-400 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 flex flex-col gap-2 text-sm font-medium">
          <Link href="/" onClick={() => setIsOpen(false)} className="py-2 text-slate-700 dark:text-slate-300">Browse</Link>
          <Link href="/profile" onClick={() => setIsOpen(false)} className="py-2 text-slate-700 dark:text-slate-300">My Library</Link>
          <Link href="/login" onClick={() => setIsOpen(false)} className="bg-orange-600 text-white px-4 py-2 rounded-md text-center mt-2">Sign In</Link>
        </div>
      )}
    </nav>
  );
}