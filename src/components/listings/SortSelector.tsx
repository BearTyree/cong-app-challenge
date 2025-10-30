"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

type SortOption = {
  value: string;
  label: string;
  sortBy: "id" | "title";
  sortOrder: "asc" | "desc";
};

const SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "Newest First", sortBy: "id", sortOrder: "desc" },
  { value: "oldest", label: "Oldest First", sortBy: "id", sortOrder: "asc" },
  { value: "title-asc", label: "Title A-Z", sortBy: "title", sortOrder: "asc" },
  { value: "title-desc", label: "Title Z-A", sortBy: "title", sortOrder: "desc" },
];

export default function SortSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine current sort option from URL params
  const sortBy = (searchParams.get("sortBy") || "id") as "id" | "title";
  const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

  const currentSortOption =
    SORT_OPTIONS.find(
      (opt) => opt.sortBy === sortBy && opt.sortOrder === sortOrder
    )?.value || "newest";

  const handleSortChange = (value: string) => {
    const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value);

    if (!selectedOption) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", selectedOption.sortBy);
    params.set("sortOrder", selectedOption.sortOrder);

    // Reset to page 1 when sort changes
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="sort-selector" className="text-sm font-medium text-gray-700">
        Sort By
      </label>
      <Select value={currentSortOption} onValueChange={handleSortChange}>
        <SelectTrigger id="sort-selector" className="w-[180px]">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
