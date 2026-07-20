import "dotenv/config";

// 💡 SELESAI: Konfigurasi objek literal standar Prisma 7 untuk menyuplai URL ke CLI (Migrate/Db Push)
export default {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};