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
	`status` enum('1','2') NOT NULL DEFAULT '2',
	`country` varchar(255),
	`otp` int NOT NULL,
	`otp_verify` enum('1','0') NOT NULL,
	`pan_card_number` varchar(11),
	`aadhar_number` varchar(20),
	`refferal_code` varchar(11),
	`service` varchar(255),
	`mpin` int,
	`referral_id` int NOT NULL,
	`gender` varchar(255),
	`profile` varchar(255),
	`show_profile_public` int NOT NULL DEFAULT 0,
	`pan_verify` enum('0','1') NOT NULL,
	`aadhar_verify` enum('0','1') NOT NULL,
	`user_type` int,
	CONSTRAINT `admins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `announcement_reads` (
	`announcement_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`is_read` boolean DEFAULT false,
	`read_at` datetime,
	CONSTRAINT `announcement_reads_pk` PRIMARY KEY(`user_id`,`announcement_id`)
);
--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` varchar(36) NOT NULL,
	`type` enum('offer','activity') NOT NULL,
	`status` enum('active','expired') DEFAULT 'active',
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`start_date` datetime,
	`end_date` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`),
	CONSTRAINT `announcements_id_unique` UNIQUE(`id`)
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
CREATE TABLE `esign_documents` (
	`id` varchar(36) NOT NULL,
	`llp_id` varchar(36) NOT NULL,
	`partner_id` varchar(36),
	`document_type` varchar(50) NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`pdf_url` varchar(500) NOT NULL,
	`signed` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `esign_documents_id` PRIMARY KEY(`id`),
	CONSTRAINT `unq_partner_doc` UNIQUE(`partner_id`,`document_type`)
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
CREATE TABLE `lawyer_expertise` (
	`id` varchar(36) NOT NULL,
	`lawyer_id` varchar(36) NOT NULL,
	`services_by_field` longtext NOT NULL,
	CONSTRAINT `lawyer_expertise_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lawyer_onboarding_feedback` (
	`id` varchar(36) NOT NULL,
	`lawyer_id` varchar(36) NOT NULL,
	`responses` longtext NOT NULL,
	CONSTRAINT `lawyer_onboarding_feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lawyer_professional_details` (
	`id` varchar(36) NOT NULL,
	`lawyer_id` varchar(36) NOT NULL,
	`services_willing` enum('Consultation','FullLegalService') NOT NULL,
	`practice_type` enum('Individual','LawFirm') NOT NULL,
	`address_line_1` text NOT NULL,
	`address_line_2` text,
	`city` varchar(100) NOT NULL,
	`state` varchar(100) NOT NULL,
	`pincode` varchar(10) NOT NULL,
	`country` varchar(100) NOT NULL DEFAULT 'India',
	`serve_outside` boolean NOT NULL DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lawyer_professional_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lawyer_profiles` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`mobile_number` varchar(15) NOT NULL,
	`email_address` varchar(255) NOT NULL,
	`gender` enum('MALE','FEMALE','OTHER') NOT NULL,
	`bar_reg_number` varchar(100) NOT NULL,
	`bar_council_state` varchar(100) NOT NULL,
	`college_name` varchar(255) NOT NULL,
	`highest_qualification` enum('LLB','LLM','Other') NOT NULL,
	`profile_photo_url` varchar(500),
	`govt_id_url` varchar(500),
	`bar_id_url` varchar(500),
	`verification_status` enum('','PENDING','VERIFIED','REJECTED') NOT NULL DEFAULT '',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lawyer_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `lawyer_profiles_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `lawyer_settel_amount_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lawyer_id` int NOT NULL,
	`setteled_amount` varchar(255) NOT NULL,
	`transaction_number` varchar(255) NOT NULL,
	`status` enum('0','1') NOT NULL,
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
CREATE TABLE `llp_registration` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`company_name` varchar(255) NOT NULL,
	`fileId` int AUTO_INCREMENT NOT NULL,
	`object` longtext NOT NULL,
	`llp_email` varchar(255),
	`llp_mobile_1` varchar(20),
	`llp_mobile_2` varchar(20),
	`registered_office` varchar(255),
	`residential_proof_url` varchar(500),
	`noc_url` varchar(500),
	`status` varchar(50) DEFAULT 'draft',
	`created_at` timestamp DEFAULT (now()),
	`subscriber_sheet_url` varchar(500),
	CONSTRAINT `llp_registration_id` PRIMARY KEY(`id`),
	CONSTRAINT `llp_registration_id_unique` UNIQUE(`id`),
	CONSTRAINT `llp_registration_user_id_unique` UNIQUE(`user_id`),
	CONSTRAINT `llp_registration_company_name_unique` UNIQUE(`company_name`),
	CONSTRAINT `llp_registration_fileId_unique` UNIQUE(`fileId`)
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
CREATE TABLE `partners` (
	`id` varchar(36) NOT NULL,
	`llp_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255),
	`mobile` varchar(20),
	`occupation` varchar(255),
	`education` varchar(255),
	`contributed_amount` int,
	`place_of_birth` varchar(255),
	`partner_ratio` varchar(50),
	`din_available` boolean DEFAULT false,
	`dsc_available` boolean DEFAULT false,
	`din_number` varchar(8),
	`profile_pic_url` varchar(500),
	`id_proof_url` varchar(500),
	`res_proof_url` varchar(500),
	`pan_card_url` varchar(500),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `partners_id` PRIMARY KEY(`id`),
	CONSTRAINT `partners_id_unique` UNIQUE(`id`)
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
CREATE TABLE `support_and_complaints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`query` text NOT NULL,
	`attachment_key` varchar(512),
	`status` enum('PENDING','IN PROGRESS','CLOSED') NOT NULL DEFAULT 'PENDING',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `support_and_complaints_id` PRIMARY KEY(`id`)
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
	`setprimary` enum('0','1') NOT NULL,
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
	`usertype` enum('1','2') NOT NULL DEFAULT '1',
	`status` int NOT NULL DEFAULT 0,
	`otp` varchar(255) NOT NULL,
	`otp_verify` int NOT NULL DEFAULT 0,
	`live_status` enum('1','0') NOT NULL,
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
	`id` varchar(36) NOT NULL,
	`name` text,
	`email` varchar(255),
	`phone` varchar(20),
	`email_verified` boolean DEFAULT false,
	`email_verified_at` timestamp,
	`password` varchar(255),
	`refresh_token` text NOT NULL DEFAULT (''),
	`remember_token` varchar(100),
	`signup_source` varchar(50) DEFAULT 'WEB',
	`referral_code` varchar(50),
	`utm_source` varchar(50),
	`utm_campaign` varchar(50),
	`ip_address` varchar(45),
	`type` enum('ADMIN','USER','LAWYER') NOT NULL DEFAULT 'USER',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`verification_token` varchar(255),
	`verification_expires_at` timestamp,
	`kyc_status` varchar(20) DEFAULT 'PENDING',
	`last_login` timestamp,
	`device_info` text,
	`address` text,
	`city` varchar(255),
	`state` varchar(255),
	`dist` varchar(255),
	`pincode` varchar(255),
	`profile_image` varchar(255),
	`username` varchar(255),
	`status` enum('0','1','2') DEFAULT '2',
	`country` varchar(255),
	`otp` int,
	`otp_verify` enum('0','1'),
	`pan_card_number` varchar(11),
	`aadhar_number` varchar(20),
	`refferal_code` varchar(11),
	`service` varchar(255),
	`mpin` int,
	`referral_id` int,
	`gender` varchar(255),
	`profile` varchar(255),
	`show_profile_public` int NOT NULL DEFAULT 0,
	`pan_verify` enum('0','1'),
	`aadhar_verify` enum('0','1'),
	`user_type` int,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_phone_unique` UNIQUE(`phone`)
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
--> statement-breakpoint
ALTER TABLE `announcement_reads` ADD CONSTRAINT `announcement_reads_announcement_id_announcements_id_fk` FOREIGN KEY (`announcement_id`) REFERENCES `announcements`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `announcement_reads` ADD CONSTRAINT `announcement_reads_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `esign_documents` ADD CONSTRAINT `esign_documents_llp_id_llp_registration_id_fk` FOREIGN KEY (`llp_id`) REFERENCES `llp_registration`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `esign_documents` ADD CONSTRAINT `esign_documents_partner_id_partners_id_fk` FOREIGN KEY (`partner_id`) REFERENCES `partners`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lawyer_expertise` ADD CONSTRAINT `lawyer_expertise_lawyer_id_lawyer_profiles_id_fk` FOREIGN KEY (`lawyer_id`) REFERENCES `lawyer_profiles`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `lawyer_onboarding_feedback` ADD CONSTRAINT `lawyer_onboarding_feedback_lawyer_id_lawyer_profiles_id_fk` FOREIGN KEY (`lawyer_id`) REFERENCES `lawyer_profiles`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `lawyer_professional_details` ADD CONSTRAINT `lawyer_professional_details_lawyer_id_lawyer_profiles_id_fk` FOREIGN KEY (`lawyer_id`) REFERENCES `lawyer_profiles`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `lawyer_profiles` ADD CONSTRAINT `lawyer_profiles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `llp_registration` ADD CONSTRAINT `llp_registration_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `partners` ADD CONSTRAINT `partners_llp_id_llp_registration_id_fk` FOREIGN KEY (`llp_id`) REFERENCES `llp_registration`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `type_idx` ON `announcements` (`type`);