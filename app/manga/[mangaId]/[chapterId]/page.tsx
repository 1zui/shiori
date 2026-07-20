// app/manga/[mangaId]/[chapterId]/page.tsx
import { getMangaDetail, getChapterImages, getMangaChapters } from "@/lib/mangadex";
import HistoryTracker from "@/components/HistoryTracker";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

interface ChapterPageProps {
  params: Promise<{ mangaId: string; chapterId: string }>;
}

export default async function ChapterReaderPage({ params }: ChapterPageProps) {
  const { mangaId, chapterId } = await params;
  const session = await getServerSession(authOptions);

  // ⚡ AMBIL DATA PARALEL: Tambahkan getMangaChapters ke dalam antrean
  const [mangaResult, imagesResult, chaptersResult] = await Promise.allSettled([
    getMangaDetail(mangaId),
    getChapterImages(chapterId),
    getMangaChapters(mangaId),
  ]);

  const manga = mangaResult.status === "fulfilled" ? mangaResult.value : null;
  const images = imagesResult.status === "fulfilled" ? imagesResult.value : [];
  const chapters = chaptersResult.status === "fulfilled" ? chaptersResult.value : [];

  if (!manga) {
    return <div className="p-10 text-center text-slate-400">Manga data template untraceable.</div>;
  }

  // ─── 💡 RE-APPLY SMART DEDUPLICATION LOGIC FOR ACCURATE ORDER ───
  const getLangPriority = (lang: string) => {
    if (lang === "ID") return 3;
    if (lang === "EN") return 2;
    return 1;
  };

  const uniqueChaptersMap: Record<string, typeof chapters[number]> = {};
  chapters.forEach((chap) => {
    const existing = uniqueChaptersMap[chap.chapter];
    if (!existing || getLangPriority(chap.language) > getLangPriority(existing.language)) {
      uniqueChaptersMap[chap.chapter] = chap;
    }
  });

  // Urutkan naik (Ascending) agar index berikutnya benar-benar berlanjut ke bab selanjutnya
  const sortedChapters = Object.values(uniqueChaptersMap).sort((a, b) => {
    return (parseFloat(a.chapter) || 0) - (parseFloat(b.chapter) || 0);
  });

  // Tentukan posisi index chapter saat ini di dalam array
  const currentChapterIdx = sortedChapters.findIndex((c) => c.id === chapterId);
  const currentChapter = sortedChapters[currentChapterIdx];

  const prevChapter = currentChapterIdx > 0 ? sortedChapters[currentChapterIdx - 1] : null;
  const nextChapter = currentChapterIdx < sortedChapters.length - 1 ? sortedChapters[currentChapterIdx + 1] : null;

  return (
    <main className="min-h-screen bg-[#09090b] text-slate-200 p-4 flex flex-col items-center">
      
      {/* 1. TOP NAVIGATION CONTROLS */}
      <header className="w-full max-w-3xl border-b border-neutral-900 pb-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <Link href={`/manga/${mangaId}`} className="text-xs font-bold text-orange-500 hover:underline">
            ← Kembali ke Detail
          </Link>
          <h1 className="text-sm font-black text-white mt-0.5 line-clamp-1">{manga.title}</h1>
          {currentChapter && (
            <p className="text-[11px] text-neutral-400 font-bold">Chapter {currentChapter.chapter} [{currentChapter.language}]</p>
          )}
        </div>

        {/* Top Pagination Buttons */}
        <div className="flex items-center gap-2">
          {prevChapter ? (
            <Link href={`/manga/${mangaId}/${prevChapter.id}`} className="px-4 py-2 bg-[#121215] border border-neutral-850 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors">
              Prev
            </Link>
          ) : (
            <span className="px-4 py-2 bg-neutral-900/40 border border-neutral-900 rounded-xl text-xs font-bold text-neutral-600 cursor-not-allowed">
              Prev
            </span>
          )}

          {nextChapter ? (
            <Link href={`/manga/${mangaId}/${nextChapter.id}`} className="px-5 py-2 bg-orange-650 hover:bg-orange-600 rounded-xl text-xs font-black text-white transition-colors shadow-md shadow-orange-950/20">
              Next Chapter →
            </Link>
          ) : (
            <span className="px-5 py-2 bg-neutral-900/40 border border-neutral-900 rounded-xl text-xs font-black text-neutral-600 cursor-not-allowed">
              End Chapter
            </span>
          )}
        </div>
      </header>

      {/* 2. MANGA IMAGES CONTENT LAYOUT */}
      <div className="flex flex-col gap-1 max-w-3xl w-full bg-[#050507] p-1 rounded-2xl border border-neutral-950 shadow-2xl">
        {images.length === 0 ? (
          <div className="text-center py-20 text-xs text-neutral-500">
            Gagal mengambil lembar gambar. Silakan muat ulang halaman.
          </div>
        ) : (
          images.map((url, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              key={index} 
              src={url} 
              alt={`Page ${index + 1}`} 
              className="w-full h-auto object-contain select-none pointer-events-none" 
              loading={index <= 2 ? "eager" : "lazy"} 
            />
          ))
        )}
      </div>

      {/* 3. BOTTOM NAVIGATION CONTROLS (FOOTER) */}
      <footer className="w-full max-w-3xl border-t border-neutral-900 pt-6 mt-8 flex flex-col items-center gap-4 pb-12">
        <p className="text-xs text-neutral-500 font-bold">Kamu telah selesai membaca bab ini.</p>
        
        <div className="flex items-center gap-3 w-full justify-center">
          {prevChapter && (
            <Link href={`/manga/${mangaId}/${prevChapter.id}`} className="px-6 py-3 bg-[#121215] border border-neutral-850 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors">
              ← Bab Sebelumnya
            </Link>
          )}

          <Link href={`/manga/${mangaId}`} className="px-6 py-3 bg-neutral-900 border border-neutral-850 rounded-xl text-xs font-bold text-neutral-400 hover:text-white transition-colors">
            Daftar Bab
          </Link>

          {nextChapter ? (
            <Link href={`/manga/${mangaId}/${nextChapter.id}`} className="px-8 py-3 bg-orange-650 hover:bg-orange-600 rounded-xl text-xs font-black text-white transition-colors shadow-lg shadow-orange-950/30">
              Lanjut Chapter →
            </Link>
          ) : (
            <span className="px-8 py-3 bg-neutral-900/40 border border-neutral-900 rounded-xl text-xs font-black text-neutral-600 cursor-not-allowed">
              Bab Terakhir
            </span>
          )}
        </div>
      </footer>

      {/* 4. SILENT HISTORY SYNC ENGINE */}
      {session?.user && currentChapter && (
        <HistoryTracker
          mangaId={mangaId}
          chapterId={chapterId}
          chapterNumber={currentChapter.chapter}
          title={manga.title}
          coverUrl={manga.cover}
        />
      )}
    </main>
  );
}