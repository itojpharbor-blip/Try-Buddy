CREATE TABLE `follows` (
	`follower_id` text NOT NULL,
	`target_id` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`follower_id`, `target_id`)
);
--> statement-breakpoint
CREATE INDEX `idx_follows_target` ON `follows` (`target_id`);--> statement-breakpoint
ALTER TABLE `goals` ADD `public_text` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `goals` ADD `updated_at` text DEFAULT '' NOT NULL;