CREATE TABLE `interest_tags` (
	`name` text PRIMARY KEY NOT NULL,
	`creator_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_interest_tags_creator` ON `interest_tags` (`creator_id`);