import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { authenticated } from "@/controllers/auth";
import { canEditListing } from "@/lib/auth-helpers";
import { getListingById } from "@/lib/listings";
import ListingForm from "@/components/forms/ListingForm";

interface ListingEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingEditPage({ params }: ListingEditPageProps) {
  const userEmail = await authenticated();

  if (!userEmail) {
    redirect("/login");
  }

  const { id } = await params;
  const listingId = Number(id);

  if (Number.isNaN(listingId)) {
    notFound();
  }

  // Check if user owns this listing
  const canEdit = await canEditListing(listingId, userEmail);
  if (!canEdit) {
    redirect("/");
  }

  const listing = await getListingById(listingId);

  if (!listing) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
        <Link
          href={`/listing/${listingId}`}
          className="text-gray-600 hover:text-gray-900 mb-6 inline-block"
        >
          ← Back to listing
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
          <p className="text-gray-600 mt-2">
            Update your listing information
          </p>
        </div>

        <ListingForm
          mode="edit"
          listingId={listingId}
          initialData={{
            title: listing.title,
            category: listing.category,
            condition: listing.condition,
            description: listing.description,
            images: listing.images,
            pickupAddress: listing.pickupAddress,
            pickupInstructions: listing.pickupInstructions,
          }}
        />
      </div>
    </div>
  );
}
