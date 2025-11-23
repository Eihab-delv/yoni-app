import { type Context, type Next } from 'hono';
import { match } from 'path-to-regexp';
import { getDocument } from "@typed-firestore/server";
import { HTTPException } from 'hono/http-exception';
import { auth, glog, refs } from '@repo/core';
import { hasPermission } from '@repo/common';
import { protectedRoutes } from '~/v1';

/**
 * Extract API key from various sources (header, query param, or bearer token)
 */
const extractApiKey = (c: Context): string | undefined => {
  // Try X-API-Key header first
  let apiKey = c.req.header('X-API-Key');
  if (apiKey) {
    glog.debug('API key found in X-API-Key header');
    return apiKey;
  }

  // Try query parameter
  apiKey = c.req.query('api_key') ?? c.req.query('apikey');
  if (apiKey) {
    glog.debug('API key found in query parameter');
    return apiKey;
  }

  // Try Authorization header with Bearer (for API key, not JWT)
  const authHeader = c.req.header('Authorization');
  if (authHeader?.startsWith('Bearer ') && !authHeader.includes('.')) {
    // Simple heuristic: JWTs contain dots, API keys typically don't
    apiKey = authHeader.substring(7);
    glog.debug('API key found in Authorization Bearer header');
    return apiKey;
  }

  return undefined;
};

/**
 * API Key Authentication Middleware
 */
export const apiKeyAuth = () => {
  return async (c: Context, next: Next) => {
    const apiKey = extractApiKey(c);

    if (!apiKey) {
      glog.warn('API key authentication failed: No API key provided');
      throw new HTTPException(401, {
        message: 'API key required. Provide via X-API-Key header, Authorization Bearer header, or api_key query parameter'
      });
    }

    const validApiKey = process.env.API_KEY;
    if (!validApiKey) {
      glog.error('API key authentication failed: No API_KEY environment variable set');
      throw new HTTPException(500, { message: 'Server configuration error' });
    }

    if (apiKey !== validApiKey) {
      glog.warn('API key authentication failed: Invalid API key provided');
      throw new HTTPException(401, { message: 'Invalid API key' });
    }

    // Set user context for API key auth
    c.set('user', {
      uid: 'api-key-user',
      type: 'api-key'
    });

    glog.info('API key authentication successful');
    await next();
  };
};

export const convertCurlyToColon = (path: string): string => {
  return path.replace(/{(\w+)}/g, ':$1');
};

/**
 * Firebase Authentication Middleware
 */
export const firebaseAuth = () => {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');

    // Check if the Authorization header contains a Bearer token
    if (!authHeader?.startsWith('Bearer ')) {
      glog.warn('Firebase authentication failed: No Bearer token provided');
      throw new HTTPException(401, { message: 'Bearer token required' });
    }

    const token = authHeader.substring('Bearer '.length); // Remove 'Bearer ' prefix

    try {
      // Verify the Firebase ID token
      const decodedToken = await auth.verifyIdToken(token);

      // Fetch the user document from the database
      const user = await getDocument(refs.users, decodedToken.uid);
      glog.info('found user: ', user)

      // Attach the user object to the context for downstream handlers
      c.set('user', user);

      // Match the current route against the defined routes
      const processedRoutes = protectedRoutes.map((route) => ({
        ...route,
        path: convertCurlyToColon(route.path),
      }));
      glog.debug('processedRoutes', processedRoutes)

      const matchedRoute = processedRoutes.find((route) => {
        glog.debug('finding route', { pathCurrent: route.path, reqPath: c.req.path, methodCurrent: route.method, reqMethod: c.req.method })
        const matcher = match(route.path, { decode: decodeURIComponent });
        const result = matcher(c.req.path);
        return route.method.toLowerCase() === c.req.method.toLowerCase() && result !== false;
      });

      // If no route matches, return a 403 Forbidden error
      if (!matchedRoute) {
        glog.error('No route matches')
        throw new HTTPException(403, { message: 'Forbidden' });
      }

      // Check if the user has permission to access the matched route
      const allowed = hasPermission(user.data.role, matchedRoute.resource, matchedRoute.action);

      if (!allowed) {
        glog.error('User is not allowe to perform action on  resource', { action: matchedRoute.action, resource: matchedRoute.resource })
        throw new HTTPException(403, { message: 'Forbidden' });
      }

      glog.info(`Authorization successful for user: ${decodedToken.uid}`);
      glog.info(`Firebase authentication successful for user: ${decodedToken.uid}`);

      // Proceed to the next middleware or handler
      await next();
    } catch (error) {
      // Handle specific errors and log them
      if (error instanceof HTTPException) {
        // Re-throw HTTPExceptions as they are
        throw error;
      }

      // Log unexpected errors and return a generic 401 Unauthorized error
      glog.warn('Firebase authentication failed:', error);
      throw new HTTPException(401, { message: 'Invalid or expired token' });
    }
  };
};

/**
 * Combined Authentication Middleware - tries API key first, then Firebase
 */
export const combinedAuth = () => {
  return async (c: Context, next: Next) => {
    const apiKey = extractApiKey(c);
    const authHeader = c.req.header('Authorization');

    // Try API key authentication first (from any source)
    if (apiKey) {
      try {
        await apiKeyAuth()(c, async () => { });
        await next();
        return;
      } catch {
        // API key failed, continue to Firebase auth if we have a Bearer token that looks like JWT
        glog.debug('API key auth failed, trying Firebase auth');
      }
    }

    // Try Firebase authentication if we have a JWT-like Bearer token
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (token.includes('.') && token.split('.').length === 3) {
        try {
          await firebaseAuth()(c, async () => { });
          await next();
          return;
        } catch (error) {
          // Firebase auth also failed
          if (error instanceof Error)
            glog.warn('Both API key and Firebase authentication failed', error);
          else
            glog.warn('Both API key and Firebase authentication failed');
          throw new HTTPException(401, { message: 'Authentication failed' });
        }
      }
    }

    // No valid authentication method provided
    throw new HTTPException(401, {
      message: 'Authentication required. Provide either X-API-Key header, api_key query parameter, or Authorization Bearer token'
    });
  };
};

/**
 * Optional Authentication Middleware - allows unauthenticated requests but sets user if authenticated
 */
export const optionalAuth = () => {
  return async (c: Context, next: Next) => {
    try {

      await combinedAuth()(c, async () => { });
    } catch (error) {
      // Continue without authentication
      if (error instanceof Error) {
        glog.debug('Optional auth: No valid authentication provided, continuing without user context', error);
      } else {
        glog.debug('Optional auth: No valid authentication provided, continuing without user context');
      }
    }
    await next();
  };
};
