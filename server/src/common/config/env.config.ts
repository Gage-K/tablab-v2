import "dotenv/config";

export const env = {
  DB_HOST: process.env.DB_HOST!,
  DB_USER: process.env.DB_USER!,
  DB_NAME: process.env.DB_NAME!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_PORT: parseInt(process.env.DB_PORT || "5432", 10),
  FE_API: process.env.FE_API!,
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
} as const;
