import { and, asc, desc, eq, like, notInArray, or, sql } from "drizzle-orm";

import { getDbAsync } from "@/lib/drizzle";
import { getPublicObjectUrl } from "@/lib/r2";
import { getCategoryLabel, getConditionLabel } from "@/lib/listing";
import { listingTable, profilesTable } from "@/lib/schema";

type ListingRow = typeof listingTable.$inferSelect;
export interface ListingCardData {
  id: number;
  title: string;
  category: string;
  categoryLabel: string;
  condition: string;
  conditionLabel: string;
  pickupAddress: string;
  primaryImage: string | null;
}

export interface ListingDetail extends ListingCardData {
  description: string;
  pickupInstructions: string | null;
  images: string[];
  createdByProfileId: number;
  createdByUsername: string;
}

export interface ListingFilters {
  search?: string;
  category?: string;
  tags?: string[];
  excludeIds?: number[];
  createdBy?: number;
}

export interface PaginatedListings {
  listings: ListingCardData[];
  total: number;
  page: number;
  pageSize: number;
}

const DEFAULT_PAGE_SIZE = 12;

/**
 * URL validation helpers
 */
const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);
const isDataUrl = (value: string) => value.startsWith("data:");
const isLocalPath = (value: string) =>
  value.startsWith("/") || value.startsWith("./") || value.startsWith("../");

/**
 * Converts an image key to a public URL.
 * Handles absolute URLs, data URLs, local paths, and R2 object keys.
 */
const toPublicImage = (key: string | null | undefined): string | null => {
  if (!key) {
    return null;
  }

  // Handle absolute URLs, data URLs, and local paths
  if (isAbsoluteUrl(key) || isDataUrl(key) || isLocalPath(key)) {
    return key.startsWith("./") || key.startsWith("../")
      ? key.replace(/^\.{1,2}\//, "/")
      : key;
  }

  // Handle public/ prefix
  if (key.startsWith("public/")) {
    return `/${key.slice("public/".length)}`;
  }

  // Assume it's an R2 object key
  return getPublicObjectUrl(key);
};

const normalizeImages = (images: ListingRow["images"]): string[] => {
  if (!images) {
    return [];
  }

  if (Array.isArray(images)) {
    return images.map(toPublicImage).filter(Boolean) as string[];
  }

  try {
    const parsed = JSON.parse(String(images));
    if (Array.isArray(parsed)) {
      return parsed.map(toPublicImage).filter(Boolean) as string[];
    }
  } catch {
    // ignore parse errors and fall back to empty list
  }

  return [];
};

/**
 * Resolves images for a listing row.
 * Returns the default window.svg image if no images are present.
 */
const resolveImages = (row: ListingRow) => {
  const images = normalizeImages(row.images);

  if (images.length > 0) {
    return {
      images,
      primaryImage: images[0],
    };
  }

  // Default to window.svg if no images
  return {
    images: ["/window.svg"],
    primaryImage: "/window.svg",
  };
};

const mapRowToCard = (row: ListingRow): ListingCardData => {
  const { primaryImage } = resolveImages(row);

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    categoryLabel: getCategoryLabel(row.category),
    condition: row.condition,
    conditionLabel: getConditionLabel(row.condition),
    pickupAddress: row.pickupAddress,
    primaryImage: primaryImage ?? null,
  };
};

const mapRowToDetail = (row: ListingRow): Omit<ListingDetail, "createdByProfileId" | "createdByUsername"> => {
  const resolved = resolveImages(row);

  return {
    ...mapRowToCard(row),
    description: row.description,
    pickupInstructions: row.pickupInstructions,
    images: resolved.images,
  };
};

const buildFilters = (filters?: ListingFilters) => {
  if (!filters) {
    return undefined;
  }

  const conditions = [];

  if (filters.search && filters.search.trim().length > 0) {
    const likeTerm = `%${filters.search.trim()}%`;
    conditions.push(
      or(
        like(listingTable.title, likeTerm),
        like(listingTable.description, likeTerm)
      )
    );
  }

  if (filters.category) {
    conditions.push(eq(listingTable.category, filters.category));
  }

  if (filters.createdBy !== undefined) {
    conditions.push(eq(listingTable.createdBy, filters.createdBy));
  }

  if (filters.excludeIds && filters.excludeIds.length > 0) {
    conditions.push(notInArray(listingTable.id, filters.excludeIds));
  }


  if (conditions.length === 0) {
    return undefined;
  }

  return and(...conditions);
};

export type SortBy = "id" | "title";
export type SortOrder = "asc" | "desc";

export async function getListingsPage(
  options: {
    page?: number;
    pageSize?: number;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
  } & ListingFilters = {}
): Promise<PaginatedListings> {
  const page = Math.max(options.page ?? 1, 1);
  const pageSize = Math.max(options.pageSize ?? DEFAULT_PAGE_SIZE, 1);
  const sortBy = options.sortBy ?? "id";
  const sortOrder = options.sortOrder ?? "desc";
  const offset = (page - 1) * pageSize;
  const whereClause = buildFilters(options);

  const db = await getDbAsync();

  // Build order by clause dynamically
  const sortColumn = sortBy === "id" ? listingTable.id : listingTable.title;
  const orderByClause = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

  const totalQuery = db
    .select({ value: sql<number>`count(${listingTable.id})` })
    .from(listingTable);

  const listingsQuery = db
    .select()
    .from(listingTable)
    .orderBy(orderByClause)
    .limit(pageSize)
    .offset(offset);

  const filteredTotalQuery = whereClause
    ? totalQuery.where(whereClause)
    : totalQuery;
  const filteredListingsQuery = whereClause
    ? listingsQuery.where(whereClause)
    : listingsQuery;

  const [totalResult, rows] = await Promise.all([
    filteredTotalQuery.get(),
    filteredListingsQuery.all(),
  ]);

  return {
    listings: rows.map(mapRowToCard),
    total: totalResult?.value ?? 0,
    page,
    pageSize,
  };
}

export async function getListingById(id: number): Promise<ListingDetail | null> {
  const db = await getDbAsync();

  const result = await db
    .select({
      listing: listingTable,
      profileId: profilesTable.id,
      profileUsername: profilesTable.username,
    })
    .from(listingTable)
    .innerJoin(profilesTable, eq(listingTable.createdBy, profilesTable.id))
    .where(eq(listingTable.id, id))
    .get();

  if (!result) {
    return null;
  }

  const detail = mapRowToDetail(result.listing);

  return {
    ...detail,
    createdByProfileId: result.profileId,
    createdByUsername: result.profileUsername,
  };
}
