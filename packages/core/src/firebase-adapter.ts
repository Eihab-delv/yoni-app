import type { Request as FirebaseRequest } from 'firebase-functions/v2/https';
import type { Response as FirebaseResponse } from 'express';
import { OpenAPIHono } from '@hono/zod-openapi';
import type { Hono } from 'hono';
import type { FsMutableDocument } from '@typed-firestore/server';
import type { User } from '@repo/common';

export type FirebaseHandlerRequest = FirebaseRequest;
export type FirebaseHandlerResponse = FirebaseResponse;

const convertHeaders = (
  headers: Record<string, string | string[] | undefined>
): Record<string, string> => {
  const convertedHeaders: Record<string, string> = {};

  for (const [key, val] of Object.entries(headers)) {
    if (typeof val === 'string') {
      convertedHeaders[key] = val;
    } else if (Array.isArray(val)) {
      convertedHeaders[key] = val.join(',');
    }
  }

  return convertedHeaders;
};

const createRequestInit = (req: FirebaseHandlerRequest) => {
  const init: RequestInit = {
    method: req.method,
    headers: convertHeaders(req.headers),
  };

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    if (typeof req.body === 'string') {
      init.body = req.body;
    } else if (Buffer.isBuffer(req.body)) {
      init.body = req.body;
    } else {
      init.body = JSON.stringify(req.body);
    }
  }

  return init;
};

const buildRequestUrl = (req: FirebaseHandlerRequest): string => {
  const protocol = (req.headers['x-forwarded-proto'] ?? 'https') as string
  const host = req.headers.host ?? 'localhost';
  return `${protocol}://${host}${req.url}`;
};

export type HonoContextEnv = {
  Variables: {
    user: FsMutableDocument<User> | undefined
  }
}

export const createFirebaseAdapter = (app: OpenAPIHono<HonoContextEnv> | Hono<HonoContextEnv>) => {
  return async (
    req: FirebaseHandlerRequest,
    res: FirebaseHandlerResponse
  ) => {
    const url = buildRequestUrl(req);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const init: any = createRequestInit(req);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetchRequest: any = new Request(url, init);
    const fetchResponse = await app.fetch(fetchRequest);

    res.status(fetchResponse.status);

    fetchResponse.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });

    const buffer = Buffer.from(await fetchResponse.arrayBuffer());
    res.send(buffer);
  };
};


