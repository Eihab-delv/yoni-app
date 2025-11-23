import { glog } from '@repo/core';
import type { InferRouteContext } from '~/context';
import type { createNotificationRoute, getNotificationsRoute, updateNotificationStatusRoute } from './routes';

export const getNotificationsHandler = async (c: InferRouteContext<typeof getNotificationsRoute>) => {
  return c.json([], 200);
};

export const createNotificationHandler = async (c: InferRouteContext<typeof createNotificationRoute>) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { venue_id } = c.req.valid('query');
  glog.info("Create notifications route called with", { venue_id })

  return c.json({
    message: 'Notification created successfully',
  }, 200);
};

export const updateNotificationStatusHandler = async (c: InferRouteContext<typeof updateNotificationStatusRoute>) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { notification_id } = c.req.valid('param');
  glog.info("Update notifications status route called with", { notification_id })

  return c.json({
    message: 'Status updated successfully',
  }, 200);
};
