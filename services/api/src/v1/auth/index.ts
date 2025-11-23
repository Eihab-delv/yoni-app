import { getSignupRoute } from './routes';
import { getSignupHandler } from './handlers';
import type { HonoApp } from '~/app';

export const registerV1AuthRoutes = (app: HonoApp) => {
  app.openapi(getSignupRoute, getSignupHandler);
};
