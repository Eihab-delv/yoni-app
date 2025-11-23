import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import type { RouteActionMap } from '@repo/common';

export const imageRoutes: RouteActionMap[] = [
  {
    method: 'post',
    path: '/v1/image',
    action: 'create',
    resource: 'Image',
  },
]

export const uploadImageRoute = createRoute({
  method: 'post',
  path: '/image',
  summary: 'Upload an image file',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            file: z.any(),
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
            image_url: z.string(),
          }),
        },
      },
      description: 'Returns image URL',
    },
    204: {
      description: 'No Content',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
