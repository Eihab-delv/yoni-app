import { getUsersRoute, createUserRoute, updateUserRoute, updateUserRoleRoute } from './routes';
import { getUsersHandler, createUserHandler, updateUserHandler, updateUserRoleHandler } from './handlers';
import type { HonoApp } from '~/app';

export const registerV1UserRoutes = (app: HonoApp) => {
  app.openapi(getUsersRoute, getUsersHandler);
  app.openapi(createUserRoute, createUserHandler);
  app.openapi(updateUserRoute, updateUserHandler);
  app.openapi(updateUserRoleRoute, updateUserRoleHandler);
};
