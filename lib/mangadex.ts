// lib/mangadex.ts
import { logger } from "./logger"; 

export interface Manga {
  id: string;
  title: string;
  description: string;
  cover: string;
}

export interface PaginatedManga {
  items: Manga[];
  totalPages: number;
}

interface MangaDexTag {
  id?: string; 
  attributes: {
    name: Record<string, string>;
    group: string;
  };
}

interface MangaDexManga {
  id: string;
  attributes: {
    title: Record<string, string>;
    description: Record<string, string> | null | undefined | unknown;
    status?: string;
    year?: number;
    updatedAt?: string;
    tags: MangaDexTag[];
  };
  relationships: { type: string; attributes?: { fileName?: string } }[];
}

interface MangaDexChapter {
  id: string;
  attributes: {
    chapter: string | null;
    title: string | null;
    translatedLanguage: string;
  };
}

const BASE_URL = "https://api.mangadex.org";
const CUSTOM_HEADERS = {
  "User-Agent": "SHIORI-MangaStream-App/1.0.0 (https://github.com)",
  "Accept": "application/json",
};

export class MangaDexError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "MangaDexError";
  }
}

async function baseFetch<T>(
  url: string, 
  options: RequestInit = {}, 
  retries = 3, 
  baseDelay = 1000
): Promise<T> {
  let delay = baseDelay;
  const config: RequestInit = {
    ...options,
    headers: {
      ...CUSTOM_HEADERS,
      ...options.headers,
    },
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(url, { ...config, signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.status === 429) {
        if (attempt === retries) {
          throw new MangaDexError("Batas request MangaDex terlampaui (Rate Limited).", 429, "RATE_LIMITED");
        }
        await new Promise((res) => setTimeout(res, delay * 2));
        delay *= 2;
        continue;
      }

      if (response.status >= 500) {
        if (attempt === retries) {
          throw new MangaDexError(`Server MangaDex bermasalah (HTTP ${response.status}).`, response.status, "SERVER_ERROR");
        }
        await new Promise((res) => setTimeout(res, delay));
        delay *= 1.5;
        continue;
      }

      if (!response.ok) {
        throw new MangaDexError(`Gagal mengambil data dari MangaDex (HTTP ${response.status}).`, response.status, "BAD_REQUEST");
      }

      return await response.json() as T;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      const errObj = error as Record<string, unknown>;
      const isTimeout = errObj?.name === "AbortError" || errObj?.code === "ETIMEDOUT";
      const message = error instanceof Error ? error.message : "Gagal terhubung ke jaringan MangaDex.";

      if (attempt === retries) {
        if (isTimeout) {
          throw new MangaDexError("Koneksi terputus karena server MangaDex lambat merespons (Timeout).", 408, "TIMEOUT");
        }
        throw new MangaDexError(message, 500, "NETWORK_FAILED");
      }

      await new Promise((res) => setTimeout(res, delay));
      delay *= 1.5;
    }
  }
  throw new MangaDexError("Gagal mengeksekusi permintaan jaringan.", 500, "UNKNOWN_FAILURE");
}

async function fetchMangaData(url: string, limit: number): Promise<PaginatedManga> {
  try {
    const json = await baseFetch<{ data: MangaDexManga[]; total?: number }>(url, { next: { revalidate: 3600 } });
    const total = json.total || 0;
    const calculatedPages = Math.ceil(total / limit) || 1;
    
    return { 
      items: mapMangaData(json.data || []), 
      totalPages: Math.min(calculatedPages, 99) 
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const errObj = error as Record<string, unknown>;
    const code = errObj && typeof errObj === "object" && "code" in errObj ? String(errObj.code) : "UNKNOWN";
    
    logger.error("MANGADEX_FETCH", `Data listing failure [${code}]: ${message}`);
    return { items: [], totalPages: 1 };
  }
}

export async function getMixedPopularManga(searchQuery = "", page = 1, limit = 30): Promise<PaginatedManga> {
  const offset = (page - 1) * limit;
  if (searchQuery) {
    return fetchMangaData(`${BASE_URL}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&title=${encodeURIComponent(searchQuery)}`, limit);
  }
  return fetchMangaData(`${BASE_URL}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&order[followedCount]=desc&originalLanguage[]=ja&originalLanguage[]=ko&originalLanguage[]=zh`, limit);
}

export async function getPopularManga(searchQuery = "", page = 1, limit = 30): Promise<PaginatedManga> {
  const offset = (page - 1) * limit;
  let url = `${BASE_URL}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&order[followedCount]=desc&originalLanguage[]=ja`;
  if (searchQuery) url = `${BASE_URL}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&title=${encodeURIComponent(searchQuery)}`;
  return fetchMangaData(url, limit);
}

export async function getPopularManhwa(page = 1, limit = 30): Promise<PaginatedManga> {
  const offset = (page - 1) * limit;
  return fetchMangaData(`${BASE_URL}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&order[followedCount]=desc&originalLanguage[]=ko`, limit);
}

export async function getPopularManhua(page = 1, limit = 30): Promise<PaginatedManga> {
  const offset = (page - 1) * limit;
  return fetchMangaData(`${BASE_URL}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&order[followedCount]=desc&originalLanguage[]=zh`, limit);
}

function mapMangaData(data: MangaDexManga[]): Manga[] {
  if (!data || !Array.isArray(data)) return [];
  return data.map((manga) => {
    const coverRel = manga.relationships?.find((r) => r.type === "cover_art");
    const fileName = coverRel?.attributes?.fileName;
    const tObj = manga.attributes?.title || {};
    const dObj = manga.attributes?.description as Record<string, string> | null | undefined;
    
    const secureTitle = tObj.en || tObj["ja-ro"] || tObj["ko-ro"] || tObj["zh-ro"] || tObj.ja || tObj.ko || tObj.zh || Object.values(tObj)[0] || "Untitled";
    let secureDesc = "Tidak ada deskripsi tambahan untuk komik ini.";
    if (dObj && typeof dObj === "object" && !Array.isArray(dObj)) {
      secureDesc = dObj.en || Object.values(dObj)[0] || secureDesc;
    }
    return {
      id: manga.id,
      title: secureTitle,
      description: secureDesc,
      cover: fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg` : "https://placehold.co/400x600/1e293b/fff?text=No+Cover",
    };
  });
}

export async function getMangaDetail(id: string) {
  try {
    if (!id || id === "undefined") return null;
    
    const json = await baseFetch<{ data: MangaDexManga }>(`${BASE_URL}/manga/${id}?includes[]=cover_art`, { cache: "no-store" });
    const manga = json.data;
    if (!manga) return null;

    const coverRel = manga.relationships?.find((r) => r.type === "cover_art");
    const fileName = coverRel?.attributes?.fileName;
    const tObj = manga.attributes?.title || {};
    const dObj = manga.attributes?.description as Record<string, string> | null | undefined;

    const secureTitle = tObj.en || tObj["ja-ro"] || tObj["ko-ro"] || tObj["zh-ro"] || tObj.ja || tObj.ko || tObj.zh || Object.values(tObj)[0] || "Untitled";
    let secureDesc = "Tidak ada deskripsi tambahan untuk komik ini.";
    if (dObj && typeof dObj === "object" && !Array.isArray(dObj)) {
      secureDesc = dObj.en || Object.values(dObj)[0] || secureDesc;
    }
    
    const genres = (manga.attributes?.tags || [])
      .filter((t) => t?.attributes?.group === "genre")
      .map((t) => t?.attributes?.name?.en || Object.values(t?.attributes?.name || {})[0] || "");

    const dateObj = manga.attributes?.updatedAt ? new Date(manga.attributes.updatedAt) : null;
    const lastUpdate = dateObj ? dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "N/A";

    return {
      id: manga.id,
      title: secureTitle,
      description: secureDesc,
      cover: fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}` : "https://placehold.co/400x600/1e293b/fff?text=No+Cover",
      status: manga.attributes?.status,
      year: manga.attributes?.year,
      genres,
      lastUpdate
    };
  } catch (error: unknown) { 
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("MANGADEX_DETAIL", `Failed to get profile for id ${id}: ${message}`);
    return null; 
  }
}

export async function getMangaChapters(id: string) {
  try {
    const json = await baseFetch<{ data: MangaDexChapter[] }>(`${BASE_URL}/manga/${id}/feed?limit=100&order[chapter]=asc`);
    const data = json.data || [];
    
    return data.map((chap) => ({ 
      id: chap.id, 
      chapter: chap.attributes?.chapter || "0", 
      title: chap.attributes?.title || "",
      language: (chap.attributes?.translatedLanguage || "RAW").toUpperCase()
    }));
  } catch (error: unknown) { 
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("MANGADEX_CHAPTERS", `Failed to fetch feed list for id ${id}: ${message}`);
    return []; 
  }
}

export async function getChapterImages(chapterId: string) {
  try {
    interface ChapterImagesResponse {
      baseUrl: string;
      chapter: {
        hash: string;
        data: string[];
      };
    }

    const json = await baseFetch<ChapterImagesResponse>(`https://api.mangadex.org/at-home/server/${chapterId}`);
    if (!json || !json.chapter || !json.baseUrl) {
      throw new MangaDexError("Struktur respons gambar tidak sesuai.", 500, "INVALID_RESPONSE");
    }
    
    const pageFiles = json.chapter.data;
    return pageFiles.map((file) => `${json.baseUrl}/data/${json.chapter.hash}/${file}`);
  } catch (error: unknown) { 
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("MANGADEX_IMAGES", `Failed to resolve server pages for chapter ${chapterId}: ${message}`);
    return []; 
  }
}

export async function getMangaByGenre(genreName: string, category = "all", page = 1, limit = 20): Promise<PaginatedManga> {
  const offset = (page - 1) * limit;
  
  try {
    const tagJson = await baseFetch<{ data: MangaDexTag[] }>(`${BASE_URL}/manga/tag`, { next: { revalidate: 86400 } });
    
    const foundTag = tagJson.data?.find(
      (t) => t.attributes?.name?.en?.toLowerCase() === genreName.toLowerCase()
    );
    
    const tagId = foundTag?.id;
    if (!tagId) {
      logger.error("MANGADEX_GENRE_TAG", `Tag untuk genre "${genreName}" tidak ditemukan.`);
      return { items: [], totalPages: 1 };
    }

    let url = `${BASE_URL}/manga?limit=${limit}&offset=${offset}&includedTags[]=${tagId}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&order[followedCount]=desc`;
    
    if (category === "manga") url += "&originalLanguage[]=ja";
    else if (category === "manhwa") url += "&originalLanguage[]=ko";
    else if (category === "manhua") url += "&originalLanguage[]=zh";
    
    return await fetchMangaData(url, limit);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("MANGADEX_GENRE_FETCH", `Gagal memuat listing genre ${genreName}: ${message}`);
    return { items: [], totalPages: 1 };
  }
}