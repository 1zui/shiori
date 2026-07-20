// app/explore/actions.ts
"use server";

import dns from "dns";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Menggunakan optional catch binding tanpa variabel untuk mematuhi aturan eslint no-unused-vars
}

export interface ExploreMangaItem {
  id: string;
  title: string;
  coverUrl: string;
}

interface DexRelationship {
  id: string;
  type: string;
  attributes?: {
    fileName?: string;
  };
}

interface DexMangaItem {
  id: string;
  type: string;
  attributes?: {
    title?: Record<string, string>;
  };
  relationships?: DexRelationship[];
}

const GENRE_UUID_MAP: Record<string, string> = {
  action: "391b0423-db21-4d90-8d5d-0077ccd49732",
  adventure: "87cc5d0a-87f1-4d72-974d-d779758b3522",
  comedy: "4d32b4e2-12af-4a99-a710-8b9d47408d29",
  drama: "b9af3a63-f058-46de-a9a0-e0c139061c8a",
  fantasy: "cdc58590-57af-4a51-bc1e-d257b1161f36",
  horror: "cdad7e68-1419-41bb-bd56-9d0473df9d7d",
  mystery: "ee96339e-2ddd-49a0-ace1-f3b85524018b",
  romance: "423e2eae-a7a2-4a8b-ac03-a8351462d71d",
  "sci-fi": "256c827d-a97b-4dec-9a60-188acb590e67",
  "sci fi": "256c827d-a97b-4dec-9a60-188acb590e67",
};

// Mengembalikan nama fungsi asli agar kompatibel dengan file ExploreClient.tsx Anda
export async function fetchMangaFromDexServer(
  tagId: string,
  langCode: string = "",
  limit: number = 20,
): Promise<ExploreMangaItem[]> {
  try {
    const normalizedGenre = tagId ? tagId.toLowerCase().trim() : "";

    // Konversi otomatis dari nama teks biasa ("Action") atau gunakan langsung jika berupa UUID asli
    const finalTagId = GENRE_UUID_MAP[normalizedGenre] || tagId;

    if (!finalTagId || finalTagId.includes("semua")) {
      return [];
    }

    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    params.append("includedTags[]", finalTagId);
    params.append("includes[]", "cover_art");

    // Rating aman yang didukung penuh oleh API MangaDex
    params.append("contentRating[]", "safe");
    params.append("contentRating[]", "suggestive");
    params.append("contentRating[]", "erotica");

    params.append("order[followedCount]", "desc");

    // Jika UI Anda juga mengirimkan filter bahasa/kategori komik
    if (langCode) {
      const normalizedLang = langCode.toLowerCase().trim();
      if (normalizedLang === "manga" || normalizedLang === "ja") {
        params.append("originalLanguage[]", "ja");
      } else if (normalizedLang === "manhwa" || normalizedLang === "ko") {
        params.append("originalLanguage[]", "ko");
      } else if (normalizedLang === "manhua" || normalizedLang === "zh") {
        params.append("originalLanguage[]", "zh");
        params.append("originalLanguage[]", "zh-hk");
      }
    }

    const response = await fetch(
      `https://api.mangadex.org/manga?${params.toString()}`,
      {
        cache: "no-store",
        headers: {
          "User-Agent": "SHIORI-App/1.0.0",
        },
      },
    );

    if (!response.ok)
      throw new Error(`External API HTTP Error: ${response.status}`);

    const json = await response.json();
    if (!json.data || !Array.isArray(json.data)) return [];

    return json.data.map((manga: DexMangaItem) => {
      const coverObj = manga.relationships?.find(
        (r: DexRelationship) => r.type === "cover_art",
      );
      const fileName = coverObj?.attributes?.fileName || "";
      const titleObj = manga.attributes?.title || {};
      const title =
        titleObj.en ||
        titleObj["ja-ro"] ||
        Object.values(titleObj)[0] ||
        "Untitled Comic";

      const coverUrl = fileName
        ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
        : "https://placehold.co/256x384/121215/ffffff?text=No+Cover";

      return {
        id: manga.id,
        title,
        coverUrl,
      };
    });
  } catch (error) {
    console.error("─── [EXPLORE ENGINE ERROR CORE] ───\n", error);
    return [];
  }
}
