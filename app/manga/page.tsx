// app/manga/page.tsx
import { getPopularManga } from "@/lib/mangadex";
import Link from "next/link";
import Pagination from "@/components/Pagination";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function MangaPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const page = Number(resolvedParams.page) || 1;

  // 💡 Panggil fungsi Manga Jepang dengan query pencarian & pagination
  const { items, totalPages } = await getPopularManga(query, page);

  const { items: trendingItems } = await getPopularManga("", 1);
  const top10Trending = trendingItems.slice(0, 10);

  return (
    <main className="max-w-[1800px] mx-auto p-6 md:p-12 text-slate-900 dark:text-white transition-colors">
      {/* ─── KODE HEADER BERSIH KHUSUS Halaman Manga ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-slate-200 dark:border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
             Manga
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover highly popular and trending Japanese Manga collections
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* KOLOM UTAMA: GRID 30 DATA COMIC */}
        <div className="lg:col-span-3">
          {items.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              Data tidak ditemukan.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {items.map((manga) => (
                  <Link
                    href={`/manga/${manga.id}`}
                    key={manga.id}
                    className="group block"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:border-orange-500 transition-all shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={manga.cover}
                        alt={manga.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xs font-bold mt-2 text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-orange-500 transition-colors">
                      {manga.title}
                    </h3>
                  </Link>
                ))}
              </div>

              {/* Pagination dinamis mengarah ke /manga */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                searchQuery={query}
                baseUrl="/manga"
              />
            </>
          )}
        </div>

        {/* SIDEBAR TRENDING NOW */}
        <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-900 pt-8 lg:pt-0 lg:pl-8">
          <h3 className="text-sm font-black tracking-widest uppercase text-slate-400 mb-6">
            🔥 Trending Now
          </h3>
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
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="text-xs font-bold line-clamp-2 text-slate-700 dark:text-slate-300 group-hover:text-orange-500 transition-colors">
                  {manga.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
