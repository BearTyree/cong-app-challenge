import { AppCarousel } from "@/components/appCarousel";
import ImageGrid from "@/components/imageGrid";
import FilterBar from "@/components/listings/FilterBar";
import Pagination from "@/components/listings/Pagination";
import { getListingsPage, SortBy, SortOrder } from "@/lib/listings";

interface LandingProps {
  searchParams?: {
    page?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default async function Dashboard({ searchParams }: LandingProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const category = searchParams?.category;
  const sortBy = (searchParams?.sortBy as SortBy) || "id";
  const sortOrder = (searchParams?.sortOrder as SortOrder) || "desc";

  // Fetch data to get total count for pagination
  const { total, pageSize } = await getListingsPage({
    page: currentPage,
    pageSize: 18,
    category,
    sortBy,
    sortOrder,
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-5">
      <AppCarousel />
{/*       <div className="my-2 flex flex-col justify-center items-center">
        <p className="text-4xl font-medium">
          A donation driven marketplace for communities
        </p>
        <p className="mb-3 text-xl italic">built by communities</p>
        <Link href="/listing/new">
          <Button className="bg-[#212121] cursor-pointer hover:bg-[#303030]">
            Donate Now
          </Button>
        </Link>
      </div> */}

      <div className="w-full">
        <p className="w-full font-bold mb-4 pt-8">Browse Available Items</p>

        <FilterBar />

        <ImageGrid
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
    </div>
  );
}
