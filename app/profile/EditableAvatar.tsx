// app/profile/EditableAvatar.tsx
"use client";

import React, { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { updateAvatarAction } from "./actions";

interface EditableAvatarProps {
  initialImage: string | null | undefined;
  initials: string;
}

export default function EditableAvatar({
  initialImage,
  initials,
}: EditableAvatarProps) {
  const { update: updateSession } = useSession();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Maksimal berkas 2MB.");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await updateAvatarAction(formData);

      if (res.success) {
        // 🎯 Tambahkan timestamp cache-buster agar browser tidak mengunci gambar lama
        const newAvatarUrl = res.avatarUrl
          ? `${res.avatarUrl}?t=${Date.now()}`
          : localUrl;

        // 🎯 Cukup update session secara reaktif. Navbar akan otomatis ikut berubah.
        await updateSession({
          image: newAvatarUrl,
        });

        // window.location.reload() DIHAPUS agar tidak memutus proses async NextAuth
      } else {
        setErrorMsg(res.message);
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal terhubung ke server.");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center shrink-0 gap-2 select-none">
      <div className="relative w-24 h-24 group cursor-pointer">
        <div
          onClick={handleAvatarClick}
          className="w-full h-full rounded-2xl bg-black flex items-center justify-center text-neutral-400 text-2xl font-black shadow-lg border border-orange-500/30 overflow-hidden relative"
          title="Klik untuk mengubah foto profil"
        >
          {previewUrl || initialImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl || initialImage || ""}
              alt="User Avatar"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="transition-colors duration-350 group-hover:text-white">
              {initials}
            </span>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-250 flex items-center justify-center">
            {isUploading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            )}
          </div>
        </div>

        <div
          onClick={handleAvatarClick}
          className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#16161a] text-zinc-400 border border-neutral-800 rounded-full flex items-center justify-center shadow-md shadow-black/80 transition-all duration-200 group-hover:bg-white group-hover:text-black group-hover:border-white group-hover:scale-110 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.154-1.262a4 4 0 001.343-.885L17.5 5.5a2.122 2.122 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
          </svg>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />

      {errorMsg && (
        <span className="text-[10px] font-bold text-rose-500 block max-w-[150px] text-center leading-tight mt-1">
          {errorMsg}
        </span>
      )}
    </div>
  );
}
