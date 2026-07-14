"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Pastikan component sudah termuat di browser biar gak salah nampilin icon tema
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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
            
            {/* Tombol Ganti Tema Premium */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
              aria-label="Toggle Theme"
            >
              {mounted && theme === "dark" ? (
                // Icon Sun (Matahari)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.42 12.42l1.58 1.58M3 12h2.25m13.5 0H21M4.22 19.78l1.58-1.58M18.22 5.78l-1.58 1.58M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
                </svg>
              ) : (
                // Icon Moon (Bulan)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.24a8.25 8.25 0 01-16.38 7.39 8.25 8.25 0 1011.38-11.38 8.25 8.25 0 015 3.99z" />
                </svg>
              )}
            </button>
            
            <Link href="/login" className="text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-md transition-colors">
              Sign In
            </Link>
          </div>

          {/* Mobile Button Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400"
            >
              {mounted && theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.42 12.42l1.58 1.58M3 12h2.25m13.5 0H21M4.22 19.78l1.58-1.58M18.22 5.78l-1.58 1.58M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-700"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.24a8.25 8.25 0 01-16.38 7.39 8.25 8.25 0 1011.38-11.38 8.25 8.25 0 015 3.99z" /></svg>
              )}
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
          <Link href="/profile" onClick={() => setIsOpen(false)} className="py-2 text-slate-750 dark:text-slate-300">My Library</Link>
          <Link href="/login" onClick={() => setIsOpen(false)} className="bg-orange-600 text-white px-4 py-2 rounded-md text-center mt-2">Sign In</Link>
        </div>
      )}
    </nav>
  );
}