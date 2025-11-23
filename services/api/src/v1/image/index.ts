import { uploadImageRoute } from './routes';
import { uploadImageHandler } from './handlers';
import type { HonoApp } from '~/app';

export const registerV1ImageRoutes = (app: HonoApp) => {
  app.openapi(uploadImageRoute, uploadImageHandler);
};
