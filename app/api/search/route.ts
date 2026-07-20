import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q") || "";

    if (!query.trim() || query.length < 2) {
      return NextResponse.json([]);
    }

    const url = `https://api.mangadex.org/manga?limit=5&includes[]=cover_art&title=${encodeURIComponent(query)}`;
    
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const json = await res.json();
    const data = json.data || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped = data.map((manga: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const coverRel = manga.relationships.find((r: any) => r.type === "cover_art");
      const fileName = coverRel?.attributes?.fileName;
      return {
        id: manga.id,
        title: manga.attributes.title.en || manga.attributes.title.ja || Object.values(manga.attributes.title)[0] || "Untitled",
        cover: fileName 
          ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg` 
          : "https://placehold.co/100x150/1e293b/fff?text=No+Cover",
      };
    });

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Proxy API Error:", error);
    return NextResponse.json([]);
  }
}