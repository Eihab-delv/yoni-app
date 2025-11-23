import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import type { RouteActionMap } from '@repo/common';

export const notificationRoutes: RouteActionMap[] = [
  {
    method: 'get',
    path: '/v1/notifications',
    action: 'read',
    resource: 'Notification',
  },
  {
    method: 'post',
    path: '/v1/notifications',
    action: 'create',
    resource: 'Notification',
  },
  {
    method: 'patch',
    path: '/v1/notifications/{notification_id}/status',
    action: 'update',
    resource: 'Notification',
  },
]

const NotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  link: z.string().optional(),
  sent_at: z.string(),
  notification_status: z.enum(['read', 'unread']),
});

export const getNotificationsRoute = createRoute({
  method: 'get',
  path: '/notifications',
  summary: 'Get notifications with pagination and filtering',
  request: {
    query: z.object({
      sortby: z.enum(['sent_at']).optional(),
      page: z.number().optional(),
      page_size: z.number().optional(),
      venue_id: z.string().optional(),
      user_id: z.string().optional(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(NotificationSchema),
        },
      },
      description: 'Returns notifications',
    },
    204: {
      description: 'No Content',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});

export const createNotificationRoute = createRoute({
  method: 'post',
  path: '/notifications',
  summary: 'Create a new notification',
  request: {
    query: z.object({
      venue_id: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            target_user_types: z.array(z.string()),
            title: z.string(),
            body: z.string(),
            link: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Notification created successfully',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
    502: {
      description: 'Bad Gateway',
    },
    504: {
      description: 'Gateway Timeout',
    },
  },
});

export const updateNotificationStatusRoute = createRoute({
  method: 'patch',
  path: '/notifications/{notification_id}/status',
  summary: 'Update notification status',
  request: {
    params: z.object({
      notification_id: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            notification_status: z.enum(['read', 'unread']),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Status updated successfully',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
