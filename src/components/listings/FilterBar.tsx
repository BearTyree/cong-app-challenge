"use client";

import CategoryFilter from "./CategoryFilter";
import SortSelector from "./SortSelector";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function FilterBar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const hasActiveFilters =
    searchParams.has("category") ||
    searchParams.get("sortBy") !== "id" ||
    searchParams.get("sortOrder") !== "desc";

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Keep search query but clear filters
    params.delete("category");
    params.delete("sortBy");
    params.delete("sortOrder");
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        {/* Filters */}
        <CategoryFilter />
        <SortSelector />

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="self-start sm:self-end"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {(searchParams.has("category") || searchParams.has("query")) && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">Active filters:</span>

          {searchParams.has("category") && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md">
              Category: {searchParams.get("category")}
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("category");
                  params.delete("page");
                  router.push(`?${params.toString()}`);
                }}
                className="hover:bg-blue-100 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {searchParams.has("query") && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-sm rounded-md">
              Search: &quot;{searchParams.get("query")}&quot;
            </span>
          )}
        </div>
      )}
    </div>
  );
}
