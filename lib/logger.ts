// lib/logger.ts

type LogLevel = "INFO" | "WARN" | "ERROR";

export const logger = {
  // 🎯 Menggunakan unknown menggantikan any agar lolos dari sensor ESLint
  log(level: LogLevel, context: string, message: string, error?: unknown) {
    const timestamp = new Date().toISOString();
    const errorDetail = error 
      ? ` | Details: ${error instanceof Error ? error.message : JSON.stringify(error)}` 
      : "";
    
    console.log(`[${timestamp}] [SHIORI-${level}] [${context}] => ${message}${errorDetail}`);
  },
  info(context: string, message: string) {
    this.log("INFO", context, message);
  },
  warn(context: string, message: string, error?: unknown) {
    this.log("WARN", context, message, error);
  },
  error(context: string, message: string, error?: unknown) {
    this.log("ERROR", context, message, error);
  }
};