"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // States untuk Interaksi Mascot & Animasi
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Status IDLE: Form masih kosong & tidak ada yang difokuskan
  const isIdle =
    !email &&
    !password &&
    !isEmailFocused &&
    !isPasswordFocused &&
    !isSuccess &&
    !error;

  // Perhitungan tracking bola mata mascot mengikuti panjang teks email
  const eyeXOffset = Math.min(Math.max((email.length - 12) * 0.4, -5), 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email atau password salah.");
      setLoading(false);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } else {
      setIsSuccess(true);
      setLoading(false);

      // Delay 1.5 detik untuk animasi selebrasi sebelum redirect ke homepage + modal welcome
      setTimeout(() => {
        router.push("/?welcome=signin");
        router.refresh();
      }, 1500);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50 dark:bg-[#0d0d0d] transition-colors duration-200">
      {/* Keyframe untuk Animasi Melambai (Dada-dada) */}
      <style>{`
        @keyframes wavePaw {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-22px) rotate(15deg); }
        }
        .animate-wave {
          animation: wavePaw 1.2s infinite ease-in-out;
          transform-origin: 88px 98px;
        }
      `}</style>

      {/* CARD CONTAINER */}
      <div
        className={`w-full max-w-md bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-800/80 p-8 rounded-3xl shadow-xl dark:shadow-2xl space-y-6 relative overflow-hidden transition-transform duration-300 ${
          isShaking ? "animate-bounce border-red-500/50" : ""
        } ${isSuccess ? "border-emerald-500/50" : ""}`}
      >
        {/* Glow Effect Background */}
        <div
          className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
            isSuccess
              ? "bg-emerald-500/25"
              : error
                ? "bg-red-500/20"
                : "bg-orange-500/15"
          }`}
        />

        {/* ─── CHIBI MASCOT SVG ─── */}
        <div className="flex justify-center -mb-2">
          <div className="w-28 h-28 relative">
            <svg
              viewBox="0 0 120 120"
              className={`w-full h-full drop-shadow-md transition-all duration-300 ${
                isSuccess ? "scale-110 -translate-y-1" : ""
              }`}
            >
              {/* Telinga Rubah */}
              <path d="M 25 45 L 10 15 L 45 30 Z" fill="#ea580c" />
              <path d="M 28 40 L 18 20 L 42 30 Z" fill="#ffedd5" />
              <path d="M 95 45 L 110 15 L 75 30 Z" fill="#ea580c" />
              <path d="M 92 40 L 102 20 L 78 30 Z" fill="#ffedd5" />

              {/* Kepala Mascot */}
              <circle cx="60" cy="60" r="40" fill="#ea580c" />
              {/* Pipi / Muka Bawah */}
              <ellipse cx="60" cy="72" rx="30" ry="20" fill="#fff" />

              {/* Hidung */}
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

              {/* Sparkles saat Sukses */}
              {isSuccess && (
                <g fill="#facc15" className="animate-pulse">
                  <path d="M 15 35 L 17 40 L 22 40 L 18 43 L 20 48 L 15 45 L 10 48 L 12 43 L 8 40 L 13 40 Z" />
                  <path d="M 105 35 L 107 40 L 112 40 L 108 43 L 110 48 L 105 45 L 100 48 L 102 43 L 98 40 L 103 40 Z" />
                </g>
              )}

              {/* ─── KONDISI MATA MASCOT ─── */}
              {isSuccess ? (
                /* Mata Happy (^ ^) */
                <g
                  stroke="#1e293b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                >
                  <path d="M 36 56 Q 43 46 50 56" />
                  <path d="M 70 56 Q 77 46 84 56" />
                </g>
              ) : error ? (
                /* Mata Error / Pusing (X X) */
                <g stroke="#1e293b" strokeWidth="3" strokeLinecap="round">
                  <line x1="38" y1="50" x2="48" y2="60" />
                  <line x1="48" y1="50" x2="38" y2="60" />
                  <line x1="72" y1="50" x2="82" y2="60" />
                  <line x1="82" y1="50" x2="72" y2="60" />
                  <path
                    d="M 92 42 Q 97 48 92 53 Q 87 48 92 42"
                    fill="#38bdf8"
                    stroke="none"
                  />
                </g>
              ) : isPasswordFocused && !showPassword ? (
                /* Mata Tutup (> <) Saat Ketik Password */
                <g
                  stroke="#1e293b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                >
                  <path d="M 38 52 L 48 57 L 38 62" />
                  <path d="M 82 52 L 72 57 L 82 62" />
                </g>
              ) : isPasswordFocused && showPassword ? (
                /* Mata Mengintip saat Show Password */
                <g fill="#1e293b">
                  <circle cx="43" cy="55" r="4" />
                  <circle cx="77" cy="55" r="4" />
                  <circle cx="44" cy="53" r="1.5" fill="#fff" />
                  <circle cx="78" cy="53" r="1.5" fill="#fff" />
                </g>
              ) : (
                /* Mata Normal / Tracking Email */
                <g fill="#1e293b">
                  <ellipse
                    cx={43 + (isEmailFocused ? eyeXOffset : 0)}
                    cy="55"
                    rx="5"
                    ry="6"
                  />
                  <ellipse
                    cx={77 + (isEmailFocused ? eyeXOffset : 0)}
                    cy="55"
                    rx="5"
                    ry="6"
                  />
                  <circle
                    cx={41 + (isEmailFocused ? eyeXOffset : 0)}
                    cy="53"
                    r="2"
                    fill="#fff"
                  />
                  <circle
                    cx={75 + (isEmailFocused ? eyeXOffset : 0)}
                    cy="53"
                    r="2"
                    fill="#fff"
                  />
                </g>
              )}

              {/* ─── KONDISI MULUT ─── */}
              {isSuccess ? (
                <path d="M 52 70 Q 60 82 68 70 Z" fill="#1e293b" />
              ) : error ? (
                <path
                  d="M 54 76 Q 60 70 66 76"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M 54 73 Q 60 78 66 73"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}

              {/* ─── TANGAN KIRI ─── */}
              <g
                className="transition-all duration-300 ease-out"
                style={{
                  transform: isSuccess
                    ? "translateY(5px)"
                    : isPasswordFocused
                      ? showPassword
                        ? "translateY(-18px)"
                        : "translateY(-34px)"
                      : "translateY(0px)",
                }}
              >
                <ellipse cx="32" cy="98" rx="11" ry="14" fill="#ea580c" />
                <ellipse cx="32" cy="98" rx="7" ry="9" fill="#fff" />
              </g>

              {/* ─── TANGAN KANAN (ANIMASI MELAMBAI SAAT IS_IDLE) ─── */}
              <g
                className={`transition-all duration-300 ease-out ${
                  isIdle ? "animate-wave" : ""
                }`}
                style={{
                  transform: !isIdle
                    ? isSuccess
                      ? "translateY(5px)"
                      : isPasswordFocused
                        ? showPassword
                          ? "translateY(-18px)"
                          : "translateY(-34px)"
                        : "translateY(0px)"
                    : undefined,
                }}
              >
                <ellipse cx="88" cy="98" rx="11" ry="14" fill="#ea580c" />
                <ellipse cx="88" cy="98" rx="7" ry="9" fill="#fff" />
              </g>
            </svg>
          </div>
        </div>

        {/* HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black tracking-wider text-slate-900 dark:text-white uppercase">
            SHI<span className="text-orange-500">ORI</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isSuccess
              ? "Login berhasil! Menyiapkan perpustakaanmu..."
              : isIdle
                ? "Halo! Isi email & password di bawah ya 👋"
                : "Masuk untuk melanjutkan membaca komik favoritmu"}
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center animate-fadeIn">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              required
              disabled={isSuccess || loading}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              placeholder="youremail@example.com"
              className="w-full bg-slate-100 dark:bg-[#181818] border border-slate-200 dark:border-slate-800 focus:border-orange-500 dark:focus:border-orange-500 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all disabled:opacity-60"
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Password
            </label>

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={isSuccess || loading}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                placeholder="••••••••"
                className="w-full bg-slate-100 dark:bg-[#181818] border border-slate-200 dark:border-slate-800 focus:border-orange-500 rounded-xl pl-4 pr-10 py-3 text-xs text-slate-900 dark:text-white outline-none transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden disabled:opacity-60"
              />

              <button
                type="button"
                disabled={isSuccess || loading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-10"
                title={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12c1.274 4.057 5.065 7 9.542 7 4.477 0 8.268-2.943 9.542-7-1.274-4.057-5.064-7-9.542-7-4.477 0-8.268 2.943-9.542 7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading || isSuccess}
            className={`w-full font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-90 mt-2 ${
              isSuccess
                ? "bg-emerald-600 text-white shadow-emerald-500/20"
                : "bg-orange-600 hover:bg-orange-700 text-white"
            }`}
          >
            {isSuccess
              ? "Berhasil! Mengalihkan... 🎉"
              : loading
                ? "Memproses..."
                : "Masuk Akun"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Belum punya akun?{" "}
          <Link
            href="/signup"
            className="text-orange-500 font-bold hover:underline"
          >
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
