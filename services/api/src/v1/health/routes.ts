import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const HealthResponseSchema = z.object({
  message: z.string().openapi({
    example: 'API is healthy!',
    description: 'A simple confirmation message indicating the API is operational.',
  }),
});

export const getRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Check API Health Status',
  description: 'Verifies the operational status of the API and returns a success message.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: HealthResponseSchema,
        },
      },
      description: 'API is healthy and running.',
    },
    500: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({
              example: 'Internal server error during health check.',
              description: 'Details about the internal server error.',
            }),
          }),
        },
      },
      description: 'An unexpected server error occurred.',
    },
  },
});
