import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "sqlite:///home/blahaj/src/cong-app-challenge/drizzle/local.sqlite",
  },
});
