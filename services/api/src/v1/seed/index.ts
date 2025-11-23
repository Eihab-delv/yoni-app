import { getRoute } from './routes';
import { getHandler } from './handlers';
import type { HonoApp } from '~/app';

export const registerV1SeedRoutes = (app: HonoApp) => {
  app.openapi(getRoute, getHandler);
};
