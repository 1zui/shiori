// lib/validations.ts
import { z } from "zod";

const MangaDexIdSchema = z.string().uuid({ message: "ID Manga harus berupa UUID MangaDex yang valid" });

export const HistoryPayloadSchema = z.object({
  mangaId: MangaDexIdSchema,
  chapterId: z.string().min(1, { message: "Chapter ID tidak boleh kosong" }),
  chapterNumber: z.coerce.string().min(1, { message: "Nomor chapter harus valid" }),
  // 🎯 Tambahkan validasi wajib untuk metadata komik
  title: z.string().min(1, { message: "Judul manga wajib disertakan" }),
  coverUrl: z.string().min(1, { message: "Cover URL wajib disertakan" }),
});

export const BookmarkPayloadSchema = z.object({
  mangaId: MangaDexIdSchema,
});