ALTER TABLE `admins` MODIFY COLUMN `status` enum('1','2') NOT NULL DEFAULT '2';--> statement-breakpoint
ALTER TABLE `admins` MODIFY COLUMN `otp_verify` enum('1','0') NOT NULL;--> statement-breakpoint
ALTER TABLE `admins` MODIFY COLUMN `pan_verify` enum('0','1') NOT NULL;--> statement-breakpoint
ALTER TABLE `admins` MODIFY COLUMN `aadhar_verify` enum('0','1') NOT NULL;--> statement-breakpoint
ALTER TABLE `lawyer_settel_amount_history` MODIFY COLUMN `status` enum('0','1') NOT NULL;--> statement-breakpoint
ALTER TABLE `user_account_management` MODIFY COLUMN `setprimary` enum('0','1') NOT NULL;--> statement-breakpoint
ALTER TABLE `user_authentication` MODIFY COLUMN `usertype` enum('1','2') NOT NULL DEFAULT '1';--> statement-breakpoint
ALTER TABLE `user_authentication` MODIFY COLUMN `live_status` enum('1','0') NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `status` enum('0','1','2') DEFAULT '2';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `otp_verify` enum('0','1');--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `pan_verify` enum('0','1');--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `aadhar_verify` enum('0','1');