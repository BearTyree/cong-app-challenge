import Link from "next/link"
import { notFound } from "next/navigation"

import DescriptionTab from "@/components/DescriptionTab"
import ImageGallery from "@/components/ImageGallery"
import ItemCard from "@/components/ItemCard"
import ItemGrid from "@/components/ItemGrid"
import PickupInfo from "@/components/PickupInfo"
import RequestButton from "@/components/RequestButton"
import { getListingById, getListingsPage } from "@/lib/listings"

interface ListingPageProps {
  params?: Promise<{ id: string }>
}

export default async function ListingPage({ params }: ListingPageProps) {
  if (!params) {
    notFound()
  }

  const { id } = await params
  const listingId = Number(id)

  if (Number.isNaN(listingId)) {
    notFound()
  }

  const listing = await getListingById(listingId)

  if (!listing) {
    notFound()
  }

  const relatedListings = await getListingsPage({
    pageSize: 4,
    category: listing.category,
    excludeIds: [listing.id],
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20 space-y-12">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2 font-medium transition-colors"
        >
          <span aria-hidden="true">←</span>
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <ImageGallery images={listing.images} title={listing.title} />

          {/* Details Section */}
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>

            {/* Profile */}
            <Link
              href={`/profile/${listing.createdByProfileId}`}
              className="inline-flex items-center gap-3 hover:bg-gray-50 p-3 -ml-3 rounded-lg transition-colors group"
            >
              <div className="h-12 w-12 rounded-full bg-[#9bc27d] flex items-center justify-center text-white font-semibold text-lg group-hover:bg-[#78A75A] transition-colors">
                {listing.createdByUsername.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-[#78A75A] transition-colors">
                  {listing.createdByUsername}
                </p>
                <p className="text-sm text-gray-500">View profile →</p>
              </div>
            </Link>

            {/* Request Item Button */}
            <RequestButton />

            {/* Category + Condition */}
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-600">Category</dt>
                <dd className="font-semibold">{listing.categoryLabel}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Condition</dt>
                <dd className="font-semibold capitalize">{listing.conditionLabel}</dd>
              </div>
            </dl>

            {/* Item Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About this item</h2>
              <DescriptionTab description={listing.description} />
            </div>

            {/* Pickup Info */}
            <PickupInfo
              address={listing.pickupAddress}
              instructions={listing.pickupInstructions}
            />
          </div>
        </div>

        {/* Related Items Section */}
        {relatedListings.listings.length > 0 && (
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
        )}
      </div>
    </div>
  )
}
