import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, parkingFiles, InsertParkingFile, ParkingFile, parkingBookings, InsertParkingBooking, ParkingBooking, notifications, InsertNotification, Notification, notificationPreferences, InsertNotificationPreference, NotificationPreference } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// File storage queries
export async function uploadParkingFile(file: InsertParkingFile): Promise<ParkingFile | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upload file: database not available");
    return null;
  }

  try {
    const result = await db.insert(parkingFiles).values(file);
    const fileId = (result as any)[0]?.insertId;
    if (!fileId) return null;

    const uploaded = await db.select().from(parkingFiles).where(eq(parkingFiles.id, fileId as number)).limit(1);
    return uploaded.length > 0 ? uploaded[0] : null;
  } catch (error) {
    console.error("[Database] Failed to upload file:", error);
    throw error;
  }
}

export async function getUserFiles(userId: number): Promise<ParkingFile[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user files: database not available");
    return [];
  }

  try {
    return await db.select().from(parkingFiles).where(eq(parkingFiles.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get user files:", error);
    throw error;
  }
}

export async function getFileById(fileId: number): Promise<ParkingFile | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get file: database not available");
    return null;
  }

  try {
    const result = await db.select().from(parkingFiles).where(eq(parkingFiles.id, fileId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get file:", error);
    throw error;
  }
}

export async function deleteFile(fileId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete file: database not available");
    return false;
  }

  try {
    await db.delete(parkingFiles).where(eq(parkingFiles.id, fileId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete file:", error);
    throw error;
  }
}

// Parking booking queries
export async function createParkingBooking(booking: InsertParkingBooking): Promise<ParkingBooking | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create booking: database not available");
    return null;
  }

  try {
    const result = await db.insert(parkingBookings).values(booking);
    const bookingId = (result as any)[0]?.insertId;
    if (!bookingId) return null;

    const created = await db.select().from(parkingBookings).where(eq(parkingBookings.id, bookingId as number)).limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create booking:", error);
    throw error;
  }
}

export async function getUserBookings(userId: number): Promise<ParkingBooking[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user bookings: database not available");
    return [];
  }

  try {
    return await db.select().from(parkingBookings).where(eq(parkingBookings.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get user bookings:", error);
    throw error;
  }
}

export async function getBookingById(bookingId: number): Promise<ParkingBooking | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get booking: database not available");
    return null;
  }

  try {
    const result = await db.select().from(parkingBookings).where(eq(parkingBookings.id, bookingId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get booking:", error);
    throw error;
  }
}

export async function updateBookingStatus(bookingId: number, status: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update booking: database not available");
    return false;
  }

  try {
    await db.update(parkingBookings).set({ status: status as any }).where(eq(parkingBookings.id, bookingId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update booking:", error);
    throw error;
  }
}

// Notification queries
export async function createNotification(notification: InsertNotification): Promise<Notification | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create notification: database not available");
    return null;
  }

  try {
    const result = await db.insert(notifications).values(notification);
    const notificationId = (result as any)[0]?.insertId;
    if (!notificationId) return null;

    const created = await db.select().from(notifications).where(eq(notifications.id, notificationId as number)).limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create notification:", error);
    throw error;
  }
}

export async function getUserNotifications(userId: number, limit: number = 20): Promise<Notification[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user notifications: database not available");
    return [];
  }

  try {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get user notifications:", error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot mark notification as read: database not available");
    return false;
  }

  try {
    await db.update(notifications).set({ isRead: "true" as any }).where(eq(notifications.id, notificationId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to mark notification as read:", error);
    throw error;
  }
}

export async function getUnreadNotificationCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get unread count: database not available");
    return 0;
  }

  try {
    const result = await db.select().from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, "false" as any)));
    return result.length;
  } catch (error) {
    console.error("[Database] Failed to get unread count:", error);
    throw error;
  }
}

export async function deleteNotification(notificationId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete notification: database not available");
    return false;
  }

  try {
    await db.delete(notifications).where(eq(notifications.id, notificationId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete notification:", error);
    throw error;
  }
}

export async function getOrCreateNotificationPreferences(userId: number): Promise<NotificationPreference | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get notification preferences: database not available");
    return null;
  }

  try {
    const existing = await db.select().from(notificationPreferences).where(eq(notificationPreferences.userId, userId)).limit(1);
    if (existing.length > 0) {
      return existing[0];
    }

    // Create default preferences
    const prefs: InsertNotificationPreference = {
      userId,
      bookingNotifications: "true" as any,
      paymentNotifications: "true" as any,
      systemNotifications: "true" as any,
      messageNotifications: "true" as any,
      emailNotifications: "false" as any,
      pushNotifications: "false" as any,
    };

    const result = await db.insert(notificationPreferences).values(prefs);
    const prefsId = (result as any)[0]?.insertId;
    if (!prefsId) return null;

    const created = await db.select().from(notificationPreferences).where(eq(notificationPreferences.id, prefsId as number)).limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get notification preferences:", error);
    throw error;
  }
}

export async function updateNotificationPreferences(userId: number, prefs: Partial<InsertNotificationPreference>): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update notification preferences: database not available");
    return false;
  }

  try {
    await db.update(notificationPreferences).set(prefs).where(eq(notificationPreferences.userId, userId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update notification preferences:", error);
    throw error;
  }
}
