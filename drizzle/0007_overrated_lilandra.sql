PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_goals` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`title` text NOT NULL,
	`first_step` text NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`updates` text DEFAULT '[]' NOT NULL,
	`created_at` text NOT NULL,
	`opportunity_id` text,
	`status` text DEFAULT '気になる' NOT NULL,
	`memo` text DEFAULT '' NOT NULL,
	`next_action` text DEFAULT '' NOT NULL,
	`activity_period` text DEFAULT '' NOT NULL,
	`public_activity` integer DEFAULT false NOT NULL,
	`public_text` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_goals`("id", "owner_id", "name", "title", "first_step", "progress", "updates", "created_at", "opportunity_id", "status", "memo", "next_action", "activity_period", "public_activity", "public_text", "updated_at") SELECT "id", "owner_id", "name", "title", "first_step", "progress", "updates", "created_at", "opportunity_id", "status", "memo", "next_action", "activity_period", "public_activity", "public_text", "updated_at" FROM `goals`;--> statement-breakpoint
DROP TABLE `goals`;--> statement-breakpoint
ALTER TABLE `__new_goals` RENAME TO `goals`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_goals_created_at` ON `goals` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_goals_owner` ON `goals` (`owner_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_goals_owner_opportunity` ON `goals` (`owner_id`,`opportunity_id`);--> statement-breakpoint
UPDATE `goals` SET `public_activity`=0, `public_text`='' WHERE `status` IN ('気になる','応募準備中','見送り');--> statement-breakpoint
UPDATE `goals` SET `status`=CASE
  WHEN `status` IN ('応募済み','参加中') THEN '挑戦中'
  WHEN `status`='参加済み' THEN '挑戦済'
  WHEN `status` IN ('応募準備中','見送り') THEN '気になる'
  ELSE `status` END;--> statement-breakpoint
DELETE FROM `reactions` WHERE `goal_id` IN (SELECT `id` FROM `goals` WHERE `status`='気になる');
