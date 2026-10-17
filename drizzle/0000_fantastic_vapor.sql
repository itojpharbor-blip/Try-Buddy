CREATE TABLE `goals` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`title` text NOT NULL,
	`first_step` text NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`updates` text DEFAULT '[]' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_goals_created_at` ON `goals` (`created_at`);