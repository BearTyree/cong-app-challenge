import { eq } from "drizzle-orm";
import { getDbAsync } from "@/lib/drizzle";
import { profilesTable, usersTable } from "@/lib/schema";
import { getListingsPage, ListingFilters, SortBy, SortOrder } from "@/lib/listings";
import { getPublicObjectUrl } from "@/lib/r2";

export interface ProfileData {
  id: number;
  userId: number;
  username: string;
  bio: string | null;
  avatar: string | null;
}

/**
 * Get profile by profile ID
 */
export async function getProfileById(profileId: number): Promise<ProfileData | null> {
  const db = await getDbAsync();

  const profile = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, profileId))
    .get();

  if (!profile) {
    return null;
  }

  // Convert avatar key to public URL if it exists
  const avatarUrl = profile.avatar ? getPublicObjectUrl(profile.avatar) : null;

  return {
    id: profile.id,
    userId: profile.userId,
    username: profile.username,
    bio: profile.bio,
    avatar: avatarUrl,
  };
}

/**
 * Get profile by user email (for currently authenticated user)
 */
export async function getProfileByUserEmail(email: string): Promise<ProfileData | null> {
  const db = await getDbAsync();

  const result = await db
    .select({
      id: profilesTable.id,
      userId: profilesTable.userId,
      username: profilesTable.username,
      bio: profilesTable.bio,
      avatar: profilesTable.avatar,
    })
    .from(profilesTable)
    .innerJoin(usersTable, eq(profilesTable.userId, usersTable.id))
    .where(eq(usersTable.email, email))
    .get();

  if (!result) {
    return null;
  }

  // Convert avatar key to public URL if it exists
  const avatarUrl = result.avatar ? getPublicObjectUrl(result.avatar) : null;

  return {
    id: result.id,
    userId: result.userId,
    username: result.username,
    bio: result.bio,
    avatar: avatarUrl,
  };
}

/**
 * Get all listings created by a profile
 * Reuses the existing getListingsPage function with createdBy filter
 */
export async function getProfileListings(
  profileId: number,
  options: {
    page?: number;
    pageSize?: number;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
  } & ListingFilters = {}
) {
  // Use the existing getListingsPage function with createdBy filter
  return getListingsPage({
    ...options,
    createdBy: profileId,
  });
}

/**
 * Update profile information
 */
export async function updateProfile(
  profileId: number,
  data: {
    username?: string;
    bio?: string | null;
    avatar?: string | null;
  }
): Promise<void> {
  const db = await getDbAsync();

  await db
    .update(profilesTable)
    .set({
      ...(data.username !== undefined && { username: data.username }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.avatar !== undefined && { avatar: data.avatar }),
    })
    .where(eq(profilesTable.id, profileId));
}
