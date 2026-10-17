CREATE TABLE `community_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`reporter_id` text NOT NULL,
	`kind` text NOT NULL,
	`target_id` text NOT NULL,
	`reason` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_community_reports_created` ON `community_reports` (`created_at`);--> statement-breakpoint
CREATE TABLE `dm_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`thread_id` text NOT NULL,
	`sender_id` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_dm_messages_thread` ON `dm_messages` (`thread_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `dm_threads` (
	`id` text PRIMARY KEY NOT NULL,
	`requester_id` text NOT NULL,
	`recipient_id` text NOT NULL,
	`accepted` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_dm_threads_requester` ON `dm_threads` (`requester_id`,`updated_at`);--> statement-breakpoint
CREATE INDEX `idx_dm_threads_recipient` ON `dm_threads` (`recipient_id`,`updated_at`);--> statement-breakpoint
CREATE TABLE `timeline_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_timeline_posts_created` ON `timeline_posts` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_timeline_posts_owner` ON `timeline_posts` (`owner_id`);--> statement-breakpoint
CREATE TABLE `timeline_reactions` (
	`owner_id` text NOT NULL,
	`post_id` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`owner_id`, `post_id`)
);
--> statement-breakpoint
CREATE INDEX `idx_timeline_reactions_post` ON `timeline_reactions` (`post_id`);--> statement-breakpoint
CREATE TABLE `timeline_replies` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_timeline_replies_post` ON `timeline_replies` (`post_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `user_blocks` (
	`owner_id` text NOT NULL,
	`target_id` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`owner_id`, `target_id`)
);
