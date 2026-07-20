import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// 💡 DI-FIX: Interface khusus ExtendedUser untuk mematuhi strict ESLint
interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan Password wajib diisi!");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) throw new Error("Akun tidak ditemukan!");

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
        
        if (!isPasswordValid) throw new Error("Password salah, bro!");

        // 🎯 Memasukkan field 'avatar' dari DB ke properti 'image' NextAuth saat login pertama kali
        return {
          id: user.id,
          name: user.username,
          email: user.email,
          image: user.avatar, 
        };
      }
    })
  ],
  callbacks: {
    // 🎯 Menambahkan 'trigger' dan 'session' untuk menangkap update dari client-side
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
      }

      // 🎯 KONTROL UTAMA: Jika ada trigger update session gambar dari EditableAvatar.tsx
      if (trigger === "update" && session?.image) {
        token.image = session.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const extendedUser = session.user as ExtendedUser;
        
        // Teruskan data ID dari token ke sesi client
        if (typeof token.id === "string") {
          extendedUser.id = token.id;
        }
        
        // 🎯 Teruskan data gambar terbaru dari token ke sesi client secara reaktif
        if (typeof token.image === "string") {
          extendedUser.image = token.image;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };