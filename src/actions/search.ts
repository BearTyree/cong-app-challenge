"use server";

import { redirect } from "next/navigation";

export async function search(_: null, formData: FormData): Promise<void> {
  const term = (formData.get("search") as string | null)?.trim();

  if (term) {
    const params = new URLSearchParams();
    params.set("query", term);
    redirect(`/search?${params.toString()}`);
  }

  redirect("/search");
}
