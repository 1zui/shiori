export default function Home() {
  // Mock data untuk keperluan testing layout UI
  const mockManga = [
    { id: 1, title: "One Piece", genre: "Action, Adventure", cover: "https://placehold.co/400x600/1e293b/fff?text=One+Piece" },
    { id: 2, title: "Jujutsu Kaisen", genre: "Action, Supernatural", cover: "https://placehold.co/400x600/1e293b/fff?text=Jujutsu+Kaisen" },
    { id: 3, title: "Chainsaw Man", genre: "Action, Gore", cover: "https://placehold.co/400x600/1e293b/fff?text=Chainsaw+Man" },
    { id: 4, title: "Frieren", genre: "Adventure, Fantasy", cover: "https://placehold.co/400x600/1e293b/fff?text=Frieren" },
    { id: 5, title: "Oshi no Ko", genre: "Drama, Supernatural", cover: "https://placehold.co/400x600/1e293b/fff?text=Oshi+no+Ko" },
    { id: 6, title: "Solo Leveling", genre: "Action, Fantasy", cover: "https://placehold.co/400x600/1e293b/fff?text=Solo+Leveling" },
  ];

  const categories = ["All", "Action", "Adventure", "Romance", "Fantasy", "Drama", "Comedy"];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8 md:px-8 max-w-7xl mx-auto">
      
      {/* 1. Hero Section & Search Bar */}
      <section className="text-center my-12">
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
          SHIORI
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-400">
          Discover. Read. Continue your favorite manga.
        </p>
        
        {/* Search Input */}
        <div className="mt-6 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Cari manga favoritmu..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>
      </section>

      {/* 2. Genre / Category Filter */}
      <section className="mb-8 overflow-x-auto no-scrollbar flex gap-2 pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              category === "All"
                ? "bg-orange-600 text-white"
                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            {category}
          </button>
        ))}
      </section>

      {/* 3. Grid Manga Section */}
      <section>
        <h2 className="text-xl font-bold mb-4 tracking-tight">Manga Populer</h2>
        
        {/* Grid responsif: 2 kolom di HP, 4 di Tablet, 6 di Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mockManga.map((manga) => (
            <div 
              key={manga.id} 
              className="group bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-orange-500 transition-all duration-300 cursor-pointer"
            >
              {/* Cover Gambar */}
              <div className="aspect-[2/3] w-full bg-slate-800 relative overflow-hidden">
                <img 
                  src={manga.cover} 
                  alt={manga.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Info Manga */}
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate group-hover:text-orange-400 transition-colors">
                  {manga.title}
                </h3>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {manga.genre}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}