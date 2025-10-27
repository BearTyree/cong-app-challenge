import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const usersTable = sqliteTable("User", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  passwordHash: text("passwordHash").notNull(),
  passwordSalt: text("passwordSalt").notNull(),
});

export const listingTable = sqliteTable("Listing", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  title: text("title").notNull(),
  category: text("category"),
  description: text("description").notNull(),
});
