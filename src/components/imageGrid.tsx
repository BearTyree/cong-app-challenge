import ImageCard from "@/components/imageCard";
import { getListingsPage, SortBy, SortOrder } from "@/lib/listings";

interface ImageGridProps {
  query?: string;
  currentPage?: number;
  category?: string;
  tag?: string;
  pageSize?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

const DEFAULT_PAGE_SIZE = 18;

export default async function ImageGrid({
  query,
  currentPage = 1,
  category,
  tag,
  pageSize = DEFAULT_PAGE_SIZE,
  sortBy = "id",
  sortOrder = "desc",
}: ImageGridProps) {
  const { listings } = await getListingsPage({
    page: currentPage,
    pageSize,
    search: query,
    category,
    tags: tag ? [tag] : undefined,
    sortBy,
    sortOrder,
  });

  if (listings.length === 0) {
    return (
      <div className="w-full p-10 text-center text-gray-600 border border-dashed border-gray-300 rounded-xl">
        No listings match your filters yet. Try broadening your search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 box-border p-5 w-full">
      {listings.map((listing) => (
        <ImageCard
          key={listing.id}
          id={listing.id}
          title={listing.title}
          imageSrc={listing.primaryImage}
          condition={listing.conditionLabel}
          categoryLabel={listing.categoryLabel}
        />
      ))}
    </div>
  );
}
