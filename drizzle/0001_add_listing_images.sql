DROP TABLE IF EXISTS `Listing`;
CREATE TABLE `Listing` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`condition` text NOT NULL,
	`description` text NOT NULL,
	`images` text DEFAULT '[]' NOT NULL,
	`pickupAddress` text NOT NULL,
	`pickupInstructions` text,
	`availabilityDays` text DEFAULT '[]' NOT NULL,
	`availabilityTimeStart` text NOT NULL,
	`availabilityTimeEnd` text NOT NULL
);

