import { defineConfig } from "drizzle-kit";

const envUrl = process.env.DATABASE_URL || "";
// Use local database if Neon URL is broken/expired (contains neon.tech)
const dbUrl = envUrl.includes("neon.tech") || !envUrl
  ? "postgresql://runner@localhost:15432/stellar_dominion"
  : envUrl;

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});
