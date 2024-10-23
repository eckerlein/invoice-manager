import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/features/database/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: ":memory:",
  },
  verbose: false,
  strict: true,
  out: "./src-tauri/migrations",
});
