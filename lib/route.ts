import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'; // Memastikan route ini tidak di-cache

export async function GET() {
  try {
    // Menggunakan kueri sederhana dan cepat untuk memeriksa koneksi database.
    // `$queryRaw` adalah pilihan yang baik karena langsung ke database.
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ status: "ok", message: "Koneksi database sehat." });
  } catch (error) {
    // 💡 DI-FIX: Hapus ': any' dan lakukan cast ke interface Error dengan properti opsional Prisma
    const err = error as Error & { code?: string; cause?: unknown };

    console.error("Pemeriksaan kesehatan database gagal:", err);
    
    // Mengembalikan pesan error yang detail untuk membantu debugging.
    return NextResponse.json(
      { 
        status: "error", 
        message: "Koneksi database gagal.",
        error: {
          name: err.name || "DatabaseError",
          message: err.message || "Terjadi kesalahan koneksi.",
          code: err.code, // Error dari Prisma memiliki kode
          cause: err.cause, // Error dari driver adapter mungkin punya `cause`
        }
      }, 
      { status: 500 }
    );
  }
}