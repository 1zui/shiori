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

// Fungsi untuk mengambil detail informasi 1 manga
export async function getMangaDetail(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/manga/${id}?includes[]=cover_art`);
    if (!res.ok) throw new Error("Gagal mengambil detail manga");
    
    const json = await res.json();
    const manga = json.data;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coverRel = manga.relationships.find((r: any) => r.type === "cover_art");
    const fileName = coverRel?.attributes?.fileName;
    const coverUrl = fileName 
      ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`
      : "https://placehold.co/400x600/1e293b/fff?text=No+Cover";

    return {
      id: manga.id,
      title: manga.attributes.title.en || manga.attributes.title.ja || Object.values(manga.attributes.title)[0] || "Untitled",
      description: manga.attributes.description.en || "Tidak ada deskripsi untuk manga ini.",
      cover: coverUrl,
      status: manga.attributes.status,
      year: manga.attributes.year,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Fungsi untuk mengambil daftar chapter dari manga tersebut
export async function getMangaChapters(id: string) {
  try {
    // Kita filter bahasa Inggris (en) biar daftar chapternya rapi dan berurutan
    const res = await fetch(`${BASE_URL}/manga/${id}/feed?limit=100&translatedLanguage[]=en&order[chapter]=asc`);
    if (!res.ok) throw new Error("Gagal mengambil daftar chapter");
    
    const json = await res.json();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return json.data.map((chap: any) => ({
      id: chap.id,
      chapter: chap.attributes.chapter || "0",
      title: chap.attributes.title || `Chapter ${chap.attributes.chapter}`,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fungsi untuk mengambil daftar URL gambar dari satu chapter
export async function getChapterImages(chapterId: string) {
  try {
    const res = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`);
    if (!res.ok) throw new Error("Gagal mengambil gambar chapter");
    
    const json = await res.json();
    const baseUrl = json.baseUrl;
    const hash = json.chapter.hash;
    const files = json.chapter.data; // Array berisi nama file gambar kualitas standar

    // Gabungkan jadi URL lengkap yang bisa langsung dibaca oleh tag <img>
    return files.map((file: string) => `${baseUrl}/data/${hash}/${file}`);
  } catch (error) {
    console.error(error);
    return [];
  }
}