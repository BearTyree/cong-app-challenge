import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authenticated } from "@/controllers/auth";
import { getDbAsync } from "@/lib/drizzle";
import { FORM_LIMITS, WEEKDAYS } from "@/lib/listing";
import { listingTable } from "@/lib/schema";

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

type WeekdayValue = (typeof WEEKDAYS)[number]["value"];
const weekdayValues = WEEKDAYS.map((day) => day.value) as [
  WeekdayValue,
  ...WeekdayValue[]
];
const availabilityDayEnum = z.enum(weekdayValues);

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
  availabilityDays: z.array(availabilityDayEnum).min(1),
  availabilityTimeStart: z.string().regex(timeRegex),
  availabilityTimeEnd: z.string().regex(timeRegex),
}).refine((data) => {
  const [startHour, startMinute] = data.availabilityTimeStart.split(":").map(Number);
  const [endHour, endMinute] = data.availabilityTimeEnd.split(":").map(Number);
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  return endMinutes > startMinutes;
}, {
  message: "End time must be after start time",
  path: ["availabilityTimeEnd"],
});

export async function POST(request: NextRequest) {
  const username = await authenticated();

  if (!username) {
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
      availabilityDays: result.data.availabilityDays,
      availabilityTimeStart: result.data.availabilityTimeStart,
      availabilityTimeEnd: result.data.availabilityTimeEnd,
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
