import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { cache } from "react";
import * as schema from "./schema";

type Schema = typeof schema;

export const getDb: () => DrizzleD1Database<Schema> = cache(() => {
  const { env } = getCloudflareContext();
  return drizzle(env.DB, { schema });
});

export const getDbAsync: () => Promise<DrizzleD1Database<Schema>> = cache(
  async () => {
    const { env } = await getCloudflareContext({ async: true });
    return drizzle(env.DB, { schema });
  }
);
