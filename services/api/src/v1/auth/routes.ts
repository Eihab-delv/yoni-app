import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { UserSchema } from '@repo/common';

export const SignupRequestSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
});

export const getSignupRoute = createRoute({
  method: 'post',
  path: '/auth/sign-up',
  summary: 'Sign up and create a user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: SignupRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(UserSchema),
        },
      },
      description: 'Returns new user',
    },
    500: {
      description: 'Internal Server Error',
    },
    502: {
      description: 'Bad Gateway',
    },
    504: {
      description: 'Gateway Timeout',
    },
  },
});
export type SignupRouteType = typeof getSignupRoute;
