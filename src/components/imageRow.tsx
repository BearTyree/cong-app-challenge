import ImageCard from "@/components/imageCard";
import { getListingsPage } from "@/lib/listings";

const DEFAULT_ROW_SIZE = 8;

export default async function ImageRow() {
  const { listings } = await getListingsPage({ pageSize: DEFAULT_ROW_SIZE });

  if (listings.length === 0) {
    return (
      <div className="w-full box-border p-5 text-center text-sm text-gray-600">
        No listings available yet. Check back soon!
      </div>
    );
  }

  return (
    <div className="flex gap-5 box-border p-5 overflow-x-auto w-full">
      {listings.map((listing) => (
        <div key={listing.id} className="min-w-[180px] max-w-[200px]">
          <ImageCard
            id={listing.id}
            title={listing.title}
            imageSrc={listing.primaryImage}
            condition={listing.conditionLabel}
            categoryLabel={listing.categoryLabel}
          />
        </div>
      ))}
    </div>
  );
}
