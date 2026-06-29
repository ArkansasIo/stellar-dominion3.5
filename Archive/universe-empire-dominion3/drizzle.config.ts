import { defineConfig } from "drizzle-kit";

const envUrl = process.env.DATABASE_URL || "";
const dbUrl = envUrl || "postgresql://runner@localhost:15432/stellar_dominion";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});
