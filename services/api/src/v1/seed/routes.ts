import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const SeedResponseSchema = z.object({
  message: z.string().openapi({
    example: 'Database has been seeded!',
    description: 'Seeds the database with fake data.',
  }),
});

export const getRoute = createRoute({
  method: 'get',
  path: '/seed',
  summary: 'Seed the database',
  description: 'Seeds the firestore database with fake data and returns a success message.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SeedResponseSchema,
        },
      },
      description: 'Seeds the database with fake data.',
    },
    500: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({
              example: 'Internal server error during seeding of the database.',
              description: 'Details about the internal server error.',
            }),
          }),
        },
      },
      description: 'An unexpected server error occurred.',
    },
  },
});
