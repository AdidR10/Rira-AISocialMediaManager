-- Recreate post table with cascade delete on schedule foreign key
-- SQLite doesn't support ALTER CONSTRAINT, so we need to recreate the table

CREATE TABLE `post_new` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`caption` text,
	`photocard_id` text,
	`schedule_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`photocard_id`) REFERENCES `photocard`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`schedule_id`) REFERENCES `schedule`(`id`) ON UPDATE no action ON DELETE cascade
);

-- Copy data from old table
INSERT INTO `post_new` SELECT * FROM `post`;

-- Drop old table
DROP TABLE `post`;

-- Rename new table
ALTER TABLE `post_new` RENAME TO `post`;
