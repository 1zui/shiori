// app/profile/DeleteAccountButton.tsx
"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { deleteAccountAction } from "./actions";

export default function DeleteAccountButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg(null);

    try {
      const res = await deleteAccountAction();
      if (res.success) {
        // Otomatis bersihkan sesi NextAuth dan kembalikan ke beranda
        await signOut({ callbackUrl: "/" });
      } else {
        setErrorMsg(res.message);
        setIsDeleting(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan koneksi sistem.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Tombol Pemicu Utama */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/10 hover:bg-red-100 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl transition-colors text-center shadow-sm dark:shadow-none cursor-pointer active:scale-95"
      >
        Hapus Akun Permanen
      </button>

      {/* POP UP MODAL DIALOG */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Kotak Konten Pop-up */}
          <div className="w-full max-w-md bg-white dark:bg-[#121212] border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-red-500 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                Hapus Akun Anda?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Yakin ingin hapus akun? Tindakan ini bersifat{" "}
                <span className="text-red-600 dark:text-red-400 font-bold">
                  permanen
                </span>
                . Seluruh riwayat membaca, daftar pustaka favorit, dan data
                profil Anda akan dihapus total dari database SHIORI.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 rounded-xl text-[11px] font-bold">
                {errorMsg}
              </div>
            )}

            {/* Aksi Tombol Pilihan */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Ya, Hapus Permanen"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
