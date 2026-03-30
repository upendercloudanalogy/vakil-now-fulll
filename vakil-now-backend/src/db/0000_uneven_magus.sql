-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `admins` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`email_verified_at` timestamp,
	`password` varchar(255) NOT NULL,
	`remember_token` varchar(100),
	`created_at` timestamp,
	`updated_at` timestamp,
	`phone` varchar(255),
	`address` text,
	`city` varchar(255),
	`state` varchar(255),
	`dist` varchar(255),
	`pincode` varchar(255),
	`profile_image` varchar(255),
	`username` varchar(255),
	`status` enum('1','2') NOT NULL DEFAULT 2,
	`country` varchar(255),
	`otp` int NOT NULL,
	`otp_verify` enum('1','0') NOT NULL DEFAULT 0,
	`pan_card_number` varchar(11),
	`aadhar_number` varchar(20),
	`refferal_code` varchar(11),
	`service` varchar(255),
	`mpin` int,
	`referral_id` int NOT NULL,
	`gender` varchar(255),
	`profile` varchar(255),
	`show_profile_public` int NOT NULL DEFAULT 0,
	`pan_verify` enum('0','1') NOT NULL DEFAULT 0,
	`aadhar_verify` enum('0','1') NOT NULL DEFAULT 0,
	`user_type` int,
	CONSTRAINT `admins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `api_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platform_url` varchar(255) NOT NULL,
	`app_id` varchar(255) NOT NULL,
	`serversecret` varchar(255) NOT NULL,
	`app_channel_name` varchar(255) NOT NULL,
	`status` enum('t','f') NOT NULL DEFAULT 't',
	CONSTRAINT `api_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blogmanager` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255),
	`description` text NOT NULL,
	`image` varchar(255) NOT NULL,
	`status` enum('t','f') NOT NULL DEFAULT 'f',
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	CONSTRAINT `blogmanager_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `callchat_logs_laywer_customer` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`lawyer_id` int NOT NULL,
	`total_call_duration` varchar(255) NOT NULL,
	`start_time` varchar(255) NOT NULL,
	`end_time` varchar(255) NOT NULL,
	`total_charges` varchar(255) NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`chat_start_from_user_id` int NOT NULL,
	`user_type` int NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	`status` enum('t','f') NOT NULL DEFAULT 't',
	`live_status` int DEFAULT 0,
	`randomcallid` int NOT NULL,
	CONSTRAINT `callchat_logs_laywer_customer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_history_laywer_customer` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`lawyer_id` int NOT NULL,
	`communication_start_datetime` text NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	`status` enum('t','f') NOT NULL DEFAULT 't',
	`live_status` int DEFAULT 0,
	`chat_end_time` varchar(255) DEFAULT '0',
	`total_chat_time` varchar(255) NOT NULL DEFAULT '0',
	`total_lowyer_earn` varchar(255) DEFAULT '0',
	CONSTRAINT `chat_history_laywer_customer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(30) NOT NULL,
	`state_id` int NOT NULL,
	`view_count` int,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `cities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `countries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sortname` varchar(3) NOT NULL,
	`name` varchar(150) NOT NULL,
	`phonecode` int NOT NULL,
	CONSTRAINT `countries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents_apply_management` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`usertype` int NOT NULL,
	`documents_name` varchar(255) NOT NULL,
	`documents_charge` varchar(255) NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	`status` enum('pending','reject','process','complete') NOT NULL DEFAULT 'pending',
	`upload_document` varchar(255),
	`request_user_phone` varchar(255),
	`request_username` varchar(255),
	CONSTRAINT `documents_apply_management_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents_charges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`amount` int NOT NULL,
	`status` enum('t','f') NOT NULL DEFAULT 't',
	CONSTRAINT `documents_charges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expertservices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`price_start_from` varchar(255) NOT NULL,
	`slug` varchar(255),
	`description` text NOT NULL,
	`image` varchar(255) NOT NULL,
	`status` enum('t','f') NOT NULL DEFAULT 'f',
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	CONSTRAINT `expertservices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hireme_lawyer_manager` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`usertype` int NOT NULL,
	`lawyer_id` int NOT NULL,
	`status` enum('t','f') NOT NULL DEFAULT 't',
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	CONSTRAINT `hireme_lawyer_manager_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `language_manager` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`status` enum('t','f') NOT NULL DEFAULT 'f',
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	CONSTRAINT `language_manager_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lawyer_customer_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lawyer_id` int NOT NULL,
	`customer_id` int NOT NULL,
	`documents` varchar(255),
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	`usertype` int NOT NULL DEFAULT 1,
	CONSTRAINT `lawyer_customer_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lawyer_settel_amount_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lawyer_id` int NOT NULL,
	`setteled_amount` varchar(255) NOT NULL,
	`transaction_number` varchar(255) NOT NULL,
	`status` enum('0','1') NOT NULL DEFAULT 0,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	CONSTRAINT `lawyer_settel_amount_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lawyer_wallet_manager` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lawyer_id` int NOT NULL,
	`total_wallet_amount` varchar(255) NOT NULL,
	`total_deduct_amount` varchar(255) NOT NULL,
	`total_amount` int DEFAULT 0,
	`total_admin_deduction` int DEFAULT 0,
	`wallet_status` int NOT NULL DEFAULT 0,
	`updated_at` varchar(255) NOT NULL,
	`created_at` varchar(255) NOT NULL,
	CONSTRAINT `lawyer_wallet_manager_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lawyer_wallet_transacrion` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lawyer_id` int NOT NULL,
	`customer_id` int NOT NULL,
	`amount_credit` varchar(255),
	`amount_debit` varchar(255),
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	CONSTRAINT `lawyer_wallet_transacrion_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `low_category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`low_category_name` varchar(255) NOT NULL,
	`low_category_sulg` varchar(255),
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	`status` enum('t','f') NOT NULL DEFAULT 't',
	`description` varchar(255),
	`image` varchar(255),
	CONSTRAINT `low_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sponsor_manager` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255),
	`url` varchar(255) NOT NULL,
	`image` varchar(255) NOT NULL,
	`status` enum('t','f') NOT NULL DEFAULT 'f',
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	CONSTRAINT `sponsor_manager_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `states` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(30) NOT NULL,
	`country_id` int NOT NULL DEFAULT 1,
	CONSTRAINT `states_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonial_manager` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`profile` varchar(255),
	`slug` varchar(255),
	`description` text NOT NULL,
	`image` varchar(255) NOT NULL,
	`status` enum('t','f') NOT NULL DEFAULT 'f',
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	CONSTRAINT `testimonial_manager_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_account_management` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`account_name` varchar(255) NOT NULL,
	`bank_name` varchar(255) NOT NULL,
	`account_number` varchar(255) NOT NULL,
	`account_ifsc` varchar(100) NOT NULL,
	`account_branch` text NOT NULL,
	`status` enum('t','f') NOT NULL DEFAULT 't',
	`created_at` varchar(255),
	`updated_at` varchar(255),
	`setprimary` enum('0','1') NOT NULL DEFAULT 0,
	`address` text NOT NULL,
	CONSTRAINT `user_account_management_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_authentication` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`phonenumber` varchar(255) NOT NULL,
	`password` varchar(255),
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	`usertype` enum('1','2') NOT NULL DEFAULT 1,
	`status` int NOT NULL DEFAULT 0,
	`otp` varchar(255) NOT NULL,
	`otp_verify` int NOT NULL DEFAULT 0,
	`live_status` enum('1','0') NOT NULL DEFAULT 0,
	CONSTRAINT `user_authentication_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_custom_low_category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`low_category_name` varchar(255) NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	`status` enum('t','f') NOT NULL DEFAULT 't',
	`user_id` int NOT NULL,
	CONSTRAINT `user_custom_low_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_customer_manager` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`user_usertype` int NOT NULL,
	`user_name` varchar(255) NOT NULL,
	`useremail` varchar(255) NOT NULL,
	`user_phone` varchar(255) NOT NULL,
	`user_city_id` int NOT NULL,
	`user_state_id` int NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	`status` enum('t','f') NOT NULL DEFAULT 't',
	`profile_photo` varchar(255),
	`gender` varchar(255),
	`address` text,
	`pincode` int,
	`other_details` text,
	CONSTRAINT `user_customer_manager_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_registration` (
	`id` int AUTO_INCREMENT NOT NULL,
	`legal_problem` text,
	`law_school_subject` text,
	`total_cases` varchar(255),
	`game_of_life` text,
	`share_ultimate_legal_higklight` text,
	`your_wishlist_of_wonder` text,
	`phone_number` varchar(255) NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`email_address` varchar(255) NOT NULL,
	`state` int NOT NULL,
	`city` int NOT NULL,
	`language` varchar(255),
	`court_details` varchar(255) NOT NULL,
	`experience` varchar(255) NOT NULL,
	`low_category` varchar(255) NOT NULL,
	`other_law_field` varchar(255),
	`cartificate_enroll_no` varchar(255) NOT NULL,
	`cartificate_upload` varchar(255) NOT NULL,
	`gender` varchar(255) NOT NULL,
	`comfortability` varchar(255) NOT NULL,
	`handling_pro_bono_cases` varchar(255) NOT NULL,
	`working_hours_from` varchar(255) NOT NULL,
	`working_hours_to` varchar(255) NOT NULL,
	`working_days` varchar(255) NOT NULL,
	`call_charges_per_minite` int NOT NULL,
	`chat_charges_minite` varchar(255) NOT NULL,
	`documents_charges` varchar(255) NOT NULL,
	`status` enum('t','f','h','p','d','0') NOT NULL DEFAULT 'p',
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	`profile_id` int NOT NULL,
	`profile_photo` varchar(255),
	`bar_council_id` varchar(255),
	`documentsupload1` varchar(255),
	`documentsupload2` varchar(255),
	`other_details` text,
	`slug` varchar(255),
	`password` varchar(255) NOT NULL,
	CONSTRAINT `user_registration_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_wallet` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`total_amount` varchar(255) NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	`status` enum('t','f') NOT NULL DEFAULT 't',
	`user_type` int NOT NULL DEFAULT 1,
	CONSTRAINT `user_wallet_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_wallet_transaction` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`credit_amount` int NOT NULL,
	`debit_amount` int NOT NULL,
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`transaction_mode` varchar(255),
	`status` enum('t','f') NOT NULL DEFAULT 't',
	`chat_duration` varchar(255),
	`user_type` int NOT NULL DEFAULT 1,
	`chatlawyerid` int DEFAULT 0,
	`randomcallid` varchar(255),
	CONSTRAINT `user_wallet_transaction_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`email_verified_at` timestamp,
	`password` varchar(255) NOT NULL,
	`remember_token` varchar(100),
	`created_at` timestamp,
	`updated_at` timestamp,
	`phone` varchar(255),
	`address` text,
	`city` varchar(255),
	`state` varchar(255),
	`dist` varchar(255),
	`pincode` varchar(255),
	`profile_image` varchar(255),
	`username` varchar(255),
	`status` enum('0','1','2') DEFAULT 2,
	`country` varchar(255),
	`otp` int NOT NULL,
	`otp_verify` enum('0','1') DEFAULT 0,
	`pan_card_number` varchar(11),
	`aadhar_number` varchar(20),
	`refferal_code` varchar(11),
	`service` varchar(255),
	`mpin` int,
	`referral_id` int NOT NULL,
	`gender` varchar(255),
	`profile` varchar(255),
	`show_profile_public` int NOT NULL DEFAULT 0,
	`pan_verify` enum('0','1') DEFAULT 0,
	`aadhar_verify` enum('0','1') DEFAULT 0,
	`user_type` int,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vakil_working_days` (
	`id` int AUTO_INCREMENT NOT NULL,
	`day_name` varchar(255) NOT NULL,
	`from_hh` varchar(255),
	`from_mm` varchar(255),
	`to_hh` varchar(255),
	`to_mm` varchar(255),
	`created_at` varchar(255) NOT NULL,
	`updated_at` varchar(255) NOT NULL,
	`user_id` int NOT NULL,
	`phonenumber` varchar(255) NOT NULL,
	CONSTRAINT `vakil_working_days_id` PRIMARY KEY(`id`)
);

*/