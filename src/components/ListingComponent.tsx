"use client";
import { useState } from "react";
import Link from "next/link";
import ImageGallery from "@/components/ImageGallery";
import ItemDetails from "@/components/ItemDetails";
import PickupInfo from "@/components/PickupInfo";
import TabSection from "@/components/TabSection";
import ItemGrid from "@/components/ItemGrid";
import ItemCard from "@/components/ItemCard";
import DescriptionTab from "@/components/DescriptionTab";
import GiverProfileTab from "@/components/GiverProfileTab";
import { WEEKDAYS } from "@/lib/listing";

export default function ListingComponent({
  listing,
  similarItems,
  moreFromGiver,
}: {
  listing: {
    id: number;
    ownerId: number;
    title: string;
    category?: string | null;
    condition: string;
    description: string;
    imageBucket: string;
    pickupAddress: string;
    pickupInstructions: string;
    availabilityDays: string[];
  };
  similarItems: Array<{
    id: number;
    name: string;
    src: string;
    condition: string;
    distance: string;
  }>;
  moreFromGiver: Array<{
    id: number;
    name: string;
    src: string;
    condition: string;
    distance: string;
  }>;
}) {
  const [activeTab, setActiveTab] = useState("description");

  const images: string[] = ["/rackets.png"];

  const giver = {
    name: "Owner",
    rating: 5,
    totalGiven: 0,
    memberSince: "",
    bio: listing?.pickupInstructions || "",
  };

  const availabilityLabels = Array.isArray(listing?.availabilityDays)
    ? (listing.availabilityDays as string[])
        .map((d) => WEEKDAYS.find((w) => w.value === d)?.label || d)
        .join(", ")
    : "";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900 mb-6 inline-block"
        >
          ← Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ImageGallery images={images} title={listing.title} />

          <div>
            <ItemDetails
              title={listing.title}
              condition={listing.condition}
              giver={giver}
              availableUntil={"N/A"}
              listed={"Just now"}
              views={0}
              onRequestPickup={() => console.log("Request pickup")}
              onSave={() => console.log("Save")}
            />
            <PickupInfo
              address={listing.pickupAddress}
              availableDays={availabilityLabels}
              distance={"N/A"}
            />
          </div>
        </div>

        <TabSection
          tabs={[
            {
              id: "description",
              label: "Description",
              content: <DescriptionTab description={listing.description} />,
            },
            {
              id: "giver",
              label: "Giver's Profile",
              content: <GiverProfileTab giver={giver} />,
            },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <ItemGrid title="Similar Free Items Nearby">
          {similarItems.map(
            (item: {
              id: number;
              name: string;
              src: string;
              condition: string;
              distance: string;
            }) => (
              <ItemCard
                key={item.id}
                id={item.id}
                name={item.name}
                src={item.src}
                condition={item.condition}
                distance={item.distance}
              />
            )
          )}
        </ItemGrid>

        <ItemGrid title={`More from ${giver.name}`}>
          {moreFromGiver.map(
            (item: {
              id: number;
              name: string;
              src: string;
              condition: string;
              distance: string;
            }) => (
              <ItemCard
                key={item.id}
                id={item.id}
                name={item.name}
                src={item.src}
                condition={item.condition}
                distance={item.distance}
              />
            )
          )}
        </ItemGrid>
      </div>
    </div>
  );
}
