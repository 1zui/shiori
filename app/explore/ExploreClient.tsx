"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { fetchMangaFromDexServer, ExploreMangaItem } from "./actions";

interface ExploreClientProps {
  initialItems?: ExploreMangaItem[];
  initialData?: { items: ExploreMangaItem[] };
  initialGenre?: string;
}

const GENRES = [
  { id: "action", name: "Action" },
  { id: "adventure", name: "Adventure" },
  { id: "comedy", name: "Comedy" },
  { id: "drama", name: "Drama" },
  { id: "fantasy", name: "Fantasy" },
  { id: "horror", name: "Horror" },
  { id: "mystery", name: "Mystery" },
  { id: "romance", name: "Romance" },
  { id: "sci-fi", name: "Sci-Fi" },
];

export default function ExploreClient({
  initialItems = [],
  initialData,
  initialGenre = "action",
}: ExploreClientProps) {
  const defaultList = initialData?.items || initialItems || [];
  const [items, setItems] = useState<ExploreMangaItem[]>(defaultList);
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre);
  const [isPending, startTransition] = useTransition();

  const handleGenreChange = (genreId: string) => {
    setSelectedGenre(genreId);
    startTransition(async () => {
      // 💡 GUNAKAN 'unknown' SEBAGAI PENGGANTI 'any' UNTUK MEMATUHI ESLINT
      const res: unknown = await fetchMangaFromDexServer(genreId);

      if (Array.isArray(res)) {
        setItems(res as ExploreMangaItem[]);
      } else if (
        res &&
        typeof res === "object" &&
        "items" in res &&
        Array.isArray((res as { items: unknown }).items)
      ) {
        setItems((res as { items: ExploreMangaItem[] }).items);
      } else {
        setItems([]);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Genre Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {GENRES.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreChange(genre.id)}
            disabled={isPending}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedGenre === genre.id
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Manga Grid */}
      {isPending ? (
        <div className="py-20 text-center text-sm text-slate-400 animate-pulse">
          Memuat genre {selectedGenre}...
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center text-sm text-slate-400">
          Tidak ada komik ditemukan untuk genre ini.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/manga/${item.id}`}
              className="group block"
            >
              <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:border-orange-500 transition-all shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
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
      )}
    </div>
  );
}
