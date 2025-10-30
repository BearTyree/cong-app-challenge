import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { authenticated } from "@/controllers/auth";
import { getDbAsync } from "@/lib/drizzle";
import { FORM_LIMITS } from "@/lib/listing";
import { listingTable } from "@/lib/schema";
import { canEditListing } from "@/lib/auth-helpers";

const updateListingSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  category: z.string().min(1).max(64).optional(),
  condition: z.string().min(1).max(32).optional(),
  description: z.string().min(20).max(1000).optional(),
  images: z
    .array(z.string().min(5))
    .min(1)
    .max(FORM_LIMITS.maxImages)
    .optional(),
  pickupAddress: z.string().min(10).max(255).optional(),
  pickupInstructions: z
    .string()
    .max(500)
    .optional()
    .or(z.literal("").optional()),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const userEmail = await authenticated();

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const listingId = Number(id);

  if (Number.isNaN(listingId)) {
    return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
  }

  // Check if user owns this listing
  const canEdit = await canEditListing(listingId, userEmail);
  if (!canEdit) {
    return NextResponse.json(
      { error: "You do not have permission to edit this listing" },
      { status: 403 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = updateListingSchema.safeParse(payload);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation error", details: result.error.format() },
      { status: 400 }
    );
  }

  const db = await getDbAsync();

  try {
    // Build update object with only provided fields
    const updateData: Partial<typeof listingTable.$inferInsert> = {};

    if (result.data.title !== undefined) updateData.title = result.data.title;
    if (result.data.category !== undefined) updateData.category = result.data.category;
    if (result.data.condition !== undefined) updateData.condition = result.data.condition;
    if (result.data.description !== undefined) updateData.description = result.data.description;
    if (result.data.images !== undefined) updateData.images = result.data.images;
    if (result.data.pickupAddress !== undefined) updateData.pickupAddress = result.data.pickupAddress;
    if (result.data.pickupInstructions !== undefined) {
      updateData.pickupInstructions =
        result.data.pickupInstructions && result.data.pickupInstructions.length > 0
          ? result.data.pickupInstructions
          : null;
    }

    await db
      .update(listingTable)
      .set(updateData)
      .where(eq(listingTable.id, listingId));

    return NextResponse.json({ success: true, id: listingId }, { status: 200 });
  } catch (error) {
    console.error("Failed to update listing", error);

    const message =
      error instanceof Error ? error.message : "Unknown database error.";

    return NextResponse.json(
      {
        error: "Failed to update listing.",
        details: message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const userEmail = await authenticated();

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const listingId = Number(id);

  if (Number.isNaN(listingId)) {
    return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
  }

  // Check if user owns this listing
  const canEdit = await canEditListing(listingId, userEmail);
  if (!canEdit) {
    return NextResponse.json(
      { error: "You do not have permission to delete this listing" },
      { status: 403 }
    );
  }

  const db = await getDbAsync();

  try {
    await db.delete(listingTable).where(eq(listingTable.id, listingId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete listing", error);

    const message =
      error instanceof Error ? error.message : "Unknown database error.";

    return NextResponse.json(
      {
        error: "Failed to delete listing.",
        details: message,
      },
      { status: 500 }
    );
  }
}
