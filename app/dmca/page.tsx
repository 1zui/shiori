import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA Disclaimer - SHIORI",
  description: "Digital Millennium Copyright Act Notice",
};

export default function DmcaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-300 font-sans space-y-6">
      <h1 className="text-2xl font-black uppercase tracking-wider text-white border-b border-slate-800 pb-4">
        DMCA Disclaimer
      </h1>

      <p className="text-sm leading-relaxed">
        <strong>SHIORI</strong> memperlakukan kekayaan intelektual orang lain
        secara serius. Seluruh komik, gambar, dan konten di situs ini diperoleh
        dari berbagai sumber terbuka di internet dan tidak disimpan langsung di
        server internal kami.
      </p>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-white uppercase tracking-wide">
          Pemberitahuan Pelanggaran Hak Cipta
        </h2>
        <p className="text-sm leading-relaxed">
          Jika Anda adalah pemegang hak cipta atas suatu konten yang tampil di
          situs ini dan ingin meminta penghapusan (*takedown*), silakan kirimkan
          email ke tim kami dengan menyertakan detail berikut:
        </p>
        <ul className="list-disc list-inside text-xs space-y-2 pl-2 text-slate-400">
          <li>Bukti sah kepemilikan hak cipta atas karya yang dimaksud.</li>
          <li>URL spesifik (*direct link*) ke halaman komik di situs kami.</li>
          <li>
            Informasi kontak Anda yang dapat dihubungi (nama lengkap, email, dan
            alamat).
          </li>
        </ul>
      </div>

      <div className="pt-4 border-t border-slate-850">
        <p className="text-xs text-slate-500">
          Kirimkan laporan Anda ke:{" "}
          <span className="text-orange-500 font-mono">dmca@shiori.com</span>.
          Laporan akan diproses dalam waktu 1x24 jam kerja.
        </p>
      </div>
    </div>
  );
}

