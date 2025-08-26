CREATE TABLE `User` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`passwordHash` text NOT NULL,
	`passwordSalt` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `User_username_unique` ON `User` (`username`);