import { getPopularManga, Manga } from "../lib/mangadex"; // FIX: Menggunakan relative path
import Link from "next/link";

export default async function Home() {
  const mangas: Manga[] = await getPopularManga();
  const trendingMangas: Manga[] = mangas.slice(0, 5);

  return (
    <main className="min-h-screen max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Discover Manga</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Explore latest updates directly from MangaDex API</p>
        </div>
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search manga..."
            className="w-full px-3 py-1.5 text-sm rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Layout Konten */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* KOLOM KIRI: Grid Utama */}
        <div className="lg:col-span-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            Popular Updates
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {mangas.map((manga: Manga) => ( // FIX: Mengganti 'any' dengan tipe 'Manga'
              <Link 
                href={`/manga/${manga.id}`}
                key={manga.id} 
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-200"
              >
                <div className="aspect-[2/3] w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={manga.cover} 
                    alt={manga.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                  />
                </div>
                <div className="p-2 flex-grow flex flex-col justify-between">
                  <h3 className="font-medium text-xs sm:text-sm line-clamp-2 text-slate-800 dark:text-slate-200 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors leading-tight">
                    {manga.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* KOLOM KANAN: Sidebar Trending */}
        <div className="hidden lg:block lg:col-span-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            Trending Now
          </h2>
          <div className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            {trendingMangas.map((manga: Manga, idx: number) => ( // FIX: Mengganti 'any' dengan tipe 'Manga'
              <Link 
                href={`/manga/${manga.id}`} 
                key={`trend-${manga.id}`}
                className="flex gap-3 items-center group"
              >
                <span className="text-lg font-black text-slate-300 dark:text-slate-700 w-6 text-center group-hover:text-orange-500">
                  {idx + 1}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={manga.cover} 
                  alt={manga.title} 
                  className="w-10 h-14 object-cover rounded bg-slate-200 dark:bg-slate-800"
                />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate group-hover:text-orange-400">
                    {manga.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">MangaDex Top Followed</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}