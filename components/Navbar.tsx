"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

interface SearchPreviewItem {
  id: string;
  title: string;
  cover: string;
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [previews, setPreviews] = useState<SearchPreviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // Mencegah cascading render ESLint error
    const timer = setTimeout(() => {
      setMounted(true);
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get("q") || "");
    }, 0);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`,
        );
        if (!response.ok) throw new Error();

        const data = await response.json();
        setPreviews(data);
      } catch {
        setPreviews([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length >= 2) {
      setIsLoading(true);
      setShowDropdown(true);
    } else {
      setPreviews([]);
      setShowDropdown(false);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    router.push(`/?q=${encodeURIComponent(searchQuery)}`);
  };

  const cleanedName = session?.user?.name
    ? session.user.name.replace(/\\/g, "")
    : "";
  const userInitial = cleanedName ? cleanedName.charAt(0).toUpperCase() : "U";

  return (
    <nav className="bg-white dark:bg-[#0c0c0e] border-b border-slate-200 dark:border-neutral-900 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* LOGO & MENU NAVIGASI */}
          <div className="flex items-center gap-8 lg:gap-12 flex-shrink-0">
            <Link
              href="/"
              className="text-xl font-black tracking-widest text-slate-900 dark:text-white uppercase hover:scale-105 transition-transform"
            >
              SHI<span className="text-orange-500">ORI</span>
            </Link>

            <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold tracking-wide">
              <Link
                href="/"
                className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Popular
              </Link>
              <Link
                href="/manga"
                className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Manga
              </Link>
              <Link
                href="/manhwa"
                className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Manhwa
              </Link>
              <Link
                href="/manhua"
                className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Manhua
              </Link>
              <Link
                href="/explore"
                className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Explore
              </Link>
              <Link
                href={isLoggedIn ? "/library" : "/login"}
                className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                My Library
              </Link>
            </div>
          </div>

          {/* SEARCH INPUT & DROPDOWN */}
          <div
            ref={dropdownRef}
            className="hidden md:flex flex-1 max-w-md mx-4 relative"
          >
            <form onSubmit={handleSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() =>
                  searchQuery.trim().length >= 2 && setShowDropdown(true)
                }
                placeholder="Search all comics..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-850 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-all"
              />
              <div className="absolute left-3.5 top-2.5 text-slate-400 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.602z"
                  />
                </svg>
              </div>
            </form>

            {/* DROPDOWN PREVIEW */}
            {showDropdown && (
              <div className="absolute top-full left-0 w-full bg-white dark:bg-[#121215] border border-slate-200 dark:border-neutral-850 mt-2 rounded-xl shadow-xl overflow-hidden z-50">
                {isLoading ? (
                  <div className="p-4 text-xs text-center text-slate-400 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    Searching comic database...
                  </div>
                ) : previews.length === 0 ? (
                  <div className="p-4 text-xs text-center text-slate-400">
                    Komik tidak ditemukan, tekan Enter untuk cari global.
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {previews.map((item) => (
                      <Link
                        key={item.id}
                        href={`/manga/${item.id}`}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-neutral-950 border-b border-slate-100 dark:border-neutral-900 last:border-0 transition-colors group"
                      >
                        <div className="w-9 h-12 relative bg-slate-100 dark:bg-neutral-900 rounded overflow-hidden flex-shrink-0 border border-slate-200 dark:border-neutral-850">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.cover}
                            alt={item.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-2 group-hover:text-orange-500 transition-colors">
                          {item.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* THEME TOGGLE & AUTH BUTTON */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-all active:scale-95"
              aria-label="Toggle Theme"
            >
              {mounted && theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-amber-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.42 12.42l1.58 1.58M3 12h2.25m13.5 0H21M4.22 19.78l1.58-1.58M18.22 5.78l-1.58 1.58M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-slate-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.24a8.25 8.25 0 01-16.38 7.39 8.25 8.25 0 1011.38-11.38 8.25 8.25 0 015 3.99z"
                  />
                </svg>
              )}
            </button>

            {/* DESKTOP AUTH & PROFILE PANEL */}
            {mounted && isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  href="/profile"
                  className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 transition-all flex items-center gap-2 group"
                >
                  <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center text-[10px] font-black border border-slate-200 dark:border-zinc-700/60 shadow-sm relative overflow-hidden flex-shrink-0">
                    {session?.user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-orange-500">{userInitial}</span>
                    )}
                  </div>
                  <span className="max-w-[100px] line-clamp-1">
                    Hi,{" "}
                    <span className="text-orange-500 group-hover:underline decoration-orange-500/40">
                      {cleanedName}
                    </span>
                  </span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-xs font-bold bg-slate-100 dark:bg-neutral-950 hover:bg-red-500/10 hover:text-red-500 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-neutral-850 px-4 py-2 rounded-xl transition-all active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-block text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-xl transition-all shadow-md active:scale-95"
              >
                Sign In
              </Link>
            )}

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-slate-500 dark:text-slate-400 p-2"
              aria-label="Toggle Menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-[#0c0c0e] border-b border-slate-200 dark:border-neutral-900 px-6 pt-2 pb-6 flex flex-col gap-3 text-sm font-semibold">
          <form onSubmit={handleSubmit} className="w-full relative my-2">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search all comics..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-850 rounded-xl text-sm text-slate-900 dark:text-white"
            />
            <div className="absolute left-3.5 top-2.5 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.602z"
                />
              </svg>
            </div>
          </form>
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="py-1.5 text-slate-700 dark:text-slate-400 hover:text-orange-500"
          >
            Popular
          </Link>
          <Link
            href="/manga"
            onClick={() => setIsOpen(false)}
            className="py-1.5 text-slate-700 dark:text-slate-400 hover:text-orange-500"
          >
            Manga
          </Link>
          <Link
            href="/manhwa"
            onClick={() => setIsOpen(false)}
            className="py-1.5 text-slate-700 dark:text-slate-400 hover:text-orange-500"
          >
            Manhwa
          </Link>
          <Link
            href="/manhua"
            onClick={() => setIsOpen(false)}
            className="py-1.5 text-slate-700 dark:text-slate-400 hover:text-orange-500"
          >
            Manhua
          </Link>
          <Link
            href="/explore"
            onClick={() => setIsOpen(false)}
            className="py-1.5 text-slate-700 dark:text-slate-400 hover:text-orange-500"
          >
            Explore
          </Link>
          <Link
            href={isLoggedIn ? "/library" : "/login"}
            onClick={() => setIsOpen(false)}
            className="py-1.5 text-slate-700 dark:text-slate-400 hover:text-orange-500"
          >
            My Library
          </Link>

          {/* MOBILE AUTH PANEL */}
          {mounted && isLoggedIn ? (
            <>
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="py-2.5 border-t border-slate-200 dark:border-neutral-900 pt-3 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-3 hover:text-orange-500 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center text-[9px] font-black border border-slate-200 dark:border-zinc-700/60 shadow-sm relative overflow-hidden flex-shrink-0">
                  {session?.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-orange-500">{userInitial}</span>
                  )}
                </div>
                <span className="truncate">Profile Saya ({cleanedName})</span>
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-xl text-center mt-2 font-bold text-xs hover:bg-red-500/20 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-center mt-2 text-xs font-bold transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
