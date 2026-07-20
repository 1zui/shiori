// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d] flex flex-col items-center justify-center p-4 transition-colors duration-200 select-none">
      <div className="w-full max-w-md bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-none text-center space-y-6">
        {/* GRAPHIC / BADGE 404 */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          {/* Subtle Outer Ping */}
          <div className="absolute inset-0 rounded-full bg-orange-500/10 dark:bg-orange-500/5 animate-ping" />

          {/* Container Icon / Text 404 */}
          <div className="w-full h-full rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center shadow-inner">
            <span className="text-3xl font-black tracking-tighter text-orange-500">
              404
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-zinc-500 uppercase -mt-1">
              NOT FOUND
            </span>
          </div>
        </div>

        {/* HEADER & DESCRIPTION */}
        <div className="space-y-2">
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Maaf, komik atau halaman yang Anda cari tidak ada, telah dihapus,
            atau tautan URL yang Anda tuju salah.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-orange-500/20 active:scale-95 cursor-pointer text-center"
          >
            Ke Beranda
          </Link>

          <Link
            href="/explore"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer text-center"
          >
            Jelajahi Manga
          </Link>
        </div>
      </div>
    </div>
  );
}
