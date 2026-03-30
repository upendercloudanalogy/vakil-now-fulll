CREATE TABLE `otps` (
	`id` varchar(36) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`otp` text NOT NULL,
	`is_used` boolean DEFAULT false,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `otps_id` PRIMARY KEY(`id`),
	CONSTRAINT `otps_id_unique` UNIQUE(`id`),
	CONSTRAINT `otps_phone_unique` UNIQUE(`phone`),
	CONSTRAINT `idx_otps_phone` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE TABLE `otps_locks` (
	`id` varchar(36) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`retry_count` int NOT NULL DEFAULT 0,
	`last_request_at` timestamp NOT NULL DEFAULT (now()),
	`locked_until` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `otps_locks_id` PRIMARY KEY(`id`),
	CONSTRAINT `otps_locks_id_unique` UNIQUE(`id`),
	CONSTRAINT `otps_locks_phone_unique` UNIQUE(`phone`),
	CONSTRAINT `idx_otps_locks_phone` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(256) NOT NULL,
	`phone_number` varchar(12),
	`refresh_token` text NOT NULL DEFAULT (''),
	`password` varchar(256) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `usersP` (
	`id` varchar(36) NOT NULL,
	`name` text,
	`phone` varchar(20) NOT NULL,
	`refresh_token` text NOT NULL DEFAULT (''),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `usersP_id` PRIMARY KEY(`id`),
	CONSTRAINT `usersP_id_unique` UNIQUE(`id`),
	CONSTRAINT `idx_usersP_phone` UNIQUE(`phone`)
);
