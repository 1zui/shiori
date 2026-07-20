// app/api/rating/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { z } from "zod";

const context = "API_RATING";

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// 🎯 DI-FIX: Batasan rating diubah dari (.max(10)) menjadi maksimal 5 sesuai UI
const RatingSchema = z.object({
  mangaId: z.string().uuid({ message: "Manga ID harus berupa UUID valid" }),
  rating: z.number().int().min(1).max(5, { message: "Rating harus bernilai 1-5" }),
  comment: z.string().nullable().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mangaId = searchParams.get("mangaId");

    if (!mangaId) {
      return NextResponse.json({ error: "Manga ID is required" }, { status: 400 });
    }

    // 1. Ambil daftar ulasan detail beserta profil user
    const ratings = await prisma.rating.findMany({
      where: { mangaId },
      select: {
        id: true,
        userId: true,
        mangaId: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. 🎯 BARU: Kalkulasi rata-rata & jumlah total voter langsung lewat agregasi DB (Neon/Postgres)
    const stats = await prisma.rating.aggregate({
      where: { mangaId },
      _avg: {
        rating: true,
      },
      _count: {
        _all: true,
      },
    });

    // Format nilai rata-rata menjadi 1 angka di belakang koma (contoh: 4.5), default 0 jika belum ada voter
    const averageRating = stats._avg.rating ? Number(stats._avg.rating.toFixed(1)) : 0;
    const totalVoters = stats._count._all;

    // Return payload terstruktur untuk kebutuhan info bar dan list komentar
    return NextResponse.json({ 
      success: true, 
      data: {
        stats: {
          averageRating,
          totalVoters,
        },
        reviews: ratings,
      }
    });
  } catch (error) {
    logger.error(context, "Gagal mengambil data rating komik", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as ExtendedUser;
    if (!user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const body = await req.json();

    const payload = {
      mangaId: body.mangaId,
      rating: body.rating ?? body.value,
      comment: body.comment,
    };

    const parsed = RatingSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: "Bad Request", details: parsed.error.format() }, { status: 400 });
    }

    const { mangaId, rating, comment } = parsed.data;

    const userRating = await prisma.rating.upsert({
      where: {
        userId_mangaId: { userId, mangaId },
      },
      update: {
        rating,
        comment: comment || null,
        updatedAt: new Date(),
      },
      create: {
        userId,
        mangaId,
        rating,
        comment: comment || null,
      },
    });

    logger.info(context, `User ${userId} berhasil memberikan skor ${rating} ke manga ${mangaId}`);
    return NextResponse.json({ success: true, data: userRating });
  } catch (error) {
    logger.error(context, "Gagal menyimpan rating komik", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}