// app/components/MangaCardSkeleton.tsx
export default function MangaCardSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-[#121212] rounded-xl overflow-hidden border border-slate-200/80 dark:border-transparent animate-pulse shadow-sm dark:shadow-none flex flex-col"
        >
          {/* Skeleton Cover Image (aspect 2/3) */}
          <div className="w-full aspect-[2/3] bg-slate-200 dark:bg-zinc-800" />

          {/* Skeleton Title Text */}
          <div className="p-3 space-y-2">
            <div className="h-3.5 bg-slate-200 dark:bg-zinc-800 rounded-md w-full" />
            <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded-md w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
