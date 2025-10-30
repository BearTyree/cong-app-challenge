import { authenticated } from "@/controllers/auth";
import ImageGrid from "@/components/imageGrid";
import FilterBar from "@/components/listings/FilterBar";
import Pagination from "@/components/listings/Pagination";
import { getListingsPage, SortBy, SortOrder } from "@/lib/listings";
import { redirect } from "next/navigation";

export default async function Search(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const category = searchParams?.category;
  const sortBy = (searchParams?.sortBy as SortBy) || "id";
  const sortOrder = (searchParams?.sortOrder as SortOrder) || "desc";

  // Fetch data to get total count for pagination
  const { total, pageSize } = await getListingsPage({
    page: currentPage,
    pageSize: 18,
    search: query,
    category,
    sortBy,
    sortOrder,
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="mx-auto w-full max-w-8xl px-6 flex justify-center align-center box-border pt-20">
      {(await authenticated()) ? (
        <div className="flex flex-col mx-auto w-full max-w-8xl px-6 justify-center align-center">
          <h1 className="font-semibold text-2xl mb-4">
            {query ? `Showing Results for '${query}'` : "Browse Listings"}
          </h1>

          <FilterBar />

          <ImageGrid
            query={query}
            currentPage={currentPage}
            category={category}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={total}
            pageSize={pageSize}
          />
        </div>
      ) : (
        redirect("/")
      )}
    </div>
  );
}
