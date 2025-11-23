import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { UserSchema, type RouteActionMap } from '@repo/common';

export const usersRoutes: RouteActionMap[] = [
  {
    method: 'get',
    path: '/v1/users',
    action: 'read',
    resource: 'User',
  },
  {
    method: 'post',
    path: '/v1/users',
    action: 'create',
    resource: 'User',
  },
  {
    method: 'patch',
    path: '/v1/users',
    action: 'update',
    resource: 'User',
  },
]

export const CreateUserRequestSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
});

const UpdateUserRequestSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  contactNumber: z.string().optional(),
  photo: z.string().optional(),
  home_location: z.string().optional(),
});

export const getUsersRoute = createRoute({
  method: 'get',
  path: '/users',
  summary: 'Get user information',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: 'Returns user',
    },
    204: {
      description: 'No Content',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});

export const createUserRoute = createRoute({
  method: 'post',
  path: '/users',
  summary: 'Create a new user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserRequestSchema, // Use dedicated request schema
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema, // Changed from VenueSchema
        },
      },
      description: 'Returns created user',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});

export const updateUserRoute = createRoute({
  method: 'patch',
  path: '/users',
  summary: 'Update user information',
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateUserRequestSchema, // Use dedicated request schema
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema, // Changed from VenueSchema
        },
      },
      description: 'Returns updated user',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});

export const updateUserRoleRoute = createRoute({
  method: 'patch',
  path: '/users/{user_id}',
  summary: 'Update staff role (Admin only)',
  request: {
    params: z.object({
      user_id: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            role: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema, // Changed from VenueSchema
        },
      },
      description: 'Returns updated user',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});

export type GetUsersRouteType = typeof getUsersRoute;
export type CreateUserRouteType = typeof createUserRoute;
export type UpdateUserRouteType = typeof updateUserRoute;
export type UpdateUserRoleRouteType = typeof updateUserRoleRoute;
