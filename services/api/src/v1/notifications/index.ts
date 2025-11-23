import { getNotificationsRoute, createNotificationRoute, updateNotificationStatusRoute } from './routes';
import { getNotificationsHandler, createNotificationHandler, updateNotificationStatusHandler } from './handlers';
import type { HonoApp } from '~/app';

export const registerV1NotificationRoutes = (app: HonoApp) => {
  app.openapi(getNotificationsRoute, getNotificationsHandler);
  app.openapi(createNotificationRoute, createNotificationHandler);
  app.openapi(updateNotificationStatusRoute, updateNotificationStatusHandler);
};
