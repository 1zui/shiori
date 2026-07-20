// app/profile/actions.ts
"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ExtendedSession {
  user?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function updateAvatarAction(formData: FormData) {
  try {
    const session = (await getServerSession(authOptions)) as ExtendedSession | null;
    
    if (!session?.user?.id) {
      return { success: false, message: "Sesi tidak valid atau telah kedaluwarsa." };
    }
    const userId = session.user.id;

    const file = formData.get("avatar") as File | null;
    if (!file || !(file instanceof File)) {
      return { success: false, message: "Berkas tidak ditemukan." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, message: "Ukuran berkas terlalu besar. Maksimal 2MB." };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return { success: false, message: "Format tidak didukung. Gunakan JPG, PNG, atau WEBP." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.type.split("/")[1];
    const fileName = `avatar-${userId}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    const filePath = path.join(uploadDir, fileName);

    try {
      await mkdir(uploadDir, { recursive: true });
      await writeFile(filePath, buffer);
    } catch (fsError) {
      console.error("[FS_WRITE_ERROR]", fsError);
      return { success: false, message: "Server gagal menulis berkas gambar." };
    }

    const accessibleUrl = `/uploads/avatars/${fileName}`;

    // Update database Prisma
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: accessibleUrl }, // 🎯 FIX: Sesuaikan properti ke 'avatar'
      });
    } catch (prismaError) {
      console.error("[PRISMA_DB_ERROR]", prismaError);
      return { success: false, message: "Gagal menyimpan tautan avatar ke database." };
    }

    revalidatePath("/profile");
    return { success: true, avatarUrl: accessibleUrl, message: "Foto profil berhasil diperbarui." };

  } catch (error) {
    console.error("[PROFILE_ACTION_GENERAL_ERROR]", error);
    return { success: false, message: "Terjadi gangguan sistem internal." };
  }
  
}

export async function deleteAccountAction() {
  try {
    const session = (await getServerSession(authOptions)) as ExtendedSession | null;
    
    if (!session?.user?.id) {
      return { success: false, message: "Sesi tidak valid atau telah kedaluwarsa." };
    }
    const userId = session.user.id;

    // Hapus user secara permanen dari database
    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true, message: "Akun Anda telah berhasil dihapus secara permanen." };
  } catch (error) {
    console.error("[DELETE_ACCOUNT_ERROR]", error);
    return { success: false, message: "Gagal menghapus akun. Silakan coba lagi nanti." };
  }
}