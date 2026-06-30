import dotenv from "dotenv";
dotenv.config({ path: [`.env.${process.env.NODE_ENV || "dev"}`, ".env"] });
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME || process.env.DB_DATABASE!,
    ssl: false,
    // ssl: { rejectUnauthorized: false },
  },
});
