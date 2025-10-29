import { and, desc, eq, like, notInArray, or, sql } from "drizzle-orm";

import { getDbAsync } from "@/lib/drizzle";
import { getPublicObjectUrl } from "@/lib/r2";
import { getCategoryLabel, getConditionLabel } from "@/lib/listing";
import { listingTable } from "@/lib/schema";

type ListingRow = typeof listingTable.$inferSelect;

export interface ListingCardData {
  id: number;
  title: string;
  category: string;
  categoryLabel: string;
  condition: string;
  conditionLabel: string;
  pickupAddress: string;
  availabilityDays: string[];
  availabilityTimeStart: string;
  availabilityTimeEnd: string;
  primaryImage: string | null;
}

export interface ListingDetail extends ListingCardData {
  description: string;
  pickupInstructions: string | null;
  images: string[];
}

export interface ListingFilters {
  search?: string;
  category?: string;
  tags?: string[];
  excludeIds?: number[];
}

export interface PaginatedListings {
  listings: ListingCardData[];
  total: number;
  page: number;
  pageSize: number;
}

const DEFAULT_PAGE_SIZE = 12;

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);
const isDataUrl = (value: string) => value.startsWith("data:");
const isLocalPath = (value: string) =>
  value.startsWith("/") || value.startsWith("./") || value.startsWith("../");

//these three functions are really bad but I don't care enough to fix them
const toPublicImage = (key: string | null | undefined): string | null => {
  if (!key) {
    return null;
  }

  if (isAbsoluteUrl(key) || isDataUrl(key) || isLocalPath(key)) {
    return key.startsWith("./") || key.startsWith("../")
      ? key.replace(/^\.{1,2}\//, "/")
      : key;
  }

  if (key.startsWith("public/")) {
    return `/${key.slice("public/".length)}`;
  }

  if (key.startsWith("seed://")) {
    return `/${key.slice("seed://".length)}`.replace(/\/{2,}/g, "/");
  }

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

const normalizeAvailabilityDays = (
  days: ListingRow["availabilityDays"]
): string[] => {
  if (!days) {
    return [];
  }

  if (Array.isArray(days)) {
    return days;
  }

  try {
    const parsed = JSON.parse(String(days));
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // ignore parse errors and fall back to empty array
  }

  return [];
};
//for seeding images, if no images are provided, use these fallback images
const FALLBACK_IMAGES = [
  "/banner_school.jpg",
  "/banner_tech.jpg",
  "/rackets.png",
  "/window.svg",
  "/globe.svg",
  "/logo.svg",
  "/file.svg",
];

const getFallbackImage = (id: number): string => {
  const index = Math.abs(id) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[index];
};
//again this should validated frontend but I  can't be bothered to go through it right now.
const resolveImages = (row: ListingRow) => {
  const images = normalizeImages(row.images);

  if (images.length > 0) {
    return {
      images,
      primaryImage: images[0],
    };
  }

  const fallback = getFallbackImage(row.id);
  return {
    images: [fallback],
    primaryImage: fallback,
  };
};

const mapRowToCard = (row: ListingRow): ListingCardData => {
  const { images, primaryImage } = resolveImages(row);

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    categoryLabel: getCategoryLabel(row.category),
    condition: row.condition,
    conditionLabel: getConditionLabel(row.condition),
    pickupAddress: row.pickupAddress,
    availabilityDays: normalizeAvailabilityDays(row.availabilityDays),
    availabilityTimeStart: row.availabilityTimeStart,
    availabilityTimeEnd: row.availabilityTimeEnd,
    primaryImage: primaryImage ?? null,
  };
};

const mapRowToDetail = (row: ListingRow): ListingDetail => {
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

  if (filters.excludeIds && filters.excludeIds.length > 0) {
    conditions.push(notInArray(listingTable.id, filters.excludeIds));
  }

  // Placeholder for future tag filtering once tags column exists.
  // if (filters.tags?.length) { ... }

  if (conditions.length === 0) {
    return undefined;
  }

  return and(...conditions);
};

export async function getListingsPage(
  options: {
    page?: number;
    pageSize?: number;
  } & ListingFilters = {}
): Promise<PaginatedListings> {
  const page = Math.max(options.page ?? 1, 1);
  const pageSize = Math.max(options.pageSize ?? DEFAULT_PAGE_SIZE, 1);
  const offset = (page - 1) * pageSize;
  const whereClause = buildFilters(options);

  const db = await getDbAsync();

  const totalQuery = db
    .select({ value: sql<number>`count(${listingTable.id})` })
    .from(listingTable);

  const listingsQuery = db
    .select()
    .from(listingTable)
    .orderBy(desc(listingTable.id))
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

  const row = await db
    .select()
    .from(listingTable)
    .where(eq(listingTable.id, id))
    .get();

  if (!row) {
    return null;
  }

  return mapRowToDetail(row);
}
