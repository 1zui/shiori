import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

interface AuthenticatedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// 🔍 GET: Menangani list semua bookmark ATAU cek status satu komik
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as AuthenticatedUser | undefined;
    const userId = user?.id;

    const { searchParams } = new URL(req.url);
    const mangaId = searchParams.get("mangaId");

    // 💡 DI-FIX: Jika user belum login, jangan bikin frontend crash.
    // Kembalikan status JSON valid bahwa komik ini tidak di-bookmark.
    if (!userId) {
      if (mangaId) {
        return NextResponse.json({ isBookmarked: false });
      }
      return NextResponse.json([], { status: 401 });
    }

    // 💡 KONDISI 1: Jika frontend mengirim ?mangaId=xxx (Digunakan oleh BookmarkButton)
    if (mangaId) {
      const bookmark = await prisma.bookmark.findFirst({
        where: {
          userId: userId,
          mangaId: mangaId,
        },
      });
      
      return NextResponse.json({ isBookmarked: !!bookmark });
    }

    // 💡 KONDISI 2: Jika frontend tidak mengirim parameter (Digunakan oleh Halaman Library)
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("GET Bookmark Error:", error);
    // Selalu kembalikan JSON valid agar res.json() di frontend tidak jebol
    return NextResponse.json({ isBookmarked: false, error: "Database timeout" }, { status: 500 });
  }
}

// 🔄 POST: (Tetap biarkan sama seperti kode sebelumnya)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as AuthenticatedUser | undefined;
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { mangaId, title, coverUrl } = await req.json();

    if (!mangaId || !title) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_mangaId: { userId, mangaId }
      },
      update: {},
      create: { userId, mangaId, title, coverUrl }
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("Bookmark POST Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}