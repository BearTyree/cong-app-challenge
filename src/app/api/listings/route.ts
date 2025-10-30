import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authenticated } from "@/controllers/auth";
import { getDbAsync } from "@/lib/drizzle";
import { FORM_LIMITS } from "@/lib/listing";
import { listingTable } from "@/lib/schema";
import { getCurrentUserProfile } from "@/lib/auth-helpers";

const createListingSchema = z.object({
  title: z.string().min(3).max(100),
  category: z.string().min(1).max(64),
  condition: z.string().min(1).max(32),
  description: z.string().min(20).max(1000),
  images: z
    .array(z.string().min(5))
    .min(1)
    .max(FORM_LIMITS.maxImages),
  pickupAddress: z.string().min(10).max(255),
  pickupInstructions: z
    .string()
    .max(500)
    .optional()
    .or(z.literal("").optional()),
});

export async function POST(request: NextRequest) {
  const userEmail = await authenticated();

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = createListingSchema.safeParse(payload);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation error", details: result.error.format() },
      { status: 400 }
    );
  }

  // Get the user's profile to set createdBy
  const userProfile = await getCurrentUserProfile(userEmail);
  if (!userProfile) {
    return NextResponse.json(
      { error: "User profile not found. Please contact support." },
      { status: 500 }
    );
  }

  const db = await getDbAsync();

  try {
    const listingToInsert: typeof listingTable.$inferInsert = {
      title: result.data.title,
      category: result.data.category,
      condition: result.data.condition,
      description: result.data.description,
      images: result.data.images,
      pickupAddress: result.data.pickupAddress,
      pickupInstructions:
        result.data.pickupInstructions && result.data.pickupInstructions.length > 0
          ? result.data.pickupInstructions
          : null,
      createdBy: userProfile.id,
    };

    const [insertedListing] = await db
      .insert(listingTable)
      .values(listingToInsert)
      .returning({ id: listingTable.id });

    if (!insertedListing) {
      return NextResponse.json(
        { error: "Listing saved but ID could not be determined." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: insertedListing.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create listing", error);

    const message =
      error instanceof Error ? error.message : "Unknown database error.";

    return NextResponse.json(
      {
        error: "Failed to create listing.",
        details: message,
      },
      { status: 500 }
    );
  }
}
