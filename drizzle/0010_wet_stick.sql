CREATE TABLE `channel_replies` (
	`id` text PRIMARY KEY NOT NULL,
	`topic_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_channel_replies_topic_created` ON `channel_replies` (`topic_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_channel_replies_owner` ON `channel_replies` (`owner_id`);--> statement-breakpoint
CREATE TABLE `channel_topics` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`category` text NOT NULL,
	`opportunity_id` text,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_channel_topics_category_created` ON `channel_topics` (`category`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_channel_topics_owner` ON `channel_topics` (`owner_id`);