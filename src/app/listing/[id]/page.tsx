import ListingComponent from "@/components/ListingComponent";
import { authenticated } from "@/controllers/auth";
import { getDbAsync } from "@/lib/drizzle";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const db = await getDbAsync();

  const { id: idParam } = await params;

  const numericId = parseInt(idParam, 10);

  if (isNaN(numericId) || numericId.toString() !== idParam) {
    console.log("Invalid ID, not a number:", idParam);
    return notFound();
  }

  const id = numericId;

  const username = await authenticated();

  const user = await db.query.usersTable.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });

  let listing = await db.query.listingsTable.findFirst({
    where: (listings, { eq }) => eq(listings.id, id),
  });

  if (listing.ownerId !== user.id) {
    listing = null;
  }

  const similarItems = [
    {
      id: 2,
      name: "Tennis Shoes",
      src: "/rackets.png",
      condition: "Like New",
      distance: "1.2 miles",
    },
    {
      id: 3,
      name: "Tennis Balls (12 pack)",
      src: "/rackets.png",
      condition: "New",
      distance: "3.5 miles",
    },
    {
      id: 4,
      name: "Tennis Bag",
      src: "/rackets.png",
      condition: "Used",
      distance: "0.8 miles",
    },
    {
      id: 5,
      name: "Practice Net",
      src: "/rackets.png",
      condition: "Gently Used",
      distance: "4.1 miles",
    },
  ];

  const moreFromGiver = [
    {
      id: 6,
      name: "Golf Clubs Set",
      src: "/rackets.png",
      condition: "Used",
      distance: "Same location",
    },
    {
      id: 7,
      name: "Basketball",
      src: "/rackets.png",
      condition: "Like New",
      distance: "Same location",
    },
  ];

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 mb-6 inline-block">
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
=======
    <ListingComponent
      listing={listing}
      similarItems={similarItems}
      moreFromGiver={moreFromGiver}
    />
  );
}
>>>>>>> 75596f1c29b275322536524c296dea0719bf4052
