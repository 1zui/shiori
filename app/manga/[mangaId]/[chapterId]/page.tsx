export default function ReaderPage({ params }: { params: { mangaId: string; chapterId: string } }) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 py-6 max-w-2xl mx-auto px-4">
      <div className="flex justify-between items-center mb-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
        <span className="text-xs text-slate-400">Chapter ID: {params.chapterId}</span>
        <button className="bg-orange-600 text-xs px-3 py-1.5 rounded-lg font-medium">Kembali</button>
      </div>
      
      {/* Tempat Gambar Manga */}
      <div className="flex flex-col gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 min-h-[60vh] items-center justify-center text-slate-500">
        [Area Gambar Mode Scroll MangaDex]
      </div>
    </main>
  );
}