"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
  mangaId: string;
  title: string;
  coverUrl: string;
  isLoggedIn: boolean;
}

export default function BookmarkButton({ mangaId, title, coverUrl, isLoggedIn }: BookmarkButtonProps) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkStatus = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch(`/api/bookmark?mangaId=${mangaId}`);
      
      // 💡 DI-FIX: Hanya baca JSON jika respon dari server berstatus sukses (OK)
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setIsBookmarked(!!data.isBookmarked);
        }
      } else {
        setIsBookmarked(false);
      }
    } catch (err) {
      console.error("Failed to fetch bookmark status", err);
      setIsBookmarked(false);
    }
  }, [mangaId, isLoggedIn]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStatus = async () => {
      if (isLoggedIn && isMounted) {
        await checkStatus();
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [checkStatus, isLoggedIn]);

  const handleToggle = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      // 💡 DI-FIX: Jika sudah favorit, tembak API DELETE. Jika belum, tembak API POST.
      const url = isBookmarked ? `/api/bookmark/${mangaId}` : "/api/bookmark";
      const method = isBookmarked ? "DELETE" : "POST";
      const body = isBookmarked ? null : JSON.stringify({ mangaId, title, coverUrl });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body
      });

      if (res.ok) {
        // Balikkan status favorit secara instan di client
        setIsBookmarked(!isBookmarked);
      } else {
        // Amankan parsing eror jika server mengirim eror non-JSON
        let errorMsg = "Terjadi kesalahan koneksi database.";
        try {
          const data = await res.json();
          errorMsg = data.message || data.error || errorMsg;
        } catch {}
        alert(errorMsg);
      }
    } catch (err) {
      console.error("Bookmark toggle error:", err);
      alert("Gagal menghubungi server. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 text-xs font-bold border px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 ${
        isBookmarked
          ? "bg-orange-600/20 border-orange-500 text-orange-400 hover:bg-orange-600/30"
          : "bg-slate-900/40 border-slate-700 text-slate-200 hover:border-orange-500 hover:text-white"
      }`}
    >
      <span>{isBookmarked ? "❤️" : "+"}</span>
      {isBookmarked ? "Tersimpan di Favorit" : "Tambahkan ke Favorit"}
    </button>
  );
}