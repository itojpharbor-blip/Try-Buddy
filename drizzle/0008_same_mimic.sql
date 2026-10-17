CREATE TABLE `official_visits` (
	`owner_id` text NOT NULL,
	`opportunity_id` text NOT NULL,
	`visited_at` text NOT NULL,
	PRIMARY KEY(`owner_id`, `opportunity_id`)
);
--> statement-breakpoint
CREATE INDEX `idx_official_visits_recent` ON `official_visits` (`owner_id`,`visited_at`);