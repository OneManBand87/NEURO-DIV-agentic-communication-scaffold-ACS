CREATE TABLE `intake_attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`intake_item_id` text NOT NULL,
	`object_key` text NOT NULL,
	`original_filename` text NOT NULL,
	`content_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`sha256` text NOT NULL,
	`uploaded_by` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `intake_attachments_object_key_unique` ON `intake_attachments` (`object_key`);