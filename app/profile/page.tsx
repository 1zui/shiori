// app/profile/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import EditableAvatar from "./EditableAvatar";
import DeleteAccountButton from "./DeleteAccountButton";
import LogoutButton from "./LogoutButton"; // 🎯 1. IMPOR LOGOUT BUTTON BARU

interface AuthenticatedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as AuthenticatedUser | undefined;
  const userId = user?.id;

  if (!userId) {
    redirect("/login");
  }

  const [userDb, totalBookmarks, totalHistory] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true, avatar: true },
    }),
    prisma.bookmark.count({
      where: { userId },
    }),
    prisma.history.count({
      where: { userId },
    }),
  ]);

  const joinDate = userDb?.createdAt
    ? new Date(userDb.createdAt).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "SH";

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d] text-slate-900 dark:text-slate-100 transition-colors duration-200 p-4 md:p-8 lg:p-12">
      <div className="max-w-[1000px] mx-auto space-y-8">
        {/* TOP HEADER NAV */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              USER PROFILE
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5 font-semibold">
              Shiori Manga Management
            </p>
          </div>
          <Link
            href="/library"
            className="text-xs font-bold bg-white dark:bg-[#181818] border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 px-4 py-2 rounded-xl transition-colors shadow-sm dark:shadow-none"
          >
            ← Pustaka Saya
          </Link>
        </div>

        {/* HERO AVATAR PANEL */}
        <div className="w-full bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-transparent rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 via-transparent to-transparent pointer-events-none" />

          <EditableAvatar
            initialImage={userDb?.avatar || user?.image}
            initials={userInitials}
          />

          <div className="flex-1 text-center sm:text-left space-y-1 z-10">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {user?.name || "Pembaca Setia"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {user?.email}
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-bold bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg">
                Anggota Sejak: {joinDate}
              </span>
            </div>
          </div>
        </div>

        {/* QUICK METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-transparent p-5 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Total Favorit
              </h3>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {totalBookmarks}{" "}
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Judul
                </span>
              </p>
            </div>
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-500 dark:text-orange-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-transparent p-5 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Manga Dibaca
              </h3>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {totalHistory}{" "}
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Judul
                </span>
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ACCOUNT SETTINGS DETAILS */}
        <div className="bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-transparent rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
          <div className="p-4 bg-slate-100/60 dark:bg-zinc-900/40 border-b border-slate-200 dark:border-zinc-800">
            <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Detail Data Akun
            </h3>
          </div>
          <div className="text-xs">
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-bold text-slate-600 dark:text-slate-400">
                User ID Database
              </span>
              <span className="font-mono text-slate-500 dark:text-slate-400 select-all tracking-wide text-[11px]">
                {userId}
              </span>
            </div>
          </div>
        </div>

        {/* SYSTEM CONTROL BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-2">
          <DeleteAccountButton />

          {/* 🎯 2. MENGGUNAKAN LOGOUT BUTTON LANGSUNG (TANPA REDIRECT KE HALAMAN NEXTAUTH) */}
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
