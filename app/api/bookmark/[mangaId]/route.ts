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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ mangaId: string }> } // ✅ Di Next.js 15+, params wajib bertipe Promise!
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as AuthenticatedUser | undefined;
  const userId = user?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // ✅ Amankan params asinkronus terlebih dahulu
    const resolvedParams = await params;
    const mangaId = resolvedParams.mangaId;

    await prisma.bookmark.deleteMany({
      where: {
        userId: userId,
        mangaId: mangaId
      }
    });

    return NextResponse.json({ message: "Bookmark berhasil dihapus." });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}