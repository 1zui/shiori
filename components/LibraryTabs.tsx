"use client";

import { useState } from "react";
import Link from "next/link";

interface BookmarkItem {
  id: string;
  mangaId: string;
  title: string;
  coverUrl: string;
}

interface HistoryItem {
  id: string;
  mangaId: string;
  title: string;
  coverUrl: string;
  chapterId: string;
  chapterNumber: string;
  updatedAt: Date | string;
}

interface LibraryTabsProps {
  bookmarks: BookmarkItem[];
  histories: HistoryItem[];
}

export default function LibraryTabs({ bookmarks, histories }: LibraryTabsProps) {
  const [activeTab, setActiveTab] = useState<"bookmarks" | "history">("bookmarks");

  // Format tanggal agar lebih manusiawi (misal: "2 hours ago")
  const formatTime = (dateStr: Date | string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return "Baru saja";
    if (diffInMins < 60) return `${diffInMins} menit yang lalu`;
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    return `${diffInDays} hari yang lalu`;
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 mt-6">
      {/* ─── TAB SWITCHER ─── */}
      <div className="flex gap-4 border-b border-neutral-800 pb-3 mb-8">
        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`text-sm font-bold pb-2 transition-all relative ${
            activeTab === "bookmarks" ? "text-orange-500" : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Favorit Saya ({bookmarks.length})
          {activeTab === "bookmarks" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-orange-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`text-sm font-bold pb-2 transition-all relative ${
            activeTab === "history" ? "text-orange-500" : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Terakhir Dibaca ({histories.length})
          {activeTab === "history" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-orange-500 rounded-full" />
          )}
        </button>
      </div>

      {/* ─── TAB 1: BOOKMARKS ─── */}
      {activeTab === "bookmarks" && (
        <div>
          {bookmarks.length === 0 ? (
            <div className="text-center py-20 bg-neutral-900/10 border border-neutral-900 rounded-2xl">
              <span className="text-3xl">📭</span>
              <p className="text-sm text-neutral-500 mt-3">Belum ada komik yang difavoritkan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {bookmarks.map((manga) => (
                <Link
                  key={manga.id}
                  href={`/manga/${manga.mangaId}`}
                  className="group flex flex-col bg-[#111113] border border-neutral-900 hover:border-neutral-800 rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="aspect-[3/4] relative overflow-hidden bg-neutral-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={manga.coverUrl}
                      alt={manga.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3.5 flex flex-col justify-between flex-grow">
                    <h3 className="text-xs font-black line-clamp-2 text-neutral-200 group-hover:text-white transition-colors">
                      {manga.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: HISTORY ─── */}
      {activeTab === "history" && (
        <div>
          {histories.length === 0 ? (
            <div className="text-center py-20 bg-neutral-900/10 border border-neutral-900 rounded-2xl">
              <span className="text-3xl">🕒</span>
              <p className="text-sm text-neutral-500 mt-3">Kamu belum membaca komik apa pun.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {histories.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-[#111113] border border-neutral-900 rounded-xl shadow-md hover:border-neutral-800 transition-all"
                >
                  {/* Cover */}
                  <div className="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-950 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Meta Data */}
                  <div className="flex flex-col justify-between flex-grow min-w-0">
                    <div>
                      <h3 className="text-xs font-black text-white truncate">{item.title}</h3>
                      <p className="text-[10px] text-neutral-500 mt-1">
                        Dibaca: {formatTime(item.updatedAt)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-2">
                      <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-md">
                        CH {item.chapterNumber}
                      </span>
                      <Link
                        href={`/manga/${item.mangaId}/${item.chapterId}`}
                        className="text-[10px] font-black bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors shadow-md active:scale-95"
                      >
                        Lanjut Baca
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}