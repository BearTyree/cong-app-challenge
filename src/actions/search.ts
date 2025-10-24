"use server";

import { useRouter, useSearchParams } from "next/navigation";

export async function search(_: null, formData: FormData): Promise<void> {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`/search?${params.toString()}`);
  }
  const search = formData.get("search") as string;

  handleSearch(search);
}
