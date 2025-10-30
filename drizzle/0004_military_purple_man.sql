PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Listing` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`condition` text NOT NULL,
	`description` text NOT NULL,
	`images` text DEFAULT '["/window.svg"]' NOT NULL,
	`pickupAddress` text NOT NULL,
	`pickupInstructions` text,
	`createdBy` integer NOT NULL,
	FOREIGN KEY (`createdBy`) REFERENCES `Profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Listing`("id", "title", "category", "condition", "description", "images", "pickupAddress", "pickupInstructions", "createdBy") SELECT "id", "title", "category", "condition", "description", "images", "pickupAddress", "pickupInstructions", "createdBy" FROM `Listing`;--> statement-breakpoint
DROP TABLE `Listing`;--> statement-breakpoint
ALTER TABLE `__new_Listing` RENAME TO `Listing`;--> statement-breakpoint
PRAGMA foreign_keys=ON;