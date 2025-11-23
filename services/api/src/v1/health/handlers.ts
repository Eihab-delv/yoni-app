import type { InferRouteContext } from '~/context';
import type { getRoute } from './routes';

export const getHandler = (c: InferRouteContext<typeof getRoute>) => {
  throw new Error("Oopsy woopsy. I made a fucky wucky")
  return c.json(
    {
      message: 'Hello World! asaasf',
    },
    200
  );
};
