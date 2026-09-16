CREATE TABLE `notification_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bookingNotifications` enum('true','false') NOT NULL DEFAULT 'true',
	`paymentNotifications` enum('true','false') NOT NULL DEFAULT 'true',
	`systemNotifications` enum('true','false') NOT NULL DEFAULT 'true',
	`messageNotifications` enum('true','false') NOT NULL DEFAULT 'true',
	`emailNotifications` enum('true','false') NOT NULL DEFAULT 'false',
	`pushNotifications` enum('true','false') NOT NULL DEFAULT 'false',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `notification_preferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('booking','payment','system','message') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`icon` varchar(50),
	`isRead` enum('true','false') NOT NULL DEFAULT 'false',
	`actionUrl` varchar(512),
	`relatedBookingId` int,
	`relatedFileId` int,
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`expiresAt` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
