"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    username: string;
    avatar?: string | null;
  };
}

interface MangaReviewsProps {
  mangaId: string;
  isLoggedIn: boolean;
}

export default function MangaReviews({
  mangaId,
  isLoggedIn,
}: MangaReviewsProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingValue, setRatingValue] = useState(5);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/rating?mangaId=${mangaId}`);
      const result = await res.json();
      if (res.ok && result.success) {
        setReviews(result.data.reviews || []);
      }
    } catch (err) {
      console.error("Gagal mengambil ulasan:", err);
    }
  }, [mangaId]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (isMounted) await fetchReviews();
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mangaId,
          rating: ratingValue,
          comment: commentText,
        }),
      });

      if (res.ok) {
        setCommentText("");
        fetchReviews();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal mengirim ulasan");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 text-slate-800 dark:text-slate-200 transition-colors duration-200">
      {/* ─── HEADER FLAT ─── */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800/60">
        <h2 className="text-sm font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400">
          Ulasan & Komentar ({reviews.length})
        </h2>
      </div>

      {/* ─── FORM INPUT CLEAN ─── */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Rating kamu:
          </span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRatingValue(star)}
                className={`text-lg transition-colors cursor-pointer ${
                  star <= ratingValue
                    ? "text-amber-400"
                    : "text-slate-300 dark:text-slate-700 hover:text-amber-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="w-full">
          <textarea
            rows={3}
            maxLength={500}
            className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-slate-800 focus:border-orange-500 dark:focus:border-orange-500 rounded-xl p-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all resize-none shadow-sm"
            placeholder={
              isLoggedIn
                ? "Bagikan pendapatmu tentang komik ini..."
                : "Silakan login terlebih dahulu untuk menulis komentar..."
            }
            disabled={!isLoggedIn}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || (!isLoggedIn && commentText.length === 0)}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Mengirim..." : "Kirim Ulasan"}
          </button>
        </div>
      </form>

      {/* ─── LIST ULASAN FLAT & MODERN ─── */}
      <div className="space-y-1 max-w-4xl pt-2">
        {reviews.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic py-4">
            Belum ada ulasan untuk komik ini.
          </p>
        ) : (
          <div className="flex flex-col max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="flex items-start gap-4 py-4 border-b border-slate-200/80 dark:border-slate-850/50 last:border-none"
              >
                {/* Avatar Lingkaran Profesional */}
                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0 relative shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      rev.user?.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${rev.user?.username || "User"}`
                    }
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Area Konten */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {/* Username Asli */}
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
                      {rev.user?.username || "Anonymous"}
                    </span>

                    {/* Skala Bintang Solid */}
                    <div className="flex text-amber-400 text-xxs tracking-tighter">
                      {"★".repeat(rev.rating)}
                      <span className="text-slate-300 dark:text-slate-700">
                        {"★".repeat(5 - rev.rating)}
                      </span>
                    </div>

                    {/* Tanggal Muted */}
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">
                      {new Date(rev.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>

                  {/* Isi Teks Komentar Normal */}
                  {rev.comment && (
                    <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal pt-0.5">
                      {rev.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
