import { type Context, type Next } from 'hono';
import { glog } from '@repo/core'; // Assuming glog is available from @repo/core

export const paramLogger = () => {
  return async (c: Context, next: Next) => {
    const routePath = c.req.path;
    const method = c.req.method;

    // Log URL parameters
    const params = c.req.param();
    if (Object.keys(params).length > 0) {
      glog.info(`[${method}] ${routePath} - URL Parameters:`, params);
    }

    // Log query parameters
    const query = c.req.query();
    if (Object.keys(query).length > 0) {
      glog.info(`[${method}] ${routePath} - Query Parameters:`, query);
    }

    // Log request body (be cautious with sensitive data and large payloads)
    // You might want to stringify or pick specific keys from the body
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      try {
        const body = await c.req.json(); // Tries to parse as JSON
        if (Object.keys(body).length > 0) {
          glog.info(`[${method}] ${routePath} - Request Body:`, body);
        }
      } catch (error) {
        // If not JSON, try text or form data if needed
        // For simplicity, we'll just log if JSON parsing fails
        glog.debug(`[${method}] ${routePath} - Could not parse request body as JSON or body is empty.`, error);
      }
    }

    await next();
  };
};
