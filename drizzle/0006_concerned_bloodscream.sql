CREATE TABLE `reactions` (
	`owner_id` text NOT NULL,
	`goal_id` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`owner_id`, `goal_id`)
);
--> statement-breakpoint
CREATE INDEX `idx_reactions_goal` ON `reactions` (`goal_id`);