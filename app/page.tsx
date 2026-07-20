import { Suspense } from "react";
import { getMixedPopularManga, getPopularManga } from "@/lib/mangadex";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import { logger } from "@/lib/logger";
import WelcomeModal from "@/components/WelcomeModal";

// ⚡ Force dynamic rendering agar search & pagination selalu diambil langsung dari API
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const page = Number(resolvedParams.page) || 1;

  /**
   * ⚡ PHASE 2 PERFORMANCE: Concurrency Optimization
   * Mengeksekusi pencarian utama dan sidebar populer secara simultan.
   */
  const [mixedResult, trendingResult] = await Promise.allSettled([
    getMixedPopularManga(query, page),
    getPopularManga("", 1),
  ]);

  // Ekstraksi & Fallback Komik Utama (Mixed Manga/Manhwa/Manhua)
  const mixedData =
    mixedResult.status === "fulfilled"
      ? mixedResult.value
      : { items: [], totalPages: 1 };

  if (mixedResult.status === "rejected") {
    logger.error(
      "HOME_PAGE_MIXED",
      "Gagal memuat feed komik utama",
      mixedResult.reason,
    );
  }

  // Ekstraksi & Fallback Data Sidebar Trending
  const trendingData =
    trendingResult.status === "fulfilled"
      ? trendingResult.value
      : { items: [] };

  if (trendingResult.status === "rejected") {
    logger.error(
      "HOME_PAGE_TRENDING",
      "Gagal memuat feed sidebar trending",
      trendingResult.reason,
    );
  }

  const mixedItems = mixedData.items;
  const totalPages = mixedData.totalPages;
  const top10Trending = trendingData.items.slice(0, 10);

  return (
    <main className="max-w-[1800px] mx-auto p-6 md:p-12 text-slate-900 dark:text-white transition-colors">
      {/* 💡 GIMMICK WELCOME MODAL (Dipanggil via Suspense) */}
      <Suspense fallback={null}>
        <WelcomeModal />
      </Suspense>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-slate-200 dark:border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">SHIORI Stream</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {query
              ? `Search results for "${query}"`
              : "Discover highly popular mixed Manga, Manhwa, and Manhua"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {mixedItems.length === 0 ? (
            <div className="text-center py-20 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-100 dark:border-slate-850 p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Data komik tidak ditemukan.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Gagal terhubung ke upstream provider atau keyword tidak cocok.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {mixedItems.map((item) => (
                  <Link
                    href={`/manga/${item.id}`}
                    key={item.id}
                    className="group block"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:border-orange-500 transition-all shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.cover}
                        alt={item.title}
                        referrerPolicy="no-referrer" // 👈 BYPASS HOTLINK PROTECTION MANGADEX
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xs font-bold mt-2 text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-orange-500 transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                searchQuery={query}
                baseUrl="/"
              />
            </>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-900 pt-8 lg:pt-0 lg:pl-8">
          <h3 className="text-sm font-black tracking-widest uppercase text-slate-400 mb-6">
            🔥 Trending Now
          </h3>

          {trendingResult.status === "rejected" && (
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[11px] text-amber-500 dark:text-amber-400/80 mb-4">
              Gagal memuat daftar trending saat ini.
            </div>
          )}

          {top10Trending.length === 0 ? (
            <div className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">
              Tidak ada data trending.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {top10Trending.map((manga, idx) => (
                <Link
                  href={`/manga/${manga.id}`}
                  key={manga.id}
                  className="flex items-center gap-3 group"
                >
                  <div className="text-sm font-black text-slate-400 w-5 text-center group-hover:text-orange-500">
                    {idx + 1}
                  </div>
                  <div className="w-10 h-14 relative rounded overflow-hidden bg-slate-900 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={manga.cover}
                      alt={manga.title}
                      referrerPolicy="no-referrer" // 👈 BYPASS HOTLINK PROTECTION MANGADEX
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="text-xs font-bold line-clamp-2 text-slate-700 dark:text-slate-300 group-hover:text-orange-500 transition-colors">
                    {manga.title}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
