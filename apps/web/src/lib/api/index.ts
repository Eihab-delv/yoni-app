import createFetchClient, { type Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";
import type { v1 } from "@repo/openapi-schema";
import { env } from "../env";
import { auth } from "../firebase";
import { logger } from "../logger";

export const fetchClient = createFetchClient<v1.paths>({
  baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
});

export const $api = createClient(fetchClient);

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    if (!auth) throw new Error("Missing auth");
    if (!auth.currentUser) throw new Error("No current user");
    const idToken = await auth.currentUser.getIdToken();
    logger.info("idToken retrieved", { idToken });
    request.headers.set("Authorization", `Bearer ${idToken}`);
    return request;
  },
  onError({ error }) {
    logger.error("Authentication middleware error", { error });
    return new Error("Oops, fetch failed", { cause: error });
  },
};

const loggingMiddleware: Middleware = {
  async onRequest({ request }) {
    logger.info("Request initiated", {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: request.body,
    });
    return request;
  },
  async onResponse({ response }) {
    logger.info("Response received", {
      url: response.url,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.clone().json().catch(() => null),
    });
    return response;
  },
  onError({ error }) {
    logger.error("Request failed", { error });
  },
};

fetchClient.use(authMiddleware);
fetchClient.use(loggingMiddleware);

