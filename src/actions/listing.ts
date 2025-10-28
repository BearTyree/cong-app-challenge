"use server";

import { authenticated } from "@/controllers/auth";
import { redirect } from "next/navigation";

import { getDbAsync } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { listingsTable, usersTable } from "@/lib/schema";

export async function createListing(data: any): Promise<void> {
  const db = await getDbAsync();

  const username = await authenticated();

  if (!username) {
    return;
  }

  let insertedListing: any;

  try {
    const user = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.username, username),
    });

    if (!user) {
      return;
    }

    const result = await db
      .insert(listingsTable)
      .values({
        title: data.title,
        category: data.category,
        description: data.description,
        condition: data.condition,
        imageBucket: "placholder",
        pickupAddress: data.pickupAddress,
        pickupInstructions: data.pickupInstructions,
        availabilityDays: data.availabilityDays,
        ownerId: user.id,
      } as any)
      .returning();

    insertedListing = result[0];
  } catch (err) {
    console.log(err);
    return;
  }

  if (!insertedListing?.id) {
    return;
  }

  redirect("/listing/" + insertedListing.id);
}
