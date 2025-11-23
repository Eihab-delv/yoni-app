import type { InferRouteContext } from '~/context';
import type { uploadImageRoute } from './routes';

export const uploadImageHandler = async (c: InferRouteContext<typeof uploadImageRoute>) => {
  return c.json({
    image_url: 'https://example.com/image.jpg',
  }, 200);
};
