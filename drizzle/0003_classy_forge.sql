PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_integration` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`facebook_page_id` text,
	`facebook_api_key` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_integration`("id", "organization_id", "facebook_page_id", "facebook_api_key", "created_at", "updated_at") SELECT "id", "organization_id", "facebook_page_id", "facebook_api_key", "created_at", "updated_at" FROM `integration`;--> statement-breakpoint
DROP TABLE `integration`;--> statement-breakpoint
ALTER TABLE `__new_integration` RENAME TO `integration`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_photocard` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`html` text NOT NULL,
	`url` text NOT NULL,
	`height` integer NOT NULL,
	`width` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_photocard`("id", "user_id", "html", "url", "height", "width", "created_at") SELECT "id", "user_id", "html", "url", "height", "width", "created_at" FROM `photocard`;--> statement-breakpoint
DROP TABLE `photocard`;--> statement-breakpoint
ALTER TABLE `__new_photocard` RENAME TO `photocard`;--> statement-breakpoint
CREATE TABLE `__new_post` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`caption` text,
	`photocard_id` text,
	`schedule_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`photocard_id`) REFERENCES `photocard`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`schedule_id`) REFERENCES `schedule`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_post`("id", "organization_id", "caption", "photocard_id", "schedule_id", "created_at", "updated_at") SELECT "id", "organization_id", "caption", "photocard_id", "schedule_id", "created_at", "updated_at" FROM `post`;--> statement-breakpoint
DROP TABLE `post`;--> statement-breakpoint
ALTER TABLE `__new_post` RENAME TO `post`;