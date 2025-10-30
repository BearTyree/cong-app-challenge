import ProfileListingCard from "@/components/ProfileListingCard";
import { getProfileListings } from "@/lib/profiles";
import { SortBy, SortOrder } from "@/lib/listings";

interface ProfileImageGridProps {
  profileId: number;
  currentPage?: number;
  pageSize?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  showMenu?: boolean;
}

const DEFAULT_PAGE_SIZE = 18;

export default async function ProfileImageGrid({
  profileId,
  currentPage = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  sortBy = "id",
  sortOrder = "desc",
  showMenu = false,
}: ProfileImageGridProps) {
  const { listings } = await getProfileListings(profileId, {
    page: currentPage,
    pageSize,
    sortBy,
    sortOrder,
  });

  if (listings.length === 0) {
    return (
      <div className="w-full p-10 text-center text-gray-600 border border-dashed border-gray-300 rounded-xl">
        {showMenu
          ? "You haven't created any listings yet."
          : "This user hasn't created any listings yet."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 box-border p-5 w-full">
      {listings.map((listing) => (
        <ProfileListingCard
          key={listing.id}
          id={listing.id}
          title={listing.title}
          imageSrc={listing.primaryImage}
          condition={listing.conditionLabel}
          categoryLabel={listing.categoryLabel}
          showMenu={showMenu}
        />
      ))}
    </div>
  );
}
