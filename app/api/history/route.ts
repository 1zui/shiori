// app/api/history/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // 🎯 SEKARANG AMAN: Diimpor dari modul utilitas murni
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { HistoryPayloadSchema } from "@/lib/validations";

// ... Sisa kode fungsi POST ke bawah tetap sama persis seperti sebelumnya

export async function POST(req: Request) {
  const context = "API_HISTORY_TRACKING";

  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      logger.warn(context, "Percobaan tracking tanpa sesi login aktif.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    if (!userId) {
      logger.warn(context, "Session ditemukan tetapi User ID kosong.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = HistoryPayloadSchema.safeParse(body);
    
    if (!parsed.success) {
      logger.warn(context, `Validasi gagal: ${JSON.stringify(parsed.error.format())}`);
      return NextResponse.json({ error: "Bad Request", details: parsed.error.format() }, { status: 400 });
    }

    // 🎯 Tarik data title dan coverUrl hasil validasi Zod
    const { mangaId, chapterId, chapterNumber, title, coverUrl } = parsed.data;

    const historyRecord = await prisma.history.upsert({
      where: {
        userId_mangaId: {
          userId: userId,
          mangaId: mangaId,
        },
      },
      update: {
        chapterId,
        chapterNumber,
        title, // 🎯 Menyinkronkan judul jika ada perubahan
        coverUrl, // 🎯 Menyinkronkan cover terbaru
        updatedAt: new Date(),
      },
      create: {
        userId: userId,
        mangaId,
        chapterId,
        chapterNumber,
        title, // 🎯 Wajib disuplai sesuai isi schema.prisma
        coverUrl, // 🎯 Wajib disuplai sesuai isi schema.prisma
      },
    });

    logger.info(context, `User ${userId} mencatat history ${title} di chapter ${chapterNumber}`);
    return NextResponse.json({ success: true, data: historyRecord });

  } catch (error) {
    logger.error(context, "Terjadi kesalahan fatal saat menyimpan progress membaca", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}