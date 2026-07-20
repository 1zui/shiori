// app/explore/actions.ts
"use server";

import { getMangaByGenre } from "@/lib/mangadex"; 

export interface ExploreMangaItem {
  id: string;
  title: string;
  coverUrl: string;
}

export type ExploreErrorType = "TIMEOUT" | "RATE_LIMIT" | "NETWORK_ERROR" | "API_ERROR";

export interface ExploreResponse {
  success: boolean;
  data: ExploreMangaItem[];
  errorType: ExploreErrorType | null;
  message: string;
}

export async function fetchMangaFromDexServer(
  genreName: string,
  category: string = "all"
): Promise<ExploreResponse> {
  try {
    // Teruskan parameter genre dan kategori terpilih
    const result = await getMangaByGenre(genreName, category, 1);
    
    if (!result.items || result.items.length === 0) {
      return {
        success: true,
        data: [],
        errorType: null,
        message: "Tidak ada komik yang cocok untuk kombinasi genre dan kategori ini."
      };
    }

    const mappedData: ExploreMangaItem[] = result.items.map((item) => ({
      id: item.id,
      title: item.title,
      coverUrl: item.cover,
    }));

    return {
      success: true,
      data: mappedData,
      errorType: null,
      message: "Data berhasil dimuat."
    };
  } catch (error) {
    console.error("[SHIORI BRIDGE EXPLORE ERROR]", error);
    return {
      success: false,
      data: [],
      errorType: "NETWORK_ERROR",
      message: "Gagal memproses data melalui modul network internal."
    };
  }
}