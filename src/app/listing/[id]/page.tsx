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
    <ListingComponent
      listing={listing}
      similarItems={similarItems}
      moreFromGiver={moreFromGiver}
    />
  );
}
