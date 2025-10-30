ALTER TABLE `User` RENAME COLUMN "username" TO "email";--> statement-breakpoint
CREATE TABLE `Profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`username` text NOT NULL,
	`bio` text,
	`avatar` text,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP INDEX `User_username_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_unique` ON `User` (`email`);--> statement-breakpoint
ALTER TABLE `Listing` ADD `createdBy` integer REFERENCES Profile(id);