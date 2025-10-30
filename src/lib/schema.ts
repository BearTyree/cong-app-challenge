import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("User", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").unique().notNull(),
  passwordHash: text("passwordHash").notNull(),
  passwordSalt: text("passwordSalt").notNull(),
});

export const profilesTable = sqliteTable("Profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  username: text("username").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
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
    .default(["/window.svg"]),
  pickupAddress: text("pickupAddress").notNull(),
  pickupInstructions: text("pickupInstructions"),
  createdBy: integer("createdBy").references(() => profilesTable.id, {
    onDelete: "cascade",
  }),
});
