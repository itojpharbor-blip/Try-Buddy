CREATE TABLE `profiles` (
	`owner_id` text PRIMARY KEY NOT NULL,
	`nickname` text NOT NULL,
	`school` text DEFAULT '' NOT NULL,
	`region` text DEFAULT '' NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `goals` ADD `opportunity_id` text;--> statement-breakpoint
ALTER TABLE `goals` ADD `status` text DEFAULT '応募準備中' NOT NULL;--> statement-breakpoint
ALTER TABLE `goals` ADD `memo` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_goals_owner` ON `goals` (`owner_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_goals_owner_opportunity` ON `goals` (`owner_id`,`opportunity_id`);