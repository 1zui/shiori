export interface Manga {
  id: string;
  title: string;
  description: string;
  cover: string;
}

const BASE_URL = "https://api.mangadex.org";

export async function getPopularManga(searchQuery = ""): Promise<Manga[]> {
  try {
    let url = `${BASE_URL}/manga?limit=12&includes[]=cover_art&order[followedCount]=desc`;
    
    if (searchQuery) {
      url = `${BASE_URL}/manga?limit=12&includes[]=cover_art&title=${encodeURIComponent(searchQuery)}`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Gagal mengambil data dari MangaDex");
    
    // FIX TYPO: Menggunakan res.json() yang benar untuk native fetch
    const json = await res.json();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return json.data.map((manga: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const coverRel = manga.relationships.find((r: any) => r.type === "cover_art");
      const fileName = coverRel?.attributes?.fileName;
      
      const coverUrl = fileName 
        ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`
        : "https://placehold.co/400x600/1e293b/fff?text=No+Cover";

      return {
        id: manga.id,
        title: manga.attributes.title.en || manga.attributes.title.ja || Object.values(manga.attributes.title)[0] || "Untitled",
        description: manga.attributes.description.en || "Tidak ada deskripsi.",
        cover: coverUrl,
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}