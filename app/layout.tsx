import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // 💡 Import Footer
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHIORI - Comic Library",
  description: "Read your favorite manga & manhwa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        {/* 1. Bungkus paling luar pakai SessionProvider agar useSession di Navbar aktif */}
        <SessionProvider>
          {/* 2. Bungkus dengan ThemeProvider untuk Dark Mode */}
          <ThemeProvider>
            <Navbar />

            {/* 3. Bungkus children dengan main flex-1 agar footer selalu terdorong ke paling bawah */}
            <main className="flex-1">{children}</main>

            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
