import Link from "next/link"
import { notFound } from "next/navigation"

import DescriptionTab from "@/components/DescriptionTab"
import ImageGallery from "@/components/ImageGallery"
import ItemCard from "@/components/ItemCard"
import ItemDetails from "@/components/ItemDetails"
import ItemGrid from "@/components/ItemGrid"
import PickupInfo from "@/components/PickupInfo"
import { formatAvailability, WeekDay } from "@/lib/listing"
import { getListingById, getListingsPage } from "@/lib/listings"

interface ListingPageProps {
  params: { id: string }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const listingId = Number(params.id)

  if (Number.isNaN(listingId)) {
    notFound()
  }

  const listing = await getListingById(listingId)

  if (!listing) {
    notFound()
  }

  const availabilitySummary = formatAvailability(
    listing.availabilityDays as WeekDay[],
    listing.availabilityTimeStart,
    listing.availabilityTimeEnd
  )

  const relatedListings = await getListingsPage({
    pageSize: 4,
    category: listing.category,
    excludeIds: [listing.id],
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20 space-y-12">
        <Link href="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2">
          <span aria-hidden="true">←</span>
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ImageGallery images={listing.images} title={listing.title} />

          <div className="space-y-8">
            <ItemDetails
              title={listing.title}
              categoryLabel={listing.categoryLabel}
              condition={listing.conditionLabel}
            />
            <PickupInfo
              address={listing.pickupAddress}
              availabilitySummary={availabilitySummary}
              instructions={listing.pickupInstructions}
            />
          </div>
        </div>

        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">About this item</h2>
          <DescriptionTab description={listing.description} />
        </section>

        {relatedListings.listings.length > 0 ? (
          <ItemGrid title={`More in ${listing.categoryLabel}`}>
            {relatedListings.listings.map((related) => (
              <ItemCard
                key={related.id}
                id={related.id}
                title={related.title}
                imageSrc={related.primaryImage}
                condition={related.conditionLabel}
                categoryLabel={related.categoryLabel}
              />
            ))}
          </ItemGrid>
        ) : null}
      </div>
    </div>
  )
}
