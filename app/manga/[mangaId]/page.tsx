export default function DetailMangaPage({ params }: { params: { mangaId: string } }) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8 md:px-8 max-w-4xl mx-auto">
      <div className="border border-slate-800 bg-slate-900 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-orange-500 mb-2">Halaman Detail Manga</h1>
        <p className="text-slate-400 text-sm">Manga ID dari URL: <span className="text-white font-mono">{params.mangaId}</span></p>
        <div className="mt-6 p-4 bg-slate-950 rounded-xl border border-slate-800 text-center text-slate-500">
          [Tempat Sinopsis & Daftar Chapter MangaDex]
        </div>
      </div>
    </main>
  );
}