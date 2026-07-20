import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const originalDatabaseUrl = process.env.DATABASE_URL;

if (!originalDatabaseUrl) {
  throw new Error("⚠️ DATABASE_URL environment variable is not configured in .env file!");
}

// 💡 DI-FIX: Optimalkan URL koneksi untuk lingkungan serverless dengan PgBouncer (Vercel Postgres, Neon, dll.)
// Menambahkan `pgbouncer=true` memberitahu Prisma untuk menggunakan mode yang kompatibel dengan connection pooler.
// Menambahkan `connection_limit=1` memastikan setiap instance fungsi serverless hanya menggunakan satu koneksi.
// Ini adalah best practice untuk mencegah error koneksi yang acak dan sulit dilacak.
const url = new URL(originalDatabaseUrl);
url.searchParams.set("pgbouncer", "true");
url.searchParams.set("connection_limit", "1");
const databaseUrl = url.toString();

// Inisialisasi koneksi Pool PG yang stabil
const pool =
  globalForPrisma.pool ||
  new Pool({
    connectionString: databaseUrl,
    max: 5,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 10000,
    ssl: {
      rejectUnauthorized: false,
    },
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}