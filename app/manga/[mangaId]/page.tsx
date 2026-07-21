import { getMangaDetail, getMangaChapters } from "@/lib/mangadex";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BookmarkButton from "@/components/BookmarkButton";
import MangaReviews from "@/components/MangaReviews";
import { logger } from "@/lib/logger";

// Force dynamic rendering agar build Vercel tidak bermasalah saat fetching data eksternal
export const dynamic = "force-dynamic";

interface MangaChapter {
  id: string;
  chapter: string;
  title: string;
  language: string;
}

interface PageProps {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MangaDetailPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;

  const paramKeys = Object.keys(resolvedParams);
  const mangaKey =
    paramKeys.find((k) => k.toLowerCase().includes("manga")) || paramKeys[0];
  const id = resolvedParams[mangaKey];

  const sortOrder = resolvedSearchParams?.sort === "desc" ? "desc" : "asc";

  /**
   * ⚡ PHASE 2 OPTIMIZATION: Paralelisasi Penuh Data Fetching
   * Memotong waktu muat halaman hingga 50% dibandingkan metode sekuensial konvensional.
   */
  const [mangaResult, chaptersResult] = await Promise.allSettled([
    getMangaDetail(id),
    getMangaChapters(id),
  ]);

  // Ekstraksi data kritikal (Profil Manga)
  const manga = mangaResult.status === "fulfilled" ? mangaResult.value : null;

  // 🛡️ Graceful Degradation: Jika data chapter gagal termuat, berikan fallback array kosong
  const chapters =
    chaptersResult.status === "fulfilled"
      ? (chaptersResult.value as MangaChapter[])
      : [];

  if (chaptersResult.status === "rejected") {
    logger.error(
      "MANGA_DETAIL_PAGE",
      `Gagal memuat feed chapter untuk mangaId: ${id}`,
      chaptersResult.reason,
    );
  }

  // Pengamanan rute jika data utama komik kosong atau tidak ditemukan
  if (!manga) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center px-6 transition-colors duration-200">
        <div className="p-8 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 text-center max-w-md w-full shadow-lg dark:shadow-2xl">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Comic Profile Unavailable
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Gagal mengambil informasi dasar komik dari database eksternal.
          </p>
          <Link
            href="/"
            className="inline-block w-full text-center text-xs font-bold bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-500 transition-colors shadow-sm"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ─── 💡 SMART DEDUPLICATION LOGIC (ANTI-DOUBLE) ───
  const getLangPriority = (lang: string) => {
    if (lang === "ID") return 3;
    if (lang === "EN") return 2;
    return 1;
  };

  const uniqueChaptersMap: Record<string, MangaChapter> = {};

  chapters.forEach((chap) => {
    const existing = uniqueChaptersMap[chap.chapter];
    if (
      !existing ||
      getLangPriority(chap.language) > getLangPriority(existing.language)
    ) {
      uniqueChaptersMap[chap.chapter] = chap;
    }
  });

  const filteredChapters = Object.values(uniqueChaptersMap);

  const sortedChapters = filteredChapters.sort((a, b) => {
    const numA = parseFloat(a.chapter) || 0;
    const numB = parseFloat(b.chapter) || 0;
    return sortOrder === "desc" ? numB - numA : numA - numB;
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-slate-100 p-4 md:p-8 lg:p-12 transition-colors duration-200">
      {/* 1. BREADCRUMBS */}
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6 font-bold max-w-[1600px] mx-auto">
        <Link href="/" className="hover:text-orange-500 transition-colors">
          home
        </Link>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <Link href="/" className="hover:text-orange-500 transition-colors">
          manga list
        </Link>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <span className="text-slate-800 dark:text-slate-300 line-clamp-1">
          {manga.title}
        </span>
      </div>

      <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
        {/* 2. HERO BANNER */}
        <div className="w-full bg-white dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-slate-850 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start relative overflow-hidden shadow-sm dark:shadow-2xl group transition-colors">
          <div
            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 dark:opacity-15 pointer-events-none scale-110 transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${manga.cover})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1a1a1a] via-transparent to-transparent opacity-80 dark:opacity-60 pointer-events-none" />

          <div className="w-full md:w-[200px] lg:w-[220px] aspect-[2/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl flex-shrink-0 z-10 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={manga.cover}
              alt={manga.title}
              referrerPolicy="no-referrer" // 👈 BYPASS HOTLINK MANGADEX
              className="object-cover w-full h-full select-none"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between h-full space-y-4 z-10 relative">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
                {manga.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] font-black tracking-widest uppercase bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-md">
                  {manga.status || "Ongoing"}
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                  {manga.year || "N/A"}
                </span>
              </div>

              <div className="space-y-2 mb-6">
                <h3 className="text-xs font-black tracking-wider uppercase text-slate-500 dark:text-slate-400">
                  Synopsis
                </h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify max-w-5xl">
                  {manga.description}
                </p>
              </div>

              <div className="pt-2">
                <BookmarkButton
                  mangaId={id}
                  title={manga.title}
                  coverUrl={manga.cover}
                  isLoggedIn={isLoggedIn}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. TWO COLUMN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* KOLOM KIRI: LIST CHAPTER */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-850">
              <h2 className="text-sm font-black tracking-wider uppercase text-slate-600 dark:text-slate-400">
                Daftar Chapter
              </h2>

              <Link
                href={`/manga/${id}?sort=${sortOrder === "asc" ? "desc" : "asc"}`}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-850 px-3 py-1.5 rounded-xl transition-all shadow-sm"
              >
                <span>Order: {sortOrder === "asc" ? "A-Z" : "Z-A"}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${sortOrder === "desc" ? "rotate-180" : ""}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5"
                  />
                </svg>
              </Link>
            </div>

            {/* Render Spanduk Peringatan Halus Jika API Chapter Menolak Merespons */}
            {chaptersResult.status === "rejected" && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/30 rounded-2xl text-xs text-amber-700 dark:text-amber-400">
                ⚠️ Layanan pemuatan chapter eksternal sedang mengalami
                perlambatan respons. Silakan muat ulang halaman beberapa saat
                lagi untuk memperbarui list.
              </div>
            )}

            {sortedChapters.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#1a1a1a] rounded-2xl text-xs text-slate-500 border border-slate-200 dark:border-slate-850 shadow-sm dark:shadow-none">
                Belum ada rilis chapter yang tersedia atau data gagal dimuat.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[650px] overflow-y-auto pr-2 scrollbar-thin">
                {sortedChapters.map((chap: MangaChapter) => (
                  <Link
                    key={chap.id}
                    href={`/manga/${id}/${chap.id}`}
                    className="flex items-center justify-between p-3 bg-white dark:bg-[#1a1a1a] hover:bg-orange-50/50 dark:hover:bg-[#222] border border-slate-200/80 dark:border-slate-850/50 hover:border-orange-300 dark:hover:border-slate-700 rounded-2xl group transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex-shrink-0 relative shadow-inner">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={manga.cover}
                          alt=""
                          referrerPolicy="no-referrer" // 👈 BYPASS HOTLINK MANGADEX
                          className="object-cover w-full h-full object-center opacity-90 dark:opacity-80"
                        />
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
                            Chapter {chap.chapter}
                          </span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-slate-800 rounded text-orange-600 dark:text-orange-400 tracking-wider">
                            {chap.language}
                          </span>
                        </div>
                        {chap.title && (
                          <span className="text-xxs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                            {chap.title}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors pr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* KOLOM KANAN: SIDEBAR */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-850 rounded-2xl p-5 space-y-3 shadow-sm dark:shadow-md">
              <h3 className="text-xs font-black tracking-wider uppercase text-slate-500 dark:text-slate-400">
                Genre Tags
              </h3>
              {manga.genres && manga.genres.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {manga.genres.map((genre: string) => (
                    <span
                      key={genre}
                      className="text-[10px] font-bold bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 rounded-lg"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xxs text-slate-400 dark:text-slate-500">
                  No genre tags registered.
                </p>
              )}
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-850 rounded-2xl p-5 space-y-3 shadow-sm dark:shadow-md">
              <h3 className="text-xs font-black tracking-wider uppercase text-slate-500 dark:text-slate-400">
                Last Update
              </h3>
              <div className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-850 rounded-xl p-3.5 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Updated on {manga.lastUpdate}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-850 rounded-2xl p-4 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 shadow-sm dark:shadow-md">
              <span className="uppercase tracking-wider text-[11px]">
                Share
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white text-[11px] font-bold transition-colors">
                  Twitter
                </button>
                <button className="px-3 py-1.5 bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white text-[11px] font-bold transition-colors">
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Review & Rating Panel */}
        <div className="w-full mt-4">
          <MangaReviews mangaId={id} isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </main>
  );
}
