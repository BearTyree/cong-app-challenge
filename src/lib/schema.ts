import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("User", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  passwordHash: text("passwordHash").notNull(),
  passwordSalt: text("passwordSalt").notNull(),
});

export const listingTable = sqliteTable("Listing", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  title: text("title").notNull(),
  category: text("category").notNull(),
  condition: text("condition").notNull(),
  description: text("description").notNull(),
  images: text("images", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  pickupAddress: text("pickupAddress").notNull(),
  pickupInstructions: text("pickupInstructions"),
  availabilityDays: text("availabilityDays", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  availabilityTimeStart: text("availabilityTimeStart").notNull(),
  availabilityTimeEnd: text("availabilityTimeEnd").notNull(),
});
