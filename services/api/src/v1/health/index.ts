import { getRoute } from './routes';
import { getHandler } from './handlers';
import type { HonoApp } from '~/app';

export const registerV1HealthRoutes = (app: HonoApp) => {
  app.openapi(getRoute, getHandler);
};
