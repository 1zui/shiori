import { getChapterImages } from "@/lib/mangadex";
import Link from "next/link";

interface ReaderProps {
  params: Promise<{ mangaId: string; chapterId: string }> | { mangaId: string; chapterId: string };
}

export default async function ReaderPage({ params }: ReaderProps) {
  // Await params untuk kompatibilitas Next.js terbaru
  const resolvedParams = await params;
  const { mangaId, chapterId } = resolvedParams;

  // Ambil data gambar dari fungsi di lib
  const images = await getChapterImages(chapterId);

  return (
    <main className="min-h-screen bg-black text-slate-50">
      
      {/* 1. Top Navigation Bar (Sticky di atas) */}
      <div className="sticky top-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-3 flex justify-between items-center max-w-2xl mx-auto z-40">
        <Link 
          href={`/manga/${mangaId}`}
          className="text-xs bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-lg font-medium transition-colors"
        >
          ← Details
        </Link>
        <span className="text-xs font-semibold text-orange-500 tracking-wide">
          Reading Mode: Vertical Scroll
        </span>
      </div>

      {/* 2. Container Gambar Manga (Mode Scroll Kebawah) */}
      <section className="max-w-2xl mx-auto bg-zinc-950 flex flex-col items-center">
        {images.length === 0 ? (
          <div className="py-20 text-center text-sm text-slate-500 px-4">
            Gagal memuat gambar atau chapter ini tidak menyediakan server gratis saat ini.
          </div>
        ) : (
          images.map((url: string, index: number) => (
            <div key={index} className="w-full relative bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Page ${index + 1}`}
                loading={index < 3 ? "eager" : "lazy"} // 3 halaman pertama dimuat instan, sisanya lazy load biar hemat kuota
                className="w-full h-auto object-contain mx-auto"
              />
              {/* Penanda Halaman Kecil di Pojok Bawah Gambar */}
              <span className="absolute bottom-2 right-2 bg-black/60 text-[10px] px-2 py-0.5 rounded text-slate-400 font-mono">
                {index + 1} / {images.length}
              </span>
            </div>
          ))
        )}
      </section>

      {/* 3. Bottom Navigation Bar (Penutup di bawah setelah selesai baca) */}
      <div className="bg-slate-900 border-t border-slate-800 p-6 flex flex-col items-center gap-4 max-w-2xl mx-auto mt-4 mb-12 rounded-t-2xl">
        <p className="text-xs text-slate-400">Kamu telah mencapai akhir chapter.</p>
        <Link 
          href={`/manga/${mangaId}`}
          className="bg-orange-600 hover:bg-orange-750 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md w-full text-center"
        >
          Kembali ke Daftar Chapter
        </Link>
      </div>

    </main>
  );
}