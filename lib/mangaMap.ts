export interface JikanMangaMetadata {
  title: string;
  title_english?: string | null;
  title_japanese?: string | null;
}

/**
 * Mencari kandidat kecocokan komik dari MangaDex berdasarkan metadata Jikan
 * dan mengembalikan MangaDex UUID yang valid.
 */
export async function resolveMangaDexId(jikanManga: JikanMangaMetadata): Promise<string | null> {
  const titlesToSearch = [
    jikanManga.title,
    jikanManga.title_english,
    jikanManga.title_japanese
  ].filter((t): t is string => Boolean(t));

  for (const title of titlesToSearch) {
    try {
      const response = await fetch(
        `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=5`,
        {
          headers: { "User-Agent": "ShioriPortfolioApp/1.0.0" }
        }
      );

      if (!response.ok) continue;

      const result = await response.json();
      if (result.data && result.data.length > 0) {
        // Mengembalikan ID dari hasil pencarian pertama yang paling relevan
        return result.data[0].id; // Mengembalikan MangaDex UUID
      }
    } catch (error) {
      console.error(`Gagal mencocokkan judul "${title}" ke MangaDex:`, error);
    }
  }

  return null;
}