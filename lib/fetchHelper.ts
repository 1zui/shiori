// lib/fetchHelper.ts

/**
 * Fungsi fetch pintar dengan fitur Auto-Retry jika terkena Timeout atau Rate Limit.
 */
export async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  retries = 3, 
  delay = 1000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    // Beri batas waktu 8 detik per percobaan, jika lewat dianggap timeout
    const timeoutId = setTimeout(() => controller.abort(), 8000); 

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "User-Agent": "SHIORI-App/1.0.0 (contact.shiori@gmail.com)",
          ...options.headers,
        }
      });
      
      clearTimeout(timeoutId);

      // Jika sukses, langsung kembalikan responnya
      if (response.ok) {
        return response;
      }

      // Jika terkena batas request (Too Many Requests / 429), tunggu lebih lama lalu coba lagi
      if (response.status === 429) {
        console.warn(`[MangaDex] Terkena rate limit (429). Mencoba kembali dalam ${delay * 2}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay * 2));
        continue;
      }

    } catch (err) { 
      // 💡 DI-FIX: Tangkap 'err' bawaan (bertipe unknown) untuk mematuhi rules ESLint
      clearTimeout(timeoutId);
      
      // 💡 DI-FIX: Cast secara aman ke tipe Error agar TypeScript bisa membaca properti '.message'
      const error = err as Error;

      // Jika ini percobaan terakhir, lempar erornya keluar
      if (i === retries - 1) {
        throw error;
      }

      console.warn(
        `[MangaDex] Gagal mengambil data (${error.message || "Timeout"}). ` +
        `Mencoba kembali (Percobaan ${i + 1}/${retries}) dalam ${delay}ms...`
      );
    }

    // Jeda waktu sebelum mencoba kembali
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error(`Gagal menghubungi API setelah ${retries} kali percobaan.`);
}