"use client";

import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const [searchInput, setSearchInput] = useState<string>('');
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  function handleSearch(term: string, e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`/search?${params.toString()}`);
  }

  return (
    <form className="w-1/2 flex justify-center" onSubmit={(e) => handleSearch(searchInput, e)}>
      <Input
        type="text"
        placeholder="Search for anything"
        className="w-full rounded-full border-2"
        onChange={(e) => {
          setSearchInput(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      ></Input>
    </form>
    
  );
}
