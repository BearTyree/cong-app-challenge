"use client"
import { useState } from "react"
import Link from "next/link"
import ImageGallery from "@/components/ImageGallery"
import ItemDetails from "@/components/ItemDetails"
import PickupInfo from "@/components/PickupInfo"
import TabSection from "@/components/TabSection"
import ItemGrid from "@/components/ItemGrid"
import ItemCard from "@/components/ItemCard"
import DescriptionTab from "@/components/DescriptionTab"
import GiverProfileTab from "@/components/GiverProfileTab"

export default function ListingPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("description")

  const listing = {
    id: params.id,
    title: "Wilson Pro Staff Tennis Racket",
    condition: "Gently Used",
    images: ["/rackets.png", "/rackets.png", "/rackets.png", "/rackets.png"],
    giver: {
      name: "John Smith",
      rating: 4.8,
      totalGiven: 23,
      memberSince: "2023",
      bio: "Local tennis enthusiast sharing equipment with the community."
    },
    pickup: {
      address: "123 Main Street, Downtown",
      availableDays: "Weekdays 6-8pm, Weekends anytime",
      distance: "2.3 miles away"
    },
    description: "Professional grade tennis racket in great condition. Used for about 6 months, switched to a different grip size. Perfect for intermediate to advanced players. Grip size 4 3/8. Includes original case. Pickup available weekdays after 6pm or anytime on weekends. Please text 30 minutes before arriving.",
    availableUntil: "Dec 31, 2024",
    listed: "2 days ago",
    views: 47
  }

  const similarItems = [
    { id: 2, name: "Tennis Shoes", src: "/rackets.png", condition: "Like New", distance: "1.2 miles" },
    { id: 3, name: "Tennis Balls (12 pack)", src: "/rackets.png", condition: "New", distance: "3.5 miles" },
    { id: 4, name: "Tennis Bag", src: "/rackets.png", condition: "Used", distance: "0.8 miles" },
    { id: 5, name: "Practice Net", src: "/rackets.png", condition: "Gently Used", distance: "4.1 miles" }
  ]

  const moreFromGiver = [
    { id: 6, name: "Golf Clubs Set", src: "/rackets.png", condition: "Used", distance: "Same location" },
    { id: 7, name: "Basketball", src: "/rackets.png", condition: "Like New", distance: "Same location" }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        <Link href="/" className="text-gray-600 hover:text-gray-900 mb-6 inline-block">
          ← Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ImageGallery images={listing.images} title={listing.title} />

          <div>
            <ItemDetails
              title={listing.title}
              condition={listing.condition}
              giver={listing.giver}
              availableUntil={listing.availableUntil}
              listed={listing.listed}
              views={listing.views}
              onRequestPickup={() => console.log("Request pickup")}
              onSave={() => console.log("Save")}
            />
            <PickupInfo
              address={listing.pickup.address}
              availableDays={listing.pickup.availableDays}
              distance={listing.pickup.distance}
            />
          </div>
        </div>

        <TabSection
          tabs={[
            {
              id: "description",
              label: "Description",
              content: <DescriptionTab description={listing.description} />
            },
            {
              id: "giver",
              label: "Giver's Profile",
              content: <GiverProfileTab giver={listing.giver} />
            }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <ItemGrid title="Similar Free Items Nearby">
          {similarItems.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              src={item.src}
              condition={item.condition}
              distance={item.distance}
            />
          ))}
        </ItemGrid>

        <ItemGrid title={`More from ${listing.giver.name}`}>
          {moreFromGiver.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              src={item.src}
              condition={item.condition}
              distance={item.distance}
            />
          ))}
        </ItemGrid>
      </div>
    </div>
  )
}