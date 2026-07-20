// app/library/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

interface AuthenticatedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as AuthenticatedUser | undefined;
  const userId = user?.id;

  if (!userId) {
    redirect("/login");
  }

  // Tarik data bookmark/favorit aktif milik user
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Mengambil 6 riwayat terbaru secara paralel
  const histories = await prisma.history.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 6,
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d] text-slate-900 dark:text-slate-100 transition-colors duration-200 p-4 md:p-8 lg:p-12">
      <div className="max-w-[1600px] mx-auto space-y-12">
        {/* HEADER PROFILE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              MY LIBRARY
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Selamat datang kembali,{" "}
              <span className="text-orange-500 font-bold">
                {session?.user?.name || "User"}
              </span>
              .
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-bold bg-white dark:bg-[#181818] border border-slate-200 dark:border-zinc-800 px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shadow-sm dark:shadow-none self-start md:self-auto"
          >
            ← Beranda
          </Link>
        </div>

        {/* RIWAYAT BACA (LAST READ) */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase text-slate-500 dark:text-slate-400 flex items-center gap-2 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Terakhir Dibaca
          </h2>

          {histories.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#121212] rounded-2xl text-xs text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-transparent shadow-sm dark:shadow-none">
              Belum ada riwayat membaca. Silakan buka salah satu chapter komik
              terlebih dahulu.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {histories.map((hist) => (
                <Link
                  key={hist.id}
                  href={`/manga/${hist.mangaId}/${hist.chapterId}`}
                  className="flex items-center gap-4 p-3 bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-transparent hover:border-orange-500 dark:hover:border-orange-500 rounded-2xl group transition-all shadow-sm dark:shadow-none"
                >
                  {/* Tampilan Mini Cover untuk Riwayat Baca */}
                  <div className="w-12 h-16 bg-slate-100 dark:bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 dark:border-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        hist.coverUrl ||
                        "https://placehold.co/100x150/1e293b/fff?text=No+Cover"
                      }
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
                      {hist.title}
                    </span>
                    <span className="text-[11px] font-extrabold text-orange-500">
                      Chapter {hist.chapterNumber}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                      Dibaca:{" "}
                      {new Date(hist.updatedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="text-slate-400 dark:text-slate-600 group-hover:text-orange-500 transition-colors pr-1">
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

        {/* BOOKMARKS / FAVORIT */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase text-slate-500 dark:text-slate-400 flex items-center gap-2 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            Favorit ({bookmarks.length})
          </h2>

          {bookmarks.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#121212] rounded-3xl text-xs text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-transparent shadow-sm dark:shadow-none">
              Belum ada komik favorit yang disimpan.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {bookmarks.map((book) => (
                <Link
                  key={book.id}
                  href={`/manga/${book.mangaId}`}
                  className="group flex flex-col bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-transparent hover:border-orange-500 dark:hover:border-orange-500 rounded-2xl overflow-hidden transition-all shadow-sm dark:shadow-none"
                >
                  <div className="aspect-[2/3] w-full bg-slate-100 dark:bg-zinc-900 overflow-hidden relative border-b border-slate-100 dark:border-zinc-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 group-hover:text-orange-500 dark:group-hover:text-orange-400 line-clamp-2 transition-colors leading-tight">
                      {book.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
