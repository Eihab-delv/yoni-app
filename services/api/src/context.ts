import type { Context } from 'hono';
import type { RouteConfig } from '@hono/zod-openapi';
import type { z, ZodSchema } from 'zod';
import type { HonoContextEnv } from '@repo/core';

/**
 * Utility type to infer the complete Context type from a RouteConfig
 */
export type InferRouteContext<R extends RouteConfig> = Context<
  HonoContextEnv,
  R['path'],
  {
    out: {
      json: R['request'] extends {
        body?: {
          content?: {
            'application/json'?: {
              schema?: infer S;
            };
          };
        };
      }
      ? S extends ZodSchema
      ? z.infer<S>
      : never
      : never;
      param: R['request'] extends { params?: infer P }
      ? P extends ZodSchema
      ? z.infer<P>
      : never
      : never;
      query: R['request'] extends { query?: infer Q }
      ? Q extends ZodSchema
      ? z.infer<Q>
      : never
      : never;
      header: R['request'] extends { headers?: infer H }
      ? H extends ZodSchema
      ? z.infer<H>
      : never
      : never;
    };
    in: {
      json: R['responses'] extends {
        200?: {
          content?: {
            'application/json'?: {
              schema?: infer S;
            };
          };
        };
      }
      ? S extends ZodSchema
      ? z.output<S>
      : never
      : never;
    };
  }
>;
