// app/explore/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { fetchMangaFromDexServer, ExploreMangaItem } from "./actions";

const LIST_GENRE = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
];

const LIST_KATEGORI = [
  { id: "all", name: "Semua Tipe Komik" },
  { id: "manga", name: "Manga" },
  { id: "manhwa", name: "Manhwa" },
  { id: "manhua", name: "Manhua" },
];

export default function ExplorePage() {
  const [activeGenre, setActiveGenre] = useState<string>("Action");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [mangaList, setMangaList] = useState<ExploreMangaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorInfo, setErrorInfo] = useState<{
    type: string | null;
    message: string | null;
  }>({ type: null, message: null });

  const loadManga = useCallback(async (genre: string, category: string) => {
    setIsLoading(true);
    setErrorInfo({ type: null, message: null });

    try {
      const res = await fetchMangaFromDexServer(genre, category);

      if (!res) {
        setMangaList([]);
        setErrorInfo({
          type: "CLIENT_ERROR",
          message: "Gagal menerima respon dari server action.",
        });
        return;
      }

      if (res.success) {
        setMangaList(res.data);
        setErrorInfo({
          type: null,
          message: res.data.length === 0 ? res.message : null,
        });
      } else {
        setMangaList([]);
        setErrorInfo({
          type: res.errorType,
          message: res.message,
        });
      }
    } catch (err) {
      console.error("[SHIORI EXPLORE UI ERROR]", err);
      setMangaList([]);
      setErrorInfo({
        type: "CLIENT_ERROR",
        message:
          err instanceof Error ? err.message : "Terjadi kesalahan sistem.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadManga(activeGenre, activeCategory);
    }, 0);

    return () => clearTimeout(timer);
  }, [activeGenre, activeCategory, loadManga]);

  const handleGenreClick = (genre: string) => {
    if (genre === activeGenre || isLoading) return;
    setActiveGenre(genre);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveCategory(e.target.value);
  };

  const handleRetry = () => {
    if (isLoading) return;
    loadManga(activeGenre, activeCategory);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d] text-slate-900 dark:text-slate-100 transition-colors duration-200 p-6 md:p-10">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-black tracking-tight mb-2 text-slate-900 dark:text-white uppercase">
          Jelajahi Komik
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Temukan komik populer berdasarkan preferensi genre dan kategori asal
          bahasa Anda.
        </p>
      </header>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-zinc-800">
        {/* Pil Button Genre */}
        <div className="flex flex-wrap gap-2">
          {LIST_GENRE.map((genre) => {
            const isActive = genre === activeGenre;
            return (
              <button
                key={genre}
                onClick={() => handleGenreClick(genre)}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  isActive
                    ? "bg-orange-600 text-white shadow-md shadow-orange-500/20 scale-105"
                    : "bg-white dark:bg-[#181818] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800"
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {/* Dropdown Tipe */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <label
            htmlFor="category-select"
            className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap"
          >
            TIPE:
          </label>
          <select
            id="category-select"
            value={activeCategory}
            onChange={handleCategoryChange}
            disabled={isLoading}
            className="bg-white dark:bg-[#181818] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm dark:shadow-none"
          >
            {LIST_KATEGORI.map((cat) => (
              <option
                key={cat.id}
                value={cat.id}
                className="bg-white dark:bg-[#181818] text-slate-900 dark:text-white"
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Komik */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
      ) : errorInfo.message ? (
        <div
          className={`text-center py-16 rounded-2xl border border-dashed flex flex-col items-center justify-center p-6 mx-auto max-w-2xl ${
            errorInfo.type
              ? "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-200"
              : "border-slate-300 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/20 text-slate-600 dark:text-slate-400"
          }`}
        >
          {errorInfo.type && (
            <span className="mb-3 px-2.5 py-0.5 text-[10px] font-bold tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded border border-amber-500/20 uppercase">
              {errorInfo.type}
            </span>
          )}
          <p className="text-sm max-w-md leading-relaxed mb-5">
            {errorInfo.message}
          </p>
          {errorInfo.type && (
            <button
              onClick={handleRetry}
              className="px-4 py-2 text-xs font-semibold bg-white dark:bg-[#181818] hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-zinc-700 rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              Coba Lagi
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {mangaList.map((manga) => (
            <Link
              key={manga.id}
              href={`/manga/${manga.id}`}
              className="group bg-white dark:bg-[#121212] rounded-xl overflow-hidden border border-slate-200/80 dark:border-transparent hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 flex flex-col cursor-pointer shadow-sm dark:shadow-none"
            >
              <div className="relative w-full aspect-[2/3] overflow-hidden bg-slate-100 dark:bg-[#181818]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={manga.coverUrl}
                  alt={manga.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-3 flex-1 flex flex-col justify-center bg-white dark:bg-[#121212]">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                  {manga.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
