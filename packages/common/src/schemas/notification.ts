import { z } from 'zod';

export const NotificationSchema = z.object({
  id: z.string(),
  notificationId: z.string(),
  userId: z.string().optional(),
  title: z.string(),
  body: z.string(),
  actionLink: z.string().optional(),
  isRead: z.boolean().default(false),
  readAt: z.number().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const CreateNotificationSchema = NotificationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  readAt: true,
});

export const UpdateNotificationSchema = CreateNotificationSchema.partial();

export type Notification = z.infer<typeof NotificationSchema>;
export type CreateNotification = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotification = z.infer<typeof UpdateNotificationSchema>;
