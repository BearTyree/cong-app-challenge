import { and, eq } from "drizzle-orm";
import { getDbAsync } from "@/lib/drizzle";
import { listingTable, profilesTable, usersTable } from "@/lib/schema";
import { getProfileByUserEmail } from "@/lib/profiles";

/**
 * Get the current user's profile from their email
 */
export async function getCurrentUserProfile(email: string) {
  return getProfileByUserEmail(email);
}

/**
 * Check if a user can edit a specific profile
 */
export async function canEditProfile(profileId: number, userEmail: string): Promise<boolean> {
  const db = await getDbAsync();

  const result = await db
    .select({ id: profilesTable.id })
    .from(profilesTable)
    .innerJoin(usersTable, eq(profilesTable.userId, usersTable.id))
    .where(and(eq(usersTable.email, userEmail), eq(profilesTable.id, profileId)))
    .get();

  return !!result;
}

/**
 * Check if a user can edit a specific listing
 */
export async function canEditListing(listingId: number, userEmail: string): Promise<boolean> {
  const db = await getDbAsync();

  const result = await db
    .select({ id: listingTable.id })
    .from(listingTable)
    .innerJoin(profilesTable, eq(listingTable.createdBy, profilesTable.id))
    .innerJoin(usersTable, eq(profilesTable.userId, usersTable.id))
    .where(and(eq(usersTable.email, userEmail), eq(listingTable.id, listingId)))
    .get();

  return !!result;
}
