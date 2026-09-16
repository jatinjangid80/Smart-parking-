import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// File storage table for managing uploaded documents and receipts
export const parkingFiles = mysqlTable("parking_files", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(), // S3 file path
  fileUrl: text("fileUrl").notNull(), // S3 file URL
  fileType: varchar("fileType", { length: 50 }).notNull(), // e.g., 'receipt', 'document', 'license'
  mimeType: varchar("mimeType", { length: 100 }).notNull(), // e.g., 'application/pdf'
  fileSize: int("fileSize").notNull(), // File size in bytes
  description: text("description"), // Optional description
  parkingBookingId: int("parkingBookingId"), // Optional: linked parking booking
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ParkingFile = typeof parkingFiles.$inferSelect;
export type InsertParkingFile = typeof parkingFiles.$inferInsert;

// Parking bookings table for tracking user reservations
export const parkingBookings = mysqlTable("parking_bookings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  parkingLocationId: varchar("parkingLocationId", { length: 100 }).notNull(),
  locationName: varchar("locationName", { length: 255 }).notNull(),
  bookingDate: timestamp("bookingDate").notNull(),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  duration: int("duration").notNull(), // Duration in hours
  totalCost: varchar("totalCost", { length: 20 }).notNull(), // e.g., "$15.00"
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["unpaid", "paid", "refunded"]).default("unpaid").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ParkingBooking = typeof parkingBookings.$inferSelect;
export type InsertParkingBooking = typeof parkingBookings.$inferInsert;

// Notifications table for managing all user notifications
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["booking", "payment", "system", "message"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  icon: varchar("icon", { length: 50 }), // Icon name for UI display
  isRead: mysqlEnum("isRead", ["true", "false"]).default("false").notNull(),
  actionUrl: varchar("actionUrl", { length: 512 }), // Optional link to take action
  relatedBookingId: int("relatedBookingId"), // Optional: linked parking booking
  relatedFileId: int("relatedFileId"), // Optional: linked file
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  expiresAt: timestamp("expiresAt"), // Optional: notification expiration
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// Notification preferences table for user notification settings
export const notificationPreferences = mysqlTable("notification_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  bookingNotifications: mysqlEnum("bookingNotifications", ["true", "false"]).default("true").notNull(),
  paymentNotifications: mysqlEnum("paymentNotifications", ["true", "false"]).default("true").notNull(),
  systemNotifications: mysqlEnum("systemNotifications", ["true", "false"]).default("true").notNull(),
  messageNotifications: mysqlEnum("messageNotifications", ["true", "false"]).default("true").notNull(),
  emailNotifications: mysqlEnum("emailNotifications", ["true", "false"]).default("false").notNull(),
  pushNotifications: mysqlEnum("pushNotifications", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;
