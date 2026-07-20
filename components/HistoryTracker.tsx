"use client";

import { useEffect, useRef } from "react";

interface HistoryTrackerProps {
  mangaId: string;
  chapterId: string;
  chapterNumber: string;
  title: string;
  coverUrl: string;
}

export default function HistoryTracker({
  mangaId,
  chapterId,
  chapterNumber,
  title,
  coverUrl,
}: HistoryTrackerProps) {
  // useRef mencegah eksekusi ganda akibat StrictMode React 19 di fase development
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    const trackReadingProgress = async () => {
      try {
        await fetch("/api/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mangaId,
            chapterId,
            chapterNumber,
            title,
            coverUrl,
          }),
        });
      } catch (err) {
        // Gagal mencatat log history tidak boleh membuat aplikasi client crash
        console.warn("[History Background Sync Failed]", err);
      }
    };

    trackReadingProgress();
  }, [mangaId, chapterId, chapterNumber, title, coverUrl]);

  return null; // Komponen murni bekerja di latar belakang
}