CREATE TABLE IF NOT EXISTS `intake_items` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`project_id` text NOT NULL,
	`kind` text NOT NULL,
	`source` text NOT NULL,
	`title` text NOT NULL,
	`original_filename` text,
	`content_type` text,
	`size_bytes` integer,
	`drive_path` text,
	`source_url` text,
	`captured_text` text,
	`device` text NOT NULL,
	`sha256` text,
	`status` text NOT NULL,
	`occurred_at` text NOT NULL,
	`received_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `intake_items_source_id_unique` ON `intake_items` (`source_id`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `intake_status_idx` ON `intake_items` (`status`,`received_at`);
