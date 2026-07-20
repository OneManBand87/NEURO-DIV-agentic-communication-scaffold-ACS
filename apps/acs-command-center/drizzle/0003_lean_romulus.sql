CREATE TABLE `connector_health` (
	`source` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`consecutive_errors` integer NOT NULL,
	`consecutive_no_ops` integer NOT NULL,
	`last_event_at` text NOT NULL,
	`last_success_at` text,
	`last_error` text,
	`paused_reason` text
);
--> statement-breakpoint
CREATE TABLE `signals` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`project_id` text NOT NULL,
	`source` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`severity` text NOT NULL,
	`status` text NOT NULL,
	`verification_status` text NOT NULL,
	`material` integer NOT NULL,
	`synthesis_status` text NOT NULL,
	`suggested_action` text,
	`source_url` text,
	`occurred_at` text NOT NULL,
	`due_at` text,
	`received_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `signals_source_id_unique` ON `signals` (`source_id`);--> statement-breakpoint
CREATE INDEX `signals_status_idx` ON `signals` (`status`,`severity`,`occurred_at`);