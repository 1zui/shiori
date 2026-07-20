"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  UserCheck,
  PartyPopper,
} from "lucide-react";

export default function WelcomeModal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 💡 Cek parameter welcome (bisa 'signin' atau 'signup')
  const welcomeType = searchParams.get("welcome"); // "signin" | "signup" | null
  const isOpen = Boolean(welcomeType);
  const isNewMember = welcomeType === "signup";

  const handleAccept = () => {
    // Hapus parameter query dari URL tanpa reload
    router.replace("/", { scroll: false });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Container Card Modal */}
      <div className="w-full max-w-sm bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden animate-scaleUp">
        {/* Glow Ambient Effects */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* ─── CHIBI MASCOT PARTY STATE SVG ─── */}
        <div className="flex justify-center mb-3">
          <div className="w-28 h-28 relative">
            <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
              {/* Topi Pesta */}
              <polygon points="60,5 45,35 75,35" fill="#facc15" />
              <circle cx="60" cy="5" r="4" fill="#ea580c" />
              <line
                x1="48"
                y1="28"
                x2="72"
                y2="28"
                stroke="#ea580c"
                strokeWidth="2"
              />

              {/* Telinga Rubah */}
              <path d="M 25 45 L 10 15 L 45 30 Z" fill="#ea580c" />
              <path d="M 28 40 L 18 20 L 42 30 Z" fill="#ffedd5" />
              <path d="M 95 45 L 110 15 L 75 30 Z" fill="#ea580c" />
              <path d="M 92 40 L 102 20 L 78 30 Z" fill="#ffedd5" />

              {/* Kepala Mascot */}
              <circle cx="60" cy="60" r="40" fill="#ea580c" />
              <ellipse cx="60" cy="72" rx="30" ry="20" fill="#fff" />
              <polygon points="56,62 64,62 60,67" fill="#1e293b" />

              {/* Blushing Pipi */}
              <ellipse
                cx="38"
                cy="68"
                rx="6"
                ry="4"
                fill="#fda4af"
                opacity="0.8"
              />
              <ellipse
                cx="82"
                cy="68"
                rx="6"
                ry="4"
                fill="#fda4af"
                opacity="0.8"
              />

              {/* Mata Happy (^ ^) */}
              <g
                stroke="#1e293b"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              >
                <path d="M 36 56 Q 43 46 50 56" />
                <path d="M 70 56 Q 77 46 84 56" />
              </g>

              {/* Mulut Ketawa Lebar */}
              <path d="M 52 70 Q 60 82 68 70 Z" fill="#1e293b" />

              {/* Kedua Tangan Diangkat Gembira */}
              <g transform="translate(0, -15)">
                <ellipse
                  cx="28"
                  cy="85"
                  rx="10"
                  ry="13"
                  fill="#ea580c"
                  transform="rotate(-20 28 85)"
                />
                <ellipse
                  cx="28"
                  cy="85"
                  rx="6"
                  ry="8"
                  fill="#fff"
                  transform="rotate(-20 28 85)"
                />
                <ellipse
                  cx="92"
                  cy="85"
                  rx="10"
                  ry="13"
                  fill="#ea580c"
                  transform="rotate(20 92 85)"
                />
                <ellipse
                  cx="92"
                  cy="85"
                  rx="6"
                  ry="8"
                  fill="#fff"
                  transform="rotate(20 92 85)"
                />
              </g>

              {/* Confetti & Bintang */}
              <circle cx="20" cy="25" r="2" fill="#38bdf8" />
              <circle cx="100" cy="25" r="2.5" fill="#f43f5e" />
              <path
                d="M 15 60 L 17 63 L 20 63 L 18 65 L 19 68 L 15 66 L 11 68 L 12 65 L 10 63 L 13 63 Z"
                fill="#facc15"
              />
              <path
                d="M 105 60 L 107 63 L 110 63 L 108 65 L 109 68 L 105 66 L 101 68 L 102 65 L 100 63 L 103 63 Z"
                fill="#facc15"
              />
            </svg>
          </div>
        </div>

        {/* ─── DINAMIS: BADGE & HEADER TEKS ─── */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-[11px] font-bold">
            {isNewMember ? (
              <>
                <PartyPopper className="w-3.5 h-3.5" />
                <span>New Member Joined</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Welcome Back</span>
              </>
            )}
          </div>

          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wide">
            {isNewMember ? (
              <>
                Selamat Bergabung di{" "}
                <span className="text-orange-500">SHIORI</span>!
              </>
            ) : (
              <>
                Selamat Datang Kembali di{" "}
                <span className="text-orange-500">SHIORI</span>!
              </>
            )}
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {isNewMember
              ? "Terima kasih sudah mendaftar! Akun barumu siap digunakan untuk bookmark komik dan simpan riwayat bacaan."
              : "Senang melihatmu lagi! Bookmark dan riwayat baca favoritmu sudah disinkronkan."}
          </p>
        </div>

        {/* Highlights Fitur */}
        <div className="grid grid-cols-2 gap-2 mb-6 text-left text-[11px] bg-slate-50 dark:bg-[#181818] p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>Auto Bookmark</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>Riwayat Baca</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>Bebas Iklan</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>Rekomendasi</span>
          </div>
        </div>

        {/* Accept Button */}
        <button
          onClick={handleAccept}
          className="w-full bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>
            {isNewMember ? "Mulai Jelajahi Komik" : "Terima & Lanjut Membaca"}
          </span>
        </button>
      </div>
    </div>
  );
}
