CREATE TABLE `channel_members` (
	`topic_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`joined_at` text NOT NULL,
	PRIMARY KEY(`topic_id`, `owner_id`)
);
--> statement-breakpoint
CREATE INDEX `idx_channel_members_owner` ON `channel_members` (`owner_id`);--> statement-breakpoint
CREATE TABLE `channel_requests` (
	`topic_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`topic_id`, `owner_id`)
);
--> statement-breakpoint
CREATE INDEX `idx_channel_requests_owner` ON `channel_requests` (`owner_id`);--> statement-breakpoint
ALTER TABLE `channel_topics` ADD `access_type` text DEFAULT 'open' NOT NULL;