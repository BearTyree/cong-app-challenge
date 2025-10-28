import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const usersTable = sqliteTable("User", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  passwordHash: text("passwordHash").notNull(),
  passwordSalt: text("passwordSalt").notNull(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  listings: many(listingsTable),
}));

export const listingsTable = sqliteTable("Listings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: integer("ownerId")
    .notNull()
    .references(() => usersTable.id),
  title: text("title").notNull(),
  category: text("category"),
  condition: text("condition").notNull(),
  description: text("description").notNull(),
  imageBucket: text("imageBucket").notNull(),
  pickupAddress: text("pickupAddress").notNull(),
  pickupInstructions: text("pickupInstructions").notNull(),
  availabilityDays: text("data", { mode: "json" }).notNull(),
});

export const listingsRelations = relations(listingsTable, ({ one }) => ({
  owner: one(usersTable, {
    fields: [listingsTable.ownerId],
    references: [usersTable.id],
  }),
}));
