CREATE TABLE `Listing` (
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
