"use server";

import { getDbAsync } from "@/lib/drizzle";
import { authenticated } from "@/controllers/auth";

export async function createListing(
  previousState: null,
  formData: FormData
): Promise<void> {
  void previousState;
  void formData;

  await authenticated();
  await getDbAsync();

  // TODO: wire up listing creation once schema is finalized
}
