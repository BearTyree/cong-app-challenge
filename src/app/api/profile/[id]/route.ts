import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authenticated } from "@/controllers/auth";
import { getProfileById, updateProfile } from "@/lib/profiles";
import { canEditProfile } from "@/lib/auth-helpers";

const updateProfileSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  bio: z.string().max(500).optional().nullable(),
  avatar: z.string().min(5).optional().nullable(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const profileId = Number(id);

  if (Number.isNaN(profileId)) {
    return NextResponse.json({ error: "Invalid profile ID" }, { status: 400 });
  }

  const profile = await getProfileById(profileId);

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(profile, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const userEmail = await authenticated();

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const profileId = Number(id);

  if (Number.isNaN(profileId)) {
    return NextResponse.json({ error: "Invalid profile ID" }, { status: 400 });
  }

  // Check if user owns this profile
  const canEdit = await canEditProfile(profileId, userEmail);
  if (!canEdit) {
    return NextResponse.json(
      { error: "You do not have permission to edit this profile" },
      { status: 403 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = updateProfileSchema.safeParse(payload);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation error", details: result.error.format() },
      { status: 400 }
    );
  }

  try {
    await updateProfile(profileId, {
      username: result.data.username,
      bio: result.data.bio,
      avatar: result.data.avatar,
    });

    return NextResponse.json({ success: true, id: profileId }, { status: 200 });
  } catch (error) {
    console.error("Failed to update profile", error);

    const message =
      error instanceof Error ? error.message : "Unknown database error.";

    return NextResponse.json(
      {
        error: "Failed to update profile.",
        details: message,
      },
      { status: 500 }
    );
  }
}
