import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  searchQuery?: string;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages = 20, searchQuery = "", baseUrl }: PaginationProps) {
  
  // 💡 LOGIKA DYNAMIC WINDOW WINDOWING (Menghitung nomor halaman + titik-titik)
  const getPageNumbers = () => {
    const pages = [];
    const siblingCount = 1; // Jumlah angka di kiri-kanan halaman aktif

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

      const showLeftEllipsis = leftSiblingIndex > 2;
      const showRightEllipsis = rightSiblingIndex < totalPages - 1;

      if (!showLeftEllipsis && showRightEllipsis) {
        const leftItemCount = 3 + 2 * siblingCount;
        for (let i = 1; i <= leftItemCount; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (showLeftEllipsis && !showRightEllipsis) {
        const rightItemCount = 3 + 2 * siblingCount;
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) pages.push(i);
      } else if (showLeftEllipsis && showRightEllipsis) {
        pages.push(1);
        pages.push("...");
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  // Helper untuk merangkai url agar Search Query tidak hilang saat klik angka
  const buildLink = (page: number | string) => {
    const queryParam = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : "";
    return `${baseUrl}?page=${page}${queryParam}`;
  };

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-12 pt-6 border-t border-slate-200 dark:border-slate-900 w-full text-sm font-medium select-none">
      
      {/* ⬅️ BUTTON PREVIOUS */}
      {currentPage > 1 ? (
        <Link
          href={buildLink(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mr-1 sm:mr-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <div className="flex items-center gap-1 px-3 py-2 opacity-30 cursor-not-allowed mr-1 sm:mr-3 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </div>
      )}

      {/* 🔢 ANGKA HALAMAN UTAMA */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-2 py-2 text-slate-400 dark:text-slate-600 font-bold">
              ...
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <Link
            key={`page-${page}`}
            href={buildLink(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
              isActive
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20 scale-105"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {page}
          </Link>
        );
      })}

      {/* ➡️ BUTTON NEXT */}
      {currentPage < totalPages ? (
        <Link
          href={buildLink(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors ml-1 sm:ml-3"
        >
          <span className="hidden sm:inline">Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      ) : (
        <div className="flex items-center gap-1 px-3 py-2 opacity-30 cursor-not-allowed ml-1 sm:ml-3 text-slate-400">
          <span className="hidden sm:inline">Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      )}

    </div>
  );
}