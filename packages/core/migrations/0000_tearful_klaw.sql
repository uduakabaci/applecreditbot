CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`telegram_chat_id` integer NOT NULL,
	`telegram_user_id` integer NOT NULL,
	`telegram_username` text,
	`first_name` text,
	`last_name` text,
	`device` text NOT NULL,
	`country` text NOT NULL,
	`icloud_email` text NOT NULL,
	`full_name` text NOT NULL,
	`consent_group_invite` integer NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	`meta` text
);
