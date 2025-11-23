import { OpenAPIHono } from '@hono/zod-openapi'
import { secureHeaders } from 'hono/secure-headers'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import {
  registerV1AuthRoutes,
  registerV1HealthRoutes,
  registerV1ImageRoutes,
  registerV1NotificationRoutes,
  registerV1UserRoutes,
  registerV1SeedRoutes,
} from './v1'
import { apiKeyAuth, combinedAuth } from './middleware/auth'
import { compress } from 'hono/compress'
import { paramLogger } from './middleware/paramLogger'
import { glog, type HonoContextEnv } from '@repo/core'

export type HonoApp = OpenAPIHono<HonoContextEnv>

export const createApp = (): HonoApp => {
  const app = new OpenAPIHono<HonoContextEnv>()

  app.use(logger())
  app.use('/*', compress())
  app.use('/*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-Custom-Header'],
    maxAge: 86400,
    credentials: true,
  }));
  app.use(secureHeaders())
  app.use(paramLogger())
  app.onError((err, c) => {
    glog.error('An error occurred:', err);
    return c.json(
      {
        success: false,
        message: err.message || 'An unexpected error occurred',
        error: err
      },
      500
    );
  });
  ///////////////////////////////////////////////////
  // v1
  ///////////////////////////////////////////////////
  const v1 = app.basePath('/v1')

  // Register unprotected routes here
  registerV1AuthRoutes(v1)

  v1.use('/openapi', apiKeyAuth());

  // Register protected routes below here after the auth middleware is applied
  v1.use(combinedAuth())

  v1.doc('/openapi', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'API v1',
      description: 'API v1 with OpenAPI documentation',
    },
  })

  registerV1HealthRoutes(v1)
  registerV1ImageRoutes(v1)
  registerV1UserRoutes(v1)
  registerV1NotificationRoutes(v1)
  registerV1SeedRoutes(v1)


  if (process.env.FUNCTIONS_EMULATOR) {
    registerV1SeedRoutes(v1)
  }


  ///////////////////////////////////////////////////
  // Root endpoint
  ///////////////////////////////////////////////////
  app.get('/', c =>
    c.json({
      name: 'API',
      status: 'ok',
      versions: [
        {
          version: 'v1',
        },
      ],
      message: 'Welcome to the API.',
    })
  )

  ///////////////////////////////////////////////////
  // Not Found Handler
  ///////////////////////////////////////////////////
  app.notFound(c =>
    c.json(
      {
        error: 'Not Found',
        message: `No route found for ${c.req.method} ${c.req.path}`,
        docs: '/',
      },
      404
    )
  )

  return app
}

