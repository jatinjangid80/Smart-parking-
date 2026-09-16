import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // File storage router
  files: router({
    upload: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileType: z.enum(["receipt", "document", "license", "other"]),
        mimeType: z.string(),
        fileSize: z.number(),
        fileBuffer: z.instanceof(Buffer),
        description: z.string().optional(),
        parkingBookingId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const fileKey = `${ctx.user.id}-parking-files/${input.fileName}-${Date.now()}`;
          const { url } = await storagePut(fileKey, input.fileBuffer, input.mimeType);

          const file = await db.uploadParkingFile({
            userId: ctx.user.id,
            fileName: input.fileName,
            fileKey,
            fileUrl: url,
            fileType: input.fileType,
            mimeType: input.mimeType,
            fileSize: input.fileSize,
            description: input.description,
            parkingBookingId: input.parkingBookingId,
          });

          return { success: true, file };
        } catch (error) {
          console.error("File upload error:", error);
          throw error;
        }
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserFiles(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ fileId: z.number() }))
      .query(async ({ input }) => {
        return await db.getFileById(input.fileId);
      }),

    delete: protectedProcedure
      .input(z.object({ fileId: z.number() }))
      .mutation(async ({ input }) => {
        const success = await db.deleteFile(input.fileId);
        return { success };
      }),
  }),

  // Parking bookings router
  bookings: router({
    create: protectedProcedure
      .input(z.object({
        parkingLocationId: z.string(),
        locationName: z.string(),
        bookingDate: z.date(),
        startTime: z.date(),
        endTime: z.date(),
        duration: z.number(),
        totalCost: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const booking = await db.createParkingBooking({
          userId: ctx.user.id,
          parkingLocationId: input.parkingLocationId,
          locationName: input.locationName,
          bookingDate: input.bookingDate,
          startTime: input.startTime,
          endTime: input.endTime,
          duration: input.duration,
          totalCost: input.totalCost,
          notes: input.notes,
        });
        return booking;
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserBookings(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ bookingId: z.number() }))
      .query(async ({ input }) => {
        return await db.getBookingById(input.bookingId);
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        bookingId: z.number(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
      }))
      .mutation(async ({ input }) => {
        const success = await db.updateBookingStatus(input.bookingId, input.status);
        return { success };
      }),
  }),

  notifications: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(20) }).optional())
      .query(async ({ ctx, input }) => {
        return await db.getUserNotifications(ctx.user.id, input?.limit || 20);
      }),

    create: protectedProcedure
      .input(z.object({
        type: z.enum(["booking", "payment", "system", "message"]),
        title: z.string(),
        message: z.string(),
        icon: z.string().optional(),
        actionUrl: z.string().optional(),
        relatedBookingId: z.number().optional(),
        relatedFileId: z.number().optional(),
        priority: z.enum(["low", "medium", "high"]).default("medium"),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createNotification({
          userId: ctx.user.id,
          type: input.type as any,
          title: input.title,
          message: input.message,
          icon: input.icon,
          isRead: "false" as any,
          actionUrl: input.actionUrl,
          relatedBookingId: input.relatedBookingId,
          relatedFileId: input.relatedFileId,
          priority: input.priority as any,
        });
      }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        const success = await db.markNotificationAsRead(input.notificationId);
        return { success };
      }),

    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      const count = await db.getUnreadNotificationCount(ctx.user.id);
      return { count };
    }),

    delete: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        const success = await db.deleteNotification(input.notificationId);
        return { success };
      }),

    getPreferences: protectedProcedure.query(async ({ ctx }) => {
      return await db.getOrCreateNotificationPreferences(ctx.user.id);
    }),

    updatePreferences: protectedProcedure
      .input(z.object({
        bookingNotifications: z.enum(["true", "false"]).optional(),
        paymentNotifications: z.enum(["true", "false"]).optional(),
        systemNotifications: z.enum(["true", "false"]).optional(),
        messageNotifications: z.enum(["true", "false"]).optional(),
        emailNotifications: z.enum(["true", "false"]).optional(),
        pushNotifications: z.enum(["true", "false"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const success = await db.updateNotificationPreferences(ctx.user.id, input as any);
        return { success };
      }),
  }),
});

export type AppRouter = typeof appRouter;
