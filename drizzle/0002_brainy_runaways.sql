ALTER TABLE `Listing` RENAME TO `Listings`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Listings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ownerId` integer NOT NULL,
	`title` text NOT NULL,
	`category` text,
	`condition` text NOT NULL,
	`description` text NOT NULL,
	`imageBucket` text NOT NULL,
	`pickupAddress` text NOT NULL,
	`pickupInstructions` text NOT NULL,
	`data` text NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_Listings`("id", "ownerId", "title", "category", "condition", "description", "imageBucket", "pickupAddress", "pickupInstructions", "data") SELECT "id", "ownerId", "title", "category", "condition", "description", "imageBucket", "pickupAddress", "pickupInstructions", "data" FROM `Listings`;--> statement-breakpoint
DROP TABLE `Listings`;--> statement-breakpoint
ALTER TABLE `__new_Listings` RENAME TO `Listings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;