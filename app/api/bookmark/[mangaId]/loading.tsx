export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Memuat Komik...</p>
      </div>
    </div>
  );
}