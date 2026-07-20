import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - SHIORI",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-300 font-sans space-y-6">
      <h1 className="text-2xl font-black uppercase tracking-wider text-white border-b border-slate-800 pb-4">
        Kebijakan Privasi
      </h1>

      <p className="text-sm leading-relaxed">
        Kebijakan Privasi ini menjelaskan bagaimana SHIORI mengelola dan
        melindungi informasi pribadi pengguna saat menggunakan layanan kami.
      </p>

      <div className="space-y-4 text-sm">
        <div>
          <h2 className="font-bold text-white mb-1">
            1. Informasi yang Kami Kumpulkan
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Kami mengumpulkan data akun seperti username dan email saat Anda
            mendaftar, serta data log teknis seperti preferensi tema dan riwayat
            bacaan lokal.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-white mb-1">2. Penggunaan Cookies</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Kami menggunakan cookie untuk menyimpan sesi login dan mengingat
            daftar komik yang Anda bookmark di perangkat Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
