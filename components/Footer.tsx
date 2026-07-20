import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-100 dark:bg-[#121212] border-t border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 font-sans transition-colors duration-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Col 1: Brand & Disclaimer */}
          <div className="space-y-3">
            <Link href="/" className="inline-block text-lg font-black tracking-wider text-slate-900 dark:text-white uppercase">
              SHI<span className="text-orange-500">ORI</span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Perpustakaan digital baca manga & manhwa online terupdate. Ringan, cepat, dan nyaman di semua perangkat.
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-600 leading-relaxed pt-1">
              Disclaimer: Semua konten komik disediakan oleh pihak ketiga dan tidak disimpan di server kami.
            </p>
          </div>

          {/* Col 2: Navigasi Utama */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Navigasi
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/manga" className="hover:text-orange-500 transition-colors">
                  Daftar Manga
                </Link>
              </li>
              <li>
                <Link href="/popular" className="hover:text-orange-500 transition-colors">
                  Populer
                </Link>
              </li>
              <li>
                <Link href="/latest" className="hover:text-orange-500 transition-colors">
                  Rilis Terbaru
                </Link>
              </li>
              <li>
                <Link href="/bookmark" className="hover:text-orange-500 transition-colors">
                  Bookmark
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Informasi & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Informasi
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dmca" className="hover:text-orange-500 transition-colors">
                  DMCA Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-orange-500 transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-orange-500 transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-500 transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Komunitas */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Komunitas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Gabung grup komunitas SHIORI untuk info rilis chapter terbaru dan diskusi.
            </p>
            <div className="flex gap-2 pt-1">
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-white dark:bg-[#181818] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm"
              >
                Discord
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-white dark:bg-[#181818] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm"
              >
                Telegram
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-850/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} SHIORI Comic Library. All rights reserved.</p>
          <p>Built for comic readers.</p>
        </div>
      </div>
    </footer>
  );
}